$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Ensure directories
foreach ($dir in @('outputs','models','reports')) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir }
}

$notebooks = @(
    'notebooks/01_EDA.ipynb',
    'notebooks/02_Feature_Engineering.ipynb',
    'notebooks/03_Modeling.ipynb',
    'notebooks/04_Portfolio_Construction.ipynb',
    'notebooks/05_Risk_Assessment.ipynb',
    'notebooks/06_Explainability.ipynb',
    'notebooks/07_Report_Generation.ipynb'
)

foreach ($nb in $notebooks) {
    Write-Host "Executing $nb ..."
    $nbPath = Resolve-Path $nb
    # Use standard jupyter nbconvert execution which defaults to the notebook's directory, or set via config option
    jupyter nbconvert --to notebook --execute "$nbPath" --output "$nbPath" --ExecutePreprocessor.timeout=300
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed executing $nb"
        exit $LASTEXITCODE
    }
}

# Convert final notebook output MD to reports folder
Write-Host "Generating report..."
jupyter nbconvert --to markdown "notebooks/07_Report_Generation.ipynb" --output-dir="reports" --output="Report_Notebook.md"
Write-Host "Pipeline completed successfully. Deliverable_Report.md generated in reports/."
