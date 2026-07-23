package com.ems.backend.repository;

import com.ems.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {

    @Query("SELECT MAX(e.id) FROM Employee e")
    Optional<Long> findMaxId();
}