package com.roado.demo.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Double elevation;
    private Double speed;

    public TimedStatsEntity(Long time, Double elevation, Double speed) {
        this.time = time;
        this.elevation = elevation;
        this.speed = speed;
    }

}
