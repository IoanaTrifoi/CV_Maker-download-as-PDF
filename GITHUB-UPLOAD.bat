@echo off
setlocal enabledelayedexpansion
title CV Maker PDF — Upload pe GitHub

echo.
echo  ================================================
echo   CV Maker PDF — Publicare pe GitHub
echo  ================================================
echo.

:: Verifica git
where git >nul 2>&1
if errorlevel 1 (
  echo  EROARE: Git nu este instalat.
  echo  Descarca de la: https://git-scm.com/download/win
  pause
  exit /b 1
)

set ROOT=%~dp0
cd /d "%ROOT%"

:: Verifica daca repo exista deja
if exist ".git" (
  echo  Repo git existent detectat.
  echo  Fac commit cu modificarile curente...
  echo.
  git add .
  git status
  echo.
  set /p MSG=Mesaj commit (Enter = "Actualizare CV Maker PDF"):
  if "!MSG!"=="" set MSG=Actualizare CV Maker PDF
  git commit -m "!MSG!"
  git push
  echo.
  echo  Modificarile au fost trimise pe GitHub.
  pause
  exit /b 0
)

:: Repo nou
echo  Initializare repo git nou...
echo.

:: Configurare initiala
set /p GITHUB_USER=Numele tau de utilizator GitHub:
set /p REPO_NAME=Numele repository-ului (ex: cv-maker-pdf):
if "!REPO_NAME!"=="" set REPO_NAME=cv-maker-pdf

echo.
echo  Initializez git...
git init
git branch -M main

echo  Adaug fisierele (exclus date personale)...
git add .
git status

echo.
git commit -m "Initial release: CV Maker PDF v1.0"

echo.
echo  ================================================
echo   PASUL URMATOR (manual):
echo  ================================================
echo.
echo  1. Mergi la https://github.com/new
echo  2. Creeaza un repo public cu numele: !REPO_NAME!
echo     (NU bifa "Add a README" — repo-ul trebuie sa fie gol)
echo  3. Copiaza si ruleaza comanda de mai jos:
echo.
echo     git remote add origin https://github.com/!GITHUB_USER!/!REPO_NAME!.git
echo     git push -u origin main
echo.
echo  4. Link-ul tau va fi:
echo     https://github.com/!GITHUB_USER!/!REPO_NAME!
echo.
echo  Pentru download direct (ZIP):
echo     https://github.com/!GITHUB_USER!/!REPO_NAME!/archive/refs/heads/main.zip
echo.
pause
