package com.ems.backend.service.impl;

import com.ems.backend.dto.request.ProjectRequest;
import com.ems.backend.dto.response.ProjectResponse;
import com.ems.backend.entity.Project;
import com.ems.backend.exception.DuplicateResourceException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.mapper.ProjectMapper;
import com.ems.backend.repository.ProjectRepository;
import com.ems.backend.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        String normalizedCode = normalizeCode(request.getProjectCode());

        if (projectRepository.existsByProjectCode(normalizedCode)) {
            throw new DuplicateResourceException("Project code already exists: " + normalizedCode);
        }

        Project project = projectMapper.toEntity(request);
        project.setProjectCode(normalizedCode);
        project.setProjectName(normalizeName(request.getProjectName()));

        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project existingProject = findProjectById(id);
        String normalizedCode = normalizeCode(request.getProjectCode());

        if (!Objects.equals(existingProject.getProjectCode(), normalizedCode)
                && projectRepository.existsByProjectCode(normalizedCode)) {
            throw new DuplicateResourceException("Project code already exists: " + normalizedCode);
        }

        projectMapper.updateEntity(existingProject, request);
        existingProject.setProjectCode(normalizedCode);
        existingProject.setProjectName(normalizeName(request.getProjectName()));

        Project updatedProject = projectRepository.save(existingProject);
        return projectMapper.toResponse(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = findProjectById(id);
        projectRepository.delete(project);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        return projectMapper.toResponse(findProjectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> searchProjects(String keyword) {
        String trimmedKeyword = keyword == null ? "" : keyword.trim();

        if (trimmedKeyword.isEmpty()) {
            return getAllProjects();
        }

        return projectRepository.findByProjectNameContainingIgnoreCase(trimmedKeyword).stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private String normalizeCode(String projectCode) {
        return projectCode == null ? null : projectCode.trim().toUpperCase();
    }

    private String normalizeName(String projectName) {
        return projectName == null ? null : projectName.trim();
    }
}
