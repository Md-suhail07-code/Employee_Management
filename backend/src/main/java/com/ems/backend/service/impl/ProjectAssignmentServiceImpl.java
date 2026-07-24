package com.ems.backend.service.impl;

import com.ems.backend.dto.request.AssignmentRequestDTO;
import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.dto.response.AssignmentResponseDTO;
import com.ems.backend.dto.response.EmployeeSummaryDTO;
import com.ems.backend.dto.response.ProjectResponse;
import com.ems.backend.dto.response.ProjectSummaryDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Project;
import com.ems.backend.exception.DuplicateResourceException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.mapper.ProjectMapper;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.ProjectRepository;
import com.ems.backend.service.ProjectAssignmentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectAssignmentServiceImpl implements ProjectAssignmentService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectMapper projectMapper;

    public ProjectAssignmentServiceImpl(
            ProjectRepository projectRepository,
            EmployeeRepository employeeRepository,
            ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    @Transactional
    public ApiResponse<String> assignEmployeeToProject(Long projectId, Long employeeId) {
        Project project = getProjectOrThrow(projectId);
        Employee employee = getEmployeeOrThrow(employeeId);

        if (project.getEmployees() == null) {
            project.setEmployees(new ArrayList<>());
        }

        boolean alreadyAssigned = project.getEmployees().stream()
                .anyMatch(existing -> existing.getId().equals(employeeId));

        if (alreadyAssigned) {
            throw new DuplicateResourceException("Employee already assigned to project");
        }

        project.getEmployees().add(employee);
        projectRepository.save(project);

        return ApiResponse.success("Employee assigned successfully", "Employee assigned successfully");
    }

    @Override
    @Transactional
    public ApiResponse<Void> removeEmployeeFromProject(Long projectId, Long employeeId) {
        Project project = getProjectOrThrow(projectId);
        getEmployeeOrThrow(employeeId);

        if (project.getEmployees() == null || project.getEmployees().stream()
                .noneMatch(existing -> existing.getId().equals(employeeId))) {
            throw new ResourceNotFoundException("Employee is not assigned to the project");
        }

        project.getEmployees().removeIf(existing -> existing.getId().equals(employeeId));
        projectRepository.save(project);

        return ApiResponse.success("Employee removed successfully", null);
    }

    @Override
    @Transactional
    public List<EmployeeSummaryDTO> getEmployeesOfProject(Long projectId) {
        Project project = getProjectOrThrow(projectId);
        if (project.getEmployees() == null) {
            return List.of();
        }

        return project.getEmployees().stream()
                .map(this::mapToEmployeeSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ProjectSummaryDTO> getProjectsOfEmployee(Long employeeId) {
        Employee employee = getEmployeeOrThrow(employeeId);

        if (employee.getProjects() == null) {
            return List.of();
        }

        return employee.getProjects().stream()
                .map(this::mapToProjectSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiResponse<ProjectResponse> replaceEmployeesOfProject(Long projectId, AssignmentRequestDTO request) {
        Project project = getProjectOrThrow(projectId);
        List<Long> employeeIds = request.getEmployeeIds();
        validateIds(employeeIds);

        List<Employee> newEmployees = employeeRepository.findAllById(employeeIds);
        if (newEmployees.size() != new HashSet<>(employeeIds).size()) {
            throw new ResourceNotFoundException("One or more employee IDs are invalid");
        }

        project.setEmployees(newEmployees);
        Project updatedProject = projectRepository.save(project);

        return ApiResponse.success("Project employees replaced successfully", projectMapper.toResponse(updatedProject));
    }

    @Override
    @Transactional
    public ApiResponse<AssignmentResponseDTO> bulkAssignEmployees(Long projectId, AssignmentRequestDTO request) {
        Project project = getProjectOrThrow(projectId);
        List<Long> employeeIds = request.getEmployeeIds();
        validateIds(employeeIds);

        if (project.getEmployees() == null) {
            project.setEmployees(new ArrayList<>());
        }

        Set<Long> existingEmployeeIds = project.getEmployees().stream()
                .map(Employee::getId)
                .collect(Collectors.toSet());

        List<Employee> employees = employeeRepository.findAllById(employeeIds);
        int assigned = 0;
        int skipped = 0;

        for (Employee employee : employees) {
            if (existingEmployeeIds.contains(employee.getId())) {
                skipped++;
            } else {
                project.getEmployees().add(employee);
                existingEmployeeIds.add(employee.getId());
                assigned++;
            }
        }

        projectRepository.save(project);
        return ApiResponse.success("Bulk assignment completed", new AssignmentResponseDTO(assigned, skipped));
    }

    @Override
    @Transactional
    public List<EmployeeSummaryDTO> getUnassignedEmployees(Long projectId) {
        Project project = getProjectOrThrow(projectId);

        List<Employee> assignedEmployees = project.getEmployees() == null ? List.of() : project.getEmployees();
        Set<Long> assignedIds = assignedEmployees.stream()
                .map(Employee::getId)
                .collect(Collectors.toSet());

        return employeeRepository.findAll().stream()
                .filter(employee -> !assignedIds.contains(employee.getId()))
                .map(this::mapToEmployeeSummary)
                .collect(Collectors.toList());
    }

    private Project getProjectOrThrow(Long projectId) {
        if (projectId == null || projectId <= 0) {
            throw new IllegalArgumentException("Project ID must be a positive number");
        }
        return projectRepository.findByIdWithEmployees(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    private Employee getEmployeeOrThrow(Long employeeId) {
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Employee ID must be a positive number");
        }
        return employeeRepository.findByIdWithProjects(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
    }

    private void validateIds(List<Long> employeeIds) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new IllegalArgumentException("employeeIds must not be empty");
        }

        if (employeeIds.stream().anyMatch(id -> id == null || id <= 0)) {
            throw new IllegalArgumentException("employeeIds must contain positive numeric values");
        }
    }

    private EmployeeSummaryDTO mapToEmployeeSummary(Employee employee) {
        return new EmployeeSummaryDTO(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getUser().getName(),
                employee.getDepartment(),
                employee.getDesignation());
    }

    private ProjectSummaryDTO mapToProjectSummary(Project project) {
        return new ProjectSummaryDTO(
                project.getId(),
                project.getProjectCode(),
                project.getProjectName(),
                null,
                project.getStatus(),
                project.getStartDate(),
                project.getEndDate());
    }
}
