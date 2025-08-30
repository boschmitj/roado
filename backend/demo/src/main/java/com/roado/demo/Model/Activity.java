package com.roado.demo.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long id;
    
    @Column(name = "name")
    private String name;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // can be optional, if no route is present. 
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "activity_type")
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;

    @Column(name = "distance_m")
    private Double distanceM;

    @Column(name = "duration_s")
    private Long durationS;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "elevation_gain")
    private Double elevationGain;

    @Column(name = "avg_speed")
    private Double avgSpeed;


    // cool feature idea: analyse speed in different segments
    // e.g. km 25-38 avg speed was 34 km/h, km 38-50 avg speed was 40 km/h
    @Column(name = "max_speed")
    private Double maxSpeed;





}
