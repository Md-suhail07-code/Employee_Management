package com.ems.backend.service.impl;

import com.ems.backend.dto.request.UpdatePasswordRequest;
import com.ems.backend.dto.request.UpdateProfileRequest;
import com.ems.backend.dto.response.UserProfileResponse;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Project;
import com.ems.backend.entity.User;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileServiceImpl implements ProfileService {

    private static final String UPLOAD_DIR = "uploads/avatars";

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileServiceImpl(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<Employee> employeeOpt = employeeRepository.findByUserEmail(email);
        return mapToProfileResponse(user, employeeOpt.orElse(null));
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setName(request.getName());
        userRepository.save(user);

        Optional<Employee> employeeOpt = employeeRepository.findByUserEmail(email);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            if (request.getPhone() != null) {
                employee.setPhone(request.getPhone());
            }
            if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
                employee.setDepartment(request.getDepartment());
            }
            if (request.getDesignation() != null && !request.getDesignation().isBlank()) {
                employee.setDesignation(request.getDesignation());
            }
            employeeRepository.save(employee);
        }

        return mapToProfileResponse(user, employeeOpt.orElse(null));
    }

    @Override
    @Transactional
    public void updatePassword(String email, UpdatePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserProfileResponse uploadProfilePic(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file cannot be empty");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.jpg");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i);
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Remove old file if exists
            if (user.getProfilePicUrl() != null && user.getProfilePicUrl().contains("/uploads/avatars/")) {
                String oldFileName = user.getProfilePicUrl().substring(user.getProfilePicUrl().lastIndexOf('/') + 1);
                Path oldFilePath = uploadPath.resolve(oldFileName);
                Files.deleteIfExists(oldFilePath);
            }

            String newFileName = "user_" + user.getId() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:8080/uploads/avatars/" + newFileName;
            user.setProfilePicUrl(fileUrl);
            userRepository.save(user);

            Optional<Employee> employeeOpt = employeeRepository.findByUserEmail(email);
            return mapToProfileResponse(user, employeeOpt.orElse(null));
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store profile picture: " + ex.getMessage());
        }
    }

    @Override
    @Transactional
    public UserProfileResponse deleteProfilePic(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getProfilePicUrl() != null && user.getProfilePicUrl().contains("/uploads/avatars/")) {
            try {
                String oldFileName = user.getProfilePicUrl().substring(user.getProfilePicUrl().lastIndexOf('/') + 1);
                Path oldFilePath = Paths.get(UPLOAD_DIR).resolve(oldFileName);
                Files.deleteIfExists(oldFilePath);
            } catch (IOException ignored) {
            }
        }

        user.setProfilePicUrl(null);
        userRepository.save(user);

        Optional<Employee> employeeOpt = employeeRepository.findByUserEmail(email);
        return mapToProfileResponse(user, employeeOpt.orElse(null));
    }

    @Override
    @Transactional
    public void deleteProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Delete profile pic file if exists
        if (user.getProfilePicUrl() != null && user.getProfilePicUrl().contains("/uploads/avatars/")) {
            try {
                String oldFileName = user.getProfilePicUrl().substring(user.getProfilePicUrl().lastIndexOf('/') + 1);
                Path oldFilePath = Paths.get(UPLOAD_DIR).resolve(oldFileName);
                Files.deleteIfExists(oldFilePath);
            } catch (IOException ignored) {
            }
        }

        Optional<Employee> employeeOpt = employeeRepository.findByUserEmail(email);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            if (employee.getProjects() != null) {
                for (Project project : employee.getProjects()) {
                    project.getEmployees().remove(employee);
                }
            }
            employeeRepository.delete(employee);
        } else {
            userRepository.delete(user);
        }
    }

    private UserProfileResponse mapToProfileResponse(User user, Employee employee) {
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profilePicUrl(user.getProfilePicUrl());

        if (employee != null) {
            builder.employeeId(employee.getId())
                    .employeeCode(employee.getEmployeeCode())
                    .department(employee.getDepartment())
                    .designation(employee.getDesignation())
                    .phone(employee.getPhone())
                    .joiningDate(employee.getJoiningDate());
        }

        return builder.build();
    }
}
