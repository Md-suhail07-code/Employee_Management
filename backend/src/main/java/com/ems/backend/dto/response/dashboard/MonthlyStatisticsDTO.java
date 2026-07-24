package com.ems.backend.dto.response.dashboard;

public class MonthlyStatisticsDTO {

    private long employeesJoined;
    private long projectsCreated;
    private long tasksCreated;
    private long tasksCompleted;

    public MonthlyStatisticsDTO() {
    }

    public MonthlyStatisticsDTO(long employeesJoined, long projectsCreated,
                                long tasksCreated, long tasksCompleted) {
        this.employeesJoined = employeesJoined;
        this.projectsCreated = projectsCreated;
        this.tasksCreated = tasksCreated;
        this.tasksCompleted = tasksCompleted;
    }

    public long getEmployeesJoined() {
        return employeesJoined;
    }

    public void setEmployeesJoined(long employeesJoined) {
        this.employeesJoined = employeesJoined;
    }

    public long getProjectsCreated() {
        return projectsCreated;
    }

    public void setProjectsCreated(long projectsCreated) {
        this.projectsCreated = projectsCreated;
    }

    public long getTasksCreated() {
        return tasksCreated;
    }

    public void setTasksCreated(long tasksCreated) {
        this.tasksCreated = tasksCreated;
    }

    public long getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(long tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }
}
