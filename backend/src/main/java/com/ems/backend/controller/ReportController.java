package com.ems.backend.controller;

import com.ems.backend.dto.employee.EmployeeResponse;
import com.ems.backend.dto.response.ProjectResponse;
import com.ems.backend.dto.response.TaskResponse;
import com.ems.backend.dto.response.dashboard.DashboardResponse;
import com.ems.backend.dto.response.report.SummaryReportDTO;
import com.ems.backend.service.DashboardService;
import com.ems.backend.service.EmployeeService;
import com.ems.backend.service.ProjectService;
import com.ems.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final EmployeeService employeeService;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final DashboardService dashboardService;

    public ReportController(EmployeeService employeeService,
                           ProjectService projectService,
                           TaskService taskService,
                           DashboardService dashboardService) {
        this.employeeService = employeeService;
        this.projectService = projectService;
        this.taskService = taskService;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeResponse>> getEmployeeReport() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectResponse>> getProjectReport() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getTaskReport() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryReportDTO> getSummaryReport() {
        DashboardResponse dashboard = dashboardService.getDashboard();
        SummaryReportDTO summary = new SummaryReportDTO(
                dashboard.getEmployeeStatistics().getTotalEmployees(),
                dashboard.getProjectStatistics().getTotalProjects(),
                dashboard.getTaskStatistics().getTotalTasks(),
                dashboard.getTaskStatistics().getCompletionPercentage()
        );
        return ResponseEntity.ok(summary);
    }
}
