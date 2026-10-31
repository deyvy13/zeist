import type { Locale } from "@/lib/i18n";
import type { ExcelPointsLabels } from "@/components/tools/excel-points";
import type { ToolContent } from "@/lib/tools-content/types";

// Excel → Civil 3D points — es / pt / en. Civil 3D facts match the guide
// importar-puntos-civil-3d-excel (no .xlsx, no header row, integer point
// numbers, PENZD swaps N and E, Insert › Points from File).

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Importar puntos de Excel a Civil 3D (PNEZD)",
    metaDescription:
      "Pega tu tabla de Excel y descarga el archivo de puntos PNEZD que Civil 3D importa a la primera: sin encabezado, con números enteros y la coma decimal corregida.",
    keywords: [
      "importar puntos de excel a civil 3d",
      "excel a civil 3d",
      "formato pnezd civil 3d",
      "archivo de puntos civil 3d",
      "convertir excel a pnezd",
      "puntos civil 3d csv",
    ],
    name: "Excel a puntos de Civil 3D",
    eyebrow: "Herramienta gratuita · Civil 3D",
    h1: "Importar puntos de Excel a Civil 3D: convierte tu tabla a PNEZD",
    intro:
      "Pega la tabla de puntos tal como está en Excel, con las columnas en cualquier orden, y descarga un archivo PNEZD o PENZD listo para Civil 3D. La herramienta quita el encabezado, corrige la coma decimal, numera los puntos y te avisa de lo que no cuadra.",
    badges: ["Gratis y sin registro", "Cualquier orden de columnas", "Tu tabla no sale del navegador"],
    calculatorTitle: "Convertir una tabla de Excel en un archivo de puntos de Civil 3D",
    answer:
      "Civil 3D no lee archivos de Excel: importa puntos desde un archivo de texto (.csv o .txt) con un formato fijo, por ejemplo PNEZD, que es número de punto, Norte, Este, cota y descripción separados por comas. El archivo no puede tener fila de encabezado, los números de punto deben ser enteros y únicos, y las descripciones no pueden llevar comas. Esta herramienta prepara ese archivo desde tu tabla; después lo importas en Insertar › Puntos de archivo, con el mismo formato.",
    sections: [
      {
        id: "como-usar",
        title: "Cómo usarla",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Copia las columnas en Excel, con o sin encabezados, y pégalas en el cuadro.",
              "Revisa qué dato hay en cada columna. La herramienta lo deduce por los encabezados o por los valores, y puedes corregirlo.",
              "Elige el formato (PNEZD o PENZD) y desde qué número quieres numerar si hace falta.",
              "Descarga el archivo y, en Civil 3D, ve a **Insertar › Puntos de archivo** y elige el mismo formato.",
            ],
          },
        ],
      },
      {
        id: "reglas-civil-3d",
        title: "Qué exige Civil 3D al archivo de puntos",
        blocks: [
          {
            type: "table",
            head: ["Regla", "Por qué"],
            rows: [
              ["Sin fila de encabezado", "Una fila de títulos hace que Civil 3D responda «no point file format match found»."],
              ["Números de punto enteros y únicos", "Son el identificador del punto. Si se repiten, Civil 3D pide qué hacer con el duplicado."],
              ["Punto como separador decimal", "La coma ya separa las columnas."],
              ["Sin comas en la descripción", "Una coma de más corre todas las columnas siguientes."],
              ["El mismo orden que el formato elegido", "PENZD invierte Norte y Este respecto de PNEZD."],
            ],
          },
          {
            type: "p",
            text: "La herramienta aplica las cinco reglas: si un número de punto tiene letras, falta o se repite, numera todos desde el número que elijas y deja el nombre original en la descripción, para no perderlo.",
          },
        ],
      },
      {
        id: "como-reconoce-columnas",
        title: "Cómo reconoce las columnas",
        blocks: [
          {
            type: "p",
            text: "Si la tabla tiene encabezados, los lee en español, portugués o inglés: Punto, Este, Norte, Cota, Descripción; Ponto, Leste; Point, Easting, Northing, Elevation, y abreviaturas como P, N, E, Z o D.",
          },
          {
            type: "p",
            text: "Sin encabezados, las dos columnas con los valores más grandes son las coordenadas. En UTM del hemisferio sur, el Norte tiene siete cifras y el Este seis, así que se distinguen solos. Si tienen las mismas cifras, lee primero el Este y luego el Norte, como en la mayoría de cuadros de datos técnicos, y te pide revisarlo.",
          },
        ],
      },
      {
        id: "despues-de-importar",
        title: "Después de importar",
        blocks: [
          {
            type: "list",
            items: [
              "Si los puntos están en UTM y quieres verlos sobre un mapa o convertirlos, asigna el sistema de coordenadas del dibujo en Configuración del dibujo › Unidades y zona. Lo explicamos en [importar puntos a Civil 3D desde Excel](/es/blog/importar-puntos-civil-3d-excel).",
              "Si tus puntos vienen en latitud y longitud, pásalos antes a UTM con el [conversor de coordenadas](/es/herramientas/conversor-de-coordenadas).",
              "Para comprobar dónde queda el terreno, usa [coordenadas UTM en Google Maps](/es/herramientas/coordenadas-utm-en-google-maps).",
            ],
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Del Excel al dibujo",
      title: "¿Importas puntos todas las semanas? Lo llevamos a un botón en Civil 3D.",
      body: "Desarrollamos plugins que leen tu Excel, validan los datos, crean los puntos con tus estilos y grupos, y dejan registro de lo importado.",
      prefill: "Hola Zeist. Vengo de la herramienta de Excel a puntos de Civil 3D. Me interesa automatizar la importación de puntos.",
      secondaryLabel: "Ver plugins a medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "¿Civil 3D puede importar un archivo de Excel directamente?",
        a: "No. Civil 3D importa puntos desde archivos de texto, .csv o .txt, con un formato de columnas fijo como PNEZD. Hay que guardar la tabla como CSV o pasarla por una herramienta como esta, que además quita el encabezado y corrige la coma decimal.",
      },
      {
        q: "¿Qué significa PNEZD?",
        a: "Es el orden de las columnas: número de punto (P), Norte (N), Este (E), cota (Z) y descripción (D). PENZD es igual pero con el Este antes que el Norte. En Civil 3D hay que elegir el formato que coincide con el orden del archivo.",
      },
      {
        q: "¿Por qué Civil 3D dice «no point file format match found»?",
        a: "Porque el archivo no coincide con el formato elegido. Las causas más comunes son una fila de encabezado, una cantidad distinta de columnas, comas dentro de las descripciones o números con coma decimal. Esta herramienta corrige las cuatro.",
      },
      {
        q: "¿Qué pasa con los puntos que tienen nombre, como BM-1?",
        a: "Civil 3D necesita números enteros. Si algún punto tiene letras, la herramienta numera todos desde el número que elijas y pasa el nombre original a la descripción, así que en el dibujo sigues viendo «BM-1».",
      },
      {
        q: "¿Mi tabla se sube a algún servidor?",
        a: "No. La tabla se procesa en tu navegador y el archivo se genera ahí mismo. Nada de lo que pegas sale de tu computadora.",
      },
    ],
    guides: [
      "importar-puntos-civil-3d-excel",
      "convertir-coordenadas-geograficas-a-utm",
      "ubicar-plano-coordenadas-utm-google-maps",
      "curvas-de-nivel-civil-3d-google-earth",
      "automatizar-civil-3d-guia-completa",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Importar pontos do Excel para o Civil 3D (PNEZD)",
    metaDescription:
      "Cole sua tabela do Excel e baixe o arquivo de pontos PNEZD que o Civil 3D importa de primeira: sem cabeçalho, com números inteiros e vírgula decimal corrigida.",
    keywords: [
      "importar pontos do excel para o civil 3d",
      "excel para civil 3d",
      "formato pnezd civil 3d",
      "arquivo de pontos civil 3d",
      "converter excel para pnezd",
    ],
    name: "Excel para pontos do Civil 3D",
    eyebrow: "Ferramenta gratuita · Civil 3D",
    h1: "Importar pontos do Excel para o Civil 3D: converta sua tabela para PNEZD",
    intro:
      "Cole a tabela de pontos como está no Excel, com as colunas em qualquer ordem, e baixe um arquivo PNEZD ou PENZD pronto para o Civil 3D. A ferramenta tira o cabeçalho, corrige a vírgula decimal, numera os pontos e avisa o que não bate.",
    badges: ["Grátis e sem cadastro", "Qualquer ordem de colunas", "Sua tabela não sai do navegador"],
    calculatorTitle: "Converter uma tabela do Excel em arquivo de pontos do Civil 3D",
    answer:
      "O Civil 3D não lê arquivos do Excel: ele importa pontos de um arquivo de texto (.csv ou .txt) com formato fixo, por exemplo PNEZD, que é número do ponto, Norte, Este, cota e descrição separados por vírgulas. O arquivo não pode ter linha de cabeçalho, os números dos pontos precisam ser inteiros e únicos, e as descrições não podem ter vírgulas. Esta ferramenta prepara esse arquivo a partir da sua tabela; depois você o importa em Inserir › Pontos de arquivo, com o mesmo formato.",
    sections: [
      {
        id: "como-usar",
        title: "Como usar",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Copie as colunas no Excel, com ou sem cabeçalhos, e cole no quadro.",
              "Confira que dado há em cada coluna. A ferramenta deduz pelos cabeçalhos ou pelos valores, e você pode corrigir.",
              "Escolha o formato (PNEZD ou PENZD) e a partir de que número numerar, se for preciso.",
              "Baixe o arquivo e, no Civil 3D, vá em **Inserir › Pontos de arquivo** e escolha o mesmo formato.",
            ],
          },
        ],
      },
      {
        id: "regras-civil-3d",
        title: "O que o Civil 3D exige do arquivo de pontos",
        blocks: [
          {
            type: "table",
            head: ["Regra", "Por quê"],
            rows: [
              ["Sem linha de cabeçalho", "Uma linha de títulos faz o Civil 3D responder «no point file format match found»."],
              ["Números de ponto inteiros e únicos", "São o identificador do ponto. Se repetem, o Civil 3D pergunta o que fazer com o duplicado."],
              ["Ponto como separador decimal", "A vírgula já separa as colunas."],
              ["Sem vírgulas na descrição", "Uma vírgula a mais desloca todas as colunas seguintes."],
              ["A mesma ordem do formato escolhido", "PENZD inverte Norte e Este em relação ao PNEZD."],
            ],
          },
          {
            type: "p",
            text: "A ferramenta aplica as cinco regras: se um número de ponto tem letras, falta ou se repete, ela numera todos a partir do número que você escolher e deixa o nome original na descrição, para não perdê-lo.",
          },
        ],
      },
      {
        id: "como-reconhece-colunas",
        title: "Como ela reconhece as colunas",
        blocks: [
          {
            type: "p",
            text: "Se a tabela tem cabeçalhos, ela os lê em português, espanhol ou inglês: Ponto, Este ou Leste, Norte, Cota, Descrição; Point, Easting, Northing, Elevation, e abreviações como P, N, E, Z ou D.",
          },
          {
            type: "p",
            text: "Sem cabeçalhos, as duas colunas com os maiores valores são as coordenadas. Em UTM no hemisfério sul, o Norte tem sete algarismos e o Este seis, então se distinguem sozinhos. Se tiverem os mesmos algarismos, ela lê primeiro o Este e depois o Norte e pede para você conferir.",
          },
        ],
      },
      {
        id: "depois-de-importar",
        title: "Depois de importar",
        blocks: [
          {
            type: "list",
            items: [
              "Se os pontos estão em UTM e você quer vê-los sobre um mapa ou convertê-los, atribua o sistema de coordenadas do desenho em Configurações do desenho › Unidades e zona. Explicamos em [importar pontos no Civil 3D a partir do Excel](/pt/blog/importar-pontos-civil-3d).",
              "Se os seus pontos estão em latitude e longitude, passe-os antes para UTM com o [conversor de coordenadas](/pt/ferramentas/conversor-de-coordenadas).",
              "Para conferir onde fica o terreno, use [coordenadas UTM no Google Maps](/pt/ferramentas/coordenadas-utm-no-google-maps).",
            ],
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Do Excel ao desenho",
      title: "Importa pontos toda semana? Levamos isso para um botão no Civil 3D.",
      body: "Desenvolvemos plugins que leem o seu Excel, validam os dados, criam os pontos com os seus estilos e grupos e registram o que foi importado.",
      prefill: "Olá Zeist. Vim da ferramenta de Excel para pontos do Civil 3D. Tenho interesse em automatizar a importação de pontos.",
      secondaryLabel: "Ver plugins sob medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "O Civil 3D consegue importar um arquivo do Excel diretamente?",
        a: "Não. O Civil 3D importa pontos de arquivos de texto, .csv ou .txt, com um formato de colunas fixo como o PNEZD. É preciso salvar a tabela como CSV ou passá-la por uma ferramenta como esta, que também tira o cabeçalho e corrige a vírgula decimal.",
      },
      {
        q: "O que significa PNEZD?",
        a: "É a ordem das colunas: número do ponto (P), Norte (N), Este (E), cota (Z) e descrição (D). PENZD é igual, mas com o Este antes do Norte. No Civil 3D é preciso escolher o formato que coincide com a ordem do arquivo.",
      },
      {
        q: "Por que o Civil 3D diz «no point file format match found»?",
        a: "Porque o arquivo não coincide com o formato escolhido. As causas mais comuns são uma linha de cabeçalho, uma quantidade diferente de colunas, vírgulas dentro das descrições ou números com vírgula decimal. Esta ferramenta corrige as quatro.",
      },
      {
        q: "O que acontece com os pontos que têm nome, como BM-1?",
        a: "O Civil 3D precisa de números inteiros. Se algum ponto tem letras, a ferramenta numera todos a partir do número que você escolher e passa o nome original para a descrição, então no desenho você continua vendo «BM-1».",
      },
      {
        q: "Minha tabela é enviada para algum servidor?",
        a: "Não. A tabela é processada no seu navegador e o arquivo é gerado ali mesmo. Nada do que você cola sai do seu computador.",
      },
    ],
    guides: [
      "importar-puntos-civil-3d-excel",
      "convertir-coordenadas-geograficas-a-utm",
      "ubicar-plano-coordenadas-utm-google-maps",
      "curvas-de-nivel-civil-3d-google-earth",
      "automatizar-civil-3d-guia-completa",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "Import Points from Excel to Civil 3D (PNEZD)",
    metaDescription:
      "Paste your Excel table and download the PNEZD point file Civil 3D imports on the first try: no header row, whole point numbers and decimal commas fixed.",
    keywords: [
      "import points from excel to civil 3d",
      "excel to civil 3d points",
      "civil 3d pnezd format",
      "civil 3d point file",
      "convert excel to pnezd",
      "civil 3d import points csv",
    ],
    name: "Excel to Civil 3D points",
    eyebrow: "Free tool · Civil 3D",
    h1: "Import points from Excel to Civil 3D: convert your table to PNEZD",
    intro:
      "Paste your point table as it is in Excel, columns in any order, and download a PNEZD or PENZD file ready for Civil 3D. The tool drops the header row, fixes decimal commas, numbers the points and flags anything that doesn't add up.",
    badges: ["Free, no sign-up", "Any column order", "Your table never leaves the browser"],
    calculatorTitle: "Convert an Excel table into a Civil 3D point file",
    answer:
      "Civil 3D doesn't read Excel files: it imports points from a text file (.csv or .txt) in a fixed format, such as PNEZD, which is point number, Northing, Easting, elevation and description separated by commas. The file can't have a header row, point numbers must be unique whole numbers, and descriptions can't contain commas. This tool builds that file from your table; then you import it with Insert › Points from File, choosing the same format.",
    sections: [
      {
        id: "how-to-use",
        title: "How to use it",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Copy the columns in Excel, with or without headers, and paste them into the box.",
              "Check what each column holds. The tool works it out from the headers or the values, and you can correct it.",
              "Pick the format (PNEZD or PENZD) and the starting number, in case points need numbering.",
              "Download the file and, in Civil 3D, go to **Insert › Points from File** and choose the same format.",
            ],
          },
        ],
      },
      {
        id: "civil-3d-rules",
        title: "What Civil 3D requires from a point file",
        blocks: [
          {
            type: "table",
            head: ["Rule", "Why"],
            rows: [
              ["No header row", "A row of titles makes Civil 3D answer “no point file format match found”."],
              ["Unique whole point numbers", "They identify each point. Duplicates make Civil 3D ask how to resolve them."],
              ["A period as the decimal mark", "The comma already separates the columns."],
              ["No commas in descriptions", "One extra comma shifts every column after it."],
              ["The same order as the chosen format", "PENZD swaps Northing and Easting compared with PNEZD."],
            ],
          },
          {
            type: "p",
            text: "The tool applies all five rules: if a point number has letters, is missing or repeats, it numbers every point from the number you choose and keeps the original name in the description, so nothing is lost.",
          },
        ],
      },
      {
        id: "how-columns-are-detected",
        title: "How it recognizes the columns",
        blocks: [
          {
            type: "p",
            text: "If the table has headers, it reads them in English, Spanish or Portuguese: Point, Easting, Northing, Elevation, Description; Punto, Este, Norte, Cota; and short forms such as P, N, E, Z or D.",
          },
          {
            type: "p",
            text: "Without headers, the two columns with the largest values are the coordinates. In southern-hemisphere UTM, Northing has seven digits and Easting six, so they sort themselves out. When both have the same number of digits, it reads Easting first, then Northing, and asks you to check.",
          },
        ],
      },
      {
        id: "after-import",
        title: "After the import",
        blocks: [
          {
            type: "list",
            items: [
              "If the points are in UTM and you want them on a map or converted, assign the drawing's coordinate system in Drawing Settings › Units and Zone. We cover it in [importing points into Civil 3D from CSV](/en/blog/civil-3d-import-points-csv).",
              "If your points come in latitude and longitude, convert them to UTM first with the [UTM converter](/en/tools/utm-converter).",
              "To check where the site is, use [UTM coordinates on Google Maps](/en/tools/utm-coordinates-google-maps).",
            ],
          },
        ],
      },
    ],
    cta: {
      eyebrow: "From Excel to the drawing",
      title: "Importing points every week? We turn it into one button in Civil 3D.",
      body: "We build plugins that read your Excel file, validate the data, create the points with your styles and groups, and log what was imported.",
      prefill: "Hi Zeist. I'm coming from the Excel to Civil 3D points tool. I'd like to automate our point imports.",
      secondaryLabel: "See custom add-ins",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "Can Civil 3D import an Excel file directly?",
        a: "No. Civil 3D imports points from text files, .csv or .txt, in a fixed column format such as PNEZD. You have to save the table as CSV or run it through a tool like this one, which also drops the header row and fixes decimal commas.",
      },
      {
        q: "What does PNEZD mean?",
        a: "It's the column order: point number (P), Northing (N), Easting (E), elevation (Z) and description (D). PENZD is the same with Easting before Northing. In Civil 3D you pick the format that matches the order in your file.",
      },
      {
        q: "Why does Civil 3D say “no point file format match found”?",
        a: "Because the file doesn't match the format you chose. The usual causes are a header row, a different number of columns, commas inside descriptions, or numbers with decimal commas. This tool fixes all four.",
      },
      {
        q: "What happens to points named like BM-1?",
        a: "Civil 3D needs whole numbers. If any point has letters, the tool numbers every point from the number you choose and moves the original name into the description, so you still see “BM-1” in the drawing.",
      },
      {
        q: "Is my table uploaded anywhere?",
        a: "No. The table is processed in your browser and the file is generated right there. Nothing you paste leaves your computer.",
      },
    ],
    guides: [
      "importar-puntos-civil-3d-excel",
      "convertir-coordenadas-geograficas-a-utm",
      "ubicar-plano-coordenadas-utm-google-maps",
      "curvas-de-nivel-civil-3d-google-earth",
      "automatizar-civil-3d-guia-completa",
    ],
  },
};

const labels: Record<Locale, ExcelPointsLabels> = {
  es: {
    input: "Tabla de puntos (pega desde Excel)",
    inputHint: "Con o sin encabezados, en cualquier orden de columnas. Acepta tabulación, punto y coma, coma o espacios, y la coma decimal.",
    example:
      "Punto\tEste\tNorte\tCota\tDescripción\n1\t512345,120\t8654321,450\t102,35\tBM-1\n2\t512362,800\t8654330,100\t102,80\tBORDE\n3\t512380,050\t8654342,700\t103,10\tBORDE\n4\t512398,600\t8654351,900\t103,55\tPOSTE\n5\t512371,200\t8654368,300\t104,05\tCASA\n",
    loadExample: "Cargar ejemplo",
    clear: "Limpiar",
    columnsTitle: "¿Qué hay en cada columna?",
    column: "Columna {n}",
    columnNames: { P: "Número de punto (P)", N: "Norte (N)", E: "Este (E)", Z: "Cota (Z)", D: "Descripción (D)", skip: "No usar" },
    format: "Formato de salida",
    start: "Numerar desde",
    results: "Archivo para Civil 3D",
    points: "Puntos",
    skipped: "Filas omitidas",
    missingZ: "Sin cota",
    preview: "Vista previa",
    more: "y {n} puntos más",
    download: "Descargar .csv",
    downloadTxt: "Descargar .txt",
    empty: "Pega tu tabla para ver el archivo.",
    noCoords: "Falta indicar qué columnas son el Norte y el Este.",
    ambiguous: "El Este y el Norte tienen la misma cantidad de cifras: se leyó primero el Este y luego el Norte. Revísalo arriba.",
    renumbered: "Había números de punto con letras, vacíos o repetidos: se numeró todo desde {start} y el nombre original pasó a la descripción.",
    duplicates: "Números repetidos: {list}.",
    zeroZ: "{n} puntos sin cota se escriben con cota 0.",
    skippedLines: "Se omitieron las filas {lines}: no tienen un Norte o un Este numérico.",
    privacy: "Tu tabla se procesa en tu navegador: no se sube a ningún servidor.",
  },
  pt: {
    input: "Tabela de pontos (cole do Excel)",
    inputHint: "Com ou sem cabeçalhos, em qualquer ordem de colunas. Aceita tabulação, ponto e vírgula, vírgula ou espaços, e a vírgula decimal.",
    example:
      "Ponto\tEste\tNorte\tCota\tDescrição\n1\t512345,120\t8654321,450\t102,35\tBM-1\n2\t512362,800\t8654330,100\t102,80\tBORDA\n3\t512380,050\t8654342,700\t103,10\tBORDA\n4\t512398,600\t8654351,900\t103,55\tPOSTE\n5\t512371,200\t8654368,300\t104,05\tCASA\n",
    loadExample: "Carregar exemplo",
    clear: "Limpar",
    columnsTitle: "O que há em cada coluna?",
    column: "Coluna {n}",
    columnNames: { P: "Número do ponto (P)", N: "Norte (N)", E: "Este (E)", Z: "Cota (Z)", D: "Descrição (D)", skip: "Não usar" },
    format: "Formato de saída",
    start: "Numerar a partir de",
    results: "Arquivo para o Civil 3D",
    points: "Pontos",
    skipped: "Linhas ignoradas",
    missingZ: "Sem cota",
    preview: "Pré-visualização",
    more: "e mais {n} pontos",
    download: "Baixar .csv",
    downloadTxt: "Baixar .txt",
    empty: "Cole sua tabela para ver o arquivo.",
    noCoords: "Falta indicar quais colunas são o Norte e o Este.",
    ambiguous: "O Este e o Norte têm a mesma quantidade de algarismos: foi lido primeiro o Este e depois o Norte. Confira acima.",
    renumbered: "Havia números de ponto com letras, vazios ou repetidos: tudo foi numerado a partir de {start} e o nome original foi para a descrição.",
    duplicates: "Números repetidos: {list}.",
    zeroZ: "{n} pontos sem cota são escritos com cota 0.",
    skippedLines: "As linhas {lines} foram ignoradas: não têm um Norte ou um Este numérico.",
    privacy: "Sua tabela é processada no seu navegador: não é enviada a nenhum servidor.",
  },
  en: {
    input: "Point table (paste from Excel)",
    inputHint: "With or without headers, columns in any order. Accepts tabs, semicolons, commas or spaces, and decimal commas.",
    example:
      "Point\tEasting\tNorthing\tElevation\tDescription\n1\t512345.120\t4654321.450\t102.35\tBM-1\n2\t512362.800\t4654330.100\t102.80\tEDGE\n3\t512380.050\t4654342.700\t103.10\tEDGE\n4\t512398.600\t4654351.900\t103.55\tPOLE\n5\t512371.200\t4654368.300\t104.05\tHOUSE\n",
    loadExample: "Load example",
    clear: "Clear",
    columnsTitle: "What's in each column?",
    column: "Column {n}",
    columnNames: { P: "Point number (P)", N: "Northing (N)", E: "Easting (E)", Z: "Elevation (Z)", D: "Description (D)", skip: "Don't use" },
    format: "Output format",
    start: "Number from",
    results: "File for Civil 3D",
    points: "Points",
    skipped: "Rows skipped",
    missingZ: "No elevation",
    preview: "Preview",
    more: "and {n} more points",
    download: "Download .csv",
    downloadTxt: "Download .txt",
    empty: "Paste your table to see the file.",
    noCoords: "Pick which columns hold the Northing and the Easting.",
    ambiguous: "Easting and Northing have the same number of digits: Easting was read first, then Northing. Check it above.",
    renumbered: "Some point numbers had letters, were missing or repeated: every point was numbered from {start} and the original name moved to the description.",
    duplicates: "Repeated numbers: {list}.",
    zeroZ: "{n} points without elevation are written with elevation 0.",
    skippedLines: "Rows {lines} were skipped: they have no numeric Northing or Easting.",
    privacy: "Your table is processed in your browser: it isn't uploaded anywhere.",
  },
};

export function getExcelPointsContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getExcelPointsLabels(locale: Locale): ExcelPointsLabels {
  return labels[locale];
}
