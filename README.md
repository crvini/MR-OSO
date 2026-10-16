# Mr Oso Company — Sistema de Gestión

Demo de sistema de gestión para autolavado: control de turnos, catálogo de
servicios, caja y base de clientes.

## Stack

- React 19 + Vite 7
- Tailwind 4
- Recharts (gráficas)
- React Router 7

## Setup

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>.

## Módulos

| Módulo | Qué hace |
|---|---|
| **Dashboard** | Métricas del día, ingresos semanales, estado del lavadero y cola de vehículos |
| **Turnos** | Tablero kanban del flujo de vehículos (recibido → en proceso → listo) |
| **Servicios** | Catálogo de servicios con precio, duración y activar/desactivar |
| **Caja** | Cobro con descuentos, método de pago y corte de caja |
| **Clientes** | Base de clientes, sus vehículos e historial de visitas |

## Estructura

```
MR-OSO/
├── src/
│   ├── pages/        # Dashboard, Turnos, Servicios, Caja, Clientes
│   ├── components/   # Layout (sidebar + navegación)
│   ├── context/      # AuthContext
│   └── data/         # Datos mock de la demo
├── public/           # Logo y estáticos
└── vercel.json       # SPA fallback para react-router
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Sirve el build local |
| `npm run lint` | ESLint |

## Deploy en Vercel

1. Push del repo a GitHub.
2. En Vercel → **Add New → Project** → importa el repo.
3. Vercel detecta Vite solo. Si te lo pide:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy.

`vercel.json` incluye el fallback a `index.html` para que las rutas de
react-router funcionen al recargar.

## Estado

Demo de interfaz: los datos son mock y no hay persistencia. Los formularios de
alta (turno, cliente, servicio) y el corte de caja confirman visualmente pero no
guardan nada.
