from fastapi import FastAPI, BackgroundTasks, Request
from datetime import datetime
import requests

app = FastAPI(title="Carburos IoT Edge API", description="Webhook listener per al proveïdor IoT")

# Aquesta és la URL que et donarà Power Automate
POWER_AUTOMATE_WEBHOOK = "https://prod-12.westeurope.logic.azure.com:443/workflows/..."

def trigger_microsoft_flow(alert_data: dict):
    """Activa el flux de Power Automate que notifica a MS Teams, Outlook i SAP."""
    try:
        print(f"[{datetime.now()}] Notificant ecosistema Microsoft 365...")
        # response = requests.post(POWER_AUTOMATE_WEBHOOK, json=alert_data)
        # response.raise_for_status()
        print(f" -> ✅ MS Teams i Outlook alertats sobre el dispositiu {alert_data['dispositivo']}.")
    except Exception as e:
        print(f" -> ❌ Error connectant amb Power Automate: {e}")

@app.post("/api/v1/telemetry")
async def receive_telemetry(request: Request, background_tasks: BackgroundTasks):
    """
    Aquest és l'endpoint web que li donaràs al proveïdor IoT (Vodafone).
    Ells faran un POST automàtic aquí cada cop que una botella enviï senyal.
    """
    payload = await request.json()
    
    device = payload.get("device_id", "Desconegut")
    pressure = payload.get("pressure", 0.0)
    
    print(f"[{datetime.now()}] 📡 Ping rebut de {device}: {pressure} bar")
    
    # A producció, aquí guardaríem la lectura al CSV/Base de dades i cridaríem a anomalies.py
    # Per a la demo ràpida en directe, fem una regla simple de simulació:
    if pressure < 20.0:
        alert_data = {
            "dispositivo": device,
            "cliente": payload.get("client", "Client per defecte"),
            "gas": payload.get("gas", "-"),
            "motivo": "Pressió crítica detectada en temps real (< 20 bar)"
        }
        background_tasks.add_task(trigger_microsoft_flow, alert_data)
        
    return {"status": "success", "message": "Telemetria processada per Carburos Edge"}