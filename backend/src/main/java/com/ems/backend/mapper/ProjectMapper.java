package com.ems.backend.mapper;

import com.ems.backend.dto.request.ProjectRequest;
import com.ems.backend.dto.response.ProjectResponse;
import com.ems.backend.entity.Project;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ProjectMapper {

    public Project toEntity(ProjectRequest request) {
        Project project = new Project();
        project.setProjectCode(normalizeText(request.getProjectCode()));
        project.setProjectName(normalizeText(request.getProjectName()));
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setPriority(request.getPriority());
        project.setProgress(0);
        return project;
    }

    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getProjectCode(),
                project.getProjectName(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getStatus(),
                project.getPriority(),
                project.getProgress(),
                Optional.ofNullable(project.getEmployees()).map(java.util.List::size).orElse(0)
        );
    }

    public void updateEntity(Project project, ProjectRequest request) {
        project.setProjectCode(normalizeText(request.getProjectCode()));
        project.setProjectName(normalizeText(request.getProjectName()));
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setPriority(request.getPriority());
    }

    private String normalizeText(String value) {
        return value == null ? null : value.trim();
    }
}
