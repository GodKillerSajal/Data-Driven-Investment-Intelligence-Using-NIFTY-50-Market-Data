# Data-Driven Investment Intelligence Using NIFTY-50 Market Data

An end-to-end quantitative analytics and portfolio intelligence pipeline leveraging two decades of historical NIFTY-50 market data (2000–2021). The project encompasses feature engineering with technical and momentum indicators, return forecasting experiments, risk-adjusted portfolio construction across investor risk profiles, and an interactive Streamlit dashboard.

---

## 1. Pipeline Overview

- **Data Ingestion**: Historical daily price and volume data covering NIFTY-50 index constituents (2000–2021).
- **Technical Feature Engineering**:
  - *Trend Indicators*: 20-day and 50-day Simple Moving Averages (SMA), 20-day Exponential Moving Average (EMA).
  - *Momentum Signals*: Relative Strength Index (RSI-14), Rate of Change (ROC), Moving Average Convergence Divergence (MACD).
  - *Volatility Regimes*: 20-day rolling returns standard deviation and Bollinger Bands.
- **Predictive Modeling & Evaluation**: Supervised Gradient Boosting Regressor trained on lagged indicators to forecast next-day returns, evaluated with strict out-of-sample temporal cross-validation.
- **Portfolio Construction & Risk Profiling**: Dynamic allocation frameworks across Conservative, Balanced, and Aggressive profiles incorporating Sharpe Ratio, Sortino Ratio, and Maximum Drawdown analysis.
- **Model Explainability**: SHAP (SHapley Additive exPlanations) feature attribution identifying key volatility and momentum drivers.
- **Interactive Dashboard**: Streamlit web application for market exploration, indicator visualization, and simulated portfolio tracking.

---

## 2. Experimental Modeling Evaluation

Financial return forecasting on daily equity indices exhibits high noise-to-signal ratios, as reflected in out-of-sample benchmark metrics:

| Metric | Out-of-Sample Value |
|---|---:|
| **MAE** | 0.01458 |
| **RMSE** | 0.02357 |
| **$R^2$** | -0.00413 |
| **Directional Accuracy** | 50.17% |

*The model reflects standard market-efficiency dynamics where short-horizon directional predictions closely track random-walk bounds, highlighting the importance of risk management, stop-losses, and dynamic asset allocation over raw directional forecasting.*

---

## 3. Portfolio Allocation & Risk Profiles

Simulated performance across investor risk profiles:

| Profile | Target Allocation (Equity / Debt) | Annualized Return | Volatility | Sharpe Ratio | Max Drawdown |
|:---|:---:|---:|---:|---:|---:|
| **Conservative** | 10–30% / 70–90% | 6.65% | 3.79% | 0.434 | -8.60% |
| **Balanced** | 35–65% / 35–65% | 5.18% | 11.41% | 0.016 | -25.97% |
| **Aggressive** | 40–95% / 5–60% | 4.14% | 19.52% | -0.044 | -42.42% |

---

## 4. Getting Started

### Installation
```bash
pip install -r requirements.txt
```

### Data Download
Configure your Kaggle API credentials (`kaggle.json`) and run:
```bash
python download_data.py
```

### Launch Interactive Dashboard
```bash
streamlit run app/app.py
```
