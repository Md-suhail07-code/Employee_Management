package com.ems.backend.dto.response.employee.dashboard;

import com.ems.backend.entity.Priority;
import com.ems.backend.entity.TaskStatus;

import java.time.LocalDate;

public class AssignedTaskDTO {

    private Long taskId;
    private String title;
    private String projectName;
    private Priority priority;
    private TaskStatus status;
    private Integer progress;
    private LocalDate deadline;

    public AssignedTaskDTO() {
    }

    public AssignedTaskDTO(Long taskId, String title, String projectName,
                           Priority priority, TaskStatus status, Integer progress,
                           LocalDate deadline) {
        this.taskId = taskId;
        this.title = title;
        this.projectName = projectName;
        this.priority = priority;
        this.status = status;
        this.progress = progress;
        this.deadline = deadline;
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

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
}
