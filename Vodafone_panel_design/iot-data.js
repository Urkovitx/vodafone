// ============= INVENTORY DATA =============
window.IOT_DATA = {
  inventory_by_gas: {
    "Argón": 19, "Nitrógeno": 19, "Oxígeno": 15, "Hidrógeno": 13,
    "Mezcla 95/5": 12, "Acetileno": 11, "Helio": 8, "CO2": 8
  },
  inventory_by_client: {
    "Soldaduras Pla": 17, "CoolFood": 13, "CryoLab": 13, "AutoBody": 12,
    "Hospital Vall": 11, "Talleres Riba": 10, "BeerCraft": 9,
    "GasMed Iberia": 9, "PlasmaTech": 9, "IndustrialesPM": 2
  },
  gas_colors: {
    "Argón":      "oklch(0.72 0.10 240)",
    "Nitrógeno":  "oklch(0.70 0.13 200)",
    "Oxígeno":    "oklch(0.72 0.16 25)",
    "Hidrógeno":  "oklch(0.72 0.14 320)",
    "Mezcla 95/5":"oklch(0.70 0.10 280)",
    "Acetileno":  "oklch(0.74 0.12 80)",
    "Helio":      "oklch(0.78 0.12 110)",
    "CO2":        "oklch(0.62 0.06 220)"
  },

  // Top-risk + a wider sample, derived from the real metrics
  devices: [
    { id:"BTL-O2-0058",  gas:"Oxígeno",     client:"Hospital Vall",   pres:172.4, temp:24.1, risk:15.8, cat:"high",  trend:"down", trendVal:"−2,1%/h" },
    { id:"BTL-H2-0042",  gas:"Hidrógeno",   client:"PlasmaTech",      pres:186.5, temp:23.8, risk:15.7, cat:"high",  trend:"down", trendVal:"−1,8%/h" },
    { id:"BTL-AR-0091",  gas:"Argón",       client:"Soldaduras Pla",  pres: 98.1, temp:21.3, risk: 3.9, cat:"med",   trend:"up",   trendVal:"pic"      },
    { id:"BTL-AR-0055",  gas:"Argón",       client:"CryoLab",         pres: 74.2, temp:19.0, risk: 3.7, cat:"med",   trend:"flat", trendVal:"deriva"   },
    { id:"BTL-HE-0098",  gas:"Helio",       client:"GasMed Iberia",   pres:110.4, temp:22.0, risk: 3.2, cat:"med",   trend:"flat", trendVal:"estable"  },
    { id:"BTL-N2-0103",  gas:"Nitrógeno",   client:"CoolFood",        pres:138.3, temp:25.7, risk: 3.0, cat:"med",   trend:"up",   trendVal:"tèrmic"   },
    { id:"BTL-CO2-0077", gas:"CO2",         client:"BeerCraft",       pres: 10.8, temp:18.1, risk: 2.9, cat:"med",   trend:"down", trendVal:"ràfega"   },
    { id:"BTL-H2-0019",  gas:"Hidrógeno",   client:"Talleres Riba",   pres: 65.1, temp:20.5, risk: 2.9, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-HE-0093",  gas:"Helio",       client:"CryoLab",         pres:100.0, temp:19.4, risk: 2.1, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-AR-0065",  gas:"Argón",       client:"Soldaduras Pla",  pres:105.8, temp:21.0, risk: 2.0, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-AC-0017",  gas:"Acetileno",   client:"Talleres Riba",   pres: 16.9, temp:19.8, risk: 1.7, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-O2-0053",  gas:"Oxígeno",     client:"PlasmaTech",      pres: 67.3, temp:21.1, risk: 1.8, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-HE-0097",  gas:"Helio",       client:"AutoBody",        pres: 63.7, temp:20.4, risk: 1.4, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-AR-0066",  gas:"Argón",       client:"Soldaduras Pla",  pres: 93.9, temp:20.9, risk: 1.2, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-MX-0087",  gas:"Mezcla 95/5", client:"AutoBody",        pres: 93.3, temp:20.7, risk: 1.1, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-AR-0070",  gas:"Argón",       client:"Hospital Vall",   pres: 74.1, temp:19.5, risk: 1.2, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-N2-0027",  gas:"Nitrógeno",   client:"CoolFood",        pres:117.1, temp:22.2, risk: 0.4, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-O2-0048",  gas:"Oxígeno",     client:"Hospital Vall",   pres:124.4, temp:21.8, risk: 0.2, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-H2-0018",  gas:"Hidrógeno",   client:"PlasmaTech",      pres:164.9, temp:23.0, risk: 0.1, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-MX-0085",  gas:"Mezcla 95/5", client:"PlasmaTech",      pres:151.7, temp:22.5, risk: 0.0, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-AC-0009",  gas:"Acetileno",   client:"Talleres Riba",   pres:  7.3, temp:18.8, risk: 0.2, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-CO2-0075", gas:"CO2",         client:"BeerCraft",       pres: 24.2, temp:17.9, risk: 0.0, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-N2-0031",  gas:"Nitrógeno",   client:"CryoLab",         pres: 81.2, temp:20.0, risk: 0.0, cat:"low",   trend:"flat", trendVal:"OK"       },
    { id:"BTL-HE-0095",  gas:"Helio",       client:"Talleres Riba",   pres:157.7, temp:22.4, risk: 0.0, cat:"low",   trend:"flat", trendVal:"OK"       }
  ],

  alerts: [
    { id:"BTL-O2-0058", title:"Caiguda sostinguda de pressió", level:"bad",
      meta:"Oxígeno · Hospital Vall · drift −1,8%/h durant 6h · z-score 4,2σ",
      time:"fa 12 min", tech:"Marc R.", eta:"avui 11:00" },
    { id:"BTL-H2-0042", title:"Drift anòmal + temperatura elevada", level:"bad",
      meta:"Hidrógeno · PlasmaTech · risc HSE elevat",
      time:"fa 38 min", tech:"Anna F.", eta:"avui 13:30" },
    { id:"BTL-AR-0091", title:"Pic de pressió puntual", level:"warn",
      meta:"Argón · Soldaduras Pla · z-score 3,7σ",
      time:"fa 1h 14m", tech:null, eta:"pendent" },
    { id:"BTL-AR-0055", title:"Deriva lenta detectada", level:"warn",
      meta:"Argón · CryoLab · finestra 24h",
      time:"fa 2h", tech:null, eta:"pendent" },
    { id:"BTL-HE-0098", title:"Possible micro-fuga", level:"warn",
      meta:"Helio · GasMed Iberia · pèrdua estimada 0,6 bar/dia",
      time:"fa 3h", tech:"Jordi L.", eta:"dimarts" },
    { id:"BTL-N2-0103", title:"Excursió tèrmica", level:"warn",
      meta:"Nitrógeno · CoolFood · pic +6°C en 2h",
      time:"fa 5h", tech:"Marc R.", eta:"dimecres" },
    { id:"BTL-CO2-0077", title:"Ràfega de consum", level:"info",
      meta:"CO2 · BeerCraft · esdeveniment puntual",
      time:"fa 7h", tech:null, eta:"monitoritzat" }
  ],

  technicians: [
    { name:"Marc R.",  load:78 },
    { name:"Anna F.",  load:65 },
    { name:"Jordi L.", load:42 },
    { name:"Marta P.", load:30 }
  ],

  savings_breakdown: [
    { label:"Aturades evitades", value: 15300, color:"oklch(0.68 0.18 25)" },
    { label:"Fugues anticipades", value: 4300, color:"oklch(0.78 0.13 65)" },
    { label:"Logística",          value: 2940, color:"oklch(0.72 0.12 230)" },
    { label:"Recuperació actius", value:  756, color:"oklch(0.74 0.14 155)" }
  ]
};

// ============= SYNTHETIC TIME-SERIES =============
// Generates plausible 14-day hourly pressure + temperature for any device
window.genSeries = function(device) {
  const N = 14 * 24;
  const out = [];
  let p = device.pres + (Math.random() - 0.5) * 4;
  let t = device.temp;
  const isAnom = device.cat === "high" || device.cat === "med";
  // for anomaly devices, plant a slow drift in last 4 days
  const driftStart = isAnom ? N - 96 : N + 1;
  for (let i = 0; i < N; i++) {
    // diurnal temperature
    const hour = i % 24;
    const dayCycle = Math.sin((hour - 6) / 24 * 2 * Math.PI) * 2.5;
    t = device.temp + dayCycle + (Math.random() - 0.5) * 0.6;
    // pressure: small noise
    p += (Math.random() - 0.5) * 0.4;
    // mean revert
    p += (device.pres - p) * 0.04;
    // anomaly drift
    if (i >= driftStart) {
      p -= device.cat === "high" ? 0.18 : 0.06;
      if (device.id === "BTL-N2-0103") t += 0.04;
    }
    // mark anomaly points (plant 3 z-score spikes for anomaly devices)
    let anom = false;
    if (isAnom && (i === N - 80 || i === N - 50 || i === N - 18)) {
      p += (Math.random() > 0.5 ? 1 : -1) * 3;
      anom = true;
    }
    out.push({ i, p: +p.toFixed(2), t: +t.toFixed(2), anom });
  }
  return out;
};

// ============= FLEET-WIDE SERIES =============
// Builds a fleet aggregate series: median + p10/p90 band
window.genFleetSeries = function() {
  const N = 14 * 24;
  const out = [];
  for (let i = 0; i < N; i++) {
    const base = 95 + Math.sin(i / 36) * 4;
    const noise = (Math.random() - 0.5) * 1.2;
    const med = base + noise;
    const lo  = med - 18 - Math.random() * 4;
    const hi  = med + 22 + Math.random() * 4;
    // anomaly markers
    const anom = (i === N - 60 || i === N - 18 || i === N - 6);
    out.push({ i, med:+med.toFixed(2), lo:+lo.toFixed(2), hi:+hi.toFixed(2), anom });
  }
  return out;
};
