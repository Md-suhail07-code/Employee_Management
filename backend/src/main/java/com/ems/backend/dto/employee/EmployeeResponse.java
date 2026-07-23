package com.ems.backend.dto.employee;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String name;
    private String email;
    private String department;
    private String designation;
    private String phone;
    private LocalDate joiningDate;
}
