from appium import webdriver
from appium.webdriver.common.mobileby import MobileBy
import time

# Desired capabilities for the mobile device and app
desired_caps = {
    "platformName": "Android",  # or 'iOS'
    "deviceName": "emulator-5554",  # use 'iOS Simulator' for iOS
    "app": "/path/to/your/app.apk",  # path to your app file
    "automationName": "UiAutomator2",  # use 'XCUITest' for iOS
}

# List of credentials to test
credentials = [
    {"email": "invalidemail1@example.com", "password": "wrongpassword1"},
    {"email": "invalidemail2@example.com", "password": "wrongpassword2"},
    {"email": "invalidemail3@example.com", "password": "wrongpassword3"},
]

driver = webdriver.Remote("http://localhost:4723/wd/hub", desired_caps)

try:
    for cred in credentials:
        # Wait for the app to load (you should replace this with an explicit wait)
        time.sleep(2)

        # Locate the email input field and enter an email
        email_input = driver.find_element(MobileBy.ID, "com.yourpackage.name:id/email")
        email_input.clear()  # Clear previous input
        email_input.send_keys(cred["email"])

        # Locate the password input field and enter a password
        password_input = driver.find_element(MobileBy.ID, "com.yournpackage.name:id/password")
        password_input.clear()  # Clear previous input
        password_input.send_keys(cred["password"])

        # Locate the "Sign In" button and click it
        sign_in_button = driver.find_element(MobileBy.XPATH, '//android.widget.Button[contains(@text, "Sign In")]')
        sign_in_button.click()

        time.sleep(2)

        # Here, you can check for a response or error message to determine the result of the login attempt
        try:
            error_message = driver.find_element(MobileBy.XPATH, '//android.widget.TextView[contains(@text, "error")]')
            print(f"Login attempt with {cred['email']} failed: {error_message.text}")
        except:
            print(f"Login attempt with {cred['email']} might have succeeded or no error message found.")

finally:
    # Close the Appium session
    driver.quit()
