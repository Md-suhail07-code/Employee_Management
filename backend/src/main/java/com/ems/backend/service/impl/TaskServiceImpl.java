package com.ems.backend.service.impl;

import com.ems.backend.dto.request.TaskRequest;
import com.ems.backend.dto.response.ApiResponse;
import com.ems.backend.dto.response.TaskResponse;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Priority;
import com.ems.backend.entity.Project;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.TaskStatus;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.mapper.TaskMapper;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.ProjectRepository;
import com.ems.backend.repository.TaskRepository;
import com.ems.backend.service.ProjectProgressService;
import com.ems.backend.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;
    private final ProjectProgressService projectProgressService;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            TaskMapper taskMapper,
            ProjectProgressService projectProgressService) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.taskMapper = taskMapper;
        this.projectProgressService = projectProgressService;
    }

    @Override
    @Transactional
    public ApiResponse<TaskResponse> createTask(TaskRequest request) {
        Employee employee = findEmployee(request.getEmployeeId());
        Project project = findProject(request.getProjectId());

        validateEmployeeAssignedToProject(employee, project);
        validateProgress(0);
        validateDeadline(request.getDeadline());

        Task task = taskMapper.toEntity(request, employee, project);
        Task savedTask = taskRepository.save(task);
        projectProgressService.updateProjectProgress(project.getId());
        return ApiResponse.success("Task created successfully", taskMapper.toResponse(savedTask));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAllWithDetails().stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        return taskMapper.toResponse(findTask(id));
    }

    @Override
    @Transactional
    public ApiResponse<TaskResponse> updateTask(Long id, TaskRequest request) {
        Task task = findTask(id);
        Long previousProjectId = task.getProject().getId();
        Employee employee = findEmployee(request.getEmployeeId());
        Project project = findProject(request.getProjectId());

        validateEmployeeAssignedToProject(employee, project);
        validateDeadline(request.getDeadline());

        taskMapper.updateEntity(task, request);
        task.setEmployee(employee);
        task.setProject(project);
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        projectProgressService.updateProjectProgress(project.getId());
        if (!Objects.equals(previousProjectId, project.getId())) {
            projectProgressService.updateProjectProgress(previousProjectId);
        }
        return ApiResponse.success("Task updated successfully", taskMapper.toResponse(updatedTask));
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteTask(Long id) {
        Task task = findTask(id);
        Long projectId = task.getProject().getId();
        taskRepository.delete(task);
        projectProgressService.updateProjectProgress(projectId);
        return ApiResponse.success("Task deleted successfully", null);
    }

    @Override
    @Transactional
    public ApiResponse<TaskResponse> updateTaskStatus(Long id, TaskStatus status) {
        Task task = findTask(id);
        task.setStatus(status);
        if (status == TaskStatus.COMPLETED) {
            task.setProgress(100);
        } else if (status == TaskStatus.TODO) {
            task.setProgress(0);
        } else if (status == TaskStatus.IN_PROGRESS && task.getProgress() != null && task.getProgress() >= 100) {
            task.setProgress(50);
        }
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        projectProgressService.updateProjectProgress(task.getProject().getId());
        return ApiResponse.success("Task status updated successfully", taskMapper.toResponse(updatedTask));
    }

    @Override
    @Transactional
    public ApiResponse<TaskResponse> updateTaskProgress(Long id, Integer progress) {
        Task task = findTask(id);
        validateProgress(progress);

        task.setProgress(progress);
        if (progress == 100) {
            task.setStatus(TaskStatus.COMPLETED);
        } else if (progress == 0) {
            task.setStatus(TaskStatus.TODO);
        } else {
            task.setStatus(TaskStatus.IN_PROGRESS);
        }
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        projectProgressService.updateProjectProgress(task.getProject().getId());
        return ApiResponse.success("Task progress updated successfully", taskMapper.toResponse(updatedTask));
    }

    @Override
    @Transactional
    public ApiResponse<TaskResponse> updateTaskRemarks(Long id, String remarks) {
        Task task = findTask(id);
        task.setRemarks(remarks);
        task.setUpdatedAt(LocalDateTime.now());
        Task updatedTask = taskRepository.save(task);
        return ApiResponse.success("Task remarks updated successfully", taskMapper.toResponse(updatedTask));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId) {
        findProject(projectId);
        return taskRepository.findByProjectIdWithDetails(projectId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByEmployee(Long employeeId) {
        findEmployee(employeeId);
        return taskRepository.findByEmployeeIdWithDetails(employeeId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasks(TaskStatus status, Priority priority, Long employeeId,
                                          Long projectId, LocalDate deadline, String keyword) {
        if (status != null) {
            return taskRepository.findByStatus(status).stream()
                    .map(taskMapper::toResponse)
                    .collect(Collectors.toList());
        }
        if (priority != null) {
            return taskRepository.findByPriority(priority).stream()
                    .map(taskMapper::toResponse)
                    .collect(Collectors.toList());
        }
        if (deadline != null) {
            return taskRepository.findByDeadline(deadline).stream()
                    .map(taskMapper::toResponse)
                    .collect(Collectors.toList());
        }
        if (employeeId != null) {
            return taskRepository.findByEmployeeIdWithDetails(employeeId).stream()
                    .map(taskMapper::toResponse)
                    .collect(Collectors.toList());
        }
        if (projectId != null) {
            return taskRepository.findByProjectIdWithDetails(projectId).stream()
                    .map(taskMapper::toResponse)
                    .collect(Collectors.toList());
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            return taskRepository.searchByKeyword(keyword).stream()
                    .map(taskMapper::toResponse)
                    .collect(Collectors.toList());
        }
        return getAllTasks();
    }

    private Employee findEmployee(Long employeeId) {
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Employee ID must be a positive number");
        }
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
    }

    private Project findProject(Long projectId) {
        if (projectId == null || projectId <= 0) {
            throw new IllegalArgumentException("Project ID must be a positive number");
        }
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    private Task findTask(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Task ID must be a positive number");
        }
        return taskRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private void validateEmployeeAssignedToProject(Employee employee, Project project) {
        boolean assigned = project.getEmployees() != null && project.getEmployees().stream()
                .anyMatch(existingEmployee -> Objects.equals(existingEmployee.getId(), employee.getId()));

        if (!assigned) {
            throw new IllegalArgumentException("Employee is not assigned to the selected project");
        }
    }

    private void validateProgress(Integer progress) {
        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }
    }

    private void validateDeadline(LocalDate deadline) {
        if (deadline == null || deadline.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Deadline must be today or in the future");
        }
    }
}
