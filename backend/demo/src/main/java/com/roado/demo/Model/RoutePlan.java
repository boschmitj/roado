package com.roado.demo.Model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonManagedReference;


@Getter
@Setter
@Entity
@Builder
@Table(name = "route_plans")
@RequiredArgsConstructor
@AllArgsConstructor
public class RoutePlan {

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
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb", nullable = false) 
    private JsonNode geoJson;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Track track;

    @Column(name = "distance_m")
    private Long distanceM;

    @Column(name = "elevation_profile")
    private Double[] elevationProfile;

    @Column(name = "elevation_gain")
    private Long elevationGain;

    @Column(name = "duration_s")
    private Long durationS;

    @Column(name = "svg_preview", columnDefinition = "TEXT")
    private String svgPreview;

    @OneToMany(mappedBy = "route")
    @JsonManagedReference
    private List<Activity> activities = new ArrayList<>();

    

}