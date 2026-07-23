package com.ems.backend.repository;

import com.ems.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {
}