@echo off
echo Building project...
call npm run build:h5

if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo Creating remote directory...
ssh -i "C:\Users\84530\Documents\DingTaiPem\Dingtai-dev.pem" -p 30077 root@101.200.91.29 "mkdir -p /var/www/html"

if errorlevel 1 (
    echo Failed to create remote directory!
    pause
    exit /b 1
)

echo Copying files to server...
scp -i "C:\Users\84530\Documents\DingTaiPem\Dingtai-dev.pem" -P 30077 -r ./dist/build/h5/* root@101.200.91.29:/var/www/html/

if errorlevel 1 (
    echo Failed to copy files!
    pause
    exit /b 1
)

echo Setting permissions...
ssh -i "C:\Users\84530\Documents\DingTaiPem\Dingtai-dev.pem" -p 30077 root@101.200.91.29 "chmod -R 755 /var/www/html"

if errorlevel 1 (
    echo Failed to set permissions!
    pause
    exit /b 1
)

echo Deployment complete!
echo Your application should be available at http://101.200.91.29:30077
pause 