package com.ems.backend.service;

import com.ems.backend.dto.AuthResponse;
import com.ems.backend.dto.LoginRequest;
import com.ems.backend.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}