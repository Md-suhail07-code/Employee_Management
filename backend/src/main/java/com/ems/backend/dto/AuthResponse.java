package com.ems.backend.dto;

import com.ems.backend.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private String message;

    private Long id;

    private String name;

    private String email;

    private Role role;

    private String profilePicUrl;
}