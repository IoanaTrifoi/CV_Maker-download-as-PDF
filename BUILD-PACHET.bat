@echo off
setlocal enabledelayedexpansion
title CV Maker PDF — Build pachet

echo.
echo  ================================================
echo   CV Maker PDF — Construiesc pachetul de distributie
echo  ================================================
echo.

:: Versiune
set VERSION=1.0
set PACKAGE_NAME=CV_Maker_PDF_v%VERSION%

:: Directoare
set ROOT=%~dp0
set TEMP_DIR=%TEMP%\%PACKAGE_NAME%
set OUT_ZIP=%ROOT%%PACKAGE_NAME%.zip

:: Curata temporarele
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

echo  [1/5] Copiez fisierele principale...
copy /y "%ROOT%server.js"       "%TEMP_DIR%\server.js"      > nul
copy /y "%ROOT%package.json"    "%TEMP_DIR%\package.json"   > nul
copy /y "%ROOT%README.md"       "%TEMP_DIR%\README.md"      > nul
copy /y "%ROOT%START.bat"       "%TEMP_DIR%\START.bat"      > nul
copy /y "%ROOT%.gitignore"      "%TEMP_DIR%\.gitignore"     > nul 2>&1

echo  [2/5] Copiez interfata (public/)...
xcopy /e /i /y "%ROOT%public" "%TEMP_DIR%\public" > nul

echo  [3/5] Copiez sabloanele si datele initiale...
mkdir "%TEMP_DIR%\data\templates"
:: CV gol (fara date personale)
copy /y "%ROOT%data\cv-blocks.json" "%TEMP_DIR%\data\cv-blocks.json" > nul
:: Toate sabloanele
copy /y "%ROOT%data\templates\index.json" "%TEMP_DIR%\data\templates\index.json" > nul
for %%f in ("%ROOT%data\templates\*.json") do (
  copy /y "%%f" "%TEMP_DIR%\data\templates\%%~nxf" > nul
)
:: SVG-uri preview sabloane (daca exista)
if exist "%ROOT%public\templates" (
  xcopy /e /i /y "%ROOT%public\templates" "%TEMP_DIR%\public\templates" > nul
)

echo  [4/5] Creez folderele goale necesare...
mkdir "%TEMP_DIR%\uploads"
mkdir "%TEMP_DIR%\output"
:: Placeholder ca folderele sa existe in ZIP
echo. > "%TEMP_DIR%\uploads\.gitkeep"
echo. > "%TEMP_DIR%\output\.gitkeep"

echo  [5/5] Comprimez in ZIP...
if exist "%OUT_ZIP%" del /q "%OUT_ZIP%"

powershell -NoProfile -Command ^
  "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '%OUT_ZIP%' -Force"

:: Verifica
if exist "%OUT_ZIP%" (
  echo.
  echo  ================================================
  for %%F in ("%OUT_ZIP%") do set SIZE=%%~zF
  set /a SIZE_MB=!SIZE! / 1024 / 1024
  echo   Pachet creat cu succes:
  echo   %OUT_ZIP%
  echo   Marime: ~!SIZE_MB! MB
  echo  ================================================
  echo.
  echo  Poti impartasi direct acest ZIP sau il urci pe GitHub Release.
) else (
  echo   EROARE: Pachetul nu a putut fi creat.
  echo   Asigura-te ca PowerShell este disponibil.
)

:: Curata
rmdir /s /q "%TEMP_DIR%"
echo.
pause
