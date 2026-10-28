@echo off
title SpendWise - Starting All Services
color 0A
echo.
echo  ======================================================
echo   SpendWise - Corporate Financial Analytics System
echo   Starting all microservices (from pre-built JARs)...
echo.
echo   TIP: If JARs are missing, run build-all.bat first.
echo  ======================================================
echo.

cd /d %~dp0

REM ---- MySQL check -------------------------------------------------------
sc query MySQL80 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [WARN] MySQL80 service not found. Make sure MySQL is running
    echo         on localhost:3306 before services can connect.
    echo.
)

REM ---- Helper: verify JAR exists -----------------------------------------
set MISSING=0
if not exist "backend\discovery-server\target\discovery-server-1.0.0.jar"    ( echo [MISSING] discovery-server JAR  & set MISSING=1 )
if not exist "backend\auth-service\target\auth-service-1.0.0.jar"            ( echo [MISSING] auth-service JAR       & set MISSING=1 )
if not exist "backend\category-service\target\category-service-1.0.0.jar"    ( echo [MISSING] category-service JAR   & set MISSING=1 )
if not exist "backend\expense-service\target\expense-service-1.0.0.jar"      ( echo [MISSING] expense-service JAR     & set MISSING=1 )
if not exist "backend\budget-service\target\budget-service-1.0.0.jar"        ( echo [MISSING] budget-service JAR      & set MISSING=1 )
if not exist "backend\notification-service\target\notification-service-1.0.0.jar" ( echo [MISSING] notification-service JAR & set MISSING=1 )
if not exist "backend\report-service\target\report-service-1.0.0.jar"        ( echo [MISSING] report-service JAR      & set MISSING=1 )
if not exist "backend\api-gateway\target\api-gateway-1.0.0.jar"              ( echo [MISSING] api-gateway JAR         & set MISSING=1 )

if %MISSING%==1 (
    echo.
    echo  [ERROR] One or more JARs are missing.
    echo          Please run build-all.bat first, then retry.
    echo.
    pause
    exit /b 1
)

REM ---- DB credentials (edit these to match your MySQL setup) --------------
set DB_USERNAME=root
set DB_PASSWORD=2006

REM ---- JWT secret (must be same across all services) ----------------------
set JWT_SECRET=SpendWise-Super-Secret-Key-That-Is-At-Least-256-Bits-Long-For-Security

REM ---- 1. Eureka Discovery Server (must start FIRST) ----------------------
echo [1/8] Starting Eureka Discovery Server on port 8761...
start "Eureka Discovery Server" cmd /k ^
    "title Eureka Discovery Server (8761) && java -jar backend\discovery-server\target\discovery-server-1.0.0.jar"
echo       Waiting 20 s for Eureka to be ready...
timeout /t 20 /nobreak >nul

REM ---- 2. Auth Service ----------------------------------------------------
echo [2/8] Starting Auth Service on port 8081...
start "Auth Service" cmd /k ^
    "title Auth Service (8081) && java -jar backend\auth-service\target\auth-service-1.0.0.jar --DB_USERNAME=%DB_USERNAME% --DB_PASSWORD=%DB_PASSWORD% --JWT_SECRET=%JWT_SECRET%"
timeout /t 8 /nobreak >nul

REM ---- 3. Category Service ------------------------------------------------
echo [3/8] Starting Category Service on port 8083...
start "Category Service" cmd /k ^
    "title Category Service (8083) && java -jar backend\category-service\target\category-service-1.0.0.jar --DB_USERNAME=%DB_USERNAME% --DB_PASSWORD=%DB_PASSWORD% --JWT_SECRET=%JWT_SECRET%"
timeout /t 8 /nobreak >nul

REM ---- 4. Expense Service -------------------------------------------------
echo [4/8] Starting Expense Service on port 8082...
start "Expense Service" cmd /k ^
    "title Expense Service (8082) && java -jar backend\expense-service\target\expense-service-1.0.0.jar --DB_USERNAME=%DB_USERNAME% --DB_PASSWORD=%DB_PASSWORD% --JWT_SECRET=%JWT_SECRET%"
timeout /t 8 /nobreak >nul

REM ---- 5. Budget Service --------------------------------------------------
echo [5/8] Starting Budget Service on port 8084...
start "Budget Service" cmd /k ^
    "title Budget Service (8084) && java -jar backend\budget-service\target\budget-service-1.0.0.jar --DB_USERNAME=%DB_USERNAME% --DB_PASSWORD=%DB_PASSWORD% --JWT_SECRET=%JWT_SECRET%"
timeout /t 8 /nobreak >nul

REM ---- 6. Notification Service --------------------------------------------
echo [6/8] Starting Notification Service on port 8086...
start "Notification Service" cmd /k ^
    "title Notification Service (8086) && java -jar backend\notification-service\target\notification-service-1.0.0.jar --DB_USERNAME=%DB_USERNAME% --DB_PASSWORD=%DB_PASSWORD% --JWT_SECRET=%JWT_SECRET%"
timeout /t 8 /nobreak >nul

REM ---- 7. Report Service --------------------------------------------------
echo [7/8] Starting Report Service on port 8085...
start "Report Service" cmd /k ^
    "title Report Service (8085) && java -jar backend\report-service\target\report-service-1.0.0.jar --JWT_SECRET=%JWT_SECRET%"
timeout /t 8 /nobreak >nul

REM ---- 8. API Gateway (start LAST - needs all services registered) --------
echo [8/8] Starting API Gateway on port 8080...
start "API Gateway" cmd /k ^
    "title API Gateway (8080) && java -jar backend\api-gateway\target\api-gateway-1.0.0.jar --JWT_SECRET=%JWT_SECRET%"
timeout /t 15 /nobreak >nul

REM ---- React Frontend ------------------------------------------------------
echo.
echo  ======================================================
echo   Starting React Frontend on port 5173...
echo  ======================================================
start "SpendWise Frontend" cmd /k "title React Frontend (5173) && cd frontend && npm run dev"

echo.
echo  ======================================================
echo   ALL SERVICES STARTED!
echo.
echo   Eureka Dashboard : http://localhost:8761
echo   API Gateway      : http://localhost:8080
echo   React Frontend   : http://localhost:5173
echo.
echo   Service Health Checks:
echo   Auth     : http://localhost:8081/actuator/health
echo   Category : http://localhost:8083/actuator/health
echo   Expense  : http://localhost:8082/actuator/health
echo   Budget   : http://localhost:8084/actuator/health
echo   Report   : http://localhost:8085/actuator/health
echo   Notify   : http://localhost:8086/actuator/health
echo.
echo   Demo Login Credentials:
echo   System Admin  : admin@spendwise.com   / Admin@123
echo   Finance Admin : finance@spendwise.com / Finance@123
echo   Manager       : manager@spendwise.com / Manager@123
echo   Employee      : emp1@spendwise.com    / Emp@12345
echo  ======================================================
echo.
pause
