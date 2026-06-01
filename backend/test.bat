@echo off
REM ============================================================
REM  Rede Nordeste - Backend
REM  Roda toda a suite de testes do Maven
REM ============================================================

setlocal
cd /d "%~dp0"

echo.
echo [Rede Nordeste] Rodando testes...
echo.

call mvnw.cmd test
endlocal
