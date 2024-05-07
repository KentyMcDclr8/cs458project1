import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import logging
from selenium.common.exceptions import TimeoutException

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

TEST_EMAIL = "name@mail.com"
TEST_PASSWORD = "password"

GOOGLE_EMAIL = "validationtest542@gmail.com"
GOOGLE_PASSWORD = "thiswillwork"

class LoginTestCases(unittest.TestCase):

    def setUp(self):
        # Initialize webdriver and open the web page
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000")
        
    def test_invalid_credentials_direct_login(self):
        """Test direct login with invalid credentials and verify error message."""
        logging.info("Test: Invalid Credentials Direct Login")
        self.driver.find_element(By.ID, "email").send_keys("wrong@example.com")
        self.driver.find_element(By.ID, "password").send_keys("incorrect")
        self.driver.find_element(By.TAG_NAME, "button").click()
        error = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "MuiAlert-message")))
        result = "Invalid email address or password." in error.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_empty_fields(self):
        """Leave the login fields empty and attempt to login, verifying error messages."""
        logging.info("Test: Empty Fields")
        self.driver.find_element(By.TAG_NAME, "button").click()
        error = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "MuiAlert-message")))
        result = "Please fill in all fields." in error.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_wrong_email_format(self):
        """Enter an email in incorrect format and verify the error message."""
        logging.info("Test: Wrong Email Format")
        self.driver.find_element(By.ID, "email").send_keys("userat@example")
        self.driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
        self.driver.find_element(By.TAG_NAME, "button").click()
        error = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "MuiAlert-message")))
        result = "Please enter a valid email address." in error.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_valid_credentials_direct_login(self):
        """Use valid credentials for direct login and ensure successful redirection."""
        logging.info("Test: Valid Credentials Direct Login")
        self.driver.find_element(By.ID, "email").send_keys(TEST_EMAIL)
        self.driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
        self.driver.find_element(By.TAG_NAME, "button").click()
        WebDriverWait(self.driver, 10).until(EC.url_to_be("http://localhost:3000/distance-to-sun"))
        result = "distance-to-sun" in self.driver.current_url
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_valid_credentials_google_login(self):
        """Successfully login using a Google account linked to the system."""
        logging.info("Test: Google Login")


        # Click on the Google login button. Adjust the selector as needed.
        self.driver.find_element(By.ID, "google_login_button").click()


        # Assuming a new window or tab is opened for Google login, switch to it
        self.driver.switch_to.window(self.driver.window_handles[1])


        # Wait for email field and enter the email
        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "identifierId")))
        self.driver.find_element(By.ID, "identifierId").send_keys(GOOGLE_EMAIL)
        self.driver.find_element(By.ID, "identifierNext").click()


        # Wait for password field and enter the password
        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.NAME, "password")))
        self.driver.find_element(By.NAME, "password").send_keys(GOOGLE_PASSWORD)
        self.driver.find_element(By.ID, "passwordNext").click()


        # Switch back to the original window/tab
        self.driver.switch_to.window(self.driver.window_handles[0])


        # Wait for redirection and verification of successful login
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Logout']"))
        )
        logout_button = self.driver.find_element(By.XPATH, "//button[text()='Logout']")
        self.assertTrue(logout_button.is_displayed(), "Google Login failed")

    def test_direct_access_distance_to_sun(self):
        """Attempt to navigate directly to /distance-to-sun without logging in and verify access denial."""
        logging.info("Test: Direct Access to Distance to Sun Page Without Login")
        self.driver.get("http://localhost:3000/distance-to-sun")
        # Expecting some form of redirect or warning, not direct access to page content.
        try:
            element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "h5"))
            )
            self.assertIn("Welcome", element.text)
            self.assertTrue(False, "Was not supposed to have direct access without login.")
        except TimeoutException:
            logging.info("Properly redirected or blocked, no direct access without login.")
            self.assertTrue(True)

    def test_timeout_check(self):
        """Perform 10 login requests in succession and verify average response time is within acceptable limits."""
        logging.info("Test: Timeout Check")
        total_time = 0
        for _ in range(10):
            start_time = time.time()
            self.driver.get("http://localhost:3000")
            self.driver.find_element(By.ID, "email").send_keys("test@example.com")
            self.driver.find_element(By.ID, "password").send_keys("testpass")
            self.driver.find_element(By.TAG_NAME, "button").click()
            WebDriverWait(self.driver, 10).until(
                EC.url_changes("http://localhost:3000/distance-to-sun")
            )
            end_time = time.time()
            total_time += (end_time - start_time)
        average_time = total_time / 10
        logging.info(f"Average Response Time: {average_time}s")
        self.assertTrue(average_time < 5, "Average login time should be less than 5 seconds")

    def test_element_display(self):
        """Verify all UI elements are correctly displayed across different browsers."""
        logging.info("Test: Element Display Across Browsers")
        email_field_displayed = self.driver.find_element(By.ID, "email").is_displayed()
        password_field_displayed = self.driver.find_element(By.ID, "password").is_displayed()
        login_button_displayed = self.driver.find_element(By.TAG_NAME, "button").is_displayed()
        self.assertTrue(email_field_displayed and password_field_displayed and login_button_displayed, "UI elements display test failed")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()

