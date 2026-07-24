package com.ems.backend.dto.response;

import com.ems.backend.entity.Role;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long userId;
    private String name;
    private String email;
    private Role role;
    private String profilePicUrl;

    // Employee specific fields (if role is EMPLOYEE or employee record exists)
    private Long employeeId;
    private String employeeCode;
    private String department;
    private String designation;
    private String phone;
    private LocalDate joiningDate;
}
