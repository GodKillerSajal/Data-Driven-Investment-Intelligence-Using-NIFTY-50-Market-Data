# NIFTY‑50 AI-Powered Investment Intelligence Platform

## Overview
This platform implements an end-to-end data-science pipeline and an interactive, glassmorphic investment dashboard utilizing over two decades of historical NIFTY-50 market data (2000-2021). 

The platform offers two ways to run:
1. **Interactive Dashboard (No Setup Required)**: Run the pre-compiled dashboard prototype locally. It contains all final model metrics, stock recommendations, and historical returns pre-packaged.
2. **Full ML Pipeline (For Developers)**: Retrain the LightGBM regressor on Kaggle raw data, re-run feature engineering (grouped by symbol, stationary features), and simulate active portfolio backtests with transaction costs.

---

## How to Run the Interactive Dashboard (Option 1)
**No Python environment, ML libraries, or Kaggle tokens are required.** The dashboard is self-contained in the `/app` folder.

Because modern web browsers block AJAX requests (`fetch()`) on files opened via the `file://` protocol, you must serve the dashboard folder locally.

### Method A: Using Python (Recommended)
If you have Python installed, open your terminal in the project root and run:
```bash
python -m http.server 8000 --directory app
```

### Method B: Using Node.js (npm)
If you have Node.js installed, run:
```bash
npx http-server app -p 8000
```

### Method C: Using VS Code Live Server
If you use VS Code, install the **Live Server** extension, right-click `app/index.html`, and select **Open with Live Server**.

### View the Dashboard:
Open your web browser and navigate to: **`http://localhost:8000`**

---

## How to Run the Full ML Pipeline (Option 2)
To retrain the models and regenerate the data caches:

### 1. Set Up Python Virtual Environment
Open your terminal in the project root:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

### 2. Configure Kaggle Credentials
Create a Kaggle account, download your API token file `kaggle.json`, and place it in the directory `C:\Users\sajal\.kaggle\kaggle.json` (or set the `KAGGLE_CONFIG_DIR` environment variable pointing to the folder containing it).

### 3. Download and Convert Raw Data
Run the following script to download the NIFTY-50 dataset from Kaggle and convert CSVs to Parquet:
```powershell
python data/download_data.py
```

### 4. Execute all Jupyter Notebooks
Run the PowerShell script to sequentially run the notebooks (01_EDA through 07_Report_Generation) and refresh the dashboard data:
```powershell
.\run_pipeline.ps1
```

---

## Final List of Files to Upload to GitHub

To maintain a clean and lightweight repository, commit only the code, dashboard assets, and documentation. Bulky raw data, intermediate parquet caches, local virtual environments, and PDF drafts are excluded by `.gitignore`.

Commit and push the following files/folders to your GitHub repository:

### 1. Interactive Dashboard (The Prototype)
- `app/index.html` - The Glassmorphic HTML structure.
- `app/styles.css` - Custom premium HSL dark-theme styles.
- `app/app.js` - Client-side simulation and charting engine.
- `app/data.json` - Pre-compiled database of model evaluations, return arrays, and stock picks.
- `app/portfolio_cumulative_returns.png` - Cumulative performance graph.
- `app/shap_summary_plot.png` - Feature importance visualization.

### 2. Machine Learning Notebooks (The Pipeline)
- `notebooks/01_EDA.ipynb`
- `notebooks/02_Feature_Engineering.ipynb`
- `notebooks/03_Modeling.ipynb`
- `notebooks/04_Portfolio_Construction.ipynb`
- `notebooks/05_Risk_Assessment.ipynb`
- `notebooks/06_Explainability.ipynb`


### 3. Scripts & Configuration (The Framework)
- `data/download_data.py` - Kaggle downloader and parquet converter.
- `run_pipeline.ps1` - Pipeline orchestrator.
- `reports/Deliverable_Report.md` - Final compiled technical report.
- `README.md` - Instructions and guide (this file).
- `requirements.txt` - Python package list.
- `.gitignore` - Git ignore configuration.
