@echo off
REM ============================================================
REM  Rede Nordeste - Backend
REM  Compila o projeto e gera o JAR em backend\target\
REM  Pula testes para build rapido. Para incluir testes,
REM  remova o -DskipTests.
REM ============================================================

setlocal
cd /d "%~dp0"

echo.
echo [Rede Nordeste] Compilando backend...
echo.

call mvnw.cmd clean package -DskipTests
if errorlevel 1 (
    echo.
    echo [Rede Nordeste] Build FALHOU.
    exit /b 1
)

echo.
echo [Rede Nordeste] Build OK. JAR em backend\target\
endlocal
