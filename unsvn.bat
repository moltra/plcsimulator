@echo off
setlocal
rem rdir=название_удаляемых_каталогов
rem set rdir=%1
set rdir=.svn
set fpath=%~dps0
call :func %fpath:~0,-1%
goto end
:func
for /f "delims=" %%i in ('dir %1 /a:d /b') do IF /I %%i==%rdir% ( rmdir /s /q %1\%%i && echo deleted %1\%%i ) ELSE ( call :func %1\%%i )
exit /b
:end
del /Q /F %fpath%%~nx0
