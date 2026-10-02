import type { Locale } from "@/lib/i18n";
import type { ContourLabels } from "@/components/tools/contour-generator";
import type { ToolContent } from "@/lib/tools-content/types";

// Contour generator — es / pt / en. Data facts (sources and resolutions) come
// from the Terrain Tiles documentation (tilezen/joerd docs/data-sources.md);
// Civil 3D facts from the Autodesk help (DEM formats). The example areas
// (2 km squares) were sampled before writing: Cerro Blanco, Trujillo (≈24-351
// m), Corcovado, Rio (≈10-621 m), Twin Peaks, San Francisco (≈41-279 m).

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Generador de curvas de nivel online (DXF y Civil 3D)",
    metaDescription:
      "Genera curvas de nivel gratis de cualquier zona: elige el área en el mapa y descarga las curvas en DXF para AutoCAD y Civil 3D, o puntos para crear la superficie.",
    keywords: [
      "generar curvas de nivel online",
      "curvas de nivel google earth",
      "descargar curvas de nivel",
      "curvas de nivel dwg",
      "curvas de nivel civil 3d",
      "curvas de nivel de un terreno",
      "modelo digital de elevación",
    ],
    name: "Generador de curvas de nivel",
    eyebrow: "Herramienta gratuita · Topografía preliminar",
    h1: "Generador de curvas de nivel online: de un área del mapa a AutoCAD y Civil 3D",
    intro:
      "Elige una zona en el mapa y obtén sus curvas de nivel en segundos. Descárgalas en DXF, en coordenadas UTM y con su cota, o descarga una malla de puntos para crear la superficie en Civil 3D. Gratis, sin instalar nada y sin Global Mapper.",
    badges: ["Gratis y sin registro", "DXF con cotas", "Puntos para Civil 3D", "Para anteproyectos"],
    calculatorTitle: "Generador de curvas de nivel desde el mapa",
    answer:
      "Para obtener curvas de nivel de una zona sin levantamiento topográfico se usa un modelo digital de elevación abierto, como el SRTM, que cubre casi todo el mundo con una malla de unos 30 m. Este generador lo descarga para el área que elijas, traza las curvas en tu navegador y las entrega en DXF para AutoCAD y Civil 3D, en coordenadas UTM y con su cota. Su precisión vertical es de unos ±16 m: sirven para anteproyectos, factibilidad y tesis, no para el diseño definitivo.",
    sections: [
      {
        id: "como-funciona",
        title: "Cómo se generan estas curvas de nivel",
        blocks: [
          {
            type: "p",
            text: "La herramienta usa los **Terrain Tiles**, un modelo de elevación abierto publicado en AWS que combina varias fuentes públicas. En el Perú, Latinoamérica y la mayor parte del mundo, la fuente es el **SRTM** de la NASA, con una malla de unos 30 m. En EE. UU. usa el 3DEP del USGS (10 m, y 3 m en algunas zonas) y en Europa el EU-DEM (30 m).",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Mueves el mapa hasta que el cuadrado cubra tu zona y eliges su tamaño (de 500 m a 5 km de lado).",
              "La herramienta descarga las teselas de elevación de esa área y arma la malla de cotas.",
              "Traza las curvas con el método de los cuadrados marchantes, el mismo que usan los programas SIG.",
              "Las pasa a coordenadas **UTM WGS 84** de la zona del centro y las recorta al cuadrado elegido.",
            ],
          },
          { type: "p", text: "Todo el cálculo ocurre en tu navegador. Las cotas son alturas sobre el nivel medio del mar, en metros." },
        ],
      },
      {
        id: "precision",
        title: "Qué precisión tienen y para qué sirven",
        blocks: [
          {
            type: "p",
            text: "El SRTM tiene una precisión vertical especificada de **±16 m** (al 90 %). En terreno llano suele ser mejor; en laderas empinadas, con vegetación densa o con edificios, peor, porque el radar mide la superficie que ve: copas de árboles y techos incluidos.",
          },
          {
            type: "list",
            items: [
              "**Sirven para:** anteproyectos, estudios de factibilidad, trazos preliminares de vías y canales, ubicar obras, estimar pendientes y trabajos académicos.",
              "**No sirven para:** diseño definitivo, expediente técnico ni metrados de movimiento de tierras.",
            ],
          },
          {
            type: "callout",
            title: "Para diseñar, levantamiento",
            text: "El diseño definitivo necesita un levantamiento topográfico con estación total o GNSS, fotogrametría con dron o LiDAR. Estas curvas te dicen dónde y cómo planificarlo.",
          },
        ],
      },
      {
        id: "civil-3d",
        title: "Cómo llevar las curvas a Civil 3D",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "**Configura el dibujo** en el sistema UTM WGS 84 de la zona que indica la herramienta (por ejemplo, UTM84-17S para Trujillo).",
              "**Opción recomendada, los puntos:** descarga la malla de puntos PNEZD, impórtala con Insertar > Puntos de archivo y crea una superficie desde ese grupo de puntos. Civil 3D genera las curvas con tu estilo, tu intervalo y tus etiquetas.",
              "**Opción directa, el DXF:** las curvas llegan como polilíneas 3D en las capas CURVAS-MAYORES y CURVAS-MENORES, con su cota. Puedes usarlas como dibujo o añadirlas a la definición de una superficie (Curvas de nivel > Añadir).",
            ],
          },
          {
            type: "p",
            text: "Civil 3D también puede crear la superficie directamente desde un archivo de elevación (DEM): acepta .dem, GeoTIFF (.tif), ESRI ASCII (.asc) y ESRI binario (.adf). El paso a paso completo está en la guía de [curvas de nivel en Civil 3D](/es/blog/curvas-de-nivel-civil-3d-google-earth).",
          },
        ],
      },
      {
        id: "google-earth",
        title: "¿Y las curvas de nivel de Google Earth?",
        blocks: [
          {
            type: "p",
            text: "Google Earth Pro muestra la altura del punto bajo el cursor, pero **no exporta curvas de nivel ni el terreno**. Civil 3D tuvo hace años un comando para importar la superficie de Google Earth, pero las versiones actuales ya no lo incluyen. Por eso el flujo habitual pasa por programas de pago como Global Mapper o por complementos.",
          },
          {
            type: "p",
            text: "Este generador resuelve lo mismo en el navegador: eliges la zona, eliges el intervalo y descargas el DXF. Si necesitas convertir un punto de Google Earth a UTM, usa el [conversor de coordenadas](/es/herramientas/conversor-de-coordenadas).",
          },
        ],
      },
      {
        id: "intervalo",
        title: "Cómo elegir el intervalo de las curvas",
        blocks: [
          {
            type: "p",
            text: "Una regla práctica: que entren unas **20 curvas** en el área, es decir, un intervalo cercano al desnivel dividido entre 20, redondeado a 1, 2, 5, 10, 20 o 50 m. Las curvas maestras van cada 5 intervalos.",
          },
          {
            type: "p",
            text: "Ejemplo: el área de 2 km que trae cargada la herramienta, en el Cerro Blanco de Trujillo, va de unos 24 a 351 m. Con 327 m de desnivel, el intervalo automático es de **20 m**, con maestras cada 100 m.",
          },
          {
            type: "callout",
            title: "No le pidas más detalle del que tienen los datos",
            text: "Con una malla de 30 m, curvas cada 1 m no agregan información: dibujan el ruido del modelo. Para curvas cada metro necesitas un levantamiento o un modelo LiDAR.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "De la superficie al proyecto",
      title: "¿Superficies, perfiles y movimiento de tierras cada semana? Lo automatizamos.",
      body: "Desarrollamos plugins para Civil 3D que importan tus levantamientos, construyen la superficie con tus reglas y generan perfiles, secciones y cubicaciones sin pasos manuales.",
      prefill: "Hola Zeist. Vengo del generador de curvas de nivel. Me interesa automatizar el trabajo con superficies y topografía en Civil 3D.",
      secondaryLabel: "Ver plugins a medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "¿Cómo obtengo curvas de nivel de una zona sin levantamiento?",
        a: "Con un modelo digital de elevación abierto como el SRTM. En esta herramienta eliges el área en el mapa y descargas las curvas en DXF, en coordenadas UTM y con su cota. Sirven para anteproyectos, no para el diseño definitivo.",
      },
      {
        q: "¿Se pueden sacar curvas de nivel de Google Earth?",
        a: "Google Earth Pro no exporta curvas de nivel ni el terreno: solo muestra la altura del punto bajo el cursor. Para obtener curvas de una zona, usa un modelo de elevación abierto, como hace este generador.",
      },
      {
        q: "¿Qué precisión tienen estas curvas de nivel?",
        a: "Las del SRTM tienen una precisión vertical especificada de ±16 m y una malla de unos 30 m. En EE. UU. los datos son más finos (3DEP, 10 m). Son útiles para planificar, no para diseñar ni metrar.",
      },
      {
        q: "¿Cómo genero curvas de nivel en Civil 3D?",
        a: "Crea una superficie desde puntos, curvas o un archivo DEM y elige en su estilo el intervalo de las curvas menores y maestras. Desde esta herramienta puedes descargar una malla de puntos PNEZD lista para crear esa superficie.",
      },
      {
        q: "¿Puedo descargar las curvas de nivel en DWG?",
        a: "La herramienta descarga DXF, que AutoCAD y Civil 3D abren directamente y pueden guardar como DWG. Las curvas vienen como polilíneas 3D con su cota, en capas de curvas mayores y menores.",
      },
      {
        q: "¿En qué coordenadas vienen las curvas?",
        a: "En UTM WGS 84, en la zona del centro del área elegida, con las cotas en metros sobre el nivel medio del mar. La herramienta indica la zona junto a los resultados.",
      },
      {
        q: "¿Tiene algún costo o límite?",
        a: "Es gratis y sin registro. Cada consulta cubre un cuadrado de hasta 5 km de lado; para áreas mayores, genera varias y únelas en Civil 3D.",
      },
    ],
    guides: [
      "topografia-trujillo-curvas-de-nivel-dwg",
      "curvas-de-nivel-civil-3d-google-earth",
      "automatizar-civil-3d-guia-completa",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "automatizar-metrados-cubicaciones-civil-3d",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Gerador de curvas de nível online (DXF e Civil 3D)",
    metaDescription:
      "Gere curvas de nível grátis de qualquer área: escolha a região no mapa e baixe as curvas em DXF para AutoCAD e Civil 3D, ou pontos para criar a superfície.",
    keywords: [
      "gerar curvas de nível online",
      "curvas de nível google earth",
      "baixar curvas de nível",
      "curvas de nível dwg",
      "curvas de nível civil 3d",
      "modelo digital de elevação",
      "srtm curvas de nível",
    ],
    name: "Gerador de curvas de nível",
    eyebrow: "Ferramenta gratuita · Topografia preliminar",
    h1: "Gerador de curvas de nível online: de uma área do mapa ao AutoCAD e ao Civil 3D",
    intro:
      "Escolha uma região no mapa e obtenha as curvas de nível em segundos. Baixe em DXF, em coordenadas UTM e com a cota, ou baixe uma malha de pontos para criar a superfície no Civil 3D. Grátis, sem instalar nada e sem Global Mapper.",
    badges: ["Grátis e sem cadastro", "DXF com cotas", "Pontos para o Civil 3D", "Para estudos preliminares"],
    calculatorTitle: "Gerador de curvas de nível a partir do mapa",
    answer:
      "Para obter curvas de nível de uma área sem levantamento topográfico, usa-se um modelo digital de elevação aberto, como o SRTM, que cobre quase todo o mundo com uma malha de cerca de 30 m. Este gerador baixa o modelo da área escolhida, traça as curvas no seu navegador e as entrega em DXF para AutoCAD e Civil 3D, em coordenadas UTM e com a cota. A precisão vertical é de cerca de ±16 m: servem para estudos preliminares, viabilidade e TCC, não para o projeto executivo.",
    sections: [
      {
        id: "como-funciona",
        title: "Como estas curvas de nível são geradas",
        blocks: [
          {
            type: "p",
            text: "A ferramenta usa os **Terrain Tiles**, um modelo de elevação aberto publicado na AWS que combina várias fontes públicas. No Brasil, na América Latina e na maior parte do mundo, a fonte é o **SRTM** da NASA, com malha de cerca de 30 m. Nos EUA usa o 3DEP do USGS (10 m, e 3 m em algumas áreas) e na Europa o EU-DEM (30 m).",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Você move o mapa até o quadrado cobrir a região e escolhe o tamanho (de 500 m a 5 km de lado).",
              "A ferramenta baixa os tiles de elevação dessa área e monta a malha de cotas.",
              "Traça as curvas pelo método dos quadrados marchantes, o mesmo dos programas de SIG.",
              "Converte para coordenadas **UTM WGS 84** do fuso do centro e recorta no quadrado escolhido.",
            ],
          },
          { type: "p", text: "Todo o cálculo acontece no seu navegador. As cotas são altitudes sobre o nível médio do mar, em metros." },
        ],
      },
      {
        id: "precisao",
        title: "Qual a precisão e para que servem",
        blocks: [
          {
            type: "p",
            text: "O SRTM tem precisão vertical especificada de **±16 m** (a 90 %). Em terreno plano costuma ser melhor; em encostas íngremes, com vegetação densa ou edificações, pior, porque o radar mede a superfície que enxerga, copas de árvores e telhados incluídos.",
          },
          {
            type: "list",
            items: [
              "**Servem para:** estudos preliminares, viabilidade, traçados iniciais de estradas e canais, implantação de obras, estimativa de declividades e trabalhos acadêmicos.",
              "**Não servem para:** projeto executivo nem cálculo de terraplenagem.",
            ],
          },
          {
            type: "callout",
            title: "Para projetar, levantamento",
            text: "O projeto executivo exige levantamento topográfico com estação total ou GNSS, aerofotogrametria com drone ou LiDAR. No Brasil, o Topodata do INPE oferece o SRTM refinado para estudos regionais. Estas curvas indicam onde e como planejar o levantamento.",
          },
        ],
      },
      {
        id: "civil-3d",
        title: "Como levar as curvas para o Civil 3D",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "**Configure o desenho** no sistema UTM WGS 84 do fuso indicado pela ferramenta (por exemplo, UTM84-23S para o Rio de Janeiro).",
              "**Opção recomendada, os pontos:** baixe a malha de pontos PNEZD, importe em Inserir > Pontos de arquivo e crie uma superfície a partir desse grupo de pontos. O Civil 3D gera as curvas com o seu estilo, o seu intervalo e os seus rótulos.",
              "**Opção direta, o DXF:** as curvas chegam como polilinhas 3D nas camadas CURVAS-MESTRAS e CURVAS-INTERMEDIARIAS, com a cota. Use como desenho ou adicione à definição de uma superfície (Curvas de nível > Adicionar).",
            ],
          },
          {
            type: "p",
            text: "O Civil 3D também cria a superfície direto de um arquivo de elevação (DEM): aceita .dem, GeoTIFF (.tif), ESRI ASCII (.asc) e ESRI binário (.adf). O passo a passo completo está no guia de [curvas de nível no Civil 3D](/pt/blog/curvas-de-nivel-civil-3d-google-earth).",
          },
        ],
      },
      {
        id: "google-earth",
        title: "E as curvas de nível do Google Earth?",
        blocks: [
          {
            type: "p",
            text: "O Google Earth Pro mostra a altitude do ponto sob o cursor, mas **não exporta curvas de nível nem o terreno**. O Civil 3D já teve um comando para importar a superfície do Google Earth, mas as versões atuais não o incluem. Por isso o fluxo comum passa por programas pagos, como o Global Mapper, ou por complementos.",
          },
          {
            type: "p",
            text: "Este gerador resolve o mesmo no navegador: escolha a área, o intervalo e baixe o DXF. Para converter um ponto do Google Earth para UTM, use o [conversor de coordenadas](/pt/herramientas/conversor-de-coordenadas).",
          },
        ],
      },
      {
        id: "intervalo",
        title: "Como escolher a equidistância das curvas",
        blocks: [
          {
            type: "p",
            text: "Uma regra prática: que caibam umas **20 curvas** na área, ou seja, uma equidistância próxima ao desnível dividido por 20, arredondada para 1, 2, 5, 10, 20 ou 50 m. As curvas mestras vão a cada 5 intervalos.",
          },
          {
            type: "p",
            text: "Exemplo: a área de 2 km que vem carregada na ferramenta, no Corcovado, no Rio de Janeiro, vai de uns 10 a 621 m. Com 611 m de desnível, a equidistância automática é de **50 m**, com mestras a cada 250 m.",
          },
          {
            type: "callout",
            title: "Não peça mais detalhe do que os dados têm",
            text: "Com uma malha de 30 m, curvas de 1 em 1 m não acrescentam informação: desenham o ruído do modelo. Para curvas métricas é preciso levantamento ou um modelo LiDAR.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Da superfície ao projeto",
      title: "Superfícies, perfis e terraplenagem toda semana? Automatizamos.",
      body: "Desenvolvemos plugins para o Civil 3D que importam seus levantamentos, constroem a superfície com as suas regras e geram perfis, seções e volumes sem etapas manuais.",
      prefill: "Olá Zeist. Vim do gerador de curvas de nível. Tenho interesse em automatizar o trabalho com superfícies e topografia no Civil 3D.",
      secondaryLabel: "Ver plugins sob medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "Como obter curvas de nível de uma área sem levantamento?",
        a: "Com um modelo digital de elevação aberto, como o SRTM. Nesta ferramenta você escolhe a área no mapa e baixa as curvas em DXF, em coordenadas UTM e com a cota. Servem para estudos preliminares, não para o projeto executivo.",
      },
      {
        q: "Dá para tirar curvas de nível do Google Earth?",
        a: "O Google Earth Pro não exporta curvas de nível nem o terreno: só mostra a altitude do ponto sob o cursor. Para obter curvas de uma área, use um modelo de elevação aberto, como faz este gerador.",
      },
      {
        q: "Qual a precisão destas curvas de nível?",
        a: "As do SRTM têm precisão vertical especificada de ±16 m e malha de cerca de 30 m. Servem para planejar, não para projetar nem calcular terraplenagem.",
      },
      {
        q: "Como gerar curvas de nível no Civil 3D?",
        a: "Crie uma superfície a partir de pontos, curvas ou de um arquivo DEM e defina no estilo a equidistância das curvas intermediárias e mestras. Desta ferramenta você baixa uma malha de pontos PNEZD pronta para criar essa superfície.",
      },
      {
        q: "Posso baixar as curvas de nível em DWG?",
        a: "A ferramenta baixa DXF, que o AutoCAD e o Civil 3D abrem direto e podem salvar como DWG. As curvas vêm como polilinhas 3D com a cota, em camadas de mestras e intermediárias.",
      },
      {
        q: "Em que coordenadas vêm as curvas?",
        a: "Em UTM WGS 84, no fuso do centro da área escolhida, com as cotas em metros sobre o nível médio do mar. A ferramenta indica o fuso junto aos resultados.",
      },
      {
        q: "Tem custo ou limite?",
        a: "É grátis e sem cadastro. Cada consulta cobre um quadrado de até 5 km de lado; para áreas maiores, gere várias e junte no Civil 3D.",
      },
    ],
    guides: [
      "curvas-de-nivel-civil-3d-google-earth",
      "automatizar-civil-3d-guia-completa",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "redes-tuberias-civil-3d-accesorios",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "Contour Map Generator: DXF for AutoCAD and Civil 3D",
    metaDescription:
      "Generate contour lines for any area: pick it on the map and download contours as DXF for AutoCAD and Civil 3D, or points to build the surface. Free.",
    keywords: [
      "contour map generator",
      "contour lines from google earth",
      "download contour lines",
      "contour lines dxf",
      "civil 3d contours",
      "topographic contour generator",
      "dem to contours",
    ],
    name: "Contour map generator",
    eyebrow: "Free tool · Preliminary topography",
    h1: "Contour map generator: from an area on the map to AutoCAD and Civil 3D",
    intro:
      "Pick an area on the map and get its contour lines in seconds. Download them as DXF, in UTM coordinates with their elevations, or download a grid of points to build the surface in Civil 3D. Free, nothing to install, no Global Mapper.",
    badges: ["Free, no sign-up", "DXF with elevations", "Points for Civil 3D", "For preliminary studies"],
    calculatorTitle: "Contour line generator from the map",
    answer:
      "To get contour lines for an area without a survey, you use an open digital elevation model. In the US that's USGS 3DEP, at 10 m resolution (3 m in places); elsewhere it's usually SRTM, at about 30 m. This generator downloads the model for the area you pick, traces the contours in your browser and delivers them as DXF for AutoCAD and Civil 3D, in UTM coordinates with elevations. Use them for planning and feasibility, not for final design.",
    sections: [
      {
        id: "how-it-works",
        title: "How these contours are generated",
        blocks: [
          {
            type: "p",
            text: "The tool uses **Terrain Tiles**, an open elevation model published on AWS that blends public sources. In the United States it relies on **USGS 3DEP** (formerly NED) at 10 m, and 3 m in select areas. In most of the rest of the world it uses NASA's **SRTM**, on a grid of about 30 m, and EU-DEM (30 m) in Europe.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Pan the map until the square covers your area and pick its size (500 m to 5 km per side).",
              "The tool downloads the elevation tiles for that area and builds the elevation grid.",
              "It traces contours with the marching squares method used by GIS software.",
              "It converts them to **UTM WGS 84** coordinates for the zone at the center and clips them to the square.",
            ],
          },
          { type: "p", text: "Everything runs in your browser. Elevations are heights above mean sea level, in meters." },
        ],
      },
      {
        id: "accuracy",
        title: "How accurate they are, and what they're good for",
        blocks: [
          {
            type: "p",
            text: "Accuracy depends on the source. 3DEP 10 m data in the US is far better than SRTM, whose specified vertical accuracy is **±16 m** (90%). Steep slopes, dense vegetation and buildings make any radar-based model worse, because it measures the visible surface.",
          },
          {
            type: "list",
            items: [
              "**Good for:** site selection, feasibility studies, preliminary road and channel alignments, slope estimates and academic work.",
              "**Not for:** final design, construction documents or earthwork quantities.",
            ],
          },
          {
            type: "callout",
            title: "For design, survey the site",
            text: "Final design needs a topographic survey (total station or GNSS), drone photogrammetry or lidar. In much of the US, the USGS also publishes 1 m lidar-derived DEMs through The National Map.",
          },
        ],
      },
      {
        id: "civil-3d",
        title: "How to bring the contours into Civil 3D",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "**Set the drawing** to the UTM WGS 84 zone the tool reports (for example, UTM84-10N for San Francisco).",
              "**Recommended, the points:** download the PNEZD point grid, import it with Insert > Points from File, and build a surface from that point group. Civil 3D then draws contours with your style, interval and labels.",
              "**Direct, the DXF:** contours arrive as 3D polylines on MAJOR-CONTOURS and MINOR-CONTOURS layers, at their elevations. Use them as linework or add them to a surface definition (Contours > Add).",
            ],
          },
          {
            type: "p",
            text: "Civil 3D can also build a surface straight from an elevation file (DEM): it accepts .dem, GeoTIFF (.tif), ESRI ASCII (.asc) and ESRI binary (.adf). The full walkthrough is in the guide to [contours in Civil 3D](/en/blog/curvas-de-nivel-civil-3d-google-earth).",
          },
        ],
      },
      {
        id: "google-earth",
        title: "What about contour lines from Google Earth?",
        blocks: [
          {
            type: "p",
            text: "Google Earth Pro shows the elevation under the cursor, but it **doesn't export contour lines or terrain**. Civil 3D once had a command to import a Google Earth surface, but current versions no longer include it. That's why the usual workaround involves paid software like Global Mapper, or add-ins.",
          },
          {
            type: "p",
            text: "This generator does the same job in the browser: pick the area and interval, then download the DXF. To convert a Google Earth point to UTM, use the [UTM to lat long converter](/en/herramientas/conversor-de-coordenadas).",
          },
        ],
      },
      {
        id: "interval",
        title: "How to choose the contour interval",
        blocks: [
          {
            type: "p",
            text: "A rule of thumb: aim for about **20 contours** across the area, an interval close to the relief divided by 20, rounded to 1, 2, 5, 10, 20 or 50 m. Index (major) contours go every 5 intervals.",
          },
          {
            type: "p",
            text: "Example: the 2 km area preloaded in the tool, around Twin Peaks in San Francisco, runs from about 41 to 279 m. With 238 m of relief, the automatic interval is **20 m** (about 66 ft), with index contours every 100 m.",
          },
          {
            type: "callout",
            title: "Elevations are in meters",
            text: "The tool works in meters, the native unit of the data. For feet-based drawings, build the surface in Civil 3D from the points and set the contour interval and labels in feet there.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "From surface to project",
      title: "Surfaces, profiles and earthwork every week? We automate them.",
      body: "We build Civil 3D plugins that import your surveys, build the surface with your rules and generate profiles, sections and volumes without manual steps.",
      prefill: "Hi Zeist. I came from your contour generator. I'm interested in automating surface and survey work in Civil 3D.",
      secondaryLabel: "See custom plugins",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "How do I get contour lines for an area without a survey?",
        a: "From an open digital elevation model: USGS 3DEP in the US, SRTM in most of the world. In this tool you pick the area on the map and download the contours as DXF, in UTM coordinates with elevations. Use them for planning, not final design.",
      },
      {
        q: "Can I export contour lines from Google Earth?",
        a: "No. Google Earth Pro doesn't export contour lines or terrain; it only shows the elevation under the cursor. To get contours for an area, use an open elevation model, as this generator does.",
      },
      {
        q: "How accurate are these contours?",
        a: "It depends on the source: USGS 3DEP data in the US is 10 m resolution (3 m in places); SRTM elsewhere is about 30 m, with a specified vertical accuracy of ±16 m. Good for planning, not for design or quantities.",
      },
      {
        q: "How do I create contours in Civil 3D?",
        a: "Build a surface from points, contours or a DEM file, then set the minor and major contour intervals in its style. This tool gives you a PNEZD point grid ready to build that surface.",
      },
      {
        q: "Can I download contour lines as DWG?",
        a: "The tool downloads DXF, which AutoCAD and Civil 3D open directly and can save as DWG. Contours come as 3D polylines at their elevations, on major and minor layers.",
      },
      {
        q: "Can I get contours in feet?",
        a: "The tool works in meters. For feet-based drawings, import the point grid into Civil 3D, build the surface and set the contour interval in feet in the surface style.",
      },
      {
        q: "Is there a cost or a limit?",
        a: "It's free, with no sign-up. Each run covers a square up to 5 km per side; for larger areas, run several and combine them in Civil 3D.",
      },
    ],
    guides: [
      "curvas-de-nivel-civil-3d-google-earth",
      "automatizar-civil-3d-guia-completa",
      "plugin-civil-3d-dibujo-3d-automatizado",
      "redes-tuberias-civil-3d-accesorios",
    ],
  },
};

const labels: Record<Locale, ContourLabels> = {
  es: {
    goTo: "Ir a coordenadas (latitud, longitud)",
    goToPlaceholder: "Ej.: -8.1340, -78.9875",
    goToButton: "Ir",
    goToError: "Escribe latitud y longitud en grados decimales o en grados, minutos y segundos.",
    moveHint: "Mueve el mapa: el cuadrado sigue al centro.",
    size: "Tamaño del área",
    sizes: { "0.5": "500 m × 500 m", "1": "1 km × 1 km", "2": "2 km × 2 km", "5": "5 km × 5 km" },
    interval: "Intervalo",
    auto: "Automático",
    majorEvery: "Maestra cada",
    belowSea: "Omitir cotas bajo el nivel del mar",
    generate: "Generar curvas de nivel",
    generating: "Generando curvas…",
    mapTitle: "Elige el área en el mapa",
    results: "Resultado",
    idle: "Elige un área y pulsa «Generar curvas de nivel».",
    stats: { min: "Cota mínima", max: "Cota máxima", relief: "Desnivel", lines: "Curvas trazadas", interval: "Intervalo", zone: "Coordenadas", resolution: "Resolución de la malla" },
    errorFetch: "No pudimos descargar los datos de elevación. Revisa tu conexión e inténtalo de nuevo.",
    errorFlat: "El área es demasiado plana para ese intervalo, o está en el mar. Prueba un intervalo menor u otra zona.",
    exportDxf: "Descargar curvas (DXF)",
    exportPoints: "Descargar puntos (PNEZD)",
    exportKml: "Descargar KML (Google Earth)",
    spacing: "Separación de puntos",
    pointsCount: "La malla de puntos tendrá unos {n} puntos.",
    accuracyTitle: "Para anteproyectos, no para diseño",
    accuracy: "Las curvas salen de un modelo de elevación global: en el Perú y casi todo el mundo, el SRTM, con malla de unos 30 m y precisión vertical de ±16 m. Úsalas para planificar; para diseñar, haz un levantamiento topográfico.",
    attribution: "Datos de elevación: Terrain Tiles (AWS Open Data), con SRTM, 3DEP, EU-DEM, ETOPO1 y otras fuentes.",
    attributionLink: "Atribución completa",
    layers: { minor: "CURVAS-MENORES", major: "CURVAS-MAYORES", labels: "CURVAS-TEXTO", boundary: "LIMITE" },
    pointsDescription: "TN",
    fileBase: "curvas-de-nivel-zeist",
    kmlName: "Curvas de nivel (Zeist)",
    dxfComment: "Curvas de nivel - Zeist (zeist.vercel.app)\nUTM WGS 84 zona {zone}, cotas en m sobre el nivel del mar, intervalo {interval} m\nDatos: Terrain Tiles (SRTM, 3DEP, EU-DEM, ETOPO1). Solo para anteproyectos.",
    cta: {
      title: "¿Superficies y movimiento de tierras cada semana?",
      body: "Un plugin de Civil 3D construye la superficie con tus reglas y genera perfiles, secciones y cubicaciones.",
      button: "Hablemos por WhatsApp",
      prefill: "Hola Zeist. Generé curvas de nivel con su herramienta. Me interesa automatizar el trabajo con superficies y topografía en Civil 3D.",
    },
    example: { lat: -8.134, lon: -78.9875 },
  },
  pt: {
    goTo: "Ir para coordenadas (latitude, longitude)",
    goToPlaceholder: "Ex.: -22.9519, -43.2105",
    goToButton: "Ir",
    goToError: "Digite latitude e longitude em graus decimais ou em graus, minutos e segundos.",
    moveHint: "Mova o mapa: o quadrado acompanha o centro.",
    size: "Tamanho da área",
    sizes: { "0.5": "500 m × 500 m", "1": "1 km × 1 km", "2": "2 km × 2 km", "5": "5 km × 5 km" },
    interval: "Equidistância",
    auto: "Automática",
    majorEvery: "Mestra a cada",
    belowSea: "Omitir cotas abaixo do nível do mar",
    generate: "Gerar curvas de nível",
    generating: "Gerando curvas…",
    mapTitle: "Escolha a área no mapa",
    results: "Resultado",
    idle: "Escolha uma área e clique em «Gerar curvas de nível».",
    stats: { min: "Cota mínima", max: "Cota máxima", relief: "Desnível", lines: "Curvas traçadas", interval: "Equidistância", zone: "Coordenadas", resolution: "Resolução da malha" },
    errorFetch: "Não foi possível baixar os dados de elevação. Confira sua conexão e tente de novo.",
    errorFlat: "A área é plana demais para essa equidistância, ou está no mar. Tente uma equidistância menor ou outra região.",
    exportDxf: "Baixar curvas (DXF)",
    exportPoints: "Baixar pontos (PNEZD)",
    exportKml: "Baixar KML (Google Earth)",
    spacing: "Espaçamento dos pontos",
    pointsCount: "A malha de pontos terá cerca de {n} pontos.",
    accuracyTitle: "Para estudos preliminares, não para projeto",
    accuracy: "As curvas vêm de um modelo de elevação global: no Brasil e em quase todo o mundo, o SRTM, com malha de cerca de 30 m e precisão vertical de ±16 m. Use para planejar; para projetar, faça um levantamento topográfico.",
    attribution: "Dados de elevação: Terrain Tiles (AWS Open Data), com SRTM, 3DEP, EU-DEM, ETOPO1 e outras fontes.",
    attributionLink: "Atribuição completa",
    layers: { minor: "CURVAS-INTERMEDIARIAS", major: "CURVAS-MESTRAS", labels: "CURVAS-TEXTO", boundary: "LIMITE" },
    pointsDescription: "TN",
    fileBase: "curvas-de-nivel-zeist",
    kmlName: "Curvas de nível (Zeist)",
    dxfComment: "Curvas de nivel - Zeist (zeist.vercel.app)\nUTM WGS 84 fuso {zone}, cotas em m sobre o nivel do mar, equidistancia {interval} m\nDados: Terrain Tiles (SRTM, 3DEP, EU-DEM, ETOPO1). Apenas para estudos preliminares.",
    cta: {
      title: "Superfícies e terraplenagem toda semana?",
      body: "Um plugin de Civil 3D constrói a superfície com as suas regras e gera perfis, seções e volumes.",
      button: "Vamos conversar pelo WhatsApp",
      prefill: "Olá Zeist. Gerei curvas de nível com a ferramenta de vocês. Tenho interesse em automatizar o trabalho com superfícies e topografia no Civil 3D.",
    },
    example: { lat: -22.9519, lon: -43.2105 },
  },
  en: {
    goTo: "Go to coordinates (latitude, longitude)",
    goToPlaceholder: "E.g.: 37.7544, -122.4477",
    goToButton: "Go",
    goToError: "Type latitude and longitude in decimal degrees or degrees, minutes and seconds.",
    moveHint: "Pan the map: the square follows the center.",
    size: "Area size",
    sizes: { "0.5": "500 m × 500 m", "1": "1 km × 1 km", "2": "2 km × 2 km", "5": "5 km × 5 km" },
    interval: "Interval",
    auto: "Automatic",
    majorEvery: "Index every",
    belowSea: "Skip elevations below sea level",
    generate: "Generate contours",
    generating: "Generating contours…",
    mapTitle: "Pick the area on the map",
    results: "Result",
    idle: "Pick an area and press “Generate contours”.",
    stats: { min: "Lowest", max: "Highest", relief: "Relief", lines: "Contour lines", interval: "Interval", zone: "Coordinates", resolution: "Grid resolution" },
    errorFetch: "We couldn't download the elevation data. Check your connection and try again.",
    errorFlat: "The area is too flat for that interval, or it's at sea. Try a smaller interval or another area.",
    exportDxf: "Download contours (DXF)",
    exportPoints: "Download points (PNEZD)",
    exportKml: "Download KML (Google Earth)",
    spacing: "Point spacing",
    pointsCount: "The point grid will have about {n} points.",
    accuracyTitle: "For planning, not for design",
    accuracy: "Contours come from an open elevation model: USGS 3DEP (10 m) in the US, SRTM (about 30 m, ±16 m vertical) in most other places. Use them to plan; for design, survey the site.",
    attribution: "Elevation data: Terrain Tiles (AWS Open Data), from SRTM, 3DEP, EU-DEM, ETOPO1 and other sources.",
    attributionLink: "Full attribution",
    layers: { minor: "MINOR-CONTOURS", major: "MAJOR-CONTOURS", labels: "CONTOUR-LABELS", boundary: "BOUNDARY" },
    pointsDescription: "EG",
    fileBase: "contours-zeist",
    kmlName: "Contour lines (Zeist)",
    dxfComment: "Contour lines - Zeist (zeist.vercel.app)\nUTM WGS 84 zone {zone}, elevations in m above mean sea level, interval {interval} m\nData: Terrain Tiles (SRTM, 3DEP, EU-DEM, ETOPO1). For preliminary studies only.",
    cta: {
      title: "Surfaces and earthwork every week?",
      body: "A Civil 3D plugin builds the surface with your rules and generates profiles, sections and volumes.",
      button: "Let's talk on WhatsApp",
      prefill: "Hi Zeist. I generated contours with your tool. I'm interested in automating surface and survey work in Civil 3D.",
    },
    example: { lat: 37.7544, lon: -122.4477 },
  },
};

export function getContourContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getContourLabels(locale: Locale): ContourLabels {
  return labels[locale];
}
