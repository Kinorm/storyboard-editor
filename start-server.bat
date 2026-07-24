@echo off
chcp 65001 >nul
echo ============================================
echo   分镜画板工具 - 本地服务器启动器
echo ============================================
echo.

set "PORT=8080"
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM 尝试使用 Python 启动
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] 检测到 Python，正在启动服务器...
    echo     访问地址: http://localhost:%PORT%/preview.html
    echo.
    start http://localhost:%PORT%/preview.html
    python -m http.server %PORT%
    goto :end
)

REM 尝试使用 python3 启动
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] 检测到 Python3，正在启动服务器...
    echo     访问地址: http://localhost:%PORT%/preview.html
    echo.
    start http://localhost:%PORT%/preview.html
    python3 -m http.server %PORT%
    goto :end
)

REM 尝试使用 Node.js npx serve
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] 检测到 Node.js，正在启动服务器...
    echo     访问地址: http://localhost:%PORT%/preview.html
    echo.
    start http://localhost:%PORT%/preview.html
    npx serve . -l %PORT%
    goto :end
)

echo [✗] 未检测到 Python 或 Node.js
echo.
echo 请安装以下任意一种：
echo   1. Python（推荐）: https://www.python.org/downloads/
echo   2. Node.js: https://nodejs.org/
echo.
echo 安装后重新运行此脚本即可。
pause

:end
