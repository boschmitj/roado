package com.roado.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roado.demo.Model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    

}
