package com.ben.com.backend.service;

import com.ben.com.backend.dto.user.UserUpdateRequest;
import com.ben.com.backend.exception.ResourceNotFoundException;
import com.ben.com.backend.model.User;
import com.ben.com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

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
    return userRepository.save(currentUser);
  }
}