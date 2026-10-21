import type { Locale } from "@/lib/i18n";
import type { PlanLocatorLabels } from "@/components/tools/plan-locator";
import type { ToolContent } from "@/lib/tools-content/types";

// "UTM coordinates on Google Maps" — es / pt / en. The worked example is a real
// location plan from Nuevo Chimbote (Peru): UTM zone 17 S, PSAD56. Every number
// in the copy comes from lib/tools/plan-location.ts and is checked against PROJ
// in scripts/test-tools.mjs; it matches the tool's preloaded table. Change them
// together. The entity behind the plan is not named on purpose.

// The table as it comes out of the plan (tab-separated, like a copy from Excel).
const EXAMPLE = [
  "VERTICE\tLADO\tLONG. (ml.)\tANG. INTERNO\tESTE (m)\tNORTE (m)",
  `1\t1 - 2\t234.8918\t90°09'45"\t773650.1996\t8992962.5553`,
  `2\t2 - 3\t400.1637\t89°52'27"\t773822.0104\t8992802.3829`,
  `3\t3 - 4\t235.1478\t90°11'22"\t773548.4967\t8992510.2849`,
  `4\t4 - 1\t400.4244\t89°46'27"\t773376.3213\t8992670.4415`,
  "VERTICE\tLADO\tLONG. (ml.)\tESTE (m)\tNORTE (m)",
  "A\tA-B\t16.00\t773504.7115\t8992609.5585",
  "B\tB-C\t30.00\t773515.7238\t8992621.2588",
  "C\tC-D\t16.00\t773557.8953\t8992600.4979",
  "D\tD-A\t30.00\t773526.9592\t8992588.8187",
].join("\n");

const exampleInput = { text: EXAMPLE, zone: 17, south: true, datum: "psad56" as const };

const content: Record<Locale, ToolContent> = {
  // ---------------------------------------------------------------------------
  es: {
    seoTitle: "Coordenadas UTM en Google Maps: ubica tu plano",
    metaDescription:
      "Pega las coordenadas UTM de tu plano y mira dónde queda. Corrige PSAD56 a WGS84, revisa el cuadro y ábrelo en Google Maps para llegar. Gratis.",
    keywords: [
      "coordenadas utm en google maps",
      "ubicar coordenadas utm en google maps",
      "como ubicar coordenadas utm en google maps",
      "ubicar terreno con coordenadas utm",
      "ver coordenadas utm en el mapa",
      "coordenadas psad56 a wgs84",
      "ubicación de un plano por coordenadas",
    ],
    name: "Coordenadas UTM en Google Maps",
    eyebrow: "Herramienta gratuita · Planos y topografía",
    h1: "Coordenadas UTM en Google Maps: mira dónde queda tu plano y cómo llegar",
    intro:
      "Pega el cuadro de coordenadas de tu plano o escribe un solo punto. La herramienta corrige el datum, te muestra el terreno en el mapa, revisa que el cuadro sea coherente y abre la ubicación en Google Maps para que llegues.",
    badges: ["Gratis y sin registro", "Corrige PSAD56 → WGS84", "Revisa el cuadro del plano", "Abre en Google Maps"],
    calculatorTitle: "Ubicar las coordenadas UTM de un plano en el mapa",
    answer:
      "Google Maps no acepta coordenadas UTM: solo latitud y longitud en grados, en WGS84. Para ubicar un plano hay que convertir su Este y su Norte con la zona (en el Perú, 17, 18 o 19 sur) y el datum. Si el plano está en PSAD56, como muchos planos peruanos antiguos, el punto se corre unos 450 m cuando no se corrige el datum. Esta herramienta lee el cuadro de datos técnicos, corrige el datum, muestra el terreno en el mapa y abre la ubicación en Google Maps para llegar.",
    sections: [
      {
        id: "paso-a-paso",
        title: "Cómo ubicar coordenadas UTM en Google Maps, paso a paso",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Copia el **cuadro de datos técnicos** del plano (vértice, lado, longitud, ángulo, Este y Norte) desde el PDF, Excel o AutoCAD y pégalo en la tabla con Ctrl+V. No hace falta limpiarlo: la herramienta encuentra el Este y el Norte de cada fila y llena las columnas. También puedes escribir los vértices uno por uno, o un solo punto.",
              "Elige la **zona** y el **hemisferio**. El plano suele decirlo en el rótulo («Zona geográfica: 17»); en el Perú, el hemisferio siempre es sur.",
              "Elige el **datum** del plano («Datum geodésico: PSAD 56»). Si el plano no lo dice, elige «No lo sé» y compara en el mapa dónde cae con cada uno.",
              "Revisa el terreno en el mapa y ábrelo en **Google Maps**: para ver el punto, la vista satélite o pedir la ruta desde donde estás.",
            ],
          },
          {
            type: "p",
            text: "¿Por qué no basta con pegar el Este y el Norte en Google Maps? Porque su buscador solo entiende grados: decimales (−9.1071019, −78.5130932), con minutos y segundos o con minutos decimales. Las coordenadas UTM hay que convertirlas antes, y si el plano no está en WGS84, también cambiarlas de datum. Lo explicamos con un caso real en [cómo ubicar un plano con coordenadas UTM en Google Maps](/es/blog/ubicar-plano-coordenadas-utm-google-maps).",
          },
        ],
      },
      {
        id: "zona-y-datum",
        title: "Zona y datum: lo que decide dónde cae tu punto",
        blocks: [
          {
            type: "p",
            text: "Unas coordenadas UTM solo significan algo con su zona, su hemisferio y su datum. Con la zona equivocada el punto salta cientos de kilómetros, porque el mismo Este se repite en cada zona. Con el datum equivocado, se corre cientos de metros.",
          },
          {
            type: "table",
            head: ["Zona", "Longitudes", "Ciudades"],
            rows: [
              ["17 S", "84° O – 78° O", "Tumbes, Piura, Chiclayo, Trujillo, Chimbote, Cajamarca"],
              ["18 S", "78° O – 72° O", "Lima, Huaraz, Ica, Huancayo, Ayacucho, Iquitos"],
              ["19 S", "72° O – 66° O", "Arequipa, Cusco, Puno, Tacna, Puerto Maldonado"],
            ],
          },
          {
            type: "p",
            text: "La mayoría de planos peruanos antiguos está en **PSAD56**; el GPS y Google Maps usan **WGS84**. En el norte del Perú la diferencia ronda los 450 m: si pegas coordenadas PSAD56 como si fueran WGS84, caes en otra manzana o en otro barrio.",
          },
          {
            type: "callout",
            title: "Precisión del cambio de datum",
            text: "Para PSAD56, la herramienta usa la transformación del registro EPSG para el Perú, PSAD56 to WGS 84 (8), con una precisión de ±16 m. Alcanza para saber dónde queda un plano y llegar al terreno. Para replanteo o linderos, enlaza el trabajo a puntos de control medidos con GPS diferencial.",
          },
        ],
      },
      {
        id: "leer-el-plano",
        title: "Dónde están las coordenadas en un plano",
        blocks: [
          {
            type: "list",
            items: [
              "**Cuadro de datos técnicos:** la tabla con los vértices, los lados, las longitudes, los ángulos y las coordenadas Este y Norte. Es la fuente que vale.",
              "**Rótulo o leyenda:** dice la zona («Zona geográfica: 17») y el datum («Datum geodésico: PSAD 56»).",
              "**Plano de localización:** el croquis con la grilla de coordenadas en los bordes. Sirve para ubicarse a ojo, no para medir.",
              "**Coordenadas del visor:** las que muestra AutoCAD o una app al tocar el dibujo. En una lámina son milímetros del papel; en el modelo, solo son reales si el plano se dibujó en coordenadas UTM.",
            ],
          },
          {
            type: "callout",
            title: "Las coordenadas del visor pueden engañarte",
            text: "Si abres el DWG en el celular y tocas un punto, el visor puede mostrar algo como 266.26, 106.43: son coordenadas de la lámina o del dibujo, no del terreno. En una lámina son milímetros del papel. Usa siempre el cuadro de datos técnicos.",
          },
        ],
      },
      {
        id: "ejemplo",
        title: "Ejemplo real: un plano de Nuevo Chimbote",
        blocks: [
          {
            type: "p",
            text: "El ejemplo cargado es el cuadro de un plano de localización real de Nuevo Chimbote, en Áncash: un terreno de cuatro vértices en UTM zona 17 sur, datum PSAD56, y una segunda área marcada con las letras A a D.",
          },
          {
            type: "table",
            caption: "Vértices del terreno: PSAD56 en el plano, WGS84 para Google Maps",
            head: ["Vértice", "Este PSAD56 (m)", "Norte PSAD56 (m)", "Latitud WGS84", "Longitud WGS84"],
            numeric: [false, true, true, true, true],
            rows: [
              ["1", "773650.1996", "8992962.5553", "−9.1050551", "−78.5126438"],
              ["2", "773822.0104", "8992802.3829", "−9.1064918", "−78.5110717"],
              ["3", "773548.4967", "8992510.2849", "−9.1091483", "−78.5135402"],
              ["4", "773376.3213", "8992670.4415", "−9.1077118", "−78.5151157"],
            ],
          },
          {
            type: "p",
            text: "El centro del terreno queda en **−9.1071019, −78.5130932**, en Bellamar, Nuevo Chimbote. El cuadro es coherente: sus cuatro lados y sus cuatro ángulos coinciden con las coordenadas y encierran 94,076.58 m² (9.41 ha).",
          },
          {
            type: "p",
            text: "Si esas mismas coordenadas se pegan como si fueran WGS84, el punto cae **447 m al noreste**, en otro barrio. Y el segundo cuadro del plano no cierra: declara lados de 16 y 30 m, pero sus coordenadas dibujan lados de 16.07, 47.00, 33.07 y 30.42 m. La revisión del cuadro lo marca en amarillo.",
          },
        ],
      },
      {
        id: "errores",
        title: "Por qué tu punto cae en el mar o en otro lugar",
        blocks: [
          {
            type: "list",
            items: [
              "**Datum sin corregir:** PSAD56 leído como WGS84 te corre unos 450 m en el norte del Perú.",
              "**Zona equivocada:** el punto salta unos 650 km por cada zona de diferencia, porque el mismo Este se repite en todas.",
              "**Hemisferio equivocado:** con «norte» en lugar de «sur», el punto aparece al otro lado del ecuador.",
              "**Columnas invertidas:** el Norte de un punto del Perú tiene siete cifras (8 992 962) y el Este seis (773 650). La herramienta los distingue sola, pero si el cuadro no tiene encabezado y las dos tienen seis cifras, elige el orden a mano.",
              "**Un dígito mal escrito:** en el ejemplo, la grilla del plano de localización dice 763 600 donde el cuadro dice 773 600. Ese 6 por un 7 son 10 km de diferencia.",
              "**Coordenadas del visor:** las de una lámina son milímetros del papel, y las del modelo solo sirven si el plano se dibujó en UTM.",
            ],
          },
        ],
      },
      {
        id: "como-llegar",
        title: "Cómo llegar al terreno con Google Maps",
        blocks: [
          {
            type: "p",
            text: "**Abrir en Google Maps** muestra el punto; **Cómo llegar** abre la ruta desde tu ubicación; **Vista satélite** muestra la foto aérea para reconocer el terreno. **Copiar coordenadas** deja la latitud y la longitud listas para pegar en el buscador de Google Maps o en un mensaje. El **KML** abre el polígono en Google Earth.",
          },
          {
            type: "p",
            text: "¿Necesitas convertir cientos de puntos o llevarlos a Civil 3D? Usa el [conversor de coordenadas](/es/herramientas/conversor-de-coordenadas), que exporta a Excel, Civil 3D y Google Earth.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Planos y Civil 3D",
      title: "¿Recibes planos en PSAD56 o sin georreferenciar? Lo automatizamos.",
      body: "Desarrollamos plugins para AutoCAD y Civil 3D que georreferencian planos, convierten coordenadas por lotes y revisan los cuadros de datos técnicos con las reglas de tu oficina.",
      prefill:
        "Hola Zeist. Vengo de la herramienta de coordenadas UTM en Google Maps. Me interesa automatizar la georreferenciación de planos.",
      secondaryLabel: "Ver plugins a medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "¿Cómo pongo coordenadas UTM en Google Maps?",
        a: "Google Maps no acepta UTM: hay que convertirlas a latitud y longitud en WGS84. Escribe el Este y el Norte en esta herramienta, elige la zona, el hemisferio y el datum, y usa el botón Abrir en Google Maps. También puedes copiar la latitud y la longitud y pegarlas en el buscador de Google Maps.",
      },
      {
        q: "¿Por qué mis coordenadas caen a 400 o 500 metros del lugar?",
        a: "Casi siempre es el datum: el plano está en PSAD56 y se leyó como si fuera WGS84. En el norte del Perú la diferencia es de unos 450 m. Elige PSAD56 como datum y la herramienta corrige la posición.",
      },
      {
        q: "¿Qué zona UTM le corresponde a mi plano?",
        a: "La indica el rótulo del plano. Si no está, depende de la longitud: en el Perú, la 17 va de 84° a 78° oeste (Piura, Chiclayo, Trujillo, Chimbote), la 18 de 78° a 72° oeste (Lima, Huancayo) y la 19 de 72° a 66° oeste (Cusco, Arequipa, Puno). El hemisferio es sur.",
      },
      {
        q: "¿Cómo sé si mi plano está en PSAD56 o en WGS84?",
        a: "Búscalo en el rótulo: «Datum geodésico» o «Datum horizontal». Los planos anteriores a 2006, cuando el IGN adoptó WGS84, suelen estar en PSAD56. Si el plano no lo dice, elige «No lo sé» y compara en el mapa cuál de las ubicaciones calza con las calles y manzanas que esperas.",
      },
      {
        q: "¿Las coordenadas que muestra el visor de AutoCAD sirven para ubicar el plano?",
        a: "Solo en el espacio modelo y si el plano se dibujó en coordenadas UTM reales. En una lámina son milímetros del papel, y muchos planos se dibujan en coordenadas locales: el visor muestra valores como 266.26, 106.43 que no corresponden al terreno. Usa el cuadro de datos técnicos.",
      },
      {
        q: "¿Qué tan exacta es la ubicación?",
        a: "Si el plano está en WGS84, la conversión es exacta. Si está en PSAD56, el cambio de datum tiene una precisión de unos ±16 m: suficiente para ubicar y llegar al terreno, no para replanteo. Para replantear linderos se trabaja con puntos de control medidos con GPS diferencial.",
      },
      {
        q: "¿Mis coordenadas se envían a algún servidor?",
        a: "No. Todo se calcula en tu navegador. El mapa descarga de OpenStreetMap las imágenes de la zona que muestra, y las coordenadas solo llegan a Google si abres uno de los enlaces de Google Maps.",
      },
    ],
    guides: [
      "ubicar-plano-coordenadas-utm-google-maps",
      "coordenadas-utm-trujillo-la-libertad",
      "importar-puntos-civil-3d-excel",
      "curvas-de-nivel-civil-3d-google-earth",
      "civil-3d-a-revit-topografia-coordenadas",
    ],
  },

  // ---------------------------------------------------------------------------
  pt: {
    seoTitle: "Coordenadas UTM no Google Maps: localize o terreno",
    metaDescription:
      "Cole as coordenadas UTM da planta e veja onde fica o terreno. Corrige SAD69 e PSAD56, confere o quadro e abre no Google Maps para chegar. Grátis.",
    keywords: [
      "coordenadas utm no google maps",
      "como colocar coordenadas utm no google maps",
      "localizar coordenadas utm no google maps",
      "localizar terreno pelas coordenadas",
      "coordenadas utm para google maps",
      "sad69 para sirgas 2000",
    ],
    name: "Coordenadas UTM no Google Maps",
    eyebrow: "Ferramenta gratuita · Plantas e topografia",
    h1: "Coordenadas UTM no Google Maps: veja onde fica a planta e como chegar",
    intro:
      "Cole o quadro de coordenadas da planta ou digite um único ponto. A ferramenta corrige o datum, mostra o terreno no mapa, confere se o quadro é coerente e abre a localização no Google Maps para você chegar.",
    badges: ["Grátis e sem cadastro", "Corrige SAD69 e PSAD56", "Confere o quadro da planta", "Abre no Google Maps"],
    calculatorTitle: "Localizar as coordenadas UTM de uma planta no mapa",
    answer:
      "O Google Maps não aceita coordenadas UTM: só latitude e longitude em graus, em WGS 84. Para localizar uma planta é preciso converter o E e o N com o fuso (no Brasil, de 18 a 25 Sul) e o datum. Se a planta está em SAD69, o ponto se desloca cerca de 64 m em São Paulo; em PSAD56, no Peru, cerca de 450 m. Esta ferramenta lê o quadro de coordenadas, corrige o datum, mostra o terreno no mapa e abre a localização no Google Maps para você chegar.",
    sections: [
      {
        id: "passo-a-passo",
        title: "Como colocar coordenadas UTM no Google Maps, passo a passo",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Copie o **quadro de coordenadas** da planta (vértice, lado, distância, ângulo, E e N) do PDF, do Excel ou do AutoCAD e cole na tabela com Ctrl+V. Não precisa limpar: a ferramenta encontra o E e o N de cada linha e preenche as colunas. Também dá para digitar os vértices um a um, ou um único ponto.",
              "Escolha o **fuso** e o **hemisfério**. A planta costuma indicar no carimbo; no Brasil, o hemisfério é sul em quase todo o território.",
              "Escolha o **datum** da planta (SIRGAS 2000, SAD69…). Se ela não informa, escolha «Não sei» e compare no mapa onde cai com cada um.",
              "Confira o terreno no mapa e abra no **Google Maps**: para ver o ponto, a vista de satélite ou traçar a rota até lá.",
            ],
          },
          {
            type: "p",
            text: "Por que não basta colar o E e o N no Google Maps? Porque a busca só entende graus: decimais (−9.1071019, −78.5130932), com minutos e segundos ou com minutos decimais. As coordenadas UTM precisam ser convertidas antes e, se a planta não está em WGS 84 ou SIRGAS 2000, também mudadas de datum. Explicamos com um caso real em [como localizar uma planta com coordenadas UTM no Google Maps](/pt/blog/localizar-terreno-coordenadas-utm).",
          },
        ],
      },
      {
        id: "fuso-e-datum",
        title: "Fuso e datum: o que decide onde o ponto cai",
        blocks: [
          {
            type: "p",
            text: "Coordenadas UTM só fazem sentido com o fuso, o hemisfério e o datum. Com o fuso errado o ponto salta centenas de quilômetros, porque o mesmo E se repete em cada fuso. Com o datum errado, ele se desloca dezenas ou centenas de metros.",
          },
          {
            type: "table",
            head: ["Fuso", "Longitudes", "Cidades"],
            rows: [
              ["22 S", "54° O – 48° O", "Porto Alegre, Curitiba, Goiânia"],
              ["23 S", "48° O – 42° O", "São Paulo, Rio de Janeiro, Belo Horizonte, Brasília"],
              ["24 S", "42° O – 36° O", "Salvador, Fortaleza, Aracaju"],
            ],
          },
          {
            type: "p",
            text: "Plantas antigas no Brasil usam **SAD69** ou **Córrego Alegre**; hoje o padrão é o **SIRGAS 2000**, praticamente igual ao WGS 84 do GPS e do Google Maps. De SAD69 para SIRGAS 2000, um ponto em São Paulo se move cerca de 64 m. No Peru, de PSAD56 para WGS 84, cerca de 450 m.",
          },
          {
            type: "callout",
            title: "Precisão da mudança de datum",
            text: "A ferramenta usa as transformações do registro EPSG: SAD69 to SIRGAS 2000 (1), do IBGE, com precisão de ±5 m, e PSAD56 to WGS 84 (8), para o Peru, com ±16 m. Córrego Alegre ainda não está disponível. Para locação ou divisas, amarre o trabalho a pontos de controle medidos com GNSS.",
          },
        ],
      },
      {
        id: "ler-a-planta",
        title: "Onde estão as coordenadas numa planta",
        blocks: [
          {
            type: "list",
            items: [
              "**Quadro de coordenadas:** a tabela com vértices, lados, distâncias, ângulos e as coordenadas E e N. É a fonte que vale.",
              "**Carimbo ou legenda:** informa o fuso e o datum.",
              "**Planta de situação:** o croqui com a grade de coordenadas nas bordas. Serve para se localizar a olho, não para medir.",
              "**Coordenadas do visualizador:** as que o AutoCAD ou um app mostram ao tocar o desenho. Numa folha (layout) são milímetros do papel; no modelo, só são reais se a planta foi desenhada em coordenadas UTM.",
            ],
          },
          {
            type: "callout",
            title: "As coordenadas do visualizador podem enganar",
            text: "Se você abre o DWG no celular e toca um ponto, o visualizador pode mostrar algo como 266.26, 106.43: são coordenadas da folha ou do desenho, não do terreno. Numa folha (layout), são milímetros do papel. Use sempre o quadro de coordenadas.",
          },
        ],
      },
      {
        id: "exemplo",
        title: "Exemplo real: uma planta de Nuevo Chimbote, no Peru",
        blocks: [
          {
            type: "p",
            text: "O exemplo carregado é o quadro de uma planta de situação real de Nuevo Chimbote, no Peru: um terreno de quatro vértices no fuso 17 Sul, datum PSAD56, e uma segunda área marcada com as letras A a D.",
          },
          {
            type: "table",
            caption: "Vértices do terreno: PSAD56 na planta, WGS 84 para o Google Maps",
            head: ["Vértice", "E PSAD56 (m)", "N PSAD56 (m)", "Latitude WGS 84", "Longitude WGS 84"],
            numeric: [false, true, true, true, true],
            rows: [
              ["1", "773650,1996", "8992962,5553", "−9.1050551", "−78.5126438"],
              ["2", "773822,0104", "8992802,3829", "−9.1064918", "−78.5110717"],
              ["3", "773548,4967", "8992510,2849", "−9.1091483", "−78.5135402"],
              ["4", "773376,3213", "8992670,4415", "−9.1077118", "−78.5151157"],
            ],
          },
          {
            type: "p",
            text: "O centro do terreno fica em **−9.1071019, −78.5130932** (no formato do Google Maps, com ponto decimal), no bairro Bellamar. O quadro é coerente: os quatro lados e os quatro ângulos batem com as coordenadas e encerram 94.076,58 m² (9,41 ha).",
          },
          {
            type: "p",
            text: "Se as mesmas coordenadas forem coladas como se fossem WGS 84, o ponto cai **447 m a nordeste**, em outro bairro. E o segundo quadro da planta não fecha: declara lados de 16 e 30 m, mas as coordenadas desenham lados de 16,07, 47,00, 33,07 e 30,42 m. A conferência do quadro marca isso em amarelo.",
          },
        ],
      },
      {
        id: "erros",
        title: "Por que o ponto cai no mar ou em outro lugar",
        blocks: [
          {
            type: "list",
            items: [
              "**Datum sem correção:** SAD69 lido como SIRGAS 2000 desloca dezenas de metros; PSAD56 lido como WGS 84, centenas.",
              "**Fuso errado:** o ponto salta centenas de quilômetros, porque o mesmo E se repete em todos os fusos.",
              "**Hemisfério errado:** com «norte» no lugar de «sul», o ponto aparece do outro lado do equador.",
              "**Colunas invertidas:** no Brasil o N tem sete dígitos (7 394 586) e o E seis (333 286). A ferramenta distingue sozinha, mas se o quadro não tem cabeçalho e os dois têm seis dígitos, escolha a ordem à mão.",
              "**Um dígito errado:** no exemplo, a grade da planta de situação diz 763 600 onde o quadro diz 773 600. Esse 6 no lugar de um 7 são 10 km de diferença.",
              "**Coordenadas do visualizador:** as de uma folha são milímetros do papel, e as do modelo só servem se a planta foi desenhada em UTM.",
            ],
          },
        ],
      },
      {
        id: "como-chegar",
        title: "Como chegar ao terreno com o Google Maps",
        blocks: [
          {
            type: "p",
            text: "**Abrir no Google Maps** mostra o ponto; **Como chegar** abre a rota desde a sua localização; **Satélite** mostra a imagem aérea para reconhecer o terreno. **Copiar coordenadas** deixa a latitude e a longitude prontas para colar na busca do Google Maps ou numa mensagem. O **KML** abre o polígono no Google Earth.",
          },
          {
            type: "p",
            text: "Precisa converter centenas de pontos ou levá-los ao Civil 3D? Use o [conversor de coordenadas](/pt/ferramentas/conversor-de-coordenadas), que exporta para Excel, Civil 3D e Google Earth.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Plantas e Civil 3D",
      title: "Recebe plantas em SAD69 ou sem georreferência? Nós automatizamos.",
      body: "Desenvolvemos plugins para AutoCAD e Civil 3D que georreferenciam plantas, convertem coordenadas em lote e conferem os quadros de coordenadas com as regras do seu escritório.",
      prefill:
        "Olá, Zeist. Venho da ferramenta de coordenadas UTM no Google Maps. Tenho interesse em automatizar a georreferência de plantas.",
      secondaryLabel: "Ver plugins sob medida",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "Como colocar coordenadas UTM no Google Maps?",
        a: "O Google Maps não aceita UTM: é preciso converter para latitude e longitude em WGS 84. Digite o E e o N nesta ferramenta, escolha o fuso, o hemisfério e o datum, e use o botão Abrir no Google Maps. Também dá para copiar a latitude e a longitude e colar na busca do Google Maps.",
      },
      {
        q: "Por que minhas coordenadas caem longe do lugar?",
        a: "Quase sempre é o datum: a planta está em SAD69 ou PSAD56 e foi lida como se fosse WGS 84. Em São Paulo, de SAD69 para SIRGAS 2000, a diferença é de cerca de 64 m; no Peru, de PSAD56 para WGS 84, cerca de 450 m. Escolha o datum da planta e a ferramenta corrige a posição.",
      },
      {
        q: "Qual é o fuso UTM da minha planta?",
        a: "O carimbo da planta costuma indicar. Se não indica, depende da longitude: São Paulo, Rio de Janeiro e Belo Horizonte estão no 23 Sul; Porto Alegre e Curitiba no 22 Sul; Salvador e Fortaleza no 24 Sul.",
      },
      {
        q: "Como saber se a planta está em SAD69 ou em SIRGAS 2000?",
        a: "Procure no carimbo ou na legenda: «Datum horizontal» ou «Sistema de referência». Se a planta não informa, escolha «Não sei» e compare no mapa qual das posições bate com as ruas e quadras que você espera.",
      },
      {
        q: "As coordenadas que o visualizador do AutoCAD mostra servem?",
        a: "Só no espaço do modelo e se a planta foi desenhada em coordenadas UTM reais. Numa folha (layout) são milímetros do papel, e muitas plantas são desenhadas em coordenadas locais: o visualizador mostra valores como 266.26, 106.43, que não correspondem ao terreno. Use o quadro de coordenadas.",
      },
      {
        q: "Qual é a precisão da localização?",
        a: "Se a planta está em WGS 84 ou SIRGAS 2000, a conversão é exata. Para SAD69 a precisão é de cerca de ±5 m e para PSAD56 de ±16 m: suficiente para localizar e chegar ao terreno, não para locação. Para divisas, trabalhe com pontos de controle medidos com GNSS.",
      },
      {
        q: "Minhas coordenadas são enviadas a algum servidor?",
        a: "Não. Tudo é calculado no seu navegador. O mapa baixa do OpenStreetMap as imagens da área exibida, e as coordenadas só chegam ao Google se você abrir um dos links do Google Maps.",
      },
    ],
    guides: [
      "ubicar-plano-coordenadas-utm-google-maps",
      "importar-puntos-civil-3d-excel",
      "curvas-de-nivel-civil-3d-google-earth",
      "civil-3d-a-revit-topografia-coordenadas",
    ],
  },

  // ---------------------------------------------------------------------------
  en: {
    seoTitle: "UTM Coordinates on Google Maps: Find Any Site Plan",
    metaDescription:
      "Paste the UTM coordinates from a site plan and see where it is. Fixes the datum, checks the coordinate table and opens it in Google Maps. Free.",
    keywords: [
      "utm coordinates google maps",
      "plot utm coordinates on google maps",
      "utm to google maps converter",
      "enter utm coordinates in google maps",
      "find location from utm coordinates",
      "site plan coordinates to google maps",
    ],
    name: "UTM coordinates on Google Maps",
    eyebrow: "Free tool · Site plans and surveying",
    h1: "UTM coordinates on Google Maps: see where a site plan is and how to get there",
    intro:
      "Paste the coordinate table from a site plan, or type a single point. The tool applies the datum shift, shows the site on a map, checks the table against itself and opens the location in Google Maps for directions.",
    badges: ["Free, no sign-up", "Fixes legacy datums", "Checks the coordinate table", "Opens in Google Maps"],
    calculatorTitle: "Plot a site plan's UTM coordinates on a map",
    answer:
      "Google Maps doesn't accept UTM coordinates: only latitude and longitude in degrees, on WGS 84. To find a site plan, convert its easting and northing using the UTM zone and the datum. Legacy datums move the point: PSAD56, common on older Peruvian plans, shifts it about 450 m. This tool reads the plan's coordinate table, applies the datum shift, shows the site on a map, checks the table against itself and opens the location in Google Maps for directions.",
    sections: [
      {
        id: "step-by-step",
        title: "How to plot UTM coordinates on Google Maps, step by step",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Copy the plan's **coordinate table** (point, side, distance, angle, easting and northing) from the PDF, Excel or AutoCAD and paste it into the table with Ctrl+V. No cleanup needed: the tool finds the easting and northing in each row and fills the columns. You can also type the points one by one, or a single point.",
              "Pick the **UTM zone** and **hemisphere**. Plans usually state them in the title block or legend.",
              "Pick the plan's **datum**. If it doesn't say, choose «I don't know» and compare where each reading lands on the map.",
              "Check the site on the map and open it in **Google Maps**: to see the point, the satellite view, or get directions.",
            ],
          },
          {
            type: "p",
            text: "Why not just type the easting and northing into Google Maps? Because its search box only reads degrees: decimal (−9.1071019, −78.5130932), degrees-minutes-seconds or decimal minutes. UTM coordinates must be converted first and, if the plan isn't on WGS 84, shifted to it. We walk through a real case in [how to plot a site plan's UTM coordinates on Google Maps](/en/blog/plot-utm-coordinates-google-maps).",
          },
        ],
      },
      {
        id: "zone-and-datum",
        title: "Zone and datum: what decides where the point lands",
        blocks: [
          {
            type: "p",
            text: "UTM coordinates only mean something with their zone, hemisphere and datum. With the wrong zone the point jumps hundreds of kilometers, because the same easting repeats in every zone. With the wrong datum it moves tens or hundreds of meters.",
          },
          { type: "formula", text: "zone = 1 + floor((longitude + 180) ÷ 6)" },
          {
            type: "p",
            text: "The contiguous United States runs from zone 10 (West Coast) to zone 19 (Maine), all northern hemisphere. NAD83 matches WGS 84 within a few meters, so NAD83 UTM coordinates plot correctly. NAD27 isn't supported yet, and State Plane coordinates need converting to UTM or latitude and longitude first.",
          },
          {
            type: "callout",
            title: "How accurate the datum shift is",
            text: "The tool uses the EPSG transformations PSAD56 to WGS 84 (8) for Peru (±16 m) and SAD69 to SIRGAS 2000 (1) for Brazil (±5 m). That's enough to find a site and drive to it, not for staking. For boundaries, tie the work to control points surveyed with GNSS.",
          },
        ],
      },
      {
        id: "reading-the-plan",
        title: "Where the coordinates are on a plan",
        blocks: [
          {
            type: "list",
            items: [
              "**Coordinate table:** points, sides, distances, angles and the easting and northing of each corner. That's the source to trust.",
              "**Title block or legend:** states the zone and the datum.",
              "**Location map:** the inset with a coordinate grid on its edges. Good for orienting yourself, not for measuring.",
              "**Viewer coordinates:** what AutoCAD or a mobile app shows when you tap the drawing. On a layout they are millimeters of paper; in model space they're only real if the plan was drawn in UTM.",
            ],
          },
          {
            type: "callout",
            title: "Viewer coordinates can fool you",
            text: "Open a DWG on your phone and tap a point, and the viewer may show something like 266.26, 106.43: sheet or drawing coordinates, not ground ones. On a layout they are millimeters of paper. Always use the coordinate table.",
          },
        ],
      },
      {
        id: "example",
        title: "A real example: a site plan from Nuevo Chimbote, Peru",
        blocks: [
          {
            type: "p",
            text: "The preloaded example is the coordinate table of a real location plan from Nuevo Chimbote, Peru: a four-corner lot in UTM zone 17 South, PSAD56 datum, plus a second area labeled A to D.",
          },
          {
            type: "table",
            caption: "Lot corners: PSAD56 on the plan, WGS 84 for Google Maps",
            head: ["Point", "Easting PSAD56 (m)", "Northing PSAD56 (m)", "Latitude WGS 84", "Longitude WGS 84"],
            numeric: [false, true, true, true, true],
            rows: [
              ["1", "773650.1996", "8992962.5553", "−9.1050551", "−78.5126438"],
              ["2", "773822.0104", "8992802.3829", "−9.1064918", "−78.5110717"],
              ["3", "773548.4967", "8992510.2849", "−9.1091483", "−78.5135402"],
              ["4", "773376.3213", "8992670.4415", "−9.1077118", "−78.5151157"],
            ],
          },
          {
            type: "p",
            text: "The center of the lot is at **−9.1071019, −78.5130932**, in the Bellamar neighborhood. The table is consistent: its four sides and four angles match the coordinates and enclose 94,076.58 m² (9.41 ha).",
          },
          {
            type: "p",
            text: "Paste the same numbers as if they were WGS 84 and the point lands **447 m to the northeast**, in another neighborhood. And the plan's second table doesn't close: it states sides of 16 and 30 m, but its coordinates draw sides of 16.07, 47.00, 33.07 and 30.42 m. The table check flags it in amber.",
          },
        ],
      },
      {
        id: "mistakes",
        title: "Why your point lands in the ocean or somewhere else",
        blocks: [
          {
            type: "list",
            items: [
              "**Datum not shifted:** PSAD56 read as WGS 84 moves the point about 450 m in northern Peru.",
              "**Wrong zone:** the point jumps hundreds of kilometers, because the same easting repeats in every zone.",
              "**Wrong hemisphere:** «north» instead of «south» puts the point on the other side of the equator.",
              "**Swapped columns:** in the southern hemisphere the northing has seven digits and the easting six. The tool tells them apart, but if a table has no header and both have six digits, set the order by hand.",
              "**A mistyped digit:** in the example, the location map's grid reads 763,600 where the table says 773,600. That 6 for a 7 is 10 km.",
              "**Viewer coordinates:** on a layout they are millimeters of paper, and in model space they only work if the plan was drawn in UTM.",
            ],
          },
        ],
      },
      {
        id: "directions",
        title: "Getting to the site with Google Maps",
        blocks: [
          {
            type: "p",
            text: "**Open in Google Maps** shows the point; **Directions** opens a route from where you are; **Satellite view** shows the aerial photo so you can recognize the site. **Copy coordinates** gives you the latitude and longitude ready to paste into Google Maps or a message. The **KML** opens the outline in Google Earth.",
          },
          {
            type: "p",
            text: "Need to convert hundreds of points or bring them into Civil 3D? Use the [UTM to lat long converter](/en/tools/utm-converter), which exports to Excel, Civil 3D and Google Earth.",
          },
        ],
      },
    ],
    cta: {
      eyebrow: "Site plans and Civil 3D",
      title: "Getting plans on legacy datums or not georeferenced? We automate it.",
      body: "We build AutoCAD and Civil 3D plugins that georeference plans, convert coordinates in bulk and check coordinate tables against your firm's rules.",
      prefill: "Hi Zeist. I'm coming from the UTM coordinates on Google Maps tool. I'm interested in automating plan georeferencing.",
      secondaryLabel: "See custom plugins",
      secondaryPath: "servicios/add-ins-revit-civil-3d",
    },
    faqs: [
      {
        q: "How do I enter UTM coordinates in Google Maps?",
        a: "Google Maps doesn't accept UTM: convert to latitude and longitude on WGS 84 first. Type the easting and northing into this tool, pick the zone, hemisphere and datum, and use Open in Google Maps. You can also copy the latitude and longitude and paste them into the Google Maps search box.",
      },
      {
        q: "Why do my coordinates land hundreds of meters off?",
        a: "Usually it's the datum: the plan is on a legacy datum and was read as WGS 84. PSAD56, used on older Peruvian plans, shifts the point about 450 m. Pick the plan's datum and the tool corrects the position.",
      },
      {
        q: "How do I find the UTM zone of a site plan?",
        a: "Check the title block or legend. If it isn't there, it follows from the longitude: zone = 1 + floor((longitude + 180) / 6). The contiguous US spans zones 10 to 19, northern hemisphere.",
      },
      {
        q: "Does it work with NAD83 or State Plane coordinates?",
        a: "NAD83 UTM coordinates work: NAD83 matches WGS 84 within a few meters. State Plane coordinates need converting to UTM or latitude and longitude first, and NAD27 isn't supported yet.",
      },
      {
        q: "Can I use the coordinates the AutoCAD viewer shows?",
        a: "Only in model space, and only if the plan was drawn in real UTM coordinates. On a layout they are millimeters of paper, and many plans are drawn in local coordinates: the viewer shows values like 266.26, 106.43 that don't match the ground. Use the coordinate table.",
      },
      {
        q: "How accurate is the location?",
        a: "On WGS 84 or NAD83 the conversion is exact to the coordinates given. With PSAD56 the datum shift is good to about ±16 m: enough to find the site and drive there, not for staking. For boundaries, work from control points surveyed with GNSS.",
      },
      {
        q: "Are my coordinates sent to a server?",
        a: "No. Everything runs in your browser. The map downloads OpenStreetMap tiles for the area shown, and coordinates only reach Google if you open one of the Google Maps links.",
      },
    ],
    guides: [
      "ubicar-plano-coordenadas-utm-google-maps",
      "importar-puntos-civil-3d-excel",
      "curvas-de-nivel-civil-3d-google-earth",
      "civil-3d-a-revit-topografia-coordenadas",
    ],
  },
};

const labels: Record<Locale, PlanLocatorLabels> = {
  es: {
    modeTable: "Cuadro del plano",
    modeSingle: "Un punto",
    zone: "Zona UTM",
    hemisphere: "Hemisferio",
    north: "Norte (N)",
    south: "Sur (S)",
    zoneHint:
      "En el Perú, hemisferio sur: zona 17 para Tumbes, Piura, Chiclayo, Trujillo, Chimbote y Cajamarca; 18 para Lima, Huaraz, Ica, Huancayo, Ayacucho e Iquitos; 19 para Arequipa, Cusco, Puno, Tacna y Puerto Maldonado.",
    datum: "Datum (lo dice el plano)",
    datums: {
      wgs84: "WGS84 (GPS, Google Maps)",
      sirgas2000: "SIRGAS 2000",
      nad83: "NAD83 (Norteamérica)",
      psad56: "PSAD56 (Perú)",
      sad69: "SAD69 (Brasil)",
    },
    datumOrder: ["psad56", "wgs84", "sirgas2000", "sad69", "nad83"],
    datumUnknown: "No lo sé: comparar en el mapa",
    orders: { auto: "Detectar solo", EN: "Este, Norte", NE: "Norte, Este" },
    tableHeading: "Cuadro de datos técnicos",
    pasteTip:
      "Copia el cuadro del plano desde Excel, el PDF o AutoCAD y pégalo con Ctrl+V en cualquier celda: la herramienta reconoce las columnas. También puedes escribir vértice por vértice; Enter pasa a la fila siguiente.",
    pasteButton: "Pegar cuadro",
    table: {
      title: "Cuadro {n}",
      count: ["{n} vértice", "{n} vértices"],
      cols: { name: "Vértice", e: "Este (m)", n: "Norte (m)", length: "Distancia al siguiente (m)", angle: "Ángulo interno" },
      side: "Lado {from}–{to} (m)",
      optional: "opcional",
      addRow: "Agregar vértice",
      addTable: "Agregar otro cuadro",
      removeRow: "Quitar el vértice {name}",
      removeTable: "Quitar el cuadro {n}",
      placeholders: { e: "Ej.: 773650.20", n: "Ej.: 8992962.56", angle: "Ej.: 90°09'45\"" },
    },
    pasted: "Listo, llenamos la tabla con lo que pegaste.",
    pasteFailed: "No encontramos coordenadas Este y Norte en lo que pegaste. Copia el cuadro completo o solo esas dos columnas.",
    clipboardBlocked:
      "Tu navegador no deja leer el portapapeles desde aquí: haz clic en una celda y pega con Ctrl+V (en el celular, mantén presionada la celda y elige Pegar).",
    cleared: "Tabla vacía: escribe o pega un cuadro nuevo.",
    undo: "Deshacer",
    incomplete: [
      "1 fila no tiene un Este y un Norte válidos: no se usa en el mapa.",
      "{n} filas no tienen un Este y un Norte válidos: no se usan en el mapa.",
    ],
    loadExample: "Cargar el ejemplo",
    clear: "Limpiar",
    easting: "Este (X)",
    northing: "Norte (Y)",
    pointName: "P",
    readSummary: "Vértices leídos: {points} · cuadros: {groups}.",
    columnsRead: "Columnas leídas como {order}.",
    skipped: "No pudimos leer las líneas {lines}: revisa que tengan Este y Norte.",
    streamNote: "Las coordenadas venían una por línea: las emparejamos en orden.",
    empty: "Escribe o pega el cuadro de coordenadas en la tabla, o un solo punto, para verlo en el mapa.",
    whereTitle: "Tu plano está aquí",
    centerOfGroup: "Centro del terreno · {name}",
    pointLabel: "Punto {name}",
    copy: "Copiar coordenadas",
    copied: "Copiado ✓",
    openMaps: "Abrir en Google Maps",
    directions: "Cómo llegar",
    satellite: "Vista satélite",
    kml: "Descargar KML (Google Earth)",
    accuracy: "Cambio de datum con la transformación {source}, precisión de ±{m} m: alcanza para ubicar el plano y llegar al terreno; para replanteo, usa puntos de control.",
    rawNote:
      "Si pegas estas coordenadas tal cual en Google Maps o en un GPS, caes a {m} m de aquí: es la línea punteada del mapa, la diferencia entre el datum del plano y WGS84.",
    showRaw: "Mostrar dónde caería sin corregir el datum",
    compareTitle: "Dónde cae el plano según cada datum",
    compareBody:
      "Si el plano no dice su datum, compara: cada color es una lectura distinta de las mismas coordenadas. Elige la que calce con las calles, las manzanas o el terreno que esperas ver, y vuelve a elegir ese datum arriba.",
    compareDistance: "a {m} m de la lectura WGS84",
    compareNames: { wgs84: "WGS84 / SIRGAS 2000", psad56: "PSAD56 (Perú)", sad69: "SAD69 (Brasil)" },
    outsideArea: {
      psad56: "Este punto cae fuera del Perú, y la corrección PSAD56 que usamos es la del Perú. Revisa la zona, el hemisferio y el datum.",
      sad69: "Este punto cae fuera del Brasil, y la corrección SAD69 que usamos es la del Brasil. Revisa la zona, el hemisferio y el datum.",
    },
    mapTitle: "El plano en el mapa",
    mapHint: "Arrastra y haz zoom para comparar con las calles.",
    legendPlan: "Ubicación correcta (WGS84)",
    legendRaw: "Sin corregir el datum",
    checkTitle: "Revisión del cuadro",
    checkIntro:
      "Comparamos las longitudes y los ángulos que declara el cuadro con los que dan sus coordenadas. Si no coinciden, algo está mal en el plano.",
    groupTitle: "Cuadro {n} · vértices {first} a {last}",
    area: "Área",
    perimeter: "Perímetro",
    hectares: "ha",
    consistent: "El cuadro es coherente: las longitudes y los ángulos coinciden con las coordenadas.",
    inconsistent:
      "El cuadro no cuadra: las medidas que declara no coinciden con sus coordenadas. Antes de usarlo, confirma cuál de las dos es la correcta.",
    noStated: "Este cuadro no trae longitudes ni ángulos: mostramos las medidas que dan sus coordenadas.",
    sideCol: "Lado",
    statedCol: "Cuadro",
    computedCol: "Coordenadas",
    diffCol: "Diferencia (m)",
    vertexCol: "Vértice",
    angleCol: "Ángulo interno",
    ok: "Coincide",
    mismatch: "No coincide",
    warnings: {
      "e-range": "Hay un Este fuera del rango UTM (100 000 a 900 000 m): ¿columnas invertidas o un dígito de más o de menos?",
      "n-range": "Hay un Norte fuera del rango UTM (0 a 10 000 000 m).",
      spread: "Hay vértices a más de 20 km entre sí: revisa que no se mezclen coordenadas de planos distintos o un dígito equivocado.",
    },
    parcelErrors: {
      few: "Hacen falta al menos tres vértices para formar el polígono.",
      "zero-area": "Los vértices están alineados: no encierran un área.",
      "self-intersecting": "Los lados se cruzan: revisa el orden de los vértices.",
    },
    verticesTitle: "Coordenadas de cada vértice",
    cols: { name: "Vértice", e: "Este", n: "Norte", lat: "Latitud", lon: "Longitud", link: "Google Maps" },
    view: "Ver",
    kmlName: "Ubicación del plano · Zeist",
    fileName: "ubicacion-plano-zeist.kml",
    hemi: { n: "N", s: "S", e: "E", w: "O" },
    cta: {
      title: "¿Tu equipo recibe planos en PSAD56 todas las semanas?",
      body: "Hacemos plugins para AutoCAD y Civil 3D que convierten y georreferencian los planos por lotes, revisan los cuadros y dejan todo en WGS84.",
      button: "Escríbenos por WhatsApp",
      prefill: "Hola Zeist. Vengo de la herramienta de coordenadas UTM en Google Maps. Quiero automatizar la georreferenciación de planos.",
    },
    example: { ...exampleInput, e: "773650.1996", n: "8992962.5553" },
  },
  pt: {
    modeTable: "Quadro da planta",
    modeSingle: "Um ponto",
    zone: "Fuso UTM",
    hemisphere: "Hemisfério",
    north: "Norte (N)",
    south: "Sul (S)",
    zoneHint:
      "No Brasil, hemisfério sul em quase todo o território: fuso 22 para Porto Alegre e Curitiba; 23 para São Paulo, Rio de Janeiro, Belo Horizonte e Brasília; 24 para Salvador e Fortaleza. O exemplo carregado é do Peru, fuso 17 Sul.",
    datum: "Datum (indicado na planta)",
    datums: {
      wgs84: "WGS 84 (GPS, Google Maps)",
      sirgas2000: "SIRGAS 2000",
      nad83: "NAD83 (América do Norte)",
      psad56: "PSAD56 (Peru)",
      sad69: "SAD69 (Brasil)",
    },
    datumOrder: ["sirgas2000", "sad69", "wgs84", "psad56", "nad83"],
    datumUnknown: "Não sei: comparar no mapa",
    orders: { auto: "Detectar sozinho", EN: "E, N", NE: "N, E" },
    tableHeading: "Quadro de coordenadas",
    pasteTip:
      "Copie o quadro da planta do Excel, do PDF ou do AutoCAD e cole com Ctrl+V em qualquer célula: a ferramenta reconhece as colunas. Também dá para digitar vértice por vértice; Enter passa para a linha seguinte.",
    pasteButton: "Colar quadro",
    table: {
      title: "Quadro {n}",
      count: ["{n} vértice", "{n} vértices"],
      cols: { name: "Vértice", e: "E (m)", n: "N (m)", length: "Distância ao próximo (m)", angle: "Ângulo interno" },
      side: "Lado {from}–{to} (m)",
      optional: "opcional",
      addRow: "Adicionar vértice",
      addTable: "Adicionar outro quadro",
      removeRow: "Remover o vértice {name}",
      removeTable: "Remover o quadro {n}",
      placeholders: { e: "Ex.: 773650,20", n: "Ex.: 8992962,56", angle: "Ex.: 90°09'45\"" },
    },
    pasted: "Pronto, preenchemos a tabela com o que você colou.",
    pasteFailed: "Não encontramos coordenadas E e N no que você colou. Copie o quadro completo ou só essas duas colunas.",
    clipboardBlocked:
      "Seu navegador não deixa ler a área de transferência daqui: clique numa célula e cole com Ctrl+V (no celular, toque e segure a célula e escolha Colar).",
    cleared: "Tabela vazia: digite ou cole um quadro novo.",
    undo: "Desfazer",
    incomplete: [
      "1 linha não tem E e N válidos: não é usada no mapa.",
      "{n} linhas não têm E e N válidos: não são usadas no mapa.",
    ],
    loadExample: "Carregar o exemplo",
    clear: "Limpar",
    easting: "E (Leste)",
    northing: "N (Norte)",
    pointName: "P",
    readSummary: "Vértices lidos: {points} · quadros: {groups}.",
    columnsRead: "Colunas lidas como {order}.",
    skipped: "Não conseguimos ler as linhas {lines}: confira se têm E e N.",
    streamNote: "As coordenadas vieram uma por linha: juntamos em ordem.",
    empty: "Digite ou cole o quadro de coordenadas na tabela, ou um único ponto, para vê-lo no mapa.",
    whereTitle: "A sua planta está aqui",
    centerOfGroup: "Centro do terreno · {name}",
    pointLabel: "Ponto {name}",
    copy: "Copiar coordenadas",
    copied: "Copiado ✓",
    openMaps: "Abrir no Google Maps",
    directions: "Como chegar",
    satellite: "Satélite",
    kml: "Baixar KML (Google Earth)",
    accuracy: "Mudança de datum com a transformação {source}, precisão de ±{m} m: basta para localizar a planta e chegar ao terreno; para locação, use pontos de controle.",
    rawNote:
      "Se você colar essas coordenadas como estão no Google Maps ou num GPS, cai a {m} m daqui: é a linha tracejada do mapa, a diferença entre o datum da planta e o WGS 84.",
    showRaw: "Mostrar onde cairia sem corrigir o datum",
    compareTitle: "Onde a planta cai em cada datum",
    compareBody:
      "Se a planta não informa o datum, compare: cada cor é uma leitura diferente das mesmas coordenadas. Escolha a que bate com as ruas, as quadras ou o terreno que você espera ver, e selecione esse datum acima.",
    compareDistance: "a {m} m da leitura WGS 84",
    compareNames: { wgs84: "WGS 84 / SIRGAS 2000", psad56: "PSAD56 (Peru)", sad69: "SAD69 (Brasil)" },
    outsideArea: {
      psad56: "Este ponto cai fora do Peru, e a correção PSAD56 usada aqui é a do Peru. Confira o fuso, o hemisfério e o datum.",
      sad69: "Este ponto cai fora do Brasil, e a correção SAD69 usada aqui é a do IBGE. Confira o fuso, o hemisfério e o datum.",
    },
    mapTitle: "A planta no mapa",
    mapHint: "Arraste e dê zoom para comparar com as ruas.",
    legendPlan: "Localização correta (WGS 84)",
    legendRaw: "Sem corrigir o datum",
    checkTitle: "Conferência do quadro",
    checkIntro:
      "Comparamos as distâncias e os ângulos que o quadro declara com os que as coordenadas dão. Se não batem, há algo errado na planta.",
    groupTitle: "Quadro {n} · vértices {first} a {last}",
    area: "Área",
    perimeter: "Perímetro",
    hectares: "ha",
    consistent: "O quadro é coerente: as distâncias e os ângulos batem com as coordenadas.",
    inconsistent:
      "O quadro não fecha: as medidas que declara não batem com as coordenadas. Antes de usá-lo, confirme qual das duas está correta.",
    noStated: "Este quadro não traz distâncias nem ângulos: mostramos as medidas que as coordenadas dão.",
    sideCol: "Lado",
    statedCol: "Quadro",
    computedCol: "Coordenadas",
    diffCol: "Diferença (m)",
    vertexCol: "Vértice",
    angleCol: "Ângulo interno",
    ok: "Bate",
    mismatch: "Não bate",
    warnings: {
      "e-range": "Há um E fora da faixa UTM (100 000 a 900 000 m): colunas invertidas ou um dígito a mais ou a menos?",
      "n-range": "Há um N fora da faixa UTM (0 a 10 000 000 m).",
      spread: "Há vértices a mais de 20 km entre si: confira se não há coordenadas de plantas diferentes ou um dígito errado.",
    },
    parcelErrors: {
      few: "São necessários pelo menos três vértices para formar o polígono.",
      "zero-area": "Os vértices estão alinhados: não encerram uma área.",
      "self-intersecting": "Os lados se cruzam: confira a ordem dos vértices.",
    },
    verticesTitle: "Coordenadas de cada vértice",
    cols: { name: "Vértice", e: "E", n: "N", lat: "Latitude", lon: "Longitude", link: "Google Maps" },
    view: "Ver",
    kmlName: "Localização da planta · Zeist",
    fileName: "localizacao-planta-zeist.kml",
    hemi: { n: "N", s: "S", e: "L", w: "O" },
    cta: {
      title: "Sua equipe recebe plantas em SAD69 toda semana?",
      body: "Fazemos plugins para AutoCAD e Civil 3D que convertem e georreferenciam plantas em lote, conferem os quadros e deixam tudo em SIRGAS 2000.",
      button: "Fale conosco pelo WhatsApp",
      prefill: "Olá, Zeist. Venho da ferramenta de coordenadas UTM no Google Maps. Quero automatizar a georreferência de plantas.",
    },
    example: { ...exampleInput, e: "773650,1996", n: "8992962,5553" },
  },
  en: {
    modeTable: "Plan table",
    modeSingle: "One point",
    zone: "UTM zone",
    hemisphere: "Hemisphere",
    north: "North (N)",
    south: "South (S)",
    zoneHint:
      "Zone = 1 + floor((longitude + 180) / 6). The contiguous US spans zones 10 to 19, northern hemisphere. The preloaded example is from Peru, zone 17 South.",
    datum: "Datum (stated on the plan)",
    datums: {
      wgs84: "WGS 84 (GPS, Google Maps)",
      sirgas2000: "SIRGAS 2000",
      nad83: "NAD83 (≈ WGS 84)",
      psad56: "PSAD56 (Peru)",
      sad69: "SAD69 (Brazil)",
    },
    datumOrder: ["wgs84", "nad83", "psad56", "sad69", "sirgas2000"],
    datumUnknown: "I don't know: compare on the map",
    orders: { auto: "Detect automatically", EN: "Easting, Northing", NE: "Northing, Easting" },
    tableHeading: "Coordinate table",
    pasteTip:
      "Copy the plan's table from Excel, the PDF or AutoCAD and paste it with Ctrl+V into any cell: the tool recognizes the columns. You can also type point by point; Enter moves to the next row.",
    pasteButton: "Paste table",
    table: {
      title: "Table {n}",
      count: ["{n} point", "{n} points"],
      cols: { name: "Point", e: "Easting (m)", n: "Northing (m)", length: "Distance to next (m)", angle: "Interior angle" },
      side: "Side {from}–{to} (m)",
      optional: "optional",
      addRow: "Add point",
      addTable: "Add another table",
      removeRow: "Remove point {name}",
      removeTable: "Remove table {n}",
      placeholders: { e: "e.g. 773650.20", n: "e.g. 8992962.56", angle: "e.g. 90°09'45\"" },
    },
    pasted: "Done: we filled the table with what you pasted.",
    pasteFailed: "We couldn't find easting and northing pairs in what you pasted. Copy the full table, or just those two columns.",
    clipboardBlocked:
      "Your browser won't let us read the clipboard from here: click a cell and paste with Ctrl+V (on a phone, press and hold the cell, then Paste).",
    cleared: "Table cleared: type or paste a new one.",
    undo: "Undo",
    incomplete: [
      "1 row has no valid easting and northing, so it isn't on the map.",
      "{n} rows have no valid easting and northing, so they aren't on the map.",
    ],
    loadExample: "Load the example",
    clear: "Clear",
    easting: "Easting (X)",
    northing: "Northing (Y)",
    pointName: "P",
    readSummary: "Points read: {points} · tables: {groups}.",
    columnsRead: "Columns read as {order}.",
    skipped: "Couldn't read lines {lines}: check they have an easting and a northing.",
    streamNote: "The coordinates came one per line: we paired them in order.",
    empty: "Type or paste the coordinate table, or a single point, to see it on the map.",
    whereTitle: "Your plan is here",
    centerOfGroup: "Center of the lot · {name}",
    pointLabel: "Point {name}",
    copy: "Copy coordinates",
    copied: "Copied ✓",
    openMaps: "Open in Google Maps",
    directions: "Directions",
    satellite: "Satellite view",
    kml: "Download KML (Google Earth)",
    accuracy: "Datum shift with the {source} transformation, accurate to ±{m} m: enough to find the plan and reach the site; for staking, use control points.",
    rawNote:
      "Paste these coordinates as is into Google Maps or a GPS and you land {m} m from here: the dashed outline on the map, the difference between the plan's datum and WGS 84.",
    showRaw: "Show where it lands without the datum shift",
    compareTitle: "Where the plan lands on each datum",
    compareBody:
      "If the plan doesn't state its datum, compare: each color is a different reading of the same numbers. Pick the one that fits the streets, blocks or site you expect, then select that datum above.",
    compareDistance: "{m} m from the WGS 84 reading",
    compareNames: { wgs84: "WGS 84 / NAD83", psad56: "PSAD56 (Peru)", sad69: "SAD69 (Brazil)" },
    outsideArea: {
      psad56: "This point is outside Peru, and the PSAD56 shift used here is Peru's. Check the zone, hemisphere and datum.",
      sad69: "This point is outside Brazil, and the SAD69 shift used here is Brazil's. Check the zone, hemisphere and datum.",
    },
    mapTitle: "The plan on the map",
    mapHint: "Drag and zoom to compare with the streets.",
    legendPlan: "Correct location (WGS 84)",
    legendRaw: "Without the datum shift",
    checkTitle: "Coordinate table check",
    checkIntro:
      "We compare the distances and angles the table states with the ones its coordinates give. If they don't match, something on the plan is wrong.",
    groupTitle: "Table {n} · points {first} to {last}",
    area: "Area",
    perimeter: "Perimeter",
    hectares: "ha",
    consistent: "The table is consistent: distances and angles match the coordinates.",
    inconsistent:
      "The table doesn't close: the measurements it states don't match its coordinates. Before using it, confirm which of the two is right.",
    noStated: "This table has no distances or angles: we show the measurements its coordinates give.",
    sideCol: "Side",
    statedCol: "Table",
    computedCol: "Coordinates",
    diffCol: "Difference (m)",
    vertexCol: "Point",
    angleCol: "Interior angle",
    ok: "Matches",
    mismatch: "Doesn't match",
    warnings: {
      "e-range": "An easting is outside the UTM range (100,000 to 900,000 m): swapped columns, or a digit too many or too few?",
      "n-range": "A northing is outside the UTM range (0 to 10,000,000 m).",
      spread: "Some points are more than 20 km apart: check you haven't mixed coordinates from different plans, or mistyped a digit.",
    },
    parcelErrors: {
      few: "At least three points are needed to form a polygon.",
      "zero-area": "The points are in a line: they don't enclose an area.",
      "self-intersecting": "Sides cross each other: check the order of the points.",
    },
    verticesTitle: "Coordinates of each point",
    cols: { name: "Point", e: "Easting", n: "Northing", lat: "Latitude", lon: "Longitude", link: "Google Maps" },
    view: "View",
    kmlName: "Site plan location · Zeist",
    fileName: "site-plan-location-zeist.kml",
    hemi: { n: "N", s: "S", e: "E", w: "W" },
    cta: {
      title: "Does your team keep getting plans on legacy datums?",
      body: "We build AutoCAD and Civil 3D plugins that convert and georeference plans in bulk, check coordinate tables and leave everything on WGS 84.",
      button: "Message us on WhatsApp",
      prefill: "Hi Zeist. I'm coming from the UTM coordinates on Google Maps tool. I want to automate plan georeferencing.",
    },
    example: { ...exampleInput, e: "773650.1996", n: "8992962.5553" },
  },
};

export function getPlanLocatorContent(locale: Locale): ToolContent {
  return content[locale];
}

export function getPlanLocatorLabels(locale: Locale): PlanLocatorLabels {
  return labels[locale];
}
