@echo off

call yarn --cwd ./control

SET msbuild="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe"

if exist ./solution/bin/Release/ImageControl.zip (
    %msbuild% ./solution/ImageControl.cdsproj /t:build /p:Configuration=Release
) else (
    %msbuild% ./solution/ImageControl.cdsproj /t:build /p:Configuration=Release /restore
)