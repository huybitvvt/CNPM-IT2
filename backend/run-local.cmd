@echo off
setlocal

if exist ".env.local" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env.local") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

set "JAVA_HOME=E:\Apache NetBeans\jdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"

call mvnw.cmd spring-boot:run
