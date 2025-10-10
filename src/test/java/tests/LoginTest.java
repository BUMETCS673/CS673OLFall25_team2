package tests;

//100% Human written

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class LoginTest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() throws IOException {
        WebDriverManager.chromedriver().setup();

        // Create a unique temporary profile directory for Chrome
        Path tempProfile = Files.createTempDirectory("chrome-profile");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--user-data-dir=" + tempProfile.toAbsolutePath());

        driver = new ChromeDriver(options);
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
