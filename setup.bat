@echo off
chcp 65001 >nul
setlocal

set TEAM_NAME=equipo-3
set API_KEY=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

echo.
echo 🚀 Configurando Claude Code para %TEAM_NAME%
echo.

set ANTHROPIC_DIR=%USERPROFILE%\.anthropic

if not exist "%ANTHROPIC_DIR%" (
    mkdir "%ANTHROPIC_DIR%"
    if errorlevel 1 (
        echo ❌ Error creando directorio
        pause
        exit /b 1
    )
    echo ✓ Directorio creado: %ANTHROPIC_DIR%
) else (
    echo ✓ Directorio ya existe: %ANTHROPIC_DIR%
)

<nul set /p="%API_KEY%" > "%ANTHROPIC_DIR%\api_key"

if errorlevel 1 (
    echo ❌ Error guardando la key
    pause
    exit /b 1
)

echo ✓ API Key guardada

echo.
echo ✅ Configuración completada exitosamente
echo.
echo Para verificar que funciona, ejecuta:
echo   claude --version
echo.
echo ¡Buena suerte en el hackathon! 🎉
echo.
pause
