package com.ems.backend.dto.response.dashboard;

import com.ems.backend.entity.ProjectStatus;

import java.time.LocalDate;

public class RecentProjectDTO {

    private Long id;
    private String projectCode;
    private String projectName;
    private String clientName;
    private ProjectStatus status;
    private Integer progress;
    private LocalDate startDate;
    private LocalDate endDate;

    public RecentProjectDTO() {
    }

    public RecentProjectDTO(Long id, String projectCode, String projectName,
                            String clientName, ProjectStatus status, Integer progress,
                            LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.projectCode = projectCode;
        this.projectName = projectName;
        this.clientName = clientName;
        this.status = status;
        this.progress = progress;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
