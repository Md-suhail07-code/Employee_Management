package com.ems.backend.dto.response.report;

public class SummaryReportDTO {

    private long employees;
    private long projects;
    private long tasks;
    private double completionPercentage;

    public SummaryReportDTO() {
    }

    public SummaryReportDTO(long employees, long projects, long tasks, double completionPercentage) {
        this.employees = employees;
        this.projects = projects;
        this.tasks = tasks;
        this.completionPercentage = completionPercentage;
    }

    public long getEmployees() {
        return employees;
    }

    public void setEmployees(long employees) {
        this.employees = employees;
    }

    public long getProjects() {
        return projects;
    }

    public void setProjects(long projects) {
        this.projects = projects;
    }

    public long getTasks() {
        return tasks;
    }

    public void setTasks(long tasks) {
        this.tasks = tasks;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
