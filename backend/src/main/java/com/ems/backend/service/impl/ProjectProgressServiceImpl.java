package com.ems.backend.service.impl;

import com.ems.backend.entity.Project;
import com.ems.backend.entity.ProjectStatus;
import com.ems.backend.entity.TaskStatus;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.ProjectRepository;
import com.ems.backend.repository.TaskRepository;
import com.ems.backend.service.ProjectProgressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectProgressServiceImpl implements ProjectProgressService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public ProjectProgressServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional
    public void updateProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        long totalTasks = taskRepository.countByProjectId(projectId);
        int progress;

        if (totalTasks == 0) {
            progress = 0;
        } else {
            long completedTasks = taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.COMPLETED);
            progress = (int) ((completedTasks * 100) / totalTasks);
        }

        project.setProgress(progress);

        if (progress == 100) {
            project.setStatus(ProjectStatus.COMPLETED);
        } else if (project.getStatus() == ProjectStatus.COMPLETED) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        }

        projectRepository.save(project);
    }
}
