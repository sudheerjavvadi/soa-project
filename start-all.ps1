$root = "c:\co\3.1\SOA-S7\Project"

$DB_USERNAME = "root"
$DB_PASSWORD = "2006"
$JWT_SECRET  = "SpendWise-Super-Secret-Key-That-Is-At-Least-256-Bits-Long-For-Security"

function Start-Service($title, $jarPath, $extraArgs) {
    $args = "-jar `"$root\$jarPath`" $extraArgs"
    Start-Process "java" -ArgumentList $args `
        -WorkingDirectory $root `
        -WindowStyle Normal `
        -PassThru | Out-Null
    Write-Host "  [STARTED] $title"
}

Write-Host ""
Write-Host " ======================================================"
Write-Host "  SpendWise - Launching All Services"
Write-Host " ======================================================"
Write-Host ""

# 1. Eureka Discovery Server
Write-Host "[1/8] Starting Eureka Discovery Server on :8761..."
Start-Service "Eureka" "backend\discovery-server\target\discovery-server-1.0.0.jar" ""
Write-Host "      Waiting 20s for Eureka to be ready..."
Start-Sleep -Seconds 20

# 2. Auth Service
Write-Host "[2/8] Starting Auth Service on :8081..."
Start-Service "Auth" "backend\auth-service\target\auth-service-1.0.0.jar" `
    "--DB_USERNAME=$DB_USERNAME --DB_PASSWORD=$DB_PASSWORD --JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 8

# 3. Category Service
Write-Host "[3/8] Starting Category Service on :8083..."
Start-Service "Category" "backend\category-service\target\category-service-1.0.0.jar" `
    "--DB_USERNAME=$DB_USERNAME --DB_PASSWORD=$DB_PASSWORD --JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 8

# 4. Expense Service
Write-Host "[4/8] Starting Expense Service on :8082..."
Start-Service "Expense" "backend\expense-service\target\expense-service-1.0.0.jar" `
    "--DB_USERNAME=$DB_USERNAME --DB_PASSWORD=$DB_PASSWORD --JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 8

# 5. Budget Service
Write-Host "[5/8] Starting Budget Service on :8084..."
Start-Service "Budget" "backend\budget-service\target\budget-service-1.0.0.jar" `
    "--DB_USERNAME=$DB_USERNAME --DB_PASSWORD=$DB_PASSWORD --JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 8

# 6. Notification Service
Write-Host "[6/8] Starting Notification Service on :8086..."
Start-Service "Notification" "backend\notification-service\target\notification-service-1.0.0.jar" `
    "--DB_USERNAME=$DB_USERNAME --DB_PASSWORD=$DB_PASSWORD --JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 8

# 7. Report Service
Write-Host "[7/8] Starting Report Service on :8085..."
Start-Service "Report" "backend\report-service\target\report-service-1.0.0.jar" `
    "--JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 8

# 8. API Gateway
Write-Host "[8/8] Starting API Gateway on :8080..."
Start-Service "Gateway" "backend\api-gateway\target\api-gateway-1.0.0.jar" `
    "--JWT_SECRET=$JWT_SECRET"
Start-Sleep -Seconds 15

# 9. React Frontend
Write-Host ""
Write-Host "[9/9] Starting React Frontend on :5173..."
Start-Process "cmd" -ArgumentList "/k `"cd /d $root\frontend && npm run dev`"" -WindowStyle Normal
Write-Host "  [STARTED] React Frontend"

Write-Host ""
Write-Host " ======================================================"
Write-Host "  ALL SERVICES STARTED!"
Write-Host ""
Write-Host "  Eureka Dashboard  : http://localhost:8761"
Write-Host "  API Gateway       : http://localhost:8080"
Write-Host "  React Frontend    : http://localhost:5173"
Write-Host ""
Write-Host "  Swagger UI URLs:"
Write-Host "  Auth Service      : http://localhost:8081/swagger-ui.html"
Write-Host "  Expense Service   : http://localhost:8082/swagger-ui.html"
Write-Host "  Category Service  : http://localhost:8083/swagger-ui.html"
Write-Host "  Budget Service    : http://localhost:8084/swagger-ui.html"
Write-Host "  Report Service    : http://localhost:8085/swagger-ui.html"
Write-Host "  Notify Service    : http://localhost:8086/swagger-ui.html"
Write-Host " ======================================================"
