@echo off
REM Needs Node.js (https://nodejs.org). First run installs Electron, then opens the app.
cd /d "%~dp0"
if not exist node_modules ( call npm install )
call npm start
