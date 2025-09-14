package com.cs673.careerforge.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Unit tests for Job com.cs673.careerforge.entity.
 */
@DisplayName("Job Entity Tests")
class JobTest {
    
    private Job job;
    private User employer;
    
    @BeforeEach
    void setUp() {
        employer = new User();
        employer.setId(1L);
        employer.setUsername("employer");
        employer.setUserType(UserType.EMPLOYER);
        
        job = new Job();
        job.setPostedBy(employer);
        job.setTitle("Software Engineer");
        job.setDescription("We are looking for a software engineer...");
        job.setCompany("TechCorp");
        job.setLocation("San Francisco, CA");
        job.setEmploymentType(EmploymentType.FULL_TIME);
        job.setSalaryMin(new BigDecimal("100000"));
        job.setSalaryMax(new BigDecimal("150000"));
        job.setIsActive(true);
        
        // Set new fields
        job.setUrl("https://example.com/job/123");
        job.setType("Full-time");
        job.setDepartment("Engineering");
        job.setSeniority("Senior Level");
        job.setLocationAddress("San Francisco, CA");
        
        LocationCoordinates coords = new LocationCoordinates(37.7749, -122.4194);
        job.setLocationCoordinates(coords);
    }
    
    @Test
    @DisplayName("Should create job with valid data")
    void shouldCreateJobWithValidData() {
        assertNotNull(job);
        assertEquals("Software Engineer", job.getTitle());
        assertEquals("We are looking for a software engineer...", job.getDescription());
        assertEquals("TechCorp", job.getCompany());
        assertEquals("San Francisco, CA", job.getLocation());
        assertEquals(EmploymentType.FULL_TIME, job.getEmploymentType());
        assertEquals(new BigDecimal("100000"), job.getSalaryMin());
        assertEquals(new BigDecimal("150000"), job.getSalaryMax());
        assertTrue(job.getIsActive());
        assertEquals("https://example.com/job/123", job.getUrl());
        assertEquals("Full-time", job.getType());
        assertEquals("Engineering", job.getDepartment());
        assertEquals("Senior Level", job.getSeniority());
        assertEquals("San Francisco, CA", job.getLocationAddress());
        assertNotNull(job.getLocationCoordinates());
        assertEquals(37.7749, job.getLocationCoordinates().getLat());
        assertEquals(-122.4194, job.getLocationCoordinates().getLon());
    }
    
    @Test
    @DisplayName("Should return salary range correctly")
    void shouldReturnSalaryRangeCorrectly() {
        assertEquals("$100000 - $150000", job.getSalaryRange());
        
        // Test with only minimum salary
        job.setSalaryMax(null);
        assertEquals("From $100000", job.getSalaryRange());
        
        // Test with only maximum salary
        job.setSalaryMin(null);
        job.setSalaryMax(new BigDecimal("150000"));
        assertEquals("Up to $150000", job.getSalaryRange());
        
        // Test with no salary
        job.setSalaryMax(null);
        assertEquals("Salary not specified", job.getSalaryRange());
    }
    
    @Test
    @DisplayName("Should check application deadline correctly")
    void shouldCheckApplicationDeadlineCorrectly() {
        // No deadline set
        assertFalse(job.isApplicationDeadlinePassed());
        
        // Future deadline
        job.setApplicationDeadline(LocalDateTime.now().plusDays(7));
        assertFalse(job.isApplicationDeadlinePassed());
        
        // Past deadline
        job.setApplicationDeadline(LocalDateTime.now().minusDays(1));
        assertTrue(job.isApplicationDeadlinePassed());
    }
    
    @Test
    @DisplayName("Should return application count correctly")
    void shouldReturnApplicationCountCorrectly() {
        assertEquals(0, job.getApplicationCount());
        
        // Add mock applications
        ApplicationTracking app1 = new ApplicationTracking();
        ApplicationTracking app2 = new ApplicationTracking();
        job.setApplications(java.util.Arrays.asList(app1, app2));
        
        assertEquals(2, job.getApplicationCount());
    }
    
    @Test
    @DisplayName("Should validate salary range correctly")
    void shouldValidateSalaryRangeCorrectly() {
        // Valid range
        assertTrue(job.isValidSalaryRange());
        
        // Equal salaries
        job.setSalaryMin(new BigDecimal("100000"));
        job.setSalaryMax(new BigDecimal("100000"));
        assertTrue(job.isValidSalaryRange());
        
        // Invalid range (min > max)
        job.setSalaryMin(new BigDecimal("150000"));
        job.setSalaryMax(new BigDecimal("100000"));
        assertFalse(job.isValidSalaryRange());
        
        // Null values should be valid
        job.setSalaryMin(null);
        job.setSalaryMax(null);
        assertTrue(job.isValidSalaryRange());
    }
    
    @Test
    @DisplayName("Should validate application deadline correctly")
    void shouldValidateApplicationDeadlineCorrectly() {
        // No deadline should be valid
        assertTrue(job.isValidApplicationDeadline());
        
        // Future deadline should be valid
        job.setApplicationDeadline(LocalDateTime.now().plusDays(7));
        assertTrue(job.isValidApplicationDeadline());
        
        // Past deadline should be invalid
        job.setApplicationDeadline(LocalDateTime.now().minusDays(1));
        assertFalse(job.isValidApplicationDeadline());
    }
    
    @Test
    @DisplayName("Should set timestamps on creation")
    void shouldSetTimestampsOnCreation() {
        Job newJob = new Job(employer, "New Job", "Description", 
                           "Company", "Location", EmploymentType.PART_TIME);
        
        assertNotNull(newJob.getCreatedAt());
        assertNotNull(newJob.getUpdatedAt());
        assertTrue(newJob.getCreatedAt().isBefore(LocalDateTime.now().plusSeconds(1)));
        assertTrue(newJob.getUpdatedAt().isBefore(LocalDateTime.now().plusSeconds(1)));
    }
    
    @Test
    @DisplayName("Should update timestamp on update")
    void shouldUpdateTimestampOnUpdate() {
        LocalDateTime originalUpdatedAt = job.getUpdatedAt();
        
        // Simulate update
        job.setTitle("Updated Title");
        job.onUpdate();
        
        assertTrue(job.getUpdatedAt().isAfter(originalUpdatedAt));
    }
    
    @Test
    @DisplayName("Should handle null values gracefully")
    void shouldHandleNullValuesGracefully() {
        Job nullJob = new Job();
        
        assertNull(nullJob.getTitle());
        assertNull(nullJob.getDescription());
        assertNull(nullJob.getCompany());
        assertNull(nullJob.getLocation());
        assertNull(nullJob.getEmploymentType());
        assertNull(nullJob.getSalaryMin());
        assertNull(nullJob.getSalaryMax());
        assertNull(nullJob.getPostedBy());
    }
    
    @Test
    @DisplayName("Should implement equals and hashCode correctly")
    void shouldImplementEqualsAndHashCodeCorrectly() {
        Job job1 = new Job();
        job1.setId(1L);
        
        Job job2 = new Job();
        job2.setId(1L);
        
        Job job3 = new Job();
        job3.setId(2L);
        
        assertEquals(job1, job2);
        assertNotEquals(job1, job3);
        assertEquals(job1.hashCode(), job2.hashCode());
        assertNotEquals(job1.hashCode(), job3.hashCode());
    }
    
    @Test
    @DisplayName("Should return correct string representation")
    void shouldReturnCorrectStringRepresentation() {
        String jobString = job.toString();
        
        assertTrue(jobString.contains("Software Engineer"));
        assertTrue(jobString.contains("TechCorp"));
        assertTrue(jobString.contains("San Francisco, CA"));
        assertTrue(jobString.contains("FULL_TIME"));
    }
    
    @Test
    @DisplayName("Should handle empty collections for relationships")
    void shouldHandleEmptyCollectionsForRelationships() {
        assertNotNull(job.getApplications());
        assertTrue(job.getApplications().isEmpty());
    }
    
    @Test
    @DisplayName("Should handle different employment types")
    void shouldHandleDifferentEmploymentTypes() {
        job.setEmploymentType(EmploymentType.PART_TIME);
        assertEquals(EmploymentType.PART_TIME, job.getEmploymentType());
        
        job.setEmploymentType(EmploymentType.CONTRACT);
        assertEquals(EmploymentType.CONTRACT, job.getEmploymentType());
        
        job.setEmploymentType(EmploymentType.INTERNSHIP);
        assertEquals(EmploymentType.INTERNSHIP, job.getEmploymentType());
        
        job.setEmploymentType(EmploymentType.REMOTE);
        assertEquals(EmploymentType.REMOTE, job.getEmploymentType());
    }
    
    @Test
    @DisplayName("Should handle new job fields correctly")
    void shouldHandleNewJobFieldsCorrectly() {
        // Test URL field
        job.setUrl("https://newcompany.com/jobs/123");
        assertEquals("https://newcompany.com/jobs/123", job.getUrl());
        
        // Test type field
        job.setType("Contract");
        assertEquals("Contract", job.getType());
        
        // Test department field
        job.setDepartment("Data Science");
        assertEquals("Data Science", job.getDepartment());
        
        // Test seniority field
        job.setSeniority("Entry Level");
        assertEquals("Entry Level", job.getSeniority());
        
        // Test location address field
        job.setLocationAddress("New York, NY");
        assertEquals("New York, NY", job.getLocationAddress());
        
        // Test location coordinates
        LocationCoordinates newCoords = new LocationCoordinates(40.7128, -74.0060);
        job.setLocationCoordinates(newCoords);
        assertEquals(40.7128, job.getLocationCoordinates().getLat());
        assertEquals(-74.0060, job.getLocationCoordinates().getLon());
    }
    
    @Test
    @DisplayName("Should handle null new fields gracefully")
    void shouldHandleNullNewFieldsGracefully() {
        Job nullJob = new Job();
        
        assertNull(nullJob.getUrl());
        assertNull(nullJob.getType());
        assertNull(nullJob.getDepartment());
        assertNull(nullJob.getSeniority());
        assertNull(nullJob.getLocationAddress());
        assertNull(nullJob.getLocationCoordinates());
    }
    
    @Test
    @DisplayName("Should validate location coordinates correctly")
    void shouldValidateLocationCoordinatesCorrectly() {
        // Valid coordinates
        LocationCoordinates validCoords = new LocationCoordinates(37.7749, -122.4194);
        job.setLocationCoordinates(validCoords);
        assertNotNull(job.getLocationCoordinates());
        
        // Null coordinates should be valid
        job.setLocationCoordinates(null);
        assertNull(job.getLocationCoordinates());
    }
}
