package com.ems.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class AssignmentRequestDTO {

    @NotEmpty(message = "employeeIds must not be empty")
    private List<Long> employeeIds;

    public List<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(List<Long> employeeIds) {
        this.employeeIds = employeeIds;
    }
}
