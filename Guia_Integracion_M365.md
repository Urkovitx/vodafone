# Visió i Arquitectura IoT: Integració M365 i SAP

**Autor:** Ferran Palacin
**Objectiu:** Aquest document defineix com el projecte "Carburos IoT Edge" passa de ser un dashboard visual autònom a convertir-se en un sistema nerviós integrat amb els processos de negoci reals de la companyia (Operacions, Logística i ERP).

---

## 1. FASE 1: Notificacions Intel·ligents (Quick Win)

El primer pas per connectar l'IoT amb Carburos és utilitzar **Power Automate** per rebre les alertes crítiques (fugues o pressió baixa) i orquestrar respostes automàtiques a MS Teams, Outlook i Excel Online (per auditoria).

### Prompt per generar el flux ràpidament amb Copilot

**Nova Arquitectura (Estàndard License):** Python centralitza la lògica d'integració a través de SharePoint per evitar dependre de connectors Premium bloquejats per polítiques IT.

> Crea un flujo automatizado de nube. El desencadenador debe ser 'Cuando se crea un elemento' en SharePoint. 
> 
> A continuación, añade una acción de Microsoft Teams para 'Publicar un mensaje en un chat o canal'. El mensaje debe ser una alerta de mantenimiento utilizando las columnas de SharePoint (Cliente, Dispositivo, Motivo) e incluir un enlace dinámico hacia el elemento de SharePoint creado para que el operador pueda revisarlo y cambiar su estado.

**Passos posteriors al Copilot:**
1. A SharePoint: Crea una Llista anomenada "Alertes Edge IoT" amb les columnes: Dispositiu, Client, Pressió, Motiu i Estat (Pendent / Aprovat / Processat).
2. A Power Automate: Selecciona la llista de SharePoint creada i el canal de Teams destí.
3. A Python: Utilitzarem la Graph API o `Office365-REST-Python-Client` per escriure directament a aquesta llista quan l'algoritme detecti un risc.

---

## 2. EL FACTOR "WOW" (Fases 2 i 3)

Enviar correus està bé per a una prova de concepte, però el veritable impacte de negoci és l'**automatització sense intervenció humana (Zero-Touch Logistics)** utilitzant eines 100% corporatives de Carburos.

Aquestes són les propostes que liderarà la branca tècnica del projecte:

### 🚀 WOW 1: Centre de Control Integrat (SharePoint + Teams)
En absència de botons actius a Teams (política de llicències), transformem SharePoint en el portal d'aprovació d'operacions.
* **Què és?** Quan es detecta una incidència, l'operari rep una alerta a Teams i Outlook amb un enllaç al tiquet de SharePoint.
* **Cas d'ús:** El coordinador clica l'enllaç, valida les dades de pressió aportades pel sensor i simplement canvia l'estat del tiquet a **"Aprovat"**. Això desencadena la segona fase del procés.

### 🚀 WOW 2: Integració Directa amb SAP (Zero-Touch)
Evitem els connectors Premium de Power Automate construint un **Worker autònom en Python**.
* **Cas d'ús:** Un procés invisible en Python (`sap_worker.py`) monitoritza la llista de SharePoint. Tan bon punt l'operari marca un tiquet com a "Aprovat", Python captura la dada, es connecta a SAP (via Mòdul de Funcions RFC / BAPI o OData) i genera la "Ordre de Treball" automàticament. Python torna a SharePoint i marca el tiquet com a "Processat". Operacions escalables sense costos addicionals de llicència.

### 🚀 WOW 3: Geofencing i Prevenció de Robatoris
Les botelles industrials són actius cars (600€+ cadascuna) que sovint es perden a les grans obres o hospitals.
* **Cas d'ús:** L'Edge envia coordenades GPS. A Python definim un polígon virtual (Geofence) utilitzant la llibreria Shapely. Si la botella surt del perímetre del client sense una recollida programada, salta una alerta crítica a Teams amb la localització de Maps, permetent recuperar un actiu de 600€.

### 🚀 WOW 4: Despatx Dinàmic de Rutes (Dynamic Routing)
L'estalvi no ve només de preveure quan s'acaba el gas, sinó d'agrupar recàrregues.
* **Cas d'ús:** Si el client A es quedarà sense Argó dijous, i el client B (a 2 km de distància) es quedarà sense Argó divendres, el nostre algoritme els agrupa. El dimecres s'envia **una ordre consolidada** per recarregar-los tots dos de cop en el mateix viatge del camió, reduint els costos logístics a la meitat.

### 🚀 WOW 5: Panell Executiu a QlikSense per a C-Level
El dashboard HTML és fantàstic per vendre-ho al client extern (feat. Enrique Vicente). Però internament a Carburos, empalmarem l'API FastAPI directament a un conjunt de dades en temps real (Streaming Dataset) de **Power BI**. 
* **Resultat:** Com que Carburos opera amb **QlikSense**, connectarem la Llista central de SharePoint IoT com a font de dades cap a un quadre de comandament executiu a Qlik. El Director d'Operacions podrà veure KPIs com l'estalvi de costos YTD, el % d'alertes ateses i botelles processades de manera interactiva.

---

## 3. Discurs de posicionament intern

Quan tinguis reunions amb directius o responsables d'àrea, el teu *pitch* (com a arquitecte de la solució) ha de ser:

> *"L'Enrique us ha mostrat l'aparador comercial, i és espectacular perquè ens portarà nous contractes. Però el meu objectiu és que 10.000 botelles connectades no saturin el nostre departament d'Atenció al Client ni Logística amb trucades.* 
> 
> *Per evitar costos astronòmics en llicències Premium de Microsoft, he dissenyat una arquitectura pròpia on el nostre codi Python actua com a motor central. L'Edge avisa al nostre SharePoint, i quan vosaltres l'aproveu, Python obre automàticament l'ordre directament a SAP. Hem creat un sistema logístic Zero-Touch amb eines 100% estàndard ja pagades per Carburos."*