package com.cs673.careerforge.service;

import com.cs673.careerforge.entity.User;
import com.cs673.careerforge.entity.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for User com.cs673.careerforge.entity operations.
 */
public interface UserService {
    
    /**
     * Create a new user.
     * @param user the user to create
     * @return the created user
     * @throws IllegalArgumentException if username or email already exists
     */
    User createUser(User user);
    
    /**
     * Find user by ID.
     * @param id the user ID
     * @return Optional containing the user if found
     */
    Optional<User> findById(Long id);
    
    /**
     * Find user by username.
     * @param username the username
     * @return Optional containing the user if found
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find user by email.
     * @param email the email
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Update user information.
     * @param user the user to update
     * @return the updated user
     * @throws IllegalArgumentException if user not found or validation fails
     */
    User updateUser(User user);
    
    /**
     * Delete user by ID.
     * @param id the user ID
     * @throws IllegalArgumentException if user not found
     */
    void deleteUser(Long id);
    
    /**
     * Soft delete user (set isActive to false).
     * @param id the user ID
     * @throws IllegalArgumentException if user not found
     */
    void deactivateUser(Long id);
    
    /**
     * Activate user (set isActive to true).
     * @param id the user ID
     * @throws IllegalArgumentException if user not found
     */
    void activateUser(Long id);
    
    /**
     * Find all users.
     * @return list of all users
     */
    List<User> findAllUsers();
    
    /**
     * Find all users with pagination.
     * @param pageable pagination information
     * @return page of users
     */
    Page<User> findAllUsers(Pageable pageable);
    
    /**
     * Find users by user type.
     * @param userType the user type to filter by
     * @return list of users with the specified type
     */
    List<User> findUsersByType(UserType userType);
    
    /**
     * Find users by user type with pagination.
     * @param userType the user type to filter by
     * @param pageable pagination information
     * @return page of users with the specified type
     */
    Page<User> findUsersByType(UserType userType, Pageable pageable);
    
    /**
     * Find active users by user type.
     * @param userType the user type to filter by
     * @return list of active users with the specified type
     */
    List<User> findActiveUsersByType(UserType userType);
    
    /**
     * Search users by criteria.
     * @param userType the user type to filter by (optional)
     * @param isActive whether the user is active (optional)
     * @param searchTerm search term for first name, last name, or username (optional)
     * @param pageable pagination information
     * @return page of users matching the criteria
     */
    Page<User> searchUsers(UserType userType, Boolean isActive, String searchTerm, Pageable pageable);
    
    /**
     * Check if username exists.
     * @param username the username to check
     * @return true if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email exists.
     * @param email the email to check
     * @return true if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Count users by type.
     * @param userType the user type to count
     * @return number of users with the specified type
     */
    long countByUserType(UserType userType);
    
    /**
     * Count active users by type.
     * @param userType the user type to count
     * @return number of active users with the specified type
     */
    long countActiveUsersByType(UserType userType);
    
    /**
     * Validate user data.
     * @param user the user to validate
     * @throws IllegalArgumentException if validation fails
     */
    void validateUser(User user);
    
    /**
     * Change user password.
     * @param userId the user ID
     * @param oldPassword the old password
     * @param newPassword the new password
     * @throws IllegalArgumentException if user not found or old password is incorrect
     */
    void changePassword(Long userId, String oldPassword, String newPassword);
    
    /**
     * Reset user password.
     * @param email the user email
     * @return the new temporary password
     * @throws IllegalArgumentException if user not found
     */
    String resetPassword(String email);
}
