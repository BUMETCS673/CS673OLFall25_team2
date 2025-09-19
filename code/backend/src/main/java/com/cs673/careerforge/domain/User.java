package com.cs673.careerforge.domain;

import com.cs673.careerforge.common.UserType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * User com.cs673.careerforge.entity representing both employees and employers in the job tracking system.
 * Implements UserDetails for Spring Security integration.
 */
@Entity
@Table(name = "users", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    
    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name can only contain letters and spaces")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name can only contain letters and spaces")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;
    
    @NotNull(message = "User type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Company owner fields (for employers)
    @Size(max = 100, message = "Company name must not exceed 100 characters")
    @Column(name = "company_name", length = 100)
    private String companyName;
    
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    @Column(name = "photo", length = 500)
    private String photo;
    
    @Size(max = 10, message = "Rating must not exceed 10 characters")
    @Column(name = "rating", length = 10)
    private String rating;
    
    @Size(max = 100, message = "Sector must not exceed 100 characters")
    @Column(name = "sector", length = 100)
    private String sector;
    
    @Size(max = 50, message = "Funding must not exceed 50 characters")
    @Column(name = "funding", length = 50)
    private String funding;
    
    @Column(name = "team_size")
    private Integer teamSize;
    
    @Size(max = 50, message = "Evaluated size must not exceed 50 characters")
    @Column(name = "evaluated_size", length = 50)
    private String evaluatedSize;
    
    @Column(name = "is_claimed")
    private Boolean isClaimed = false;
    
    @Size(max = 100, message = "Slug must not exceed 100 characters")
    @Column(name = "slug", length = 100)
    private String slug;
    
    @Size(max = 200, message = "Location address must not exceed 200 characters")
    @Column(name = "location_address", length = 200)
    private String locationAddress;
    
    @Embedded
    private LocationCoordinates locationCoordinates;
    
    @Embedded
    private Benefits benefits;
    
    @Embedded
    private Values values;
    
    @Column(name = "badges", columnDefinition = "TEXT")
    private String badges; // JSON string of badges array
    
    // JPA Relationships
    @OneToMany(mappedBy = "postedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Job> postedJobs;
    
    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApplicationTracking> applications;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public User(String username, String email, String password, String firstName, 
                String lastName, UserType userType) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = userType;
    }
    
    // JPA Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userType.name()));
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return isActive;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public UserType getUserType() {
        return userType;
    }
    
    public void setUserType(UserType userType) {
        this.userType = userType;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public List<Job> getPostedJobs() {
        return postedJobs;
    }
    
    public void setPostedJobs(List<Job> postedJobs) {
        this.postedJobs = postedJobs;
    }
    
    public List<ApplicationTracking> getApplications() {
        return applications;
    }
    
    public void setApplications(List<ApplicationTracking> applications) {
        this.applications = applications;
    }
    
    // Company owner field getters and setters
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getPhoto() {
        return photo;
    }
    
    public void setPhoto(String photo) {
        this.photo = photo;
    }
    
    public String getRating() {
        return rating;
    }
    
    public void setRating(String rating) {
        this.rating = rating;
    }
    
    public String getSector() {
        return sector;
    }
    
    public void setSector(String sector) {
        this.sector = sector;
    }
    
    public String getFunding() {
        return funding;
    }
    
    public void setFunding(String funding) {
        this.funding = funding;
    }
    
    public Integer getTeamSize() {
        return teamSize;
    }
    
    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }
    
    public String getEvaluatedSize() {
        return evaluatedSize;
    }
    
    public void setEvaluatedSize(String evaluatedSize) {
        this.evaluatedSize = evaluatedSize;
    }
    
    public Boolean getIsClaimed() {
        return isClaimed;
    }
    
    public void setIsClaimed(Boolean isClaimed) {
        this.isClaimed = isClaimed;
    }
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
    }
    
    public String getLocationAddress() {
        return locationAddress;
    }
    
    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }
    
    public LocationCoordinates getLocationCoordinates() {
        return locationCoordinates;
    }
    
    public void setLocationCoordinates(LocationCoordinates locationCoordinates) {
        this.locationCoordinates = locationCoordinates;
    }
    
    public Benefits getBenefits() {
        return benefits;
    }
    
    public void setBenefits(Benefits benefits) {
        this.benefits = benefits;
    }
    
    public Values getValues() {
        return values;
    }
    
    public void setValues(Values values) {
        this.values = values;
    }
    
    public String getBadges() {
        return badges;
    }
    
    public void setBadges(String badges) {
        this.badges = badges;
    }
    
    // Utility methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public boolean isEmployee() {
        return UserType.EMPLOYEE.equals(userType);
    }
    
    public boolean isEmployer() {
        return UserType.EMPLOYER.equals(userType);
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", userType=" + userType +
                ", isActive=" + isActive +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
