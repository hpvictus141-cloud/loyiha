# PostgreSQL va loyihani to'liq sozlash
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  OMBORXONA TIZIMINI ISHGA TUSHIRISH" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL xizmatini tekshirish va ishga tushirish
Write-Host "[1/6] PostgreSQL serverini tekshirish..." -ForegroundColor Yellow
$service = Get-Service -Name "postgresql-x64-16" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -ne "Running") {
        Write-Host "      PostgreSQL ni ishga tushirish..." -ForegroundColor Gray
        Start-Service -Name "postgresql-x64-16" -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 3
    }
    Write-Host "      PostgreSQL server ishlamoqda" -ForegroundColor Green
} else {
    Write-Host "      XATOLIK: PostgreSQL xizmati topilmadi!" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "[2/6] PostgreSQL parolini kiriting" -ForegroundColor Yellow
Write-Host "      O'rnatishda belgilagan parolingizni kiriting." -ForegroundColor Gray
Write-Host "      Agar bilmasangiz: postgres, postgres123, admin123 ni sinang" -ForegroundColor Gray
Write-Host ""

$passwordFound = $false
$dbPassword = ""

# Parolni kiritish
for ($i = 1; $i -le 5; $i++) {
    Write-Host "      Urinish $i/5" -ForegroundColor Cyan
    $securePassword = Read-Host "      Parol" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    $env:PGPASSWORD = $plainPassword
    
    # Ulanishni tekshirish
    $testResult = & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "SELECT 1;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      Parol to'g'ri!" -ForegroundColor Green
        $passwordFound = $true
        $dbPassword = $plainPassword
        break
    } else {
        Write-Host "      Parol noto'g'ri. Qayta urinib ko'ring." -ForegroundColor Red
    }
    
    $env:PGPASSWORD = $null
}

if (-not $passwordFound) {
    Write-Host ""
    Write-Host "XATOLIK: Parol topilmadi!" -ForegroundColor Red
    Write-Host "PostgreSQL parolini bilmasangiz, men sizga yordam beraman." -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "[3/6] warehouse_db bazasini yaratish..." -ForegroundColor Yellow
$env:PGPASSWORD = $dbPassword
$createDb = & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE warehouse_db;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "      warehouse_db yaratildi" -ForegroundColor Green
} else {
    if ($createDb -match "already exists") {
        Write-Host "      warehouse_db allaqachon mavjud" -ForegroundColor Yellow
    } else {
        Write-Host "      XATOLIK: $createDb" -ForegroundColor Red
    }
}
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "[4/6] .env faylini yangilash..." -ForegroundColor Yellow
$envPath = "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend\.env"
$envContent = Get-Content $envPath -Raw
$newEnvContent = $envContent -replace 'DATABASE_URL="postgresql://postgres:[^@]*@localhost:5432/warehouse_db"', "DATABASE_URL=`"postgresql://postgres:$dbPassword@localhost:5432/warehouse_db`""
$newEnvContent | Set-Content $envPath -NoNewline
Write-Host "      .env yangilandi" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Ma'lumotlar bazasiga jadvallar yaratish..." -ForegroundColor Yellow
Set-Location "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend"
Write-Host "      Prisma migratsiyasi..." -ForegroundColor Gray
$migrateOutput = npx prisma migrate dev --name init 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Jadvallar yaratildi" -ForegroundColor Green
} else {
    Write-Host "      Migratsiya natijasi: $migrateOutput" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[6/6] Boshlang'ich ma'lumotlarni kiritish..." -ForegroundColor Yellow
Write-Host "      Seed..." -ForegroundColor Gray
$seedOutput = npm run seed 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Boshlang'ich ma'lumotlar kiritildi" -ForegroundColor Green
} else {
    Write-Host "      Seed natijasi: $seedOutput" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  TAYYOR!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend serverni ishga tushirish uchun:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend ochish uchun:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor Cyan
Write-Host "  python -m http.server 8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Yoki frontend/index.html ni brauzerda oching" -ForegroundColor Gray
Write-Host ""
pause
