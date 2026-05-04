package com.ben.com.backend.service;

import com.ben.com.backend.dto.user.UserAddressRequest;
import com.ben.com.backend.dto.user.UserAddressResponse;
import com.ben.com.backend.exception.ResourceNotFoundException;
import com.ben.com.backend.model.User;
import com.ben.com.backend.model.UserAddress;
import com.ben.com.backend.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAddressService {
  private final UserAddressRepository userAddressRepository;
  private final UserService userService;

  public List<UserAddressResponse> getCurrentUserAddresses() {
    User user = userService.getCurrentUser();
    return userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(user.getId()).stream().map(this::toResponse).toList();
  }

  @Transactional
  public UserAddressResponse createAddress(UserAddressRequest request) {
    User user = userService.getCurrentUser();
    if (Boolean.TRUE.equals(request.getIsDefault())) {
      clearDefault(user.getId());
    }
    UserAddress address = UserAddress.builder()
      .user(user)
      .recipientName(request.getRecipientName())
      .phone(request.getPhone())
      .address(request.getAddress())
      .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
      .build();
    return toResponse(userAddressRepository.save(address));
  }

  @Transactional
  public UserAddressResponse updateAddress(Long id, UserAddressRequest request) {
    User user = userService.getCurrentUser();
    UserAddress address = userAddressRepository.findByIdAndUserId(id, user.getId())
      .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
    if (Boolean.TRUE.equals(request.getIsDefault())) {
      clearDefault(user.getId());
    }
    address.setRecipientName(request.getRecipientName());
    address.setPhone(request.getPhone());
    address.setAddress(request.getAddress());
    address.setDefault(Boolean.TRUE.equals(request.getIsDefault()));
    return toResponse(userAddressRepository.save(address));
  }

  @Transactional
  public void deleteAddress(Long id) {
    User user = userService.getCurrentUser();
    UserAddress address = userAddressRepository.findByIdAndUserId(id, user.getId())
      .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
    userAddressRepository.delete(address);
  }

  @Transactional
  public UserAddressResponse setDefault(Long id) {
    User user = userService.getCurrentUser();
    UserAddress address = userAddressRepository.findByIdAndUserId(id, user.getId())
      .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
    clearDefault(user.getId());
    address.setDefault(true);
    return toResponse(userAddressRepository.save(address));
  }

  private void clearDefault(Long userId) {
    List<UserAddress> all = userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
    for (UserAddress item : all) {
      if (item.isDefault()) {
        item.setDefault(false);
      }
    }
    userAddressRepository.saveAll(all);
  }

  private UserAddressResponse toResponse(UserAddress address) {
    return UserAddressResponse.builder()
      .id(address.getId())
      .recipientName(address.getRecipientName())
      .phone(address.getPhone())
      .address(address.getAddress())
      .isDefault(address.isDefault())
      .build();
  }
}
