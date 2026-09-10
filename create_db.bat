@echo off
echo warehouse_db bazasini yaratish...
echo.
echo Parolingizni kiriting (o'rnatishda belgilaganing):
set /p PGPASS="Parol: "

set PGPASSWORD=%PGPASS%
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE warehouse_db;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ warehouse_db muvaffaqiyatli yaratildi!
) else (
    echo.
    echo ✗ Xatolik yuz berdi. Parolni tekshiring.
)

pause
