package com.ems.backend.repository;

import com.ems.backend.dto.response.dashboard.RecentTaskDTO;
import com.ems.backend.dto.response.employee.dashboard.AssignedTaskDTO;
import com.ems.backend.dto.response.employee.dashboard.CompletedTaskDTO;
import com.ems.backend.dto.response.employee.dashboard.UpcomingDeadlineDTO;
import com.ems.backend.entity.Priority;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.TaskStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT DISTINCT t FROM Task t " +
            "JOIN FETCH t.employee e " +
            "JOIN FETCH e.user u " +
            "JOIN FETCH t.project p " +
            "WHERE t.id = :taskId")
    Optional<Task> findByIdWithDetails(@Param("taskId") Long taskId);

    @Query("SELECT DISTINCT t FROM Task t " +
            "JOIN FETCH t.employee e " +
            "JOIN FETCH e.user u " +
            "JOIN FETCH t.project p")
    List<Task> findAllWithDetails();

    @Query("SELECT DISTINCT t FROM Task t " +
            "JOIN FETCH t.employee e " +
            "JOIN FETCH e.user u " +
            "JOIN FETCH t.project p " +
            "WHERE t.employee.id = :employeeId")
    List<Task> findByEmployeeIdWithDetails(@Param("employeeId") Long employeeId);

    @Query("SELECT DISTINCT t FROM Task t " +
            "JOIN FETCH t.employee e " +
            "JOIN FETCH e.user u " +
            "JOIN FETCH t.project p " +
            "WHERE t.project.id = :projectId")
    List<Task> findByProjectIdWithDetails(@Param("projectId") Long projectId);

    @Query("SELECT DISTINCT t FROM Task t " +
            "JOIN FETCH t.employee e " +
            "JOIN FETCH e.user u " +
            "JOIN FETCH t.project p " +
            "WHERE t.employee.id = :employeeId AND t.project.id = :projectId")
    List<Task> findByEmployeeIdAndProjectIdWithDetails(@Param("employeeId") Long employeeId,
                                                        @Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    long countByProjectIdAndStatus(@Param("projectId") Long projectId,
                                   @Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(@Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.employee.id = :employeeId")
    long countByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.employee.id = :employeeId AND t.status = :status")
    long countByEmployeeIdAndStatus(@Param("employeeId") Long employeeId,
                                     @Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.employee.id = :employeeId AND t.deadline < :today AND t.status <> com.ems.backend.entity.TaskStatus.COMPLETED")
    long countOverdueTasksByEmployeeId(@Param("employeeId") Long employeeId,
                                        @Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.deadline < :today AND t.status <> com.ems.backend.entity.TaskStatus.COMPLETED")
    long countOverdueTasks(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.createdAt BETWEEN :startDateTime AND :endDateTime")
    long countByCreatedAtBetween(@Param("startDateTime") LocalDateTime startDateTime,
                                 @Param("endDateTime") LocalDateTime endDateTime);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status AND t.updatedAt BETWEEN :startDateTime AND :endDateTime")
    long countByStatusAndUpdatedAtBetween(@Param("status") TaskStatus status,
                                          @Param("startDateTime") LocalDateTime startDateTime,
                                          @Param("endDateTime") LocalDateTime endDateTime);

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(Priority priority);

    List<Task> findByDeadline(LocalDate deadline);

    @Query("SELECT new com.ems.backend.dto.response.dashboard.RecentTaskDTO(" +
            "t.id, t.title, t.status, t.priority, u.name, p.projectName, t.deadline) " +
            "FROM Task t JOIN t.employee e JOIN e.user u JOIN t.project p ORDER BY t.createdAt DESC, t.id DESC")
    List<RecentTaskDTO> findRecentTasks(Pageable pageable);

    @Query("SELECT new com.ems.backend.dto.response.employee.dashboard.AssignedTaskDTO(" +
            "t.id, t.title, p.projectName, t.priority, t.status, t.progress, t.deadline) " +
            "FROM Task t JOIN t.project p WHERE t.employee.id = :employeeId ORDER BY t.updatedAt DESC, t.id DESC")
    List<AssignedTaskDTO> findAssignedTasksByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT new com.ems.backend.dto.response.employee.dashboard.UpcomingDeadlineDTO(" +
            "t.id, t.title, t.deadline, p.projectName) " +
            "FROM Task t JOIN t.project p WHERE t.employee.id = :employeeId " +
            "AND t.status <> com.ems.backend.entity.TaskStatus.COMPLETED " +
            "AND t.deadline >= CURRENT_DATE ORDER BY t.deadline ASC, t.id ASC")
    List<UpcomingDeadlineDTO> findUpcomingDeadlinesByEmployeeId(@Param("employeeId") Long employeeId,
                                                                 Pageable pageable);

    @Query("SELECT new com.ems.backend.dto.response.employee.dashboard.CompletedTaskDTO(" +
            "t.id, t.title, p.projectName, t.updatedAt) " +
            "FROM Task t JOIN t.project p WHERE t.employee.id = :employeeId " +
            "AND t.status = com.ems.backend.entity.TaskStatus.COMPLETED " +
            "ORDER BY t.updatedAt DESC, t.id DESC")
    List<CompletedTaskDTO> findRecentCompletedTasksByEmployeeId(@Param("employeeId") Long employeeId,
                                                                 Pageable pageable);

    @Query("SELECT t FROM Task t JOIN t.employee e JOIN e.user u " +
            "WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> searchByKeyword(@Param("keyword") String keyword);
}
