package com.ems.backend.service;

import com.ems.backend.dto.request.TaskRequest;
import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.dto.response.TaskResponse;
import com.ems.backend.entity.Priority;
import com.ems.backend.entity.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {

    ApiResponse<TaskResponse> createTask(TaskRequest request);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(Long id);

    ApiResponse<TaskResponse> updateTask(Long id, TaskRequest request);

    ApiResponse<Void> deleteTask(Long id);

    ApiResponse<TaskResponse> updateTaskStatus(Long id, TaskStatus status);

    ApiResponse<TaskResponse> updateTaskProgress(Long id, Integer progress);

    ApiResponse<TaskResponse> updateTaskRemarks(Long id, String remarks);

    List<TaskResponse> getTasksByProject(Long projectId);

    List<TaskResponse> getTasksByEmployee(Long employeeId);

    List<TaskResponse> searchTasks(TaskStatus status, Priority priority, Long employeeId,
                                   Long projectId, LocalDate deadline, String keyword);
}
