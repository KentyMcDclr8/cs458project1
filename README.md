# Project Setup and Testing Instructions

## Setup Instructions

### Step 1: Install npm

Ensure that npm is installed on your local machine. If not, install it from [npm's official website](https://www.npmjs.com/get-npm).

### Step 2: Install Dependencies

After installing npm, run the following command in your project directory to install the necessary dependencies:`npm install`

### Step 3: Start the Application

To start the application, run: ` npm start`

### Step 4: Open the Application

Open a web browser and go to `localhost:3000` to view the application.

### Step 5: Testing Credentials

Use the following credentials for testing:

- **Email Login:**

  - EMAIL: `name@mail.com`
  - PASSWORD: `password`

- **Google Login:**
  - GOOGLE_EMAIL: `validationtest542@gmail.com`
  - GOOGLE_PASSWORD: `thiswillwork`

## Running Selenium Tests

### Step 1: Install Selenium and Python

Ensure that Python and Selenium are installed on your local machine. If not, follow the instructions to install Python from [Python's official website](https://www.python.org/downloads/) and Selenium using pip:`pip install selenium`

### Step 2: Start the Application

Make sure that your application is running locally by executing: ` npm start`

### Step 3: Run Selenium Tests

Navigate to the directory containing `selenium_tests.py` and run:`python selenium_tests.py`

This script will execute the Selenium tests and provide logs about the test results.

### Note

Ensure that you have started the application using `npm start` on your local machine before running `selenium_tests.py` to avoid any connection issues during testing.
