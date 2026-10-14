# NIFTY-50 Market Analysis

An exploratory workflow combining historical market data, return forecasting, portfolio backtests and a small dashboard. The repository includes the analysis notebooks, scripts, report and dashboard prototype.

## Forecast evaluation

The report evaluates next-day return forecasts on the documented historical sample and reports:

| Metric | Reported value |
|---|---:|
| MAE | 0.014577 |
| RMSE | 0.023570 |
| R² | -0.004126 |
| Directional accuracy | 50.17% |

These results do not show predictive improvement over a simple baseline. The report and code materials do not consistently name the boosting estimator, so this README does not assign a specific model name. Forecast evaluation is separate from the historical portfolio simulations; neither demonstrates future returns or live investment performance.

## Data and reproduction

The project documentation covers NIFTY-50 market history from 2000 through 2021. Raw data is not included. The downloader uses the Kaggle dataset `rohanrao/nifty50-stock-market-data`; users must review its terms and configure their own Kaggle credentials before downloading it.

Install the packages in `requirements.txt`, configure Kaggle credentials through the standard `~/.kaggle/kaggle.json` path or `KAGGLE_CONFIG_DIR`, then run:

```bash
python download_data.py
```

Run the notebooks from `notebooks/` for the analysis. The dashboard prototype is in `app/`.

## Scope and limitations

This is a historical analysis and dashboard prototype. Backtest figures depend on the period, portfolio rules and transaction-cost assumptions. Forecast metrics above are reported experiment results; they are not a claim of investment performance.
