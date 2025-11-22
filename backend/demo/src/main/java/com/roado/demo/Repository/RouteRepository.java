package com.roado.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roado.demo.Model.Route;
import com.roado.demo.Model.User;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    List<Route> findAllByCreatedBy(User createdBy);

}
