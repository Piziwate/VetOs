# Script to start VetOS Environment in One Click
Write-Host "Starting VetOS Infrastructure..." -ForegroundColor Cyan

# Start Docker containers
docker compose up -d --build

Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run Migrations inside the backend container
Write-Host "Running Database Migrations..." -ForegroundColor Yellow
docker exec vetos-backend alembic upgrade head

# Run Seeding inside the backend container
Write-Host "Ensuring Admin User exists..." -ForegroundColor Yellow
docker exec vetos-backend env PYTHONPATH=/app python app/db/init_db.py

Write-Host "`nVetOS is READY!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Adminer (DB): http://localhost:8080" -ForegroundColor Cyan
Write-Host "`nPress any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
