# MR-OSO Carwash + AI Demo

Demo de gestión para autolavado con **insights de negocio generados por IA** (Claude Haiku 4.5).

## Stack

- React 19 + Vite 7 + Tailwind 4
- Recharts (gráficas)
- Express + Anthropic SDK (backend pequeño solo para proteger la API key)

## Setup (3 pasos)

```bash
# 1) Instalar dependencias
npm install

# 2) Configurar la API key de Anthropic
cp .env.example .env
#    Abre .env y pega tu key en ANTHROPIC_API_KEY=
#    Conséguela en: https://console.anthropic.com/settings/keys

# 3) Arrancar TODO (web + api)
npm run dev:all
```

- Frontend: <http://localhost:5173>
- API IA:   <http://localhost:3001/api/health>

> Si solo quieres mostrar la demo sin tocar la API, marca **"Modo Demo"** dentro del modal de Insights — usa respuesta pre-cargada y gasta **0 tokens**.

## Feature de IA: "Insights de Caja con IA"

En el Dashboard hay un botón rojo arriba a la derecha: **✨ Insights con IA**.

Al pulsarlo:
1. Calcula métricas **agregadas** del mock (ingresos por día, ticket promedio, top servicios, etc).
2. Envía SOLO ese resumen a Claude (no la data cruda).
3. Devuelve JSON estructurado con: resumen ejecutivo, mejor día, servicio estrella, alertas y 3 sugerencias accionables con nivel de impacto.

### Optimizaciones para no quemar tokens

| Mecanismo | Ahorro |
|---|---|
| **Cache por hash de métricas** en `localStorage` | Repetir la consulta sobre los mismos datos = 0 tokens |
| **Modo Demo** (toggle en el modal) | Respuesta fija pre-cargada = 0 tokens |
| **Modelo Haiku 4.5** | ~$1 / 1M input, $5 / 1M output (el más barato útil) |
| **`max_tokens: 600`** | Hard cap en la respuesta |
| **Solo se envían métricas agregadas** | ~400–600 tokens de input por llamada |

**Costo estimado por llamada real:** ~$0.001–$0.003 USD. Con $3.60 USD tienes >1.000 llamadas reales (y las repetidas son gratis por el cache).

## Estructura

```
MR-OSO/
├── server/
│   └── index.js              # Express + Anthropic SDK (API key vive aquí, NO en el browser)
├── src/
│   ├── pages/Dashboard.jsx   # Botón "Insights con IA"
│   ├── components/InsightsModal.jsx
│   ├── services/aiInsights.js  # Cache + demo mode + agregación de métricas
│   └── data/mockData.js
├── .env.example              # Pega tu key acá (copiar a .env)
└── vite.config.js            # proxy /api → :3001
```

## Para prestar la demo

1. `npm run dev:all`
2. Abre <http://localhost:5173>
3. Click en **✨ Insights con IA**
4. Si quieres 100% offline / 0 tokens: activa **"Modo Demo"** dentro del modal antes de demostrar.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Solo frontend Vite |
| `npm run server` | Solo backend Express |
| `npm run dev:all` | Ambos en paralelo (recomendado en local) |
| `npm run build` | Build de producción del frontend |

## Deploy en Netlify

El backend Express (`server/`) NO corre en Netlify — se reemplaza por la **Netlify Function** en `netlify/functions/chat.mjs`, que hace exactamente lo mismo. El frontend sigue llamando a `/api/chat` y `netlify.toml` lo redirige al function.

**Pasos:**

1. Push del repo a GitHub (ya está conectado).
2. En Netlify → **Add new site → Import from GitHub** → elige `MR-OSO`.
3. Build settings (Netlify los autodetecta del `netlify.toml`, pero por si acaso):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
4. **Site settings → Environment variables → Add variable:**
   - Key:   `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (tu API key real)
5. Deploy. Listo.

> El `.env` local NO se sube (está en `.gitignore`). La key vive en Netlify env vars, segura.
