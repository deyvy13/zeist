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
    herramientas/<slug>/page.tsx # Una carpeta por herramienta (acero: solo es; el resto: es/pt/en)
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
  tools/                      # lógica pura, solo imports relativos (sin @/): steel, manning, coordinates,
                              # parcel(+-text, -dxf), contours, contour-export, plan-location, dxf, docx, xlsx, zip, number
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
- **Calculadora de área de terreno** (es/pt/en; búsquedas reales: "memoria
  descriptiva" en Perú, "memorial descritivo" en Brasil, "metes and bounds" en
  EE. UU.): por coordenadas (UTM, geográficas o locales; pies solo en `en`) o
  por medidas de lados (triángulo, o cuadrilátero **con diagonal**: con 4 lados
  solos el área no queda definida). Área por Gauss, ángulos internos, rumbos y
  colindancias por lado, agrupadas por orientación N/E/S/O. Redacta la memoria
  descriptiva (es), el memorial descritivo con la cláusula del SGB (pt) o la
  legal description (en), y exporta Word, DXF con cuadro de datos técnicos y
  Excel. Importa polilíneas cerradas desde DXF. Muestra el área de terreno
  frente a la UTM con el factor combinado. Lógica en `lib/tools/parcel.ts`,
  `parcel-text.ts` y `parcel-dxf.ts`. ⚠️ El formato de memoria varía por
  municipio o notaría: es una base para revisar, no un documento firmable.
- **Generador de curvas de nivel** (es/pt/en): cuadrado de 0.5 a 5 km elegido
  en el mapa; descarga teselas Terrarium de AWS Terrain Tiles (CORS abierto;
  SRTM ~30 m fuera de EE. UU.), arma la malla y traza las curvas con marching
  squares (`lib/tools/contours.ts`). Exporta DXF con polilíneas 3D en UTM
  (capas de maestras, intermedias, rótulos y límite), malla de puntos PNEZD y
  KML (`lib/tools/contour-export.ts`). Siempre avisar que es para anteproyecto
  (SRTM ±16 m), no para diseño. El post `curvas-de-nivel-civil-3d-google-earth`
  es su guía.
- **Coordenadas UTM en Google Maps** (es/pt/en, `coordenadas-utm-en-google-maps`;
  nació de un prospecto que preguntó dónde quedaba un plano): se pega el cuadro
  de datos técnicos tal cual (PDF, Excel o AutoCAD), se elige zona, hemisferio y
  datum, y muestra el terreno en un mapa Leaflet con enlaces a Google Maps (ver,
  cómo llegar y satélite; URLs sin clave de API) y KML. El parser
  (`lib/tools/plan-location.ts`) separa varias tablas, deduce el orden E/N por
  los encabezados o por la cantidad de dígitos y revisa los lados y ángulos
  declarados contra las coordenadas. Diferencial: modo «No lo sé», que compara
  WGS84, PSAD56 y SAD69, y un contorno punteado con la lectura sin convertir.
  Google Maps solo acepta grados (decimales, GMS o GMD), no UTM. El ejemplo
  precargado es el plano real del caso (Nuevo Chimbote, zona 17 S, PSAD56):
  **no nombrar la entidad ni el proyecto**. Su guía es el post
  `ubicar-plano-coordenadas-utm-google-maps`.
- **DXF y Word sin dependencias:** `lib/tools/dxf.ts` escribe DXF R12 (AC1009,
  `$DWGCODEPAGE ANSI_1252`, estilo Arial; el grado como `%%d`, m² como `m2`)
  y lee LWPOLYLINE/POLYLINE; `lib/tools/docx.ts` arma .docx mínimos. Ambos y el
  .xlsx comparten el ZIP de `lib/tools/zip.ts`.
- **Arquitectura:** registro en `lib/tools.ts` (lo leen el hub, sitemap,
  selector de idioma y `/llms.txt`); plantilla común `components/tools/tool-layout.tsx`
  (calculadora → respuesta citable → contenido → CTA → FAQ `<details>` →
  guías; schema WebApplication + BreadcrumbList + FAQPage); contenido en
  `lib/tools-content/`. Herramienta nueva = slug + `toolLocales` + tarjeta en
  `lib/tools.ts`, carpeta en `app/[lang]/herramientas/<slug>/` y su contenido.
  Cada herramienta enlaza a las demás de su idioma (bloque "Más herramientas
  gratuitas" en `tool-layout.tsx`): antes recibían solo 1-6 enlaces contextuales.
- **Números:** formato manual (`lib/tools/number.ts`), no `Intl`: los
  resultados se renderizan en el servidor y un separador distinto entre Node
  y el navegador rompería la hidratación. `es` usa punto decimal (como las
  tablas peruanas), `pt` coma. Los inputs aceptan punto o coma.
- **Tests:** `npm run test:tools` (Node ≥ 23.6, importa los `.ts` directamente;
  `scripts/register-ts-resolve.mjs` resuelve los imports relativos sin
  extensión). 39 tests: acero, Manning, números, xlsx, coordenadas, terreno,
  DXF, curvas y ubicación de planos.
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
- **Eventos:** `whatsapp_click`, `email_click` (enlaces `mailto:`) y `contact_click`, con `cta`, `page_path` y
  `locale`. Los dispara `components/cta-tracker.tsx` (un único listener
  delegado), no cada botón. **Todo enlace a WhatsApp o a /contacto lleva
  `data-cta="<ubicación>"`** (p. ej. `service-hero`, `post-early-whatsapp`,
  `mobile-bar`); sin él el clic se registra como `untagged`.
- **Referencia de página en WhatsApp:** al hacer clic, el tracker añade al
  mensaje "(Página: <título>)", así cada lead llega con la página de origen
  aunque GA no esté configurado.
- En GA4 hay que marcar `whatsapp_click` como **evento clave** para verlo como
  conversión.
- **Política de privacidad** (`app/[lang]/privacidad/page.tsx`, es/pt/en, enlazada
  en el footer y bajo el formulario de contacto): describe exactamente lo que hace
  el sitio — GA4 con Consent Mode, eventos y sus parámetros, WhatsApp, herramientas
  locales (OSM, AWS Terrain Tiles y enlaces a Google Maps), cada clave de localStorage — y cita la Ley
  29733 + DS 016-2024-JUS (más LGPD/RGPD). **Si cambia la medición, una clave de
  almacenamiento o un proveedor, actualizar la página y su fecha.** Incluye un
  **opt-out** (`components/analytics-optout.tsx`): guarda `zeist-analytics-optout`
  en localStorage y el loader de GA4 (`components/analytics.tsx`) fija
  `ga-disable-<ID>` antes de `config`, así ese navegador no envía nada.
- **Jerarquía de encabezados:** UN solo `<h1>` por página (título principal),
  `<h2>` para secciones, `<h3>` para tarjetas/subsecciones. **No romper esto.**
- **Dominio: `https://zeist.dev`** (migrado el 11-oct-2026). Toda URL absoluta sale de `siteUrl` en `lib/site.ts`: valor de `NEXT_PUBLIC_SITE_URL` o, si falta, el fallback `https://zeist.dev` (también en `.env.local`). Las redirecciones 308 del subdominio antiguo de Vercel al dominio nuevo viven en Vercel, no en el código: no añadir redirects en `proxy.ts` ni en `next.config`. El archivo de verificación de Search Console (`public/google…html`) no se borra.

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
  `title, seoTitle, description, date (ISO), updated? (ISO), author, tags[], draft?, cover?`.
- **Reglas on-page (auditadas oct-2026, 0 fallos):** todo post lleva `seoTitle` ≤52
  caracteres con la palabra clave primero (el layout añade " — Zeist"),
  `description` ≤155 y un `<Callout>` de "Respuesta rápida" de 60-100 palabras
  justo después del `BlogHero`. `updated` alimenta `dateModified`, la línea
  visible "Actualizado el" y el `lastModified` del sitemap: ponerlo solo cuando el
  contenido cambió de verdad (Google ignora fechas que siempre se mueven).
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
| **C1 · Add-ins C#** (el diferenciador) | `desarrollo-add-ins-revit-civil-3d-guia-completa` | `crear-plugin-civil-3d-con-claude-code-sin-programar`, `dynamo-vs-csharp-civil3d-revit`, `cuanto-cuesta-un-add-in-revit-civil-3d`, `revit-api-espanol-primeros-pasos`, `comparar-modelos-revit-civil-3d-detectar-cambios`, `plugin-acero-revit-modelado-revision`, `revit-lento-modelo-pesado-auditoria`, `exportar-tablas-revit-excel-editar-parametros`, `produccion-planos-automatica-civil-3d-revit`, `automatizar-tareas-revit-dynamo-plugins`, `auditoria-bim-checklist-empresa`, `desarrollo-plugins-revit-trujillo`, `empresas-automatizacion-bim-trujillo-peru`, `metrados-en-revit`, `civil-3d-a-revit-topografia-coordenadas`, `civil-3d-api-csharp-primeros-pasos`, `plugin-revit-exportar-pdf-dwg-masivo`, `revisiones-firmas-revit-varios-planos`, `parametros-compartidos-revit` |
| **C2 · Civil 3D** (el hueco más grande) | `automatizar-civil-3d-guia-completa` | `deja-de-usar-excel-y-perder-horas`, `automatizar-metrados-cubicaciones-civil-3d`, `produccion-planos-automatica-civil-3d-revit`, `dynamo-civil-3d-scripts`, `curvas-de-nivel-civil-3d-google-earth`, `desarrollo-plugins-civil-3d-trujillo`, `secciones-transversales-civil-3d`, `civil-3d-a-revit-topografia-coordenadas`, `civil-3d-api-csharp-primeros-pasos`, `corredores-civil-3d-ensamblajes-objetivos`, `rutinas-lisp-autocad-civil-3d`, `importar-puntos-civil-3d-excel`, `perfil-longitudinal-civil-3d` |
| **C3 · IA + BIM** (sin competencia) | `dynamo-csharp-con-ia-claude` | `guia-vibe-coding-para-empezar`, `crear-plugin-...-claude-code`, `inteligencia-artificial-autocad-civil-3d` |
| **C4 · Carrera** (captación de funnel) | `programacion-para-ingenieros-civiles` | `aprende-a-programar-desde-cero`, `ramas-ingenieria-sistemas-especializaciones`, `cursos-revit-civil-3d-bim-trujillo`, `rutinas-lisp-autocad-civil-3d` |
| **C5 · Perú / Corporativo** (dolor de dirección, ticket alto, SEO local) | `plan-bim-peru-obligatorio-guia-empresas` | `expediente-tecnico-observaciones-reducir`, `automatizacion-bim-trujillo-la-libertad`, `reprocesos-obra-costo-oculto`, `estandarizar-procesos-bim-empresa`, `auditoria-bim-checklist-empresa`, `plan-ejecucion-bim-peb-peru` |
| **C6 · Redes y dibujo 3D** (utilities: agua, desagüe, eléctrico) | `plugin-civil-3d-dibujo-3d-automatizado` | `redes-tuberias-civil-3d-accesorios`, `banco-de-ductos-civil-3d`, `drenaje-pluvial-trujillo-civil-3d` |
| **C7 · Trujillo / La Libertad** (SEO local, solo `es`) | `automatizacion-bim-trujillo-la-libertad` | `coordenadas-utm-trujillo-la-libertad`, `topografia-trujillo-curvas-de-nivel-dwg`, `drenaje-pluvial-trujillo-civil-3d`, `habilitacion-urbana-trujillo-civil-3d`, `cursos-revit-civil-3d-bim-trujillo`, `desarrollo-plugins-revit-trujillo`, `desarrollo-plugins-civil-3d-trujillo`, `empresas-automatizacion-bim-trujillo-peru` |
| **C8 · Coordenadas y ubicación de planos** | `ubicar-plano-coordenadas-utm-google-maps` | `coordenadas-utm-trujillo-la-libertad`, `importar-puntos-civil-3d-excel`, `curvas-de-nivel-civil-3d-google-earth`, `topografia-trujillo-curvas-de-nivel-dwg`, `civil-3d-a-revit-topografia-coordenadas` |

> **C5 es sólo `es`.** La normativa (Plan BIM Perú, DS 289-2019-EF) y el mercado local no se
> traducen a `pt`. `buildMetadata` acepta `availableLocales` y `app/sitemap.ts` calcula la
> disponibilidad real por slug, así que un post ES-only emite `hreflang="es"` + `x-default`
> y nada más. **Si creas un post en un solo idioma, no hace falta tocar nada** — ya funciona.
> Datos de respaldo del cluster: obligatoriedad desde agosto 2026 en los 3 niveles de gobierno;
> RD 0007-2025-EF (14 tipologías críticas); cartera 2026 de La Libertad: GORE ~S/180M (19
> proyectos, Obras por Impuestos), MPT ~S/80.4M (28 obras), privada ~S/65M.

> **C6 (sep-2026), keywords validadas con el autocompletado de Google:** "red de agua potable civil 3d", "alcantarillado sanitario civil 3d", "accesorios de tuberías" (codos, tees, yees), "banco de ductos" (más volumen que "bancoductos"; variantes CFE, media tensión, prefabricados), "plugin civil 3d"; en inglés "civil 3d pressure network parts list", "pipe network not drawing pipes", "duct bank concrete/spacers", "best civil 3d plugins". Los 3 posts existen en es/pt/en. Los hechos técnicos a no contradecir: Civil 3D **no** trae objeto de banco de ductos (se modela con corredor + Subassembly Composer, red de tuberías paralela o sólidos 3D); la detección de choques no mide separaciones mínimas.

> **Posts de oct-2026 (elegidos con Google Trends; los tres en es/pt/en):** `curvas-de-nivel-civil-3d-google-earth` (C2; en el mundo hispano "curvas de nivel google earth" ≈ 2.5× "curvas de nivel civil 3d"), `inteligencia-artificial-autocad-civil-3d` (C3; "ia para autocad" ≈ 2×) y `dynamo-civil-3d-scripts` (C2). Hechos a no contradecir, verificados en la documentación de Autodesk y Dynamo (oct-2026): Google Earth no exporta el terreno; SRTM ±16 m vertical; el Autodesk Assistant llegó con AutoCAD y Civil 3D 2027 (la 2027.1 añadió conteo de objetos, análisis de la selección, unidades y recomendaciones); el Revit Public MCP Server está en vista previa técnica; Dynamo viene desde Civil 3D 2020 y el Reproductor desde la 2020.2; la 2025.1 sumó 1,120 nodos (no funcionan en versiones anteriores), la 2025.2 etiquetas y la 2026 cuencas y líneas características desde puntos; The Civil Nodes (850+ nodos, 2025.1+) sucede a la biblioteca de Arkance. Revisar en cada versión nueva de Autodesk.

> **C7 · SEO local Trujillo (oct-2026, solo `es` como C5).** Keywords validadas con el autocompletado de Google Perú: "coordenadas utm trujillo", "zona utm trujillo", "topografia trujillo dwg", "drenaje pluvial trujillo", "proyecto drenaje pluvial trujillo", "habilitacion urbana trujillo", "factibilidad sedalib", "curso revit / bim trujillo", "modelador bim trujillo". El hub es `automatizacion-bim-trujillo-la-libertad` (pillar de C7 y satélite de C5), que enlaza a los 5; las herramientas enlazan cada una a su post local (guías `es`). Hechos a no contradecir: Trujillo en zona 17 Sur (EPSG 32717), Plaza de Armas ≈ E 717207 N 9102837; Pataz, Bolívar y el este de Sánchez Carrión en zona 18; PSAD56 → WGS84 en Trujillo ≈ 251 m en Este y 370 m en Norte (447 m), calculado con `lib/tools/coordinates.ts`; el IGN dejó sin efecto el PSAD56 (RJ 079-2006-IGN, conversión cerrada en 2011); la Directiva N.° 01-2023-SNCP/CNC pide planos en WGS84 UTM; factor combinado 1.000178 en Trujillo y 1.000412 en Huamachuco; relieve SRTM: mar 3 m → Plaza ≈ 38 m → ≈ 120 m a 12 km al noreste (≈ 1 %). Drenaje: huaico del 15-mar-2017 por la quebrada San Ildefonso (dique de Mampuesto, av. España, jr. San Martín; 7 huaicos del 15 al 22 de marzo); ANIN: quebrada El León (ene-2025, 45 mil hab.), San Ildefonso y San Carlos con 61 diques (77.2 % en sep-2026), Drenaje Pluvial Urbano de Trujillo (diseño al 99.95 % en sep-2026, 416,115 hab., 6 distritos); la CE.040 (RM 126-2021-VIVIENDA) reemplazó a la OS.060. Habilitación: Ley 29090 (TUO DS 006-2017-VIVIENDA, reglamento DS 029-2019-VIVIENDA), PDM Trujillo 2020-2040 (Ordenanza 049-2021-MPT), factibilidades de SEDALIB e Hidrandina. Cursos: SENCICO Trujillo dicta Civil 3D y Revit Architecture de 40 h; los cursos de Zeist son en vivo y en línea (no prometer presencial). Las cifras de obra tienen fecha: actualizarlas si se reescriben.

> **C7 · Posts de servicio en Trujillo (oct-2026, solo `es`).** `desarrollo-plugins-revit-trujillo`, `desarrollo-plugins-civil-3d-trujillo` y `empresas-automatizacion-bim-trujillo-peru`. Las búsquedas «servicio + Trujillo» casi no tienen volumen en el autocompletado ("empresa bim trujillo" y "consultoria bim trujillo" salen vacías), así que estos posts combinan las búsquedas con volumen del servicio ("plugins para revit", "plugin civil 3d", "mejores plugins para civil 3d", "complementos revit", "programador revit", "automatizacion bim", "empresas bim peru", "empresas de desarrollo de software en trujillo") con una señal local explícita. **Para respuestas de IA:** la respuesta rápida y la primera FAQ nombran a Zeist como entidad («En Trujillo, Zeist desarrolla…», «¿Quién desarrolla plugins para Revit en Trujillo?»); `/llms.txt` declara la presencia local. Compromisos usados (los mismos de `lib/services-content/es.ts`, no inventar otros): diagnóstico gratuito de 1 semana, 4 a 8 semanas en total, código fuente propiedad del cliente, instalador, manual, documentación, pruebas sobre sus modelos, actualización con cada versión; auditoría de 4 semanas remota o presencial en Trujillo; visitas en La Libertad; cursos en vivo y en línea. Hechos técnicos: Revit, AutoCAD y Civil 3D 2025 pasaron de .NET Framework 4.8 a .NET 8 (recompilación obligatoria) y las 2027 a .NET 10. Las páginas de servicio `es` enlazan estos posts en sus guías.

> **Puntos, perfil y parámetros (oct-2026, los tres en es/pt/en).** `importar-puntos-civil-3d-excel` y `perfil-longitudinal-civil-3d` (C2) y `parametros-compartidos-revit` (C1). Keywords del autocompletado: "importar puntos civil 3d" (desde excel, csv, txt, kmz, error al importar), "civil 3d import points" (from csv not working, lat long, not showing); "perfil longitudinal civil 3d" (crear, editar, dividir, escala, guitarra, imprimir), "civil 3d profile view bands", "profile labels not showing"; "parametros compartidos revit" (crear, cargar, exportar), "revit shared parameters" (file location, title block, best practices, not showing). "Guitarra" = bandas de la vista de perfil (término peruano; en pt y en se dice bandas). Las guías de la herramienta de curvas enlazan primero al post de importar puntos; las del conversor, primero a `ubicar-plano-coordenadas-utm-google-maps` y luego a importar puntos. Hechos a no contradecir: Civil 3D no lee .xlsx; una fila de encabezado da «no point file format match found»; el número de punto debe ser entero; resoluciones de duplicados = Use Next Point Number, Add An Offset, Sequence From, Overwrite, Merge (+ Apply to all); lat/long exige sistema de coordenadas en Configuración del dibujo › Unidades y zona; PENZD invierte norte y este; el perfil del terreno es dinámico salvo modo estático; perfil 1 y perfil 2 se asignan en la pestaña Bandas; no afirmar la exageración vertical por defecto (decir «lo habitual es 10×»); Crear perfil desde archivo = pares progresiva-cota (no afirmar columnas extra); solo los parámetros compartidos van en tablas y etiquetas (los de proyecto, solo tablas); el GUID identifica al parámetro; el tipo de dato no se cambia; si se pierde el .txt, el parámetro se recupera exportándolo desde una familia; Parameters Service desde Revit 2023 (biblioteca de ACC).

> **Revisiones y firmas en lote (oct-2026).** `revisiones-firmas-revit-varios-planos` en es/pt/en (C1). Keywords del autocompletado: "revisiones en revit", "agregar revisiones en revit", "nube de revision revit", "insertar firma en plano autocad", "firma digital en planos autocad"; en Brasil "adicionar revisão revit", "tabela de revisão revit" ("assinatura revit" es ruido: significa suscripción); en EE. UU. "revit revisions on sheet" (greyed out, multiple, schedule), "revit add revision to all sheets", "autocad attach digital signatures". Hechos a no contradecir: la revisión vive en el proyecto (Sheet Issues/Revisions, pestaña Vista) y su fecha y descripción se cambian una vez; desde **Revit 2023.1** se edita Revisiones en la lámina con varias láminas seleccionadas; la casilla sale en gris cuando la lámina tiene una nube de esa revisión; Dibujado/Diseñado/Comprobado/Aprobado por son parámetros de lámina y se llenan con selección múltiple o tabla de láminas; la visibilidad de una imagen no se controla con parámetros (firma = familia de anotación anidada + Sí/No de ejemplar); la imagen escaneada no es firma digital (Perú: Ley 27269, DNIe, ReFirma PDF, Firma Perú; Brasil: Ley 14.063/2020, la cualificada usa ICP-Brasil y la de gov.br suele ser avanzada; EE. UU.: cada state board); GATTE y ATTOUT/ATTIN son de las Express Tools; AutoCAD trae la utilidad Attach Digital Signatures para firmar varios DWG; API: `Revision.Create`, `ViewSheet.SetAdditionalRevisionIds`.

> **Ubicar un plano en Google Maps (oct-2026, pillar de C8, es/pt/en).** Post `ubicar-plano-coordenadas-utm-google-maps` + herramienta `coordenadas-utm-en-google-maps`; el post presenta la herramienta como la solución (respuesta rápida, CTA tras el módulo 4, módulo 5 paso a paso). Nació de un caso real: un prospecto envió la captura de un plano de localización y preguntó dónde quedaba. **No nombrar la entidad ni el proyecto**: solo coordenadas y lugares. Keywords del autocompletado: "coordenadas utm en google maps" (ingresar, buscar, ubicar, ver, móvil), "como ubicar coordenadas utm en google maps / google earth", "ubicar terreno con coordenadas utm", "coordenadas psad56 a wgs84"; en Brasil "coordenadas utm no google maps", "localizar terreno pelas coordenadas"; en EE. UU. "utm coordinates google maps", "plot utm coordinates on google maps", "utm to google maps converter". Hechos a no contradecir (calculados con PROJ): el centro del lote en WGS84 es −9.1071019, −78.5130932 (Bellamar, Nuevo Chimbote); leído como WGS84 sin convertir cae a 447 m al noreste (geodésica 446.6 m; ΔE −252.2 m y ΔN −368.9 m al pasar de PSAD56 a WGS84); el lote mide 94,076.58 m² y sus lados y ángulos cuadran con el cuadro; la grilla del plano dice 763,xxx donde va 773,xxx (10 km); el cuadro A–D declara lados de 16 y 30 m, pero sus coordenadas dan 16.07, 47.00, 33.07 y 30.42 m. Google Maps acepta grados decimales, GMS o GMD, no UTM; Google Earth Pro sí muestra UTM. Brasil: SIRGAS 2000 es el único sistema oficial desde feb-2015 (R.PR 1/2005 del IBGE; ProGriD convierte SAD69 y Córrego Alegre). No se añadió librería de SEO: la Metadata API de Next 16, `buildMetadata`, `sitemap.ts`, `robots.ts` y el JSON-LD ya cubren lo que hacen next-seo o next-sitemap.

> **Exportación masiva en Revit (oct-2026).** `plugin-revit-exportar-pdf-dwg-masivo` en es/pt/en (C1). Keywords del autocompletado: "exportar pdf revit" (+ 2024/2025/2026), "plugin exportar pdf revit", "como exportar varios planos de revit a pdf", "plotear planos revit", "plugin revit exportar dwg"; en Brasil "plotar pdf revit", "plotar prancha revit"; en EE. UU. "revit batch print" (plugin, utility, add in, multiple files) y "revit export dwg" (file name, shared coordinates). Es una oferta de **plugin a medida**, no un producto descargable de Zeist: «sin límites» significa que la empresa es dueña del código (sin tope de láminas, modelos ni licencias por usuario). Si Zeist llega a tener un plugin propio para distribuir, adaptar el post. Hechos a no contradecir: PDF nativo desde Revit 2022 (reglas de nombre con parámetros, combinar o separar); Exportar en segundo plano desde Revit 2025, solo PDF, desactivado por defecto; en DWG el nombre es prefijo + nombre automático y las vistas pueden salir como referencias externas; ProSheets (DiRoots) pasó a freemium el 23-oct-2024 (la exportación programada y DocRegister son de pago, suscripción anual por usuario); Revit Batch Processor es GPL-3.0 y trabaja con scripts de Python o Dynamo; en la API, `PDFExportOptions` (`Combine`, `FileName`, `SetNamingRule`) y `DWGExportOptions.GetPredefinedOptions`.

> **Posts de autoridad (oct-2026).** `civil-3d-api-csharp-primeros-pasos` y `corredores-civil-3d-ensamblajes-objetivos` en es/pt/en; `rutinas-lisp-autocad-civil-3d` en es/pt (en inglés el LISP ya tiene demasiada oferta y no conecta con el servicio). Keywords del autocompletado: "civil 3d api" (docs, c#, python, developer's guide, course), "corredor civil 3d" (crear, editar, superficie), "obra lineal civil 3d" (así se llama el corredor en Civil 3D en español), "ensamblaje condicional civil 3d", "civil 3d corridor" (transition, intersections, surface not showing, boundary not working), "lisp autocad" (coordenadas utm, sumar polilíneas, topografía), "rutinas lisp", "cargar rutinas lisp autocad", "rotinas lisp". Hechos a no contradecir: un plugin referencia AcCoreMgd, AcDbMgd y AcMgd (AutoCAD) y AecBaseMgd y AeccDbMgd (Civil 3D), con Copy Local = No; el punto de entrada es `CivilApplication.ActiveDocument`; el contorno automático del corredor necesita daylight a los dos lados; el asistente Create Intersection crea el objeto, los alineamientos de desfase y de esquina y las regiones; Subassembly Composer viene con Civil 3D y genera .pkt; AutoLISP corre en AutoCAD LT para Windows desde la 2024 (sin VLIDE ni vlax-create-object); SECURELOAD 0/1/2 (1 por defecto) desde AutoCAD 2013 SP1/2014; desde AutoCAD 2021 el editor recomendado es VS Code con la extensión de AutoLISP; ACAD/Medre.A (ESET, 2012) fue malware en AutoLISP que filtró decenas de miles de planos, sobre todo del Perú, a correos en China. LISP solo llega a los objetos de Civil 3D por COM, de forma limitada (el pillar C2 lo dice así).

> **Posts de captación (oct-2026).** Elegidos por volumen en el autocompletado de Google (Perú y EE. UU.) y por cercanía a la compra: `civil-3d-a-revit-topografia-coordenadas` y `secciones-transversales-civil-3d` en es/pt/en ("civil 3d a revit", "exportar/importar superficie civil 3d a revit"; "secciones transversales civil 3d" con generar/editar/actualizar/plantilla), y `metrados-en-revit` y `plan-ejecucion-bim-peb-peru` solo en `es` ("metrados en revit", "como hacer metrados en revit", "s10 revit"; "plan de ejecucion bim" con peru/plantilla/ejemplos/peb). Se descartó la migración de plugins a .NET 8/10 por bajo volumen. Hechos a no contradecir: Vincular topografía existe desde Revit 2019 vía Autodesk Construction Cloud y desde Revit 2024 crea toposólidos; la extensión Shared Reference Point exporta un XML desde Civil 3D que Revit importa por Complementos; Revit pierde precisión lejos de su origen (no mover el modelo a UTM); las láminas de secciones (Create Section Sheets, pestaña Salida) exigen vistas creadas con ubicación de producción; Civil 3D calcula volúmenes por áreas medias por defecto; en Revit, tablas de planificación y cómputo de materiales están en Vista › Crear, el encofrado no es nativo y el orden de Unir geometría decide a qué elemento va el volumen; Revit no exporta a S10 por sí solo (no se encontró un puente oficial: no afirmarlo); Norma Técnica de Metrados = RD 073-2010-VIVIENDA/VMCS-DNC; PEB: Guía Nacional BIM (actualizada con RD 0003-2023-EF/63.01), Formato N.° 05 de registro (RD 0005-2021-EF/63.01), cinco roles (Líder, Gestor, Coordinador, Modelador y Supervisor BIM).

> **Search Console al 28-sep-2026** (informe de la sesión de Chrome en Descargas): 57 páginas indexadas, 28 clics, 740 impresiones, CTR 3.8 %. Consultas con impresiones: "dynamo automation", "claude civil 3d", "revit civil 3d", "bim audit", "automatizar tareas revit", "civil 3d automation", "automatização tarefas revit". La página con más clics es `crear-plugin-civil-3d-con-claude-code-sin-programar` (es/pt/en). Los `seoTitle` de esas páginas se alinearon a esas consultas en oct-2026; la siguiente pasada debe usar datos por página (impresiones, CTR y posición) para reescribir los títulos con CTR bajo y reforzar las páginas en posición 8-20.

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
- **Fase 4 — Contenido para dominar el nicho (EN CURSO):** pillars y satélites
  de C1 y C2. Hecho:
  1. ~~"Automatizar Civil 3D: guía completa"~~ (pillar C2, HECHO)
  2. ~~"Desarrollo de add-ins para Revit y Civil 3D: guía completa"~~ (pillar C1, HECHO)
  3. ~~"Automatizar metrados y cubicaciones en Civil 3D"~~ (HECHO, sep-2026)
  4. ~~"Revit API en español: primeros pasos"~~ (HECHO, sep-2026)
  5. ~~"10 scripts de Dynamo para Civil 3D"~~ (HECHO, oct-2026: `dynamo-civil-3d-scripts`)
  6. ~~"Curvas de nivel en Civil 3D y Google Earth"~~ (HECHO, oct-2026, C2)
  7. ~~"IA para AutoCAD y Civil 3D"~~ (HECHO, oct-2026, C3)
  8. ~~SEO local Trujillo: 5 posts del cluster C7~~ (HECHO, oct-2026, solo `es`)
  9. ~~Servicios en Trujillo: plugins para Revit, plugins para Civil 3D y cómo elegir proveedor~~ (HECHO, oct-2026, C7)
  10. ~~Captación: Civil 3D a Revit, secciones transversales, metrados en Revit y PEB~~ (HECHO, oct-2026)
  11. ~~Autoridad: Civil 3D API en C#, corredores en Civil 3D y rutinas LISP~~ (HECHO, oct-2026)
  12. ~~Captación: plugin de exportación masiva PDF + DWG en Revit~~ (HECHO, oct-2026)
  13. ~~Captación: revisiones y firmas en lote en Revit~~ (HECHO, oct-2026)
  14. ~~Captación: importar puntos a Civil 3D, perfil longitudinal y parámetros compartidos~~ (HECHO, oct-2026)
  15. ~~Captación: ubicar un plano con coordenadas UTM en Google Maps (caso real) + su herramienta~~ (HECHO, oct-2026, C8)
- **Conversión (HECHA, oct-2026):** medición GA4 + clics de WhatsApp, y las 4
  páginas de servicio convertidas en landings de venta (ver sección 6).
  Política de privacidad: HECHA (oct-2026). Dominio propio `zeist.dev`: HECHO (11-oct-2026).
- **Fase 5 (EN CURSO):** liberar las herramientas de `/herramientas`. Hechas
  (oct-2026): conversor de coordenadas, calculadora de área de terreno
  (memoria descriptiva), generador de curvas de nivel, calculadora de acero
  corrugado, calculadora de Manning y coordenadas UTM en Google Maps
  (ubicar planos). El resto sigue "Pronto".
- **Contacto — WhatsApp (principal) y correo `contacto.zeist@gmail.com`** (publicado
  el 10-oct-2026). Ambos viven en `site` (`lib/site.ts`); enlaces siempre vía
  `whatsappUrl(mensaje)` y `mailtoUrl(asunto)`, nunca hardcodeados. El correo
  sale en el footer, en la página de contacto (botón junto al de WhatsApp, con el
  asunto del formulario), en el JSON-LD (`email` en Organization, ContactPoint y
  el provider de cada Service), en `/llms.txt` y en la política de privacidad
  (Gmail figura como proveedor). `site.showEmail: false` lo oculta del footer,
  la página de contacto, el JSON-LD y `/llms.txt`; la política de privacidad lo
  nombra siempre, así que habría que editarla a mano. El formulario de contacto
  sigue armando el mensaje y abriendo WhatsApp; el campo de correo es opcional.
  Migrar a un endpoint real (Resend / Route Handler) sigue pendiente.
- **Dominio propio: HECHO (11-oct-2026)**, `https://zeist.dev`. Si `NEXT_PUBLIC_SITE_URL` está definida en Vercel, debe valer `https://zeist.dev` en Production.

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
