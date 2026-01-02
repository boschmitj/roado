package com.roado.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roado.demo.Model.ActivityStats;

public interface ActivityStatsRepository extends JpaRepository<ActivityStats, Long>{
    
}
