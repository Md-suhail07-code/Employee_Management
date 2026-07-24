package com.ems.backend.service;

import com.ems.backend.dto.request.UpdatePasswordRequest;
import com.ems.backend.dto.request.UpdateProfileRequest;
import com.ems.backend.dto.response.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    UserProfileResponse getProfile(String email);

    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);

    void updatePassword(String email, UpdatePasswordRequest request);

    UserProfileResponse uploadProfilePic(String email, MultipartFile file);

    UserProfileResponse deleteProfilePic(String email);

    void deleteProfile(String email);
}
