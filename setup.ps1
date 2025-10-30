$TEAM_NAME = "equipo-3"
$API_KEY = "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"

Write-Host ""
Write-Host "🚀 Configurando Claude Code para $TEAM_NAME" -ForegroundColor Cyan
Write-Host ""

$anthropicPath = Join-Path $env:USERPROFILE ".anthropic"

try {
    if (-not (Test-Path $anthropicPath)) {
        New-Item -ItemType Directory -Force -Path $anthropicPath | Out-Null
        Write-Host "✓ Directorio creado: $anthropicPath" -ForegroundColor Green
    } else {
        Write-Host "✓ Directorio ya existe: $anthropicPath" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error creando directorio: $_" -ForegroundColor Red
    pause
    exit 1
}

$apiKeyPath = Join-Path $anthropicPath "api_key"

try {
    [System.IO.File]::WriteAllText($apiKeyPath, $API_KEY, [System.Text.Encoding]::UTF8)
    Write-Host "✓ API Key guardada" -ForegroundColor Green
} catch {
    Write-Host "❌ Error guardando la key: $_" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "✅ Configuración completada exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "Para verificar que funciona, ejecuta:"
Write-Host "  claude --version" -ForegroundColor Yellow
Write-Host ""
Write-Host "¡Buena suerte en el hackathon! 🎉" -ForegroundColor Cyan
Write-Host ""

if ($Host.Name -eq "ConsoleHost") {
    Write-Host "Presiona cualquier tecla para cerrar..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
