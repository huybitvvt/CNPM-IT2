if (Test-Path -LiteralPath ".\.env.local") {
    Get-Content -LiteralPath ".\.env.local" | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
            return
        }

        $key, $value = $line.Split("=", 2)
        [Environment]::SetEnvironmentVariable($key.Trim(), $value, "Process")
    }
}

$env:JAVA_HOME = "E:\Apache NetBeans\jdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

.\mvnw.cmd spring-boot:run
