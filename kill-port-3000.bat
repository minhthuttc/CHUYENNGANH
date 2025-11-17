@echo off
echo Dang tim process su dung port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Dang dung process PID: %%a
    taskkill /F /PID %%a
)
echo Hoan tat!
pause
