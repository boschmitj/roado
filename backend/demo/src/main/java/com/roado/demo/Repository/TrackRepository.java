package com.roado.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roado.demo.Model.Track;

public interface TrackRepository extends JpaRepository<Track, Long>{
    
}
