package com.ems.backend.repository;

import com.ems.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository
        extends JpaRepository<Task, Long> {
}