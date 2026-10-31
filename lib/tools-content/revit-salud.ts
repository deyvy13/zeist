import type { Locale } from "@/lib/i18n";
import { HEALTH_THRESHOLDS, type HealthIndicator, type HealthLevel } from "@/lib/tools/revit-health";
import type { RevitHealthLabels } from "@/components/tools/revit-health-check";
import type { ToolContent } from "@/lib/tools-content/types";

// Revit model health check — es / pt / en. The thresholds table is built from
// HEALTH_THRESHOLDS so the page and the scoring never disagree. They are
// Zeist's reference values for a first reading, not an Autodesk standard; the
// page says so. Revit facts: warnings export from Manage › Warnings (HTML);
// Manage Links lists linked CAD only, so a visible CAD missing there is imported.

const T = HEALTH_THRESHOLDS;

function thresholdRows(names: Record<HealthIndicator, string>, mb: string): string[][] {
  const unit = (id: HealthIndicator, v: number) => (id === "fileSize" ? `${v} ${mb}` : String(v));
  return (Object.keys(T) as HealthIndicator[]).map((id) => [
    names[id],
    `≤ ${unit(id, T[id][0])}`,
    `≤ ${unit(id, T[id][1])}`,
    `> ${unit(id, T[id][1])}`,
  ]);
}

const names: Record<Locale, Record<HealthIndicator, string>> = {
  es: { warnings: "Advertencias", fileSize: "Tamaño del archivo", importedCad: "CAD importados", inPlace: "Familias in situ" },
  pt: { warnings: "Advertências", fileSize: "Tamanho do arquivo", importedCad: "CAD importados", inPlace: "Famílias no local" },
  en: { warnings: "Warnings", fileSize: "File size", importedCad: "Imported CAD", inPlace: "In-place families" },
};

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Diagnóstico de modelo Revit: advertencias y peso",
    metaDescription:
      "Revisa la salud de tu modelo de Revit: carga el reporte de advertencias, anota el peso, los CAD importados y las familias in situ, y mira qué corregir primero.",
    keywords: [
      "revit lento",
      "advertencias revit",
      "modelo revit pesado",
      "auditoría de modelo revit",
      "optimizar modelo revit",
      "revit warnings",
    ],
    name: "Diagnóstico de modelo Revit",
    eyebrow: "Herramienta gratuita · Revit",
    h1: "Diagnóstico de salud de un modelo de Revit: advertencias, peso, CAD y familias",
    intro:
      "Carga el reporte de advertencias que exporta Revit y anota tres datos del modelo. Recibes una puntuación de 0 a 100, el estado de cada indicador y qué corregir primero.",
    badges: ["Gratis y sin registro", "Lee el reporte de advertencias", "El archivo no sale del navegador"],
    calculatorTitle: "Diagnosticar un modelo de Revit",
    answer:
      "Un modelo de Revit se degrada por causas que se pueden medir: advertencias acumuladas, el tamaño del archivo, CAD importados en lugar de vinculados y familias in situ. Esta herramienta lee el reporte de advertencias que Revit exporta desde Gestionar › Advertencias, agrupa las advertencias por tipo, compara cada indicador con referencias de Zeist y te dice qué atacar primero. Es una primera lectura de dos minutos, no una auditoría completa.",
    sections: [
      {
        id: "como-usar",
        title: "Cómo usarla",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "En Revit, abre **Gestionar › Advertencias** y pulsa **Exportar**. Revit guarda un archivo HTML con todas las advertencias del modelo.",
              "Carga ese archivo aquí. La herramienta las cuenta y las agrupa por tipo, sin subirlo a ningún servidor.",
              "Anota el tamaño del archivo .rvt y, si los conoces, cuántos CAD importados y cuántas familias in situ tiene. Lo que no sepas, déjalo vacío: la puntuación usa solo lo que ingreses.",
              "Lee la puntuación y empieza por el indicador en rojo.",
            ],
          },
          {
            type: "p",
            text: "Un CAD importado no aparece en **Gestionar vínculos**, que solo lista los vinculados: si ves un CAD en el modelo y no está en esa lista, está importado.",
          },
        ],
      },
      {
        id: "puntuacion",
        title: "Cómo se calcula la puntuación",
        blocks: [
          {
            type: "table",
            head: ["Indicador", "Bien", "Revisar", "Crítico"],
            rows: thresholdRows(names.es, "MB"),
          },
          {
            type: "p",
            text: "Cada indicador suma 100, 50 o 0 puntos y la puntuación es el promedio de los que ingresaste. Son **referencias de Zeist para una primera lectura, no una norma de Autodesk**: un hospital pesa más que una vivienda. Lo que más dice es la tendencia del mismo modelo medido cada semana, y eso se puede automatizar: lo contamos en [auditoría automática de modelos Revit](/es/blog/auditoria-automatica-modelos-revit).",
          },
        ],
      },
      {
        id: "que-corregir",
        title: "Qué corregir primero",
        blocks: [
          {
            type: "list",
            items: [
              "**Advertencias:** casi siempre dos o tres tipos concentran la mayoría. La herramienta te muestra cuáles: corrige esos primero. Entre los más comunes están los muros superpuestos y los elementos idénticos en el mismo lugar, que además cuentan doble en las tablas.",
              "**CAD importados:** bórralos y vincúlalos, solo en las vistas que los necesitan. Importar trae todas las capas y líneas del dibujo al modelo.",
              "**Familias in situ:** pásalas a familias cargables cuando se repiten. Cada copia de una familia in situ es una familia distinta.",
              "**Tamaño del archivo:** purga lo que no se usa y guarda con la opción de compactar el archivo.",
            ],
          },
          {
            type: "p",
            text: "Explicamos cada causa en [Revit lento y modelos pesados](/es/blog/revit-lento-modelo-pesado-auditoria).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Auditoría BIM",
      title: "¿Salió en riesgo? Lo revisamos contigo.",
      body: "En la auditoría de procesos BIM, remota y de 4 semanas, revisamos tus modelos con herramientas automáticas y dejamos un plan para corregirlos. Si quieres, después los medimos cada noche con un plugin a medida.",
      prefill: "Hola Zeist. Vengo del diagnóstico de modelo de Revit. Quiero revisar la salud de nuestros modelos.",
      secondaryLabel: "Ver auditoría de procesos BIM",
      secondaryPath: "servicios/auditoria-procesos-bim",
    },
    faqs: [
      {
        q: "¿Cómo exporto las advertencias de un modelo de Revit?",
        a: "En la pestaña Gestionar, abre Advertencias y pulsa Exportar. Revit guarda un archivo HTML con cada advertencia y los elementos que involucra, con sus identificadores. Ese archivo es el que lee esta herramienta.",
      },
      {
        q: "¿Cuántas advertencias es normal tener en Revit?",
        a: "No hay un número oficial de Autodesk: depende del tamaño y del tipo de proyecto. Como primera lectura, Zeist toma hasta 200 como bien y más de 1000 como crítico. Más útil que el número de un día es ver si sube de una semana a otra.",
      },
      {
        q: "¿Por qué mi modelo de Revit pesa tanto?",
        a: "Las causas más frecuentes son CAD importados en lugar de vinculados, familias in situ copiadas muchas veces, vistas y familias que ya no se usan, y advertencias acumuladas. Purgar, vincular los CAD y pasar las familias in situ a familias cargables suele bajar el peso.",
      },
      {
        q: "¿Cómo sé si un CAD está importado o vinculado?",
        a: "Abre Gestionar vínculos: en la pestaña de formatos CAD solo aparecen los vinculados. Si ves un CAD en el modelo y no está en esa lista, está importado. Conviene borrarlo y vincularlo, solo en las vistas que lo necesitan.",
      },
      {
        q: "¿Se sube mi archivo a algún servidor?",
        a: "No. El reporte de advertencias se lee en tu navegador y nada sale de tu computadora. Tampoco hace falta el archivo .rvt: solo el HTML que exporta Revit y los números que anotes.",
      },
    ],
    guides: [
      "revit-lento-modelo-pesado-auditoria",
      "auditoria-automatica-modelos-revit",
      "auditoria-bim-checklist-empresa",
      "mejores-plugins-revit",
      "automatizar-tareas-revit-dynamo-plugins",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Diagnóstico de modelo Revit: advertências e peso",
    metaDescription:
      "Confira a saúde do seu modelo do Revit: carregue o relatório de advertências, anote o peso, os CAD importados e as famílias no local, e veja o que corrigir.",
    keywords: [
      "revit lento",
      "advertências revit",
      "modelo revit pesado",
      "auditoria de modelo revit",
      "otimizar modelo revit",
      "revit warnings",
    ],
    name: "Diagnóstico de modelo Revit",
    eyebrow: "Ferramenta gratuita · Revit",
    h1: "Diagnóstico de saúde de um modelo do Revit: advertências, peso, CAD e famílias",
    intro:
      "Carregue o relatório de advertências que o Revit exporta e anote três dados do modelo. Você recebe uma pontuação de 0 a 100, o estado de cada indicador e o que corrigir primeiro.",
    badges: ["Grátis e sem cadastro", "Lê o relatório de advertências", "O arquivo não sai do navegador"],
    calculatorTitle: "Diagnosticar um modelo do Revit",
    answer:
      "Um modelo do Revit se degrada por causas que dá para medir: advertências acumuladas, o tamanho do arquivo, CAD importados em vez de vinculados e famílias no local. Esta ferramenta lê o relatório de advertências que o Revit exporta em Gerenciar › Advertências, agrupa as advertências por tipo, compara cada indicador com referências da Zeist e diz o que atacar primeiro. É uma primeira leitura de dois minutos, não uma auditoria completa.",
    sections: [
      {
        id: "como-usar",
        title: "Como usar",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "No Revit, abra **Gerenciar › Advertências** e clique em **Exportar**. O Revit salva um arquivo HTML com todas as advertências do modelo.",
              "Carregue esse arquivo aqui. A ferramenta as conta e agrupa por tipo, sem enviá-lo a nenhum servidor.",
              "Anote o tamanho do arquivo .rvt e, se souber, quantos CAD importados e quantas famílias no local ele tem. O que não souber, deixe vazio: a pontuação usa só o que você informar.",
              "Leia a pontuação e comece pelo indicador em vermelho.",
            ],
          },
          {
            type: "p",
            text: "Um CAD importado não aparece em **Gerenciar vínculos**, que lista só os vinculados: se você vê um CAD no modelo e ele não está nessa lista, está importado.",
          },
        ],
      },
      {
        id: "pontuacao",
        title: "Como a pontuação é calculada",
        blocks: [
          {
            type: "table",
            head: ["Indicador", "Bom", "Revisar", "Crítico"],
            rows: thresholdRows(names.pt, "MB"),
          },
          {
            type: "p",
            text: "Cada indicador soma 100, 50 ou 0 pontos e a pontuação é a média dos que você informou. São **referências da Zeist para uma primeira leitura, não uma norma da Autodesk**: um hospital pesa mais que uma casa. O que mais diz é a tendência do mesmo modelo medido toda semana, e isso dá para automatizar: contamos em [auditoria automática de modelos Revit](/pt/blog/auditoria-automatica-modelos-revit).",
          },
        ],
      },
      {
        id: "o-que-corrigir",
        title: "O que corrigir primeiro",
        blocks: [
          {
            type: "list",
            items: [
              "**Advertências:** quase sempre dois ou três tipos concentram a maioria. A ferramenta mostra quais: corrija esses primeiro. Entre os mais comuns estão as paredes sobrepostas e os elementos idênticos no mesmo lugar, que ainda contam em dobro nas tabelas.",
              "**CAD importados:** apague e vincule, só nas vistas que precisam deles. Importar traz todas as camadas e linhas do desenho para o modelo.",
              "**Famílias no local:** passe para famílias carregáveis quando se repetem. Cada cópia de uma família no local é uma família diferente.",
              "**Tamanho do arquivo:** limpe o que não é usado e salve com a opção de compactar o arquivo.",
            ],
          },
          {
            type: "p",
            text: "Explicamos cada causa em [Revit lento e modelos pesados](/pt/blog/revit-lento-modelo-pesado).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Auditoria BIM",
      title: "Deu em risco? Revisamos com você.",
      body: "Na auditoria de processos BIM, remota e de 4 semanas, revisamos seus modelos com ferramentas automáticas e deixamos um plano para corrigi-los. Se quiser, depois os medimos toda noite com um plugin sob medida.",
      prefill: "Olá Zeist. Vim do diagnóstico de modelo do Revit. Quero revisar a saúde dos nossos modelos.",
      secondaryLabel: "Ver auditoria BIM",
      secondaryPath: "servicios/auditoria-procesos-bim",
    },
    faqs: [
      {
        q: "Como exportar as advertências de um modelo do Revit?",
        a: "Na guia Gerenciar, abra Advertências e clique em Exportar. O Revit salva um arquivo HTML com cada advertência e os elementos envolvidos, com seus identificadores. É esse arquivo que esta ferramenta lê.",
      },
      {
        q: "Quantas advertências é normal ter no Revit?",
        a: "Não há um número oficial da Autodesk: depende do tamanho e do tipo de projeto. Como primeira leitura, a Zeist considera até 200 como bom e mais de 1000 como crítico. Mais útil que o número de um dia é ver se ele sobe de uma semana para outra.",
      },
      {
        q: "Por que meu modelo do Revit está tão pesado?",
        a: "As causas mais frequentes são CAD importados em vez de vinculados, famílias no local copiadas muitas vezes, vistas e famílias que não são mais usadas, e advertências acumuladas. Limpar, vincular os CAD e passar as famílias no local para famílias carregáveis costuma reduzir o peso.",
      },
      {
        q: "Como saber se um CAD está importado ou vinculado?",
        a: "Abra Gerenciar vínculos: na guia de formatos CAD aparecem só os vinculados. Se você vê um CAD no modelo e ele não está nessa lista, está importado. Convém apagá-lo e vinculá-lo, só nas vistas que precisam dele.",
      },
      {
        q: "Meu arquivo é enviado para algum servidor?",
        a: "Não. O relatório de advertências é lido no seu navegador e nada sai do seu computador. Também não é preciso o arquivo .rvt: só o HTML que o Revit exporta e os números que você anotar.",
      },
    ],
    guides: [
      "revit-lento-modelo-pesado-auditoria",
      "auditoria-automatica-modelos-revit",
      "auditoria-bim-checklist-empresa",
      "mejores-plugins-revit",
      "automatizar-tareas-revit-dynamo-plugins",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "Revit Model Health Check: Warnings and File Size",
    metaDescription:
      "Check your Revit model's health: load the warnings report, enter the file size, imported CAD and in-place families, and see what to fix first.",
    keywords: [
      "revit model health check",
      "revit warnings",
      "slow revit model",
      "revit file size too large",
      "revit model audit",
      "optimize revit model",
    ],
    name: "Revit model health check",
    eyebrow: "Free tool · Revit",
    h1: "Revit model health check: warnings, file size, CAD and families",
    intro:
      "Load the warnings report Revit exports and enter three figures from the model. You get a score from 0 to 100, the status of each indicator and what to fix first.",
    badges: ["Free, no sign-up", "Reads the warnings report", "The file never leaves your browser"],
    calculatorTitle: "Check a Revit model",
    answer:
      "A Revit model degrades for reasons you can measure: accumulated warnings, file size, CAD imported instead of linked, and in-place families. This tool reads the warnings report Revit exports from Manage › Warnings, groups the warnings by type, compares each indicator with Zeist's reference values and tells you what to tackle first. It's a two-minute first read, not a full audit.",
    sections: [
      {
        id: "how-to-use",
        title: "How to use it",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "In Revit, open **Manage › Warnings** (Inquiry panel) and click **Export**. Revit saves an HTML file with every warning in the model.",
              "Load that file here. The tool counts and groups the warnings by type without uploading anything.",
              "Enter the .rvt file size and, if you know them, how many imported CAD files and in-place families it has. Leave blank what you don't know: the score only uses what you enter.",
              "Read the score and start with the indicator in red.",
            ],
          },
          {
            type: "p",
            text: "An imported CAD file doesn't show up in **Manage Links**, which lists linked files only: if you can see a CAD file in the model and it isn't on that list, it was imported.",
          },
        ],
      },
      {
        id: "score",
        title: "How the score is calculated",
        blocks: [
          {
            type: "table",
            head: ["Indicator", "Good", "Review", "Critical"],
            rows: thresholdRows(names.en, "MB"),
          },
          {
            type: "p",
            text: "Each indicator scores 100, 50 or 0 points and the score is the average of the ones you entered. These are **Zeist's reference values for a first read, not an Autodesk standard**: a hospital weighs more than a house. What tells you most is the trend of the same model measured every week, and that can be automated: see [overnight Revit model checking](/en/blog/overnight-revit-model-checking).",
          },
        ],
      },
      {
        id: "what-to-fix",
        title: "What to fix first",
        blocks: [
          {
            type: "list",
            items: [
              "**Warnings:** two or three types almost always account for most of them. The tool shows you which: fix those first. Among the most common are overlapping walls and identical instances in the same place, which also double-count in schedules.",
              "**Imported CAD:** delete it and link it instead, only in the views that need it. Importing brings every layer and line of the drawing into the model.",
              "**In-place families:** turn them into loadable families when they repeat. Every copy of an in-place family is a separate family.",
              "**File size:** purge what isn't used and save with the compact file option.",
            ],
          },
          {
            type: "p",
            text: "We cover each cause in [slow Revit models](/en/blog/slow-revit-model).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "BIM audit",
      title: "Did it come out at risk? We'll review it with you.",
      body: "In our BIM process audit, remote and four weeks long, we check your models with automated tools and leave a plan to fix them. If you want, we then measure them every night with a custom plugin.",
      prefill: "Hi Zeist. I'm coming from the Revit model health check. I'd like to review the health of our models.",
      secondaryLabel: "See BIM audit services",
      secondaryPath: "servicios/auditoria-procesos-bim",
    },
    faqs: [
      {
        q: "How do you export the warnings from a Revit model?",
        a: "On the Manage tab, open Warnings and click Export. Revit saves an HTML file with each warning and the elements involved, with their IDs. That's the file this tool reads.",
      },
      {
        q: "How many warnings are normal in Revit?",
        a: "Autodesk doesn't publish an official number: it depends on the size and type of project. As a first read, Zeist treats up to 200 as good and over 1,000 as critical. More useful than one day's count is whether it goes up from one week to the next.",
      },
      {
        q: "Why is my Revit file so large?",
        a: "The usual causes are CAD imported instead of linked, in-place families copied many times, views and families no longer in use, and accumulated warnings. Purging, linking CAD and turning in-place families into loadable families usually brings the size down.",
      },
      {
        q: "How do you tell if a CAD file is imported or linked?",
        a: "Open Manage Links: the CAD Formats tab lists linked files only. If you can see a CAD file in the model and it isn't on that list, it was imported. Delete it and link it instead, only in the views that need it.",
      },
      {
        q: "Is my file uploaded anywhere?",
        a: "No. The warnings report is read in your browser and nothing leaves your computer. You don't need the .rvt file either: just the HTML Revit exports and the figures you enter.",
      },
    ],
    guides: [
      "revit-lento-modelo-pesado-auditoria",
      "auditoria-automatica-modelos-revit",
      "auditoria-bim-checklist-empresa",
      "mejores-plugins-revit",
      "automatizar-tareas-revit-dynamo-plugins",
    ],
  },
};

const advice: Record<Locale, Record<HealthIndicator, Record<HealthLevel, string>>> = {
  es: {
    warnings: {
      good: "Pocas advertencias. Revísalas en cada entrega para que no se acumulen.",
      fair: "Ataca primero los dos o tres tipos más repetidos de la lista: suelen concentrar la mayoría.",
      poor: "Demasiadas advertencias: el modelo se vuelve inestable. Empieza por los tipos más repetidos de la lista.",
    },
    fileSize: {
      good: "Tamaño razonable. Purga lo que no se usa antes de cada entrega.",
      fair: "Purga familias y vistas sin uso, compacta al guardar y revisa qué se importó.",
      poor: "Archivo pesado: busca CAD importados, familias in situ y vistas sin uso, y considera dividir el modelo con vínculos.",
    },
    importedCad: {
      good: "Sin CAD importados. Sigue vinculándolos en lugar de importarlos.",
      fair: "Reemplaza los CAD importados por vínculos, solo en las vistas que los necesitan.",
      poor: "Varios CAD importados: es la causa más frecuente de modelos pesados. Bórralos y vincúlalos.",
    },
    inPlace: {
      good: "Pocas familias in situ. Úsalas solo para piezas únicas.",
      fair: "Convierte en familias cargables las que se repiten.",
      poor: "Demasiadas familias in situ: cada copia es una familia distinta. Pásalas a familias cargables.",
    },
  },
  pt: {
    warnings: {
      good: "Poucas advertências. Revise-as a cada entrega para que não se acumulem.",
      fair: "Ataque primeiro os dois ou três tipos mais repetidos da lista: costumam concentrar a maioria.",
      poor: "Advertências demais: o modelo fica instável. Comece pelos tipos mais repetidos da lista.",
    },
    fileSize: {
      good: "Tamanho razoável. Limpe o que não é usado antes de cada entrega.",
      fair: "Limpe famílias e vistas sem uso, compacte ao salvar e veja o que foi importado.",
      poor: "Arquivo pesado: procure CAD importados, famílias no local e vistas sem uso, e considere dividir o modelo com vínculos.",
    },
    importedCad: {
      good: "Sem CAD importados. Continue vinculando em vez de importar.",
      fair: "Troque os CAD importados por vínculos, só nas vistas que precisam deles.",
      poor: "Vários CAD importados: é a causa mais frequente de modelos pesados. Apague-os e vincule-os.",
    },
    inPlace: {
      good: "Poucas famílias no local. Use-as só para peças únicas.",
      fair: "Converta em famílias carregáveis as que se repetem.",
      poor: "Famílias no local demais: cada cópia é uma família diferente. Passe-as para famílias carregáveis.",
    },
  },
  en: {
    warnings: {
      good: "Few warnings. Review them at every deliverable so they don't pile up.",
      fair: "Tackle the two or three most repeated types on the list first: they usually account for most.",
      poor: "Too many warnings: the model becomes unstable. Start with the most repeated types on the list.",
    },
    fileSize: {
      good: "Reasonable size. Purge unused content before every deliverable.",
      fair: "Purge unused families and views, compact on save and check what was imported.",
      poor: "Heavy file: look for imported CAD, in-place families and unused views, and consider splitting the model with links.",
    },
    importedCad: {
      good: "No imported CAD. Keep linking instead of importing.",
      fair: "Replace imported CAD with links, only in the views that need them.",
      poor: "Several imported CAD files: the most common cause of heavy models. Delete them and link them instead.",
    },
    inPlace: {
      good: "Few in-place families. Keep them for one-off pieces.",
      fair: "Turn the ones that repeat into loadable families.",
      poor: "Too many in-place families: every copy is a separate family. Move them to loadable families.",
    },
  },
};

const labels: Record<Locale, RevitHealthLabels> = {
  es: {
    reportTitle: "1. Reporte de advertencias",
    reportHint: "En Revit: Gestionar › Advertencias › Exportar. Guarda el HTML y cárgalo aquí.",
    reportButton: "Cargar reporte .html",
    reportLoaded: "{total} advertencias de {types} tipos, en {elements} elementos.",
    reportEmpty: "No se encontraron advertencias en el archivo. ¿Es el HTML que exporta Revit?",
    numbersTitle: "2. Datos del modelo",
    fields: {
      warnings: { label: names.es.warnings, hint: "Se llena sola al cargar el reporte." },
      fileSize: { label: "Tamaño del archivo .rvt", hint: "Míralo en el explorador de archivos.", unit: "MB" },
      importedCad: { label: names.es.importedCad, hint: "Los que se ven en el modelo y no aparecen en Gestionar vínculos. Si no lo sabes, déjalo vacío." },
      inPlace: { label: names.es.inPlace, hint: "Modeladas dentro del proyecto. Si no lo sabes, déjalo vacío." },
    },
    results: "Diagnóstico",
    score: "puntuación",
    bands: { good: "Sano", fair: "Mejorable", poor: "En riesgo" },
    levels: { good: "Bien", fair: "Revisar", poor: "Crítico" },
    thresholds: "Referencia de Zeist: bien hasta {good}, revisar hasta {fair}.",
    advice: advice.es,
    topWarnings: "Tipos de advertencia más repetidos",
    occurrences: "{n}×",
    empty: "Carga el reporte o escribe al menos un dato para ver el diagnóstico.",
    note: "Referencias de Zeist para una primera lectura, no una norma de Autodesk. El reporte se procesa en tu navegador: no se sube a ningún servidor.",
  },
  pt: {
    reportTitle: "1. Relatório de advertências",
    reportHint: "No Revit: Gerenciar › Advertências › Exportar. Salve o HTML e carregue aqui.",
    reportButton: "Carregar relatório .html",
    reportLoaded: "{total} advertências de {types} tipos, em {elements} elementos.",
    reportEmpty: "Nenhuma advertência encontrada no arquivo. É o HTML que o Revit exporta?",
    numbersTitle: "2. Dados do modelo",
    fields: {
      warnings: { label: names.pt.warnings, hint: "Preenchido sozinho ao carregar o relatório." },
      fileSize: { label: "Tamanho do arquivo .rvt", hint: "Veja no explorador de arquivos.", unit: "MB" },
      importedCad: { label: names.pt.importedCad, hint: "Os que aparecem no modelo e não estão em Gerenciar vínculos. Se não souber, deixe vazio." },
      inPlace: { label: names.pt.inPlace, hint: "Modeladas dentro do projeto. Se não souber, deixe vazio." },
    },
    results: "Diagnóstico",
    score: "pontuação",
    bands: { good: "Saudável", fair: "A melhorar", poor: "Em risco" },
    levels: { good: "Bom", fair: "Revisar", poor: "Crítico" },
    thresholds: "Referência da Zeist: bom até {good}, revisar até {fair}.",
    advice: advice.pt,
    topWarnings: "Tipos de advertência mais repetidos",
    occurrences: "{n}×",
    empty: "Carregue o relatório ou informe ao menos um dado para ver o diagnóstico.",
    note: "Referências da Zeist para uma primeira leitura, não uma norma da Autodesk. O relatório é processado no seu navegador: não é enviado a nenhum servidor.",
  },
  en: {
    reportTitle: "1. Warnings report",
    reportHint: "In Revit: Manage › Warnings › Export. Save the HTML and load it here.",
    reportButton: "Load .html report",
    reportLoaded: "{total} warnings of {types} types, on {elements} elements.",
    reportEmpty: "No warnings found in the file. Is it the HTML Revit exports?",
    numbersTitle: "2. Model figures",
    fields: {
      warnings: { label: names.en.warnings, hint: "Fills in when you load the report." },
      fileSize: { label: ".rvt file size", hint: "Check it in your file explorer.", unit: "MB" },
      importedCad: { label: names.en.importedCad, hint: "Visible in the model but missing from Manage Links. Leave blank if you don't know." },
      inPlace: { label: names.en.inPlace, hint: "Modeled inside the project. Leave blank if you don't know." },
    },
    results: "Diagnosis",
    score: "score",
    bands: { good: "Healthy", fair: "Needs work", poor: "At risk" },
    levels: { good: "Good", fair: "Review", poor: "Critical" },
    thresholds: "Zeist reference: good up to {good}, review up to {fair}.",
    advice: advice.en,
    topWarnings: "Most repeated warning types",
    occurrences: "{n}×",
    empty: "Load the report or enter at least one figure to see the diagnosis.",
    note: "Zeist reference values for a first read, not an Autodesk standard. The report is processed in your browser: it isn't uploaded anywhere.",
  },
};

export function getRevitHealthContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getRevitHealthLabels(locale: Locale): RevitHealthLabels {
  return labels[locale];
}
