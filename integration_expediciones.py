import pandas as pd
from datetime import datetime
import requests
import json

# URL del webhook de Power Automate (es genera en crear el flux "When a HTTP request is received")
POWER_AUTOMATE_WEBHOOK = "https://prod-12.westeurope.logic.azure.com:443/workflows/.../triggers/manual/paths/invoke?api-version=2016-06-01..."

def notify_expediciones(data_path="sensor_data_scored.csv"):
    """Llegeix el dataset processat i envia les alertes a Power Automate (MS Teams/Outlook)."""
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print("Error: No es troba el fitxer. Executa primer anomalies.py")
        return

    # Filtrem només l'última lectura de cada dispositiu
    latest_data = df.sort_values('timestamp').groupby('device_id').last().reset_index()
    
    # Condicions per disparar una acció d'expedició: 
    # Risc alt (fuga/pic) o pressió per sota del 15% (necessita recàrrega)
    critical_alerts = latest_data[(latest_data['risk_score'] > 80) | (latest_data['pressure'] < 20)]
    
    if critical_alerts.empty:
        print(f"[{datetime.now()}] Cap ordre pendent per a Expedicions.")
        return

    print(f"[{datetime.now()}] S'han detectat {len(critical_alerts)} casos crítics. Generant ordres...")

    for _, row in critical_alerts.iterrows():
        motiu = "Risc d'Anomalia Alt" if row['risk_score'] > 80 else "Nivell de Gas Crític"
        
        payload = {
            "dispositivo": row['device_id'],
            "cliente": row['client'],
            "gas": row['gas'],
            "presion_actual": float(row['pressure']),
            "nivel_riesgo": float(row['risk_score']),
            "motivo": motiu,
            "timestamp": datetime.now().isoformat()
        }
        
        # requests.post(POWER_AUTOMATE_WEBHOOK, json=payload) # Descomentar en producció
        print(f" -> 🚀 JSON enviat a Power Automate per a {row['client']} ({row['device_id']}).")

if __name__ == "__main__":
    notify_expediciones()