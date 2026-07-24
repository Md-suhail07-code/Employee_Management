package com.ems.backend.service.impl;

import com.ems.backend.dto.response.dashboard.*;
import com.ems.backend.entity.ProjectStatus;
import com.ems.backend.entity.TaskStatus;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.ProjectRepository;
import com.ems.backend.repository.TaskRepository;
import com.ems.backend.service.DashboardService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DashboardServiceImpl(EmployeeRepository employeeRepository,
                                ProjectRepository projectRepository,
                                TaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate startOfNextMonth = endOfMonth.plusDays(1);
        Pageable recentPageable = PageRequest.of(0, 5);

        long totalEmployees = employeeRepository.count();
        long employeesJoinedToday = employeeRepository.countByJoiningDate(today);
        long employeesJoinedThisWeek = employeeRepository.countByJoiningDateBetween(startOfWeek, today);
        long employeesJoinedThisMonth = employeeRepository.countByJoiningDateBetween(startOfMonth, today);
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long onHoldProjects = projectRepository.countByStatus(ProjectStatus.NOT_STARTED);
        long projectsEndingSoon = projectRepository.countProjectsEndingWithinDays(today, today.plusDays(30));
        long projectsStartedThisMonth = projectRepository.countByStartDateBetween(startOfMonth, startOfNextMonth);
        long totalTasks = taskRepository.count();
        long todoTasks = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long onHoldTasks = taskRepository.countByStatus(TaskStatus.ON_HOLD);
        long overdueTasks = taskRepository.countOverdueTasks(LocalDate.now());

        double completionPercentage = totalTasks == 0 ? 0.0 : (completedTasks * 100.0) / totalTasks;

        EmployeeStatisticsDTO employeeStatistics = new EmployeeStatisticsDTO(
                totalEmployees,
                totalEmployees,
                0,
                employeesJoinedThisMonth,
                employeesJoinedToday,
                employeesJoinedThisWeek,
                employeesJoinedThisMonth
        );

        ProjectStatisticsDTO projectStatistics = new ProjectStatisticsDTO(
                totalProjects,
                activeProjects,
                completedProjects,
                onHoldProjects,
                projectsEndingSoon,
                projectsStartedThisMonth
        );

        TaskStatisticsDTO taskStatistics = new TaskStatisticsDTO(
                totalTasks,
                todoTasks,
                inProgressTasks,
                completedTasks,
                onHoldTasks,
                overdueTasks,
                completionPercentage
        );

        List<RecentEmployeeDTO> recentEmployees = employeeRepository.findRecentEmployees(recentPageable);
        List<RecentProjectDTO> recentProjects = projectRepository.findRecentProjects(recentPageable);
        List<RecentTaskDTO> recentTasks = taskRepository.findRecentTasks(recentPageable);

        List<ChartDataDTO> projectStatusChart = projectStatusChart(activeProjects, completedProjects, onHoldProjects);
        List<ChartDataDTO> taskStatusChart = taskStatusChart(todoTasks, inProgressTasks, completedTasks, onHoldTasks);
        List<DepartmentDistributionDTO> departmentDistribution = employeeRepository.findDepartmentDistribution();

        LocalDateTime monthStart = startOfMonth.atStartOfDay();
        LocalDateTime monthEnd = startOfNextMonth.atStartOfDay();
        MonthlyStatisticsDTO monthlyStatistics = new MonthlyStatisticsDTO(
                employeeRepository.countByJoiningDateBetween(startOfMonth, today),
                projectRepository.countByStartDateBetween(startOfMonth, startOfNextMonth),
                taskRepository.countByCreatedAtBetween(monthStart, monthEnd),
                taskRepository.countByStatusAndUpdatedAtBetween(TaskStatus.COMPLETED, monthStart, monthEnd)
        );

        return new DashboardResponse(
                employeeStatistics,
                projectStatistics,
                taskStatistics,
                recentEmployees,
                recentProjects,
                recentTasks,
                projectStatusChart,
                taskStatusChart,
                departmentDistribution,
                monthlyStatistics
        );
    }

    private List<ChartDataDTO> projectStatusChart(long activeProjects, long completedProjects, long onHoldProjects) {
        List<ChartDataDTO> chart = new ArrayList<>();
        chart.add(new ChartDataDTO("ACTIVE", activeProjects));
        chart.add(new ChartDataDTO("COMPLETED", completedProjects));
        chart.add(new ChartDataDTO("ON_HOLD", onHoldProjects));
        return chart;
    }

    private List<ChartDataDTO> taskStatusChart(long todoTasks, long inProgressTasks,
                                               long completedTasks, long onHoldTasks) {
        List<ChartDataDTO> chart = new ArrayList<>();
        chart.add(new ChartDataDTO("TODO", todoTasks));
        chart.add(new ChartDataDTO("IN_PROGRESS", inProgressTasks));
        chart.add(new ChartDataDTO("COMPLETED", completedTasks));
        chart.add(new ChartDataDTO("ON_HOLD", onHoldTasks));
        return chart;
    }
}
