# download_data.py
"""Download NIFTY‑50 dataset from Kaggle and convert to Parquet.
Brief steps: authenticate, download, unzip, convert.
"""
import os, zipfile, subprocess, sys
from pathlib import Path

def run_cmd(cmd):
    subprocess.check_call(cmd, shell=True)

def ensure_kaggle_token():
    # Use the kaggle.json placed in the user's .kaggle directory
    kaggle_dir = Path('C:/Users/sajal/.kaggle')
    token_path = kaggle_dir / 'kaggle.json'
    if not token_path.is_file():
        print('Kaggle token not found. Ensure kaggle.json exists in C:/Users/sajal/.kaggle')
        sys.exit(1)
    os.environ['KAGGLE_CONFIG_DIR'] = str(kaggle_dir)

def download():
    ensure_kaggle_token()
    # Dataset from Kaggle
    dataset = 'rohanrao/nifty50-stock-market-data'
    data_dir = Path('data/raw')
    data_dir.mkdir(parents=True, exist_ok=True)
    run_cmd(f'kaggle datasets download -d {dataset} -p {data_dir} --unzip')

def convert_to_parquet():
    import pandas as pd, pyarrow as pa, pyarrow.parquet as pq
    raw_dir = Path('data/raw')
    parquet_dir = Path('data/parquet')
    parquet_dir.mkdir(parents=True, exist_ok=True)
    for csv_file in raw_dir.glob('*.csv'):
        df = pd.read_csv(csv_file)
        table = pa.Table.from_pandas(df)
        pq.write_table(table, parquet_dir / f"{csv_file.stem}.parquet")

if __name__ == '__main__':
    download()
    convert_to_parquet()
    print('Download and conversion complete.')
