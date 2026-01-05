package com.roado.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Model.User;

@Repository
public interface RouteRepository extends JpaRepository<RoutePlan, Long> {
    
    List<RoutePlan> findAllByCreatedBy(User createdBy);


}
