package com.ems.backend.dto.response.employee.dashboard;

import java.time.LocalDateTime;

public class CompletedTaskDTO {

    private Long taskId;
    private String title;
    private String projectName;
    private LocalDateTime completedAt;

    public CompletedTaskDTO() {
    }

    public CompletedTaskDTO(Long taskId, String title, String projectName, LocalDateTime completedAt) {
        this.taskId = taskId;
        this.title = title;
        this.projectName = projectName;
        this.completedAt = completedAt;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
