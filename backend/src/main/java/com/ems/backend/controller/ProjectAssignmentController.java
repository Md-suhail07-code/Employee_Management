package com.ems.backend.controller;

import com.ems.backend.dto.request.AssignmentRequestDTO;
import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.dto.response.AssignmentResponseDTO;
import com.ems.backend.dto.response.EmployeeSummaryDTO;
import com.ems.backend.dto.response.ProjectResponse;
import com.ems.backend.dto.response.ProjectSummaryDTO;
import com.ems.backend.service.ProjectAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjectAssignmentController {

    private final ProjectAssignmentService projectAssignmentService;

    public ProjectAssignmentController(ProjectAssignmentService projectAssignmentService) {
        this.projectAssignmentService = projectAssignmentService;
    }

    @PostMapping("/projects/{projectId}/employees/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> assignEmployeeToProject(
            @PathVariable Long projectId,
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(projectAssignmentService.assignEmployeeToProject(projectId, employeeId));
    }

    @DeleteMapping("/projects/{projectId}/employees/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeEmployeeFromProject(
            @PathVariable Long projectId,
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(projectAssignmentService.removeEmployeeFromProject(projectId, employeeId));
    }

    @GetMapping("/projects/{projectId}/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<EmployeeSummaryDTO>> getEmployeesOfProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectAssignmentService.getEmployeesOfProject(projectId));
    }

    @GetMapping("/employees/{employeeId}/projects")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<ProjectSummaryDTO>> getProjectsOfEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(projectAssignmentService.getProjectsOfEmployee(employeeId));
    }

    @PutMapping("/projects/{projectId}/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProjectResponse>> replaceEmployeesOfProject(
            @PathVariable Long projectId,
            @Valid @RequestBody AssignmentRequestDTO request) {
        return ResponseEntity.ok(projectAssignmentService.replaceEmployeesOfProject(projectId, request));
    }

    @PostMapping("/projects/{projectId}/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentResponseDTO>> bulkAssignEmployees(
            @PathVariable Long projectId,
            @Valid @RequestBody AssignmentRequestDTO request) {
        return ResponseEntity.ok(projectAssignmentService.bulkAssignEmployees(projectId, request));
    }

    @GetMapping("/projects/{projectId}/unassigned-employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<EmployeeSummaryDTO>> getUnassignedEmployees(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectAssignmentService.getUnassignedEmployees(projectId));
    }
}
