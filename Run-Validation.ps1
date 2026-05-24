# Run-Validation.ps1
# Note: Ensure that the Node.js server is running (`node server.js`) before running this script.

$testData = @{
    coverData = @(
        @{ Property = "Log Reference number"; Value = "B-1" },
        @{ Property = "Project Name"; Value = "Max Storage Facility" },
        @{ Property = "Job Number"; Value = "3825-01-01" },
        @{ Property = "Location"; Value = "Holyoke, MA" },
        @{ Property = "Contractor"; Value = "Seaboard Environmental Drilling" },
        @{ Property = "Rig Type"; Value = "Track Mounted Rig" },
        @{ Property = "Hammer System"; Value = "Automatic Hammer (140 lb / 30`" Drop)" },
        @{ Property = "Sampler Set"; Value = "2`" O.D. Split Spoon" },
        @{ Property = "Groundwater Depth (ft)"; Value = "2.0" },
        @{ Property = "Main Form Comments"; Value = "" }
    )
    datasetProfiles = @(
        @{ "Boring ID" = "B-1"; "Top Depth (ft)" = 0.0; "Bottom Depth (ft)" = 0.5; "Soil Type" = "ASPHALT"; "Moisture Condition" = "dry"; "Comments" = "Fresh overlay" },
        @{ "Boring ID" = "B-1"; "Top Depth (ft)" = 0.5; "Bottom Depth (ft)" = 1.0; "Soil Type" = "BASE COURSE"; "Moisture Condition" = "damp"; "Comments" = "" },
        @{ "Boring ID" = "B-1"; "Top Depth (ft)" = 1.0; "Bottom Depth (ft)" = 4.0; "Soil Type" = "FILL/REWORKED"; "Moisture Condition" = "moist"; "Comments" = "Heavy structural compaction observed" }
    )
    datasetRuns = @(
        @{ "Sample ID" = "S-1"; "Start Depth (ft)" = 0.0; "End Depth (ft)" = 2.0; "SPT N-Value" = 6; "Recovery (in)" = 18; "Field Testing Notes" = "PID: 0.0 ppm"; "Comments" = "Initial baseline standard check run" },
        @{ "Sample ID" = "S-2"; "Start Depth (ft)" = 2.0; "End Depth (ft)" = 4.0; "SPT N-Value" = 8; "Recovery (in)" = 16; "Field Testing Notes" = "PID: 0.2 ppm"; "Comments" = "" },
        @{ "Sample ID" = "S-3"; "Start Depth (ft)" = 4.0; "End Depth (ft)" = 6.0; "SPT N-Value" = 14; "Recovery (in)" = 22; "Field Testing Notes" = "PID: 0.0 ppm"; "Comments" = "" }
    )
    referenceSoilTypes = @(
        @{ "Major Soil Type" = "fine SAND"; "Behavior" = "granular"; "Cohesionless Min N" = 0; "Cohesionless Max N" = 4; "Density Status" = "Very loose"; "Material Profile" = "FINE SAND"; "Max Weight (pcf)" = 136; "Min Weight (pcf)" = 84 },
        @{ "Major Soil Type" = "fine to medium SAND"; "Behavior" = "granular"; "Cohesionless Min N" = 4; "Cohesionless Max N" = 10; "Density Status" = "Loose"; "Material Profile" = "MEDIUM SAND"; "Max Weight (pcf)" = 136; "Min Weight (pcf)" = 84 },
        @{ "Major Soil Type" = "fine to coarse SAND"; "Behavior" = "granular"; "Cohesionless Min N" = 10; "Cohesionless Max N" = 30; "Density Status" = "Medium dense"; "Material Profile" = "COARSE SAND"; "Max Weight (pcf)" = 136; "Min Weight (pcf)" = 84 }
    )
} | ConvertTo-Json -Depth 10

$exportPath = "$PSScriptRoot\Test_Export.xlsx"
Write-Host "Sending POST request to http://localhost:3000/api/export..."
Invoke-RestMethod -Uri "http://localhost:3000/api/export" `
                  -Method Post `
                  -Body $testData `
                  -ContentType "application/json" `
                  -OutFile $exportPath

Write-Host "Running validation against template..."
node validate-export.js $exportPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pipeline Success: Export perfectly matches template." -ForegroundColor Green
} else {
    Write-Host "❌ Pipeline Failed: Export structure deviated from template." -ForegroundColor Red
}
