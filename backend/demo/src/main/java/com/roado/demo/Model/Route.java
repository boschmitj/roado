package com.roado.demo.Model;

import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.LineString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Entity
@Builder
@Table(name = "routes")
@RequiredArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "route_id")
    private Long routeId;


    // the creator of the route, one user has created many routes 
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User createdBy;

    @Column(name = "name", nullable = false)
    private String name;


    // have to use a appropriate data type or decode the String
    // mby JSON for storing each coordinate point of the polyline
    @Column(columnDefinition = "geometry(LineString, 4326)", nullable = false) 
    private LineString geoData;

    @Column(name = "distance_m")
    private Long distanceM;

    @Column(name = "elevation_profile")
    private String elevationProfile;

    @Column(name = "elevation_gain")
    private Long elevationGain;

    @Column(name = "duration_s")
    private Long durationS;

    @Column(name = "svg_preview", columnDefinition = "TEXT")
    private String svgPreview;

    @OneToMany(mappedBy = "route")
    private List<Activity> activities = new ArrayList<>();

    

}