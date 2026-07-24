package com.ems.backend.dto.response.dashboard;

public class ProjectStatisticsDTO {

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long onHoldProjects;
    private long projectsEndingSoon;
    private long projectsStartedThisMonth;

    public ProjectStatisticsDTO() {
    }

    public ProjectStatisticsDTO(long totalProjects, long activeProjects, long completedProjects,
                                long onHoldProjects, long projectsEndingSoon,
                                long projectsStartedThisMonth) {
        this.totalProjects = totalProjects;
        this.activeProjects = activeProjects;
        this.completedProjects = completedProjects;
        this.onHoldProjects = onHoldProjects;
        this.projectsEndingSoon = projectsEndingSoon;
        this.projectsStartedThisMonth = projectsStartedThisMonth;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
    }

    public long getOnHoldProjects() {
        return onHoldProjects;
    }

    public void setOnHoldProjects(long onHoldProjects) {
        this.onHoldProjects = onHoldProjects;
    }

    public long getProjectsEndingSoon() {
        return projectsEndingSoon;
    }

    public void setProjectsEndingSoon(long projectsEndingSoon) {
        this.projectsEndingSoon = projectsEndingSoon;
    }

    public long getProjectsStartedThisMonth() {
        return projectsStartedThisMonth;
    }

    public void setProjectsStartedThisMonth(long projectsStartedThisMonth) {
        this.projectsStartedThisMonth = projectsStartedThisMonth;
    }
}
