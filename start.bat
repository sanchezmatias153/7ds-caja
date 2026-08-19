@echo off
cd /d %~dp0

echo.
echo ================================================
echo   Registro de Caja Britannia - 7DS Grand Cross
echo.
echo   En este PC:        http://localhost:8010
echo   Desde el celular:  http://[IP-DE-TU-PC]:8010
echo   (el celular debe estar en la misma red WiFi)
echo.
echo   Para cerrarlo: cierra esta ventana negra.
echo ================================================
echo.

start "" http://localhost:8010
python -m http.server 8010 --bind 0.0.0.0
