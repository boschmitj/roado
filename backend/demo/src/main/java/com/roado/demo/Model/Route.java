package com.roado.demo.Model;

import java.util.ArrayList;
import java.util.List;


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
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Entity
@Builder
@Table(name = "routes")
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
    @Column(name = "geo_data", columnDefinition = "TEXT", nullable = false) 
    private String geoData;

    @Column(name = "distance_m")
    private Long distanceM;

    @Column(name = "elevation_profile")
    private String elevationProfile;

    @Column(name = "duration_s")
    private Long durationS;

    @OneToMany(mappedBy = "route")
    private List<Activity> activities = new ArrayList<>();

    

}