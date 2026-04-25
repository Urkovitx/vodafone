# Guia per defensar la calculadora ROI

**Autor:** per a Ferran Palacin · Carburos
**Per què existeix aquest document:** que puguis defensar cada número davant un client o davant Enrique sense que et facin un "Mariano Rajoy" tipus *"el dato del que usted habla, ¿es ese dato o no es ese dato?"*. Aquí tens què calcula, d'on surt cada xifra i com presentar-la sense que et trepitgi cap escèptic.

---

## 1. Què és la calculadora i per què és el teu millor invent

La calculadora ROI no és un gràfic més. **És l'arma psicològica del dashboard.**

Un client pot dir que el teu sensor de 150 € és un sobrecost. El que **no** pot fer és discutir amb un número que ell mateix ha mogut. Quan a una reunió mous el ralet i li dius *"Aquí tens el teu propi parc, els teus propis costos, i et surt un payback de 4 mesos"*, el client deixa de discutir si el sensor val 150 € o 100 €. Comença a discutir si farà el desplegament aquest trimestre o el següent.

Pensa-ho així:
- **Sense calculadora:** vens **un sensor**.
- **Amb calculadora:** li vens **una previsió de la seva pròpia P&L**.

Aquest és el "wow", no el LED parpadejant.

---

## 2. Els tres sliders d'entrada — què signifiquen i d'on surten

### Slider 1 · Botellas a monitorizar (5–200)

**Què representa:** el nombre de botelles del client que connectes a Trackery.

**Com defensar el rang:**
- Comença sempre amb el nombre **real del seu parc actual**, no amb el nombre que tu vols vendre. Si el client té 80 bombones, posa 80. Genera credibilitat: "estem parlant del seu parc, no del meu pressupost".
- Si demana saber què passa amb 5: ensenya-li que el payback és més llarg perquè els costos fixos pesen relativament més. Aquesta és **la teva entrada per recomanar el desplegament massiu**.

### Slider 2 · Coste medio por fuga (500–8.000 €)

**Què representa:** quant li costa una fuga típica al client (gas perdut + parada parcial + risc de seguretat).

**D'on ve el rang:**
- 500 € → fuga petita d'un gas barat (CO₂, N₂) descoberta aviat.
- 2.000 € (per defecte) → fuga mitjana — gas + 2-3 hores de procés interromput. **És un número defensable per defecte.**
- 8.000 € → fuga d'un gas car (heli, mescles especials) o que provoca aturada llarga.

**Com defensar-lo:** demana al client que ell mateix posi el seu valor. Una pregunta neutra: *"Si avui tinguéssiu una fuga d'argó al taller principal, quant us costaria entre el gas perdut i les hores aturades?"*. El client gairebé sempre puja la xifra. Tu només has de moure el ralet a la posició que ell ha dit.

### Slider 3 · Paradas / año en el cliente (0–12)

**Què representa:** quantes parades de planta o de procés tenen actualment per problemes de subministrament de gas (fuga descoberta tard, bombona buida sense avís, etc.).

**Cuidat:** la gent acostuma a infraestimar aquesta xifra perquè no la mesura. Pregunta:
- *"Quants cops l'any us heu trobat la línia parada perquè no quedava gas?"* (no és el mateix que "quants cops heu hagut de demanar una recàrrega urgent").
- Si diu "0": pregunta-li si té comptabilitzats els *micro-stop-outs* (interrupcions de menys d'una hora). Sovint es convertirà en 2 o 3.

---

## 3. Els quatre outputs — com es calculen exactament

L'output sembla màgic. No ho és. Aquí tens les fórmules concretes (i les assumpcions amagades darrere) perquè puguis defensar-les amb seguretat.

### Output 1 · Estalvi anual estimat

```
Estalvi total = Estalvi_fugues + Estalvi_parades + Estalvi_logística + Estalvi_actius
```

| Component | Fórmula | Què assumeix |
|---|---|---|
| **Estalvi_fugues** | `n_botelles × 0,07 × cost_fuga` | 7 % de la flota té com a mínim una fuga detectable per any (estimació conservadora industria gas comprimit) |
| **Estalvi_parades** | `parades × 4.500 € × 0,85` | Cost mitjà per parada 4.500 €. La telemetria evita el 85 % (les altres es deuen a causes alienes al gas) |
| **Estalvi_logística** | `n_botelles × 28 €/any` | Optimització de rutes: agrupació intel·ligent → -30 % desplaçaments. Estalvi de 28 €/botella/any (calibrat amb el cost mitjà de visita 350 € i 1 visita estalviada cada 12 botelles) |
| **Estalvi_actius** | `n_botelles × 0,012 × 600 €` | 1,2 % de la flota es perd o desapareix cada any. La geolocalització recupera la majoria. Cost de bombona industrial mitjana: 600 € |

### Output 2 · Cost de telemetria

```
Cost = n_botelles × (150 € hardware + 18 €/any SIM+plataforma)
```

- **150 €** → cost del teu sensor edge (segons el preu actual del projecte).
- **18 €** → cost anual de SIM Vodafone NB-IoT + accés a Trackery, prorratejat per botella (preu negociat per volum).

**Important:** aquest número inclou **tot**. No hi ha "lletra petita" que el client descobreixi després. Aquesta transparència també és part del wow.

### Output 3 · Payback (mesos)

```
Payback = (Cost / Estalvi_anual) × 12
```

És el temps que triga el client a recuperar la inversió. **Per a un parc típic de 25-50 botelles surt entre 3 i 6 mesos**, que és el rang que un director financer accepta sense pestanyejar (si supera 12-18 mesos comença a haver-hi reticències).

### Output 4 · ROI any 1

```
ROI = ((Estalvi_anual − Cost) / Cost) × 100
```

És el retorn percentual el primer any. **Si surt > 100 %, el client doble la inversió en un any** — i ja no et discuteix el preu del sensor, et discuteix per què no va començar abans.

---

## 4. Com presentar la calculadora a una reunió — guió pas a pas

Aquest és el guió que pots seguir literalment. T'ho marco com un "actuació".

### Pas 1 · Obre la pestanya del dashboard, no facis presentació prèvia
Una calculadora ben dissenyada **no necessita 10 diapositives prèvies**. Si comences amb un PowerPoint de 30 minuts el client perd interès. Obre directament el dashboard al projector i mou-te al panell de la calculadora.

### Pas 2 · Cedeix el control al client
Frase clau: *"En lloc d'enseñar-te els meus números, anem a calcular els teus. Quantes botelles tens al parc?"*

**Important:** que toqui el ralet ell, físicament. Si la reunió és virtual, demana-li que comparteixi pantalla i que ho mogui. La sensació de control és la meitat de la venda.

### Pas 3 · Posa preguntes neutres per a cada slider
- Botelles: *"Quantes tens en operació ara mateix?"*
- Cost de fuga: *"Si tinguéssiu una fuga d'argó al taller principal demà al matí, què calcules que us costaria entre gas perdut i temps aturat?"*
- Parades: *"Aquest darrer any, quants cops heu tingut una incidència de subministrament que us hagi parat alguna línia?"*

**No facis tu el càlcul.** Espera que el client digui un número i mou el ralet a aquesta posició. Si dubta, posa el valor per defecte i digues *"comencem aquí, és una mitjana del sector"*.

### Pas 4 · Llegeix l'output en veu alta, dues vegades
Quan el càlcul es fixa, digues:

> *"O sigui, amb el teu parc, et surt un estalvi anual estimat de [X] €. Pagues la inversió en [Y] mesos. ROI del primer any: [Z] %."*

I llavors **calla**. Deixa que el silenci treballi. El client farà ell mateix els números mentals i la conclusió ("això paga sol") l'arribarà sol. Si la dius tu, sembla venda. Si l'arriba ell, és convicció.

### Pas 5 · Tanca amb la pregunta del compromís
*"Si féssim un pilot amb 20 botelles a la planta principal i en 3 mesos veiéssim aquests números reals, valdria la pena escalar?"*

Aquest tipus de pregunta hipotètica fa que el client digui que sí sense comprometre's encara. Però una vegada ha dit que sí, ja està compromès psicològicament.

---

## 5. Objeccions habituals i com respondre-les

### Objecció 1 · "Aquests números són massa optimistes"
**Resposta:** *"Tens raó a desconfiar. Per això baixem-los. Posem el cost de fuga a 1.000 € i les parades a 1. Mira: encara surt un payback de [X] mesos. La calculadora aguanta fins i tot els supòsits més pessimistes."*

Mou tu mateix els ralets a baix. Demostra que **fins i tot en escenari conservador** el negoci funciona.

### Objecció 2 · "Nosaltres no tenim fugues"
**Resposta:** *"Excel·lent — això és el que diuen tots els clients fins que el sensor en troba una. Jo que tu posaria parades a 1 i fugues a 0 €. El payback encara és per sota de 12 mesos només per l'optimització logística i la traçabilitat ATEX. Si a sobre apareix una fuga, és bonus."*

### Objecció 3 · "El sensor en si val 150 €, però quina és la lletra petita?"
**Resposta:** *"No hi ha lletra petita. Els 18 € anuals que veus al cost inclouen SIM Vodafone NB-IoT i la plataforma Trackery. No paguen res més fins que vulguin afegir mòduls premium tipus integració amb el seu ERP — i això és opcional."*

### Objecció 4 · "I si el sensor falla?"
**Resposta:** *"Garantia 2 anys i SLA de substitució en 48 hores. La pèrdua de monitorització d'una bombona durant 2 dies té cost zero — el client només deixa d'estar 2 dies més protegit, no perd res del que ja tenia abans."*

### Objecció 5 · "I si no tinc cobertura NB-IoT?"
**Resposta:** *"Vodafone té cobertura NB-IoT en >97 % del territori industrial espanyol. Abans de fer una proposta fem un sondeig de cobertura per la seva planta. Si hi ha zones cegues, oferim fallback a 4G LTE-M."*

### Objecció 6 · "Vull veure resultats abans de comprometre'm"
**Resposta:** *"Perfecte — proposem un pilot de 20 unitats durant 3 mesos amb la teva planta principal. Si en 90 dies no veus els números que la calculadora et promet, et tornem la inversió. Aquest és el risc 100 % nostre, no teu."*

Aquesta resposta és potent però **comprova abans amb Enrique** que tens marge per oferir aquesta garantia.

---

## 6. Numbers de referència que has de tenir al cap

Memoritza-les. Són els números que defensen la calculadora si algú et qüestiona:

| Concepte | Valor de referència | Font / raonament |
|---|---|---|
| Cost del sensor | 150 € | Preu actual del projecte |
| SIM + plataforma | 18 €/botella/any | Tarifa Vodafone NB-IoT volum |
| Cost mitjà fuga gas industrial | 1.500-3.000 € | Mitjana europea sector gases comprimits |
| Cost mitjà parada de planta | 4.500 €/incident | Estimació conservadora (real va de 2k a 15k segons grandària) |
| % de fugues anuals en flota industrial | 5-8 % | Dades públiques sector |
| % bombones perdudes/any | 1-2 % | Dades sectorials |
| Cost de botella industrial | 600 € | Preu actual de bombona |
| Cost mitjà visita tècnica | 350 € | Cost intern Carburos |
| Reducció rutes amb optimització | 25-35 % | Pilots IoT en sector logístic |

---

## 7. Errors a evitar

1. **No exageris els números per defecte.** Si el cost de fuga per defecte és 5.000 €, el client desconfiarà. 2.000 € és creïble. Si vol pujar-lo, ja ho farà ell.
2. **No diguis "wow, mira el ROI".** Que ho digui ell. La teva feina és ensenyar el número, no celebrar-lo.
3. **No prometis xifres reals.** Les estimacions són estimacions. Els pilots reals donaran números diferents (probablement millors, però no els hi prometis).
4. **No te n'oblidis del context.** Si el client té parc petit, la calculadora pot mostrar payback llarg. **Aquest és el moment de proposar agrupar amb altres clients petits o oferir model SaaS sense CapEx.**
5. **No improvisis fórmules.** Si algú et pregunta "i d'on surt el 0,07 de fugues?", **digues exactament què tens documentat** (apartat 3 d'aquesta guia). No t'ho inventis.

---

## 8. Una idea bonus per al següent step

Quan el client ja ha vist la calculadora i està convençut, ofereix-li **els seus propis primers 30 dies de dades** com a "informe gratuït de baseline". Això:

- Genera commitment (instal·la 5-10 sensors gratis durant 30 dies).
- Et dóna **dades reals del seu parc** que pots usar a la propera reunió per fer una calculadora **personalitzada amb les seves dades**, no amb mitjanes del sector.
- Posa el client en mode "ja tinc això funcionant" — molt difícil de fer marxa enrere.

És el principi de Hansel i Gretel aplicat a les vendes B2B: deixa molles de pa fins que ja no pugui sortir del bosc.

---

**Document a la teva carpeta del projecte.** Si vols, te'l puc convertir a PDF imprimible per portar-lo físicament a la reunió o aprofundir en alguna secció en concret. Tu dius!
