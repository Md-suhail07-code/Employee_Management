package com.ems.backend.dto.response.dashboard;

import java.util.List;

public class DashboardResponse {

    private EmployeeStatisticsDTO employeeStatistics;
    private ProjectStatisticsDTO projectStatistics;
    private TaskStatisticsDTO taskStatistics;
    private List<RecentEmployeeDTO> recentEmployees;
    private List<RecentProjectDTO> recentProjects;
    private List<RecentTaskDTO> recentTasks;
    private List<ChartDataDTO> projectStatusChart;
    private List<ChartDataDTO> taskStatusChart;
    private List<DepartmentDistributionDTO> departmentDistribution;
    private MonthlyStatisticsDTO monthlyStatistics;

    public DashboardResponse() {
    }

    public DashboardResponse(EmployeeStatisticsDTO employeeStatistics,
                             ProjectStatisticsDTO projectStatistics,
                             TaskStatisticsDTO taskStatistics,
                             List<RecentEmployeeDTO> recentEmployees,
                             List<RecentProjectDTO> recentProjects,
                             List<RecentTaskDTO> recentTasks,
                             List<ChartDataDTO> projectStatusChart,
                             List<ChartDataDTO> taskStatusChart,
                             List<DepartmentDistributionDTO> departmentDistribution,
                             MonthlyStatisticsDTO monthlyStatistics) {
        this.employeeStatistics = employeeStatistics;
        this.projectStatistics = projectStatistics;
        this.taskStatistics = taskStatistics;
        this.recentEmployees = recentEmployees;
        this.recentProjects = recentProjects;
        this.recentTasks = recentTasks;
        this.projectStatusChart = projectStatusChart;
        this.taskStatusChart = taskStatusChart;
        this.departmentDistribution = departmentDistribution;
        this.monthlyStatistics = monthlyStatistics;
    }

    public EmployeeStatisticsDTO getEmployeeStatistics() {
        return employeeStatistics;
    }

    public void setEmployeeStatistics(EmployeeStatisticsDTO employeeStatistics) {
        this.employeeStatistics = employeeStatistics;
    }

    public ProjectStatisticsDTO getProjectStatistics() {
        return projectStatistics;
    }

    public void setProjectStatistics(ProjectStatisticsDTO projectStatistics) {
        this.projectStatistics = projectStatistics;
    }

    public TaskStatisticsDTO getTaskStatistics() {
        return taskStatistics;
    }

    public void setTaskStatistics(TaskStatisticsDTO taskStatistics) {
        this.taskStatistics = taskStatistics;
    }

    public List<RecentEmployeeDTO> getRecentEmployees() {
        return recentEmployees;
    }

    public void setRecentEmployees(List<RecentEmployeeDTO> recentEmployees) {
        this.recentEmployees = recentEmployees;
    }

    public List<RecentProjectDTO> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<RecentProjectDTO> recentProjects) {
        this.recentProjects = recentProjects;
    }

    public List<RecentTaskDTO> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<RecentTaskDTO> recentTasks) {
        this.recentTasks = recentTasks;
    }

    public List<ChartDataDTO> getProjectStatusChart() {
        return projectStatusChart;
    }

    public void setProjectStatusChart(List<ChartDataDTO> projectStatusChart) {
        this.projectStatusChart = projectStatusChart;
    }

    public List<ChartDataDTO> getTaskStatusChart() {
        return taskStatusChart;
    }

    public void setTaskStatusChart(List<ChartDataDTO> taskStatusChart) {
        this.taskStatusChart = taskStatusChart;
    }

    public List<DepartmentDistributionDTO> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(List<DepartmentDistributionDTO> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }

    public MonthlyStatisticsDTO getMonthlyStatistics() {
        return monthlyStatistics;
    }

    public void setMonthlyStatistics(MonthlyStatisticsDTO monthlyStatistics) {
        this.monthlyStatistics = monthlyStatistics;
    }
}
