# AWS RDS Connection Script
# =========================
# This script establishes an SSH tunnel to the AWS RDS database
# Run this script in PowerShell before starting the application

# Replace the path below with your actual EC2 Access.pem file location
$PemFilePath = "$((Get-Location).Path)\EC2 Access.pem"

# Check if the PEM file exists
if (-not (Test-Path $PemFilePath)) {
    Write-Error "PEM file not found at: $PemFilePath"
    Write-Host "Please update the PemFilePath variable with the correct path to your EC2 Access.pem file"
    exit 1
}

Write-Host "Establishing SSH tunnel to AWS RDS..."
Write-Host "Local port 13306 will be forwarded to RDS port 3306"
Write-Host "Keep this window open while using the application"
Write-Host "Press Ctrl+C to stop the tunnel"
Write-Host ""

# Establish SSH tunnel
ssh -i "$PemFilePath" -N -L 13306:careerforgedb.ckt4mmg2etgw.us-east-1.rds.amazonaws.com:3306 ubuntu@54.227.173.227
