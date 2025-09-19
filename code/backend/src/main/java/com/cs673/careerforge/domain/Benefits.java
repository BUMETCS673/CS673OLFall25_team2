package com.cs673.careerforge.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;

/**
 * Embedded class representing company benefits.
 */
@Embeddable
public class Benefits {
    
    @Size(max = 200, message = "Benefits title must not exceed 200 characters")
    @Column(name = "benefits_title", length = 200)
    private String title;
    
    @Column(name = "benefits_list", columnDefinition = "TEXT")
    private String benefitsList; // JSON string of benefits array
    
    // Constructors
    public Benefits() {}
    
    public Benefits(String title, String benefitsList) {
        this.title = title;
        this.benefitsList = benefitsList;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getBenefitsList() {
        return benefitsList;
    }
    
    public void setBenefitsList(String benefitsList) {
        this.benefitsList = benefitsList;
    }
    
    @Override
    public String toString() {
        return "Benefits{" +
                "title='" + title + '\'' +
                ", benefitsList='" + benefitsList + '\'' +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Benefits benefits = (Benefits) o;
        return java.util.Objects.equals(title, benefits.title) && 
               java.util.Objects.equals(benefitsList, benefits.benefitsList);
    }
    
    @Override
    public int hashCode() {
        return java.util.Objects.hash(title, benefitsList);
    }
}
