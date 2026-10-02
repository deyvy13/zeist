import { siteUrl } from "@/lib/site";
import { BARS, DEFAULT_STOCK_M } from "@/lib/tools/steel";
import { NUMBER_STYLES, formatNumber } from "@/lib/tools/number";
import type { SteelLabels } from "@/components/tools/steel-calculator";
import type { ToolContent } from "@/lib/tools-content/types";

// Steel (acero corrugado) calculator — Spanish only: Peruvian bar sizes and
// 9 m stock bars. Numbers in the copy match the calculator's preloaded example
// and are covered by scripts/test-tools.mjs; change them together.

const fmt = (value: number, digits: number) => formatNumber(value, digits, NUMBER_STYLES.es);

// kg per 9 m bar with integer arithmetic: 2.235 × 9 in floating point is
// 20.1149…, which toFixed(2) would print as "20.11" instead of "20.12".
const gramsPerBar = (kgPerM: number) => Math.round(kgPerM * 1000) * DEFAULT_STOCK_M;
const kgPerBar = (kgPerM: number) => Math.round(gramsPerBar(kgPerM) / 10) / 100;

const weightTableRows = BARS.map((bar) => [
  bar.label,
  String(bar.diameterMm),
  fmt(bar.kgPerM, 3),
  bar.soldByWeight ? "—" : fmt(kgPerBar(bar.kgPerM), 2),
  bar.soldByWeight ? "—" : fmt(1e6 / gramsPerBar(bar.kgPerM), 1),
  fmt(bar.areaCm2, 2),
]);

export const aceroContent: ToolContent = {
  seoTitle: "Calculadora de acero corrugado: peso y metrado",
  metaDescription:
    "Calcula gratis el peso del acero corrugado y cuántas varillas de 9 m comprar, con plan de cortes y Excel. Tabla de pesos de 3/8, 1/2, 5/8, 3/4 y 1 pulgada.",
  keywords: [
    "calculadora de acero",
    "peso del acero corrugado",
    "metrado de acero",
    "tabla de pesos del acero corrugado",
    "peso de varillas de acero",
    "cuántas varillas de acero necesito",
    "metrado de acero excel",
  ],
  name: "Calculadora de acero corrugado",
  eyebrow: "Herramienta gratuita · Metrado de acero",
  h1: "Calculadora de acero corrugado: peso, metrado y varillas de 9 m",
  intro:
    "Ingresa las piezas de tu despiece y obtén al instante los kilos por diámetro, cuántas varillas de 9 m comprar y cómo cortarlas. Con la tabla de pesos de la NTP 341.031 y exportación a Excel.",
  badges: ["Gratis y sin registro", "Plan de cortes", "Exporta a Excel"],
  calculatorTitle: "Calculadora de peso y metrado de acero corrugado",
  answer:
    'El peso del acero corrugado por metro depende de su diámetro: 3/8" pesa 0.560 kg/m; 1/2", 0.994 kg/m; 5/8", 1.552 kg/m; 3/4", 2.235 kg/m y 1", 3.973 kg/m (NTP 341.031 / ASTM A615). Para metrar el acero se suma la longitud de todas las piezas de cada diámetro, con sus ganchos y traslapes, y se multiplica por su peso por metro. Una varilla de 9 m de 3/8" pesa 5.04 kg y una de 1/2", 8.95 kg.',
  sections: [
    {
      id: "tabla-de-pesos",
      title: "Tabla de pesos del acero corrugado",
      blocks: [
        {
          type: "p",
          text: "Valores nominales de las barras de acero corrugado que se venden en el Perú (NTP 341.031, equivalente a ASTM A615 grado 60). El peso por varilla considera la longitud comercial de 9 m.",
        },
        {
          type: "table",
          caption: "Peso, área y varillas por tonelada según el diámetro",
          head: ["Diámetro", "Ø (mm)", "Peso (kg/m)", "Varilla de 9 m (kg)", "Varillas por tonelada", "Área (cm²)"],
          numeric: [false, true, true, true, true, true],
          rows: weightTableRows,
        },
        {
          type: "p",
          text: 'El 1/4" es alambrón liso: se vende por kilo, en rollo, y se usa sobre todo en estribos de obras pequeñas. Antes de comprar, contrasta siempre los pesos con la ficha técnica del fabricante de tu acero.',
        },
      ],
    },
    {
      id: "como-se-calcula",
      title: "Cómo se calcula el peso del acero",
      blocks: [
        {
          type: "p",
          text: "El peso por metro sale de multiplicar el área de la barra por la densidad del acero (7850 kg/m³). Con el diámetro en milímetros, la cuenta se reduce a una fórmula corta:",
        },
        {
          type: "formula",
          text: "Peso (kg/m) = 0.00617 × d^2",
          note: 'd = diámetro nominal en mm. Para 1/2" (12.7 mm): 0.00617 × 12.7² = 0.995 kg/m; la tabla da 0.994 porque usa la constante sin redondear.',
        },
        {
          type: "formula",
          text: "Peso total (kg) = Σ (piezas × longitud de cada pieza) × peso por metro",
          note: "La suma se hace por diámetro: cada uno tiene su propio peso por metro.",
        },
      ],
    },
    {
      id: "paso-a-paso",
      title: "Cómo hacer el metrado de acero, paso a paso",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**Despiece.** Lista cada barra del plano por elemento: diámetro, cuántas son y cuánto mide cada una.",
            "**Longitud real de cada pieza.** Suma a la longitud libre los ganchos, dobleces y traslapes. Los define el diseño según la Norma E.060; la calculadora no los agrega por ti.",
            "**Suma por diámetro** y multiplica por el peso por metro de la tabla.",
            "**Desperdicio.** Agrega un porcentaje para retazos y cortes: entre 3 % y 5 % es lo habitual.",
            "**Varillas a comprar.** Divide la longitud entre 9 m y redondea hacia arriba, o mejor, arma un plan de cortes (lo explicamos más abajo).",
          ],
        },
        {
          type: "p",
          text: "Si todavía llevas este proceso en hojas de cálculo armadas a mano, mira [por qué conviene dejar de metrar en Excel](/es/blog/deja-de-usar-excel-y-perder-horas).",
        },
      ],
    },
    {
      id: "por-elemento",
      title: "Qué piezas ingresar según el elemento",
      blocks: [
        {
          type: "list",
          items: [
            "**Columnas:** las barras longitudinales, con su traslape y anclaje, y los estribos. Para cada estribo ingresa su perímetro más los dos ganchos.",
            "**Vigas:** el acero corrido superior e inferior, los bastones y los estribos.",
            "**Zapatas:** la parrilla en las dos direcciones. Por dirección, el número de barras es (lado − 2 × recubrimiento) ÷ espaciamiento + 1, redondeado hacia arriba.",
            "**Losas aligeradas:** el acero positivo y negativo de cada vigueta, los bastones y el acero de temperatura.",
          ],
        },
        {
          type: "p",
          text: "Usa la columna «Elemento» para nombrar cada fila (por ejemplo, «C-1 · estribos»): así el Excel exportado queda listo para el presupuesto.",
        },
      ],
    },
    {
      id: "ejemplo",
      title: "Ejemplo: metrado de una columna y una viga",
      blocks: [
        { type: "p", text: "Es el ejemplo que viene cargado en la calculadora:" },
        {
          type: "table",
          head: ["Pieza", "Diámetro", "Piezas × longitud", "Longitud total", "Peso"],
          numeric: [false, false, true, true, true],
          rows: [
            ["Columna C-1 · longitudinal", '5/8"', "6 × 3.60 m", "21.60 m", "33.52 kg"],
            ["Columna C-1 · estribos", '3/8"', "18 × 1.70 m", "30.60 m", "17.14 kg"],
            ["Viga V-101 · acero corrido", '1/2"', "4 × 5.00 m", "20.00 m", "19.88 kg"],
          ],
        },
        {
          type: "p",
          text: 'Total: **70.54 kg** de acero, **74.07 kg** con 5 % de desperdicio. Por longitud saldrían **10 varillas** de 9 m; con el plan de cortes hacen falta **11**. La diferencia está en la viga: de cada varilla de 9 m sale una sola pieza de 5 m, y los 4 m que sobran no sirven para otra pieza de 1/2".',
        },
      ],
    },
    {
      id: "plan-de-cortes",
      title: "Por qué el plan de cortes cambia la compra",
      blocks: [
        {
          type: "p",
          text: "El método de siempre, longitud total entre 9 m más un porcentaje, supone que todo retazo se aprovecha. En obra no pasa: un retazo de 4 m no sirve si todas las piezas de ese diámetro miden 5 m.",
        },
        {
          type: "p",
          text: "La calculadora arma un plan de cortes por primer ajuste decreciente: ordena las piezas de mayor a menor y coloca cada una en la primera varilla donde entra. No garantiza el óptimo matemático, pero queda muy cerca y es el criterio que seguiría un maestro de obra con la lista en la mano.",
        },
        {
          type: "callout",
          title: "Piezas de más de 9 m",
          text: "Se arman con varillas completas más un tramo, sin contar el traslape. Suma a cada pieza la longitud de traslape que indique el diseño (Norma E.060) antes de ingresarla.",
        },
      ],
    },
  ],
  cta: {
    eyebrow: "Del cálculo al modelo",
    title: "¿Metras el acero de todo un edificio? Lo sacamos del modelo.",
    body: "Desarrollamos plugins para Revit que leen el acero modelado y generan el despiece, el metrado por diámetro y el plan de cortes de todo el proyecto, en minutos y con tu formato de entrega.",
    prefill:
      "Hola Zeist. Vengo de la calculadora de acero. Me interesa sacar el metrado de acero directo del modelo de Revit.",
    secondaryLabel: "Ver plugins a medida",
    secondaryPath: "servicios/add-ins-revit-civil-3d",
  },
  faqs: [
    {
      q: '¿Cuánto pesa una varilla de 3/8" de 9 metros?',
      a: '5.04 kg: 9 m × 0.560 kg/m. Una de 1/2" pesa 8.95 kg; una de 5/8", 13.97 kg; y una de 3/4", 20.12 kg.',
    },
    {
      q: '¿Cuántas varillas de 3/8" hay en una tonelada?',
      a: 'Unas 198: una varilla de 9 m pesa 5.04 kg, y 1000 ÷ 5.04 = 198.4. En 1/2" son unas 112 por tonelada.',
    },
    {
      q: "¿Cómo se calcula el peso del acero corrugado por metro?",
      a: "Con la fórmula 0.00617 × d², con el diámetro en milímetros. Sale de multiplicar el área de la barra por la densidad del acero, 7850 kg/m³.",
    },
    {
      q: "¿Qué porcentaje de desperdicio se considera para el acero?",
      a: "Lo habitual es entre 3 % y 5 %, según los diámetros y cuánto se aprovechan los retazos. El plan de cortes de esta calculadora te da una cifra real en lugar de un porcentaje supuesto.",
    },
    {
      q: "¿La calculadora incluye ganchos y traslapes?",
      a: "No los agrega sola: ingresa la longitud de cada pieza ya con sus ganchos, dobleces y traslapes, que define el diseño según la Norma E.060.",
    },
    {
      q: "¿Puedo exportar el metrado a Excel?",
      a: "Sí. El botón «Descargar Excel» genera un archivo con tres hojas: resumen por diámetro, despiece y plan de cortes.",
    },
    {
      q: "¿Sirve para el metrado de todo un edificio?",
      a: "Para un edificio completo, ingresar pieza por pieza no escala. En ese caso el metrado se saca del modelo de Revit con un [plugin de acero](/es/blog/plugin-acero-revit-modelado-revision), que lee las barras modeladas y arma el despiece solo.",
    },
  ],
  guides: [
    "plugin-acero-revit-modelado-revision",
    "deja-de-usar-excel-y-perder-horas",
    "automatizar-metrados-cubicaciones-civil-3d",
    "cuanto-cuesta-un-add-in-revit-civil-3d",
  ],
};

export const aceroLabels: SteelLabels = {
  element: "Elemento",
  elementPlaceholder: "Ej.: Columna C-1 · estribos",
  diameter: "Diámetro",
  pieces: "Piezas",
  lengthPerPiece: "Longitud por pieza (m)",
  weight: "Peso (kg)",
  remove: "Quitar fila",
  addRow: "Agregar pieza",
  loadExample: "Cargar ejemplo",
  clear: "Empezar de cero",
  stockLength: "Longitud de la varilla comercial (m)",
  waste: "Desperdicio (%)",
  resultsTitle: "Resultado del metrado",
  totalWeight: "Peso total",
  withWaste: "Con {pct} % de desperdicio",
  barsPlan: "Varillas a comprar (plan de cortes)",
  barsLength: "Por longitud (+{pct} %)",
  colDiameter: "Diámetro",
  colPieces: "Piezas",
  colLength: "Longitud (m)",
  colWeight: "Peso (kg)",
  colBarsLength: "Varillas por longitud (+{pct} %)",
  colBarsPlan: "Varillas (plan de cortes)",
  colOffcut: "Sobrante (m)",
  total: "Total",
  byWeight: "por kg",
  planTitle: "Ver el plan de cortes",
  planHeader: "{bars} varilla(s) · aprovechamiento {usage} %",
  planLine: "Cortar {count} varilla(s) en {cuts} m · sobran {offcut} m",
  planNote:
    "Plan sugerido por primer ajuste decreciente: cada pieza va a la primera varilla donde entra, de la más larga a la más corta. Longitudes en metros.",
  warnLong:
    "{n} pieza(s) de {label} miden más que la varilla de {stock} m: se armaron con varillas completas más un tramo, sin traslape. Suma el traslape a la longitud de cada pieza.",
  warnSkipped:
    "Hay más de {max} piezas de un mismo diámetro: el plan de cortes se omite y se muestra solo el método por longitud.",
  warnInvalid:
    "Hay filas incompletas o con valores no válidos y no se cuentan: las piezas deben ser un número entero y la longitud, mayor que cero.",
  empty: "Ingresa al menos una pieza con su diámetro, cantidad y longitud para ver el resultado.",
  exportExcel: "Descargar Excel",
  xlsx: {
    fileName: "metrado-acero-zeist.xlsx",
    summarySheet: "Resumen",
    piecesSheet: "Despiece",
    planSheet: "Plan de cortes",
    generatedBy: `Generado con la calculadora de acero corrugado de Zeist: ${siteUrl}/es/herramientas/calculadora-acero-corrugado`,
    cuts: "Cortes (m)",
    offcutPerBar: "Sobrante por varilla (m)",
    bars: "Varillas",
  },
  cta: {
    title: "¿Es el acero de todo un edificio?",
    body: "Un plugin de Revit lo saca del modelo, con despiece, metrado y plan de cortes, en minutos y con tu formato.",
    button: "Hablemos por WhatsApp",
    prefill:
      "Hola Zeist. Calculé un metrado de {kg} kg de acero en {n} diámetro(s) con su calculadora. Me interesa sacar el metrado directo del modelo de Revit.",
  },
  example: [
    { element: "Columna C-1 · longitudinal", barId: "5/8", count: "6", length: "3.60" },
    { element: "Columna C-1 · estribos", barId: "3/8", count: "18", length: "1.70" },
    { element: "Viga V-101 · acero corrido", barId: "1/2", count: "4", length: "5.00" },
  ],
};
