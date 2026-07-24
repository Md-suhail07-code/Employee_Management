package com.ems.backend.dto.response;

public class EmployeeSummaryDTO {

    private Long employeeId;
    private String employeeCode;
    private String name;
    private String department;
    private String designation;

    public EmployeeSummaryDTO(Long employeeId, String employeeCode, String name,
                              String department, String designation) {
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.name = name;
        this.department = department;
        this.designation = designation;
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
}
