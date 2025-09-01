package com.roado.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roado.demo.Model.User;

public interface UserRepository extends JpaRepository<User, Long>{

}
