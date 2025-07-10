# PowerShell Testing Script for Profile Management
# Run these commands one by one in PowerShell

# 1. Register a user
$registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/register" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"username":"powershelluser","password":"password123","email":"ps@example.com","name":"PowerShell User"}'
Write-Host "Registration Response:" $registerResponse

# 2. Login to get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/login" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"username":"powershelluser","password":"password123"}'
$token = ($loginResponse | ConvertFrom-Json).token
Write-Host "Token:" $token

# 3. Get profile
$profileResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/profile" -Method Get -Headers @{"Authorization"="Bearer $token"}
Write-Host "Profile:" $profileResponse

# 4. Update profile
$updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/profile" -Method Put -Headers @{"Authorization"="Bearer $token";"Content-Type"="application/json"} -Body '{"name":"Updated PS User","email":"updated.ps@example.com"}'
Write-Host "Update Response:" $updateResponse

# 5. Get profile stats
$statsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/profile/stats" -Method Get -Headers @{"Authorization"="Bearer $token"}
Write-Host "Stats:" $statsResponse

# 6. Change password
$passwordResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/profile/change-password" -Method Post -Headers @{"Authorization"="Bearer $token";"Content-Type"="application/json"} -Body '{"currentPassword":"password123","newPassword":"newpass456","confirmPassword":"newpass456"}'
Write-Host "Password Change:" $passwordResponse
