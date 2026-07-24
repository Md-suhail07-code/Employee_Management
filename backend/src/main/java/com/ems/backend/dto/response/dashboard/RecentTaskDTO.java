package com.ems.backend.dto.response.dashboard;

import com.ems.backend.entity.Priority;
import com.ems.backend.entity.TaskStatus;

import java.time.LocalDate;

public class RecentTaskDTO {

    private Long id;
    private String title;
    private TaskStatus status;
    private Priority priority;
    private String employeeName;
    private String projectName;
    private LocalDate deadline;

    public RecentTaskDTO() {
    }

    public RecentTaskDTO(Long id, String title, TaskStatus status, Priority priority,
                         String employeeName, String projectName, LocalDate deadline) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.employeeName = employeeName;
        this.projectName = projectName;
        this.deadline = deadline;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
}
