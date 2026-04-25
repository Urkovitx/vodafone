from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.client_context import ClientContext
from datetime import datetime

# ---------------------------------------------------------
# CONFIGURACIÓ DE L'ENTORN CARBUROS
# ---------------------------------------------------------
SHAREPOINT_SITE = "https://carburos.sharepoint.com/sites/OperacionesIoT" # Canvia-ho per la URL real del teu site
SHAREPOINT_LIST_NAME = "Alertes Edge IoT"

# Usuari de servei (idealment demanar a IT un compte de servei o App Principal, 
# però per desenvolupar al teu PC pots usar les teves credencials temporals)
USERNAME = "ferran.palacin@carburos.ast"
PASSWORD = "TU_PASSWORD_AQUI" 

def create_sharepoint_alert(device_id: str, client: str, pressure: float, reason: str):
    """Es connecta al SharePoint de Carburos i crea una línia a la Llista d'Alertes."""
    print(f"[{datetime.now()}] 🔄 Connectant a SharePoint Corporatiu...")
    
    try:
        # 1. Autenticació
        ctx = ClientContext(SHAREPOINT_SITE).with_credentials(UserCredential(USERNAME, PASSWORD))
        
        # 2. Obtenir la llista
        sp_list = ctx.web.lists.get_by_title(SHAREPOINT_LIST_NAME)
        
        # 3. Mapeig de columnes (Nota: 'Title' sol ser la columna per defecte)
        item_properties = {
            "Title": device_id,           # Columna per defecte de SP (la renombrarem a Dispositiu)
            "Cliente": client,            # Columna de text
            "Presion": str(pressure),     # Columna numèrica o de text
            "Motivo": reason,             # Columna de text
            "Estado": "Pendiente"         # Columna d'opcions (Pendiente / Aprobado / Procesado SAP)
        }
        
        # 4. Executar l'escriptura
        item = sp_list.add_item(item_properties)
        ctx.execute_query()
        
        print(f"[{datetime.now()}] ✅ Tiquet creat amb èxit a SharePoint! ID de fila: {item.properties['Id']}")
        
    except Exception as e:
        print(f"[{datetime.now()}] ❌ Error d'integració amb SharePoint: {e}")