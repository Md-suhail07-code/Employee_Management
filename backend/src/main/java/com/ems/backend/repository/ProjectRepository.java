package com.ems.backend.repository;

import com.ems.backend.entity.Project;
import com.ems.backend.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    boolean existsByProjectCode(String projectCode);

    Optional<Project> findByProjectCode(String projectCode);

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByProjectNameContainingIgnoreCase(String projectName);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.employees e LEFT JOIN FETCH e.user u WHERE p.id = :projectId")
    Optional<Project> findByIdWithEmployees(@Param("projectId") Long projectId);

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u LEFT JOIN FETCH e.projects p WHERE p.id = :projectId")
    List<com.ems.backend.entity.Employee> findEmployeesByProjectId(@Param("projectId") Long projectId);
}