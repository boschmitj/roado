package com.roado.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roado.demo.Model.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

}
