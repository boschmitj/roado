package com.roado.demo.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class TimedStatsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long time;
    private Double lon;
    private Double lat;
    private Double elevation;
    private Double speed;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    public TimedStatsEntity(Long time, Double elevation, Double speed) {
        this.time = time;
        this.elevation = elevation;
        this.speed = speed;
    }

    public TimedStatsEntity(Long Time, Double lon, Double lat, Double elevation, Double speed) {
        this.time = Time;
        this.lon = lon;
        this.lat = lat;
        this.elevation = elevation;
        this.speed = speed;
    }

}
