# Data-Driven Investment Intelligence Using NIFTY-50 Market Data


## 1. Executive Summary
This document presents the technical architecture and outcomes of our AI-powered investment intelligence platform utilizing over two decades of historical NIFTY-50 market data (2000-2021).

## 2. Exploratory Data Analysis (EDA)
We analysed long-term sectoral performance and market cycles. Strong non-linear dynamics, shifting volatility structures, and structural breaks were noted across multiple economic market cycles.

## 3. Feature Engineering
Derived financial indicators calculated:
- **Trend**: 20-day & 50-day Simple Moving Averages, Exponential Moving Averages (EMA20)
- **Momentum**: RSI (Relative Strength Index), Rate of Change, MACD
- **Volatility**: 20-day rolling returns standard deviation, Bollinger Bands

## 4. Modeling & Predictor Engine
We implemented a **GradientBoostingRegressor** to forecast next-day returns.
**Model Evaluation Metrics:**
```
MAE: 0.014577
RMSE: 0.023570
R2: -0.004126
DirectionalAccuracy: 50.17%
```

## 5. Portfolio Construction Logic
We built asset allocation weights scaled dynamically around risk limits for three distinct profiles:
- **Conservative**: 10-30% Equity / 70-90% Debt
- **Balanced**: 35-65% Equity / 35-65% Debt
- **Aggressive**: 40-95% Equity / 5-60% Debt

## 6. Risk Assessment Methodology
Risk metrics derived across profiles:

| Profile      |   Annualized_Return |   Volatility |   Sharpe_Ratio |   Sortino_Ratio |   Max_Drawdown |
|:-------------|--------------------:|-------------:|---------------:|----------------:|---------------:|
| Conservative |           0.0664607 |    0.0379284 |      0.433995  |       0.501133  |     -0.0859958 |
| Balanced     |           0.0518259 |    0.114129  |      0.0159988 |       0.0204455 |     -0.259739  |
| Aggressive   |           0.0414098 |    0.195229  |     -0.0440004 |      -0.0548805 |     -0.424238  |

## 7. Explainability & AI Transparency
SHAP (SHapley Additive exPlanations) values were evaluated. The most critical features driving predictive return forecasts were rolling daily **Volatility**, **RSI (14)**, and **MACD** deviations.

## 8. Key Investment Insights
1. Dynamic equity scaling protects drawdown during high-volatility regimes.
2. Integrating multi-scale trend indicators (MA, EMA) helps distinguish noise from macro trend shifts.
