import type { Locale } from "@/lib/i18n";
import type { rubroIcons } from "@/components/icons";

// -----------------------------------------------------------------------------
// Tools & resources hub — organized by RUBRO (category), all within the BIM
// automation niche. Each rubro leads with a benefit and lists PROPOSED tools +
// end-to-end routes as buttons (planning phase).
//
// SEO note: tool and route names are deliberately written the way people
// actually search ("generador de perfiles longitudinales", "plantilla add-in
// Civil 3D C#") so the hub doubles as a long-tail magnet.
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
    title: "Todo para automatizar tu trabajo BIM, en un solo lugar.",
    subtitle:
      "Scripts de Dynamo listos para usar, plantillas de add-ins en C#, calculadoras de ingeniería y prompts de IA. Gratis y en español.",
    toolsLabel: "Herramientas",
    routesLabel: "Rutas end-to-end",
    soon: "Pronto",
    note: "Propuestas en construcción. Vamos definiendo y liberando cada una.",
  },
  pt: {
    eyebrow: "Ferramentas e recursos",
    title: "Tudo para automatizar seu trabalho BIM, num só lugar.",
    subtitle:
      "Scripts de Dynamo prontos para usar, templates de add-ins em C#, calculadoras de engenharia e prompts de IA. Grátis e em português.",
    toolsLabel: "Ferramentas",
    routesLabel: "Trilhas end-to-end",
    soon: "Em breve",
    note: "Propostas em construção. Vamos definindo e liberando cada uma.",
  },
};

const catalog: Record<Locale, Rubro[]> = {
  es: [
    {
      slug: "scripts-dynamo",
      icon: "cube",
      category: "Scripts Dynamo",
      title: "Deja de rehacer el mismo grafo en cada proyecto.",
      description:
        "Grafos de Dynamo listos para descargar y usar en Civil 3D y Revit. Documentados, con los nodos explicados y sin dependencias raras.",
      tools: [
        "Generador de perfiles longitudinales cada X metros",
        "Renombrador masivo de alineaciones",
        "Exportador de puntos topográficos a CSV",
        "Colocador automático de señalización",
        "Generador de taludes desde polilínea",
        "Extractor de datos del modelo a Excel",
      ],
      routes: [
        "De tarea manual a grafo Dynamo funcional",
        "Cómo documentar y compartir tus grafos con el equipo",
      ],
    },
    {
      slug: "plantillas-addins",
      icon: "layers",
      category: "Plantillas de add-ins",
      title: "Empieza tu add-in con la estructura correcta.",
      description:
        "Plantillas base en C# para Civil 3D y Revit, con arquitectura en capas lista: Command, Service y Repository separados desde el primer commit.",
      tools: [
        "Plantilla add-in Civil 3D C# (.NET)",
        "Plantilla add-in Revit C# (.NET)",
        "Generador de PackageContents.xml",
        "Script de build y empaquetado .bundle",
        "Plantilla de botón en la barra superior",
        "Checklist de compatibilidad entre versiones",
      ],
      routes: [
        "Del primer comando al add-in instalable",
        "Cómo distribuir tu add-in a toda la oficina",
      ],
    },
    {
      slug: "calculadoras-ingenieria",
      icon: "database",
      category: "Calculadoras de ingeniería",
      title: "Cálculos rápidos sin abrir una hoja de cálculo.",
      description:
        "Calculadoras web para los cálculos que haces todos los días. Sin instalar nada, sin fórmulas que se rompen.",
      tools: [
        "Calculadora de volumen de movimiento de tierras",
        "Calculadora de pendientes y peraltes",
        "Conversor de coordenadas topográficas",
        "Calculadora de curvas horizontales y verticales",
        "Estimador de horas ahorradas por automatización",
      ],
      routes: ["De cálculo manual a herramienta reutilizable del equipo"],
    },
    {
      slug: "prompts-bim",
      icon: "chat",
      category: "Prompts de IA para BIM",
      title: "Prompts probados para que la IA no invente.",
      description:
        "Colección de prompts que funcionan con Claude y ChatGPT para generar código de Revit API, Civil 3D API y Dynamo sin alucinaciones.",
      tools: [
        "Prompts para generar comandos de Revit API",
        "Prompts para Civil 3D API en C#",
        "Prompts para nodos Python en Dynamo",
        "Prompt para depurar errores de compilación",
        "Prompt para portar un grafo Dynamo a C#",
      ],
      routes: [
        "De la idea al add-in usando IA como copiloto",
        "Cómo dar contexto de la API para que la IA acierte",
      ],
    },
    {
      slug: "formacion-bim",
      icon: "graduation",
      category: "Cursos y mentorías",
      title: "Aprende a construir tus propias herramientas.",
      description:
        "Formación práctica en Revit API, Civil 3D API y Dynamo. Para ingenieros y arquitectos que quieren dejar de depender de terceros.",
      tools: [
        "Curso: Revit API desde cero para ingenieros",
        "Curso: Civil 3D API y automatización de infraestructura",
        "Curso: Dynamo aplicado a proyectos reales",
        "Webinars en vivo",
        "Mentorías 1-a-1",
      ],
      routes: [
        "De ingeniero civil a autor de tus propios add-ins",
        "Cómo montar la capacidad de automatización dentro de tu oficina",
      ],
    },
  ],
  pt: [
    {
      slug: "scripts-dynamo",
      icon: "cube",
      category: "Scripts Dynamo",
      title: "Pare de refazer o mesmo grafo em cada projeto.",
      description:
        "Grafos de Dynamo prontos para baixar e usar no Civil 3D e Revit. Documentados, com os nós explicados e sem dependências estranhas.",
      tools: [
        "Gerador de perfis longitudinais a cada X metros",
        "Renomeador em massa de alinhamentos",
        "Exportador de pontos topográficos para CSV",
        "Posicionador automático de sinalização",
        "Gerador de taludes a partir de polilinha",
        "Extrator de dados do modelo para Excel",
      ],
      routes: [
        "De tarefa manual a grafo Dynamo funcional",
        "Como documentar e compartilhar seus grafos com a equipe",
      ],
    },
    {
      slug: "plantillas-addins",
      icon: "layers",
      category: "Templates de add-ins",
      title: "Comece seu add-in com a estrutura certa.",
      description:
        "Templates base em C# para Civil 3D e Revit, com arquitetura em camadas pronta: Command, Service e Repository separados desde o primeiro commit.",
      tools: [
        "Template add-in Civil 3D C# (.NET)",
        "Template add-in Revit C# (.NET)",
        "Gerador de PackageContents.xml",
        "Script de build e empacotamento .bundle",
        "Template de botão na barra superior",
        "Checklist de compatibilidade entre versões",
      ],
      routes: [
        "Do primeiro comando ao add-in instalável",
        "Como distribuir seu add-in para todo o escritório",
      ],
    },
    {
      slug: "calculadoras-ingenieria",
      icon: "database",
      category: "Calculadoras de engenharia",
      title: "Cálculos rápidos sem abrir uma planilha.",
      description:
        "Calculadoras web para os cálculos que você faz todos os dias. Sem instalar nada, sem fórmulas que quebram.",
      tools: [
        "Calculadora de volume de movimento de terra",
        "Calculadora de declividades e superelevação",
        "Conversor de coordenadas topográficas",
        "Calculadora de curvas horizontais e verticais",
        "Estimador de horas economizadas por automação",
      ],
      routes: ["De cálculo manual a ferramenta reutilizável da equipe"],
    },
    {
      slug: "prompts-bim",
      icon: "chat",
      category: "Prompts de IA para BIM",
      title: "Prompts testados para a IA não inventar.",
      description:
        "Coleção de prompts que funcionam com Claude e ChatGPT para gerar código de Revit API, Civil 3D API e Dynamo sem alucinações.",
      tools: [
        "Prompts para gerar comandos de Revit API",
        "Prompts para Civil 3D API em C#",
        "Prompts para nós Python no Dynamo",
        "Prompt para depurar erros de compilação",
        "Prompt para portar um grafo Dynamo para C#",
      ],
      routes: [
        "Da ideia ao add-in usando IA como copiloto",
        "Como dar contexto da API para a IA acertar",
      ],
    },
    {
      slug: "formacion-bim",
      icon: "graduation",
      category: "Cursos e mentorias",
      title: "Aprenda a construir suas próprias ferramentas.",
      description:
        "Formação prática em Revit API, Civil 3D API e Dynamo. Para engenheiros e arquitetos que querem parar de depender de terceiros.",
      tools: [
        "Curso: Revit API do zero para engenheiros",
        "Curso: Civil 3D API e automação de infraestrutura",
        "Curso: Dynamo aplicado a projetos reais",
        "Webinars ao vivo",
        "Mentorias 1-a-1",
      ],
      routes: [
        "De engenheiro civil a autor dos seus próprios add-ins",
        "Como montar a capacidade de automação dentro do seu escritório",
      ],
    },
  ],
};

export function getRubros(locale: Locale): Rubro[] {
  return catalog[locale];
}
