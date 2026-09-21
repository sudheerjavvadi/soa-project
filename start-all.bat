@echo off
title SpendWise - Starting All Services
color 0A
echo.
echo  ======================================================
echo   SpendWise - Corporate Financial Analytics System
echo   Starting all microservices...
echo  ======================================================
echo.

cd /d %~dp0

echo [1/8] Starting Eureka Discovery Server (port 8761)...
start "Eureka Discovery" cmd /k "cd backend\discovery-server && mvn spring-boot:run"
timeout /t 20 /nobreak >nul

echo [2/8] Starting Auth Service (port 8081)...
start "Auth Service" cmd /k "cd backend\auth-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [3/8] Starting Category Service (port 8083)...
start "Category Service" cmd /k "cd backend\category-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [4/8] Starting Expense Service (port 8082)...
start "Expense Service" cmd /k "cd backend\expense-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [5/8] Starting Budget Service (port 8084)...
start "Budget Service" cmd /k "cd backend\budget-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [6/8] Starting Notification Service (port 8086)...
start "Notification Service" cmd /k "cd backend\notification-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [7/8] Starting Report Service (port 8085)...
start "Report Service" cmd /k "cd backend\report-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [8/8] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd backend\api-gateway && mvn spring-boot:run"
timeout /t 15 /nobreak >nul

echo.
echo  ======================================================
echo   Starting React Frontend (port 5173)...
echo  ======================================================
start "SpendWise Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo  ======================================================
echo   ALL SERVICES STARTED!
echo.
echo   Eureka Dashboard : http://localhost:8761
echo   API Gateway      : http://localhost:8080
echo   React Frontend   : http://localhost:5173
echo.
echo   Login Credentials:
echo   System Admin  - admin@spendwise.com / Admin@123
echo   Finance Admin - finance@spendwise.com / Finance@123
echo   Manager       - manager@spendwise.com / Manager@123
echo   Employee      - emp1@spendwise.com / Emp@12345
echo  ======================================================
echo.
pause
