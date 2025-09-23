package com.cs673.careerforge.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Values embedded entity.
 */
@DisplayName("Values Entity Tests")
class ValuesTest {
    
    private Values values;
    
    @BeforeEach
    void setUp() {
        values = new Values("Company Values", "[\"Innovation\", \"Collaboration\", \"Growth\"]");
    }
    
    @Test
    @DisplayName("Should create values with valid data")
    void shouldCreateValuesWithValidData() {
        assertNotNull(values);
        assertEquals("Company Values", values.getTitle());
        assertEquals("[\"Innovation\", \"Collaboration\", \"Growth\"]", values.getValuesList());
    }
    
    @Test
    @DisplayName("Should create values with default constructor")
    void shouldCreateValuesWithDefaultConstructor() {
        Values defaultValues = new Values();
        assertNull(defaultValues.getTitle());
        assertNull(defaultValues.getValuesList());
    }
    
    @Test
    @DisplayName("Should set and get title correctly")
    void shouldSetAndGetTitleCorrectly() {
        values.setTitle("Our Core Values");
        assertEquals("Our Core Values", values.getTitle());
    }
    
    @Test
    @DisplayName("Should set and get values list correctly")
    void shouldSetAndGetValuesListCorrectly() {
        String newValuesList = "[\"Integrity\", \"Excellence\", \"Teamwork\"]";
        values.setValuesList(newValuesList);
        assertEquals(newValuesList, values.getValuesList());
    }
    
    @Test
    @DisplayName("Should handle null values correctly")
    void shouldHandleNullValuesCorrectly() {
        values.setTitle(null);
        values.setValuesList(null);
        
        assertNull(values.getTitle());
        assertNull(values.getValuesList());
    }
    
    @Test
    @DisplayName("Should handle empty strings correctly")
    void shouldHandleEmptyStringsCorrectly() {
        values.setTitle("");
        values.setValuesList("");
        
        assertEquals("", values.getTitle());
        assertEquals("", values.getValuesList());
    }
    
    @Test
    @DisplayName("Should implement equals correctly")
    void shouldImplementEqualsCorrectly() {
        Values values1 = new Values("Test Values", "[\"Value1\", \"Value2\"]");
        Values values2 = new Values("Test Values", "[\"Value1\", \"Value2\"]");
        Values values3 = new Values("Different Values", "[\"Value1\", \"Value2\"]");
        Values values4 = new Values("Test Values", "[\"Different\", \"Values\"]");
        
        assertEquals(values1, values2);
        assertNotEquals(values1, values3);
        assertNotEquals(values1, values4);
        assertNotEquals(values1, null);
        assertNotEquals(values1, "not values");
    }
    
    @Test
    @DisplayName("Should implement hashCode correctly")
    void shouldImplementHashCodeCorrectly() {
        Values values1 = new Values("Test Values", "[\"Value1\", \"Value2\"]");
        Values values2 = new Values("Test Values", "[\"Value1\", \"Value2\"]");
        Values values3 = new Values("Different Values", "[\"Value1\", \"Value2\"]");
        
        assertEquals(values1.hashCode(), values2.hashCode());
        assertNotEquals(values1.hashCode(), values3.hashCode());
    }
    
    @Test
    @DisplayName("Should return correct string representation")
    void shouldReturnCorrectStringRepresentation() {
        String valuesString = values.toString();
        
        assertTrue(valuesString.contains("Company Values"));
        assertTrue(valuesString.contains("[\"Innovation\", \"Collaboration\", \"Growth\"]"));
        assertTrue(valuesString.contains("Values"));
    }
    
    @Test
    @DisplayName("Should handle JSON strings correctly")
    void shouldHandleJsonStringsCorrectly() {
        String jsonValues = "[\"Innovation\", \"Collaboration\", \"Growth\", \"Diversity\", \"Inclusion\", \"Transparency\"]";
        values.setValuesList(jsonValues);
        
        assertEquals(jsonValues, values.getValuesList());
        assertTrue(values.getValuesList().contains("Innovation"));
        assertTrue(values.getValuesList().contains("Diversity"));
    }
    
    @Test
    @DisplayName("Should handle special characters in title")
    void shouldHandleSpecialCharactersInTitle() {
        String specialTitle = "Values & Principles (2024)";
        values.setTitle(specialTitle);
        
        assertEquals(specialTitle, values.getTitle());
    }
    
    @Test
    @DisplayName("Should handle long values list")
    void shouldHandleLongValuesList() {
        String longValuesList = "[\"Innovation\", \"Collaboration\", \"Growth\", \"Diversity\", \"Inclusion\", \"Transparency\", \"Accountability\", \"Excellence\", \"Integrity\", \"Respect\", \"Empowerment\", \"Sustainability\"]";
        values.setValuesList(longValuesList);
        
        assertEquals(longValuesList, values.getValuesList());
        assertTrue(values.getValuesList().length() > 100);
    }
    
    @Test
    @DisplayName("Should handle empty JSON array")
    void shouldHandleEmptyJsonArray() {
        String emptyArray = "[]";
        values.setValuesList(emptyArray);
        
        assertEquals(emptyArray, values.getValuesList());
    }
    
    @Test
    @DisplayName("Should handle single value in array")
    void shouldHandleSingleValueInArray() {
        String singleValue = "[\"Innovation\"]";
        values.setValuesList(singleValue);
        
        assertEquals(singleValue, values.getValuesList());
    }
}
