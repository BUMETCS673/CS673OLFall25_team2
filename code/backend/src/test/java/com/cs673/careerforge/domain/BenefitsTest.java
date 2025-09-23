package com.cs673.careerforge.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Benefits embedded entity.
 */
@DisplayName("Benefits Entity Tests")
class BenefitsTest {
    
    private Benefits benefits;
    
    @BeforeEach
    void setUp() {
        benefits = new Benefits("Employee Benefits", "[\"Health Insurance\", \"401K\", \"Flexible Hours\"]");
    }
    
    @Test
    @DisplayName("Should create benefits with valid data")
    void shouldCreateBenefitsWithValidData() {
        assertNotNull(benefits);
        assertEquals("Employee Benefits", benefits.getTitle());
        assertEquals("[\"Health Insurance\", \"401K\", \"Flexible Hours\"]", benefits.getBenefitsList());
    }
    
    @Test
    @DisplayName("Should create benefits with default constructor")
    void shouldCreateBenefitsWithDefaultConstructor() {
        Benefits defaultBenefits = new Benefits();
        assertNull(defaultBenefits.getTitle());
        assertNull(defaultBenefits.getBenefitsList());
    }
    
    @Test
    @DisplayName("Should set and get title correctly")
    void shouldSetAndGetTitleCorrectly() {
        benefits.setTitle("New Benefits Package");
        assertEquals("New Benefits Package", benefits.getTitle());
    }
    
    @Test
    @DisplayName("Should set and get benefits list correctly")
    void shouldSetAndGetBenefitsListCorrectly() {
        String newBenefitsList = "[\"Dental\", \"Vision\", \"PTO\"]";
        benefits.setBenefitsList(newBenefitsList);
        assertEquals(newBenefitsList, benefits.getBenefitsList());
    }
    
    @Test
    @DisplayName("Should handle null values correctly")
    void shouldHandleNullValuesCorrectly() {
        benefits.setTitle(null);
        benefits.setBenefitsList(null);
        
        assertNull(benefits.getTitle());
        assertNull(benefits.getBenefitsList());
    }
    
    @Test
    @DisplayName("Should handle empty strings correctly")
    void shouldHandleEmptyStringsCorrectly() {
        benefits.setTitle("");
        benefits.setBenefitsList("");
        
        assertEquals("", benefits.getTitle());
        assertEquals("", benefits.getBenefitsList());
    }
    
    @Test
    @DisplayName("Should implement equals correctly")
    void shouldImplementEqualsCorrectly() {
        Benefits benefits1 = new Benefits("Test Benefits", "[\"Test1\", \"Test2\"]");
        Benefits benefits2 = new Benefits("Test Benefits", "[\"Test1\", \"Test2\"]");
        Benefits benefits3 = new Benefits("Different Benefits", "[\"Test1\", \"Test2\"]");
        Benefits benefits4 = new Benefits("Test Benefits", "[\"Different\", \"List\"]");
        
        assertEquals(benefits1, benefits2);
        assertNotEquals(benefits1, benefits3);
        assertNotEquals(benefits1, benefits4);
        assertNotEquals(benefits1, null);
        assertNotEquals(benefits1, "not benefits");
    }
    
    @Test
    @DisplayName("Should implement hashCode correctly")
    void shouldImplementHashCodeCorrectly() {
        Benefits benefits1 = new Benefits("Test Benefits", "[\"Test1\", \"Test2\"]");
        Benefits benefits2 = new Benefits("Test Benefits", "[\"Test1\", \"Test2\"]");
        Benefits benefits3 = new Benefits("Different Benefits", "[\"Test1\", \"Test2\"]");
        
        assertEquals(benefits1.hashCode(), benefits2.hashCode());
        assertNotEquals(benefits1.hashCode(), benefits3.hashCode());
    }
    
    @Test
    @DisplayName("Should return correct string representation")
    void shouldReturnCorrectStringRepresentation() {
        String benefitsString = benefits.toString();
        
        assertTrue(benefitsString.contains("Employee Benefits"));
        assertTrue(benefitsString.contains("[\"Health Insurance\", \"401K\", \"Flexible Hours\"]"));
        assertTrue(benefitsString.contains("Benefits"));
    }
    
    @Test
    @DisplayName("Should handle JSON strings correctly")
    void shouldHandleJsonStringsCorrectly() {
        String jsonBenefits = "[\"Health Insurance\", \"Dental Insurance\", \"Vision Insurance\", \"401K Matching\", \"Paid Time Off\"]";
        benefits.setBenefitsList(jsonBenefits);
        
        assertEquals(jsonBenefits, benefits.getBenefitsList());
        assertTrue(benefits.getBenefitsList().contains("Health Insurance"));
        assertTrue(benefits.getBenefitsList().contains("Dental Insurance"));
    }
    
    @Test
    @DisplayName("Should handle special characters in title")
    void shouldHandleSpecialCharactersInTitle() {
        String specialTitle = "Benefits & Perks (2024)";
        benefits.setTitle(specialTitle);
        
        assertEquals(specialTitle, benefits.getTitle());
    }
    
    @Test
    @DisplayName("Should handle long benefits list")
    void shouldHandleLongBenefitsList() {
        String longBenefitsList = "[\"Health Insurance\", \"Dental Insurance\", \"Vision Insurance\", \"401K Matching\", \"Paid Time Off\", \"Sick Leave\", \"Maternity Leave\", \"Paternity Leave\", \"Flexible Hours\", \"Remote Work\", \"Professional Development\", \"Gym Membership\", \"Free Meals\", \"Transportation Allowance\"]";
        benefits.setBenefitsList(longBenefitsList);
        
        assertEquals(longBenefitsList, benefits.getBenefitsList());
        assertTrue(benefits.getBenefitsList().length() > 100);
    }
}
