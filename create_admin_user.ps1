# Admin foydalanuvchi yaratish
Write-Host "Admin foydalanuvchi yaratilmoqda..." -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:3010/api/auth/register"

$userData = @{
    username = "admin"
    email = "admin@warehouse.uz"
    password = "admin123"
    fullName = "Administrator"
    phone = "+998901234567"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $userData -ContentType "application/json"
    Write-Host "" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host " ADMIN YARATILDI!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login ma'lumotlari:" -ForegroundColor Yellow
    Write-Host "  Username: admin" -ForegroundColor Cyan
    Write-Host "  Password: admin123" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "http://localhost:8080/login.html ga o'ting!" -ForegroundColor Yellow
} catch {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Yellow
    Write-Host " ADMIN ALLAQACHON MAVJUD" -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Login ma'lumotlari:" -ForegroundColor Yellow
    Write-Host "  Username: admin" -ForegroundColor Cyan
    Write-Host "  Password: admin123" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "http://localhost:8080/login.html ga o'ting!" -ForegroundColor Yellow
}

Write-Host ""
pause
