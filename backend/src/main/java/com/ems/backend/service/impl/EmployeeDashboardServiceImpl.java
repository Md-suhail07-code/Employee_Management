package com.ems.backend.service.impl;

import com.ems.backend.dto.response.employee.dashboard.AssignedTaskDTO;
import com.ems.backend.dto.response.employee.dashboard.CompletedTaskDTO;
import com.ems.backend.dto.response.employee.dashboard.EmployeeDashboardResponse;
import com.ems.backend.dto.response.employee.dashboard.EmployeeDashboardStatisticsDTO;
import com.ems.backend.dto.response.employee.dashboard.EmployeeProfileDTO;
import com.ems.backend.dto.response.employee.dashboard.UpcomingDeadlineDTO;
import com.ems.backend.entity.TaskStatus;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.TaskRepository;
import com.ems.backend.service.EmployeeDashboardService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeDashboardServiceImpl implements EmployeeDashboardService {

    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;

    public EmployeeDashboardServiceImpl(EmployeeRepository employeeRepository,
                                        TaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDashboardResponse getDashboard(String email) {
        EmployeeProfileDTO employeeProfile = employeeRepository.findEmployeeProfileByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for email: " + email));

        Long employeeId = employeeProfile.getEmployeeId();
        LocalDate today = LocalDate.now();

        long assignedTasks = taskRepository.countByEmployeeId(employeeId);
        long completedTasks = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.COMPLETED);
        long inProgressTasks = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.IN_PROGRESS);
        long todoTasks = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.TODO);
        long onHoldTasks = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.ON_HOLD);
        long overdueTasks = taskRepository.countOverdueTasksByEmployeeId(employeeId, today);

        double completionPercentage = assignedTasks == 0 ? 0.0 : (completedTasks * 100.0) / assignedTasks;

        EmployeeDashboardStatisticsDTO statistics = new EmployeeDashboardStatisticsDTO(
                assignedTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                onHoldTasks,
                completionPercentage,
                overdueTasks
        );

        Pageable upcomingPageable = PageRequest.of(0, 5);
        List<AssignedTaskDTO> assignedTaskList = taskRepository.findAssignedTasksByEmployeeId(employeeId);
        List<UpcomingDeadlineDTO> upcomingDeadlines = taskRepository.findUpcomingDeadlinesByEmployeeId(employeeId, upcomingPageable);
        List<CompletedTaskDTO> recentCompletedTasks = taskRepository.findRecentCompletedTasksByEmployeeId(employeeId, upcomingPageable);

        return new EmployeeDashboardResponse(
                employeeProfile,
                statistics,
                assignedTaskList,
                upcomingDeadlines,
                recentCompletedTasks
        );
    }
}
