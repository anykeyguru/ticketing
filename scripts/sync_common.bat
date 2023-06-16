@echo off

set "foldersFile=folders_bat.txt"

REM Iterate over each folder in the list
for /f "usebackq delims=" %%F in ("%foldersFile%") do (
    echo Entering folder: %%F
    cd /d "%%F"

    REM Run the npm command in each folder
    npm update @qptickets/common --save

    echo.
)

echo All folders processed.
