import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

TEST_EMAIL = "name@mail.com"
TEST_PASSWORD = "password"

class LoginTestCases(unittest.TestCase):

    def setUp(self):
        # Initialize webdriver and open the web page
        self.driver = webdriver.Chrome()
        self.driver.get("http://127.0.0.1:5500")

    def test_invalid_credentials_direct_login(self):
        """Test direct login with invalid credentials and verify error message."""
        logging.info("Test: Invalid Credentials Direct Login")
        self.driver.find_element(By.ID, "email").send_keys("wrong@example.com")
        self.driver.find_element(By.ID, "password").send_keys("incorrect")
        self.driver.find_element(By.TAG_NAME, "button").click()
        alert = self.driver.switch_to.alert
        result = "Invalid email address or password." in alert.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)
        alert.accept()

    def test_empty_fields(self):
        """Leave the login fields empty and attempt to login, verifying error messages."""
        logging.info("Test: Empty Fields")
        self.driver.find_element(By.TAG_NAME, "button").click()
        alert = self.driver.switch_to.alert
        result = "Please fill in all fields." in alert.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)
        alert.accept()

    def test_wrong_email_format(self):
        """Enter an email in incorrect format and verify the error message."""
        logging.info("Test: Wrong Email Format")
        self.driver.find_element(By.ID, "email").send_keys("userat@example")
        self.driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
        self.driver.find_element(By.TAG_NAME, "button").click()
        alert = self.driver.switch_to.alert
        result = "Please enter a valid email address." in alert.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)
        alert.accept()

    # def test_google_facebook_login_unlinked_account(self):
    #     """Attempt to login using Google or Facebook with an unlinked account and verify error messages."""
    #     pass

    def test_valid_credentials_direct_login(self):
        """Use valid credentials for direct login and ensure successful login."""
        logging.info("Test: Valid Credentials Direct Login")
        self.driver.find_element(By.ID, "email").send_keys(TEST_EMAIL)
        self.driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
        self.driver.find_element(By.TAG_NAME, "button").click()
        success_message = self.driver.find_element(By.TAG_NAME, "h2").text
        result = "Login Successful" in success_message
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    # def test_valid_credentials_google_facebook_login(self):
    #     """Successfully login using a Google or Facebook account linked to the system."""
    #     pass

    def test_direct_access_success_page(self):
        """Attempt to navigate directly to /success.html without logging in and verify access denial."""
        logging.info("Test: Direct Access to Success Page")
        self.driver.get("http://127.0.0.1:5500")
        try:
            self.driver.find_element(By.ID, "email").send_keys(TEST_EMAIL)
            self.driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
            self.driver.find_element(By.TAG_NAME, "button").click()
            logout_button = self.driver.find_element(By.XPATH, "//button[text()='Logout']")
            logout_button.click()
            self.driver.get("http://127.0.0.1:5500/success.html")
        except:
            logging.info("Logout button not found; proceeding with alert check")
        
        alert = self.driver.switch_to.alert
        result = "Login before accessing the Success Page" in alert.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)
        alert.accept()

    def test_timeout_check(self):
        """Perform 10 login requests in succession and verify average response time is within acceptable limits."""
        logging.info("Test: Timeout Check")
        total_time = 0
        for _ in range(10):
            start_time = time.time()
            self.driver.get("http://127.0.0.1:5500")
            # Wait for the email element to be present before interacting
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            self.driver.find_element(By.ID, "email").send_keys(TEST_EMAIL)
            self.driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
            self.driver.find_element(By.TAG_NAME, "button").click()
            # Wait for the logout button to be present before attempting to click it
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//button[text()='Logout']"))
            )
            logout_button = self.driver.find_element(By.XPATH, "//button[text()='Logout']")
            logout_button.click()
            end_time = time.time()
            total_time += (end_time - start_time)
        average_time = total_time / 10
        logging.info(f"Test Result: {'Success' if average_time < 5 else 'Failure'} - Average time: {average_time}")
        self.assertTrue(average_time < 5, "Average login time should be less than 5 seconds")

    def test_element_display(self):
        """Verify all UI elements are correctly displayed across different browsers."""
        # Assuming email, password fields, and login button are present in all test cases
        logging.info("Test: Element Display Across Browsers")
        email_field_displayed = self.driver.find_element(By.ID, "email").is_displayed()
        password_field_displayed = self.driver.find_element(By.ID, "password").is_displayed()
        login_button_displayed = self.driver.find_element(By.TAG_NAME, "button").is_displayed()
        
        result = email_field_displayed and password_field_displayed and login_button_displayed
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result, "UI elements display test failed")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()

