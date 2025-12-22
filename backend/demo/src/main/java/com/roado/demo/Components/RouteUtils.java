package com.roado.demo.Components;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.geom.impl.CoordinateArraySequence;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.locationtech.jts.io.geojson.GeoJsonWriter;
import org.locationtech.jts.simplify.DouglasPeuckerSimplifier;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Repository.RouteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RouteUtils {

    

    private final RouteRepository routeRepository;

    private static final Double DISTANCE_TOLERANCE = 0.8;
    private static final Double DISTANCE_PERCENTILE90 = 0.9;
    private static final double LENGTH_MISMATCH_VALUE = 0.05;
    private static final Double COVERAGE_PERCENTAGE = 0.85;

    public boolean usedOriginalRoute(Long routeId, LineString rawTrack) throws ParseException {
        RoutePlan route = routeRepository.findById(routeId).orElse(null);
        if (route == null) return false;
        LineString originalRouteLine = route.getTrack().getGeometry();
        
        // null -> default values
        int score = 0;
        if (corridorCoverageOk(corridorCoverage(originalRouteLine, rawTrack), null)) {
            score++;
        }

        if (lengthMismatchOk(lengthMismatch(originalRouteLine, rawTrack), null)) {
            score++;
        }

        if (score < 2) {
            if (percentileOk(percentile(distances(originalRouteLine, rawTrack), null))) {
                score++;
            }
        }

        return score >= 2;
    }

    private boolean percentileOk(double p90Distance) {
        return p90Distance <= 40;
    }

    private List<Double> distances(LineString originalRouteLine, LineString recordedRouteLine) {
        List<Double> distances = new ArrayList<>();

        for (Coordinate c : recordedRouteLine.getCoordinates()) {
            Point p = recordedRouteLine.getFactory().createPoint(c);
            distances.add(p.distance(originalRouteLine));
        }

        return distances;
    }

    private double percentile(List<Double> distances, Double percentile) {
        if (percentile == null) {
            percentile = DISTANCE_PERCENTILE90;
        }
        Collections.sort(distances);
        int index = (int) Math.ceil(percentile * distances.size()) - 1;
        return distances.get(index);
    }

    private boolean lengthMismatchOk(double lengthMismatch, Double mismatchValue) {
        if (mismatchValue == null) mismatchValue = LENGTH_MISMATCH_VALUE;
        return lengthMismatch <= mismatchValue;
    }

    private double lengthMismatch(LineString originalRouteLine, LineString recordedRouteLine) {
        double origLength = originalRouteLine.getLength();
        double recLength = recordedRouteLine.getLength();

        return Math.abs(origLength - recLength) / Math.max(origLength, recLength);
    }

    public LineString geojsonToGeometry(JsonNode geojson) throws ParseException {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        GeoJsonReader geoJsonReader = new GeoJsonReader(geometryFactory);
        Geometry geometry = geoJsonReader.read(geojson.toString());

        return new LineString(new CoordinateArraySequence(geometry.getCoordinates()), geometryFactory);
    }

    

    public String geometryToString(LineString route) {
        GeoJsonWriter geoJsonWriter = new GeoJsonWriter();
        return geoJsonWriter.write(route);
    }

    public LineString getRouteLine(double[][] coords) throws ParseException {
        Coordinate[] coordinateArray = getCoordinateArray(coords);
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        return new LineString(new CoordinateArraySequence(coordinateArray), geometryFactory);
    }

    public LineString getRouteLine(Coordinate[] coords) throws ParseException {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        return new LineString(new CoordinateArraySequence(coords), geometryFactory);
    }

    private Coordinate[] getCoordinateArray(double[][] coords) {
        Coordinate[] coordinateArray = new Coordinate[coords.length];
        int dimension = coords[0].length;
        for (int i = 0; i < coords.length; i++) {
            if (dimension < 3) coordinateArray[i] = new Coordinate(coords[i][0], coords[i][1]);
            else coordinateArray[i] = new Coordinate(coords[i][0], coords[i][1], coords[i][2]);
        }
        return coordinateArray;
    }



    private boolean corridorCoverageOk(double coverage, Double coveragePercentage) {
        if (coveragePercentage == null) coveragePercentage = COVERAGE_PERCENTAGE;
        return coverage >= coveragePercentage;
    }

    private double corridorCoverage(LineString route, LineString activity) {
        Geometry routeBuffer = route.buffer(50);
        Geometry inside = activity.intersection(routeBuffer);

        return inside.getLength() / activity.getLength();
    }

    public Coordinate[] simplify(Coordinate[] coords) throws ParseException {
        Geometry simplified = DouglasPeuckerSimplifier.simplify(getRouteLine(coords), DISTANCE_TOLERANCE);
        return simplified.getCoordinates();
    }

    public LineString simplify(LineString route) throws ParseException {
        Geometry geometrySimplified = DouglasPeuckerSimplifier.simplify(route, DISTANCE_TOLERANCE);
        Coordinate[] coordinates = geometrySimplified.getCoordinates();
        return getRouteLine(coordinates);
    }

    public Double[] extractElevationProfile(LineString geometry) {
        Coordinate[] coords = geometry.getCoordinates(); 
        Double[] elevationProfile = new Double[coords.length];
        for (int i = 0; i < coords.length; i++) {
            elevationProfile[i] = coords[i].z;
        }
        return elevationProfile;
    }

    



    
}
