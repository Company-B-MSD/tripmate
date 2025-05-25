# Tripmate Project Setup Guide

This guide provides step-by-step instructions to set up and run the Tripmate project, including the FastAPI backend and Spring Boot chatbot backend, and testing the API using Postman.

## Prerequisites
- Git installed on your system
- Visual Studio Code (VS Code) installed
- IntelliJ IDEA (or another IDE for Spring Boot) installed
- Python and `pip` installed
- Postman installed
- PowerShell (for Windows users to activate the virtual environment)

## Setup Instructions

### 1. Clone the Repository
Clone the Tripmate repository to your local machine using the following command:
```bash
git clone https://github.com/Company-B-MSD/tripmate.git
```

### 2. Set Up the Grok Folder
1. Navigate to the `grok` folder in the cloned repository.
2. Open the `grok` folder in Visual Studio Code:
   ```bash
   cd grok
   code .
   ```
3. Install the required dependencies by running the following command in the VS Code terminal:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Create and Activate a Virtual Environment
1. Create a virtual environment (if not already created) and activate it using PowerShell. Run the following commands:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\env\Scripts\Activate.ps1
   ```
   After activation, you should see the virtual environment name (e.g., `(env)`) in your terminal prompt.

### 4. Run the FastAPI Endpoint
1. In the VS Code terminal (with the virtual environment activated), start the FastAPI server using the following command:
   ```bash
   uvicorn main:app --reload --port 8001
   ```
2. You should see the following output indicating the server is running:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
   ```

### 5. Set Up the Chatbot Backend
1. Open the `chatbot_backend` folder in IntelliJ IDEA (or your preferred IDE for Spring Boot):
   - In IntelliJ IDEA, select `File > Open`, then navigate to the `chatbot_backend` folder and click `Open`.
2. Install the relevant dependencies for the Spring Boot project:
   - If using Maven, IntelliJ IDEA will automatically download dependencies defined in `pom.xml`.
   - If using Gradle, IntelliJ IDEA will automatically download dependencies defined in `build.gradle`.
   - Ensure all dependencies are resolved before proceeding.
3. Run the Spring Boot application:
   - In IntelliJ IDEA, locate the main application class (e.g., `ChatbotBackendApplication.java`) and click the green "Run" button, or use the command:
     ```bash
     mvn spring-boot:run
     ```
     (if using Maven).

### 6. Test the API Using Postman
1. Open Postman and create a new request.
2. Set the request method to `POST`.
3. Enter the following URL in the request bar:
   ```
   http://localhost:8081/api/chat
   ```
4. Go to the `Body` tab, select `raw`, and set the format to `JSON`.
5. Enter the following JSON payload in the body:
   ```json
   {
     "query": "Hello, please recommend me hotel booking websites"
   }
   ```
6. Click the `Send` button to make the request.
7. You should see the response from the chatbot in the Postman response section.

## Notes
- Ensure both the FastAPI server (on port 8001) and the Spring Boot application (on port 8081) are running simultaneously.
- If you encounter any port conflicts, adjust the port numbers accordingly in the respective configuration files.
- Press `CTRL+C` in the terminal to stop the FastAPI server when done.

## Troubleshooting
- If the virtual environment activation fails, ensure you have the correct path to `env\Scripts\Activate.ps1` and that PowerShell execution policies are set correctly.
- If dependencies fail to install, verify that your Python and `pip` versions are compatible with the requirements listed in `requirements.txt`.
- If the Spring Boot application fails to start, check for errors in the IntelliJ IDEA console and ensure all dependencies are correctly resolved.