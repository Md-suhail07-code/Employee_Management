package com.ems.backend.dto.response.employee.dashboard;

import java.time.LocalDate;

public class UpcomingDeadlineDTO {

    private Long taskId;
    private String title;
    private LocalDate deadline;
    private String projectName;

    public UpcomingDeadlineDTO() {
    }

    public UpcomingDeadlineDTO(Long taskId, String title, LocalDate deadline, String projectName) {
        this.taskId = taskId;
        this.title = title;
        this.deadline = deadline;
        this.projectName = projectName;
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

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
