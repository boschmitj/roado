package com.roado.demo.Model;

import org.locationtech.jts.geom.LineString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tracks")
@RequiredArgsConstructor
@Getter
@Setter
public class Track {

    @Id
    @GeneratedValue
    private Long id;

    // should be the simplified geometry (with Douglas-Peucker)
    @Column(columnDefinition = "geometry(LineStringZ, 4326)", nullable = false)
    private LineString geometry;

    @Column(columnDefinition = "geometry(LineStringZ, 4326)", nullable = true)
    private LineString geometrySimplified;

}
