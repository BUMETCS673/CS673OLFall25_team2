package com.cs673.careerforge.service.impl;

import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.domain.common.UserType;
import com.cs673.careerforge.data.UserRepository;
import com.cs673.careerforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service implementation for User com.cs673.careerforge.entity operations.
 * Written by human.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public User createUser(User user) {
        validateUser(user);
        
        // Check if username already exists
        if (existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }
        
        // Check if email already exists
        if (existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public User updateUser(User user) {
        if (user.getId() == null) {
            throw new IllegalArgumentException("User ID is required for update");
        }
        
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + user.getId()));
        
        // Check if username is being changed and if it already exists
        if (!existingUser.getUsername().equals(user.getUsername()) && existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }
        
        // Check if email is being changed and if it already exists
        if (!existingUser.getEmail().equals(user.getEmail()) && existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        
        // Update fields
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setUserType(user.getUserType());
        existingUser.setIsActive(user.getIsActive());
        
        // Update company owner fields
        existingUser.setCompanyName(user.getCompanyName());
        existingUser.setPhoto(user.getPhoto());
        existingUser.setRating(user.getRating());
        existingUser.setSector(user.getSector());
        existingUser.setFunding(user.getFunding());
        existingUser.setTeamSize(user.getTeamSize());
        existingUser.setEvaluatedSize(user.getEvaluatedSize());
        existingUser.setIsClaimed(user.getIsClaimed());
        existingUser.setSlug(user.getSlug());
        existingUser.setLocationAddress(user.getLocationAddress());
        existingUser.setLocationCoordinates(user.getLocationCoordinates());
        existingUser.setBenefits(user.getBenefits());
        existingUser.setValues(user.getValues());
        existingUser.setBadges(user.getBadges());
        
        return userRepository.save(existingUser);
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Override
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    @Override
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        user.setIsActive(true);
        userRepository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<User> findAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findUsersByType(UserType userType) {
        return userRepository.findByUserType(userType);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<User> findUsersByType(UserType userType, Pageable pageable) {
        return userRepository.findByUserType(userType, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findActiveUsersByType(UserType userType) {
        return userRepository.findByUserTypeAndIsActive(userType, true);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<User> searchUsers(UserType userType, Boolean isActive, String searchTerm, Pageable pageable) {
        return userRepository.findByCriteria(userType, isActive, searchTerm, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByUserType(UserType userType) {
        return userRepository.countByUserType(userType);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countActiveUsersByType(UserType userType) {
        return userRepository.countByUserTypeAndIsActive(userType, true);
    }
    
    @Override
    public void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        
        if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        
        if (user.getUserType() == null) {
            throw new IllegalArgumentException("User type is required");
        }
        
        // Validate email format
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Validate password strength
        if (user.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        
        if (!user.getPassword().matches(".*[A-Za-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one letter");
        }
        
        if (!user.getPassword().matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one number");
        }
    }
    
    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        
        // Validate new password
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters long");
        }
        
        if (!newPassword.matches(".*[A-Za-z].*")) {
            throw new IllegalArgumentException("New password must contain at least one letter");
        }
        
        if (!newPassword.matches(".*\\d.*")) {
            throw new IllegalArgumentException("New password must contain at least one number");
        }
        
        // Encode and set new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    @Override
    public String resetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        
        // Generate temporary password
        String tempPassword = UUID.randomUUID().toString().substring(0, 12);
        
        // Encode and set temporary password
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        
        return tempPassword;
    }
}
