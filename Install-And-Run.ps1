$ErrorActionPreference = "Stop"

# Function to update environment variables in the current session
function Update-EnvironmentVariables {
    foreach ($level in "Machine", "User") {
        [Environment]::GetEnvironmentVariables($level).GetEnumerator() | ForEach-Object {
            if ($_.Key -eq 'Path') {
                $env:Path = $_.Value
            } else {
                Set-Item -Path "Env:$($_.Key)" -Value $_.Value
            }
        }
    }
}

Write-Host "Checking for Node.js..." -ForegroundColor Cyan

$nodeInstalled = $false
try {
    $nodeVersion = & node -v 2>$null
    if ($LASTEXITCODE -eq 0 -or $nodeVersion -match "v") {
        $nodeInstalled = $true
        Write-Host "Node.js is already installed: $nodeVersion" -ForegroundColor Green
    }
} catch {
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-Host "Node.js not found. Downloading the latest LTS version (v20)..." -ForegroundColor Yellow
    
    $installerPath = "$env:TEMP\nodejs_installer.msi"
    # Using a known stable LTS version URL
    $nodeUrl = "https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi"
    
    Write-Host "Downloading from $nodeUrl..."
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath

    Write-Host "Installing Node.js silently. Please wait, this may take a few minutes..." -ForegroundColor Yellow
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /qn /norestart" -Wait -NoNewWindow
    
    Write-Host "Node.js installation completed." -ForegroundColor Green
    
    # Reload environment variables so npm/node commands work in this script session
    Update-EnvironmentVariables
}

# Ensure we are in the directory where the script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($scriptDir) {
    Set-Location $scriptDir
}

Write-Host "Installing project dependencies..." -ForegroundColor Cyan
& npm install

Write-Host "Opening browser to http://localhost:3000" -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "Starting the Node.js server..." -ForegroundColor Green
& node server.js
