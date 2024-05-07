import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import logging
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options

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
        self.pages = {
            "login": "http://localhost:3000/login",
            "distance_to_sun": "http://localhost:3000/distance-to-sun",
            "nearest_sea": "http://localhost:3000/nearest-sea"
        }
        
    def test_invalid_credentials_direct_login(self):
        """Test direct login with invalid credentials and verify error message."""
        logging.info("Test: Invalid Credentials Direct Login")
        self.driver.find_element(By.ID, "email").send_keys("wrong@example.com")
        self.driver.find_element(By.ID, "password").send_keys("incorrect")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()
        error = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'MuiAlert-message')]"))
        )
        result = "Invalid email address or password." in error.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_empty_fields(self):
        """Leave the login fields empty and attempt to login, verifying error messages."""
        logging.info("Test: Empty Fields")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()
        error = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'MuiAlert-message') and contains(text(), 'Please fill in all fields.')]"))
        )
        result = "Please fill in all fields." in error.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_wrong_email_format(self):
        """Enter an email in incorrect format and verify the error message."""
        logging.info("Test: Wrong Email Format")
        self.driver.find_element(By.ID, "email").send_keys("userat@example")
        self.driver.find_element(By.ID, "password").send_keys("password123")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()
        error = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'MuiAlert-message') and contains(text(), 'Please enter a valid email address.')]"))
        )
        result = "Please enter a valid email address." in error.text
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_valid_credentials_direct_login(self):
        """Use valid credentials for direct login and ensure successful redirection."""
        logging.info("Test: Valid Credentials Direct Login")
        self.driver.find_element(By.ID, "email").send_keys("name@mail.com")
        self.driver.find_element(By.ID, "password").send_keys("password")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()
        WebDriverWait(self.driver, 10).until(EC.url_to_be("http://localhost:3000/distance-to-sun"))
        result = "distance-to-sun" in self.driver.current_url
        logging.info(f"Test Result: {'Success' if result else 'Failure'}")
        self.assertTrue(result)

    def test_location_enabled_nearest_sea(self):
        """Test that the app retrieves and displays GPS coordinates and calculates distance when location services are enabled."""
        logging.info("Test: Location Enabled")
        try:
            self.driver.get("http://localhost:3000/nearest-sea")
            coordinates_display = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Your GPS Coordinates')]"))
            )
            distance_display = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Distance:')]"))
            )
            self.assertTrue(coordinates_display.is_displayed() and distance_display.is_displayed())
        except TimeoutException:
            self.fail("Failed to retrieve or display location and distance information.")

    def test_location_disabled(self):
        """Test that the app provides a specific error message when location services are disabled."""
        logging.info("Test: Location Disabled")
        
        # Set up Chrome options to disable geolocation specifically for this test
        chrome_options = Options()
        chrome_options.add_experimental_option("prefs", {
            "profile.default_content_setting_values.geolocation": 2,  # Block geolocation
        })

        # Reinitialize the driver with these options
        self.driver.quit()  # First, close the existing driver
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.get("http://localhost:3000/nearest-sea")

        # Check for the presence of the error message
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Enable GPS and Try Again')]"))
        )
        self.assertTrue(error_message.is_displayed(), "GPS disable error message was not displayed")

    def test_distance_calculation_accuracy(self):
        """Check if the calculated distance changes and is correct after changing location."""
        
        self.driver.get("http://localhost:3000/nearest-sea")
        
        initial_distance = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//div[contains(text(), 'Distance:')]"))
        ).text

        # Change location to a new set of coordinates
        self.driver.execute_cdp_cmd("Emulation.setGeolocationOverride", {
            "latitude": 40.7128,
            "longitude": -74.0060,
            "accuracy": 100
        })
        
        self.driver.get("http://localhost:3000/nearest-sea")

        new_distance = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//div[contains(text(), 'Distance:')]"))
        ).text

        # Verify that the distance string has changed, indicating a recalculation
        self.assertNotEqual(initial_distance, new_distance, "The distances should not be equal after changing locations.")

    def test_direct_access_nearest_sea(self):
        """Attempt to navigate directly to /nearest-sea without logging in and verify access denial."""
        logging.info("Test: Direct Access to Nearest Sea Without Login")
        
        self.driver.get("http://localhost:3000/nearest-sea")
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

    def login_then_logout(self):
        """Helper function to log in and then log out."""
        self.driver.find_element(By.ID, "email").send_keys("valid@example.com")
        self.driver.find_element(By.ID, "password").send_keys("validpassword")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()
        WebDriverWait(self.driver, 10).until(
            EC.url_to_be("http://localhost:3000/distance-to-sun")
        )
        # Log out
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]").click()
        WebDriverWait(self.driver, 10).until(
            EC.url_to_be("http://localhost:3000/login")
        )

    def test_access_after_logout_nearest_sea(self):
        """Test if /nearest-sea can be accessed after logging in and then logging out."""
        logging.info("Test: Access Nearest Sea After Logout")
        self.login_then_logout()
        self.driver.get("http://localhost:3000/nearest-sea")
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "h5"))
            )
            self.fail("Was not supposed to have direct access after logout.")
        except TimeoutException:
            logging.info("Successfully blocked access to Nearest Sea page after logout.")

    def test_access_after_logout_distance_to_sun(self):
        """Test if /distance-to-sun can be accessed after logging in and then logging out."""
        logging.info("Test: Access Distance to Sun After Logout")
        self.login_then_logout()
        self.driver.get("http://localhost:3000/distance-to-sun")
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "h5"))
            )
            self.fail("Was not supposed to have direct access after logout.")
        except TimeoutException:
            logging.info("Successfully blocked access to Distance to Sun page after logout.")

    def test_performance_of_pages(self):
        """Test load times of pages to ensure they load within 5 seconds."""
        for name, url in self.pages.items():
            total_load_time = 0
            for _ in range(10):
                start_time = time.time()
                self.driver.get(url)
                WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                total_load_time += time.time() - start_time
            average_load_time = total_load_time / 10
            print(f"Average load time for {name}: {average_load_time} seconds")
            self.assertTrue(average_load_time < 5, f"{name} page load time exceeded 5 seconds.")

    def test_element_display_across_devices(self):
        """Check if all elements are displayed correctly on different device screens."""
        screen_sizes = {
            "laptop": (1366, 768),
            "mobile": (375, 667)  # iPhone 8 size
        }
        elements_to_check = ["email", "password", "button"]  
        for name, url in self.pages.items():
            for device, size in screen_sizes.items():
                self.driver.set_window_size(*size)
                self.driver.get(url)
                for element in elements_to_check:
                    display_check = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.ID, element))
                    )
                    self.assertTrue(display_check.is_displayed(), f"{element} not displayed on {device} at {name}")

    def test_location_disabled_distance_to_sun(self):
        """Test that the app still loads with empty coordinate fields when location is disabled."""
        # Simulate location disabled by rejecting the alert
        self.driver.get("http://localhost:3000/distance-to-sun")
        WebDriverWait(self.driver, 10).until(
            EC.alert_is_present()
        )
        alert = self.driver.switch_to.alert
        alert.dismiss()

        # Check for empty coordinate fields
        lat = self.driver.find_element(By.NAME, "lat").get_attribute('value')
        lng = self.driver.find_element(By.NAME, "lng").get_attribute('value')
        self.assertEqual(lat, "")
        self.assertEqual(lng, "")
        
    def test_location_enabled_distance_to_sun(self):
        """Test distance calculation on manual entry of valid coordinates."""
        self.driver.get("http://localhost:3000/distance-to-sun")
        # Manually enter valid coordinates
        self.driver.find_element(By.NAME, "lat").send_keys("45")
        self.driver.find_element(By.NAME, "lng").send_keys("90")
        self.driver.find_element(By.TAG_NAME, "button").click()  # Assuming button to calculate
        
        # Check if distance is calculated and displayed
        distance = self.driver.find_element(By.XPATH, "//p[contains(text(), 'Distance')]").text
        self.assertNotIn("Please enter coordinates", distance)

    def test_manual_entry_valid_coordinates_distance_to_sun(self):
        """Test distance calculation on manual entry of valid coordinates."""
        self.driver.get("http://localhost:3000/distance-to-sun")
        # Manually enter valid coordinates
        self.driver.find_element(By.NAME, "lat").send_keys("45")
        self.driver.find_element(By.NAME, "lng").send_keys("90")
        self.driver.find_element(By.TAG_NAME, "button").click()  # Assuming button to calculate
        
        # Check if distance is calculated and displayed
        distance = self.driver.find_element(By.XPATH, "//p[contains(text(), 'Distance')]").text
        self.assertNotIn("Please enter coordinates", distance)

    def test_invalid_longitude_values(self):
        """Test error message for longitude values outside the valid range (-180 to 180)."""
        self.driver.get("http://localhost:3000/distance-to-sun")

        # Assume login is already handled and you are at the required page
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, 'lat'))
        )
        self.driver.find_element(By.NAME, "lat").clear()
        self.driver.find_element(By.NAME, "lat").send_keys("45")  # Valid latitude
        self.driver.find_element(By.NAME, "lng").clear()
        self.driver.find_element(By.NAME, "lng").send_keys("200")  # Invalid longitude
        self.driver.find_element(By.TAG_NAME, "button").click()  # Assuming a button to calculate

        error_message = self.driver.find_element(By.CSS_SELECTOR, "p[color='error']").text
        self.assertIn("Longitude must be between -180 and 180 degrees.", error_message)

    def test_invalid_latitude_values(self):
        """Test error message for latitude values outside the valid range (-90 to 90)."""
        self.driver.get("http://localhost:3000/distance-to-sun")

        # Assume login is already handled and you are at the required page
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, 'lat'))
        )
 
        self.driver.find_element(By.NAME, "lat").clear()
        self.driver.find_element(By.NAME, "lat").send_keys("100")  # Invalid latitude
        self.driver.find_element(By.NAME, "lng").clear()
        self.driver.find_element(By.NAME, "lng").send_keys("90")  # Valid longitude
        self.driver.find_element(By.TAG_NAME, "button").click()

        error_message = self.driver.find_element(By.CSS_SELECTOR, "p[color='error']").text
        self.assertIn("Latitude must be between -90 and 90 degrees.", error_message)

    def test_string_values_in_coordinates(self):
        """Test error message when entering string values in coordinate fields."""
        self.driver.get("http://localhost:3000/distance-to-sun")

        # Assume login is already handled and you are at the required page
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, 'lat'))
        )
        self.driver.find_element(By.NAME, "lat").clear()
        self.driver.find_element(By.NAME, "lat").send_keys("ninety")  # String instead of numeric latitude
        self.driver.find_element(By.NAME, "lng").clear()
        self.driver.find_element(By.NAME, "lng").send_keys("one eighty")  # String instead of numeric longitude
        self.driver.find_element(By.TAG_NAME, "button").click()

        error_message = self.driver.find_element(By.CSS_SELECTOR, "p[color='error']").text
        self.assertIn("Coordinates must be numeric.", error_message)
        
    def test_element_display_across_devices(self):
        """Check if all elements are displayed and responsive correctly on different device screens."""
        elements_to_check = {
            "login": ["email", "password", "button"],
            "distance_to_sun": ["lat", "lng", "button"],
            "nearest_sea": ["lat", "lng", "button"]
        }
        for name, url in self.pages.items():
            self.driver.get(url)
            for device, size in self.screen_sizes.items():
                self.driver.set_window_size(*size)
                for element_id in elements_to_check[name]:
                    element = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.ID, element_id))
                    )
                    self.assertTrue(element.is_displayed(), f"{element_id} not displayed on {device} at {name}")
                    # Check if elements are interactable
                    try:
                        element.click()  # Attempt to interact with the element
                        WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable((By.ID, element_id)))
                    except TimeoutException:
                        self.fail(f"{element_id} at {name} on {device} screen is not responsive")
        
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()



