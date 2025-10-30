@echo off
chcp 65001 >nul
setlocal

echo.
echo 🧹 Limpiando configuración de Claude Code
echo.

set API_KEY_FILE=%USERPROFILE%\.anthropic\api_key

if exist "%API_KEY_FILE%" (
    del /f /q "%API_KEY_FILE%" 2>nul
    if errorlevel 1 (
        echo ❌ Error eliminando la key
        pause
        exit /b 1
    )
    echo ✓ API Key eliminada correctamente
) else (
    echo ⚠  No se encontró ninguna API key
)

set ANTHROPIC_API_KEY=

echo.
echo ✅ Limpieza completada
echo.
echo Gracias por participar en el hackathon! 🎉
echo.
pause
