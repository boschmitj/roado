package com.roado.demo.Model;

import java.time.ZonedDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "activity_stats")
public class ActivityStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "distance_m")
    private Double distanceM;

    @Column(name = "duration_s")
    private Long durationS;

    @Column(name = "started_at")
    private ZonedDateTime startedAt;

    @Column(name = "ended_at")
    private ZonedDateTime endedAt;

    @Column(name = "elevation_gain")
    private Double elevationGain;

    @Column(name = "avg_speed")
    private Double avgSpeed;
    
}
