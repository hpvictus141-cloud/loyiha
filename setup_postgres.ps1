# PostgreSQL sozlash va warehouse_db yaratish
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Setup - warehouse_db yaratish" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL yo'lini tekshirish
$pgPath = "C:\Program Files\PostgreSQL\16\bin"
if (-not (Test-Path "$pgPath\psql.exe")) {
    Write-Host "XATOLIK: PostgreSQL topilmadi!" -ForegroundColor Red
    Write-Host "Yo'l: $pgPath" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "✓ PostgreSQL topildi" -ForegroundColor Green
Write-Host ""

# Xizmatni tekshirish
Write-Host "PostgreSQL xizmatini tekshirish..." -ForegroundColor Yellow
$service = Get-Service -Name "postgresql-x64-16" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "✓ PostgreSQL server ishlab turibdi" -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL serverni ishga tushirish..." -ForegroundColor Yellow
        Start-Service -Name "postgresql-x64-16"
        Start-Sleep -Seconds 3
        Write-Host "✓ PostgreSQL server ishga tushdi" -ForegroundColor Green
    }
} else {
    Write-Host "✗ PostgreSQL xizmati topilmadi" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PAROL KIRITISH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PostgreSQL o'rnatishda belgilagan parolingizni kiriting." -ForegroundColor Yellow
Write-Host "Agar esda bo'lmasa, quyidagilarni sinab ko'ring:" -ForegroundColor Gray
Write-Host "  - postgres" -ForegroundColor Gray
Write-Host "  - postgres123" -ForegroundColor Gray
Write-Host "  - admin123" -ForegroundColor Gray
Write-Host ""

# Parol kiritish
$attempt = 0
$maxAttempts = 5
$dbCreated = $false

while ($attempt -lt $maxAttempts -and -not $dbCreated) {
    $attempt++
    Write-Host "Urinish $attempt/$maxAttempts" -ForegroundColor Cyan
    $password = Read-Host "Parol" -AsSecureString
    
    # SecureString ni oddiy string ga aylantirish
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    $env:PGPASSWORD = $plainPassword
    
    Write-Host "Ulanmoqda..." -ForegroundColor Yellow
    
    # Bazani yaratish
    $output = & "$pgPath\psql.exe" -U postgres -c "CREATE DATABASE warehouse_db;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ MUVAFFAQIYAT!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "warehouse_db bazasi yaratildi!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Parolingiz: $plainPassword" -ForegroundColor Yellow
        Write-Host "Bu parolni eslab qoling!" -ForegroundColor Yellow
        Write-Host ""
        
        # .env faylini yangilash
        $envPath = "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend\.env"
        if (Test-Path $envPath) {
            Write-Host ".env faylini yangilayapman..." -ForegroundColor Yellow
            $envContent = Get-Content $envPath
            $newContent = $envContent -replace 'DATABASE_URL="postgresql://postgres:.*@localhost:5432/warehouse_db"', "DATABASE_URL=`"postgresql://postgres:$plainPassword@localhost:5432/warehouse_db`""
            $newContent | Set-Content $envPath
            Write-Host "✓ .env fayli yangilandi!" -ForegroundColor Green
        }
        
        $dbCreated = $true
    } else {
        if ($output -match "already exists") {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host "✓ warehouse_db allaqachon mavjud!" -ForegroundColor Yellow
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Parol to'g'ri! Davom eting." -ForegroundColor Green
            Write-Host ""
            
            # .env faylini yangilash
            $envPath = "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend\.env"
            if (Test-Path $envPath) {
                $envContent = Get-Content $envPath
                $newContent = $envContent -replace 'DATABASE_URL="postgresql://postgres:.*@localhost:5432/warehouse_db"', "DATABASE_URL=`"postgresql://postgres:$plainPassword@localhost:5432/warehouse_db`""
                $newContent | Set-Content $envPath
                Write-Host "✓ .env fayli yangilandi!" -ForegroundColor Green
            }
            
            $dbCreated = $true
        } else {
            Write-Host "✗ Parol noto'g'ri yoki xatolik" -ForegroundColor Red
            if ($attempt -lt $maxAttempts) {
                Write-Host "Qayta urinib ko'ring..." -ForegroundColor Yellow
                Write-Host ""
            }
        }
    }
    
    # Parolni tozalash
    $env:PGPASSWORD = $null
}

if (-not $dbCreated) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "XATOLIK" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Parol topilmadi. Quyidagilarni bajaring:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL ni qayta o'rnating" -ForegroundColor Yellow
    Write-Host "2. Yoki parolni qayta o'rnating" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Davom etish uchun istalgan tugmani bosing..." -ForegroundColor Gray
pause
