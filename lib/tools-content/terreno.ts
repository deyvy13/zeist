import type { Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import type { ParcelLabels } from "@/components/tools/parcel-calculator";
import type { ToolContent } from "@/lib/tools-content/types";

// Land area & perimeter plan — es / pt / en, each with its market's document:
// Peru's "memoria descriptiva" + "cuadro de datos técnicos", Brazil's
// "memorial descritivo", the US metes and bounds legal description.
// Every number in the copy comes from lib/tools/parcel.ts (tested against an
// independent Python check) and matches the tool's preloaded example — the
// same lot (1,624.00 m²) placed in Trujillo, São Paulo and New York.

const SLUG = "calculadora-area-terreno";
const generatedBy = (locale: Locale, text: string) => `${text}: ${siteUrl}/${locale}/herramientas/${SLUG}`;

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Calculadora de área de terreno y plano perimétrico",
    metaDescription:
      "Calcula gratis el área y el perímetro de un terreno con coordenadas UTM o con sus medidas. Genera el cuadro de datos técnicos, la memoria descriptiva y el DXF.",
    keywords: [
      "área de un terreno",
      "calcular área de un terreno con coordenadas",
      "área de un terreno irregular",
      "plano perimétrico",
      "cuadro de datos técnicos",
      "memoria descriptiva de un terreno",
      "coordenadas de autocad a excel",
    ],
    name: "Calculadora de área de terreno",
    eyebrow: "Herramienta gratuita · Topografía y planos",
    h1: "Calculadora de área de terreno: cuadro de datos técnicos, memoria descriptiva y DXF",
    intro:
      "Calcula el área y el perímetro de un terreno con sus coordenadas UTM o con las medidas de sus lados. Obtén el cuadro de datos técnicos, la memoria descriptiva en Word y el plano perimétrico en DXF para AutoCAD y Civil 3D.",
    badges: ["Gratis y sin registro", "Cuadro de datos técnicos", "Memoria descriptiva en Word", "Plano en DXF"],
    calculatorTitle: "Calculadora de área y perímetro de terrenos",
    answer:
      "El área de un terreno con coordenadas se calcula con la fórmula de Gauss: se multiplican en cruz las coordenadas Este y Norte de vértices consecutivos y la mitad del valor absoluto de la suma es el área. Por ejemplo, un lote de 5 vértices en Trujillo mide 1,624.00 m². Si solo tienes medidas, un terreno de 4 lados necesita además una diagonal: con ella se divide en dos triángulos y se aplica la fórmula de Herón. Con los cuatro lados solos, el área no queda definida.",
    sections: [
      {
        id: "con-coordenadas",
        title: "Cómo se calcula el área de un terreno con coordenadas",
        blocks: [
          {
            type: "p",
            text: "Es el método que usan los programas de topografía: la **fórmula de Gauss**, también llamada fórmula del área por coordenadas. Se recorren los vértices en orden y se multiplican en cruz las coordenadas de cada par consecutivo:",
          },
          { type: "formula", text: "Área = ½ · | Σ (Eᵢ · Nᵢ₊₁ − Eᵢ₊₁ · Nᵢ) |", note: "E = coordenada Este (X), N = coordenada Norte (Y). Al final se vuelve al primer vértice." },
          {
            type: "p",
            text: "Este es el lote que viene cargado en la calculadora, en coordenadas UTM WGS 84, zona 17 Sur:",
          },
          {
            type: "table",
            head: ["Vértice", "Este (X)", "Norte (Y)", "Lado", "Distancia (m)"],
            numeric: [false, true, true, false, true],
            rows: [
              ["A", "717200.000", "9102850.000", "A-B", "35.51"],
              ["B", "717235.000", "9102856.000", "B-C", "36.50"],
              ["C", "717241.000", "9102820.000", "C-D", "30.41"],
              ["D", "717214.000", "9102806.000", "D-E", "24.08"],
              ["E", "717196.000", "9102822.000", "E-A", "28.28"],
            ],
          },
          {
            type: "p",
            text: "Resultado: **1,624.00 m² (0.1624 ha)** de área y **154.79 m** de perímetro. Los vértices deben ir en orden, sin saltarse ninguno; si los lados se cruzan, la herramienta te avisa en vez de darte un área falsa.",
          },
        ],
      },
      {
        id: "terreno-irregular",
        title: "Área de un terreno irregular de 4 lados: por qué necesitas una diagonal",
        blocks: [
          {
            type: "p",
            text: "Con los cuatro lados solos, un terreno puede tomar muchas formas distintas, cada una con un área diferente: el cuadrilátero «se deforma» como un marco sin escuadra. Por eso hace falta **una medida más**: una diagonal. Con ella, el terreno se divide en dos triángulos y cada uno se calcula con la fórmula de Herón:",
          },
          { type: "formula", text: "Área = √( s · (s − a) · (s − b) · (s − c) ),   s = (a + b + c) / 2", note: "a, b, c = lados del triángulo; s = semiperímetro." },
          {
            type: "p",
            text: "Ejemplo, el que trae la calculadora en el modo «Por medidas»: lados de **30.00, 21.50, 27.80 y 19.60 m** y diagonal A-C de **37.40 m**. El área real es **588.02 m²**.",
          },
          {
            type: "callout",
            title: "El error de promediar lados opuestos",
            text: "Un atajo muy difundido es multiplicar el promedio de dos lados opuestos por el promedio de los otros dos. Con este terreno da 593.90 m²: un 1 % de más. Ese método siempre sobreestima el área, y el error crece cuanto más se aleja el lote de un rectángulo.",
          },
        ],
      },
      {
        id: "cuadro-de-datos-tecnicos",
        title: "Qué es el cuadro de datos técnicos y cómo leerlo",
        blocks: [
          {
            type: "p",
            text: "Es la tabla que acompaña al **plano perimétrico**: describe el terreno vértice por vértice para que cualquiera pueda reconstruirlo en el terreno o en otro plano. Sus columnas habituales son:",
          },
          {
            type: "list",
            items: [
              "**Vértice:** el nombre de cada esquina (A, B, C…).",
              "**Lado:** el tramo que sale de ese vértice hacia el siguiente (A-B).",
              "**Distancia:** la longitud del lado, en metros.",
              "**Ángulo interno:** el ángulo del terreno en ese vértice, en grados, minutos y segundos.",
              "**Este (X) y Norte (Y):** las coordenadas UTM del vértice, con su datum y zona.",
            ],
          },
          {
            type: "p",
            text: "Una comprobación rápida: la suma de los ángulos internos de un polígono de n vértices siempre es (n − 2) × 180°. En el lote de 5 vértices, 540°00'00\". Si tu cuadro no cierra, hay un error de transcripción.",
          },
        ],
      },
      {
        id: "memoria-descriptiva",
        title: "Qué lleva la memoria descriptiva de un terreno",
        blocks: [
          {
            type: "p",
            text: "La memoria descriptiva describe en palabras lo que el plano muestra en dibujo. La calculadora arma un borrador con las partes habituales:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "**Identificación del predio:** denominación y ubicación.",
              "**Linderos y medidas perimétricas:** por el Norte, Este, Sur y Oeste (o frente, derecha entrando, izquierda entrando y fondo), con quién colinda y la medida de cada tramo.",
              "**Área y perímetro.**",
              "**Cuadro de datos técnicos,** con el datum y la zona de las coordenadas.",
            ],
          },
          {
            type: "p",
            text: "La herramienta agrupa los lados por la orientación hacia la que miran: dos tramos seguidos hacia el sur forman un lindero «en línea quebrada de 2 tramos». Escribe al lado de cada tramo con quién colinda y el texto se completa solo.",
          },
          {
            type: "callout",
            title: "Un borrador para quien firma",
            text: "El formato exacto, la firma y los requisitos de colegiatura dependen de la entidad y del trámite (independización, subdivisión, saneamiento). Usa el documento como borrador y confírmalo con el profesional responsable antes de presentarlo.",
          },
        ],
      },
      {
        id: "area-utm-y-terreno",
        title: "Área en el plano UTM y área en el terreno",
        blocks: [
          {
            type: "p",
            text: "Las coordenadas UTM están en un plano de proyección. Una distancia en ese plano no es exactamente igual a la medida con wincha en el terreno: la diferencia la da el **factor de escala combinado**, que junta la deformación de la proyección y la altura del lugar.",
          },
          {
            type: "p",
            text: "En el lote de ejemplo, en Trujillo y a 34 m de altura, el factor combinado es 1.00017863: el área en el plano UTM es 1,624.00 m² y en el terreno, 1,623.42 m². La calculadora muestra las dos; la memoria declara la del plano UTM, que es la que coincide con las coordenadas del cuadro. Si necesitas convertir puntos o revisar el factor de cada uno, usa el [conversor de coordenadas](/es/herramientas/conversor-de-coordenadas).",
          },
        ],
      },
      {
        id: "autocad-civil-3d",
        title: "De AutoCAD a la memoria, y de vuelta al plano",
        blocks: [
          {
            type: "p",
            text: "¿El terreno ya está dibujado? Guarda el plano como DXF (comando GUARDARCOMO o SAVEAS, tipo DXF) y súbelo con **Importar DXF**: la calculadora lee las polilíneas del dibujo y extrae las coordenadas de sus vértices. Es la forma más rápida de pasar las coordenadas de una polilínea de AutoCAD a una tabla, sin rutinas LISP.",
          },
          {
            type: "p",
            text: "Y al revés: el **DXF** que descarga la herramienta trae el perímetro, los nombres de los vértices, la distancia de cada lado y el cuadro de datos técnicos ya dibujado, en capas separadas y en sus coordenadas reales. Se abre en AutoCAD, Civil 3D o cualquier programa CAD.",
          },
          {
            type: "p",
            text: "Si en tu oficina se hacen planos perimétricos todas las semanas, ese flujo se puede automatizar dentro de Civil 3D. Mira cómo en la guía para [automatizar Civil 3D](/es/blog/automatizar-civil-3d-guia-completa).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Del cálculo al plano",
      title: "¿Haces planos perimétricos cada semana? Los automatizamos en Civil 3D.",
      body: "Desarrollamos plugins que generan el plano perimétrico, el cuadro de datos técnicos y la memoria descriptiva desde el dibujo, con el formato de tu oficina. Lo que hoy toma una tarde, en un clic.",
      prefill: "Hola Zeist. Vengo de la calculadora de área de terreno. Me interesa automatizar planos perimétricos y memorias descriptivas.",
      secondaryLabel: "Ver plugins a medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "¿Cómo calculo el área de un terreno con coordenadas UTM?",
        a: "Con la fórmula de Gauss: recorre los vértices en orden, multiplica en cruz las coordenadas Este y Norte de cada par consecutivo, suma los resultados y toma la mitad del valor absoluto. Esta calculadora lo hace al pegar las coordenadas desde Excel.",
      },
      {
        q: "¿Cómo calculo el área de un terreno irregular de 4 lados?",
        a: "Necesitas medir también una diagonal: con ella, el terreno se divide en dos triángulos y el área de cada uno sale con la fórmula de Herón. Con los cuatro lados solos, el área no queda definida, y promediar lados opuestos la sobreestima.",
      },
      {
        q: "¿Qué es el cuadro de datos técnicos de un plano perimétrico?",
        a: "Es la tabla que describe el terreno vértice por vértice: nombre del vértice, lado, distancia, ángulo interno y coordenadas Este y Norte, con su datum y zona. Permite reconstruir el terreno en campo o en otro plano.",
      },
      {
        q: "¿Qué debe tener la memoria descriptiva de un terreno?",
        a: "La identificación del predio, los linderos y medidas perimétricas (con quién colinda y cuánto mide cada tramo), el área, el perímetro y el cuadro de datos técnicos con su datum. Los requisitos exactos dependen de la entidad y del trámite.",
      },
      {
        q: "¿Cómo saco las coordenadas de una polilínea de AutoCAD a Excel?",
        a: "Guarda el plano como DXF, súbelo con «Importar DXF» y elige la polilínea: la calculadora extrae sus vértices. Después descarga el Excel con el cuadro completo.",
      },
      {
        q: "¿El área calculada con coordenadas UTM es el área real?",
        a: "Es el área en el plano de proyección UTM. En el terreno difiere por el factor de escala combinado: unas centésimas de punto porcentual, más en zonas altas. En el lote de ejemplo, 0.58 m². La calculadora muestra las dos.",
      },
      {
        q: "¿Mis coordenadas se envían a algún servidor?",
        a: "No. El cálculo y los archivos se generan en tu navegador. El mapa descarga de OpenStreetMap las imágenes de la zona que muestra.",
      },
    ],
    guides: [
      "habilitacion-urbana-trujillo-civil-3d",
      "automatizar-civil-3d-guia-completa",
      "produccion-planos-automatica-civil-3d-revit",
      "deja-de-usar-excel-y-perder-horas",
      "expediente-tecnico-observaciones-reducir",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Calculadora de área de terreno e memorial descritivo",
    metaDescription:
      "Calcule grátis a área e o perímetro de um terreno por coordenadas UTM ou pelas medidas. Gere o quadro de coordenadas, o memorial descritivo em Word e o DXF.",
    keywords: [
      "calcular área de terreno",
      "calcular área de terreno irregular",
      "calcular área por coordenadas",
      "memorial descritivo de terreno",
      "quadro de coordenadas",
      "azimute e distância",
      "planta de situação dxf",
    ],
    name: "Calculadora de área de terreno",
    eyebrow: "Ferramenta gratuita · Topografia e plantas",
    h1: "Calculadora de área de terreno: quadro de coordenadas, memorial descritivo e DXF",
    intro:
      "Calcule a área e o perímetro de um terreno pelas coordenadas UTM ou pelas medidas dos lados. Gere o quadro de coordenadas com azimutes, o memorial descritivo em Word e a planta em DXF para AutoCAD e Civil 3D.",
    badges: ["Grátis e sem cadastro", "Azimutes e distâncias", "Memorial descritivo em Word", "Planta em DXF"],
    calculatorTitle: "Calculadora de área e perímetro de terrenos",
    answer:
      "A área de um terreno por coordenadas se calcula com a fórmula de Gauss: multiplicam-se em cruz as coordenadas E e N de vértices consecutivos, e a metade do valor absoluto da soma é a área. Por exemplo, um lote de 5 vértices em São Paulo mede 1.624,00 m². Se você só tem as medidas, um terreno de 4 lados precisa também de uma diagonal: com ela, ele se divide em dois triângulos calculados pela fórmula de Herão. Só com os quatro lados, a área não fica definida.",
    sections: [
      {
        id: "por-coordenadas",
        title: "Como calcular a área de um terreno por coordenadas",
        blocks: [
          {
            type: "p",
            text: "É o método dos programas de topografia: a **fórmula de Gauss**. Percorrem-se os vértices em ordem e multiplicam-se em cruz as coordenadas de cada par consecutivo:",
          },
          { type: "formula", text: "Área = ½ · | Σ (Eᵢ · Nᵢ₊₁ − Eᵢ₊₁ · Nᵢ) |", note: "E = coordenada Leste, N = coordenada Norte. No fim, volta-se ao primeiro vértice." },
          { type: "p", text: "Este é o lote que vem carregado na calculadora, em coordenadas UTM SIRGAS 2000, fuso 23 Sul:" },
          {
            type: "table",
            head: ["Vértice", "E (m)", "N (m)", "Lado", "Azimute", "Distância (m)"],
            numeric: [false, true, true, false, true, true],
            rows: [
              ["V1", "333500,000", "7394700,000", "V1-V2", "80°16'21\"", "35,51"],
              ["V2", "333535,000", "7394706,000", "V2-V3", "170°32'16\"", "36,50"],
              ["V3", "333541,000", "7394670,000", "V3-V4", "242°35'33\"", "30,41"],
              ["V4", "333514,000", "7394656,000", "V4-V5", "311°38'01\"", "24,08"],
              ["V5", "333496,000", "7394672,000", "V5-V1", "8°07'48\"", "28,28"],
            ],
          },
          {
            type: "p",
            text: "Resultado: **1.624,00 m² (0,1624 ha)** de área e **154,79 m** de perímetro. Os vértices precisam estar em ordem; se os lados se cruzam, a ferramenta avisa em vez de dar uma área falsa.",
          },
        ],
      },
      {
        id: "terreno-irregular",
        title: "Área de terreno irregular de 4 lados: por que você precisa de uma diagonal",
        blocks: [
          {
            type: "p",
            text: "Só com os quatro lados, o terreno pode ter muitas formas diferentes, cada uma com uma área: o quadrilátero «se deforma» como um quadro sem esquadro. Por isso é preciso **mais uma medida**: uma diagonal. Com ela, o terreno vira dois triângulos, e cada um se calcula pela fórmula de Herão:",
          },
          { type: "formula", text: "Área = √( s · (s − a) · (s − b) · (s − c) ),   s = (a + b + c) / 2", note: "a, b, c = lados do triângulo; s = semiperímetro." },
          {
            type: "p",
            text: "Exemplo, o mesmo do modo «Por medidas»: lados de **30,00, 21,50, 27,80 e 19,60 m** e diagonal V1-V3 de **37,40 m**. A área real é **588,02 m²**.",
          },
          {
            type: "callout",
            title: "O erro de tirar a média dos lados opostos",
            text: "Um atalho comum é multiplicar a média de dois lados opostos pela média dos outros dois. Com este terreno, dá 593,90 m²: 1 % a mais. Esse método sempre superestima a área, e o erro cresce quanto mais o lote se afasta de um retângulo.",
          },
        ],
      },
      {
        id: "memorial-descritivo",
        title: "O que contém um memorial descritivo de terreno",
        blocks: [
          {
            type: "p",
            text: "O memorial descreve por escrito o perímetro do imóvel, vértice por vértice. A calculadora monta um rascunho no formato mais usado:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "**Identificação do imóvel,** área e perímetro.",
              "**Descrição do perímetro:** começa num vértice com suas coordenadas e segue, lado a lado, com o confrontante, o azimute e a distância até o vértice seguinte, até voltar ao ponto inicial.",
              "**Sistema de referência:** datum (SIRGAS 2000), projeção UTM, fuso e meridiano central, e a observação de que azimutes, distâncias, área e perímetro foram calculados no plano de projeção UTM.",
              "**Quadro de coordenadas** com vértices, azimutes e distâncias.",
            ],
          },
          {
            type: "callout",
            title: "Um rascunho para o responsável técnico",
            text: "O formato exato depende do órgão e do processo (registro de imóveis, usucapião, prefeitura). Para imóveis rurais, o georreferenciamento segue as normas do INCRA e é certificado no SIGEF, que gera o próprio memorial. Use o documento como rascunho e confirme com o responsável técnico antes de protocolar.",
          },
        ],
      },
      {
        id: "azimute-e-rumo",
        title: "Azimute, rumo e ângulo interno",
        blocks: [
          {
            type: "list",
            items: [
              "**Azimute:** ângulo do lado medido a partir do norte, no sentido horário, de 0° a 360°. É o que vai no memorial.",
              "**Rumo:** o mesmo ângulo contado a partir do norte ou do sul, até 90°, com o quadrante (por exemplo, S 62°35'33\" O).",
              "**Ângulo interno:** o ângulo do terreno em cada vértice. A soma dos ângulos internos de um polígono de n vértices é sempre (n − 2) × 180°; no lote de 5 vértices, 540°00'00\".",
            ],
          },
        ],
      },
      {
        id: "area-utm-e-terreno",
        title: "Área no plano UTM e área no terreno",
        blocks: [
          {
            type: "p",
            text: "As coordenadas UTM estão num plano de projeção. Uma distância nesse plano não é exatamente igual à medida no terreno: a diferença vem do **fator de escala combinado**, que junta a deformação da projeção e a altitude do lugar.",
          },
          {
            type: "p",
            text: "No lote de exemplo, em São Paulo e a 760 m de altitude, o fator combinado é 0,99982297: a área no plano UTM é 1.624,00 m² e no terreno, 1.624,58 m². A calculadora mostra as duas; o memorial declara a do plano UTM, como pede a redação usual. Para converter pontos ou ver o fator de cada um, use o [conversor de coordenadas](/pt/herramientas/conversor-de-coordenadas).",
          },
        ],
      },
      {
        id: "autocad-civil-3d",
        title: "Do AutoCAD ao memorial, e de volta à planta",
        blocks: [
          {
            type: "p",
            text: "O terreno já está desenhado? Salve a planta como DXF (comando SALVARCOMO ou SAVEAS, tipo DXF) e envie com **Importar DXF**: a calculadora lê as polilinhas e extrai as coordenadas dos vértices, sem rotinas LISP.",
          },
          {
            type: "p",
            text: "E o caminho inverso: o **DXF** que a ferramenta gera traz o perímetro, os nomes dos vértices, a distância de cada lado e o quadro de coordenadas já desenhado, em camadas separadas e nas coordenadas reais. Abre no AutoCAD, no Civil 3D ou em qualquer programa CAD. Para automatizar esse fluxo no seu escritório, veja o guia para [automatizar o Civil 3D](/pt/blog/automatizar-civil-3d-guia-completa).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Do cálculo à planta",
      title: "Faz memoriais e plantas toda semana? Automatizamos no Civil 3D.",
      body: "Desenvolvemos plugins que geram a planta, o quadro de coordenadas e o memorial descritivo a partir do desenho, no padrão do seu escritório. O que hoje leva uma tarde, em um clique.",
      prefill: "Olá Zeist. Vim da calculadora de área de terreno. Tenho interesse em automatizar plantas e memoriais descritivos.",
      secondaryLabel: "Ver plugins sob medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "Como calcular a área de um terreno por coordenadas UTM?",
        a: "Com a fórmula de Gauss: percorra os vértices em ordem, multiplique em cruz as coordenadas E e N de cada par consecutivo, some e pegue a metade do valor absoluto. Esta calculadora faz isso ao colar as coordenadas do Excel.",
      },
      {
        q: "Como calcular a área de um terreno irregular de 4 lados?",
        a: "É preciso medir também uma diagonal: com ela, o terreno se divide em dois triângulos e a área de cada um sai pela fórmula de Herão. Só com os quatro lados a área não fica definida, e tirar a média dos lados opostos a superestima.",
      },
      {
        q: "O que deve conter um memorial descritivo de terreno?",
        a: "A identificação do imóvel, a área, o perímetro e a descrição do perímetro vértice por vértice, com confrontantes, azimutes e distâncias, além do sistema de referência (datum, projeção e fuso). O formato exato depende do órgão e do processo.",
      },
      {
        q: "Qual a diferença entre azimute e rumo?",
        a: "O azimute é medido a partir do norte, no sentido horário, de 0° a 360°. O rumo é o mesmo ângulo contado a partir do norte ou do sul, até 90°, com o quadrante: um azimute de 242°35'33\" equivale ao rumo S 62°35'33\" O.",
      },
      {
        q: "Como tiro as coordenadas de uma polilinha do AutoCAD?",
        a: "Salve a planta como DXF, envie com «Importar DXF» e escolha a polilinha: a calculadora extrai os vértices. Depois baixe o Excel ou o memorial.",
      },
      {
        q: "A área calculada em UTM é a área real?",
        a: "É a área no plano de projeção UTM, a que o memorial declara. No terreno difere pelo fator de escala combinado: centésimos de ponto percentual, mais em locais altos. No lote de exemplo, 0,58 m². A calculadora mostra as duas.",
      },
      {
        q: "Minhas coordenadas são enviadas para algum servidor?",
        a: "Não. O cálculo e os arquivos são gerados no seu navegador. O mapa baixa do OpenStreetMap as imagens da área exibida.",
      },
    ],
    guides: [
      "automatizar-civil-3d-guia-completa",
      "produccion-planos-automatica-civil-3d-revit",
      "deja-de-usar-excel-y-perder-horas",
      "plugin-civil-3d-dibujo-3d-automatizado",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "Area From Coordinates Calculator + Metes and Bounds",
    metaDescription:
      "Calculate lot area and perimeter from coordinates or measured sides. Get bearings, distances, a metes and bounds legal description in Word, and a DXF plat.",
    keywords: [
      "area from coordinates calculator",
      "lot area calculator",
      "metes and bounds calculator",
      "legal description generator",
      "irregular lot area",
      "bearing and distance calculator",
      "coordinates from autocad polyline",
    ],
    name: "Area from coordinates calculator",
    eyebrow: "Free tool · Surveying and plats",
    h1: "Area from coordinates calculator with metes and bounds description and DXF plat",
    intro:
      "Calculate the area and perimeter of a lot from its coordinates or from measured sides. Get the table of courses with bearings, a metes and bounds legal description in Word, and a DXF plat for AutoCAD and Civil 3D.",
    badges: ["Free, no sign-up", "Bearings and distances", "Metes and bounds in Word", "DXF plat"],
    calculatorTitle: "Lot area and perimeter calculator",
    answer:
      "To calculate area from coordinates, use the shoelace formula: cross-multiply the easting and northing of consecutive points, add the results and take half the absolute value. A 5-point lot in this tool's example covers 17,480.59 square feet (0.401 acres). If you only have measured sides, a 4-sided lot also needs a diagonal: it splits the lot into two triangles solved with Heron's formula. With the four sides alone, the area is not determined.",
    sections: [
      {
        id: "shoelace-formula",
        title: "How to calculate area from coordinates",
        blocks: [
          {
            type: "p",
            text: "It's the method every surveying program uses: the **shoelace formula** (also called Gauss's area formula). Walk the points in order and cross-multiply the coordinates of each consecutive pair:",
          },
          { type: "formula", text: "Area = ½ · | Σ (Eᵢ · Nᵢ₊₁ − Eᵢ₊₁ · Nᵢ) |", note: "E = easting, N = northing. The last point connects back to the first." },
          { type: "p", text: "This is the lot preloaded in the calculator, in UTM coordinates (WGS 84, Zone 18 North, meters):" },
          {
            type: "table",
            head: ["Point", "Easting", "Northing", "Course", "Bearing", "Distance (ft)"],
            numeric: [false, true, true, false, false, true],
            rows: [
              ["1", "583900.000", "4507300.000", "1–2", "N 80°16'21\" E", "116.50"],
              ["2", "583935.000", "4507306.000", "2–3", "S 9°27'44\" E", "119.74"],
              ["3", "583941.000", "4507270.000", "3–4", "S 62°35'33\" W", "99.78"],
              ["4", "583914.000", "4507256.000", "4–5", "N 48°21'59\" W", "79.01"],
              ["5", "583896.000", "4507272.000", "5–1", "N 8°07'48\" E", "92.80"],
            ],
          },
          {
            type: "p",
            text: "Result: **17,480.59 square feet (0.401 acres)**, or 1,624.00 m², with a perimeter of **507.84 feet**. Points must be in order around the lot; if two sides cross, the tool flags it instead of returning a false area.",
          },
          {
            type: "callout",
            title: "Using State Plane coordinates?",
            text: "Most US surveys use State Plane coordinates in feet. Choose **Local / plane coordinates** in feet: the math is the same, you just won't get the map preview.",
          },
        ],
      },
      {
        id: "irregular-lot",
        title: "Area of an irregular 4-sided lot: why you need a diagonal",
        blocks: [
          {
            type: "p",
            text: "Four sides alone don't fix the shape of a lot: like a frame without a square, it can lean into many shapes, each with a different area. You need **one more measurement**, a diagonal. It splits the lot into two triangles, each solved with Heron's formula:",
          },
          { type: "formula", text: "Area = √( s · (s − a) · (s − b) · (s − c) ),   s = (a + b + c) / 2", note: "a, b, c = triangle sides; s = semi-perimeter." },
          {
            type: "p",
            text: "Example, the one in “By measurements” mode: sides of **30.00, 21.50, 27.80 and 19.60 feet** and a diagonal 1–3 of **37.40 feet** give **588.02 square feet**.",
          },
          {
            type: "callout",
            title: "Don't average opposite sides",
            text: "A common shortcut multiplies the average of two opposite sides by the average of the other two. Here it gives 593.90 square feet, 1% too much. The method always overestimates, and the error grows the further the lot is from a rectangle.",
          },
        ],
      },
      {
        id: "metes-and-bounds",
        title: "What a metes and bounds description contains",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "**Point of beginning (POB):** a defined starting point, here with its grid coordinates.",
              "**Courses:** from point to point, each with a bearing and a distance (“thence N 80°16'21\" E, a distance of 116.50 feet”), optionally along the adjoining owner.",
              "**Closure:** the last course returns “to the point of beginning”.",
              "**Area:** “containing … square feet (… acres), more or less”.",
              "**Basis of bearings:** the grid or system the bearings refer to.",
            ],
          },
          {
            type: "callout",
            title: "A draft for a licensed surveyor",
            text: "Legal descriptions for deeds and plats are prepared and sealed by a licensed land surveyor, and local requirements vary. Use the generated text as a draft to review, not as a recordable document.",
          },
        ],
      },
      {
        id: "bearings",
        title: "Bearings, azimuths and interior angles",
        blocks: [
          {
            type: "list",
            items: [
              "**Quadrant bearing:** the angle from north or south toward east or west, up to 90° (S 62°35'33\" W).",
              "**Azimuth:** the angle from north, clockwise, from 0° to 360°. S 62°35'33\" W is an azimuth of 242°35'33\".",
              "**Interior angle:** the angle of the lot at each point. The interior angles of an n-sided polygon always add up to (n − 2) × 180°: 540°00'00\" for this 5-point lot.",
            ],
          },
        ],
      },
      {
        id: "grid-vs-ground",
        title: "Grid area vs. ground area",
        blocks: [
          {
            type: "p",
            text: "Projected coordinates (UTM or State Plane) live on a grid. A grid distance is not exactly the distance measured on the ground: the **combined scale factor** accounts for the projection and the elevation.",
          },
          {
            type: "p",
            text: "For the example lot near New York City, 10 m above the ellipsoid, the combined factor is 0.99968511: the grid area is 1,624.00 m² and the ground area 1,625.02 m², about 11 square feet more. The calculator shows both. To convert points or check each point's factor, use the [UTM to lat long converter](/en/herramientas/conversor-de-coordenadas).",
          },
        ],
      },
      {
        id: "autocad-civil-3d",
        title: "From an AutoCAD polyline to a description, and back to the plat",
        blocks: [
          {
            type: "p",
            text: "Already drawn the lot? Save the drawing as DXF (SAVEAS, DXF type) and upload it with **Import DXF**: the calculator reads the polylines and extracts their vertex coordinates, no LISP routine needed.",
          },
          {
            type: "p",
            text: "The other way around, the **DXF** the tool creates contains the boundary, point names, the distance on each side and the table of courses already drawn, on separate layers and at real coordinates. It opens in AutoCAD, Civil 3D or any CAD program. To automate this in your office, see how to [automate Civil 3D](/en/blog/automatizar-civil-3d-guia-completa).",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "From calculation to plat",
      title: "Drafting plats and legal descriptions every week? We automate them in Civil 3D.",
      body: "We build plugins that generate the plat, the table of courses and the legal description from the drawing, in your office's format. What takes an afternoon today, in one click.",
      prefill: "Hi Zeist. I came from your lot area calculator. I'm interested in automating plats and legal descriptions.",
      secondaryLabel: "See custom plugins",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "How do I calculate area from coordinates?",
        a: "Use the shoelace formula: list the points in order, cross-multiply the easting and northing of each consecutive pair, add them and take half the absolute value. This calculator does it when you paste the coordinates from Excel.",
      },
      {
        q: "How do I find the area of an irregular 4-sided lot?",
        a: "Measure one diagonal as well: it splits the lot into two triangles whose areas come from Heron's formula. With the four sides alone the area is not determined, and averaging opposite sides overestimates it.",
      },
      {
        q: "What is a metes and bounds legal description?",
        a: "A description of a parcel's boundary as a sequence of courses — bearing and distance — from a point of beginning back to it, with the adjoining owners, the area and the basis of bearings.",
      },
      {
        q: "How do I convert a bearing to an azimuth?",
        a: "For N θ E the azimuth is θ; for S θ E it is 180° − θ; for S θ W it is 180° + θ; and for N θ W it is 360° − θ. S 62°35'33\" W equals an azimuth of 242°35'33\".",
      },
      {
        q: "How do I get coordinates from an AutoCAD polyline?",
        a: "Save the drawing as DXF, upload it with “Import DXF” and pick the polyline: the calculator extracts its vertices. Then download the Excel table or the legal description.",
      },
      {
        q: "Is the area from grid coordinates the true area?",
        a: "It's the grid area. On the ground it differs by the combined scale factor, typically by a few hundredths of a percent; about 11 square feet for the example lot. The calculator shows both.",
      },
      {
        q: "Are my coordinates sent to a server?",
        a: "No. The calculation and the files are generated in your browser. The map downloads OpenStreetMap tiles for the area it shows.",
      },
    ],
    guides: [
      "automatizar-civil-3d-guia-completa",
      "produccion-planos-automatica-civil-3d-revit",
      "deja-de-usar-excel-y-perder-horas",
      "plugin-civil-3d-dibujo-3d-automatizado",
    ],
  },
};

const orders = {
  es: { PENZD: "P, Este, Norte", PNEZD: "P, Norte, Este", ENZD: "Este, Norte", NEZD: "Norte, Este", PLATLON: "P, latitud, longitud", PLONLAT: "P, longitud, latitud", LATLON: "Latitud, longitud", LONLAT: "Longitud, latitud" },
  pt: { PENZD: "P, E, N", PNEZD: "P, N, E", ENZD: "E, N", NEZD: "N, E", PLATLON: "P, latitude, longitude", PLONLAT: "P, longitude, latitude", LATLON: "Latitude, longitude", LONLAT: "Longitude, latitude" },
  en: { PENZD: "Point, easting, northing", PNEZD: "Point, northing, easting", ENZD: "Easting, northing", NEZD: "Northing, easting", PLATLON: "Point, latitude, longitude", PLONLAT: "Point, longitude, latitude", LATLON: "Latitude, longitude", LONLAT: "Longitude, latitude" },
} as const;

const OFFSETS = [[0, 0], [35, 6], [41, -30], [14, -44], [-4, -28]];
const exampleText = (e0: number, n0: number, names: string[]) =>
  OFFSETS.map(([de, dn], i) => `${names[i]}\t${(e0 + de).toFixed(3)}\t${(n0 + dn).toFixed(3)}`).join("\n");

const labels: Record<Locale, ParcelLabels> = {
  es: {
    modeCoords: "Por coordenadas",
    modeMeasures: "Por medidas (sin coordenadas)",
    system: "Sistema de coordenadas",
    systems: { utm: "UTM", geo: "Geográficas", local: "Locales (plano)" },
    datum: "Datum",
    datums: { wgs84: "WGS 84 (GPS)", sirgas2000: "SIRGAS 2000", nad83: "NAD83 (Norteamérica)", psad56: "PSAD56 (Perú)", sad69: "SAD69 (Brasil)" },
    datumOrder: ["wgs84", "psad56", "sirgas2000", "sad69", "nad83"],
    zone: "Zona",
    hemisphere: "Hemisferio",
    north: "Norte",
    south: "Sur",
    units: "Unidades",
    meters: "Metros",
    feet: "Pies",
    order: "Orden de columnas",
    orders: orders.es,
    paste: "Pega los vértices en orden, una fila por vértice",
    pasteHint: "Copia las columnas desde Excel y pégalas aquí. Ejemplo:\nA    717200.000    9102850.000",
    loadExample: "Cargar ejemplo",
    clear: "Limpiar",
    importDxf: "Importar DXF",
    importDxfHint: "¿El terreno está dibujado en AutoCAD? Guárdalo como DXF e impórtalo: leemos sus polilíneas.",
    dxfOption: "Capa «{layer}» · {n} vértices · {area} m²",
    dxfChoose: "El dibujo tiene varias polilíneas. Elige la del terreno:",
    dxfUse: "Usar esta",
    dxfErrors: {
      binary: "Es un DXF binario: vuelve a guardarlo como DXF de texto (ASCII).",
      noEntities: "No pudimos leer el archivo: no parece un DXF válido.",
      none: "El DXF no tiene polilíneas de 3 o más vértices. Une las líneas del borde con el comando EMPALMEPOL/PEDIT (opción Juntar).",
      dwg: "Los archivos DWG no se pueden leer en el navegador. En AutoCAD, usa GUARDARCOMO y elige el tipo DXF.",
    },
    dxfArcs: "La polilínea tiene tramos en arco: se tomaron como rectas entre sus extremos. Si el arco es importante, densifica la curva en AutoCAD.",
    dxfOpen: "abierta (se cierra al calcular)",
    figure: "Forma del terreno",
    triangle: "Triángulo (3 lados)",
    quad: "Cuadrilátero (4 lados + diagonal)",
    side: "Lado",
    diagonal: "Diagonal",
    measuresHint: "Con 4 lados el área no queda definida: mide también la diagonal A-C, de esquina a esquina. Los vértices van en orden alrededor del terreno, con A-B como frente.",
    measureErrors: {
      invalid: "Ingresa todas las medidas, mayores que cero.",
      abc: "Las medidas A-B, B-C y la diagonal no forman un triángulo: revisa que cada una sea menor que la suma de las otras dos.",
      acd: "Las medidas C-D, D-A y la diagonal no forman un triángulo: revisa que cada una sea menor que la suma de las otras dos.",
    },
    title: "Predio (opcional)",
    titlePlaceholder: "Ej.: Lote 5, Mz. B, Urb. Los Pinos, Trujillo",
    elevation: "Cota media (m, opcional)",
    elevationHint: "Para el área en el terreno.",
    displayUnit: "Unidades",
    results: "Resultado",
    empty: "Pega los vértices del terreno para ver el resultado.",
    area: "Área",
    perimeter: "Perímetro",
    vertices: "Vértices",
    clockwise: "Sentido horario",
    counterclockwise: "Sentido antihorario",
    groundArea: "En el terreno (cota {h} m): {area} · factor de escala combinado {factor}.",
    angleCheck: "Suma de ángulos internos: {sum}. El polígono cierra.",
    geoNote: "Las coordenadas geográficas se convirtieron a UTM zona {zone} para calcular.",
    errors: {
      few: "Se necesitan al menos 3 vértices distintos.",
      zeroArea: "Los vértices están alineados: el área es cero.",
      selfIntersecting: "Los lados {a} y {b} se cruzan: revisa el orden de los vértices.",
      zone: "Elige una zona UTM válida.",
    },
    badRows: "{n} fila(s) no se pudieron leer y no se cuentan (filas {lines}).",
    neighbors: "Linderos: ¿con quién colinda cada lado?",
    neighborsHint: "Opcional. Lo que escribas aparece en la memoria descriptiva.",
    neighborPlaceholder: "Ej.: Calle Los Pinos, Lote 6…",
    faces: { N: "Norte", E: "Este", S: "Sur", W: "Oeste" },
    relativeFaces: { S: "Frente", E: "Derecha", W: "Izquierda", N: "Fondo" },
    description: "Memoria descriptiva",
    copy: "Copiar texto",
    copied: "Copiado",
    exportDocx: "Descargar memoria (Word)",
    exportDxf: "Descargar plano (DXF)",
    exportExcel: "Descargar Excel",
    mapTitle: "Verifica el terreno en el mapa",
    mapHint: "Si el polígono aparece en otro lugar, revisa la zona, el hemisferio o el orden de columnas.",
    sketchTitle: "Croquis del terreno",
    fileBase: "terreno-zeist",
    xlsx: {
      sheet: "Cuadro de datos técnicos",
      boundaries: "Linderos",
      generatedBy: generatedBy("es", "Generado con la calculadora de área de terreno de Zeist"),
      side: "Lado",
      length: "Distancia (m)",
      facing: "Orientación",
      neighbor: "Colinda con",
      area: "Área",
      perimeter: "Perímetro",
    },
    cta: {
      title: "¿Planos perimétricos cada semana?",
      body: "Un plugin de Civil 3D genera el plano, el cuadro y la memoria desde el dibujo, con tu formato.",
      button: "Hablemos por WhatsApp",
      prefill: "Hola Zeist. Calculé un terreno de {area} ({n} vértices) con su calculadora. Me interesa automatizar planos perimétricos y memorias descriptivas.",
    },
    vertexNames: "letters",
    example: {
      text: exampleText(717200, 9102850, ["A", "B", "C", "D", "E"]),
      order: "PENZD",
      system: { kind: "utm", datum: "wgs84", zone: "17", south: true },
      title: "Lote 5, Mz. B, Urb. Los Pinos, Trujillo",
      neighbors: ["Calle Los Pinos", "Lote 6", "Pasaje Las Flores", "Pasaje Las Flores", "Lote 4"],
      elevation: "34",
      measures: { ab: "30.00", bc: "21.50", cd: "27.80", da: "19.60", ac: "37.40", ca: "25.00" },
    },
  },
  pt: {
    modeCoords: "Por coordenadas",
    modeMeasures: "Por medidas (sem coordenadas)",
    system: "Sistema de coordenadas",
    systems: { utm: "UTM", geo: "Geográficas", local: "Locais (plano)" },
    datum: "Datum",
    datums: { wgs84: "WGS 84 (GPS)", sirgas2000: "SIRGAS 2000", nad83: "NAD83 (América do Norte)", psad56: "PSAD56 (Peru)", sad69: "SAD69" },
    datumOrder: ["sirgas2000", "sad69", "wgs84", "psad56", "nad83"],
    zone: "Fuso",
    hemisphere: "Hemisfério",
    north: "Norte",
    south: "Sul",
    units: "Unidades",
    meters: "Metros",
    feet: "Pés",
    order: "Ordem das colunas",
    orders: orders.pt,
    paste: "Cole os vértices em ordem, uma linha por vértice",
    pasteHint: "Copie as colunas do Excel e cole aqui. Exemplo:\nV1    333500,000    7394700,000",
    loadExample: "Carregar exemplo",
    clear: "Limpar",
    importDxf: "Importar DXF",
    importDxfHint: "O terreno está desenhado no AutoCAD? Salve como DXF e importe: lemos as polilinhas.",
    dxfOption: "Camada «{layer}» · {n} vértices · {area} m²",
    dxfChoose: "O desenho tem várias polilinhas. Escolha a do terreno:",
    dxfUse: "Usar esta",
    dxfErrors: {
      binary: "É um DXF binário: salve de novo como DXF de texto (ASCII).",
      noEntities: "Não foi possível ler o arquivo: não parece um DXF válido.",
      none: "O DXF não tem polilinhas com 3 ou mais vértices. Una as linhas do contorno com o comando PEDIT (opção Juntar).",
      dwg: "Arquivos DWG não podem ser lidos no navegador. No AutoCAD, use SALVARCOMO e escolha o tipo DXF.",
    },
    dxfArcs: "A polilinha tem trechos em arco: foram tomados como retas entre os extremos. Se o arco importa, densifique a curva no AutoCAD.",
    dxfOpen: "aberta (é fechada no cálculo)",
    figure: "Forma do terreno",
    triangle: "Triângulo (3 lados)",
    quad: "Quadrilátero (4 lados + diagonal)",
    side: "Lado",
    diagonal: "Diagonal",
    measuresHint: "Com 4 lados a área não fica definida: meça também a diagonal V1-V3, de canto a canto. Os vértices seguem em ordem ao redor do terreno, com V1-V2 como frente.",
    measureErrors: {
      invalid: "Informe todas as medidas, maiores que zero.",
      abc: "As medidas V1-V2, V2-V3 e a diagonal não formam um triângulo: cada uma deve ser menor que a soma das outras duas.",
      acd: "As medidas V3-V4, V4-V1 e a diagonal não formam um triângulo: cada uma deve ser menor que a soma das outras duas.",
    },
    title: "Imóvel (opcional)",
    titlePlaceholder: "Ex.: Lote 05, Quadra B, Jardim das Flores, São Paulo/SP",
    elevation: "Altitude média (m, opcional)",
    elevationHint: "Para a área no terreno.",
    displayUnit: "Unidades",
    results: "Resultado",
    empty: "Cole os vértices do terreno para ver o resultado.",
    area: "Área",
    perimeter: "Perímetro",
    vertices: "Vértices",
    clockwise: "Sentido horário",
    counterclockwise: "Sentido anti-horário",
    groundArea: "No terreno (altitude {h} m): {area} · fator de escala combinado {factor}.",
    angleCheck: "Soma dos ângulos internos: {sum}. O polígono fecha.",
    geoNote: "As coordenadas geográficas foram convertidas para UTM fuso {zone} para o cálculo.",
    errors: {
      few: "São necessários pelo menos 3 vértices distintos.",
      zeroArea: "Os vértices estão alinhados: a área é zero.",
      selfIntersecting: "Os lados {a} e {b} se cruzam: confira a ordem dos vértices.",
      zone: "Escolha um fuso UTM válido.",
    },
    badRows: "{n} linha(s) não puderam ser lidas e não contam (linhas {lines}).",
    neighbors: "Confrontantes: com quem confronta cada lado?",
    neighborsHint: "Opcional. O que você escrever aparece no memorial descritivo.",
    neighborPlaceholder: "Ex.: Rua das Flores, Lote 06…",
    faces: { N: "Norte", E: "Leste", S: "Sul", W: "Oeste" },
    relativeFaces: { S: "Frente", E: "Direita", W: "Esquerda", N: "Fundos" },
    description: "Memorial descritivo",
    copy: "Copiar texto",
    copied: "Copiado",
    exportDocx: "Baixar memorial (Word)",
    exportDxf: "Baixar planta (DXF)",
    exportExcel: "Baixar Excel",
    mapTitle: "Confira o terreno no mapa",
    mapHint: "Se o polígono aparecer em outro lugar, confira o fuso, o hemisfério ou a ordem das colunas.",
    sketchTitle: "Croqui do terreno",
    fileBase: "terreno-zeist",
    xlsx: {
      sheet: "Quadro de coordenadas",
      boundaries: "Confrontantes",
      generatedBy: generatedBy("pt", "Gerado com a calculadora de área de terreno da Zeist"),
      side: "Lado",
      length: "Distância (m)",
      facing: "Orientação",
      neighbor: "Confrontante",
      area: "Área",
      perimeter: "Perímetro",
    },
    cta: {
      title: "Memoriais e plantas toda semana?",
      body: "Um plugin de Civil 3D gera a planta, o quadro e o memorial a partir do desenho, no seu padrão.",
      button: "Vamos conversar pelo WhatsApp",
      prefill: "Olá Zeist. Calculei um terreno de {area} ({n} vértices) com a calculadora de vocês. Tenho interesse em automatizar plantas e memoriais descritivos.",
    },
    vertexNames: "V",
    example: {
      text: exampleText(333500, 7394700, ["V1", "V2", "V3", "V4", "V5"]),
      order: "PENZD",
      system: { kind: "utm", datum: "sirgas2000", zone: "23", south: true },
      title: "Lote 05, Quadra B, Jardim das Flores, São Paulo/SP",
      neighbors: ["Rua das Flores", "Lote 06", "Viela 2", "Viela 2", "Lote 04"],
      elevation: "760",
      measures: { ab: "30,00", bc: "21,50", cd: "27,80", da: "19,60", ac: "37,40", ca: "25,00" },
    },
  },
  en: {
    modeCoords: "By coordinates",
    modeMeasures: "By measurements (no coordinates)",
    system: "Coordinate system",
    systems: { utm: "UTM", geo: "Lat/long", local: "Local / plane (e.g. State Plane)" },
    datum: "Datum",
    datums: { wgs84: "WGS 84 (GPS)", sirgas2000: "SIRGAS 2000", nad83: "NAD83 (≈ WGS 84)", psad56: "PSAD56 (Peru)", sad69: "SAD69 (Brazil)" },
    datumOrder: ["wgs84", "nad83", "sirgas2000", "psad56", "sad69"],
    zone: "Zone",
    hemisphere: "Hemisphere",
    north: "North",
    south: "South",
    units: "Units",
    meters: "Meters",
    feet: "Feet",
    order: "Column order",
    orders: orders.en,
    paste: "Paste the points in order, one row per point",
    pasteHint: "Copy the columns from Excel and paste them here. Example:\n1    583900.000    4507300.000",
    loadExample: "Load example",
    clear: "Clear",
    importDxf: "Import DXF",
    importDxfHint: "Lot already drawn in AutoCAD? Save it as DXF and import it: we read its polylines.",
    dxfOption: "Layer “{layer}” · {n} points · {area} sq units",
    dxfChoose: "The drawing has several polylines. Pick the lot boundary:",
    dxfUse: "Use this one",
    dxfErrors: {
      binary: "This is a binary DXF: save it again as an ASCII (text) DXF.",
      noEntities: "We couldn't read the file: it doesn't look like a valid DXF.",
      none: "The DXF has no polylines with 3 or more points. Join the boundary lines with PEDIT (Join option).",
      dwg: "DWG files can't be read in the browser. In AutoCAD, use SAVEAS and choose the DXF type.",
    },
    dxfArcs: "The polyline has arc segments: they were taken as straight chords. If the arc matters, densify the curve in AutoCAD.",
    dxfOpen: "open (closed for the calculation)",
    figure: "Lot shape",
    triangle: "Triangle (3 sides)",
    quad: "Quadrilateral (4 sides + diagonal)",
    side: "Side",
    diagonal: "Diagonal",
    measuresHint: "With 4 sides the area is not determined: also measure diagonal 1–3, corner to corner. Points go in order around the lot, with 1–2 as the front.",
    measureErrors: {
      invalid: "Enter every measurement, greater than zero.",
      abc: "Sides 1–2, 2–3 and the diagonal don't form a triangle: each must be shorter than the other two combined.",
      acd: "Sides 3–4, 4–1 and the diagonal don't form a triangle: each must be shorter than the other two combined.",
    },
    title: "Parcel (optional)",
    titlePlaceholder: "E.g.: Lot 5, Block 12, Maple Street subdivision",
    elevation: "Mean elevation (m, optional)",
    elevationHint: "For the ground area.",
    displayUnit: "Report in",
    results: "Result",
    empty: "Paste the lot points to see the result.",
    area: "Area",
    perimeter: "Perimeter",
    vertices: "Points",
    clockwise: "Clockwise",
    counterclockwise: "Counterclockwise",
    groundArea: "At ground level (elevation {h} m): {area} · combined scale factor {factor}.",
    angleCheck: "Sum of interior angles: {sum}. The polygon closes.",
    geoNote: "Lat/long coordinates were converted to UTM Zone {zone} for the calculation.",
    errors: {
      few: "At least 3 distinct points are needed.",
      zeroArea: "The points are collinear: the area is zero.",
      selfIntersecting: "Sides {a} and {b} cross: check the order of the points.",
      zone: "Choose a valid UTM zone.",
    },
    badRows: "{n} row(s) couldn't be read and are skipped (rows {lines}).",
    neighbors: "Adjoiners: who borders each side?",
    neighborsHint: "Optional. What you type appears in the legal description.",
    neighborPlaceholder: "E.g.: Maple Street, Lot 6…",
    faces: { N: "North", E: "East", S: "South", W: "West" },
    relativeFaces: { S: "Front", E: "Right", W: "Left", N: "Rear" },
    description: "Legal description",
    copy: "Copy text",
    copied: "Copied",
    exportDocx: "Download description (Word)",
    exportDxf: "Download plat (DXF)",
    exportExcel: "Download Excel",
    mapTitle: "Check the lot on the map",
    mapHint: "If the polygon lands somewhere else, check the zone, the hemisphere or the column order.",
    sketchTitle: "Lot sketch",
    fileBase: "lot-zeist",
    xlsx: {
      sheet: "Table of courses",
      boundaries: "Adjoiners",
      generatedBy: generatedBy("en", "Generated with the Zeist area from coordinates calculator"),
      side: "Course",
      length: "Distance",
      facing: "Facing",
      neighbor: "Adjoiner",
      area: "Area",
      perimeter: "Perimeter",
    },
    cta: {
      title: "Drafting plats every week?",
      body: "A Civil 3D plugin generates the plat, the table and the legal description from the drawing, in your format.",
      button: "Let's talk on WhatsApp",
      prefill: "Hi Zeist. I calculated a lot of {area} ({n} points) with your calculator. I'm interested in automating plats and legal descriptions.",
    },
    vertexNames: "numbers",
    example: {
      text: exampleText(583900, 4507300, ["1", "2", "3", "4", "5"]),
      order: "PENZD",
      system: { kind: "utm", datum: "wgs84", zone: "18", south: false },
      title: "Lot 5, Block 12, Maple Street subdivision",
      neighbors: ["Maple Street", "Lot 6", "Lot 12", "Lot 12", "Lot 4"],
      elevation: "10",
      measures: { ab: "30.00", bc: "21.50", cd: "27.80", da: "19.60", ac: "37.40", ca: "25.00" },
    },
  },
};

export function getParcelContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getParcelLabels(locale: Locale): ParcelLabels {
  return labels[locale];
}
