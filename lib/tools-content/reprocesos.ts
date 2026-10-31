import type { Locale } from "@/lib/i18n";
import type { ReworkLabels } from "@/components/tools/rework-calculator";
import type { ToolContent } from "@/lib/tools-content/types";

// Rework cost calculator — es / pt / en. The rates (REWORK_RATES in
// lib/tools/rework.ts) and their sources are the ones cited in the post
// reprocesos-obra-costo-oculto: GIRI ≈ 5 % direct and up to 25 % with indirect
// costs; Universidad EAN and UNAD up to 12.4 %; FMI and PlanGrid 48 %.

export type ReworkDefaults = { currency: string; hours: string; hourlyCost: string; projectValue: string };

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Calculadora del costo de los reprocesos en obra",
    metaDescription:
      "Calcula cuánto le cuestan los reprocesos a tu empresa: las horas de gabinete rehechas al año y escenarios sobre el valor de la obra según estudios con fuente.",
    keywords: [
      "costo de los reprocesos",
      "costo del retrabajo",
      "calculadora de reprocesos",
      "reprocesos en obra",
      "costo de la no calidad en construcción",
    ],
    name: "Calculadora del costo de los reprocesos",
    eyebrow: "Herramienta gratuita · Gestión de proyectos",
    h1: "Calculadora del costo de los reprocesos en obra y en gabinete",
    intro:
      "Pon en número lo que hoy nadie mide: las horas que tu equipo dedica a rehacer entregables y lo que los estudios publicados atribuyen al reproceso sobre el valor de una obra.",
    badges: ["Gratis y sin registro", "Tasas con fuente", "Tus datos no salen del navegador"],
    calculatorTitle: "Calcular el costo de los reprocesos",
    answer:
      "El costo de los reprocesos tiene dos lecturas. En gabinete, son las horas que el equipo dedica a rehacer lo ya entregado, multiplicadas por su costo por hora. En obra, los estudios lo estiman como una parte del valor del proyecto: cerca del 5 % en costo directo según la Get It Right Initiative del Reino Unido, hasta el 12,4 % según investigaciones de la Universidad EAN y la UNAD en Colombia, y hasta el 25 % con los costos indirectos. Medirlo un mes basta para tener tu propio número.",
    sections: [
      {
        id: "como-se-calcula",
        title: "Cómo se calcula",
        blocks: [
          { type: "formula", text: "Pérdida mensual = horas de reproceso al mes × costo por hora" },
          { type: "formula", text: "Pérdida anual = pérdida mensual × 12" },
          { type: "formula", text: "Parte del negocio = pérdida anual / facturación anual" },
          {
            type: "p",
            text: "El costo por hora es el **costo cargado**: sueldo, cargas sociales, equipos, licencias y local, dividido entre las horas productivas. Usar solo el sueldo subestima la pérdida.",
          },
        ],
      },
      {
        id: "tasas",
        title: "Las tasas de reproceso que usa la calculadora",
        blocks: [
          {
            type: "table",
            head: ["Estudio", "Qué mide", "Tasa sobre el valor del proyecto"],
            rows: [
              ["Get It Right Initiative (Reino Unido)", "Costo directo de los errores evitables", "≈ 5 %"],
              ["Universidad EAN y UNAD (Colombia, 2026)", "Reprocesos", "hasta 12,4 %"],
              ["Get It Right Initiative (Reino Unido)", "Con los costos indirectos", "hasta 25 %"],
            ],
          },
          {
            type: "p",
            text: "Son escenarios, no un pronóstico de tu obra. En EE. UU., el estudio de FMI y PlanGrid (2018) atribuyó el 48 % del reproceso a la mala comunicación y a los datos deficientes del proyecto. Las fuentes y el detalle están en [reprocesos en obra: el costo oculto](/es/blog/reprocesos-obra-costo-oculto).",
          },
        ],
      },
      {
        id: "tu-numero",
        title: "Cómo conseguir el número real de tu empresa",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Durante un mes, pide al equipo que anote en una hoja compartida las horas dedicadas a rehacer algo ya entregado o calculado: fecha, persona, qué se rehizo y cuántas horas.",
              "Cuenta cuántas revisiones necesita cada entregable antes de aprobarse. Tres o más de forma habitual apuntan a un problema de proceso.",
              "Compara el metrado presupuestado con lo ejecutado en las partidas principales.",
            ],
          },
          {
            type: "p",
            text: "Con esas horas, esta calculadora te da la pérdida anual. Es el número que abre la conversación con la dirección.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Auditoría BIM",
      title: "¿El número salió alto? Te decimos de dónde viene.",
      body: "En la auditoría de procesos BIM, remota y de 4 semanas, medimos dónde se pierden las horas y te entregamos un plan priorizado. El diagnóstico es gratuito y dura una semana.",
      prefill: "Hola Zeist. Vengo de la calculadora del costo de los reprocesos. Quiero saber dónde se pierden las horas en mi empresa.",
      secondaryLabel: "Ver auditoría de procesos BIM",
      secondaryPath: "servicios/auditoria-procesos-bim",
    },
    faqs: [
      {
        q: "¿Cuánto cuestan los reprocesos en construcción?",
        a: "Depende de qué se cuente. La Get It Right Initiative del Reino Unido estima cerca del 5 % del valor del proyecto en costo directo y hasta el 25 % con los costos indirectos. En Colombia, investigaciones de la Universidad EAN y la UNAD hablan de hasta el 12,4 % solo en reprocesos.",
      },
      {
        q: "¿Qué es el costo cargado por hora?",
        a: "Es lo que de verdad cuesta una hora de trabajo para la empresa: sueldo, cargas sociales, equipos, licencias y local, dividido entre las horas productivas. Es más alto que el sueldo por hora, y es el que corresponde usar para medir los reprocesos.",
      },
      {
        q: "¿Cómo mido las horas de reproceso si nadie las registra?",
        a: "Con una hoja compartida durante un mes: fecha, persona, qué se rehizo y cuántas horas. No hace falta un sistema. Al final del mes, la suma de horas multiplicada por el costo cargado da la pérdida mensual.",
      },
      {
        q: "¿Por qué los estudios dan tasas tan distintas?",
        a: "Porque miden cosas distintas: algunos cuentan solo el costo directo de rehacer, otros suman los costos indirectos como retrasos y defectos ocultos, y cada uno estudia un país y un tipo de obra. Por eso la calculadora los muestra como escenarios y no como un único número.",
      },
      {
        q: "¿Cómo se reducen los reprocesos?",
        a: "Quitando los pasos manuales donde la información se separa de su fuente: metrados que salen del modelo, planos que se regeneran, revisión automática del estándar antes de cada entrega y coordinación entre disciplinas en el modelo. Lo explicamos en el artículo sobre reprocesos en obra.",
      },
    ],
    guides: [
      "reprocesos-obra-costo-oculto",
      "auditoria-bim-checklist-empresa",
      "auditoria-automatica-modelos-revit",
      "estandarizar-procesos-bim-empresa",
      "deja-de-usar-excel-y-perder-horas",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Calculadora do custo do retrabalho na obra",
    metaDescription:
      "Calcule quanto o retrabalho custa para a sua empresa: as horas de escritório refeitas no ano e cenários sobre o valor da obra segundo estudos com fonte.",
    keywords: [
      "custo do retrabalho",
      "custo do retrabalho na construção civil",
      "calculadora de retrabalho",
      "retrabalho na obra",
      "custo da não qualidade na construção",
    ],
    name: "Calculadora do custo do retrabalho",
    eyebrow: "Ferramenta gratuita · Gestão de projetos",
    h1: "Calculadora do custo do retrabalho na obra e no escritório",
    intro:
      "Ponha em número o que hoje ninguém mede: as horas que a sua equipe gasta refazendo entregas e o que os estudos publicados atribuem ao retrabalho sobre o valor de uma obra.",
    badges: ["Grátis e sem cadastro", "Taxas com fonte", "Seus dados não saem do navegador"],
    calculatorTitle: "Calcular o custo do retrabalho",
    answer:
      "O custo do retrabalho tem duas leituras. No escritório, são as horas que a equipe gasta refazendo o que já foi entregue, multiplicadas pelo custo por hora. Na obra, os estudos o estimam como uma parte do valor do projeto: cerca de 5 % em custo direto segundo a Get It Right Initiative, do Reino Unido, até 12,4 % segundo pesquisas da Universidade EAN e da UNAD, na Colômbia, e até 25 % com os custos indiretos. Medir um mês basta para ter o seu próprio número.",
    sections: [
      {
        id: "como-se-calcula",
        title: "Como se calcula",
        blocks: [
          { type: "formula", text: "Perda mensal = horas de retrabalho no mês × custo por hora" },
          { type: "formula", text: "Perda anual = perda mensal × 12" },
          { type: "formula", text: "Parte do negócio = perda anual / faturamento anual" },
          {
            type: "p",
            text: "O custo por hora é o **custo carregado**: salário, encargos, equipamentos, licenças e escritório, dividido pelas horas produtivas. Usar só o salário subestima a perda.",
          },
        ],
      },
      {
        id: "taxas",
        title: "As taxas de retrabalho que a calculadora usa",
        blocks: [
          {
            type: "table",
            head: ["Estudo", "O que mede", "Taxa sobre o valor do projeto"],
            rows: [
              ["Get It Right Initiative (Reino Unido)", "Custo direto dos erros evitáveis", "≈ 5 %"],
              ["Universidade EAN e UNAD (Colômbia, 2026)", "Retrabalho", "até 12,4 %"],
              ["Get It Right Initiative (Reino Unido)", "Com os custos indiretos", "até 25 %"],
            ],
          },
          {
            type: "p",
            text: "São cenários, não uma previsão da sua obra. Nos EUA, o estudo da FMI e da PlanGrid (2018) atribuiu 48 % do retrabalho à comunicação ruim e a dados deficientes do projeto. As fontes e o detalhe estão em [retrabalho na obra: quanto custa](/pt/blog/retrabalho-na-obra).",
          },
        ],
      },
      {
        id: "seu-numero",
        title: "Como chegar ao número real da sua empresa",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Durante um mês, peça à equipe que anote numa planilha compartilhada as horas gastas refazendo algo já entregue ou calculado: data, pessoa, o que foi refeito e quantas horas.",
              "Conte quantas revisões cada entrega precisa antes de ser aprovada. Três ou mais de forma habitual indicam um problema de processo.",
              "Compare o quantitativo orçado com o executado nos itens principais.",
            ],
          },
          {
            type: "p",
            text: "Com essas horas, esta calculadora dá a perda anual. É o número que abre a conversa com a diretoria.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Auditoria BIM",
      title: "O número saiu alto? Mostramos de onde ele vem.",
      body: "Na auditoria de processos BIM, remota e de 4 semanas, medimos onde as horas se perdem e entregamos um plano priorizado. O diagnóstico é gratuito e dura uma semana.",
      prefill: "Olá Zeist. Vim da calculadora do custo do retrabalho. Quero saber onde as horas se perdem na minha empresa.",
      secondaryLabel: "Ver auditoria BIM",
      secondaryPath: "servicios/auditoria-procesos-bim",
    },
    faqs: [
      {
        q: "Quanto custa o retrabalho na construção?",
        a: "Depende do que se conta. A Get It Right Initiative, do Reino Unido, estima cerca de 5 % do valor do projeto em custo direto e até 25 % com os custos indiretos. Na Colômbia, pesquisas da Universidade EAN e da UNAD falam em até 12,4 % só em retrabalho.",
      },
      {
        q: "O que é o custo carregado por hora?",
        a: "É o que uma hora de trabalho realmente custa para a empresa: salário, encargos, equipamentos, licenças e escritório, dividido pelas horas produtivas. É maior que o salário por hora, e é o que se deve usar para medir o retrabalho.",
      },
      {
        q: "Como medir as horas de retrabalho se ninguém as registra?",
        a: "Com uma planilha compartilhada durante um mês: data, pessoa, o que foi refeito e quantas horas. Não é preciso um sistema. No fim do mês, a soma das horas multiplicada pelo custo carregado dá a perda mensal.",
      },
      {
        q: "Por que os estudos dão taxas tão diferentes?",
        a: "Porque medem coisas diferentes: alguns contam só o custo direto de refazer, outros somam custos indiretos como atrasos e defeitos ocultos, e cada um estuda um país e um tipo de obra. Por isso a calculadora os mostra como cenários, e não como um número único.",
      },
      {
        q: "Como se reduz o retrabalho?",
        a: "Tirando os passos manuais onde a informação se separa da sua fonte: quantitativos que saem do modelo, pranchas que se regeneram, verificação automática do padrão antes de cada entrega e compatibilização das disciplinas no modelo. Explicamos no artigo sobre retrabalho na obra.",
      },
    ],
    guides: [
      "reprocesos-obra-costo-oculto",
      "auditoria-bim-checklist-empresa",
      "auditoria-automatica-modelos-revit",
      "estandarizar-procesos-bim-empresa",
      "deja-de-usar-excel-y-perder-horas",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "Construction Rework Cost Calculator",
    metaDescription:
      "Work out what rework costs your firm: office hours redone each year, plus scenarios on project value based on published, sourced studies.",
    keywords: [
      "cost of rework in construction",
      "rework cost calculator",
      "construction rework cost",
      "cost of poor quality construction",
      "rework percentage of project cost",
    ],
    name: "Construction rework cost calculator",
    eyebrow: "Free tool · Project management",
    h1: "Construction rework cost calculator: office hours and site rework",
    intro:
      "Put a number on what nobody measures today: the hours your team spends redoing deliverables, and what published studies attribute to rework as a share of project value.",
    badges: ["Free, no sign-up", "Sourced rates", "Your data stays in the browser"],
    calculatorTitle: "Calculate the cost of rework",
    answer:
      "The cost of rework has two readings. In the office, it's the hours the team spends redoing finished work, times its loaded hourly cost. On site, studies estimate it as a share of project value: about 5% in direct cost according to the UK's Get It Right Initiative, up to 12.4% according to Universidad EAN and UNAD research in Colombia, and up to 25% once indirect costs are included. One month of tracking is enough to get your own number.",
    sections: [
      {
        id: "how-it-works",
        title: "How it's calculated",
        blocks: [
          { type: "formula", text: "Monthly loss = rework hours per month × hourly cost" },
          { type: "formula", text: "Annual loss = monthly loss × 12" },
          { type: "formula", text: "Share of the business = annual loss / annual revenue" },
          {
            type: "p",
            text: "The hourly cost is the **loaded cost**: salary, benefits and payroll taxes, equipment, software and office, divided by productive hours. Using salary alone understates the loss.",
          },
        ],
      },
      {
        id: "rates",
        title: "The rework rates the calculator uses",
        blocks: [
          {
            type: "table",
            head: ["Study", "What it measures", "Rate on project value"],
            rows: [
              ["Get It Right Initiative (UK)", "Direct cost of avoidable errors", "≈ 5%"],
              ["Universidad EAN and UNAD (Colombia, 2026)", "Rework", "up to 12.4%"],
              ["Get It Right Initiative (UK)", "Including indirect costs", "up to 25%"],
            ],
          },
          {
            type: "p",
            text: "These are scenarios, not a forecast for your project. In the US, the FMI and PlanGrid study (2018) traced 48% of rework to poor communication and poor project data. Sources and detail are in [the cost of rework in construction](/en/blog/cost-of-rework-construction).",
          },
        ],
      },
      {
        id: "your-number",
        title: "How to get your firm's real number",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "For one month, have the team log in a shared sheet the hours spent redoing anything already delivered or calculated: date, person, what was redone and how many hours.",
              "Count how many revisions each deliverable needs before approval. Three or more as a habit points to a process problem.",
              "Compare budgeted quantities with what was actually built on the main line items.",
            ],
          },
          {
            type: "p",
            text: "Put those hours into this calculator and you get the annual loss. That's the number that starts the conversation with leadership.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "BIM audit",
      title: "Did the number come out high? We'll show you where it comes from.",
      body: "In our BIM process audit, remote and four weeks long, we measure where the hours go and hand you a prioritized plan. The diagnosis is free and takes one week.",
      prefill: "Hi Zeist. I'm coming from the rework cost calculator. I'd like to find out where our hours are going.",
      secondaryLabel: "See BIM audit services",
      secondaryPath: "servicios/auditoria-procesos-bim",
    },
    faqs: [
      {
        q: "What is the cost of rework in construction?",
        a: "It depends on what you count. The UK's Get It Right Initiative estimates about 5% of project value in direct cost and up to 25% with indirect costs. In the US, FMI and PlanGrid put rework from poor data and miscommunication at about $31.3 billion in 2018.",
      },
      {
        q: "What is a loaded hourly cost?",
        a: "It's what an hour of work really costs the firm: salary, benefits and payroll taxes, equipment, software and office, divided by productive hours. It's higher than the hourly wage, and it's the right figure for measuring rework.",
      },
      {
        q: "How do you measure rework hours if nobody logs them?",
        a: "With a shared sheet for one month: date, person, what was redone and how many hours. No system needed. At the end of the month, total hours times the loaded cost gives the monthly loss.",
      },
      {
        q: "Why do studies give such different rates?",
        a: "Because they measure different things: some count only the direct cost of redoing work, others add indirect costs such as delays and latent defects, and each one covers its own country and project type. That's why the calculator shows them as scenarios rather than a single number.",
      },
      {
        q: "How do you reduce construction rework?",
        a: "By removing the manual steps where information splits from its source: quantities that come from the model, drawings that regenerate, automated standards checks before each deliverable, and coordinating disciplines in the model. We cover it in our article on the cost of rework.",
      },
    ],
    guides: [
      "reprocesos-obra-costo-oculto",
      "auditoria-bim-checklist-empresa",
      "auditoria-automatica-modelos-revit",
      "estandarizar-procesos-bim-empresa",
      "deja-de-usar-excel-y-perder-horas",
    ],
  },
};

const labels: Record<Locale, ReworkLabels> = {
  es: {
    officeTitle: "Reprocesos en gabinete",
    hours: "Horas rehechas al mes (todo el equipo)",
    hoursHint: "Horas dedicadas a rehacer algo ya entregado o calculado.",
    hourlyCost: "Costo cargado por hora",
    hourlyCostHint: "El valor es un ejemplo: usa el de tu empresa.",
    revenue: "Facturación anual (opcional)",
    revenueHint: "Para ver qué parte del negocio se va en reprocesos.",
    currency: "Moneda",
    siteTitle: "Reprocesos en obra",
    projectValue: "Valor de la obra",
    results: "Lo que cuestan los reprocesos",
    monthly: "Pérdida mensual",
    annual: "Pérdida anual en gabinete",
    share: "De la facturación anual",
    daysTitle: "Días perdidos al mes",
    daysSub: "jornadas de 8 horas",
    scenarios: "Escenarios sobre el valor de la obra",
    scenarioHead: ["Estudio", "Tasa", "Costo"],
    rates: { "giri-direct": "GIRI, costo directo", colombia: "EAN y UNAD, Colombia", "giri-total": "GIRI, con indirectos" },
    invalid: "Escribe horas y costo por hora válidos.",
    note: "Las tasas son escenarios de estudios publicados, no un pronóstico de tu obra. Tus datos se procesan en tu navegador.",
  },
  pt: {
    officeTitle: "Retrabalho no escritório",
    hours: "Horas refeitas por mês (toda a equipe)",
    hoursHint: "Horas gastas refazendo algo já entregue ou calculado.",
    hourlyCost: "Custo carregado por hora",
    hourlyCostHint: "O valor é um exemplo: use o da sua empresa.",
    revenue: "Faturamento anual (opcional)",
    revenueHint: "Para ver que parte do negócio vai para o retrabalho.",
    currency: "Moeda",
    siteTitle: "Retrabalho na obra",
    projectValue: "Valor da obra",
    results: "O que o retrabalho custa",
    monthly: "Perda mensal",
    annual: "Perda anual no escritório",
    share: "Do faturamento anual",
    daysTitle: "Dias perdidos por mês",
    daysSub: "jornadas de 8 horas",
    scenarios: "Cenários sobre o valor da obra",
    scenarioHead: ["Estudo", "Taxa", "Custo"],
    rates: { "giri-direct": "GIRI, custo direto", colombia: "EAN e UNAD, Colômbia", "giri-total": "GIRI, com indiretos" },
    invalid: "Informe horas e custo por hora válidos.",
    note: "As taxas são cenários de estudos publicados, não uma previsão da sua obra. Seus dados são processados no seu navegador.",
  },
  en: {
    officeTitle: "Office rework",
    hours: "Hours redone per month (whole team)",
    hoursHint: "Hours spent redoing something already delivered or calculated.",
    hourlyCost: "Loaded hourly cost",
    hourlyCostHint: "The value is an example: use your firm's.",
    revenue: "Annual revenue (optional)",
    revenueHint: "To see what share of the business goes to rework.",
    currency: "Currency",
    siteTitle: "Site rework",
    projectValue: "Project value",
    results: "What rework costs",
    monthly: "Monthly loss",
    annual: "Annual office loss",
    share: "Of annual revenue",
    daysTitle: "Days lost per month",
    daysSub: "8-hour working days",
    scenarios: "Scenarios on project value",
    scenarioHead: ["Study", "Rate", "Cost"],
    rates: { "giri-direct": "GIRI, direct cost", colombia: "EAN and UNAD, Colombia", "giri-total": "GIRI, with indirect costs" },
    invalid: "Enter valid hours and an hourly cost.",
    note: "The rates are scenarios from published studies, not a forecast for your project. Your data is processed in your browser.",
  },
};

const defaults: Record<Locale, ReworkDefaults> = {
  es: { currency: "US$", hours: "40", hourlyCost: "20", projectValue: "1000000" },
  pt: { currency: "R$", hours: "40", hourlyCost: "80", projectValue: "5000000" },
  en: { currency: "US$", hours: "40", hourlyCost: "75", projectValue: "1000000" },
};

export function getReworkContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getReworkLabels(locale: Locale): ReworkLabels {
  return labels[locale];
}

export function getReworkDefaults(locale: Locale): ReworkDefaults {
  return defaults[locale];
}
