package com.ems.backend.service;

import com.ems.backend.dto.response.employee.dashboard.EmployeeDashboardResponse;

public interface EmployeeDashboardService {

    EmployeeDashboardResponse getDashboard(String email);
}
