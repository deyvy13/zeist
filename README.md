This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Zeist Design System — lineamientos UI reutilizables

> Referencia para clonar la estética + interacciones de este proyecto en otro. Todo pensado para **Tailwind CSS v4 + React 19 + Next.js App Router**. No hay ninguna librería de componentes UI (shadcn, radix, mui): todos los componentes son propios, con `motion` como única dependencia visual pesada.

## 1. Marca y voz

- **Nombre:** `Zeist` (siempre en title case, no en MAYÚSCULAS).
- **Tono editorial:** frases cortas, sin rodeos, tono profesional-humano. Nada de tecnicismos vacíos ni de promesas infladas.
- **Regla de escritura:** claridad > cantidad. Beneficio concreto en cada frase.
- **Layout general:** editorial y **full-bleed** (bandas de borde a borde), NO "todo tarjeta flotante centrada con sombra". El claymorfismo se usa como acento raro (1-2 piezas por página), no como estilo por defecto.

## 2. Stack y librerías

**Runtime esencial:**

- `next@16.2.12` — App Router, Turbopack, `params`/`searchParams` async.
- `react@19.2.4` + `react-dom@19.2.4`.
- `typescript@5` (strict).
- `tailwindcss@4` + `@tailwindcss/postcss@4` — configuración **CSS-first** en `app/globals.css` con `@theme`. No hay `tailwind.config.js`.

**Animaciones e interacción:**

- `motion@12.42.2` (paquete oficial de framer-motion para React 19). Usado para: reveal-on-scroll, AnimatePresence, useScroll/useTransform (parallax), useMotionValue/useSpring (magnetic cards), useReducedMotion (accesibilidad).

**Contenido / blog:**

- `next-mdx-remote@6` (SSR MDX en Server Components).
- `gray-matter@4` (frontmatter).
- `reading-time@1.5` (tiempo de lectura).
- `remark-gfm@4`, `rehype-slug@6`, `rehype-autolink-headings@7`.

**Utilidades:**

- `clsx@2` + `tailwind-merge@3` (composición de clases).

**No usamos** (aunque se consideraron y descartaron para este stack):

- `@xyflow/react` (ReactFlow) — probado, no renderiza edges con Turbopack + Tailwind v4. Sustituido por SVG puro en `TurboFlow`/`AnimatedFlow`.
- Magic UI / Cult UI vía CLI — sus estilos apuntan a Tailwind v3. Los componentes equivalentes (`AuroraText`, `AnimatedFlow`, grid-beam, animated-beam) se re-implementaron nativos, compatibles con v4 y con nuestros tokens.

## 3. Tokens de diseño

Todo vive en `app/globals.css` bajo `@theme` (Tailwind v4) y bloques `:root` / `:root[data-theme="dark"]` / `@media (prefers-color-scheme: dark)`. **No hay `tailwind.config`.**

**Color de marca:** `#00FFCE` (mint). Escala completa:

```css
--color-mint-50 … --color-mint-900
```

**Neutros:** escala `--color-ink-50 … --color-ink-950` (teal-black).

**Tokens semánticos** (cambian según tema):

- `--color-background`, `--color-surface`, `--color-foreground`, `--color-muted`
- `--color-border`, `--color-hairline`, `--color-accent`, `--color-accent-foreground`
- `--surface-1`, `--band-tint`, `--band-ink`, `--band-mint`
- `--elev-1`, `--elev-2`, `--clay-bg`, `--clay-shadow`
- `--color-code-fg`, `--color-code-bg`, `--color-tag-fg` (flippean en dark mode para legibilidad — bug clásico de dark themes con "código verde sobre fondo verde")

**Tipografía:**

- Display: **Space Grotesk** (títulos, números destacados, eyebrows).
- Cuerpo: **Inter** (párrafos, UI).
- Ambas cargadas vía `next/font` con variables `--font-space-grotesk` y `--font-inter`.
- Reglas base: `letter-spacing: -0.025em` + `text-wrap: balance` en `h1-h4`, `text-wrap: pretty` en `p`.

**Temas:**

- Claro (por defecto) — fondo `#f7fbf9` con gradiente aurora mint fijo.
- Oscuro — fondo `#05100e` con gradientes mint más intensos.
- Toggle: atributo `data-theme` en `<html>` + `localStorage` key `zeist-theme`. Respeta `prefers-color-scheme` cuando no hay preferencia explícita.
- **Ambos temas siempre first-class** — no es "dark como afterthought".

## 4. Utilidades CSS globales

Definidas en `@layer components` dentro de `app/globals.css`. Úsalas antes de escribir Tailwind arbitrario.

**Layout:**

- `.container-zeist` — max-width 78rem, padding responsivo. **Todo contenido va dentro de esto.**
- `.section` — ritmo vertical estándar entre secciones (padding-y ~5-7rem).

**Bandas full-width** (para romper el ritmo tarjeta/tarjeta):

- `.band-tint` — banda con gradiente mint sutil.
- `.band-ink` — banda oscura teal-black (para procesos, footer).
- `.band-mint` — banda mint sólida (para CTAs prominentes).

**Superficies planas** (default, en vez de tarjetas con sombra):

- `.surface` — hairline + sombra whisper, borde suave.
- `.surface-hover` — variante interactiva con transición al hover.
- `.hairline` — divisor de 1px con color hairline.

**Acento (raro):**

- `.clay` — claymorfismo suavizado. Reservar para 1-2 elementos por página (hero visual, panel destacado).

**Turbo border animado** (reutilizable):

- `.turbo-border` — borde con `conic-gradient` mint girando (usa `@property --turbo-angle` para animar el gradiente CSS). Envuelve cualquier card con esto y automáticamente tiene el borde animado. Variante suave: `.turbo-border-soft`.

**Botones:**

- `.btn-primary` — píldora mint sólida.
- `.btn-ghost` — outline con hover.

**Texto:**

- `.eyebrow` — label con línea horizontal a la izquierda (uppercase, tracking-widest, XS).
- `.eyebrow-plain` — mismo pero sin línea.
- `.tag` — chip plano con borde mint (para keywords, categorías).

**Fondo global:** el `body` tiene un gradiente aurora mint fijo (visible pero elegante) en ambos temas. Definido en `@layer base`.

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` fuerza `animation-duration: 0.01ms` y `scroll-behavior: auto` globalmente. Los componentes con motion respetan también `useReducedMotion()`.

## 5. Componentes visuales reutilizables

Viven en `components/visual/`. **Todos client components** (`"use client"`) excepto donde se indique. Todos usan tokens semánticos (no colores hardcoded) — cambia el mint del theme y todo se re-tematiza.

### Backgrounds / patrones

| Componente | Uso | Props principales |
|------------|-----|-------------------|
| `DotPattern` | Patrón de puntos SVG con fade radial | `size`, `radius`, `fade`, `className` |
| `GridPattern` | Grid SVG con máscara radial | `size`, `strokeDasharray`, `className` |
| `GridBeam` | GridPattern + beam mint diagonal animado (estilo cult-ui) | `intensity` (`low`/`mid`/`high`), envuelve `children` |
| `AnimatedBeam` | Línea horizontal con pulso mint recorriendo | `height`, `duration` |

### Text / hero

| Componente | Uso |
|------------|-----|
| `AuroraText` | Texto con gradiente mint animado. **Usar para highlights en headlines, eyebrows.** SSR-safe (puro CSS keyframes). |
| `BlogHero` | Hero para blog posts: eyebrow + título + highlight + auroras + DotPattern |
| `HeroParallax` | Visual del hero de la landing con scroll-driven parallax (blob sube, card baja, opacity fade) |

### Cards / contenido

| Componente | Uso |
|------------|-----|
| `TopicCard` | **Sección colapsable** del blog. Auto-registra en `StepsProvider`, persiste abierto/cerrado en `localStorage`, muestra check al abrir, borde turbo animado cuando está abierto |
| `MagneticCard` | Wrapper con tilt 3D siguiendo cursor + spotlight radial. `intensity`: `subtle`/`normal`/`strong` |
| `Callout` | Bloques `tip`/`info`/`warn`/`success` con icon + label bilingüe (`locale` prop) |
| `CTABlock` | Call-to-action dark con DotPattern, eyebrow + título + body + acción primaria + secundaria opcional. **Props planos** (compatibles con MDX) |

### Diagramas / datos

| Componente | Uso |
|------------|-----|
| `LearningPath` | Grid de N cards con `turbo-border`, animación stagger scroll-reveal, mini AnimatedBeam por card |
| `AnimatedFlow` | Diagrama tipo magicui animated-beam: 2-6 nodos horizontal (desktop) / vertical (mobile) con beam mint entre ellos. `warnCount` tinta los primeros N en ámbar (para "problema → solución") |
| `ComparisonTable` | Tabla comparativa 3 columnas (criterio + A + B). **Fondo animado permanente** grid-beam estilo cult-ui. Prefijo `*` en celda marca el ganador con badge mint + check |
| `TurboFlow` | Diagrama SVG de nodos posicionados con edges + beam animado + bordes conic-gradient. Alternativa a ReactFlow que sí funciona en este stack |

### Progreso / navegación

| Componente | Uso |
|------------|-----|
| `ReadingProgress` | Barra mint fija en el top que crece con `scrollYProgress` |
| `StepsProvider` | Context: registra TopicCards, tracking de abiertos, persist localStorage, `activeId` para TOC |
| `StepsProgress` | Píldora flotante "X/N" con anillo SVG animado. Contador con AnimatePresence al incrementar |
| `PostTOC` | Sidebar sticky (xl+) con lista de secciones. IntersectionObserver marca la activa, click abre + scroll-into-view. Marker animado con `layoutId` |

### Social / compartir

| Componente | Uso |
|------------|-----|
| `ShareLinkedIn` | Botón LinkedIn share-offsite (el OG image + title/description de la página son el preview automáticamente) + botón "Copiar enlace" con feedback |

### Iconos

- `components/icons.tsx` — set de iconos SVG propios (24×24, stroke currentColor, weight 1.8). Ligeros, sin dependencia externa. Naming: `IconWeb`, `IconMobile`, `IconSystem`, `IconCode`, `IconDatabase`, `IconLayers`, `IconGraduation`, `IconArrow`, etc.

## 6. Patrones editoriales de la landing (replicar en páginas nuevas)

- **Hero asimétrico:** texto izquierda + visual clay derecha (grid `lg:grid-cols-[1.05fr_0.95fr]`), un solo highlight con `AuroraText`.
- **Diferenciadores:** listas numeradas con hairlines (no cards con sombra). Layout `lg:grid-cols-[0.9fr_1.1fr]` con título sticky.
- **Servicios/rubros:** filas editoriales con icon + hairline + flecha (no grid de cards), separadas por `border-b border-[color:var(--color-hairline)]`.
- **Proceso:** banda oscura full-width (`.band-ink`) con `<ol>` numerada (4 columnas en lg).
- **Blog:** post destacado grande + lista de recientes con hairline.
- **Tools/CTA:** banda mint full-width (`.band-mint`) al final.
- **Header:** barra full-width con hairline que aparece al scroll (NO píldora flotante).
- **Footer:** banda `.band-ink` full-width edge-to-edge (NO tarjeta).

## 7. Sistema de blog con progreso persistente

El sistema es SSR-first pero con state client-side donde importa. Piezas:

1. **MDX en `content/blog/<locale>/<slug>.mdx`** con frontmatter (`title`, `description`, `date`, `author`, `tags[]`, `draft?`, `cover?`).
2. **`lib/blog.ts`** — helpers: `getPost(locale, slug)`, `getAllPosts`, `getPostSlugs`, `getAllTags`.
3. **`lib/blog-data.ts`** — data compleja (arrays de roadmap steps + FAQs) por slug + locale. **Necesario porque next-mdx-remote/rsc no acepta bien arrays de objetos como props JSX**.
4. **`components/mdx-content.tsx`** — mapa de elementos MDX (`h2`, `code`, `pre`, etc.) + registro de todos los componentes visuales. Cuando se le pasa `slug + locale`, envuelve el body en `<StepsProvider>` + `<PostTOC>` (sidebar xl+) + `<StepsProgress>` (pill).
5. **`<Roadmap />` y `<PostFaqs />`** — wrappers slug-bindeados desde `mdx-content.tsx` que leen automáticamente `lib/blog-data.ts`. En el MDX se usan como `<Roadmap />` sin props.

**Convención para módulos colapsables:** cada módulo del post entero (título + intro + ejemplos + código + calouts) va **dentro de un solo `<TopicCard step="N" title="..." time="...">`**. Todos empiezan cerrados. El lector abre los que quiere. Progreso se muestra en la píldora y sidebar.

## 8. Convenciones técnicas

**i18n:** `es` (default) y `pt`. Todas las rutas con prefijo `/{lang}/`. Middleware en `proxy.ts` (Next 16 renombró de `middleware.ts`). Diccionarios en `dictionaries/{lang}.json`, tipo inferido de `es.json`. Helper `localizedPath(lang, path)`.

**SEO:**

- **`lib/seo.ts` → `buildMetadata()`** — único lugar para generar `<head>`. Genera canonical, hreflang recíproco + x-default, OG, Twitter, robots.
- **JSON-LD** en cada página relevante: Organization + WebSite (layout), Service (detalle de servicio), BlogPosting + BreadcrumbList + FAQPage (blog posts). El schema FAQ se emite automáticamente desde `<Faqs>` con `FaqJsonLd`.
- **Jerarquía de encabezados:** UN `<h1>` por página, `<h2>` para secciones, `<h3>` para subsecciones/cards. No romper.
- **`opengraph-image.tsx`** dinámico en la raíz de `app/` — genera OG images por ruta on-demand.
- **`sitemap.ts`** con todas las rutas × ambos locales + `alternates.languages`.

**MDX + props complejos (gotcha importante):**

`next-mdx-remote/rsc@6` **no pasa bien arrays de objetos** como props JSX (`items={[{...}]}` llega vacío). Soluciones:

1. **Props planos** — string pipe-separated: `rows="A|B|C || D|E|F"`.
2. **Lookup por slug** — la data vive en `lib/blog-data.ts` y el componente la lee vía context/slug. Ej: `<Roadmap />` (sin props) lee de `blog-data[slug][locale]`.

Los objetos anidados simples SÍ funcionan en algunos casos, pero es más seguro evitar arrays.

**Sandbox de `<Handle />` y ReactFlow:** en Next 16 + Turbopack + Tailwind v4 + React 19, `@xyflow/react` v12 no renderiza edges (nodos sí). Usa la implementación SVG propia (`TurboFlow` / `AnimatedFlow`).

## 9. Interacciones y micro-UX

- **Reveal on scroll:** `motion.div` con `initial={{ opacity: 0, y: 24 }}` + `whileInView={{ opacity: 1, y: 0 }}` + `viewport={{ once: true, margin: "-80px" }}` + `transition={{ duration: 0.5, ease: "easeOut" }}`.
- **Stagger:** en listas, `delay: i * 0.05` en el `transition`.
- **Progreso de scroll:** `useScroll` + `useTransform` para parallax; `scrollYProgress` para barras.
- **Magnetic:** `useMotionValue` + `useSpring` (stiffness 220, damping 22) para movimiento elástico del cursor.
- **Turbo border animado:** requiere `@property --turbo-angle` (soporte moderno). Fallback: borde estático en navegadores que no soporten `@property`.
- **Reducción de movimiento:** todos los componentes con motion consultan `useReducedMotion()` y desactivan animaciones cuando el usuario lo prefiere. La regla global en `@media (prefers-reduced-motion: reduce)` es el fallback.

## 10. Cómo replicar este design system en otro proyecto

Pasos mínimos:

1. **Copia `app/globals.css`** — es el corazón del design system. Ajusta `--color-mint-*` a tu color de marca (todo lo demás se re-tematiza).
2. **Copia `components/visual/`** entera. Adapta las labels bilingües (`es`/`pt`) si tu app tiene otros idiomas.
3. **Copia `components/icons.tsx`** o reemplaza con tu set.
4. **Instala:** `npm install motion next-mdx-remote gray-matter reading-time remark-gfm rehype-slug rehype-autolink-headings clsx tailwind-merge`.
5. **Configura fuentes** con `next/font`: Space Grotesk (display) + Inter (cuerpo). Expón variables `--font-space-grotesk` y `--font-inter` en el `<html>`.
6. **Copia `theme-toggle.tsx`** si quieres el switcher claro/oscuro con persistencia.
7. **Copia `lib/seo.ts`** para el patrón `buildMetadata()`.
8. **Si tu proyecto tiene blog MDX:** copia también `components/mdx-content.tsx`, `lib/blog.ts`, `lib/blog-data.ts` y el patrón `content/blog/<locale>/<slug>.mdx`.

**Reglas para escalar el design system:**

- No añadas colores hardcoded — extiende `--color-mint-*` o crea un token nuevo.
- Antes de crear un componente nuevo, revisa si `TopicCard`, `MagneticCard`, `CTABlock` o `AnimatedFlow` ya cubre el caso.
- Cualquier "tarjeta con sombra flotante centrada" es señal de alarma — probablemente debería ser una sección full-bleed con hairline o una banda.
- Un solo `AuroraText` por título — más es ruido.
- Turbo border sólo en elementos que quieres destacar (open state, ganador de comparativa). No en todo.
