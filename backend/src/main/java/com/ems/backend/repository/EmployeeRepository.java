package com.ems.backend.repository;

import com.ems.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT MAX(e.id) FROM Employee e")
    Optional<Long> findMaxId();

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u LEFT JOIN FETCH e.projects p WHERE e.id = :employeeId")
    Optional<Employee> findByIdWithProjects(@Param("employeeId") Long employeeId);

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u LEFT JOIN FETCH e.projects p WHERE e.id IN :employeeIds")
    List<Employee> findAllByIdWithProjects(@Param("employeeIds") List<Long> employeeIds);

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u WHERE e.id IN :employeeIds")
    List<Employee> findAllByIdWithUser(@Param("employeeIds") List<Long> employeeIds);
}