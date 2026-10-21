import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { localizedPath, localizedUrl, mailtoUrl, site, whatsappUrl } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { toolsFor } from "@/lib/tools";
import { JsonLd } from "@/components/json-ld";
import { IconArrow } from "@/components/icons";

// About page: who writes the guides and builds the plugins. It is the author
// page the posts link to (rel="author") and the BlogPosting JSON-LD cites.
// Only facts the rest of the site already states: no team size, no client names.

type Copy = {
  seoTitle: string;
  metaDescription: string;
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  whoTitle: string;
  who: string[];
  whatTitle: string;
  howTitle: string;
  how: string[];
  publishTitle: string;
  /** {posts} {tools} */
  publish: string;
  readBlog: string;
  openTools: string;
  contactTitle: string;
  contact: string;
  linkedin: string;
};

const copy: Record<Locale, Copy> = {
  es: {
    seoTitle: "Quiénes somos: ingenieros civiles y de sistemas",
    metaDescription:
      "Zeist es un equipo de ingenieros civiles y de sistemas que desarrolla plugins y automatización BIM para Civil 3D y Revit, para toda Latinoamérica.",
    breadcrumb: "Sobre Zeist",
    eyebrow: "Sobre Zeist",
    h1: "Somos ingenieros civiles e ingenieros de sistemas que automatizan Civil 3D y Revit",
    intro:
      "Zeist desarrolla plugins en C# para Civil 3D y Revit, scripts de Dynamo y cursos para equipos BIM. Escribimos las guías de este sitio y construimos sus herramientas gratuitas.",
    whoTitle: "Quiénes somos",
    who: [
      "Un equipo mixto: ingenieros civiles que conocen el flujo de un expediente, y ingenieros de sistemas que saben convertir ese flujo en software. Por eso hablamos de progresivas, secciones, metrados y láminas, no solo de código.",
      "Trabajamos de forma remota con oficinas de ingeniería y construcción de toda Latinoamérica, y también con equipos de países de habla inglesa y portuguesa.",
    ],
    whatTitle: "Qué hacemos",
    howTitle: "Cómo trabajamos",
    how: [
      "Diagnóstico gratuito de una semana sobre uno de tus proyectos.",
      "Un plugin listo en 4 a 8 semanas, con pruebas sobre tus propios modelos.",
      "El código fuente queda en tu empresa, con instalador, manual y documentación.",
      "Actualización con cada versión nueva de Revit, AutoCAD o Civil 3D.",
    ],
    publishTitle: "Lo que publicamos",
    publish:
      "Publicamos lo que aprendemos: {posts} guías técnicas en español y {tools} herramientas gratuitas que cualquiera puede usar sin registrarse.",
    readBlog: "Leer las guías",
    openTools: "Usar las herramientas gratuitas",
    contactTitle: "Hablemos",
    contact: "Escríbenos por WhatsApp o por correo, o síguenos en LinkedIn.",
    linkedin: "Zeist en LinkedIn",
  },
  pt: {
    seoTitle: "Quem somos: engenheiros civis e de sistemas",
    metaDescription:
      "A Zeist é uma equipe de engenheiros civis e de sistemas que desenvolve plugins e automação BIM para Civil 3D e Revit, para toda a América Latina.",
    breadcrumb: "Sobre a Zeist",
    eyebrow: "Sobre a Zeist",
    h1: "Somos engenheiros civis e engenheiros de sistemas que automatizam o Civil 3D e o Revit",
    intro:
      "A Zeist desenvolve plugins em C# para Civil 3D e Revit, scripts de Dynamo e cursos para equipes BIM. Escrevemos os guias deste site e construímos as suas ferramentas gratuitas.",
    whoTitle: "Quem somos",
    who: [
      "Uma equipe mista: engenheiros civis que conhecem o fluxo de um projeto, e engenheiros de sistemas que sabem transformar esse fluxo em software. Por isso falamos de estacas, seções, quantitativos e pranchas, não só de código.",
      "Trabalhamos de forma remota com escritórios de engenharia e construção de toda a América Latina e também com equipes de países de língua portuguesa e inglesa.",
    ],
    whatTitle: "O que fazemos",
    howTitle: "Como trabalhamos",
    how: [
      "Diagnóstico gratuito de uma semana num dos seus projetos.",
      "Um plugin pronto em 4 a 8 semanas, com testes nos seus próprios modelos.",
      "O código-fonte fica com a sua empresa, com instalador, manual e documentação.",
      "Atualização a cada nova versão do Revit, do AutoCAD ou do Civil 3D.",
    ],
    publishTitle: "O que publicamos",
    publish:
      "Publicamos o que aprendemos: {posts} guias técnicos em português e {tools} ferramentas gratuitas que qualquer pessoa pode usar sem cadastro.",
    readBlog: "Ler os guias",
    openTools: "Usar as ferramentas gratuitas",
    contactTitle: "Vamos conversar",
    contact: "Fale conosco pelo WhatsApp ou por e-mail, ou siga a Zeist no LinkedIn.",
    linkedin: "Zeist no LinkedIn",
  },
  en: {
    seoTitle: "About Us: Civil Engineers and Software Engineers",
    metaDescription:
      "Zeist is a team of civil and software engineers building plugins and BIM automation for Civil 3D and Revit, for firms across Latin America and beyond.",
    breadcrumb: "About Zeist",
    eyebrow: "About Zeist",
    h1: "We're civil engineers and software engineers who automate Civil 3D and Revit",
    intro:
      "Zeist builds C# plugins for Civil 3D and Revit, Dynamo scripts and training for BIM teams. We write the guides on this site and build its free tools.",
    whoTitle: "Who we are",
    who: [
      "A mixed team: civil engineers who know how a plan set gets produced, and software engineers who know how to turn that workflow into software. That's why we talk about stations, sections, quantities and sheets, not just code.",
      "We work remotely with engineering and construction firms across Latin America, and with teams in English- and Portuguese-speaking countries.",
    ],
    whatTitle: "What we do",
    howTitle: "How we work",
    how: [
      "A free one-week diagnosis on one of your projects.",
      "A plugin ready in 4 to 8 weeks, tested on your own models.",
      "Your company owns the source code, with an installer, a manual and documentation.",
      "Updates with every new release of Revit, AutoCAD or Civil 3D.",
    ],
    publishTitle: "What we publish",
    publish:
      "We publish what we learn: {posts} technical guides in English and {tools} free tools anyone can use without signing up.",
    readBlog: "Read the guides",
    openTools: "Use the free tools",
    contactTitle: "Let's talk",
    contact: "Message us on WhatsApp or by email, or follow Zeist on LinkedIn.",
    linkedin: "Zeist on LinkedIn",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const c = copy[locale];
  return buildMetadata({ locale, path: "nosotros", title: c.seoTitle, description: c.metaDescription });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const c = copy[lang];
  const posts = getAllPosts(lang).length;
  const tools = toolsFor(lang).length;

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: c.seoTitle,
    description: c.metaDescription,
    url: localizedUrl(lang, "nosotros"),
    inLanguage: lang,
    mainEntity: organizationJsonLd(lang),
  };

  return (
    <>
      <JsonLd data={[aboutJsonLd, breadcrumbJsonLd(lang, [[c.breadcrumb, "nosotros"]])]} />

      <section className="section container-zeist pb-0">
        <div className="max-w-3xl">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl">{c.h1}</h1>
          <p className="mt-5 text-lg text-[color:var(--color-muted)]">{c.intro}</p>
        </div>
      </section>

      <section className="section container-zeist">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">{c.whoTitle}</h2>
            {c.who.map((p) => (
              <p key={p} className="mt-4 text-[color:var(--color-muted)]">
                {p}
              </p>
            ))}
          </div>
          <div>
            <h2 className="text-3xl">{c.howTitle}</h2>
            <ol className="mt-4 space-y-3">
              {c.how.map((item, i) => (
                <li key={item} className="flex gap-4 border-t border-[color:var(--color-hairline)] pt-3">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[color:var(--color-mint-600)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="band-tint section w-full">
        <div className="container-zeist">
          <h2 className="text-3xl">{c.whatTitle}</h2>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {dict.services.items.map((s) => (
              <Link key={s.slug} href={localizedPath(lang, `servicios/${s.slug}`)} className="group border-t border-[color:var(--color-hairline)] pt-5">
                <h3 className="text-xl transition-colors group-hover:text-[color:var(--color-mint-700)]">{s.title}</h3>
                <p className="mt-2 text-[color:var(--color-muted)]">{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section container-zeist">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">{c.publishTitle}</h2>
            <p className="mt-4 text-[color:var(--color-muted)]">
              {c.publish.replace("{posts}", String(posts)).replace("{tools}", String(tools))}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={localizedPath(lang, "blog")} className="btn-ghost">
                {c.readBlog}
                <IconArrow className="h-4 w-4" />
              </Link>
              <Link href={localizedPath(lang, "herramientas")} className="btn-ghost">
                {c.openTools}
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-3xl">{c.contactTitle}</h2>
            <p className="mt-4 text-[color:var(--color-muted)]">{c.contact}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappUrl(dict.whatsapp.prefill)} target="_blank" rel="noopener noreferrer" data-cta="about-page" className="btn-primary">
                {site.whatsapp.display}
              </a>
              {site.showEmail && (
                <a href={mailtoUrl()} data-cta="about-page-email" className="btn-ghost">
                  {site.email}
                </a>
              )}
              <a href={site.linkedin} target="_blank" rel="noopener" className="btn-ghost">
                {c.linkedin} ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
