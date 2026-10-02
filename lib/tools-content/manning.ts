import type { Locale } from "@/lib/i18n";
import { ROUGHNESS, type RoughnessId } from "@/lib/tools/manning";
import { NUMBER_STYLES, formatNumber } from "@/lib/tools/number";
import type { ManningLabels } from "@/components/tools/manning-calculator";
import type { ToolContent } from "@/lib/tools-content/types";

// Manning's equation calculator — es / pt / en. The worked example matches the
// calculator's defaults (200 mm PVC, S = 1 %, Q = 15 L/s) and the values are
// covered by scripts/test-tools.mjs; change them together.

const roughnessLabels: Record<Locale, Record<RoughnessId, string>> = {
  es: {
    pvc: "PVC o polietileno (HDPE) liso",
    "concrete-pipe": "Tubería de concreto",
    "cast-iron": "Hierro fundido o dúctil",
    "corrugated-metal": "Tubería de metal corrugado",
    "concrete-channel": "Canal de concreto frotachado",
    masonry: "Mampostería de piedra",
    "earth-clean": "Canal en tierra, limpio",
    "earth-grass": "Canal en tierra con pasto corto",
    rock: "Canal excavado en roca",
    "natural-stream": "Cauce natural limpio",
  },
  pt: {
    pvc: "PVC ou PEAD liso",
    "concrete-pipe": "Tubo de concreto",
    "cast-iron": "Ferro fundido ou dúctil",
    "corrugated-metal": "Tubo de metal corrugado",
    "concrete-channel": "Canal de concreto desempenado",
    masonry: "Alvenaria de pedra",
    "earth-clean": "Canal em terra, limpo",
    "earth-grass": "Canal em terra com grama baixa",
    rock: "Canal escavado em rocha",
    "natural-stream": "Curso d'água natural limpo",
  },
  en: {
    pvc: "PVC or smooth HDPE",
    "concrete-pipe": "Concrete pipe",
    "cast-iron": "Cast or ductile iron",
    "corrugated-metal": "Corrugated metal pipe",
    "concrete-channel": "Concrete channel, float finish",
    masonry: "Cemented rubble masonry",
    "earth-clean": "Earth channel, clean",
    "earth-grass": "Earth channel, short grass",
    rock: "Rock cut",
    "natural-stream": "Natural stream, clean",
  },
};

function roughnessRows(locale: Locale): string[][] {
  const f = (x: number) => formatNumber(x, 3, NUMBER_STYLES[locale]);
  return ROUGHNESS.map((r) => [roughnessLabels[locale][r.id], f(r.n), `${f(r.min)} – ${f(r.max)}`]);
}

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Calculadora de Manning: tuberías y canales",
    metaDescription:
      "Calcula caudal, velocidad y tirante normal con la fórmula de Manning en tuberías parcialmente llenas y canales, con Froude, tensión tractiva y tabla de n.",
    keywords: [
      "calculadora manning",
      "fórmula de manning",
      "calculadora manning tuberías",
      "calculadora manning canales",
      "tirante normal",
      "tubería parcialmente llena",
      "coeficiente de manning",
    ],
    name: "Calculadora de Manning",
    eyebrow: "Herramienta gratuita · Hidráulica",
    h1: "Calculadora de Manning para tuberías y canales",
    intro:
      "Calcula el caudal, la velocidad o el tirante normal con la fórmula de Manning en tuberías circulares que trabajan parcialmente llenas y en canales rectangulares, trapezoidales y triangulares. Con número de Froude, tensión tractiva y unidades SI o US.",
    badges: ["Gratis y sin registro", "Tuberías y canales", "SI y unidades US"],
    calculatorTitle: "Calculadora de la fórmula de Manning",
    answer:
      "La fórmula de Manning calcula la velocidad del agua en flujo uniforme con superficie libre: V = (1/n) · R^(2/3) · S^(1/2), donde n es el coeficiente de rugosidad del material, R el radio hidráulico (área mojada entre perímetro mojado) y S la pendiente. El caudal es Q = V · A. Se usa para diseñar alcantarillado, drenaje pluvial y canales; no aplica a tuberías a presión, que se calculan con Hazen-Williams o Darcy-Weisbach.",
    sections: [
      {
        id: "formula",
        title: "La fórmula de Manning",
        blocks: [
          { type: "formula", text: "V = (1/n) · R^(2/3) · S^(1/2)" },
          { type: "formula", text: "Q = V · A" },
          {
            type: "list",
            items: [
              "**V:** velocidad media (m/s).",
              "**n:** coeficiente de rugosidad de Manning; depende del material.",
              "**R:** radio hidráulico = A / P, en metros (A: área mojada; P: perímetro mojado).",
              "**S:** pendiente de la solera o de la tubería (m/m).",
              "**Q:** caudal (m³/s).",
            ],
          },
          {
            type: "formula",
            text: "V = (1.49/n) · R^(2/3) · S^(1/2)",
            note: "La misma fórmula en unidades US (pies y segundos). La calculadora trabaja en SI y convierte, así que puedes usar cualquiera de los dos sistemas.",
          },
        ],
      },
      {
        id: "coeficiente-n",
        title: "Coeficiente n de Manning por material",
        blocks: [
          {
            type: "p",
            text: "Valores típicos de diseño. El rango refleja el estado de la superficie: usa el extremo alto para superficies envejecidas, con juntas o con sedimentos.",
          },
          {
            type: "table",
            head: ["Material o superficie", "n típico", "Rango"],
            numeric: [false, true, true],
            rows: roughnessRows("es"),
          },
          {
            type: "p",
            text: "Referencia: Ven Te Chow, Open-Channel Hydraulics (1959); para PVC y polietileno, valores habituales de fabricantes. Si la norma de tu país fija un n de diseño, usa ese.",
          },
        ],
      },
      {
        id: "tuberia-parcialmente-llena",
        title: "Tubería parcialmente llena: el caudal máximo no es a tubo lleno",
        blocks: [
          {
            type: "p",
            text: "En una tubería circular, el caudal máximo se da con un tirante de alrededor del **94 % del diámetro** y es cerca de **7.6 % mayor** que el caudal a tubo lleno. La velocidad máxima ocurre hacia el 81 % del diámetro. La razón: cerca de la clave el perímetro mojado crece más rápido que el área, y el radio hidráulico cae.",
          },
          {
            type: "p",
            text: "Por eso, entre el caudal a tubo lleno y el máximo hay dos tirantes posibles para el mismo caudal. La calculadora devuelve el menor, que es el de diseño, y te avisa si el caudal supera el máximo: en ese caso el tubo trabajaría a presión y Manning ya no aplica.",
          },
        ],
      },
      {
        id: "ejemplo",
        title: "Ejemplo: colector de PVC de 200 mm",
        blocks: [
          {
            type: "p",
            text: "Un colector de PVC (n = 0.010) de 200 mm con 1 % de pendiente debe conducir 15 L/s. ¿Con qué tirante y velocidad trabaja?",
          },
          {
            type: "list",
            items: [
              "Caudal a tubo lleno: **42.6 L/s**, así que trabaja al 35 % de su capacidad.",
              "Tirante normal: **82 mm**, es decir, y/D = 0.41.",
              "Velocidad: **1.24 m/s**.",
              "Tensión tractiva: **4.28 Pa**.",
              "Número de Froude: **1.59**, flujo supercrítico, habitual en colectores pequeños con pendiente.",
            ],
          },
          { type: "p", text: "Son los valores que trae cargados la calculadora: cámbialos por los de tu tramo." },
        ],
      },
      {
        id: "criterios",
        title: "Criterios de diseño habituales en alcantarillado",
        blocks: [
          {
            type: "p",
            text: "Manning da la hidráulica; la norma de cada país fija los límites. Como referencia, la norma peruana OS.070 pide:",
          },
          {
            type: "list",
            items: [
              "Una tensión tractiva media de al menos **1.0 Pa** en cada tramo, para que el flujo arrastre los sólidos.",
              "Un tirante máximo del **75 % del diámetro**.",
              "Una velocidad máxima de **5 m/s**.",
            ],
          },
          {
            type: "p",
            text: "Verifica siempre con la versión vigente de la norma y con los requisitos de la empresa de saneamiento. Si diseñas la red en Civil 3D, mira cómo [modelar redes de tuberías con sus accesorios](/es/blog/redes-tuberias-civil-3d-accesorios).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Del cálculo al modelo",
      title: "¿Diseñas redes completas? Automatizamos el dibujo en Civil 3D.",
      body: "Desarrollamos plugins que convierten tu trazo en una red 3D de tuberías con sus accesorios (codos, tees y yees) y la revisan con tus criterios de diseño, para agua, desagüe y drenaje.",
      prefill:
        "Hola Zeist. Vengo de la calculadora de Manning. Me interesa automatizar el diseño de redes de tuberías en Civil 3D.",
      secondaryLabel: "Ver plugins a medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "¿Qué es el coeficiente n de Manning?",
        a: "Es un número que representa la rugosidad de la superficie por donde corre el agua: cuanto más alto, más fricción y menos velocidad. Va de unos 0.010 en PVC a 0.035 o más en canales excavados en roca.",
      },
      {
        q: "¿Qué es el radio hidráulico?",
        a: "Es el área mojada dividida entre el perímetro mojado (R = A/P). Mide qué tan eficiente es la sección: con la misma área, más perímetro en contacto con el agua significa más fricción.",
      },
      {
        q: "¿Se puede usar Manning en tuberías a presión?",
        a: "No. Manning es para flujo con superficie libre: canales y tuberías que trabajan parcialmente llenas, como el alcantarillado. Las redes de agua a presión se calculan con Hazen-Williams o Darcy-Weisbach.",
      },
      {
        q: "¿Por qué el caudal máximo de un tubo no es a tubo lleno?",
        a: "Porque cerca de la parte superior el perímetro mojado crece más rápido que el área. El máximo se da hacia el 94 % del diámetro y es cerca de 7.6 % mayor que el caudal a tubo lleno.",
      },
      {
        q: "¿Qué es el tirante normal?",
        a: "Es la profundidad que alcanza el agua cuando el flujo es uniforme: la pendiente, la rugosidad y el caudal están en equilibrio. Es lo que calcula la herramienta en el modo «Tirante normal».",
      },
      {
        q: "¿Qué indica el número de Froude?",
        a: "Compara la velocidad del flujo con la de una onda en la superficie. Con Fr menor que 1 el flujo es subcrítico (tranquilo); con Fr mayor que 1, supercrítico (rápido). Cerca de 1 el flujo es inestable y conviene evitarlo en el diseño.",
      },
    ],
    guides: [
      "drenaje-pluvial-trujillo-civil-3d",
      "redes-tuberias-civil-3d-accesorios",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "automatizar-civil-3d-guia-completa",
      "banco-de-ductos-civil-3d",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Calculadora de Manning: tubulações e canais",
    metaDescription:
      "Calcule vazão, velocidade e lâmina normal com a fórmula de Manning em tubulações parcialmente cheias e canais, com Froude, tensão trativa e tabela de n.",
    keywords: [
      "calculadora manning",
      "fórmula de manning",
      "manning tubulação parcialmente cheia",
      "lâmina normal",
      "coeficiente de manning",
      "dimensionamento de canais",
      "cálculo de vazão manning",
    ],
    name: "Calculadora de Manning",
    eyebrow: "Ferramenta gratuita · Hidráulica",
    h1: "Calculadora de Manning para tubulações e canais",
    intro:
      "Calcule a vazão, a velocidade ou a lâmina normal com a fórmula de Manning em tubulações circulares parcialmente cheias e em canais retangulares, trapezoidais e triangulares. Com número de Froude, tensão trativa e unidades SI ou americanas.",
    badges: ["Grátis e sem cadastro", "Tubulações e canais", "SI e unidades americanas"],
    calculatorTitle: "Calculadora da fórmula de Manning",
    answer:
      "A fórmula de Manning calcula a velocidade da água em escoamento uniforme com superfície livre: V = (1/n) · R^(2/3) · S^(1/2), em que n é o coeficiente de rugosidade do material, R o raio hidráulico (área molhada dividida pelo perímetro molhado) e S a declividade. A vazão é Q = V · A. É usada no projeto de redes de esgoto, drenagem pluvial e canais; não se aplica a tubulações sob pressão, calculadas com Hazen-Williams ou Darcy-Weisbach.",
    sections: [
      {
        id: "formula",
        title: "A fórmula de Manning",
        blocks: [
          { type: "formula", text: "V = (1/n) · R^(2/3) · S^(1/2)" },
          { type: "formula", text: "Q = V · A" },
          {
            type: "list",
            items: [
              "**V:** velocidade média (m/s).",
              "**n:** coeficiente de rugosidade de Manning; depende do material.",
              "**R:** raio hidráulico = A / P, em metros (A: área molhada; P: perímetro molhado).",
              "**S:** declividade do fundo ou da tubulação (m/m).",
              "**Q:** vazão (m³/s).",
            ],
          },
          {
            type: "formula",
            text: "V = (1,49/n) · R^(2/3) · S^(1/2)",
            note: "A mesma fórmula em unidades americanas (pés e segundos). A calculadora trabalha em SI e converte, então você pode usar qualquer um dos dois sistemas.",
          },
        ],
      },
      {
        id: "coeficiente-n",
        title: "Coeficiente n de Manning por material",
        blocks: [
          {
            type: "p",
            text: "Valores típicos de projeto. A faixa reflete o estado da superfície: use o extremo alto para superfícies envelhecidas, com juntas ou com sedimentos.",
          },
          {
            type: "table",
            head: ["Material ou superfície", "n típico", "Faixa"],
            numeric: [false, true, true],
            rows: roughnessRows("pt"),
          },
          {
            type: "p",
            text: "Referência: Ven Te Chow, Open-Channel Hydraulics (1959); para PVC e PEAD, valores usuais de fabricantes. Se a norma do seu projeto fixa um n, use esse.",
          },
        ],
      },
      {
        id: "tubulacao-parcialmente-cheia",
        title: "Tubulação parcialmente cheia: a vazão máxima não é a seção plena",
        blocks: [
          {
            type: "p",
            text: "Em uma tubulação circular, a vazão máxima ocorre com lâmina de cerca de **94 % do diâmetro** e é perto de **7,6 % maior** que a vazão a seção plena. A velocidade máxima ocorre por volta de 81 % do diâmetro. O motivo: perto da geratriz superior, o perímetro molhado cresce mais rápido que a área, e o raio hidráulico cai.",
          },
          {
            type: "p",
            text: "Por isso, entre a vazão a seção plena e a máxima existem duas lâminas possíveis para a mesma vazão. A calculadora devolve a menor, que é a de projeto, e avisa se a vazão passa da máxima: nesse caso o tubo trabalharia sob pressão e Manning deixa de valer.",
          },
        ],
      },
      {
        id: "exemplo",
        title: "Exemplo: coletor de PVC de 200 mm",
        blocks: [
          {
            type: "p",
            text: "Um coletor de PVC (n = 0,010) de 200 mm com declividade de 1 % deve conduzir 15 L/s. Com que lâmina e velocidade ele trabalha?",
          },
          {
            type: "list",
            items: [
              "Vazão a seção plena: **42,6 L/s**; ou seja, trabalha a 35 % da capacidade.",
              "Lâmina normal: **82 mm**, ou y/D = 0,41.",
              "Velocidade: **1,24 m/s**.",
              "Tensão trativa: **4,28 Pa**.",
              "Número de Froude: **1,59**, escoamento supercrítico, comum em coletores pequenos com declividade.",
            ],
          },
          { type: "p", text: "São os valores que a calculadora traz carregados: troque pelos do seu trecho." },
        ],
      },
      {
        id: "criterios",
        title: "Critérios de projeto usuais em redes de esgoto",
        blocks: [
          {
            type: "p",
            text: "Manning dá a hidráulica; a norma define os limites. Como referência, a ABNT NBR 9649 pede:",
          },
          {
            type: "list",
            items: [
              "Tensão trativa média de no mínimo **1,0 Pa** em cada trecho, para garantir a autolimpeza.",
              "Lâmina máxima de **75 % do diâmetro**.",
              "Velocidade final máxima de **5 m/s**.",
            ],
          },
          {
            type: "p",
            text: "Confira sempre a versão vigente da norma e as exigências da concessionária. Se você projeta a rede no Civil 3D, veja como [modelar redes de tubulação com suas conexões](/pt/blog/redes-tuberias-civil-3d-accesorios).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Do cálculo ao modelo",
      title: "Projeta redes completas? Automatizamos o desenho no Civil 3D.",
      body: "Desenvolvemos plugins que transformam o seu traçado em uma rede 3D de tubulações com suas conexões (curvas, tês e junções) e a verificam com os seus critérios de projeto, para água, esgoto e drenagem.",
      prefill:
        "Olá Zeist. Vim da calculadora de Manning. Tenho interesse em automatizar o projeto de redes de tubulação no Civil 3D.",
      secondaryLabel: "Ver plugins sob medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "O que é o coeficiente n de Manning?",
        a: "É um número que representa a rugosidade da superfície por onde a água escoa: quanto mais alto, mais atrito e menos velocidade. Vai de cerca de 0,010 no PVC a 0,035 ou mais em canais escavados em rocha.",
      },
      {
        q: "O que é o raio hidráulico?",
        a: "É a área molhada dividida pelo perímetro molhado (R = A/P). Mede a eficiência da seção: com a mesma área, mais perímetro em contato com a água significa mais atrito.",
      },
      {
        q: "Posso usar Manning em tubulações sob pressão?",
        a: "Não. Manning é para escoamento com superfície livre: canais e tubulações parcialmente cheias, como o esgoto. Redes de água sob pressão são calculadas com Hazen-Williams ou Darcy-Weisbach.",
      },
      {
        q: "Por que a vazão máxima de um tubo não é a seção plena?",
        a: "Porque perto do topo o perímetro molhado cresce mais rápido que a área. A máxima ocorre por volta de 94 % do diâmetro e é cerca de 7,6 % maior que a vazão a seção plena.",
      },
      {
        q: "O que é a lâmina normal?",
        a: "É a profundidade que a água atinge quando o escoamento é uniforme: declividade, rugosidade e vazão estão em equilíbrio. É o que a ferramenta calcula no modo «Lâmina normal».",
      },
      {
        q: "O que indica o número de Froude?",
        a: "Compara a velocidade do escoamento com a de uma onda na superfície. Com Fr menor que 1 o escoamento é subcrítico (fluvial); com Fr maior que 1, supercrítico (torrencial). Perto de 1 ele é instável e convém evitá-lo no projeto.",
      },
    ],
    guides: [
      "redes-tuberias-civil-3d-accesorios",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "automatizar-civil-3d-guia-completa",
      "banco-de-ductos-civil-3d",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "Manning's Equation Calculator: Pipes & Channels",
    metaDescription:
      "Free Manning's equation calculator: discharge, velocity and normal depth for partially full pipes and open channels, with Froude number and n values.",
    keywords: [
      "manning equation calculator",
      "manning's equation calculator",
      "partially full pipe flow calculator",
      "open channel flow calculator",
      "normal depth calculator",
      "manning n values",
      "manning pipe flow calculator",
    ],
    name: "Manning's equation calculator",
    eyebrow: "Free tool · Hydraulics",
    h1: "Manning's equation calculator for pipes and open channels",
    intro:
      "Calculate discharge, velocity or normal depth with Manning's equation for partially full circular pipes and rectangular, trapezoidal and triangular channels. Includes Froude number, boundary shear and SI or US customary units.",
    badges: ["Free, no sign-up", "Pipes and channels", "SI and US units"],
    calculatorTitle: "Manning's equation calculator",
    answer:
      "Manning's equation gives the mean velocity of uniform free-surface flow: V = (1/n) · R^(2/3) · S^(1/2), where n is the roughness coefficient of the material, R the hydraulic radius (flow area divided by wetted perimeter) and S the slope. Discharge is Q = V · A. In US customary units the factor is 1.49 instead of 1. It is used to design sewers, storm drains and channels; it does not apply to pressurized pipes, which use Hazen-Williams or Darcy-Weisbach.",
    sections: [
      {
        id: "equation",
        title: "Manning's equation",
        blocks: [
          { type: "formula", text: "V = (1/n) · R^(2/3) · S^(1/2)" },
          { type: "formula", text: "Q = V · A" },
          {
            type: "list",
            items: [
              "**V:** mean velocity (m/s).",
              "**n:** Manning's roughness coefficient; it depends on the material.",
              "**R:** hydraulic radius = A / P, in metres (A: flow area; P: wetted perimeter).",
              "**S:** slope of the channel bed or pipe (m/m).",
              "**Q:** discharge (m³/s).",
            ],
          },
          {
            type: "formula",
            text: "V = (1.49/n) · R^(2/3) · S^(1/2)",
            note: "The same equation in US customary units (feet and seconds). The calculator works in SI internally and converts, so you can use either system.",
          },
        ],
      },
      {
        id: "manning-n",
        title: "Manning's n values by material",
        blocks: [
          {
            type: "p",
            text: "Typical design values. The range reflects surface condition: use the high end for aged surfaces, joints or sediment.",
          },
          {
            type: "table",
            head: ["Material or surface", "Typical n", "Range"],
            numeric: [false, true, true],
            rows: roughnessRows("en"),
          },
          {
            type: "p",
            text: "Source: Ven Te Chow, Open-Channel Hydraulics (1959); for PVC and HDPE, common manufacturer values. If your governing standard sets a design n, use that one.",
          },
        ],
      },
      {
        id: "partially-full-pipes",
        title: "Partially full pipes: maximum flow is not at full depth",
        blocks: [
          {
            type: "p",
            text: "In a circular pipe, maximum discharge occurs at a depth of about **94 % of the diameter** and is roughly **7.6 % higher** than full-pipe flow. Maximum velocity occurs at about 81 % of the diameter. The reason: near the crown, the wetted perimeter grows faster than the flow area, so the hydraulic radius drops.",
          },
          {
            type: "p",
            text: "That is why, between full-pipe flow and the maximum, the same discharge has two possible depths. The calculator returns the lower one, which is the design depth, and warns you if the discharge exceeds the maximum: the pipe would then flow under pressure and Manning's equation no longer applies.",
          },
        ],
      },
      {
        id: "example",
        title: "Worked example: 200 mm (8 in) PVC sewer",
        blocks: [
          {
            type: "p",
            text: "A 200 mm (about 8 in) PVC sewer (n = 0.010) at 1 % slope must carry 15 L/s (0.53 cfs). At what depth and velocity does it run?",
          },
          {
            type: "list",
            items: [
              "Full-pipe discharge: **42.6 L/s (1.51 cfs)**, so it runs at 35 % of capacity.",
              "Normal depth: **82 mm (3.2 in)**, that is y/D = 0.41.",
              "Velocity: **1.24 m/s (4.06 ft/s)**.",
              "Boundary shear: **4.28 Pa (0.089 lb/ft²)**.",
              "Froude number: **1.59**, supercritical flow, common in small sewers on a slope.",
            ],
          },
          { type: "p", text: "These are the calculator's default inputs: replace them with your own pipe run." },
        ],
      },
      {
        id: "design-criteria",
        title: "Common sewer design criteria",
        blocks: [
          {
            type: "p",
            text: "Manning's equation gives you the hydraulics; your standard sets the limits. As a reference, the Ten States Standards (Recommended Standards for Wastewater Facilities) require sewers to reach at least **2.0 ft/s (0.6 m/s) when flowing full**, computed with n = 0.013.",
          },
          {
            type: "p",
            text: "Standards in Latin America and Brazil often check self-cleansing with a minimum boundary shear of **1.0 Pa** and limit the flow depth to **75 % of the diameter**. Always check the current version of your local standard and utility requirements. If you lay out the network in Civil 3D, see how to [model pipe networks with their fittings](/en/blog/redes-tuberias-civil-3d-accesorios).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "From calculation to model",
      title: "Designing whole networks? We automate the drafting in Civil 3D.",
      body: "We build plugins that turn your layout into a 3D pipe network with its fittings (bends, tees and wyes) and check it against your design criteria, for water, sewer and storm drainage.",
      prefill:
        "Hi Zeist. I came from your Manning calculator. I'm interested in automating pipe network design in Civil 3D.",
      secondaryLabel: "See custom plugins",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "What is Manning's n?",
        a: "A number that represents the roughness of the surface the water flows over: the higher it is, the more friction and the lower the velocity. It ranges from about 0.010 for PVC to 0.035 or more for channels cut in rock.",
      },
      {
        q: "What is the hydraulic radius?",
        a: "The flow area divided by the wetted perimeter (R = A/P). It measures how efficient the section is: for the same area, more perimeter in contact with the water means more friction.",
      },
      {
        q: "Can Manning's equation be used for pressurized pipes?",
        a: "No. Manning's equation is for free-surface flow: channels and partially full pipes such as sewers. Pressurized water mains are designed with Hazen-Williams or Darcy-Weisbach.",
      },
      {
        q: "Why is maximum pipe flow not at full depth?",
        a: "Because near the crown the wetted perimeter grows faster than the flow area. The maximum occurs at about 94 % of the diameter and is roughly 7.6 % higher than full-pipe flow.",
      },
      {
        q: "What is normal depth?",
        a: "The depth the water reaches when flow is uniform: slope, roughness and discharge are in balance. It is what the tool computes in “Normal depth” mode.",
      },
      {
        q: "What does the Froude number tell me?",
        a: "It compares the flow velocity with the speed of a surface wave. Below 1 the flow is subcritical (tranquil); above 1 it is supercritical (rapid). Near 1 the flow is unstable, which designs should avoid.",
      },
    ],
    guides: [
      "redes-tuberias-civil-3d-accesorios",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "automatizar-civil-3d-guia-completa",
      "banco-de-ductos-civil-3d",
    ],
  },
};

const labels: Record<Locale, ManningLabels> = {
  es: {
    units: "Unidades",
    si: "SI",
    us: "US (pies)",
    section: "Sección",
    sections: { circular: "Circular", rectangular: "Rectangular", trapezoidal: "Trapezoidal", triangular: "Triangular" },
    mode: "Calcular",
    modeDepth: "Tirante normal",
    modeFlow: "Caudal",
    diameter: "Diámetro interior",
    width: "Ancho de solera",
    bottomWidth: "Ancho de solera (b)",
    sideSlope: "Talud (z)",
    sideSlopeHint: "Horizontal por cada 1 vertical",
    depth: "Tirante (y)",
    fill: "Tirante relativo (y/D)",
    flow: "Caudal (Q)",
    slope: "Pendiente (S)",
    material: "Material",
    custom: "Otro (n manual)",
    n: "Coeficiente n de Manning",
    roughness: roughnessLabels.es,
    results: "Resultados",
    normalDepth: "Tirante normal",
    relDepth: "y/D =",
    flowResult: "Caudal",
    velocity: "Velocidad",
    froude: "Número de Froude",
    regimeSub: "Subcrítico (tranquilo)",
    regimeCrit: "Cerca del crítico: inestable",
    regimeSuper: "Supercrítico (rápido)",
    noFreeSurface: "Tubo lleno: sin superficie libre",
    shear: "Tensión tractiva",
    area: "Área mojada",
    perimeter: "Perímetro mojado",
    radius: "Radio hidráulico",
    topWidth: "Espejo de agua",
    fullFlow: "Caudal a tubo lleno",
    fullVelocity: "Velocidad a tubo lleno",
    capacity: "Capacidad usada (Q/Qlleno)",
    invalid:
      "Revisa los datos: el diámetro o el ancho, el caudal o el tirante, la pendiente y n deben ser números mayores que cero.",
    surcharged:
      "Con ese caudal el tubo trabajaría lleno, a presión: el máximo con superficie libre es {max}. Aumenta el diámetro o la pendiente.",
    note: "Flujo uniforme con superficie libre. Agua a 1000 kg/m³ y g = 9.81 m/s². En canales, el esquema no está a escala.",
  },
  pt: {
    units: "Unidades",
    si: "SI",
    us: "EUA (pés)",
    section: "Seção",
    sections: { circular: "Circular", rectangular: "Retangular", trapezoidal: "Trapezoidal", triangular: "Triangular" },
    mode: "Calcular",
    modeDepth: "Lâmina normal",
    modeFlow: "Vazão",
    diameter: "Diâmetro interno",
    width: "Largura do fundo",
    bottomWidth: "Largura do fundo (b)",
    sideSlope: "Talude (z)",
    sideSlopeHint: "Horizontal para cada 1 vertical",
    depth: "Lâmina d'água (y)",
    fill: "Lâmina relativa (y/D)",
    flow: "Vazão (Q)",
    slope: "Declividade (S)",
    material: "Material",
    custom: "Outro (n manual)",
    n: "Coeficiente n de Manning",
    roughness: roughnessLabels.pt,
    results: "Resultados",
    normalDepth: "Lâmina normal",
    relDepth: "y/D =",
    flowResult: "Vazão",
    velocity: "Velocidade",
    froude: "Número de Froude",
    regimeSub: "Subcrítico (fluvial)",
    regimeCrit: "Próximo do crítico: instável",
    regimeSuper: "Supercrítico (torrencial)",
    noFreeSurface: "Seção plena: sem superfície livre",
    shear: "Tensão trativa",
    area: "Área molhada",
    perimeter: "Perímetro molhado",
    radius: "Raio hidráulico",
    topWidth: "Largura superficial",
    fullFlow: "Vazão a seção plena",
    fullVelocity: "Velocidade a seção plena",
    capacity: "Capacidade usada (Q/Qplena)",
    invalid:
      "Revise os dados: o diâmetro ou a largura, a vazão ou a lâmina, a declividade e n devem ser números maiores que zero.",
    surcharged:
      "Com essa vazão o tubo trabalharia cheio, sob pressão: o máximo com superfície livre é {max}. Aumente o diâmetro ou a declividade.",
    note: "Escoamento uniforme com superfície livre. Água a 1000 kg/m³ e g = 9,81 m/s². Em canais, o esquema não está em escala.",
  },
  en: {
    units: "Units",
    si: "SI",
    us: "US customary",
    section: "Section",
    sections: { circular: "Circular pipe", rectangular: "Rectangular", trapezoidal: "Trapezoidal", triangular: "Triangular" },
    mode: "Solve for",
    modeDepth: "Normal depth",
    modeFlow: "Discharge",
    diameter: "Inside diameter",
    width: "Bottom width",
    bottomWidth: "Bottom width (b)",
    sideSlope: "Side slope (z)",
    sideSlopeHint: "Horizontal per 1 vertical",
    depth: "Flow depth (y)",
    fill: "Relative depth (y/D)",
    flow: "Discharge (Q)",
    slope: "Slope (S)",
    material: "Material",
    custom: "Other (manual n)",
    n: "Manning's n",
    roughness: roughnessLabels.en,
    results: "Results",
    normalDepth: "Normal depth",
    relDepth: "y/D =",
    flowResult: "Discharge",
    velocity: "Velocity",
    froude: "Froude number",
    regimeSub: "Subcritical (tranquil)",
    regimeCrit: "Near critical: unstable",
    regimeSuper: "Supercritical (rapid)",
    noFreeSurface: "Flowing full: no free surface",
    shear: "Boundary shear",
    area: "Flow area",
    perimeter: "Wetted perimeter",
    radius: "Hydraulic radius",
    topWidth: "Top width",
    fullFlow: "Full-pipe discharge",
    fullVelocity: "Full-pipe velocity",
    capacity: "Capacity used (Q/Qfull)",
    invalid: "Check the inputs: diameter or width, discharge or depth, slope and n must be numbers greater than zero.",
    surcharged:
      "At that discharge the pipe would flow full, under pressure: the maximum with a free surface is {max}. Increase the diameter or the slope.",
    note: "Uniform free-surface flow. Water at 1000 kg/m³, g = 9.81 m/s². Channel sketches are not to scale.",
  },
};

export function getManningContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getManningLabels(locale: Locale): ManningLabels {
  return labels[locale];
}
