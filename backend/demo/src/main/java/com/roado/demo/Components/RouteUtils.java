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
import com.roado.demo.DTOs.ElevationDistanceDTO;
import com.roado.demo.DTOs.PositionDTO;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Repository.RouteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
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

    public LineString geojsonToGeometry(JsonNode geojson, boolean is3d) throws ParseException {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate[] coordinateArray = coordsFromOnlyGeometryGeoJson(geojson, is3d);
        return new LineString(new CoordinateArraySequence(coordinateArray), geometryFactory);
    }

    

    private Coordinate[] coordsFromOnlyGeometryGeoJson(JsonNode geojson, boolean is3d) throws ParseException {
        Coordinate[] coordinateArray;
        if (geojson != null && geojson.isArray()) {
            coordinateArray = new Coordinate[geojson.size()];
            for (int i = 0; i < geojson.size(); i++) {
                JsonNode coord = geojson.get(i);

                double lon = coord.get(0).asDouble();
                double lat = coord.get(1).asDouble();
                if (is3d) {
                    double z = coord.get(2).asDouble();
                    coordinateArray[i] = new Coordinate(lon, lat, z);
                } else {
                    coordinateArray[i] = new Coordinate(lon, lat);
                }
            }
            return coordinateArray;
        } else {
            throw new ParseException("geojson payload is not an array");
        }
    }

    public Coordinate[] coordsFromWholeGeoJson(JsonNode geojson) throws ParseException {
        Coordinate[] coordinateArray;
        String geoJsonString = geojson.toString();

        GeoJsonReader geoJsonReader = new GeoJsonReader();
        Geometry geometry = geoJsonReader.read(geoJsonString);
        coordinateArray = geometry.getCoordinates();
        return coordinateArray;
    }

    public String geometryToString(LineString route) {
        GeoJsonWriter geoJsonWriter = new GeoJsonWriter();
        return geoJsonWriter.write(route);
    }

    public double[][] toArray(List<PositionDTO> positions) {
        double[][] coordinates = new double[positions.size()][2];
        for (int i = 0; i < positions.size(); i++) {
            coordinates[i][0] = positions.get(i).getLon();
            coordinates[i][1] = positions.get(i).getLat();
        }
        return coordinates;
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

    public double[][] getCoordinateArray(Coordinate[] coordinates) {
        double[][] coords = new double[coordinates.length][2];
        for (int i = 0; i< coordinates.length; i++) {
            coords[i][0] = coordinates[i].x;
            coords[i][1] = coordinates[i].y;
        }
        return coords;
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

    public List<PositionDTO> addAltitude(List<PositionDTO> rawTrack, LineString enrichedLineString) {
        List<PositionDTO> rawTrack3D = new ArrayList<>();
        if (rawTrack.stream().anyMatch(pos -> pos.getAltitude() == null)) {
            Double[] elevationProfile = extractElevationProfile(enrichedLineString);
            for (int i = 0; i < rawTrack.size(); i++) {
                rawTrack3D.add(new PositionDTO(rawTrack.get(i).getLon(), rawTrack.get(i).getLat(), elevationProfile[i]));
            }

            return rawTrack3D;
        } else {
            return rawTrack;
        }
    }

    public Double[] computeCenterOfGeometry(LineString geometry) {
        Point centroid = geometry.getCentroid();
        return new Double[]{centroid.getX(), centroid.getY()};
    }

    public List<ElevationDistanceDTO> computeElevationDistance(JsonNode geojson) throws ParseException  { 
        List<ElevationDistanceDTO> elevationDistances = new ArrayList<>();
        Coordinate[] coords = coordsFromWholeGeoJson(geojson);
        if (Double.isNaN(coords[0].getZ())) throw new ParseException("geojson payload is not 3D");
        Double distance = 0.0;
        elevationDistances.add(new ElevationDistanceDTO(coords[0].getZ(), 0));
        for (int i = 1; i < coords.length; i++) {
            distance += haversine(coords[i-1].getY(), coords[i-1].getX(), coords[i].getY(), coords[i].getX());
            elevationDistances.add(new ElevationDistanceDTO(coords[i].getZ(), distance));
        }

        return elevationDistances;
    }


    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Radius of the earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters
        return distance;
    }

}
