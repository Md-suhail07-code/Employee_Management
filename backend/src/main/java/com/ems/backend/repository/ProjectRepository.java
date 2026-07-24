package com.ems.backend.repository;

import com.ems.backend.dto.response.dashboard.RecentProjectDTO;
import com.ems.backend.entity.Project;
import com.ems.backend.entity.ProjectStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = :status")
    long countByStatus(@Param("status") ProjectStatus status);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate BETWEEN :today AND :deadline")
    long countProjectsEndingWithinDays(@Param("today") LocalDate today,
                                       @Param("deadline") LocalDate deadline);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.startDate BETWEEN :startDate AND :endDate")
    long countByStartDateBetween(@Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT new com.ems.backend.dto.response.dashboard.RecentProjectDTO(" +
            "p.id, p.projectCode, p.projectName, p.projectName, p.status, p.progress, p.startDate, p.endDate) " +
            "FROM Project p ORDER BY p.startDate DESC, p.id DESC")
    List<RecentProjectDTO> findRecentProjects(Pageable pageable);
}