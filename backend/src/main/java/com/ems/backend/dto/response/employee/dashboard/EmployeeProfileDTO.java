package com.ems.backend.dto.response.employee.dashboard;

import java.time.LocalDate;

public class EmployeeProfileDTO {

    private Long employeeId;
    private String employeeCode;
    private String name;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private String email;

    public EmployeeProfileDTO() {
    }

    public EmployeeProfileDTO(Long employeeId, String employeeCode, String name,
                              String department, String designation, LocalDate joiningDate,
                              String email) {
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.name = name;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.email = email;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
