# Visió i Arquitectura IoT: Integració M365 i SAP

**Autor:** Ferran Palacin
**Objectiu:** Aquest document defineix com el projecte "Carburos IoT Edge" passa de ser un dashboard visual autònom a convertir-se en un sistema nerviós integrat amb els processos de negoci reals de la companyia (Operacions, Logística i ERP).

---

## 1. FASE 1: Notificacions Intel·ligents (Quick Win)

El primer pas per connectar l'IoT amb Carburos és utilitzar **Power Automate** per rebre les alertes crítiques (fugues o pressió baixa) i orquestrar respostes automàtiques a MS Teams, Outlook i Excel Online (per auditoria).

### Prompt per generar el flux ràpidament amb Copilot

Obre Power Automate, selecciona "Describir para diseñar" (Copilot) i enganxa exactament aquest text (en castellà perquè l'IA de Microsoft ho processi millor als entorns corporatius de la regió):

> Crea un flujo automatizado de nube. El desencadenador debe ser 'Cuando se recibe una solicitud HTTP'. El esquema JSON de entrada contendrá estas variables: dispositivo (cadena), cliente (cadena), gas (cadena), presion_actual (número), nivel_riesgo (número) y motivo (cadena).
> 
> A continuación, añade las siguientes acciones en orden:
> 1. Una acción de Microsoft Teams para 'Publicar un mensaje en un chat o canal'. El mensaje debe ser una alerta de mantenimiento utilizando las variables del cliente, el dispositivo y el motivo.
> 2. Una acción de Office 365 Outlook para 'Enviar un correo electrónico (V2)' dirigido a expediciones@carburos.ast con el resumen de la alerta y los datos de presión actual.
> 3. Una acción de Excel Online (Business) para 'Agregar una fila en una tabla' que sirva como registro de auditoría de la alerta (log).

**Passos posteriors al Copilot:**
1. Revisa i accepta les connexions (Teams, Outlook, Excel).
2. Selecciona el xat/canal de Teams destí i la taula d'Excel.
3. Desa el flux per generar la URL del Webhook.
4. Copia aquesta URL i enganxa-la a la variable `POWER_AUTOMATE_WEBHOOK` de l'script `api.py`.

---

## 2. EL FACTOR "WOW" (Fases 2 i 3)

Enviar correus està bé per a una prova de concepte, però el veritable impacte de negoci (el que farà que Direcció financiï el projecte a gran escala) és l'**automatització sense intervenció humana (Zero-Touch Logistics)**. 

Aquestes són les propostes que liderarà la branca tècnica del projecte:

### 🚀 WOW 1: Targetes Interactives a Teams (Adaptive Cards)
En comptes d'un simple missatge de text al canal d'Operacions, el bot enviarà una **Adaptive Card**. 
* **Què és?** Una targeta visual a MS Teams que inclou dades en viu i botons d'acció reals.
* **Cas d'ús:** Quan la botella del *Hospital Vall* cau al 15%, arriba la targeta al Teams de Logística. El coordinador no ha de canviar d'app: dins del mateix Teams prem un botó que diu **"Aprovar enviament recàrrega"**. En fer clic, Power Automate ho intercepta i obre la comanda al nostre ERP.

### 🚀 WOW 2: Integració Directa amb SAP (Zero-Touch)
Utilitzarem els connectors premium de Power Automate per parlar amb SAP (o el sistema ERP actual).
* **Cas d'ús:** Quan el motor Python detecta que el client està a punt de quedar-se sense O2 (anomalia de deriva de pressió), el sistema de forma autònoma **genera una "Ordre de Treball" o un "Albarà d'Expedició" a SAP** abans fins i tot que el client sàpiga que s'està quedant buit. L'endemà al matí, el camió ja surt carregat amb la seva botella.

### 🚀 WOW 3: Geofencing i Prevenció de Robatoris
Les botelles industrials són actius cars (600€+ cadascuna) que sovint es perden a les grans obres o hospitals.
* **Cas d'ús:** El sensor envia coordenades GPS. A Python definim un polígon virtual (Geofence) al voltant de la fàbrica del client. Si la botella surt d'aquest polígon sense que nosaltres haguem enviat un camió a recollir-la, salta una **alerta vermella de robatori / pèrdua** amb un enllaç directe a Google Maps amb la posició en temps real.

### 🚀 WOW 4: Despatx Dinàmic de Rutes (Dynamic Routing)
L'estalvi no ve només de preveure quan s'acaba el gas, sinó d'agrupar recàrregues.
* **Cas d'ús:** Si el client A es quedarà sense Argó dijous, i el client B (a 2 km de distància) es quedarà sense Argó divendres, el nostre algoritme els agrupa. El dimecres s'envia **una ordre consolidada** per recarregar-los tots dos de cop en el mateix viatge del camió, reduint els costos logístics a la meitat.

### 🚀 WOW 5: Power BI Streaming Analytics per a C-Level
El dashboard HTML és fantàstic per vendre-ho al client extern (feat. Enrique Vicente). Però internament a Carburos, empalmarem l'API FastAPI directament a un conjunt de dades en temps real (Streaming Dataset) de **Power BI**. 
* **Resultat:** El Director General d'Operacions pot tenir l'App de Power BI al seu mòbil i veure el parc "batec a batec", el % de risc global i el total d'euros estalviats comptabilitzant-se en temps real com si fos la borsa.

---

## 3. Discurs de posicionament intern

Quan tinguis reunions amb directius o responsables d'àrea, el teu *pitch* (com a arquitecte de la solució) ha de ser:

> *"L'Enrique us ha mostrat l'aparador comercial, i és espectacular perquè ens portarà nous contractes. Però el meu objectiu és que 10.000 botelles connectades no saturin el nostre departament d'Atenció al Client ni Logística amb trucades.* 
> 
> *Estic construint la integració backend perquè la botella parli directament amb el nostre ERP i amb MS Teams. Volem arribar a un punt on si hi ha una fuga a un hospital a les 3 del matí, a les 3:01h hi hagi una ordre de substitució generada automàticament a SAP i una targeta interactiva pendent d'aprovar al mòbil del cap de logística, reduint la dependència humana i eliminant el cost de les urgències reactives."*