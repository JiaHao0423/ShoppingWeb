package com.ben.com.backend.controller;

import com.ben.com.backend.dto.auth.MessageResponse;
import com.ben.com.backend.dto.user.UserAddressRequest;
import com.ben.com.backend.dto.user.UserAddressResponse;
import com.ben.com.backend.service.UserAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/me/addresses")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
public class UserAddressController {
  private final UserAddressService userAddressService;

  @GetMapping
  public ResponseEntity<List<UserAddressResponse>> list() {
    return ResponseEntity.ok(userAddressService.getCurrentUserAddresses());
  }

  @PostMapping
  public ResponseEntity<UserAddressResponse> create(@Valid @RequestBody UserAddressRequest request) {
    return ResponseEntity.ok(userAddressService.createAddress(request));
  }

  @PutMapping("/{id}")
  public ResponseEntity<UserAddressResponse> update(@PathVariable Long id, @Valid @RequestBody UserAddressRequest request) {
    return ResponseEntity.ok(userAddressService.updateAddress(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
    userAddressService.deleteAddress(id);
    return ResponseEntity.ok(new MessageResponse("Address deleted"));
  }

  @PutMapping("/{id}/default")
  public ResponseEntity<UserAddressResponse> setDefault(@PathVariable Long id) {
    return ResponseEntity.ok(userAddressService.setDefault(id));
  }
}
