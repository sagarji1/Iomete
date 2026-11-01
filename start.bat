@echo off
echo ========================================================
echo   Starting IOMETE PROOF Platform
echo   Don't Pitch. Prove.
echo ========================================================

echo [1/2] Starting FastAPI Backend on port 8000...
start "IOMETE PROOF Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Next.js Frontend on port 3000...
start "IOMETE PROOF Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting:
echo   - Frontend: http://localhost:3000
echo   - Backend API Docs: http://127.0.0.1:8000/docs
echo.
pause
