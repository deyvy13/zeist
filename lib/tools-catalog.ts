import type { Locale } from "@/lib/i18n";
import type { rubroIcons } from "@/components/icons";

// -----------------------------------------------------------------------------
// Tools & resources hub — organized by RUBRO (category), not by product.
// Each rubro leads with a benefit ("Automatiza tus tareas de ing. civil") and
// lists PROPOSED tools + end-to-end routes as buttons (planning phase).
// Iterate freely: add/remove tools and routes here per locale.
// -----------------------------------------------------------------------------

export type Rubro = {
  slug: string;
  icon: keyof typeof rubroIcons;
  category: string; // short label
  title: string; // benefit headline
  description: string;
  tools: string[]; // proposed tools (rendered as "Pronto" buttons)
  routes: string[]; // proposed end-to-end routes
};

export type ToolsHubCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  toolsLabel: string;
  routesLabel: string;
  soon: string;
  note: string;
};

export const toolsHubCopy: Record<Locale, ToolsHubCopy> = {
  es: {
    eyebrow: "Herramientas y recursos",
    title: "Todo lo que necesitas, por rubros.",
    subtitle:
      "Herramientas fijas, rutas end-to-end y formación — organizadas por categoría. Elige tu rubro y avanza sin adivinar.",
    toolsLabel: "Herramientas",
    routesLabel: "Rutas end-to-end",
    soon: "Pronto",
    note: "Propuestas en construcción. Vamos definiendo y liberando cada una.",
  },
  pt: {
    eyebrow: "Ferramentas e recursos",
    title: "Tudo o que você precisa, por áreas.",
    subtitle:
      "Ferramentas fixas, trilhas end-to-end e formação — organizadas por categoria. Escolha a sua área e avance sem adivinhar.",
    toolsLabel: "Ferramentas",
    routesLabel: "Trilhas end-to-end",
    soon: "Em breve",
    note: "Propostas em construção. Vamos definindo e liberando cada uma.",
  },
};

const catalog: Record<Locale, Rubro[]> = {
  es: [
    {
      slug: "diseno-ux-ui",
      icon: "palette",
      category: "Diseño UX/UI",
      title: "Diseña como un profesional, sin ser diseñador.",
      description:
        "Generadores y recursos fijos para aplicar las mejores prácticas UX/UI sin adivinar. Copia el CSS y listo.",
      tools: [
        "Generador de Claymorfismo",
        "Generador de Glassmorfismo",
        "Generador de Neumorfismo",
        "Generador de paletas",
        "Generador de sombras",
        "Generador de gradientes",
        "Prompts para Google Stitch",
      ],
      routes: [
        "De la idea al diseño final en Figma",
        "De wireframe a UI con IA",
      ],
    },
    {
      slug: "arquitectura-de-datos",
      icon: "database",
      category: "Arquitectura de datos",
      title: "Modela datos que escalan desde el día uno.",
      description:
        "Diseña tu base de datos bien desde el inicio. Del diagrama al SQL, sin deuda técnica.",
      tools: [
        "Diseñador de diagramas ER",
        "Generador de SQL desde el modelo",
        "Generador de datos de prueba",
        "Validador de normalización",
        "Prompts para modelar datos con IA",
      ],
      routes: [
        "De requerimientos a base de datos productiva",
        "De Excel a modelo relacional",
      ],
    },
    {
      slug: "arquitectura-de-software",
      icon: "layers",
      category: "Arquitectura de software",
      title: "Arquitecturas sólidas, decisiones claras.",
      description:
        "Elige bien tu stack y tu estructura. Diagramas y plantillas listas para proyectos serios.",
      tools: [
        "Selector de stack tecnológico",
        "Generador de diagramas C4",
        "Plantillas de estructura de proyecto",
        "Checklist de escalabilidad y seguridad",
        "Prompts para diseñar arquitectura con IA",
      ],
      routes: [
        "Del MVP a una arquitectura escalable",
        "De monolito a microservicios",
      ],
    },
    {
      slug: "automatizacion-ingenieria",
      icon: "cube",
      category: "Automatización en ingeniería",
      title: "Automatiza tus tareas de ingeniería civil.",
      description:
        "Deja de repetir tareas de modelado 3D. Scripts, add-ins y rutinas para Civil 3D, Revit y Dynamo.",
      tools: [
        "Biblioteca de scripts Dynamo",
        "Generador de add-ins base (Revit / C3D)",
        "Automatizador de tareas de modelado",
        "Plantillas y familias",
        "Prompts para generar rutinas con IA",
      ],
      routes: [
        "Automatiza tu flujo BIM/CAD desde cero",
        "De tarea manual a add-in en C#",
      ],
    },
    {
      slug: "cursos-gratuitos",
      icon: "graduation",
      category: "Cursos gratuitos",
      title: "Aprende gratis, de cero al despliegue.",
      description:
        "Formación práctica y sin relleno. Empieza hoy y aplícalo mañana.",
      tools: [
        "Vibe Coding: de cero al deploy",
        "Desarrollo con IA desde cero",
        "SEO para desarrolladores",
        "Automatización en ingeniería civil",
        "Fundamentos de UX/UI",
      ],
      routes: [
        "Tu primer proyecto en producción",
        "De junior a productivo con IA",
      ],
    },
    {
      slug: "mentorias-comunidad",
      icon: "chat",
      category: "Mentorías y comunidad",
      title: "No estás solo: te guiamos en el camino.",
      description:
        "Mentorías de Vibe Coding, webinars y bootcamps para acompañarte de la idea al despliegue.",
      tools: [
        "Mentorías Vibe Coding 1:1",
        "Webinars en vivo",
        "Bootcamps gratuitos",
        "Biblioteca de prompts",
        "Comunidad Zeist",
      ],
      routes: ["De tu idea a tu app desplegada, acompañado"],
    },
  ],
  pt: [
    {
      slug: "diseno-ux-ui",
      icon: "palette",
      category: "Design UX/UI",
      title: "Desenhe como um profissional, sem ser designer.",
      description:
        "Geradores e recursos fixos para aplicar as melhores práticas de UX/UI sem adivinhar. Copie o CSS e pronto.",
      tools: [
        "Gerador de Claymorphism",
        "Gerador de Glassmorphism",
        "Gerador de Neumorphism",
        "Gerador de paletas",
        "Gerador de sombras",
        "Gerador de gradientes",
        "Prompts para Google Stitch",
      ],
      routes: [
        "Da ideia ao design final no Figma",
        "De wireframe a UI com IA",
      ],
    },
    {
      slug: "arquitectura-de-datos",
      icon: "database",
      category: "Arquitetura de dados",
      title: "Modele dados que escalam desde o dia um.",
      description:
        "Projete o seu banco de dados bem desde o início. Do diagrama ao SQL, sem dívida técnica.",
      tools: [
        "Editor de diagramas ER",
        "Gerador de SQL a partir do modelo",
        "Gerador de dados de teste",
        "Validador de normalização",
        "Prompts para modelar dados com IA",
      ],
      routes: [
        "De requisitos a banco de dados em produção",
        "De Excel a modelo relacional",
      ],
    },
    {
      slug: "arquitectura-de-software",
      icon: "layers",
      category: "Arquitetura de software",
      title: "Arquiteturas sólidas, decisões claras.",
      description:
        "Escolha bem o seu stack e a sua estrutura. Diagramas e templates prontos para projetos sérios.",
      tools: [
        "Seletor de stack tecnológico",
        "Gerador de diagramas C4",
        "Templates de estrutura de projeto",
        "Checklist de escalabilidade e segurança",
        "Prompts para desenhar arquitetura com IA",
      ],
      routes: [
        "Do MVP a uma arquitetura escalável",
        "De monólito a microsserviços",
      ],
    },
    {
      slug: "automatizacion-ingenieria",
      icon: "cube",
      category: "Automação em engenharia",
      title: "Automatize suas tarefas de engenharia civil.",
      description:
        "Pare de repetir tarefas de modelagem 3D. Scripts, add-ins e rotinas para Civil 3D, Revit e Dynamo.",
      tools: [
        "Biblioteca de scripts Dynamo",
        "Gerador de add-ins base (Revit / C3D)",
        "Automatizador de tarefas de modelagem",
        "Templates e famílias",
        "Prompts para gerar rotinas com IA",
      ],
      routes: [
        "Automatize seu fluxo BIM/CAD do zero",
        "De tarefa manual a add-in em C#",
      ],
    },
    {
      slug: "cursos-gratuitos",
      icon: "graduation",
      category: "Cursos gratuitos",
      title: "Aprenda de graça, do zero à publicação.",
      description:
        "Formação prática e sem enrolação. Comece hoje e aplique amanhã.",
      tools: [
        "Vibe Coding: do zero ao deploy",
        "Desenvolvimento com IA do zero",
        "SEO para desenvolvedores",
        "Automação em engenharia civil",
        "Fundamentos de UX/UI",
      ],
      routes: [
        "Seu primeiro projeto em produção",
        "De júnior a produtivo com IA",
      ],
    },
    {
      slug: "mentorias-comunidad",
      icon: "chat",
      category: "Mentorias e comunidade",
      title: "Você não está sozinho: guiamos o seu caminho.",
      description:
        "Mentorias de Vibe Coding, webinars e bootcamps para acompanhar você da ideia à publicação.",
      tools: [
        "Mentorias Vibe Coding 1:1",
        "Webinars ao vivo",
        "Bootcamps gratuitos",
        "Biblioteca de prompts",
        "Comunidade Zeist",
      ],
      routes: ["Da sua ideia ao seu app publicado, acompanhado"],
    },
  ],
};

export function getRubros(locale: Locale): Rubro[] {
  return catalog[locale];
}
