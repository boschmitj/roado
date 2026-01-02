package com.roado.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roado.demo.Model.TimedStatsEntity;

@Repository
public interface TimedStatsRepository extends JpaRepository<TimedStatsEntity, Long> {

}
