package com.ems.backend.service;

import com.ems.backend.dto.request.ProjectRequest;
import com.ems.backend.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest request);

    ProjectResponse updateProject(Long id, ProjectRequest request);

    void deleteProject(Long id);

    ProjectResponse getProjectById(Long id);

    List<ProjectResponse> getAllProjects();

    List<ProjectResponse> searchProjects(String keyword);
}
