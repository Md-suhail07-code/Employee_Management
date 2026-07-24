package com.ems.backend.repository;

import com.ems.backend.dto.response.dashboard.DepartmentDistributionDTO;
import com.ems.backend.dto.response.dashboard.RecentEmployeeDTO;
import com.ems.backend.dto.response.employee.dashboard.EmployeeProfileDTO;
import com.ems.backend.entity.Employee;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT MAX(e.id) FROM Employee e")
    Optional<Long> findMaxId();

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u LEFT JOIN FETCH e.projects p WHERE e.id = :employeeId")
    Optional<Employee> findByIdWithProjects(@Param("employeeId") Long employeeId);

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u LEFT JOIN FETCH e.projects p WHERE e.id IN :employeeIds")
    List<Employee> findAllByIdWithProjects(@Param("employeeIds") List<Long> employeeIds);

    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.user u WHERE e.id IN :employeeIds")
    List<Employee> findAllByIdWithUser(@Param("employeeIds") List<Long> employeeIds);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.joiningDate = :date")
    long countByJoiningDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.joiningDate BETWEEN :startDate AND :endDate")
    long countByJoiningDateBetween(@Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);

    @Query("SELECT new com.ems.backend.dto.response.dashboard.RecentEmployeeDTO(" +
            "e.id, e.employeeCode, u.name, e.department, e.designation, e.joiningDate) " +
            "FROM Employee e JOIN e.user u ORDER BY e.joiningDate DESC, e.id DESC")
    List<RecentEmployeeDTO> findRecentEmployees(Pageable pageable);

    @Query("SELECT new com.ems.backend.dto.response.dashboard.DepartmentDistributionDTO(e.department, COUNT(e)) " +
            "FROM Employee e GROUP BY e.department ORDER BY COUNT(e) DESC")
    List<DepartmentDistributionDTO> findDepartmentDistribution();

    @Query("SELECT new com.ems.backend.dto.response.employee.dashboard.EmployeeProfileDTO(" +
            "e.id, e.employeeCode, u.name, e.department, e.designation, e.joiningDate, u.email) " +
            "FROM Employee e JOIN e.user u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<EmployeeProfileDTO> findEmployeeProfileByUserEmail(@Param("email") String email);

    Optional<Employee> findByUser(com.ems.backend.entity.User user);

    @Query("SELECT e FROM Employee e WHERE LOWER(e.user.email) = LOWER(:email)")
    Optional<Employee> findByUserEmail(@Param("email") String email);
}