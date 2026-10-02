import type { Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import type { CoordLabels } from "@/components/tools/coordinate-converter";
import type { ToolContent } from "@/lib/tools-content/types";

// Coordinate converter — es / pt / en, each tuned to its market: Peru (UTM 17-19 S,
// PSAD56), Brazil (fusos 18-25, SAD69 → SIRGAS 2000) and the US (zones 10-19 N,
// NAD83). Every number in the copy comes from lib/tools/coordinates.ts, which
// scripts/test-tools.mjs checks against PROJ; the worked examples match the
// converter's preloaded inputs. Change them together.

const SLUG = "conversor-de-coordenadas";

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Conversor de coordenadas UTM a geográficas",
    metaDescription:
      "Convierte coordenadas UTM a geográficas y PSAD56 a WGS84, de un punto o cientos desde Excel. Exporta a Civil 3D, Excel y Google Earth, con mapa. Gratis.",
    keywords: [
      "conversor de coordenadas",
      "convertir coordenadas utm a geográficas",
      "psad56 a wgs84",
      "coordenadas utm a latitud y longitud",
      "importar coordenadas a civil 3d",
      "convertir coordenadas en excel",
      "factor de escala utm",
    ],
    name: "Conversor de coordenadas",
    eyebrow: "Herramienta gratuita · Topografía y Civil 3D",
    h1: "Conversor de coordenadas UTM a geográficas, por lotes y listo para Civil 3D",
    intro:
      "Convierte coordenadas UTM y geográficas, y de PSAD56 a WGS84, para un punto o para cientos pegados desde Excel. Comprueba los puntos en el mapa y descárgalos listos para importar en Civil 3D, Excel o Google Earth.",
    badges: ["Gratis y sin registro", "Lotes desde Excel", "Exporta a Civil 3D (PNEZD)", "PSAD56 → WGS84"],
    calculatorTitle: "Conversor de coordenadas UTM y geográficas",
    answer:
      "Para convertir coordenadas UTM a geográficas se aplica la proyección transversa de Mercator inversa sobre el elipsoide del datum: con la zona (en el Perú, la 17, 18 o 19 sur), el Este y el Norte se obtienen la latitud y la longitud. Si las coordenadas están en PSAD56, además hay que cambiarlas de datum: en Trujillo, pasar de PSAD56 a WGS84 desplaza un punto unos 250 m al oeste y 370 m al sur. Esta herramienta hace las dos cosas para un punto o cientos a la vez y exporta el resultado para Civil 3D, Excel y Google Earth.",
    sections: [
      {
        id: "zonas-utm-peru",
        title: "Zonas UTM del Perú",
        blocks: [
          {
            type: "p",
            text: "El Perú ocupa tres zonas UTM, todas en el hemisferio sur. Cada zona mide 6° de longitud y tiene su propio meridiano central, así que el mismo Este se repite en zonas distintas: indica siempre la zona junto a las coordenadas.",
          },
          {
            type: "table",
            head: ["Zona", "Longitudes", "Meridiano central", "Ciudades"],
            rows: [
              ["17 S", "84° O – 78° O", "81° O", "Piura, Chiclayo, Trujillo, Cajamarca"],
              ["18 S", "78° O – 72° O", "75° O", "Lima, Huaraz, Huancayo, Ayacucho, Iquitos"],
              ["19 S", "72° O – 66° O", "69° O", "Cusco, Arequipa, Puno, Tacna, Puerto Maldonado"],
            ],
          },
          {
            type: "p",
            text: "Si un proyecto cruza el límite entre dos zonas, se trabaja todo en una sola. Para eso el conversor permite forzar la zona de destino en lugar de calcularla punto por punto.",
          },
        ],
      },
      {
        id: "psad56-wgs84",
        title: "PSAD56 y WGS84: por qué tus coordenadas antiguas no calzan",
        blocks: [
          {
            type: "p",
            text: "PSAD56 (Datum Provisional Sudamericano de 1956) es el datum de la cartografía y de muchos planos antiguos del Perú. WGS84, el del GPS, es hoy el estándar junto con SIRGAS. No usan el mismo elipsoide ni el mismo origen, así que un mismo punto tiene coordenadas distintas en cada uno.",
          },
          {
            type: "p",
            text: "La diferencia no es pequeña: en Trujillo, un punto en PSAD56 queda unos **250 m al oeste y 370 m al sur** al pasarlo a WGS84, casi 450 m en total. Por eso un plano antiguo no calza sobre Google Earth ni sobre un levantamiento con GPS.",
          },
          {
            type: "table",
            caption: "Plaza de Armas de Trujillo en los dos datums",
            head: ["Datum · zona", "Este (m)", "Norte (m)"],
            numeric: [false, true, true],
            rows: [
              ["PSAD56 · 17 S", "717468.678", "9103201.990"],
              ["WGS84 · 17 S", "717217.575", "9102831.613"],
            ],
          },
          {
            type: "callout",
            title: "Precisión del cambio de datum",
            text: "El conversor usa la transformación del registro EPSG para el Perú, PSAD56 to WGS 84 (8): ΔX = −279 m, ΔY = 175 m, ΔZ = −379 m, con una precisión de ±16 m. Sirve para ubicar planos antiguos y compararlos con Google Earth. Para replanteo o linderos, enlaza el trabajo a puntos de control con coordenadas en ambos sistemas.",
          },
        ],
      },
      {
        id: "civil-3d",
        title: "Cómo importar las coordenadas en Civil 3D",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Elige **UTM** como destino y descarga el archivo **Civil 3D (PNEZD)**: punto, Norte, Este, cota y descripción, separados por comas.",
              "En la configuración del dibujo (unidades y zona), asigna el sistema de coordenadas de tu zona; por ejemplo, UTM84-17S para WGS84 zona 17 sur.",
              "En la pestaña **Insertar** de la barra superior, elige **Puntos de archivo** (en inglés, Points from File).",
              "Selecciona el formato **PNEZD (delimitado por comas)**, agrega el archivo descargado y acepta.",
            ],
          },
          {
            type: "p",
            text: "Si tus puntos se llaman con letras (BM-1, E-3), el archivo los renumera, porque el formato PNEZD de Civil 3D exige números, y conserva el nombre original en la descripción.",
          },
          {
            type: "p",
            text: "¿Importas levantamientos cada semana? Mira cómo [automatizar Civil 3D](/es/blog/automatizar-civil-3d-guia-completa) para pasar de los puntos a la superficie, los perfiles y los planos sin tareas manuales.",
          },
        ],
      },
      {
        id: "factor-de-escala",
        title: "Factor de escala: distancias UTM y distancias de campo",
        blocks: [
          {
            type: "p",
            text: "UTM es una proyección: una distancia medida en el plano UTM no es igual a la distancia en el terreno. La diferencia la dan el **factor de escala** del punto (k), que vale 0.9996 en el meridiano central y crece al alejarse de él, y el **factor de elevación**, que corrige la altura. Su producto es el **factor combinado**.",
          },
          { type: "formula", text: "distancia de campo = distancia UTM ÷ factor combinado" },
          {
            type: "p",
            text: "En la Plaza de Armas de Trujillo, a 2° del meridiano central de la zona 17 y a 34 m de altura, el factor combinado es 1.00017862: 1000 m medidos en campo equivalen a 1000.18 m en coordenadas UTM. El conversor muestra el factor de escala, la convergencia de cuadrícula y, si ingresas la cota, el factor combinado de cada punto.",
          },
          {
            type: "p",
            text: "La cota se usa como altura sobre el elipsoide. Se ignora la ondulación del geoide, que cambia el factor en unas 5 partes por millón por cada 30 m.",
          },
        ],
      },
      {
        id: "formatos",
        title: "Grados decimales y grados, minutos y segundos",
        blocks: [
          {
            type: "p",
            text: "Para pasar de grados decimales a GMS: los grados son la parte entera; los minutos, la parte decimal por 60; y los segundos, lo que sobra de los minutos por 60. El signo se convierte en la letra del hemisferio: negativo es sur u oeste.",
          },
          { type: "formula", text: `−8.111650° = 8° 06' 41.940" S` },
          {
            type: "p",
            text: `Puedes escribir las coordenadas en cualquier formato: −8.11165, 8°06'41.94"S, 8 6 41.94 S o con coma decimal.`,
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Del campo a Civil 3D",
      title: "¿Procesas levantamientos cada semana? Automatizamos el paso a Civil 3D.",
      body: "Desarrollamos plugins que importan tus levantamientos con tus códigos de campo, generan la superficie, aplican tus estilos y dejan los puntos listos para el diseño, sin pasos manuales.",
      prefill:
        "Hola Zeist. Vengo del conversor de coordenadas. Me interesa automatizar la importación de levantamientos a Civil 3D.",
      secondaryLabel: "Ver plugins a medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "¿Cómo convierto coordenadas UTM a geográficas?",
        a: "Elige UTM como origen, indica la zona y el hemisferio (en el Perú, 17, 18 o 19 sur), escribe el Este y el Norte y elige Geográficas como destino. La herramienta devuelve la latitud y la longitud en grados decimales y en grados, minutos y segundos.",
      },
      {
        q: "¿En qué zona UTM está mi proyecto?",
        a: "Depende de la longitud. En el Perú, la zona 17 va de 84° a 78° oeste (Piura, Chiclayo, Trujillo), la 18 de 78° a 72° oeste (Lima, Huancayo) y la 19 de 72° a 66° oeste (Cusco, Arequipa, Puno). Si conviertes desde geográficas, la herramienta calcula la zona sola.",
      },
      {
        q: "¿Cómo paso coordenadas de PSAD56 a WGS84?",
        a: "Elige PSAD56 como datum de origen y WGS84 como datum de destino; puedes quedarte en UTM en los dos lados. La herramienta aplica la transformación EPSG para el Perú, con una precisión de unos ±16 m.",
      },
      {
        q: "¿Puedo convertir muchos puntos a la vez?",
        a: "Sí. En el modo «Varios puntos», copia las columnas desde Excel, pégalas y elige el orden de columnas (por ejemplo, P, N, E, Z, D). La herramienta convierte todos los puntos, marca las filas con errores y los muestra en el mapa.",
      },
      {
        q: "¿Cómo importo los puntos en Civil 3D?",
        a: "Descarga el archivo «Civil 3D (PNEZD)» e impórtalo desde Insertar > Puntos de archivo, con el formato PNEZD (delimitado por comas). Antes, asigna al dibujo el sistema UTM de tu zona.",
      },
      {
        q: "¿Qué es el factor de escala combinado?",
        a: "Es el producto del factor de escala UTM y del factor de elevación del punto. Si divides una distancia UTM entre ese factor, obtienes la distancia en el terreno.",
      },
      {
        q: "¿Mis coordenadas se envían a algún servidor?",
        a: "No. La conversión se hace en tu navegador y los puntos no se envían a nuestros servidores. El mapa descarga de OpenStreetMap las imágenes de la zona que muestra, y el historial se guarda solo en tu equipo.",
      },
    ],
    guides: [
      "coordenadas-utm-trujillo-la-libertad",
      "automatizar-civil-3d-guia-completa",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "produccion-planos-automatica-civil-3d-revit",
      "deja-de-usar-excel-y-perder-horas",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Conversor de coordenadas UTM para geográficas",
    metaDescription:
      "Converta coordenadas UTM em geográficas e SAD69 em SIRGAS 2000, um ponto ou centenas do Excel. Exporte para Civil 3D, Excel e Google Earth, com mapa.",
    keywords: [
      "conversor de coordenadas",
      "converter coordenadas utm para geográficas",
      "sad69 para sirgas 2000",
      "coordenadas utm para graus minutos e segundos",
      "importar pontos no civil 3d",
      "converter coordenadas no excel",
      "fator de escala utm",
    ],
    name: "Conversor de coordenadas",
    eyebrow: "Ferramenta gratuita · Topografia e Civil 3D",
    h1: "Conversor de coordenadas UTM para geográficas, em lote e pronto para o Civil 3D",
    intro:
      "Converta coordenadas UTM e geográficas, e de SAD69 para SIRGAS 2000, para um ponto ou para centenas coladas do Excel. Confira os pontos no mapa e baixe tudo pronto para importar no Civil 3D, no Excel ou no Google Earth.",
    badges: ["Grátis e sem cadastro", "Lotes do Excel", "Exporta para o Civil 3D (PNEZD)", "SAD69 → SIRGAS 2000"],
    calculatorTitle: "Conversor de coordenadas UTM e geográficas",
    answer:
      "Para converter coordenadas UTM em geográficas, aplica-se a projeção transversa de Mercator inversa sobre o elipsoide do datum: com o fuso (no Brasil, do 18 ao 25), o E e o N obtêm-se a latitude e a longitude. Se as coordenadas estão em SAD69, também é preciso mudar de datum: em São Paulo, passar de SAD69 para SIRGAS 2000 desloca um ponto cerca de 45 m para oeste e 46 m para o sul. Esta ferramenta faz as duas coisas para um ponto ou centenas de uma vez e exporta o resultado para Civil 3D, Excel e Google Earth.",
    sections: [
      {
        id: "fusos-utm-brasil",
        title: "Fusos UTM do Brasil",
        blocks: [
          {
            type: "p",
            text: "O Brasil ocupa oito fusos UTM, do 18 ao 25. Cada fuso mede 6° de longitude e tem o seu meridiano central, então o mesmo E se repete em fusos diferentes: informe sempre o fuso junto com as coordenadas. Roraima e partes do Amapá, do Amazonas e do Pará ficam no hemisfério norte.",
          },
          {
            type: "table",
            head: ["Fuso", "Longitudes", "Meridiano central", "Cidades"],
            rows: [
              ["18", "78° O – 72° O", "75° O", "Extremo oeste do Acre"],
              ["19", "72° O – 66° O", "69° O", "Rio Branco"],
              ["20", "66° O – 60° O", "63° O", "Manaus, Porto Velho, Boa Vista (norte)"],
              ["21", "60° O – 54° O", "57° O", "Cuiabá, Santarém"],
              ["22", "54° O – 48° O", "51° O", "Porto Alegre, Curitiba, Goiânia, Belém"],
              ["23", "48° O – 42° O", "45° O", "São Paulo, Rio de Janeiro, Belo Horizonte, Brasília"],
              ["24", "42° O – 36° O", "39° O", "Salvador, Fortaleza"],
              ["25", "36° O – 30° O", "33° O", "Recife, Natal, João Pessoa"],
            ],
          },
          {
            type: "p",
            text: "Se um projeto cruza o limite entre dois fusos, trabalha-se tudo em um só. Para isso, o conversor permite fixar o fuso de destino em vez de calculá-lo ponto a ponto.",
          },
        ],
      },
      {
        id: "sad69-sirgas",
        title: "SAD69 e SIRGAS 2000: por que as coordenadas antigas não batem",
        blocks: [
          {
            type: "p",
            text: "O SAD69 foi o datum oficial do Brasil por décadas, e muitas plantas e bases cartográficas ainda estão nele. Desde 2015, o SIRGAS 2000 é o único sistema geodésico oficial do país. Os dois usam elipsoides e origens diferentes, então o mesmo ponto tem coordenadas distintas em cada um.",
          },
          {
            type: "p",
            text: "Em São Paulo, um ponto em SAD69 fica cerca de **45 m a oeste e 46 m ao sul** ao passar para SIRGAS 2000, uns 64 m no total. Por isso uma planta antiga não bate com o Google Earth nem com um levantamento GNSS.",
          },
          {
            type: "table",
            caption: "Praça da Sé, em São Paulo, nos dois datums",
            head: ["Datum · fuso", "E (m)", "N (m)"],
            numeric: [false, true, true],
            rows: [
              ["SAD69 · 23 S", "333331,990", "7394631,815"],
              ["SIRGAS 2000 · 23 S", "333286,919", "7394586,092"],
            ],
          },
          {
            type: "callout",
            title: "Precisão da mudança de datum",
            text: "O conversor usa os parâmetros oficiais do IBGE, registrados no EPSG como SAD69 to SIRGAS 2000 (1): ΔX = −67,35 m, ΔY = +3,88 m, ΔZ = −38,22 m, com precisão de ±5 m. Para trabalhos de precisão, como georreferenciamento de imóveis, use o ProGriD do IBGE ou pontos de controle.",
          },
        ],
      },
      {
        id: "civil-3d",
        title: "Como importar as coordenadas no Civil 3D",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Escolha **UTM** como destino e baixe o arquivo **Civil 3D (PNEZD)**: ponto, N, E, cota e descrição, separados por vírgulas.",
              "Nas configurações do desenho (unidades e zona), atribua o sistema UTM SIRGAS 2000 do seu fuso.",
              "Na guia **Inserir** da barra superior, escolha **Pontos de arquivo** (em inglês, Points from File).",
              "Selecione o formato **PNEZD (delimitado por vírgulas)**, adicione o arquivo baixado e confirme.",
            ],
          },
          {
            type: "p",
            text: "Se os seus pontos têm letras no nome (RN-1, PV-3), o arquivo os renumera, porque o formato PNEZD do Civil 3D exige números, e mantém o nome original na descrição.",
          },
          {
            type: "p",
            text: "Importa levantamentos toda semana? Veja como [automatizar o Civil 3D](/pt/blog/automatizar-civil-3d-guia-completa) para ir dos pontos à superfície, aos perfis e às pranchas sem tarefas manuais.",
          },
        ],
      },
      {
        id: "fator-de-escala",
        title: "Fator de escala: distâncias UTM e distâncias de campo",
        blocks: [
          {
            type: "p",
            text: "UTM é uma projeção: uma distância medida no plano UTM não é igual à distância no terreno. A diferença vem do **fator de escala** do ponto (k), que vale 0,9996 no meridiano central e cresce ao se afastar dele, e do **fator de elevação**, que corrige a altitude. O produto dos dois é o **fator combinado**.",
          },
          { type: "formula", text: "distância de campo = distância UTM ÷ fator combinado" },
          {
            type: "p",
            text: "Na Praça da Sé, a 1,6° do meridiano central do fuso 23 e a 760 m de altitude, o fator combinado é 0,99982392: 1000 m medidos em campo equivalem a 999,82 m em coordenadas UTM. O conversor mostra o fator de escala, a convergência meridiana e, se você informar a cota, o fator combinado de cada ponto.",
          },
          {
            type: "p",
            text: "A cota é usada como altura sobre o elipsoide. A ondulação do geoide é ignorada, o que muda o fator em cerca de 5 partes por milhão a cada 30 m.",
          },
        ],
      },
      {
        id: "formatos",
        title: "Graus decimais e graus, minutos e segundos",
        blocks: [
          {
            type: "p",
            text: "Para passar de graus decimais para GMS: os graus são a parte inteira; os minutos, a parte decimal vezes 60; e os segundos, o que sobra dos minutos vezes 60. O sinal vira a letra do hemisfério: negativo é sul ou oeste.",
          },
          { type: "formula", text: `−23,550520° = 23° 33' 01,872" S` },
          {
            type: "p",
            text: `Você pode digitar as coordenadas em qualquer formato: −23,55052, 23°33'01,87"S, 23 33 1,87 S ou com ponto decimal.`,
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Do campo ao Civil 3D",
      title: "Processa levantamentos toda semana? Automatizamos a passagem para o Civil 3D.",
      body: "Desenvolvemos plugins que importam seus levantamentos com seus códigos de campo, geram a superfície, aplicam seus estilos e deixam os pontos prontos para o projeto, sem etapas manuais.",
      prefill:
        "Olá Zeist. Vim do conversor de coordenadas. Tenho interesse em automatizar a importação de levantamentos no Civil 3D.",
      secondaryLabel: "Ver plugins sob medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "Como converto coordenadas UTM em geográficas?",
        a: "Escolha UTM como origem, informe o fuso e o hemisfério, digite o E e o N e escolha Geográficas como destino. A ferramenta devolve a latitude e a longitude em graus decimais e em graus, minutos e segundos.",
      },
      {
        q: "Em que fuso UTM fica o meu projeto?",
        a: "Depende da longitude. São Paulo, Rio de Janeiro, Belo Horizonte e Brasília ficam no fuso 23; Curitiba e Porto Alegre, no 22; Salvador e Fortaleza, no 24; Recife, no 25. Se você converter a partir de geográficas, a ferramenta calcula o fuso sozinha.",
      },
      {
        q: "Como passo coordenadas de SAD69 para SIRGAS 2000?",
        a: "Escolha SAD69 como datum de origem e SIRGAS 2000 como datum de destino; pode manter UTM nos dois lados. A ferramenta aplica os parâmetros oficiais do IBGE, com precisão de cerca de ±5 m.",
      },
      {
        q: "Posso converter muitos pontos de uma vez?",
        a: "Sim. No modo «Vários pontos», copie as colunas do Excel, cole e escolha a ordem das colunas (por exemplo, P, N, E, Z, D). A ferramenta converte todos os pontos, marca as linhas com erro e mostra tudo no mapa.",
      },
      {
        q: "Como importo os pontos no Civil 3D?",
        a: "Baixe o arquivo «Civil 3D (PNEZD)» e importe pela guia Inserir > Pontos de arquivo, com o formato PNEZD (delimitado por vírgulas). Antes, atribua ao desenho o sistema UTM do seu fuso.",
      },
      {
        q: "O que é o fator de escala combinado?",
        a: "É o produto do fator de escala UTM pelo fator de elevação do ponto. Dividindo uma distância UTM por esse fator, você obtém a distância no terreno.",
      },
      {
        q: "Minhas coordenadas são enviadas para algum servidor?",
        a: "Não. A conversão acontece no seu navegador e os pontos não são enviados aos nossos servidores. O mapa baixa do OpenStreetMap as imagens da área exibida, e o histórico fica salvo só no seu computador.",
      },
    ],
    guides: [
      "automatizar-civil-3d-guia-completa",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "produccion-planos-automatica-civil-3d-revit",
      "deja-de-usar-excel-y-perder-horas",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "UTM to Lat Long Converter (Batch, Civil 3D Export)",
    metaDescription:
      "Convert UTM to latitude/longitude and back, one point or hundreds pasted from Excel. Check them on a map and export to Civil 3D, Excel and Google Earth.",
    keywords: [
      "utm to lat long converter",
      "lat long to utm",
      "batch coordinate converter",
      "utm converter excel",
      "import points into civil 3d",
      "utm scale factor",
      "nad83 to wgs84",
    ],
    name: "UTM to lat long converter",
    eyebrow: "Free tool · Surveying and Civil 3D",
    h1: "UTM to lat long converter: batch conversion with Civil 3D export",
    intro:
      "Convert between UTM and latitude/longitude, for one point or hundreds pasted from Excel. Check the points on a map and download them ready to import into Civil 3D, Excel or Google Earth.",
    badges: ["Free, no sign-up", "Batch from Excel", "Civil 3D export (PNEZD)", "Scale factor per point"],
    calculatorTitle: "UTM and latitude/longitude converter",
    answer:
      "To convert UTM coordinates to latitude and longitude, apply the inverse transverse Mercator projection on the datum's ellipsoid: from the zone (New York is in 18N), the easting and the northing you get the latitude and longitude. Going the other way, the zone follows from the longitude: zones are 6° wide and numbered eastward from 180° W. This tool converts one point or hundreds at once, flags bad rows, shows every point on a map and exports the result for Civil 3D, Excel and Google Earth.",
    sections: [
      {
        id: "utm-zones-us",
        title: "UTM zones in the United States",
        blocks: [
          {
            type: "p",
            text: "The contiguous United States spans UTM zones 10 to 19, all in the northern hemisphere. Each zone is 6° of longitude wide with its own central meridian, so the same easting repeats in different zones: always state the zone with the coordinates.",
          },
          {
            type: "table",
            head: ["Zone", "Longitudes", "Central meridian", "Cities"],
            rows: [
              ["10N", "126° W – 120° W", "123° W", "Seattle, San Francisco"],
              ["11N", "120° W – 114° W", "117° W", "Los Angeles, Las Vegas"],
              ["12N", "114° W – 108° W", "111° W", "Phoenix, Salt Lake City"],
              ["13N", "108° W – 102° W", "105° W", "Denver, Albuquerque"],
              ["14N", "102° W – 96° W", "99° W", "Dallas, Oklahoma City"],
              ["15N", "96° W – 90° W", "93° W", "Houston, Minneapolis"],
              ["16N", "90° W – 84° W", "87° W", "Chicago, Atlanta"],
              ["17N", "84° W – 78° W", "81° W", "Miami, Pittsburgh"],
              ["18N", "78° W – 72° W", "75° W", "New York, Philadelphia, Washington DC"],
              ["19N", "72° W – 66° W", "69° W", "Boston"],
            ],
          },
          {
            type: "p",
            text: "When a project crosses a zone boundary, keep the whole job in one zone. The converter lets you force the target zone instead of computing it point by point.",
          },
        ],
      },
      {
        id: "datums",
        title: "WGS 84, NAD83 and older datums",
        blocks: [
          {
            type: "p",
            text: "GPS works in WGS 84. US mapping uses NAD83, which today differs from WGS 84 by about 1 to 2 m. The converter treats them as equivalent, following the EPSG transformation NAD83 to WGS 84 (1), rated at ±4 m. For survey-grade work between realizations, use the NGS coordinate conversion tool (NCAT).",
          },
          {
            type: "p",
            text: "For South American projects, the converter also handles legacy datums: PSAD56 to WGS 84 for Peru (EPSG, ±16 m), where the shift is about 450 m, and SAD69 to SIRGAS 2000 for Brazil (IBGE, ±5 m), where it is about 64 m.",
          },
        ],
      },
      {
        id: "civil-3d",
        title: "How to import the points into Civil 3D",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Choose **UTM** as the target and download the **Civil 3D (PNEZD)** file: point, northing, easting, elevation and description, comma delimited.",
              "In the drawing settings (units and zone), assign the coordinate system of your zone; for example, UTM84-18N for WGS 84 zone 18 north.",
              "On the **Insert** tab of the top toolbar, choose **Points from File**.",
              "Pick the **PNEZD (comma delimited)** format, add the downloaded file and confirm.",
            ],
          },
          {
            type: "p",
            text: "If your point names contain letters (BM-1, CP-3), the file renumbers them, because Civil 3D's PNEZD format requires numbers, and keeps the original name in the description.",
          },
          {
            type: "p",
            text: "Importing surveys every week? See how to [automate Civil 3D](/en/blog/automatizar-civil-3d-guia-completa) to go from points to surface, profiles and sheets without manual steps.",
          },
        ],
      },
      {
        id: "scale-factor",
        title: "Scale factor: grid distances and ground distances",
        blocks: [
          {
            type: "p",
            text: "UTM is a projection: a distance measured on the UTM grid is not the distance on the ground. The difference comes from the point's **grid scale factor** (k), which is 0.9996 on the central meridian and grows away from it, and the **elevation factor**, which corrects for height. Their product is the **combined scale factor**.",
          },
          { type: "formula", text: "ground distance = grid distance ÷ combined factor" },
          {
            type: "p",
            text: "At New York City Hall, about 1° east of the zone 18 central meridian and with an elevation of 10 m, the combined factor is 0.99968520: 1000 m measured on the ground are 999.69 m in UTM coordinates. The converter shows the scale factor, the grid convergence and, if you enter the elevation, the combined factor for every point.",
          },
          {
            type: "p",
            text: "The elevation is used as the ellipsoidal height, ignoring the geoid undulation, which shifts the factor by about 5 parts per million per 30 m.",
          },
        ],
      },
      {
        id: "formats",
        title: "Decimal degrees and degrees, minutes, seconds",
        blocks: [
          {
            type: "p",
            text: "To go from decimal degrees to DMS: the degrees are the whole part; the minutes, the decimal part times 60; and the seconds, the remainder of the minutes times 60. The sign becomes the hemisphere letter: negative is south or west.",
          },
          { type: "formula", text: `40.712800° = 40° 42' 46.080" N` },
          {
            type: "p",
            text: `You can type coordinates in any format: 40.7128, 40°42'46.08"N, 40 42 46.08 N or with a decimal comma.`,
          },
        ],
      },
    ],
    cta: {
      eyebrow: "From field to Civil 3D",
      title: "Processing surveys every week? We automate the step into Civil 3D.",
      body: "We build plugins that import your surveys with your field codes, build the surface, apply your styles and leave the points ready for design, with no manual steps.",
      prefill: "Hi Zeist. I came from your coordinate converter. I'm interested in automating survey imports into Civil 3D.",
      secondaryLabel: "See custom plugins",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "How do I convert UTM to latitude and longitude?",
        a: "Choose UTM as the source, set the zone and hemisphere, type the easting and northing, and choose Lat/long as the target. The tool returns latitude and longitude in decimal degrees and in degrees, minutes and seconds.",
      },
      {
        q: "Which UTM zone is my project in?",
        a: "It depends on the longitude: zones are 6° wide and numbered eastward from 180° W. New York and Washington DC are in 18N, Chicago in 16N, Denver in 13N and Los Angeles in 11N. If you convert from lat/long, the tool works out the zone.",
      },
      {
        q: "Can I convert many points at once?",
        a: "Yes. In batch mode, copy the columns from Excel, paste them and pick the column order (for example P, N, E, Z, D). The tool converts every point, flags rows with errors and shows them on the map.",
      },
      {
        q: "How do I import the points into Civil 3D?",
        a: "Download the “Civil 3D (PNEZD)” file and import it from Insert > Points from File, with the PNEZD (comma delimited) format. Assign your zone's UTM coordinate system to the drawing first.",
      },
      {
        q: "Is NAD83 the same as WGS 84?",
        a: "Not exactly: today they differ by about 1 to 2 m in the US. For mapping and GIS that is usually negligible, and the converter treats them as equivalent. For survey-grade work, use the NGS tools.",
      },
      {
        q: "What is the combined scale factor?",
        a: "The product of the UTM grid scale factor and the point's elevation factor. Divide a grid distance by it to get the ground distance.",
      },
      {
        q: "Are my coordinates sent to a server?",
        a: "No. The conversion runs in your browser and the points are not sent to our servers. The map downloads OpenStreetMap tiles for the area it shows, and the history is stored only on your device.",
      },
    ],
    guides: [
      "automatizar-civil-3d-guia-completa",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "produccion-planos-automatica-civil-3d-revit",
      "deja-de-usar-excel-y-perder-horas",
    ],
  },
};

const generatedBy = (locale: Locale, text: string) => `${text}: ${siteUrl}/${locale}/herramientas/${SLUG}`;

const labels: Record<Locale, CoordLabels> = {
  es: {
    modeSingle: "Un punto",
    modeBatch: "Varios puntos (desde Excel)",
    from: "De",
    to: "A",
    swap: "Invertir la conversión",
    system: "Sistema",
    utm: "UTM",
    geo: "Geográficas",
    datum: "Datum",
    datums: {
      wgs84: "WGS 84 (GPS)",
      sirgas2000: "SIRGAS 2000",
      nad83: "NAD83 (Norteamérica)",
      psad56: "PSAD56 (Perú)",
      sad69: "SAD69 (Brasil)",
    },
    datumOrder: ["wgs84", "psad56", "sirgas2000", "sad69", "nad83"],
    zone: "Zona",
    zoneAuto: "Automática",
    hemisphere: "Hemisferio",
    north: "Norte",
    south: "Sur",
    easting: "Este (E)",
    northing: "Norte (N)",
    elevation: "Cota (opcional)",
    latitude: "Latitud",
    longitude: "Longitud",
    angleHint: `Decimal o G° M' S"`,
    order: "Orden de columnas",
    orders: {
      PNEZD: "P, N, E, Z, D (Civil 3D)",
      PENZD: "P, E, N, Z, D",
      NEZD: "N, E, Z, D",
      ENZD: "E, N, Z, D",
      PLATLON: "P, latitud, longitud, Z, D",
      PLONLAT: "P, longitud, latitud, Z, D",
      LATLON: "Latitud, longitud, Z, D",
      LONLAT: "Longitud, latitud, Z, D",
    },
    paste: "Pega aquí tus puntos, una fila por punto",
    pasteHint: "Copia las columnas desde Excel y pégalas aquí. Ejemplo:\n1    9103200.000    717500.000    35.20    BM-1",
    loadExample: "Cargar ejemplo",
    clear: "Limpiar",
    detected: "{n} filas leídas · separador: {sep}",
    delimiters: { tab: "tabulación (Excel)", semicolon: "punto y coma", comma: "coma", space: "espacios" },
    results: "Resultado",
    empty: "Ingresa coordenadas para ver el resultado.",
    decimalDegrees: "Grados decimales",
    dms: "GMS",
    scale: "Factor de escala (k)",
    convergence: "Convergencia de cuadrícula",
    combined: "Factor combinado",
    combinedHint: "Ingresa la cota para obtener el factor combinado.",
    accuracy: "Cambio de datum según {source}: precisión aproximada ±{m} m.",
    copy: "Copiar",
    copied: "Copiado",
    openMaps: "Ver en Google Maps",
    errors: {
      number: "hay valores que no son números",
      range: "coordenadas fuera de rango",
      swapped: "Este y Norte (o latitud y longitud) parecen invertidos; revisa el orden de columnas",
      zone: "la zona UTM no es válida",
    },
    rowError: "Fila {line}: {error}.",
    summary: "{ok} puntos convertidos · {bad} con error",
    tableShowing: "Se muestran {shown} de {total} puntos; las descargas incluyen todos.",
    multiZone: "Los puntos caen en varias zonas UTM ({zones}). Para Civil 3D, fuerza una sola zona en el destino.",
    renumbered:
      "Civil 3D exige números de punto en el formato PNEZD: al descargar, los puntos se renumeran y el nombre original pasa a la descripción.",
    exportCivil3d: "Descargar para Civil 3D (PNEZD)",
    exportCsv: "Descargar CSV",
    exportExcel: "Descargar Excel",
    exportKml: "Descargar KML (Google Earth)",
    mapTitle: "Verifica tus puntos en el mapa",
    mapHint: "Si un punto cae en el mar, revisa la zona, el hemisferio o el orden de columnas.",
    recent: "Tus conversiones recientes",
    recentHint: "Se guardan solo en este navegador.",
    restore: "Restaurar",
    points: "{n} punto(s)",
    cols: { p: "Punto", e: "Este", n: "Norte", lat: "Latitud", lon: "Longitud", z: "Cota", d: "Descripción", zone: "Zona", k: "k" },
    xlsx: {
      fileName: "coordenadas-zeist.xlsx",
      sheet: "Coordenadas",
      generatedBy: generatedBy("es", "Generado con el conversor de coordenadas de Zeist"),
    },
    kmlName: "Puntos convertidos (Zeist)",
    cta: {
      title: "¿Levantamientos completos cada semana?",
      body: "Un plugin de Civil 3D importa tus puntos con tus códigos, genera la superficie y aplica tus estilos, sin pasos manuales.",
      button: "Hablemos por WhatsApp",
      prefill:
        "Hola Zeist. Convertí {n} punto(s) con su conversor de coordenadas. Me interesa automatizar la importación de levantamientos a Civil 3D.",
    },
    hemi: { n: "N", s: "S", e: "E", w: "O" },
    example: {
      single: { e: "717217.575", n: "9102831.613", z: "34", zone: 17, south: true, datum: "wgs84" },
      batch: {
        text: "1\t9103200.000\t717500.000\t35.20\tBM-1\n2\t9103250.500\t717560.250\t35.85\tEsquina A\n3\t9103195.300\t717620.800\t36.10\tEsquina B\n4\t9103130.750\t717585.100\t35.40\tBuzón 1\n5\t9103140.200\t717520.400\t35.05\tPoste",
        order: "PNEZD",
        src: { kind: "utm", datum: "psad56", zone: "17", south: true },
        dst: { kind: "utm", datum: "wgs84", zone: "17", south: true },
      },
    },
  },
  pt: {
    modeSingle: "Um ponto",
    modeBatch: "Vários pontos (do Excel)",
    from: "De",
    to: "Para",
    swap: "Inverter a conversão",
    system: "Sistema",
    utm: "UTM",
    geo: "Geográficas",
    datum: "Datum",
    datums: {
      wgs84: "WGS 84 (GPS)",
      sirgas2000: "SIRGAS 2000",
      nad83: "NAD83 (América do Norte)",
      psad56: "PSAD56 (Peru)",
      sad69: "SAD69",
    },
    datumOrder: ["sirgas2000", "sad69", "wgs84", "psad56", "nad83"],
    zone: "Fuso",
    zoneAuto: "Automático",
    hemisphere: "Hemisfério",
    north: "Norte",
    south: "Sul",
    easting: "E (Leste)",
    northing: "N (Norte)",
    elevation: "Cota (opcional)",
    latitude: "Latitude",
    longitude: "Longitude",
    angleHint: `Decimal ou G° M' S"`,
    order: "Ordem das colunas",
    orders: {
      PNEZD: "P, N, E, Z, D (Civil 3D)",
      PENZD: "P, E, N, Z, D",
      NEZD: "N, E, Z, D",
      ENZD: "E, N, Z, D",
      PLATLON: "P, latitude, longitude, Z, D",
      PLONLAT: "P, longitude, latitude, Z, D",
      LATLON: "Latitude, longitude, Z, D",
      LONLAT: "Longitude, latitude, Z, D",
    },
    paste: "Cole aqui seus pontos, uma linha por ponto",
    pasteHint: "Copie as colunas do Excel e cole aqui. Exemplo:\n1    7394700,000    333500,000    760,20    RN-1",
    loadExample: "Carregar exemplo",
    clear: "Limpar",
    detected: "{n} linhas lidas · separador: {sep}",
    delimiters: { tab: "tabulação (Excel)", semicolon: "ponto e vírgula", comma: "vírgula", space: "espaços" },
    results: "Resultado",
    empty: "Informe coordenadas para ver o resultado.",
    decimalDegrees: "Graus decimais",
    dms: "GMS",
    scale: "Fator de escala (k)",
    convergence: "Convergência meridiana",
    combined: "Fator combinado",
    combinedHint: "Informe a cota para obter o fator combinado.",
    accuracy: "Mudança de datum segundo {source}: precisão aproximada de ±{m} m.",
    copy: "Copiar",
    copied: "Copiado",
    openMaps: "Ver no Google Maps",
    errors: {
      number: "há valores que não são números",
      range: "coordenadas fora do intervalo",
      swapped: "E e N (ou latitude e longitude) parecem invertidos; confira a ordem das colunas",
      zone: "o fuso UTM não é válido",
    },
    rowError: "Linha {line}: {error}.",
    summary: "{ok} pontos convertidos · {bad} com erro",
    tableShowing: "Mostrando {shown} de {total} pontos; os downloads incluem todos.",
    multiZone: "Os pontos caem em vários fusos UTM ({zones}). Para o Civil 3D, fixe um só fuso no destino.",
    renumbered:
      "O Civil 3D exige números de ponto no formato PNEZD: ao baixar, os pontos são renumerados e o nome original vai para a descrição.",
    exportCivil3d: "Baixar para o Civil 3D (PNEZD)",
    exportCsv: "Baixar CSV",
    exportExcel: "Baixar Excel",
    exportKml: "Baixar KML (Google Earth)",
    mapTitle: "Confira seus pontos no mapa",
    mapHint: "Se um ponto cair no mar, confira o fuso, o hemisfério ou a ordem das colunas.",
    recent: "Suas conversões recentes",
    recentHint: "Ficam salvas só neste navegador.",
    restore: "Restaurar",
    points: "{n} ponto(s)",
    cols: { p: "Ponto", e: "E", n: "N", lat: "Latitude", lon: "Longitude", z: "Cota", d: "Descrição", zone: "Fuso", k: "k" },
    xlsx: {
      fileName: "coordenadas-zeist.xlsx",
      sheet: "Coordenadas",
      generatedBy: generatedBy("pt", "Gerado com o conversor de coordenadas da Zeist"),
    },
    kmlName: "Pontos convertidos (Zeist)",
    cta: {
      title: "Levantamentos completos toda semana?",
      body: "Um plugin de Civil 3D importa seus pontos com seus códigos, gera a superfície e aplica seus estilos, sem etapas manuais.",
      button: "Vamos conversar pelo WhatsApp",
      prefill:
        "Olá Zeist. Converti {n} ponto(s) com o conversor de coordenadas de vocês. Tenho interesse em automatizar a importação de levantamentos no Civil 3D.",
    },
    hemi: { n: "N", s: "S", e: "L", w: "O" },
    example: {
      single: { e: "333286,919", n: "7394586,092", z: "760", zone: 23, south: true, datum: "sirgas2000" },
      batch: {
        text: "1\t7394700,000\t333500,000\t760,20\tRN-1\n2\t7394755,400\t333560,150\t761,05\tCanto A\n3\t7394690,800\t333625,700\t759,80\tCanto B\n4\t7394630,250\t333580,300\t758,95\tPV-1\n5\t7394640,600\t333515,900\t759,40\tPoste",
        order: "PNEZD",
        src: { kind: "utm", datum: "sad69", zone: "23", south: true },
        dst: { kind: "utm", datum: "sirgas2000", zone: "23", south: true },
      },
    },
  },
  en: {
    modeSingle: "One point",
    modeBatch: "Batch (from Excel)",
    from: "From",
    to: "To",
    swap: "Reverse the conversion",
    system: "System",
    utm: "UTM",
    geo: "Lat/long",
    datum: "Datum",
    datums: {
      wgs84: "WGS 84 (GPS)",
      sirgas2000: "SIRGAS 2000",
      nad83: "NAD83 (≈ WGS 84)",
      psad56: "PSAD56 (Peru)",
      sad69: "SAD69 (Brazil)",
    },
    datumOrder: ["wgs84", "nad83", "sirgas2000", "psad56", "sad69"],
    zone: "Zone",
    zoneAuto: "Automatic",
    hemisphere: "Hemisphere",
    north: "North",
    south: "South",
    easting: "Easting (E)",
    northing: "Northing (N)",
    elevation: "Elevation (optional)",
    latitude: "Latitude",
    longitude: "Longitude",
    angleHint: `Decimal or D° M' S"`,
    order: "Column order",
    orders: {
      PNEZD: "P, N, E, Z, D (Civil 3D)",
      PENZD: "P, E, N, Z, D",
      NEZD: "N, E, Z, D",
      ENZD: "E, N, Z, D",
      PLATLON: "P, latitude, longitude, Z, D",
      PLONLAT: "P, longitude, latitude, Z, D",
      LATLON: "Latitude, longitude, Z, D",
      LONLAT: "Longitude, latitude, Z, D",
    },
    paste: "Paste your points here, one row per point",
    pasteHint: "Copy the columns from Excel and paste them here. Example:\n1    40.712800    -74.006000    10    City Hall",
    loadExample: "Load example",
    clear: "Clear",
    detected: "{n} rows read · delimiter: {sep}",
    delimiters: { tab: "tab (Excel)", semicolon: "semicolon", comma: "comma", space: "spaces" },
    results: "Result",
    empty: "Enter coordinates to see the result.",
    decimalDegrees: "Decimal degrees",
    dms: "DMS",
    scale: "Scale factor (k)",
    convergence: "Grid convergence",
    combined: "Combined factor",
    combinedHint: "Enter the elevation to get the combined factor.",
    accuracy: "Datum shift per {source}: approximate accuracy ±{m} m.",
    copy: "Copy",
    copied: "Copied",
    openMaps: "Open in Google Maps",
    errors: {
      number: "some values are not numbers",
      range: "coordinates out of range",
      swapped: "easting and northing (or latitude and longitude) look swapped; check the column order",
      zone: "the UTM zone is not valid",
    },
    rowError: "Row {line}: {error}.",
    summary: "{ok} points converted · {bad} with errors",
    tableShowing: "Showing {shown} of {total} points; downloads include them all.",
    multiZone: "The points fall in several UTM zones ({zones}). For Civil 3D, force a single target zone.",
    renumbered:
      "Civil 3D requires numeric point numbers in PNEZD: on download, points are renumbered and the original name moves to the description.",
    exportCivil3d: "Download for Civil 3D (PNEZD)",
    exportCsv: "Download CSV",
    exportExcel: "Download Excel",
    exportKml: "Download KML (Google Earth)",
    mapTitle: "Check your points on the map",
    mapHint: "If a point lands in the ocean, check the zone, the hemisphere or the column order.",
    recent: "Your recent conversions",
    recentHint: "Stored only in this browser.",
    restore: "Restore",
    points: "{n} point(s)",
    cols: { p: "Point", e: "Easting", n: "Northing", lat: "Latitude", lon: "Longitude", z: "Elev.", d: "Description", zone: "Zone", k: "k" },
    xlsx: {
      fileName: "coordinates-zeist.xlsx",
      sheet: "Coordinates",
      generatedBy: generatedBy("en", "Generated with the Zeist coordinate converter"),
    },
    kmlName: "Converted points (Zeist)",
    cta: {
      title: "Processing full surveys every week?",
      body: "A Civil 3D plugin imports your points with your field codes, builds the surface and applies your styles, with no manual steps.",
      button: "Let's talk on WhatsApp",
      prefill:
        "Hi Zeist. I converted {n} point(s) with your coordinate converter. I'm interested in automating survey imports into Civil 3D.",
    },
    hemi: { n: "N", s: "S", e: "E", w: "W" },
    example: {
      single: { e: "583959.372", n: "4507350.998", z: "10", zone: 18, south: false, datum: "wgs84" },
      batch: {
        text: "1\t40.712800\t-74.006000\t10\tCity Hall\n2\t40.706086\t-73.996864\t15\tBrooklyn Bridge tower\n3\t40.748440\t-73.985664\t20\tEmpire State\n4\t40.758896\t-73.985130\t18\tTimes Square\n5\t40.689247\t-74.044502\t3\tStatue of Liberty",
        order: "PLATLON",
        src: { kind: "geo", datum: "wgs84", zone: "", south: false },
        dst: { kind: "utm", datum: "wgs84", zone: "", south: false },
      },
    },
  },
};

export function getCoordContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getCoordLabels(locale: Locale): CoordLabels {
  return labels[locale];
}
