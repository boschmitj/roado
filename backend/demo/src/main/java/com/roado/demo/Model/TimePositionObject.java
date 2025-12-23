package com.roado.demo.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TimePositionObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long time;
    private Double[] position;
}
