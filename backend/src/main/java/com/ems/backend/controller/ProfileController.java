package com.ems.backend.controller;

import com.ems.backend.dto.request.UpdatePasswordRequest;
import com.ems.backend.dto.request.UpdateProfileRequest;
import com.ems.backend.dto.response.UserProfileResponse;
import com.ems.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getProfile(email));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updateProfile(email, request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(
            Authentication authentication,
            @Valid @RequestBody UpdatePasswordRequest request) {
        String email = authentication.getName();
        profileService.updatePassword(email, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/avatar")
    public ResponseEntity<UserProfileResponse> uploadProfilePic(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.uploadProfilePic(email, file));
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<UserProfileResponse> deleteProfilePic(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.deleteProfilePic(email));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProfile(Authentication authentication) {
        String email = authentication.getName();
        profileService.deleteProfile(email);
        return ResponseEntity.noContent().build();
    }
}
