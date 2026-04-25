# Carburos × Vodafone Trackery — IoT Edge para Botellas de Gas

> Plataforma de telemetría IoT Edge para la flota de botellas de gas industrial de Carburos Metálicos sobre Vodafone Trackery (NB-IoT).

[![Estado](https://img.shields.io/badge/estado-piloto-blue)]()
[![Botellas](https://img.shields.io/badge/botellas-105-brightgreen)]()
[![Clientes](https://img.shields.io/badge/clientes-10-orange)]()
[![ROI](https://img.shields.io/badge/ROI%20a%C3%B1o%201-%2B32%25-success)]()

---

## El proyecto en 30 segundos

Cada botella de gas (acetileno, hidrógeno, oxígeno, argón, nitrógeno, CO2, helio, mezclas) lleva un **sensor IoT Edge a 150 €/unidad** con SIM NB-IoT de Vodafone Trackery (18 €/año). Telemetría continua de presión, temperatura y volumen → motor de detección de anomalías → dashboard.

**Resultado:** detección anticipada de fugas, eliminación de paradas críticas en cliente, optimización de rutas logísticas y recuperación de activos. **Payback medio: 9,1 meses · ROI año 1: +32 %.**

---

## Estructura del repositorio

```
.
├── README.md                              ← este archivo
├── anomalies.py                           ← motor de detección (Python)
├── sensor_data.csv                        ← dataset sintético crudo (105 dispositivos × 14 días)
├── sensor_data_scored.csv                 ← dataset enriquecido con z-score, drift, risk_score
├── devices_summary.csv                    ← agregado por dispositivo
├── metrics.json                           ← métricas globales para los dashboards
├── Carburos_IoT_Executive_OnePager.pdf    ← one-pager comercial A4
├── Guia_Calculadora_ROI.md                ← guía interna para defender la calculadora ROI
└── dashboards/
    ├── dashboard_client_es.html           ← demo cliente (castellano, con calculadora ROI)
    ├── dashboard_client_ca.html           ← demo cliente (català, con calculadora ROI)
    └── dashboard_operations_es.html       ← vista interna de operaciones (castellano)
```

> **Nota:** los 3 HTML son **autocontingudos** (un solo fitxer cada uno, sin dependencias externas, gráficos en SVG inline). Se obren a Chrome / Edge / Firefox sin servidor, sin internet, sin permisos especiales.

---

## Cómo usarlo

### Opción A — Solo abrir los dashboards

Doble-click sobre cualquier archivo `dashboards/*.html`. Funciona offline.

| Archivo | Para quién | Idioma | Calculadora ROI |
|---|---|---|---|
| `dashboard_client_es.html` | Demos a clientes | Castellano | ✅ Sí |
| `dashboard_client_ca.html` | Demos en catalán | Català | ✅ Sí |
| `dashboard_operations_es.html` | Equipo interno Carburos | Castellano | ❌ No (vista de pipeline) |

### Opción B — Ejecutar el motor de anomalías

Requisitos: Python 3.9+, pandas, numpy.

```bash
pip install pandas numpy
python -c "from anomalies import IoTAnomalyEngine; eng = IoTAnomalyEngine(z_threshold=3.5, drift_threshold=0.30); df = eng.run('sensor_data.csv'); df.to_csv('sensor_data_scored.csv', index=False)"
```

### Opción C — GitHub Pages (visible desde cualquier sitio)

1. Push del repo a GitHub (ver sección siguiente).
2. **Settings → Pages → Source: Deploy from branch → main / `dashboards/`**.
3. URLs públicas (ejemplo):
   - `https://<tu-usuario>.github.io/<repo>/dashboard_client_es.html`
   - `https://<tu-usuario>.github.io/<repo>/dashboard_client_ca.html`
   - `https://<tu-usuario>.github.io/<repo>/dashboard_operations_es.html`

> ⚠️ Al ser repositorio público, no incluyas datos reales de clientes. El dataset de este repo es **sintético**.

---

## Detalle técnico — `anomalies.py`

Clase `IoTAnomalyEngine` que combina dos detectores complementarios sobre la serie de presión:

1. **Z-score con ventana móvil** (24h por defecto): identifica picos puntuales que se desvían > 3,5σ de la media local.
2. **Drift detector**: media móvil de la primera derivada de la presión. Detecta caídas / subidas sostenidas que un solo z-score no atrapa (fugas lentas).

El `risk_score` final es una combinación ponderada (60% z-score, 40% drift) en escala 0–100.

```python
from anomalies import IoTAnomalyEngine

engine = IoTAnomalyEngine(window=24, z_threshold=3.5, drift_threshold=0.30)
df = engine.run("sensor_data.csv")
print(df.nlargest(10, "risk_score")[["device_id","gas","client","risk_score"]])
```

---

## El dataset sintético

- **35.280 filas** = 105 dispositivos × 14 días × 24 lecturas/día
- **8 tipos de gas** con perfiles de presión realistas (acetileno baja P, hidrógeno alta P, etc.)
- **10 clientes** ficticios (Hospital Vall, PlasmaTech, CryoLab, BeerCraft...)
- **6 anomalías plantadas** repartidas: 3 fugas lentas (Acetileno, Hidrógeno, Oxígeno), 1 pico térmico (Nitrógeno), 2 ráfagas de consumo (Argón, CO2). El motor recupera 5 de las 6 en el top-7 de riesgo.

---

## Métricas económicas de referencia

Basadas en el dataset de 105 dispositivos:

| Concepto | Valor |
|---|---|
| Inversión hardware (105 × 150 €) | 15.750 € |
| SIM NB-IoT anual (105 × 18 €) | 1.890 € |
| **Inversión total** | **17.640 €** |
| Ahorro fugas anticipadas | 4.300 € |
| Ahorro paradas evitadas | 15.300 € |
| Ahorro logística | 2.940 € |
| Recuperación de activos | 756 € |
| **Ahorro total / año** | **23.296 €** |
| **ROI año 1** | **+32 %** |
| **Payback** | **9,1 meses** |

> La calculadora interactiva del dashboard cliente permite ajustar todos estos parámetros en tiempo real durante la demo. Ver `Guia_Calculadora_ROI.md` para el script completo.

---

## Hoja de ruta (próximos pasos)

- [ ] Integración real con la API de Vodafone Trackery (sustituir CSV sintético)
- [ ] Modelo predictivo (LSTM / Isolation Forest) sobre 6 meses de histórico real
- [ ] App móvil para técnicos de campo (notificación push de alertas críticas)
- [ ] Conector con SAP de Carburos para órdenes de servicio automáticas
- [ ] Vista pública por cliente (cada cliente ve solo su flota)

---

## Licencia y contacto

Proyecto interno Carburos Metálicos · Uso comercial restringido.

- **Lead técnico:** Ferran Palacin
- **Lead comercial:** Enrique Vicente
- **Partner:** Vodafone Empresas — Plataforma Trackery

---

*"El sensor no es un sobrecoste, es la diferencia entre vender una botella y vender un servicio."*
