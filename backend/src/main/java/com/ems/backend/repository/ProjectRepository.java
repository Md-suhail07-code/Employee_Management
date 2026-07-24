package com.ems.backend.repository;

import com.ems.backend.entity.Project;
import com.ems.backend.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    boolean existsByProjectCode(String projectCode);

    Optional<Project> findByProjectCode(String projectCode);

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByProjectNameContainingIgnoreCase(String projectName);
}