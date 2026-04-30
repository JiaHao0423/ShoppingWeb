package com.ben.com.backend.service;

import com.ben.com.backend.dto.user.UserUpdateRequest;
import com.ben.com.backend.dto.user.UserProfileResponse;
import com.ben.com.backend.exception.ResourceNotFoundException;
import com.ben.com.backend.model.User;
import com.ben.com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private static final Path AVATAR_UPLOAD_DIR = Path.of("uploads", "avatars");
  private static final Set<String> DEFAULT_ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");

  @Value("${app.upload.avatar.max-size-mb:2}")
  private long avatarMaxSizeMb;

  @Value("${app.upload.avatar.allowed-extensions:jpg,jpeg,png,webp}")
  private String avatarAllowedExtensionsRaw;

  public User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
      .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
  }

  public User updateCurrentUser(UserUpdateRequest request) {
    User currentUser = getCurrentUser();
    currentUser.setName(request.getName());
    currentUser.setPhone(request.getPhone());
    currentUser.setAddress(request.getAddress());
    currentUser.setIdCardNumber(request.getIdCardNumber());
    currentUser.setBirthday(request.getBirthday());
    currentUser.setGender(request.getGender());
    currentUser.setAvatarUrl(request.getAvatarUrl());
    return userRepository.save(currentUser);
  }

  public UserProfileResponse getCurrentUserProfile() {
    return toProfileResponse(getCurrentUser());
  }

  public UserProfileResponse updateCurrentUserProfile(UserUpdateRequest request) {
    return toProfileResponse(updateCurrentUser(request));
  }

  public UserProfileResponse uploadAvatar(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("Avatar file is required");
    }

    long maxBytes = avatarMaxSizeMb * 1024 * 1024;
    if (file.getSize() > maxBytes) {
      throw new IllegalArgumentException("Avatar file exceeds size limit");
    }

    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new IllegalArgumentException("Only image files are allowed");
    }

    String extension = extractExtension(file.getOriginalFilename());
    Set<String> allowedExtensions = parseAllowedExtensions();
    if (!allowedExtensions.contains(extension)) {
      throw new IllegalArgumentException("Avatar file extension is not allowed");
    }

    try {
      Files.createDirectories(AVATAR_UPLOAD_DIR);
      String fileName = UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);
      Path targetPath = AVATAR_UPLOAD_DIR.resolve(fileName);
      Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

      User user = getCurrentUser();
      user.setAvatarUrl("/api/uploads/avatars/" + fileName);
      return toProfileResponse(userRepository.save(user));
    } catch (IOException ex) {
      throw new RuntimeException("Failed to upload avatar", ex);
    }
  }

  private UserProfileResponse toProfileResponse(User user) {
    return UserProfileResponse.builder()
      .id(user.getId())
      .username(user.getUsername())
      .email(user.getEmail())
      .name(user.getName())
      .phone(user.getPhone())
      .address(user.getAddress())
      .idCardNumber(user.getIdCardNumber())
      .birthday(user.getBirthday())
      .gender(user.getGender())
      .avatarUrl(user.getAvatarUrl())
      .memberLevel(user.getMemberLevel())
      .roles(Arrays.stream(user.getRoles().split(",")).toList())
      .createdAt(user.getCreatedAt())
      .build();
  }

  private String extractExtension(String filename) {
    if (filename == null) return "";
    int dot = filename.lastIndexOf('.');
    if (dot < 0 || dot == filename.length() - 1) return "";
    return filename.substring(dot + 1).toLowerCase();
  }

  private Set<String> parseAllowedExtensions() {
    if (avatarAllowedExtensionsRaw == null || avatarAllowedExtensionsRaw.isBlank()) {
      return DEFAULT_ALLOWED_EXTENSIONS;
    }
    Set<String> parsed = Arrays.stream(avatarAllowedExtensionsRaw.split(","))
      .map(String::trim)
      .map(String::toLowerCase)
      .filter(s -> !s.isBlank())
      .collect(Collectors.toSet());
    return parsed.isEmpty() ? DEFAULT_ALLOWED_EXTENSIONS : parsed;
  }
}