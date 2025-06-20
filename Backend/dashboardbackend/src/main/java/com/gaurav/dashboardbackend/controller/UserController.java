package com.gaurav.dashboardbackend.controller;

import com.gaurav.dashboardbackend.dto.UserProfileRequest;
import com.gaurav.dashboardbackend.dto.UserProfileResponse;
import com.gaurav.dashboardbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Principal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestBody UserProfileRequest request, Principal principal) {
        userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) {
        String avatarUrl = userService.storeAvatar(file, principal.getName());
        return ResponseEntity.ok(avatarUrl);
    }


}
