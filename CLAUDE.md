@AGENTS.md

# Zeist — Contexto del proyecto (para Claude Code)

> Este archivo es la memoria persistente del proyecto. Léelo completo antes de
> trabajar. Si tomas decisiones nuevas de arquitectura, marca o contenido,
> **actualízalo aquí** para no depender del historial del chat.

---

## 1. Qué es Zeist

Zeist es una **marca** de ingeniería de software (no un nombre descriptivo).
Igual que Nike o Adidas, el nombre no explica el producto: construye marca.
La web es el activo central para atraer clientes calificados vía **SEO orgánico**.

**Objetivo de negocio:** ser la web de referencia a la que acuden emprendedores,
empresas, desarrolladores, ingenieros y diseñadores para resolver sus problemas.
Modelo de confianza y engagement a largo plazo (referencia mental del usuario:
el camino de Yape — invertir en fidelizar y ganar confianza antes que en cobrar caro).

**Servicios que vende:**
1. Creación de páginas web.
2. Creación de apps móviles.
3. Sistemas web para empresas (ERPs, paneles, plataformas; nube + servidores).
4. Automatización para ingeniería civil: add-ins Civil 3D / Revit, scripts Dynamo.

**Ofertas de divulgación (fidelización):** blog gratuito, cursos/webinars/bootcamps
(inicialmente gratis), mentorías de "Vibe Coding" (de la idea al despliegue).

## 2. Posicionamiento y voz de marca

- **Diferenciador central:** el mercado cobra caro y esconde el conocimiento;
  Zeist hace lo contrario. Precios accesibles gracias a desarrollo **con IA** +
  metodología ágil, y **divulgación abierta** de conocimiento.
- **Mensaje clave:** desarrollar con IA baja el costo real del producto y lo hace
  accesible desde emprendedores pequeños hasta empresas grandes (también hacemos
  proyectos grandes: nube, servidores, arquitectura).
- **Tono:** corto y preciso, **nada de rodeos**. Directo, profesional, elegante,
  internacional. Sin tecnicismos vacíos ni promesas infladas. "No ser una gota
  más de agua en el mar."
- **Regla de escritura:** claridad > cantidad. Frases cortas. Beneficio concreto.

## 3. Público objetivo e idiomas

- **Idiomas (ambos first-class para SEO):** Español (`es`, por defecto) y
  Portugués (`pt`). Los dos deben indexar y rankear al 100%, con jerarquía
  correcta de H1/H2/H3 en cada idioma.
- **Mercado:** global hispanohablante + lusófono (LATAM + Europa). Tono
  internacional; sin geotargeting a un solo país.

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
  [lang]/                     # segmento de locale (es | pt)
    layout.tsx                # ROOT layout: html/body, fonts, header, footer, metadata base, JSON-LD Org
    page.tsx                  # Landing (hero, diferenciadores, servicios, proceso, blog, tools, CTA)
    servicios/page.tsx        # Índice de servicios
    servicios/[slug]/page.tsx # Detalle de servicio (generateStaticParams por los 4 slugs)
    blog/page.tsx             # Índice del blog
    blog/[slug]/page.tsx      # Artículo (renderiza MDX, JSON-LD BlogPosting)
    herramientas/page.tsx     # "Coming soon" con roadmap de herramientas
    contacto/page.tsx         # Formulario (mailto, sin backend aún)
  globals.css                 # SISTEMA DE DISEÑO completo (tokens + claymorfismo)
  sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx   # SEO (raíz)
components/                   # site-header, site-footer, logo, locale-switcher,
                              # theme-toggle, contact-form, mdx-content, icons
lib/
  i18n.ts                     # locales, Locale, getDictionary, Dictionary (tipo)
  site.ts                     # marca, siteUrl, absoluteUrl, localizedPath
  seo.ts                      # buildMetadata() (hreflang, canonical, OG) + JSON-LD helpers
  blog.ts                     # lectura de MDX + frontmatter
dictionaries/es.json, pt.json # strings de UI por idioma (misma forma)
content/blog/<locale>/<slug>.mdx  # artículos del blog
proxy.ts                      # redirección de locale por Accept-Language
```

## 6. SEO — cómo está montado (mantener siempre)

- **`lib/seo.ts` → `buildMetadata()`** es el único lugar para generar `<head>`.
  Cada página con contenido llama a `generateMetadata` y usa `buildMetadata`.
  Genera: `canonical`, `alternates.languages` (hreflang recíproco es/pt + `x-default`),
  Open Graph y Twitter cards, y `robots` (`max-image-preview:large`).
- **`metadataBase`** se fija en `app/[lang]/layout.tsx` desde `siteUrl`.
- **hreflang:** códigos genéricos `es` y `pt` (cubren LATAM + Iberia). `x-default` → `es`.
- **JSON-LD:** Organization + WebSite (layout/landing), Service (detalle de servicio),
  BlogPosting (artículos).
- **Sitemap** (`app/sitemap.ts`): todas las rutas × ambos locales, con `alternates.languages`.
- **Jerarquía de encabezados:** UN solo `<h1>` por página (título principal),
  `<h2>` para secciones, `<h3>` para tarjetas/subsecciones. **No romper esto.**
- **Pendiente antes de producción:** fijar `NEXT_PUBLIC_SITE_URL` al dominio real
  (silencia el warning de `metadataBase` y corrige URLs absolutas/OG).

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
- **Temas:** claro (default) y oscuro (teal-black + glow mint). Toggle en
  `theme-toggle.tsx` (`localStorage` `zeist-theme`, atributo `data-theme` en `<html>`).
  Respeta `prefers-color-scheme` y `prefers-reduced-motion`.
- **Marca:** el nombre se escribe **"Zeist"** (no "ZEIST").

## 8. Blog

- Archivos: `content/blog/<locale>/<slug>.mdx` con frontmatter:
  `title, description, date (ISO), author, tags[], draft?, cover?`.
- `lib/blog.ts`: `getAllPosts(locale)`, `getPost(locale, slug)`, `getPostSlugs`,
  `getAllTags`. Calcula tiempo de lectura. Ordena por fecha desc. Ignora `draft`.
- Para publicar: crear el `.mdx` en `es/` y `pt/` (mismo slug para que hreflang
  enlace ambas versiones). `generateStaticParams` los recoge automáticamente.
- Ideas de contenido (del brief): desarrollo con IA, Vibe Coding, despliegue,
  automatización Civil 3D/Revit/Dynamo para ingenieros civiles, UX/UI para devs,
  prompts para Google Stitch.

## 9. Roadmap (por fases)

- **Fase 1 (MVP, HECHA):** Landing + Servicios (+detalle) + Blog (MDX) +
  Herramientas (coming soon) + Contacto. i18n es/pt. SEO completo. Claymorfismo.
- **Fase 2 — Hub de Herramientas por RUBROS** (diferenciador clave). La página
  `/herramientas` NO vende productos: organiza todo por **rubros/categorías**, cada
  uno con un gancho de beneficio ("Automatiza tus tareas de ingeniería civil") y,
  dentro, **propuestas** de herramientas + **rutas end-to-end** como botones "Pronto".
  - Datos y copy (ES/PT) en **`lib/tools-catalog.ts`** (`getRubros`, `toolsHubCopy`).
    Iterar ahí: añadir/quitar rubros, herramientas y rutas. Íconos en `rubroIcons`.
  - Rubros actuales: Diseño UX/UI · Arquitectura de datos · Arquitectura de software ·
    Automatización en ingeniería (C3D/Revit/Dynamo) · Cursos gratuitos · Mentorías y
    comunidad. Próximo paso: definir cada herramienta/ruta al 100% e ir liberándolas
    (generadores clay/glass/neumorfismo, prompts para Google Stitch, etc.).
  - **Enfoque general que quiere el usuario:** comunicar por rubros/beneficios, no
    "vendemos webs/apps/sistemas". Extender este marco a otras secciones si se pide.
- **Fase 3:** cursos / webinars / bootcamps (gratis al inicio), mentorías Vibe Coding.
- **Fase 4:** área de contenido para ingenieros civiles (automatización BIM/CAD).
- **Backend de contacto:** hoy el formulario usa `mailto:`. Migrar a un endpoint
  real (Resend / Route Handler) cuando se defina.

## 10. Comandos

```bash
npm run dev     # desarrollo (Turbopack)
npm run build   # build de producción (valida TS + genera estáticas)
npm run start   # servir el build
npm run lint    # ESLint
```

## 11. Convenciones

- Rutas SIEMPRE con prefijo de locale. Usa `localizedPath(lang, "ruta")` de `lib/site.ts`.
- Nuevas páginas: `export async function generateMetadata` con `buildMetadata`.
  Un solo `<h1>`. Añade la ruta a `app/sitemap.ts` (`STATIC_PATHS`).
- Strings de UI → diccionarios (`es.json` y `pt.json`, **misma forma**), nunca
  hardcodeados en JSX (excepción tolerada: páginas con copy propio como contacto/herramientas
  que usan mapas `Record<Locale, ...>` locales).
- Componentes cliente solo cuando hay interacción (`"use client"`); todo lo demás
  es Server Component (mejor SEO y bundle).
- `params` es `Promise` → `const { lang } = await params`.
