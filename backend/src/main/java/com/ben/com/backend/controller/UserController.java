package com.ben.com.backend.controller;

import com.ben.com.backend.dto.user.UserProfileResponse;
import com.ben.com.backend.dto.user.UserUpdateRequest;
import com.ben.com.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users" )
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<UserProfileResponse> getCurrentUser() {
    UserProfileResponse user = userService.getCurrentUserProfile();
    return ResponseEntity.ok(user);
  }

  @PutMapping("/me")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<UserProfileResponse> updateCurrentUser(@Valid @RequestBody UserUpdateRequest request) {
    UserProfileResponse updatedUser = userService.updateCurrentUserProfile(request);
    return ResponseEntity.ok(updatedUser);
  }

  @PostMapping("/me/avatar")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<UserProfileResponse> uploadAvatar(@RequestParam("file") MultipartFile file) {
    return ResponseEntity.ok(userService.uploadAvatar(file));
  }
}