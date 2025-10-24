@echo off 
 
:: BatchGotAdmin 
:------------------------------------- 
REM --> Check for permissions 
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system" 
 
REM --> If error flag set, we do not have admin. 
if '%errorlevel%' NEQ '0' ( 
 echo Requesting administrative privileges... 
 goto UACPrompt 
) else ( goto gotAdmin ) 
 
:UACPrompt 
 echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs" 
 echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs" 
 
 "%temp%\getadmin.vbs" 
 exit /B 
 
:gotAdmin 
 if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" ) 
 pushd "%CD%" 
 CD /D "%~dp0" 
:-------------------------------------- 
 
cls
@ECHO OFF
title Network switching
CLS
color 0a
GOTO MENU
:MENU
ECHO.
ECHO. ==============Network switching==============
ECHO.
ECHO. 1 stop link
ECHO. 2 start link
ECHO. 3 exit
ECHO. ==========================================
ECHO.
ECHO.
echo. chouse no:
set /p ID=
if "%id%"=="1" goto qiyong
if "%id%"=="2" goto jinyong
if "%id%"=="3" exit
PAUSE
:qiyong
echo stop link...
netsh interface set interface name=neiwang admin=DISABLED && netsh interface set interface name=waiwang admin=ENABLED
echo stop link success and goto link waiwang
goto MENU
:jinyong
echo start link...
netsh interface set interface name=neiwang admin=ENABLED
echo start link success
GOTO MENU