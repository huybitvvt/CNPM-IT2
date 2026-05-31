if (Test-Path -LiteralPath ".\.env.local.ps1") {
    . .\.env.local.ps1
}

$env:JAVA_HOME = "E:\Apache NetBeans\jdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

.\mvnw.cmd spring-boot:run
