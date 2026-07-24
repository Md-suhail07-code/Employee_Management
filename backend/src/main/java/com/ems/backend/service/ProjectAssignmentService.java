package com.ems.backend.service;

import com.ems.backend.dto.request.AssignmentRequestDTO;
import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.dto.response.AssignmentResponseDTO;
import com.ems.backend.dto.response.EmployeeSummaryDTO;
import com.ems.backend.dto.response.ProjectResponse;
import com.ems.backend.dto.response.ProjectSummaryDTO;

import java.util.List;

public interface ProjectAssignmentService {

    ApiResponse<String> assignEmployeeToProject(Long projectId, Long employeeId);

    ApiResponse<Void> removeEmployeeFromProject(Long projectId, Long employeeId);

    List<EmployeeSummaryDTO> getEmployeesOfProject(Long projectId);

    List<ProjectSummaryDTO> getProjectsOfEmployee(Long employeeId);

    ApiResponse<ProjectResponse> replaceEmployeesOfProject(Long projectId, AssignmentRequestDTO request);

    ApiResponse<AssignmentResponseDTO> bulkAssignEmployees(Long projectId, AssignmentRequestDTO request);

    List<EmployeeSummaryDTO> getUnassignedEmployees(Long projectId);
}
