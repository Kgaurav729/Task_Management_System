package com.gaurav.dashboardbackend.service;

import com.gaurav.dashboardbackend.dto.UserProfileRequest;
import com.gaurav.dashboardbackend.dto.UserProfileResponse;
import com.gaurav.dashboardbackend.model.User;
import com.gaurav.dashboardbackend.repository.UserRepository;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserProfileResponse(user.getName(), user.getEmail(), user.getAvatar());
    }

    public void updateProfile(String email, UserProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());

        if (request.getAvatar() == null || request.getAvatar().isBlank()) {
            user.setAvatar("https://i.pravatar.cc/150?u=" + email);
        } else {
            user.setAvatar(request.getAvatar());
        }

        userRepository.save(user);
    }

    public String storeAvatar(MultipartFile file, String email) {
        try {
            // Get user
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Create uploads directory if it doesn't exist
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Generate unique file name
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);

            // Save the file to disk
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create public URL to access the file
            String avatarUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(filename)
                    .toUriString();

            // Save to user's profile
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            return avatarUrl;
        } catch (IOException | java.io.IOException e) {
            throw new RuntimeException("Failed to store avatar", e);
        }
    }


}
