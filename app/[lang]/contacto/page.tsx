import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { site, whatsappUrl } from "@/lib/site";
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
    title: "Cuéntanos qué te está robando horas",
    subtitle:
      "Describe la tarea repetitiva que más pesa en tu equipo. Te decimos si conviene automatizarla, con qué herramienta y cuánto tiempo recuperas. Sin compromiso.",
    labels: {
      name: "Nombre",
      email: "Correo (opcional)",
      message: "¿Qué proceso quieres automatizar?",
      send: "Enviar mensaje",
      subject: "Diagnóstico de automatización BIM",
    },
    orEmail: "O escríbenos directamente por WhatsApp",
  },
  pt: {
    title: "Conte-nos o que está roubando suas horas",
    subtitle:
      "Descreva a tarefa repetitiva que mais pesa na sua equipe. Dizemos se vale automatizar, com qual ferramenta e quanto tempo você recupera. Sem compromisso.",
    labels: {
      name: "Nome",
      email: "E-mail (opcional)",
      message: "Que processo você quer automatizar?",
      send: "Enviar mensagem",
      subject: "Diagnóstico de automação BIM",
    },
    orEmail: "Ou fale direto pelo WhatsApp",
  },
  en: {
    title: "Tell us what's stealing your hours",
    subtitle:
      "Describe the repetitive task that weighs most on your team. We'll tell you if it's worth automating, with which tool, and how much time you'll get back. No commitment.",
    labels: {
      name: "Name",
      email: "Email (optional)",
      message: "What process do you want to automate?",
      send: "Send message",
      subject: "BIM automation diagnosis",
    },
    orEmail: "Or message us directly on WhatsApp",
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
  const dict = await getDictionary(lang);
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

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-[color:var(--color-muted)]">{c.orEmail}</p>
          <a
            href={whatsappUrl(dict.whatsapp.prefill)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.whatsapp.aria}
            className="inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(120deg,#2ee06a,#12a150)] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(18,161,80,0.9)] transition-transform hover:scale-[1.03] active:scale-95"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.24 8.24 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21z" />
            </svg>
            {site.whatsapp.display}
          </a>
        </div>
      </div>
    </section>
  );
}
