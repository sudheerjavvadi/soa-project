@echo off
title SpendWise - Building All Services
color 0B
echo.
echo  ======================================================
echo   SpendWise - Building All Spring Boot Services
echo   This compiles and packages every microservice JAR.
echo  ======================================================
echo.

cd /d %~dp0

set MAVEN_OPTS=-Xmx512m

echo [1/8] Building Discovery Server...
cd backend\discovery-server
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] discovery-server & exit /b 1 )
echo [OK] discovery-server
cd ..\..

echo [2/8] Building Auth Service...
cd backend\auth-service
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] auth-service & exit /b 1 )
echo [OK] auth-service
cd ..\..

echo [3/8] Building Category Service...
cd backend\category-service
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] category-service & exit /b 1 )
echo [OK] category-service
cd ..\..

echo [4/8] Building Expense Service...
cd backend\expense-service
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] expense-service & exit /b 1 )
echo [OK] expense-service
cd ..\..

echo [5/8] Building Budget Service...
cd backend\budget-service
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] budget-service & exit /b 1 )
echo [OK] budget-service
cd ..\..

echo [6/8] Building Notification Service...
cd backend\notification-service
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] notification-service & exit /b 1 )
echo [OK] notification-service
cd ..\..

echo [7/8] Building Report Service...
cd backend\report-service
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] report-service & exit /b 1 )
echo [OK] report-service
cd ..\..

echo [8/8] Building API Gateway...
cd backend\api-gateway
call mvn clean package -DskipTests -q
if %ERRORLEVEL% NEQ 0 ( echo [FAILED] api-gateway & exit /b 1 )
echo [OK] api-gateway
cd ..\..

echo.
echo  ======================================================
echo   ALL SERVICES BUILT SUCCESSFULLY!
echo   Run start-all.bat to launch everything.
echo  ======================================================
echo.
pause
