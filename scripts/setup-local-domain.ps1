param(
    [ValidateSet('makeable.test', 'makeable.io.test')]
    [string]$Domain = 'makeable.test',
    [switch]$Elevated
)

$ErrorActionPreference = 'Stop'

$taskProjectPath = Split-Path -Parent $PSScriptRoot
$taskLogDirectory = Join-Path $taskProjectPath '.playwright'
$taskLogPath = Join-Path $taskLogDirectory 'domain-setup.log'
$taskIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
$taskPrincipal = [Security.Principal.WindowsPrincipal]::new($taskIdentity)
if (-not $taskPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    if ($Elevated) {
        throw 'Windows did not grant administrator access. Run this script from an Administrator PowerShell terminal.'
    }

    New-Item -ItemType Directory -Path $taskLogDirectory -Force | Out-Null
    Set-Content -LiteralPath $taskLogPath -Value ''
    $taskPowerShell = Join-Path $env:windir 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $taskArguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$PSCommandPath`"", '-Domain', $Domain, '-Elevated')
    Write-Output "Approve the Windows administrator prompt to register $Domain."
    $taskProcess = Start-Process -FilePath $taskPowerShell -ArgumentList $taskArguments -Verb RunAs -WindowStyle Hidden -Wait -PassThru
    Get-Content -LiteralPath $taskLogPath
    if ($taskProcess.ExitCode -ne 0) {
        throw "Local domain setup failed. Details: $taskLogPath"
    }
    return
}

try {
    $taskHostsPath = Join-Path $env:windir 'System32\drivers\etc\hosts'
    $taskHostsContent = Get-Content -LiteralPath $taskHostsPath -Raw
    $taskDomainPattern = '(?m)^\s*127\.0\.0\.1\s+(?:[^\r\n#]+\s+)?' + [regex]::Escape($Domain) + '(?:\s|$)'

    if ($taskHostsContent -notmatch $taskDomainPattern) {
        Add-Content -LiteralPath $taskHostsPath -Value "`r`n127.0.0.1 $Domain" -Encoding ascii
    }

    Clear-DnsClientCache
    $taskAddresses = [System.Net.Dns]::GetHostAddresses($Domain)
    if ('127.0.0.1' -notin @($taskAddresses | ForEach-Object { $_.IPAddressToString })) {
        throw 'The hostname does not resolve to 127.0.0.1. Check the Windows hosts entry.'
    }

    $taskResult = "Local domain registered: http://$Domain/"
    if ($Elevated) {
        Set-Content -LiteralPath $taskLogPath -Value $taskResult
    }
    Write-Output $taskResult
} catch {
    if ($Elevated) {
        Set-Content -LiteralPath $taskLogPath -Value $_.Exception.Message
    }
    throw
}
