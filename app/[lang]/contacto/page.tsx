import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";

const copy: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    labels: {
      name: string;
      email: string;
      message: string;
      send: string;
      subject: string;
    };
    orEmail: string;
  }
> = {
  es: {
    title: "Hablemos de tu proyecto",
    subtitle:
      "Cuéntanos qué necesitas. Te respondemos con un plan claro y un presupuesto sin rodeos.",
    labels: {
      name: "Nombre",
      email: "Correo",
      message: "¿Qué quieres construir?",
      send: "Enviar mensaje",
      subject: "Nuevo proyecto",
    },
    orEmail: "O escríbenos directamente a",
  },
  pt: {
    title: "Vamos falar do seu projeto",
    subtitle:
      "Conte-nos o que você precisa. Respondemos com um plano claro e um orçamento sem rodeios.",
    labels: {
      name: "Nome",
      email: "E-mail",
      message: "O que você quer construir?",
      send: "Enviar mensagem",
      subject: "Novo projeto",
    },
    orEmail: "Ou escreva diretamente para",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const c = copy[locale];
  return buildMetadata({
    locale,
    path: "contacto",
    title: c.title,
    description: c.subtitle,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  await getDictionary(lang); // ensures locale is valid/loaded
  const c = copy[lang];

  return (
    <section className="container-zeist py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl">{c.title}</h1>
          <p className="mt-4 text-lg text-[color:var(--color-muted)]">
            {c.subtitle}
          </p>
        </div>

        <div className="mt-10">
          <ContactForm labels={c.labels} />
        </div>

        <p className="mt-6 text-center text-sm text-[color:var(--color-muted)]">
          {c.orEmail}{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-[color:var(--color-mint-700)] hover:underline"
          >
            {site.email}
          </a>
        </p>
      </div>
    </section>
  );
}
