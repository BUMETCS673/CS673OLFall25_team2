package tests;

//100% Human written

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class RegisterTest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
    }

    @Test
    public void testRegisterLoginDuplicate() {
        String name = "Stacey Test";
        String email = "qastaceytest@test.com";
        String password = "Password123";

        driver.navigate().to("http://cs673olfall25-team2.onrender.com");

        driver.findElement(By.xpath("//span[text()='Register']")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("name")));


        driver.findElement(By.name("name")).sendKeys(name);
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);

        driver.findElement(By.xpath("//button")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));

        String alertMessageText = driver.findElement(By.xpath("//div[@role='alert']")).getText();

        // Assert that the expected alert message is present
        assertTrue(alertMessageText.contains("This email is already registered"),
                "Did not see error message for duplciate login");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
}
}
