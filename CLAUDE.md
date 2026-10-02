@AGENTS.md

# Zeist — Contexto del proyecto (para Claude Code)

> Este archivo es la memoria persistente del proyecto. Léelo completo antes de
> trabajar. Si tomas decisiones nuevas de arquitectura, marca o contenido,
> **actualízalo aquí** para no depender del historial del chat.

---

## 1. Qué es Zeist

Zeist es una **marca** de automatización BIM (no un nombre descriptivo).
Igual que Nike o Adidas, el nombre no explica el producto: construye marca.
La web es el activo central para atraer clientes calificados vía **SEO orgánico**.

> ⚠️ **PIVOTE (sep-2026).** Zeist dejó de ser "soluciones tecnológicas para cada
> industria" (6 rubros) y pasó a un **nicho único: automatización BIM para
> Civil 3D y Revit**. Si vas a escribir copy o contenido, léelo entero antes.

**Nicho único:** desarrollo de **add-ins en C# para Civil 3D y Revit**, scripts
Dynamo y formación para equipos BIM. Nada fuera de eso.

**Por qué este nicho (investigado, no supuesto):**
- Mercado BIM: $10.3B (2026) → $27.1B (2034), CAGR 12.9%.
- El equipo combina **ingenieros civiles e ingenieros de sistemas** — barrera de
  dominio que una agencia de software genérica no cruza. Es el eje del copy.
- Contenido técnico de C#/Civil 3D en español: casi inexistente.

**Servicios (4, todos dentro del nicho):**
1. `add-ins-revit-civil-3d` — Add-ins a medida en C#/.NET (core, ticket alto).
2. `automatizacion-dynamo` — Scripts y rutinas Dynamo (entrada accesible).
3. `auditoria-procesos-bim` — Diagnóstico de dónde se pierden horas (oferta de entrada).
4. `cursos-mentorias-bim` — Formación en Revit API, Civil 3D API y Dynamo.

**Público:** ingenieros civiles, arquitectos, técnicos y coordinadores BIM,
oficinas de ingeniería e infraestructura. **No** emprendedores genéricos ni PYMEs
de otros sectores.

## 2. Posicionamiento y voz de marca

- **Diferenciador central:** autoridad técnica de sector. El argumento NO es
  "somos más baratos" — es "somos un equipo de ingenieros civiles e ingenieros de sistemas,
  entendemos tu flujo porque lo vivimos".
- **Los 4 ejes del mensaje:**
  1. Equipo mixto: ingenieros civiles + ingenieros de sistemas (dominio + técnica).
  2. C# y add-ins, no sólo Dynamo (la competencia se queda en programación visual).
  3. Civil 3D de verdad (el ecosistema habla casi sólo de Revit).
  4. Publicamos lo que sabemos (el blog es el motor de captación).
- **Tono:** corto y preciso, **nada de rodeos**. Directo, profesional, elegante.
  Sin tecnicismos vacíos ni promesas infladas. "No ser una gota más en el mar."
- **Regla de escritura:** claridad > cantidad. Frases cortas. Beneficio concreto.
- **Lenguaje simple obligatorio:** el público son ingenieros, no programadores.
  Cada post técnico abre con un `<Callout>` glosario que traduce los términos
  (API = "el menú del restaurante", DLL, bundle, compilar…). **No usar "ribbon"** —
  decir "barra superior de Civil 3D".

### ❌ Mensajes prohibidos (se eliminaron en el pivote, no reintroducir)

- "IA que baja el precio", "más accesible", "reducimos costos", "precios accesibles".
  Posicionar por precio es una carrera al fondo y lo dice todo el mundo.
- Cualquier servicio fuera de BIM: webs, apps, e-commerce, sistemas para PYMEs,
  UX/UI genérico, arquitectura de datos, ciberseguridad.
- Público que no sea del sector AEC.

La IA sí se menciona — pero como **herramienta que acelera el desarrollo**
(plazos), nunca como argumento de precio.

## 3. Público objetivo e idiomas

- **Idiomas (los tres first-class para SEO, sep-2026):** Español (`es`, por
  defecto), Portugués (`pt`) e Inglés (`en`). Los tres deben indexar y rankear
  al 100%, con jerarquía correcta de H1/H2/H3 en cada idioma.
- **Mercado:** global hispanohablante + lusófono (LATAM + Europa) + mercado
  angloparlante (US/UK/global) para el diferenciador de add-ins en C#, donde
  la competencia en inglés (3dshouse, Adyantrix) sólo ofrece servicio, sin
  blog técnico propio. Tono internacional; sin geotargeting a un solo país.
- **El cluster C5 (Perú/Trujillo) es Español-only por diseño.** La normativa
  peruana (Plan BIM Perú, DS 289-2019-EF) y las cifras de Trujillo/La Libertad
  no tienen audiencia en `pt` ni en `en`. `buildMetadata` acepta
  `availableLocales` y `app/sitemap.ts` calcula la disponibilidad real por
  slug — un post en un solo idioma emite hreflang sólo para ese idioma +
  `x-default`, sin declarar alternates que den 404. Ver sección 8.

## 4. Stack técnico (decidido)

| Capa | Elección | Motivo |
|------|----------|--------|
| Framework | **Next.js 16.2** (App Router, Turbopack) | SSR/SSG, mejor SEO, CWV, y app interactiva para las herramientas futuras |
| UI | **React 19** + **TypeScript** (strict) | — |
| Estilos | **Tailwind CSS v4** (config CSS-first en `globals.css`) | Design tokens propios para claymorfismo |
| i18n | **Nativo** (`app/[lang]/` + diccionarios JSON + `proxy.ts`) | Cero dependencia externa, garantizado con Next 16 |
| Contenido | **MDX en git** (`next-mdx-remote/rsc` + `gray-matter`) | Blog versionado, sin CMS, sin costo |
| Hosting | **Vercel** (recomendado) | Mejor rendimiento para Next |

> ⚠️ **Next 16 breaking changes** (ver `AGENTS.md`): `params`/`searchParams` son
> **async** (Promises); el middleware ahora es **`proxy.ts`** (no `middleware.ts`);
> existen helpers globales `PageProps<...>` / `LayoutProps<...>`. Consulta la doc
> embebida en `node_modules/next/dist/docs/` antes de usar APIs nuevas.

## 5. Arquitectura de archivos

```
app/
  [lang]/                     # segmento de locale (es | pt | en)
    layout.tsx                # ROOT layout: html/body, fonts, header, footer, metadata base, JSON-LD Org
    page.tsx                  # Landing (hero, diferenciadores, servicios, proceso, blog, tools, CTA)
    servicios/page.tsx        # Índice de servicios
    servicios/[slug]/page.tsx # Landing de venta de cada servicio (plantilla; contenido en lib/services-content)
    blog/page.tsx             # Índice del blog
    blog/[slug]/page.tsx      # Artículo (renderiza MDX, JSON-LD BlogPosting)
    herramientas/page.tsx     # Hub: herramientas disponibles + propuestas "Pronto" por rubro
    herramientas/<slug>/page.tsx # Una carpeta por herramienta (acero: solo es; Manning: es/pt/en)
    contacto/page.tsx         # Formulario (abre WhatsApp, sin backend aún)
  globals.css                 # SISTEMA DE DISEÑO completo (tokens + claymorfismo)
  sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx   # SEO (raíz)
components/                   # site-header, site-footer, logo, locale-switcher,
                              # theme-toggle, contact-form, mdx-content, icons
lib/
  i18n.ts                     # locales, Locale, getDictionary, Dictionary (tipo)
  site.ts                     # marca, siteUrl, absoluteUrl, localizedPath
  seo.ts                      # buildMetadata() (hreflang, canonical, OG) + JSON-LD helpers
  blog.ts                     # lectura de MDX + frontmatter
  services.ts                 # SERVICE_SLUGS (fuente única) + tipo ServicePage + getServicePage()
  services-content/<locale>.ts # copy largo de las 4 páginas de servicio, por idioma
  analytics.ts                # GA4 (env), trackEvent(), referencia de página en WhatsApp
  tools.ts                    # TOOL_SLUGS + toolLocales + tarjetas (fuente única de herramientas)
  tools/                      # lógica pura y sin imports: steel, manning, xlsx, number
  tools-content/              # copy de cada herramienta (ToolContent + labels de la calculadora)
dictionaries/es.json, pt.json, en.json # strings de UI por idioma (misma forma)
content/blog/<locale>/<slug>.mdx  # artículos del blog
proxy.ts                      # redirección de locale por Accept-Language
```

## 6. SEO — cómo está montado (mantener siempre)

- **`lib/seo.ts` → `buildMetadata()`** es el único lugar para generar `<head>`.
  Cada página con contenido llama a `generateMetadata` y usa `buildMetadata`.
  Genera: `canonical`, `alternates.languages` (hreflang recíproco es/pt + `x-default`),
  Open Graph y Twitter cards, y `robots` (`max-image-preview:large`).
- **`metadataBase`** se fija en `app/[lang]/layout.tsx` desde `siteUrl`.
- **hreflang:** códigos genéricos `es`, `pt` y `en` (cubren LATAM + Iberia +
  mercado angloparlante global). `x-default` → `es`. Un post ES-only (cluster
  Perú) emite sólo su propio hreflang + `x-default`, nunca alternates rotos.
- **Imagen OG:** `app/opengraph-image.tsx` queda por encima del root layout
  (`app/[lang]/layout.tsx`), así que Next **no** la adjunta solo. `buildMetadata`
  la referencia explícitamente (`absoluteUrl("opengraph-image")`) salvo que se
  pase `ogImage`. Sin esto, los enlaces compartidos por WhatsApp/LinkedIn salen
  sin imagen. No existen rutas OG por post.
- **JSON-LD:** Organization + WebSite (layout/landing), Service + FAQPage +
  BreadcrumbList (servicios; + Course en `cursos-mentorias-bim`), BlogPosting (artículos).
- **Sitemap** (`app/sitemap.ts`): todas las rutas × ambos locales, con `alternates.languages`.

### Páginas de servicio = landings de venta (oct-2026)

Son las páginas que deben rankear por búsquedas de **compra** ("plugin para
revit", "revit plugin development company", "consultoría BIM", "curso revit
api") y convertir la visita en un WhatsApp. Antes tenían 21-28 palabras; ahora
~1.200-1.650 por idioma.

- **`SERVICE_SLUGS` vive sólo en `lib/services.ts`.** La página, el sitemap y
  `/llms.txt` lo importan. Para añadir un servicio: slug ahí + entrada en los 3
  `lib/services-content/<locale>.ts` + tarjeta en `services.items` de los 3
  diccionarios + icono en `serviceIcons` (`components/icons.tsx`).
- **Contenido** (`ServicePage`): `seoTitle` (≤52), `metaDescription` (≤160),
  `answer` (definición citable de 60-100 palabras: es lo que extraen Google y
  los asistentes de IA, y lo que publica `/llms.txt`), dolores, qué hacemos
  (cada ítem con `guide` = slug de post), proceso con plazos, entregables,
  comparativa (formato de `ComparisonTable`), guías y FAQs.
- **Enlaces a guías:** sólo se pintan si el post existe en ese idioma (los
  posts del cluster Perú son ES-only), con el título real del post.
- **FAQs con `<details>` nativo**, no con el componente `Faq` animado: las
  respuestas van en el HTML aunque estén cerradas (los crawlers de IA no
  ejecutan JS). El FAQPage JSON-LD se arma en la página.
- **No inventar promesas comerciales** en el copy: plazos, "respondemos en el
  día" y "diagnóstico gratuito" son las que el sitio ya usa. Etiquetas de UI
  en `serviceDetail` de los diccionarios.

### Herramientas gratuitas (/herramientas, oct-2026)

Imán de tráfico SEO con puente a los servicios. Elegidas por demanda real
(autocompletado de Google en Perú): "peso del acero corrugado", "metrado de
acero", "calculadora manning tuberías/canales".

- **Calculadora de acero corrugado** (`/es/...` solamente): peso por diámetro,
  varillas de 9 m por longitud **y por plan de cortes** (primer ajuste
  decreciente: muestra que el método por longitud se queda corto), export a
  `.xlsx` real (`lib/tools/xlsx.ts`, sin dependencias). Tabla NTP 341.031 en
  `lib/tools/steel.ts`. Solo `es` porque las barras y la varilla de 9 m son de
  Perú; pt/en necesitarían sus propias tablas.
- **Conversor de coordenadas** (es/pt/en, la herramienta más buscada: en
  Google Trends Perú, "coordenadas utm" ≈ 6× "dosificación de concreto"):
  UTM ⇄ geográficas y cambio de datum, de un punto o por lotes pegados desde
  Excel (detecta tabulación / ; / , / espacios y coma decimal). El diferencial:
  mapa de verificación (Leaflet + OpenStreetMap, carga diferida), descarga
  PNEZD para Civil 3D (renumera si los nombres tienen letras), Excel y KML,
  factor de escala / convergencia / factor combinado por punto, e historial
  local (`useSyncExternalStore` sobre localStorage; nunca guarda el ejemplo
  sin tocar). Matemática en `lib/tools/coordinates.ts`: Krüger 6.º orden,
  validada contra PROJ (1 mm). Datums con parámetros EPSG: PSAD56 to WGS 84
  (8) para Perú (±16 m; en Trujillo desplaza ~450 m), SAD69 to SIRGAS 2000 (1)
  del IBGE (±5 m), SIRGAS 2000 y NAD83 ≈ WGS 84 (transformación nula).
- **Calculadora de Manning** (es/pt/en): tubo parcialmente lleno y canales
  rectangular/trapezoidal/triangular, caudal o tirante normal, SI o US, Froude
  y tensión tractiva. En tubo circular el caudal máximo es a y/D ≈ 0.938 (no a
  tubo lleno): el solver devuelve el tirante menor y avisa si el tubo entra en
  carga.
- **Arquitectura:** registro en `lib/tools.ts` (lo leen el hub, sitemap,
  selector de idioma y `/llms.txt`); plantilla común `components/tools/tool-layout.tsx`
  (calculadora → respuesta citable → contenido → CTA → FAQ `<details>` →
  guías; schema WebApplication + BreadcrumbList + FAQPage); contenido en
  `lib/tools-content/`. Herramienta nueva = slug + `toolLocales` + tarjeta en
  `lib/tools.ts`, carpeta en `app/[lang]/herramientas/<slug>/` y su contenido.
- **Números:** formato manual (`lib/tools/number.ts`), no `Intl`: los
  resultados se renderizan en el servidor y un separador distinto entre Node
  y el navegador rompería la hidratación. `es` usa punto decimal (como las
  tablas peruanas), `pt` coma. Los inputs aceptan punto o coma.
- **Tests:** `npm run test:tools` (Node ≥ 23.6, importa los `.ts` directamente).
  Las referencias de coordenadas salen de PROJ (pyproj) y están incrustadas
  en el test; para regenerarlas hace falta un venv con pyproj.
  Los valores esperados se calcularon aparte en Python; los números del texto
  de cada página coinciden con el ejemplo precargado de la calculadora:
  cambiarlos juntos.
- **CTA:** el botón de WhatsApp de la calculadora de acero lleva el resultado
  en el mensaje (`data-cta="tool-steel"`); el tracker soporta `href`
  dinámicos (`data-wa-out`). Export a Excel envía el evento `tool_export`.
- ⚠️ Los valores de ingeniería (tabla de pesos, rangos de n, criterios OS.070 /
  NBR 9649 / Ten States) deben revisarlos los ingenieros del equipo.

### Medición: GA4 + clics de WhatsApp (oct-2026)

- **GA4 se activa sólo con `NEXT_PUBLIC_GA_ID`** (formato `G-XXXXXXXXXX`, se
  configura en Vercel → Settings → Environment Variables y se redespliega). Sin
  la variable no se carga ningún script (`components/analytics.tsx`).
- **Consentimiento por región:** en EEE/Reino Unido/Suiza `analytics_storage`
  arranca denegado (Consent Mode v2, sin cookies); en el resto, concedido.
  `ad_storage` denegado en todas partes. Lista en `consentDeniedRegions`.
- **Eventos:** `whatsapp_click` y `contact_click`, con `cta`, `page_path` y
  `locale`. Los dispara `components/cta-tracker.tsx` (un único listener
  delegado), no cada botón. **Todo enlace a WhatsApp o a /contacto lleva
  `data-cta="<ubicación>"`** (p. ej. `service-hero`, `post-early-whatsapp`,
  `mobile-bar`); sin él el clic se registra como `untagged`.
- **Referencia de página en WhatsApp:** al hacer clic, el tracker añade al
  mensaje "(Página: <título>)", así cada lead llega con la página de origen
  aunque GA no esté configurado.
- En GA4 hay que marcar `whatsapp_click` como **evento clave** para verlo como
  conversión.
- **Jerarquía de encabezados:** UN solo `<h1>` por página (título principal),
  `<h2>` para secciones, `<h3>` para tarjetas/subsecciones. **No romper esto.**
- **Dominio:** `NEXT_PUBLIC_SITE_URL` apunta a `https://zeist.vercel.app` (fallback en `lib/site.ts` + `.env.local`). Cambiar en ambos sitios al migrar a dominio propio.

## 7. Sistema de diseño (editorial + claymorfismo como acento)

**Dirección (feedback del usuario, jul 2026):** NADA de "todo tarjeta flotante
centrada con sombra" (se ve hecho con IA). En su lugar: secciones **full-bleed**
(de borde a borde), layouts **asimétricos/editoriales**, bandas de color a todo
el ancho, y **sombras mínimas**. El claymorfismo es un **acento raro** (1–2 piezas
por página, p.ej. el visual del hero), NO el estilo de cada caja.

- **Color de marca:** `#00FFCE` (mint). Escala `--color-mint-50..900`. Neutros
  teal `--color-ink-*`. Tokens: `--color-background/surface/foreground/muted/
  border/hairline/accent`. `--surface-1`, `--band-tint/ink/mint`, `--elev-1/2`.
- **Fondo:** gradiente **aurora** mint fijo en todo el `body` (light y dark),
  definido en `@layer base`. Visible pero elegante.
- **Utilidades** (`@layer components`):
  - Layout: `.container-zeist` (max 78rem), `.section` (ritmo vertical),
    bandas full-width `.band-tint` / `.band-ink` (oscura) / `.band-mint` (mint).
  - Superficies planas (default): `.surface` (hairline + sombra whisper),
    `.surface-hover`, `.hairline` (divisor). Úsalas en vez de tarjetas con sombra.
  - Acento: `.clay` (claymorfismo suavizado, SOLO para hero/destacados).
  - Botones: `.btn-primary` (píldora mint), `.btn-ghost` (outline).
  - Texto: `.eyebrow` (label con línea; `.eyebrow-plain` sin línea), `.tag` (chip plano).
- **Tipografía:** display = **Space Grotesk**, cuerpo = **Inter** (`next/font`).
- **Patrones editoriales usados en la landing** (replicar en páginas nuevas):
  hero asimétrico (texto izq. + visual clay der.), listas numeradas con hairlines
  (diferenciadores), filas de servicio con hairline+flecha, banda oscura full-width
  para el proceso, blog con post destacado + lista, banda mint full-width para tools.
- **Header:** barra full-width con hairline (aparece al hacer scroll), NO píldora
  flotante. **Footer:** banda `.band-ink` full-width edge-to-edge, NO tarjeta.
- **CTA de WhatsApp** (`components/whatsapp-cta.tsx`, montado en el layout raíz):
  desktop = botón circular fijo abajo-derecha con anillo cónico `--turbo-angle`
  (el mismo de `.turbo-border`) + ondas sonar + burbuja de atención una vez por
  sesión; móvil = barra inferior a todo el ancho con copy de venta. Las
  animaciones continuas viven en `globals.css` (`.wa-sonar`, `.wa-float`,
  `.wa-ring`, `.wa-shimmer`) para que el bloque global de
  `prefers-reduced-motion` las apague solo. `body` lleva `padding-bottom` en
  `<768px` para que la barra no tape el footer.
- **Temas:** claro (default) y oscuro (teal-black + glow mint). Toggle en
  `theme-toggle.tsx` (`localStorage` `zeist-theme`, atributo `data-theme` en `<html>`).
  Respeta `prefers-color-scheme` y `prefers-reduced-motion`.
- **Marca:** el nombre se escribe **"Zeist"** (no "ZEIST").

## 8. Blog

- Archivos: `content/blog/<locale>/<slug>.mdx` con frontmatter:
  `title, description, date (ISO), author, tags[], draft?, cover?`.
- `lib/blog.ts`: `getAllPosts(locale)`, `getPost(locale, slug)`, `getPostSlugs`,
  `getAllTags`. Calcula tiempo de lectura. Ordena por fecha desc. Ignora `draft`.
- Para publicar: crear el `.mdx` en `es/`, `pt/` y `en/` (mismo slug para que
  hreflang enlace las tres versiones). `generateStaticParams` los recoge
  automáticamente. Excepción: el cluster C5 (Perú) es ES-only a propósito —
  ver sección 3.
- **`lib/blog-data.ts`** guarda el roadmap y las FAQs de cada post, por slug y
  locale (tipo `Partial<Record<Locale, PostData>>`: no todos los slugs tienen
  las tres claves). Es necesario porque `next-mdx-remote/rsc` **no pasa bien
  arrays de objetos como props JSX**. En el MDX se usan `<Roadmap />` y
  `<PostFaqs />` sin props — se auto-vinculan por slug. Si creas un post con
  esos componentes, añade también su entrada aquí o saldrán vacíos (falla en
  silencio).
- ⚠️ **`TopicCard` (módulos plegables) siempre monta su contenido**: cerrado
  = altura 0 + `inert`. Antes se montaba con `{open && …}` y el 60-80 % del
  texto de cada post (y sus enlaces internos) no existía en el HTML: Google
  no hace clic y los crawlers de IA no ejecutan JS. No volver al montaje
  condicional.
- ⚠️ **Gotcha de MDX:** `{llaves}` fuera de un bloque de código rompen el build
  ("Could not parse expression with acorn"). Usa backticks + `<ángulos>`.

### Arquitectura SEO: 4 topic clusters

El blog no es una lista de posts sueltos — es una jerarquía pillar/satélite.
Cada satélite enlaza a su pillar con anchor text de keyword, y el pillar enlaza
a sus satélites. Al crear un post, **asígnalo a un cluster y enlázalo**.

| Cluster | Pillar | Satélites |
|---|---|---|
| **C1 · Add-ins C#** (el diferenciador) | `desarrollo-add-ins-revit-civil-3d-guia-completa` | `crear-plugin-civil-3d-con-claude-code-sin-programar`, `dynamo-vs-csharp-civil3d-revit`, `cuanto-cuesta-un-add-in-revit-civil-3d`, `revit-api-espanol-primeros-pasos`, `comparar-modelos-revit-civil-3d-detectar-cambios`, `plugin-acero-revit-modelado-revision` |
| **C2 · Civil 3D** (el hueco más grande) | `automatizar-civil-3d-guia-completa` | `deja-de-usar-excel-y-perder-horas`, `automatizar-metrados-cubicaciones-civil-3d` |
| **C3 · IA + BIM** (sin competencia) | `dynamo-csharp-con-ia-claude` | `guia-vibe-coding-para-empezar`, `crear-plugin-...-claude-code` |
| **C4 · Carrera** (captación de funnel) | `programacion-para-ingenieros-civiles` | `aprende-a-programar-desde-cero`, `ramas-ingenieria-sistemas-especializaciones` |
| **C5 · Perú / Corporativo** (dolor de dirección, ticket alto, SEO local) | `plan-bim-peru-obligatorio-guia-empresas` | `expediente-tecnico-observaciones-reducir`, `automatizacion-bim-trujillo-la-libertad`, `reprocesos-obra-costo-oculto`, `estandarizar-procesos-bim-empresa` |
| **C6 · Redes y dibujo 3D** (utilities: agua, desagüe, eléctrico) | `plugin-civil-3d-dibujo-3d-automatizado` | `redes-tuberias-civil-3d-accesorios`, `banco-de-ductos-civil-3d` |

> **C5 es sólo `es`.** La normativa (Plan BIM Perú, DS 289-2019-EF) y el mercado local no se
> traducen a `pt`. `buildMetadata` acepta `availableLocales` y `app/sitemap.ts` calcula la
> disponibilidad real por slug, así que un post ES-only emite `hreflang="es"` + `x-default`
> y nada más. **Si creas un post en un solo idioma, no hace falta tocar nada** — ya funciona.
> Datos de respaldo del cluster: obligatoriedad desde agosto 2026 en los 3 niveles de gobierno;
> RD 0007-2025-EF (14 tipologías críticas); cartera 2026 de La Libertad: GORE ~S/180M (19
> proyectos, Obras por Impuestos), MPT ~S/80.4M (28 obras), privada ~S/65M.

> **C6 (sep-2026), keywords validadas con el autocompletado de Google:** "red de agua potable civil 3d", "alcantarillado sanitario civil 3d", "accesorios de tuberías" (codos, tees, yees), "banco de ductos" (más volumen que "bancoductos"; variantes CFE, media tensión, prefabricados), "plugin civil 3d"; en inglés "civil 3d pressure network parts list", "pipe network not drawing pipes", "duct bank concrete/spacers", "best civil 3d plugins". Los 3 posts existen en es/pt/en. Los hechos técnicos a no contradecir: Civil 3D **no** trae objeto de banco de ductos (se modela con corredor + Subassembly Composer, red de tuberías paralela o sólidos 3D); la detección de choques no mide separaciones mínimas.

> **Conversión y respuestas de IA (sep-2026).** (1) Todo post muestra un CTA de servicio **bajo el título** (`components/post-early-cta.tsx`, copy en `blog.earlyCta` de los diccionarios); el frontmatter opcional `ctaTitle` lo adapta al dolor del post. (2) `seoTitle` (≤52 caracteres) para el `<title>`; `title` largo queda como `<h1>`. (3) Los posts nuevos abren con un `<Callout type="success" title="Respuesta rápida">`: 60-100 palabras que responden la búsqueda principal de forma citable — es lo que extraen Google y los asistentes de IA. (4) `/llms.txt` (`app/llms.txt/route.ts`) se genera del mismo contenido y `robots.ts` permite explícitamente a GPTBot, ClaudeBot, PerplexityBot, Google-Extended.

**Fuente única de clusters: `lib/clusters.ts`.** Al crear un post, añádelo ahí: de ese mapa salen la prioridad 0.9 de los pillars en el sitemap y los "relacionados" del final de cada artículo (`getRelatedPosts`: pillar del cluster → satélites → etiquetas comunes → otros pillars). Antes los relacionados eran "los 2 posts más nuevos", lo que dejaba a los pillars sin enlaces.

### Competencia (investigada sep-2026)

- **especialista3d.com** — el líder en español. Domina **Revit + Dynamo + Python**,
  4000+ alumnos, blog denso. **No competir con ellos ahí.**
- Editeca, Konstruedu, Ingeoexpert, EngineerGeek — venden cursos, poco blog.
- 3dshouse, Adyantrix — desarrollo de add-ins como servicio, **sólo en inglés**.

**Dónde gana Zeist:** C# / add-ins · Civil 3D (vs Revit) · servicio (vs curso) ·
IA + BIM · keywords de dinero ("cuánto cuesta un add-in").

## 9. Roadmap (por fases)

- **Fase 1 (MVP, HECHA):** Landing + Servicios + Blog (MDX) + Herramientas +
  Contacto. i18n es/pt. SEO completo.
- **Fase 2 (HECHA, jul-2026):** reorganización de 4 servicios de software a 6 rubros.
- **Fase 3 — PIVOTE A NICHO ÚNICO (HECHA, sep-2026):** de 6 rubros genéricos a
  **automatización BIM** con 4 servicios. Se eliminó todo el mensaje de
  "IA baja el precio". Blog reorganizado en 4 clusters SEO: 4 posts se quedaron,
  5 se reenfocaron al público AEC, 1 se archivó (`testear-web-con-claude-for-chrome`),
  y se creó `cuanto-cuesta-un-add-in-revit-civil-3d` (keyword de dinero).
  Herramientas pasó de 6 rubros genéricos a 5 rubros BIM.
- **Fase 4 — Contenido para dominar el nicho (SIGUIENTE):** escribir los 2 pillars
  que faltan (C1 y C2) y los satélites de C2. Prioridad:
  1. "Automatizar Civil 3D: guía completa" (pillar C2)
  2. "Desarrollo de add-ins para Revit y Civil 3D: guía completa" (pillar C1)
  3. ~~"Automatizar metrados y cubicaciones en Civil 3D"~~ (HECHO, sep-2026)
  4. ~~"Revit API en español: primeros pasos"~~ (HECHO, sep-2026)
  5. "10 scripts de Dynamo para Civil 3D" — siguiente
- **Conversión (HECHA, oct-2026):** medición GA4 + clics de WhatsApp, y las 4
  páginas de servicio convertidas en landings de venta (ver sección 6).
  Pendiente: **política de privacidad** (los términos de GA4 la exigen; el
  sitio aún no tiene) y dominio propio.
- **Fase 5 (EN CURSO):** liberar las herramientas de `/herramientas`. Hechas
  (oct-2026): conversor de coordenadas, calculadora de acero corrugado y
  calculadora de Manning. El resto sigue "Pronto".
- **Contacto — WhatsApp es el único canal publicado.** Número en
  `site.whatsapp` (`lib/site.ts`); enlaces siempre vía `whatsappUrl(mensaje)`,
  nunca hardcodeados. **El correo está oculto a propósito** (`site.showEmail:
  false`): no se renderiza en ninguna parte ni se publica en el JSON-LD, que
  declara `telephone` + `contactPoint`. El formulario de contacto compone el
  mensaje y abre WhatsApp; el campo de correo es opcional. Si algún día vuelve
  el correo, es un solo flag. Migrar a un endpoint real (Resend / Route Handler)
  sigue pendiente.
- ⚠️ **Bloqueante antes de publicar:** fijar `NEXT_PUBLIC_SITE_URL` al dominio real.
  Mientras no se haga, los canonical y las OG salen apuntando a `localhost:3000`.

## 10. Comandos

```bash
npm run dev     # desarrollo (Turbopack)
npm run build   # build de producción (valida TS + genera estáticas)
npm run start   # servir el build
npm run lint    # ESLint
npm run test:tools  # tests de las calculadoras (Node ≥ 23.6)
```

## 11. Convenciones

- Rutas SIEMPRE con prefijo de locale. Usa `localizedPath(lang, "ruta")` de `lib/site.ts`.
- Nuevas páginas: `export async function generateMetadata` con `buildMetadata`.
  Un solo `<h1>`. Añade la ruta a `app/sitemap.ts` (`STATIC_PATHS`).
- Strings de UI → diccionarios (`es.json`, `pt.json`, `en.json`, **misma
  forma**), nunca hardcodeados en JSX (excepción tolerada: páginas con copy
  propio como contacto/herramientas que usan mapas `Record<Locale, ...>`
  locales — con las tres claves).
- Componentes cliente solo cuando hay interacción (`"use client"`); todo lo demás
  es Server Component (mejor SEO y bundle).
- `params` es `Promise` → `const { lang } = await params`.
