@echo off
REM ============================================================
REM  Rede Nordeste - Backend
REM  Sobe o Spring Boot em modo dev (hot reload via devtools).
REM  Uso: dentro da pasta backend\, execute "run.bat"
REM ============================================================

setlocal
cd /d "%~dp0"

echo.
echo [Rede Nordeste] Iniciando backend Spring Boot...
echo [Rede Nordeste] URL: http://localhost:8080
echo.

call mvnw.cmd spring-boot:run
endlocal
