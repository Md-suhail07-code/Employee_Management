package com.ems.backend.dto.response.employee.dashboard;

import java.util.List;

public class EmployeeDashboardResponse {

    private EmployeeProfileDTO employee;
    private EmployeeDashboardStatisticsDTO statistics;
    private List<AssignedTaskDTO> assignedTasks;
    private List<UpcomingDeadlineDTO> upcomingDeadlines;
    private List<CompletedTaskDTO> recentCompletedTasks;

    public EmployeeDashboardResponse() {
    }

    public EmployeeDashboardResponse(EmployeeProfileDTO employee,
                                     EmployeeDashboardStatisticsDTO statistics,
                                     List<AssignedTaskDTO> assignedTasks,
                                     List<UpcomingDeadlineDTO> upcomingDeadlines,
                                     List<CompletedTaskDTO> recentCompletedTasks) {
        this.employee = employee;
        this.statistics = statistics;
        this.assignedTasks = assignedTasks;
        this.upcomingDeadlines = upcomingDeadlines;
        this.recentCompletedTasks = recentCompletedTasks;
    }

    public EmployeeProfileDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeProfileDTO employee) {
        this.employee = employee;
    }

    public EmployeeDashboardStatisticsDTO getStatistics() {
        return statistics;
    }

    public void setStatistics(EmployeeDashboardStatisticsDTO statistics) {
        this.statistics = statistics;
    }

    public List<AssignedTaskDTO> getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(List<AssignedTaskDTO> assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    public List<UpcomingDeadlineDTO> getUpcomingDeadlines() {
        return upcomingDeadlines;
    }

    public void setUpcomingDeadlines(List<UpcomingDeadlineDTO> upcomingDeadlines) {
        this.upcomingDeadlines = upcomingDeadlines;
    }

    public List<CompletedTaskDTO> getRecentCompletedTasks() {
        return recentCompletedTasks;
    }

    public void setRecentCompletedTasks(List<CompletedTaskDTO> recentCompletedTasks) {
        this.recentCompletedTasks = recentCompletedTasks;
    }
}
