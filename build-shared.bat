@echo off
echo Building shared package...
cd shared
call npm run build
cd ..
echo Done!
pause

