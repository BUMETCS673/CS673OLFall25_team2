package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;

import static org.junit.jupiter.api.Assertions.*;

public class LoginTest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
    }

    @Test
    public void testBasicAuthLogin() {
        String username = "admin";
        String password = "admin123";

        // Inject credentials into the URL
        driver.get("http://" + username + ":" + password + "@localhost:8080/api/");

        // Get the page body text
        String bodyText = driver.findElement(By.tagName("body")).getText();

        // Assert that the expected message is present
        assertTrue(bodyText.contains("CareerForge API is up"),
                "Login failed or expected text not found in page body.");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
