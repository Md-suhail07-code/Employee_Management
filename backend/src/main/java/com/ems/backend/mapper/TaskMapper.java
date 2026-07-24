package com.ems.backend.mapper;

import com.ems.backend.dto.request.TaskRequest;
import com.ems.backend.dto.response.TaskResponse;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Project;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.TaskStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class TaskMapper {

    public Task toEntity(TaskRequest request, Employee employee, Project project) {
        LocalDateTime now = LocalDateTime.now();
        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(TaskStatus.TODO);
        task.setProgress(0);
        task.setRemarks(request.getRemarks());
        task.setDeadline(request.getDeadline());
        task.setCreatedAt(now);
        task.setUpdatedAt(now);
        task.setEmployee(employee);
        task.setProject(project);
        return task;
    }

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getProgress(),
                task.getRemarks(),
                task.getDeadline(),
                task.getEmployee() != null ? task.getEmployee().getId() : null,
                task.getEmployee() != null && task.getEmployee().getUser() != null
                        ? task.getEmployee().getUser().getName() : null,
                task.getProject() != null ? task.getProject().getId() : null,
                task.getProject() != null ? task.getProject().getProjectName() : null,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    public void updateEntity(Task task, TaskRequest request) {
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());
        task.setRemarks(request.getRemarks());
        task.setUpdatedAt(LocalDateTime.now());
    }
}
