package com.ems.backend.dto.response.dashboard;

import java.time.LocalDate;

public class RecentEmployeeDTO {

    private Long id;
    private String employeeCode;
    private String name;
    private String department;
    private String designation;
    private LocalDate joiningDate;

    public RecentEmployeeDTO() {
    }

    public RecentEmployeeDTO(Long id, String employeeCode, String name,
                             String department, String designation, LocalDate joiningDate) {
        this.id = id;
        this.employeeCode = employeeCode;
        this.name = name;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
