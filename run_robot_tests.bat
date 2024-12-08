@echo off
REM Batch script to run Robot Framework tests
REM Set the working directory to the folder containing your Robot tests
cd /d %~dp0

echo Running Robot Framework tests...
robot --outputdir robot_results robot_tests

REM Check if tests passed or failed
IF %ERRORLEVEL% EQU 0 (
    echo Tests completed successfully.
    exit /b 0
) ELSE (
    echo Tests failed. Check the logs in the 'results' folder.
    exit /b 1
)
