package tests;

//100% Human written

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
        String username = "qastaceytest@test.com";
        String password = "Password123";

        driver.navigate().to("http://cs673olfall25-team2.onrender.com");

        driver.findElement(By.xpath("//button")).click();

        driver.findElement(By.name("username")).sendKeys(username);
        driver.findElement(By.name("password")).sendKeys(password);

        // Get the page body text
        boolean careerForgeHomePageVisible = driver.findElement(By.className("logo-image")).isDisplayed();

        // Assert that the expected message is present
        assertTrue(careerForgeHomePageVisible,
                "Login failed or expected text not found in page body.");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
