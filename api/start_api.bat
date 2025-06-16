@echo off
echo Iniciando API del Analizador de Datos con Swagger...

REM Instalar dependencias si no están instaladas
pip show flask-restx >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando dependencias...
    pip install flask-restx
)

echo.
echo La documentación de Swagger estará disponible en: http://localhost:5000/swagger
echo.

python app.py

pause