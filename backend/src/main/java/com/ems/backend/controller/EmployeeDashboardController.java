package com.ems.backend.controller;

import com.ems.backend.dto.response.employee.dashboard.EmployeeDashboardResponse;
import com.ems.backend.service.EmployeeDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeDashboardController {

    private final EmployeeDashboardService employeeDashboardService;

    public EmployeeDashboardController(EmployeeDashboardService employeeDashboardService) {
        this.employeeDashboardService = employeeDashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<EmployeeDashboardResponse> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(employeeDashboardService.getDashboard(email));
    }
}
