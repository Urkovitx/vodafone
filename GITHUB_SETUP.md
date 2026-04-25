# Guia de pujada a GitHub — projecte Carburos × Vodafone

Aquesta guia cobreix les dues pujades:
1. **GitHub personal** (per fer demo, GitHub Pages públic, demo a l'Enrique)
2. **GitHub Carburos Enterprise** (per la versió oficial interna)

---

## Pas 0 — Preparar el projecte localment

Obre PowerShell o cmd a la carpeta del projecte:

```powershell
cd C:\Projectes\97_VODAFONE
```

Crea la carpeta `dashboards/` i mou-hi els 3 HTML (això deixa l'arrel neta i facilita configurar GitHub Pages):

```powershell
mkdir dashboards
move dashboard_client_es.html dashboards\
move dashboard_client_ca.html dashboards\
move dashboard_operations_es.html dashboards\
```

Inicialitza git i fes el primer commit:

```powershell
git init
git add .
git commit -m "Initial commit: IoT Edge Carburos x Vodafone Trackery"
git branch -M main
```

---

## Opció 1 — GitHub Personal (recomanat per fer Pages)

### Crear el repo

1. Vés a https://github.com/new
2. Nom: `carburos-iot-edge` (o el que vulguis)
3. **Private** (recomanat — el dataset és sintètic però conté noms de clients ficticis que poden semblar reals)
4. **NO** marquis "Add a README" (ja en tens un)
5. Crear repo

### Connectar i pujar

GitHub et donarà unes comandes. Fes-les:

```powershell
git remote add origin https://github.com/<el-teu-usuari>/carburos-iot-edge.git
git push -u origin main
```

> Si et demana credencials i fas servir 2FA, has de generar un **Personal Access Token** (Settings → Developer settings → Tokens) i fer-lo servir com a contrasenya.

### Activar GitHub Pages

1. Repo → **Settings** → **Pages** (menú lateral)
2. **Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/dashboards`
4. Save

En 1-2 minuts tens els dashboards a:

```
https://<el-teu-usuari>.github.io/carburos-iot-edge/dashboard_client_es.html
https://<el-teu-usuari>.github.io/carburos-iot-edge/dashboard_client_ca.html
https://<el-teu-usuari>.github.io/carburos-iot-edge/dashboard_operations_es.html
```

> ⚠️ Si has marcat el repo com **Private**, GitHub Pages només funcionarà si tens GitHub Pro o has activat Pages per repos privats. Si vols Pages gratis, has de fer el repo **Public**. En aquest cas, primer revisa que el dataset i els noms són 100% sintètics (que ho són).

---

## Opció 2 — GitHub Carburos Enterprise

Aquí no tens MCP connectada, així que ho hauràs de fer manualment des del teu Windows de Carburos.

### Crear el repo a Enterprise

1. Vés al GitHub intern de Carburos (URL del tipus `https://github.carburos.com` o equivalent)
2. New repository → nom `carburos-iot-edge` → **Internal** o **Private**
3. Sense README/license inicial

### Afegir el remote i pujar

Si ja has fet `git init` al pas 0, només cal afegir un segon remote:

```powershell
git remote add carburos https://github.carburos.com/<usuari-corporatiu>/carburos-iot-edge.git
git push -u carburos main
```

Ara tens **dos remotes**:
- `origin` → GitHub personal
- `carburos` → GitHub Enterprise de Carburos

Per pujar canvis a tots dos:

```powershell
git push origin main
git push carburos main
```

O bé pots fer push als dos d'una tacada amb:

```powershell
git remote set-url --add --push origin https://github.carburos.com/<usuari>/carburos-iot-edge.git
git push origin main
```

---

## Compartir els dashboards a Carburos sense Cowork

Tens 3 vies:

### A) Email / Teams amb el HTML adjunt
Cada `dashboard_*.html` és un fitxer únic autocontingut. L'envies, el reben, doble-click, funciona. **Aquesta és la via més ràpida.**

### B) Carpeta compartida de SharePoint / OneDrive Carburos
Penja els 3 HTML a una carpeta. Comparteix l'enllaç. Quan hi facin click, el HTML s'obre al navegador.

### C) GitHub Pages personal (només per Enrique i tu)
URLs públiques que pots obrir des de qualsevol dispositiu. Ideal per ensenyar a un client en una visita comercial.

---

## Si tens problemes

| Problema | Solució |
|---|---|
| `git push` demana password i no l'accepta | Genera un Personal Access Token (Settings → Developer settings → Tokens, classic, scope `repo`) i fes-lo servir com a password |
| GitHub Pages no s'activa | Repo ha de ser Public (free) o Pro. Revisa Settings → Pages |
| El dashboard es veu malament a Pages | Comprova que has posat la carpeta `/dashboards` com a source. Les URLs porten `/dashboards/...` no a l'arrel |
| Carburos bloqueja github.com | Demana excepció IT. Mentrestant, fes servir només la via A (HTML per email/Teams) |
| El HTML no es veu offline | Estrany — són autocontinguts. Comprova que el navegador no té JavaScript desactivat |

---

## Resum visual

```
   PC Carburos (offline)            ──►   Email/Teams ──► Carburos colleagues
       │
       │ git push
       ▼
   GitHub Personal (privat o públic)
       │
       │ Settings → Pages → /dashboards
       ▼
   github.io URLs públiques (per visites a clients)
       │
       │ git push carburos
       ▼
   GitHub Carburos Enterprise (versió oficial interna)
```

---

*Pujat per: Ferran Palacin · Versió: v1.0 · 2026-04-25*
