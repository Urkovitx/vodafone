import pandas as pd
import numpy as np

class IoTAnomalyEngine:
    """Industrial anomaly detection engine for sensor telemetry."""

    def __init__(self, window=24, z_threshold=3.0, drift_threshold=0.15):
        self.window = window
        self.z_threshold = z_threshold
        self.drift_threshold = drift_threshold

    def load_data(self, path):
        df = pd.read_csv(path, parse_dates=["timestamp"])
        df = df.sort_values(["device_id", "timestamp"])
        return df

    def add_features(self, df):
        df["pressure_diff"] = df.groupby("device_id")["pressure"].diff()
        df["temp_diff"] = df.groupby("device_id")["temperature"].diff()
        df["pressure_roll_mean"] = (
            df.groupby("device_id")["pressure"]
            .transform(lambda x: x.rolling(self.window, min_periods=5).mean())
        )
        df["pressure_roll_std"] = (
            df.groupby("device_id")["pressure"]
            .transform(lambda x: x.rolling(self.window, min_periods=5).std())
        )
        return df

    def detect_zscore_anomalies(self, df):
        df["z_score"] = (df["pressure"] - df["pressure_roll_mean"]) / df["pressure_roll_std"]
        df["anomaly_z"] = df["z_score"].abs() > self.z_threshold
        return df

    def detect_drift(self, df):
        df["drift"] = df["pressure_diff"].rolling(self.window, min_periods=5).mean()
        df["anomaly_drift"] = df["drift"].abs() > self.drift_threshold
        return df

    def compute_risk_score(self, df):
        df["risk_score"] = (
            df["anomaly_z"].astype(int) * 0.6 +
            df["anomaly_drift"].astype(int) * 0.4
        ) * 100
        return df

    def run(self, path):
        df = self.load_data(path)
        df = self.add_features(df)
        df = self.detect_zscore_anomalies(df)
        df = self.detect_drift(df)
        df = self.compute_risk_score(df)
        return df
