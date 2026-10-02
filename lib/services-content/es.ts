import type { ServicePage, ServiceSlug } from "@/lib/services";

export const servicesEs: Record<ServiceSlug, ServicePage> = {
  // ---------------------------------------------------------------------------
  "add-ins-revit-civil-3d": {
    seoTitle: "Desarrollo de plugins para Revit y Civil 3D a medida",
    metaDescription:
      "Desarrollamos plugins y add-ins a medida para Revit y Civil 3D en C#: metrados, láminas, redes, acero y control de calidad con tu estándar. El código es tuyo.",
    keywords: [
      "desarrollo de plugins para revit",
      "plugin para revit",
      "plugins para civil 3d",
      "desarrollo de add-ins revit",
      "programador revit api",
      "revit plugin development",
      "civil 3d api c#",
    ],
    serviceType: "Desarrollo de plugins y add-ins para Revit y Civil 3D",
    eyebrow: "Servicio · Plugins y add-ins a medida",
    h1: "Desarrollo de plugins para Revit y Civil 3D a medida",
    intro:
      "Convertimos las tareas que tu equipo repite en cada proyecto en botones dentro de Revit y Civil 3D. Programamos en C# sobre la API oficial de Autodesk, con tu estándar, tu nomenclatura y tus formatos de entrega. Y el código es tuyo.",
    answer:
      "Un plugin (o add-in) para Revit o Civil 3D es un programa que se instala dentro del software y agrega botones propios a la barra superior. Se programa en C# sobre la API oficial de Autodesk —la interfaz que permite controlar Revit y Civil 3D desde código— y sirve para automatizar tareas repetitivas con reglas fijas: metrados, láminas, redes de tuberías, armado de acero o control de calidad. Zeist desarrolla plugins a medida para empresas de ingeniería y construcción: diagnóstico, prototipo, desarrollo, instalador para toda la oficina y soporte cuando sale una nueva versión.",
    facts: [
      { label: "Plazo típico", value: "4 a 8 semanas" },
      { label: "Tecnología", value: "C# / .NET · API de Autodesk" },
      { label: "Propiedad", value: "El código es tuyo" },
      { label: "Modalidad", value: "Remota · Perú y Latinoamérica" },
    ],
    prefill:
      "Hola Zeist. Me interesa desarrollar un plugin para Revit / Civil 3D. Esta es la tarea que queremos automatizar:",
    painsTitle: "Si tu equipo vive alguna de estas situaciones, un plugin a medida es para ti",
    pains: [
      {
        title: "Las mismas tareas en cada proyecto",
        body: "Metrados, láminas, renombrar vistas, exportar planos. Tareas sin criterio técnico que consumen días de ingenieros en cada entrega.",
      },
      {
        title: "Entregas que dependen de horas extra",
        body: "El diseño está listo, pero producir el entregable toma toda la última semana, y cualquier cambio de último minuto pone en riesgo la fecha.",
      },
      {
        title: "Errores que aparecen en la revisión",
        body: "Metrados que no coinciden con los planos, nomenclatura fuera de estándar, láminas desactualizadas. Observaciones que se repiten proyecto tras proyecto.",
      },
      {
        title: "Dynamo ya no alcanza",
        body: "Rutinas que solo una persona sabe ejecutar, que se rompen con cada versión o que se vuelven lentas con modelos grandes.",
      },
      {
        title: "Las herramientas genéricas no aplican tu estándar",
        body: "Los plugins comerciales resuelven el caso general, pero no tus partidas, tu nomenclatura ni el formato que exige tu cliente.",
      },
    ],
    buildsTitle: "Plugins que desarrollamos para Revit y Civil 3D",
    buildsIntro: "Cada plugin se construye con las reglas de tu oficina. Estos son los casos más frecuentes:",
    builds: [
      {
        title: "Metrados y cubicaciones desde el modelo",
        body: "Volúmenes de corte y relleno, áreas por capa, longitudes y conteos, en tu formato de partidas y listos para el presupuesto.",
        guide: "automatizar-metrados-cubicaciones-civil-3d",
      },
      {
        title: "Producción automática de láminas",
        body: "Planta y perfil, secciones, cajetín con progresivas, revisiones y exportación con la nomenclatura del cliente.",
        guide: "produccion-planos-automatica-civil-3d-revit",
      },
      {
        title: "Redes de tuberías y bancos de ductos en 3D",
        body: "De la polilínea 2D a la red 3D con codos, tees y yees por regla, y bancos de ductos generados desde su recorrido.",
        guide: "redes-tuberias-civil-3d-accesorios",
      },
      {
        title: "Modelado y revisión de acero en Revit",
        body: "Armado automático desde el cuadro de armados, revisión por norma y metrado de acero por diámetro, elemento y nivel.",
        guide: "plugin-acero-revit-modelado-revision",
      },
      {
        title: "Comparación de versiones de modelos",
        body: "Qué cambió entre la versión que tenías y la que llegó: agregados, eliminados, movidos y modificados, con su reporte.",
        guide: "comparar-modelos-revit-civil-3d-detectar-cambios",
      },
      {
        title: "Revit y Excel en ambos sentidos",
        body: "Exportar, editar parámetros en masa y reimportarlos con validación previa y registro de cada cambio.",
        guide: "exportar-tablas-revit-excel-editar-parametros",
      },
      {
        title: "Auditoría y control de calidad",
        body: "Salud del modelo, verificación del estándar y revisión automática antes de cada entrega.",
        guide: "revit-lento-modelo-pesado-auditoria",
      },
    ],
    processTitle: "Cómo desarrollamos tu plugin",
    process: [
      {
        title: "Diagnóstico",
        body: "Vemos la tarea en tu proceso real, medimos cuánto tiempo consume y escribimos las reglas que el plugin debe aplicar. El diagnóstico inicial es gratuito.",
        time: "1 semana",
      },
      {
        title: "Prototipo",
        body: "Validamos la lógica sobre un proyecto real, en Dynamo o en una versión mínima del plugin. Si no da el mismo resultado que el método manual, se corrige antes de seguir.",
        time: "1-2 semanas",
      },
      {
        title: "Desarrollo",
        body: "Programamos el plugin en C# con manejo de errores, registro de lo que hace y pruebas sobre tus propios modelos.",
        time: "2-4 semanas",
      },
      {
        title: "Instalación y formación",
        body: "Instalador para toda la oficina, botón en la barra superior, capacitación del equipo y manual de uso.",
        time: "Unos días",
      },
      {
        title: "Soporte",
        body: "Ajustes después de la entrega y actualización cuando Autodesk publica una nueva versión de Revit o Civil 3D.",
        time: "Continuo",
      },
    ],
    deliverablesTitle: "Qué recibe tu empresa",
    deliverables: [
      "El plugin instalado, con su botón en la barra superior de Revit o Civil 3D",
      "Un instalador para desplegarlo en toda la oficina",
      "El código fuente completo: el plugin es propiedad de tu empresa",
      "Manual de uso y capacitación para el equipo",
      "Documentación técnica para que otro desarrollador pueda mantenerlo",
      "Pruebas sobre tus propios modelos antes de la entrega",
    ],
    comparison: {
      title: "Plugin a medida o herramienta genérica",
      criterionLabel: "Criterio",
      leftLabel: "Plugin a medida",
      rightLabel: "Herramienta genérica",
      rows: "Aplica tu estándar y tu nomenclatura | *Exactamente | Solo si coincide || Formato de tus entregables | *El de tu empresa y tu cliente | El del fabricante || Reglas de tu oficina | *Escritas en la herramienta | Hay que adaptarse || Propiedad del código | *Tuya | Del proveedor || Cambios cuando cambia tu proceso | *Se ajusta | Depende del proveedor || Tiempo hasta usarla | Semanas | *Inmediato",
    },
    guides: [
      "desarrollo-add-ins-revit-civil-3d-guia-completa",
      "cuanto-cuesta-un-add-in-revit-civil-3d",
      "dynamo-vs-csharp-civil3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta desarrollar un plugin para Revit o Civil 3D?",
        a: "Depende del alcance: cuántas reglas aplica, cuántas versiones del programa debe soportar y qué tan distintos son los casos que debe resolver. Después del diagnóstico, que es gratuito, te entregamos una propuesta con alcance, plazo y costo. Los factores que mueven el precio están explicados en nuestra guía de costos de add-ins.",
      },
      {
        q: "¿Cuánto tiempo toma desarrollar un plugin?",
        a: "Lo habitual son 4 a 8 semanas desde el diagnóstico hasta la instalación en la oficina. Herramientas pequeñas, como un renombrado o una exportación con reglas, pueden estar listas antes.",
      },
      {
        q: "¿El código del plugin es nuestro?",
        a: "Sí. Entregamos el código fuente completo y la documentación técnica. El plugin es propiedad de tu empresa y puede mantenerlo tu equipo u otro desarrollador.",
      },
      {
        q: "¿Qué versiones de Revit y Civil 3D soportan?",
        a: "Las que use tu oficina. Cada versión de Revit y Civil 3D requiere compilar el plugin para esa versión, así que se define al inicio cuáles se incluyen. Cuando Autodesk publica una nueva, el plugin se actualiza.",
      },
      {
        q: "¿Necesitamos saber programar para usar el plugin?",
        a: "No. El plugin es un botón en la barra superior de Revit o Civil 3D. Si además quieres que tu equipo pueda modificarlo, ofrecemos formación en Revit API, Civil 3D API y Dynamo.",
      },
      {
        q: "¿Cuál es la diferencia entre un plugin y un script de Dynamo?",
        a: "Dynamo es ideal para validar una automatización rápido. Un plugin es mejor para el uso diario: lo usa cualquiera del equipo, maneja errores, es rápido con modelos grandes y se instala en toda la oficina. Muchas veces empezamos en Dynamo y terminamos en plugin.",
      },
      {
        q: "¿Trabajan con empresas fuera de Trujillo?",
        a: "Sí. Estamos en Trujillo, Perú, y trabajamos de forma remota con empresas de todo el Perú y Latinoamérica. El diagnóstico, las revisiones y la instalación se hacen a distancia.",
      },
    ],
    ctaTitle: "¿Qué tarea te gustaría convertir en un botón?",
    ctaBody:
      "Cuéntanos qué hace tu equipo a mano en cada proyecto. En el diagnóstico gratuito medimos cuánto tiempo consume y te decimos si conviene un plugin, un script de Dynamo o ninguno.",
  },

  // ---------------------------------------------------------------------------
  "automatizacion-dynamo": {
    seoTitle: "Scripts de Dynamo para Revit y Civil 3D a medida",
    metaDescription:
      "Scripts de Dynamo a medida para Revit y Civil 3D: documentados, probados en tus modelos y listos para Dynamo Player. La forma más rápida de automatizar.",
    keywords: [
      "scripts dynamo para revit",
      "scripts dynamo civil 3d",
      "automatización con dynamo",
      "dynamo para civil 3d",
      "rutinas dynamo",
      "dynamo automation revit",
      "desarrollo de scripts dynamo",
    ],
    serviceType: "Automatización con Dynamo para Revit y Civil 3D",
    eyebrow: "Servicio · Automatización con Dynamo",
    h1: "Scripts de Dynamo para Revit y Civil 3D, listos para tu producción",
    intro:
      "Desarrollamos rutinas de Dynamo que automatizan tareas repetitivas en Revit y Civil 3D en días, no en meses. Documentadas, probadas sobre tus modelos y listas para que tu equipo las ejecute desde Dynamo Player sin abrir el grafo.",
    answer:
      "Dynamo es la herramienta de programación visual que Autodesk incluye con Revit y Civil 3D: permite armar rutinas conectando bloques, sin escribir código. Un script de Dynamo automatiza tareas con reglas fijas —colocar elementos a lo largo de un eje, numerar, renombrar, extraer datos a Excel— y es la forma más rápida de automatizar, porque una rutina se valida en días. Zeist desarrolla scripts de Dynamo a medida, documentados y probados sobre los modelos de cada empresa, y cuando una rutina se usa en cada proyecto, la convierte en un plugin instalable.",
    facts: [
      { label: "Plazo típico", value: "Días a 2 semanas" },
      { label: "Ejecución", value: "Dynamo Player, sin abrir el grafo" },
      { label: "Programas", value: "Revit y Civil 3D" },
      { label: "Siguiente paso", value: "Plugin, si se usa siempre" },
    ],
    prefill:
      "Hola Zeist. Me interesa automatizar una tarea con Dynamo en Revit / Civil 3D. Esta es la tarea:",
    painsTitle: "Un script de Dynamo a medida tiene sentido si…",
    pains: [
      {
        title: "Necesitas resultados esta semana",
        body: "La tarea duele hoy y no puedes esperar el desarrollo de un plugin. Un script resuelve el problema mientras se decide el siguiente paso.",
      },
      {
        title: "Las reglas todavía cambian",
        body: "El criterio se ajusta proyecto a proyecto. Un grafo de Dynamo se modifica en minutos; conviene esperar a que la regla se estabilice antes de llevarla a un plugin.",
      },
      {
        title: "Ya probaste Dynamo y no funcionó",
        body: "Grafos descargados que no corren con tus modelos, rutinas que solo entiende quien las hizo o que se rompen con cada versión.",
      },
      {
        title: "Quieres validar antes de invertir",
        body: "Antes de encargar un plugin, quieres comprobar con tus propios proyectos que la automatización ahorra lo que promete.",
      },
    ],
    buildsTitle: "Scripts de Dynamo que desarrollamos",
    buildsIntro: "Rutinas típicas, siempre adaptadas a tus reglas y a tus modelos:",
    builds: [
      {
        title: "Colocación de elementos a lo largo de un eje",
        body: "En Civil 3D: postes, señales, barandas o hitos ubicados por progresiva y desplazamiento, con la cota del terreno o del corredor.",
        guide: "plugin-civil-3d-dibujo-3d-automatizado",
      },
      {
        title: "Numeración y renombrado masivo",
        body: "Habitaciones, puertas, vistas, láminas o alineaciones con la nomenclatura de tu estándar.",
        guide: "automatizar-tareas-revit-dynamo-plugins",
      },
      {
        title: "Extracción de datos a Excel",
        body: "Cantidades, parámetros y listados del modelo exportados al formato que usa tu oficina.",
        guide: "deja-de-usar-excel-y-perder-horas",
      },
      {
        title: "Parámetros desde Excel",
        body: "Códigos de partida, clasificaciones y datos de fabricante cargados al modelo desde una hoja.",
        guide: "exportar-tablas-revit-excel-editar-parametros",
      },
      {
        title: "Geometría paramétrica",
        body: "Elementos que se generan a partir de reglas: taludes, muros, cerramientos o componentes repetitivos.",
      },
      {
        title: "Verificación del estándar",
        body: "Revisión de nomenclatura y parámetros obligatorios antes de cada entrega, con un reporte de lo que no cumple.",
        guide: "auditoria-bim-checklist-empresa",
      },
    ],
    processTitle: "Cómo trabajamos un script de Dynamo",
    process: [
      {
        title: "Diagnóstico",
        body: "Vemos la tarea, el resultado que esperas y las reglas que aplica tu equipo. El diagnóstico inicial es gratuito.",
        time: "Unos días",
      },
      {
        title: "Desarrollo del grafo",
        body: "Armamos la rutina con los nodos agrupados y comentados, sin paquetes externos innecesarios que se rompan con las actualizaciones.",
        time: "Días a 2 semanas",
      },
      {
        title: "Prueba sobre tus modelos",
        body: "La ejecutamos sobre un proyecto real y comparamos el resultado con el método manual.",
        time: "Unos días",
      },
      {
        title: "Entrega para Dynamo Player",
        body: "Entradas claras para que cualquiera del equipo la ejecute sin abrir el grafo, con una guía de uso.",
        time: "Al terminar",
      },
      {
        title: "Paso a plugin (opcional)",
        body: "Si la rutina se usa en cada proyecto, la llevamos a un plugin instalable para toda la oficina.",
        time: "Cuando se justifica",
      },
    ],
    deliverablesTitle: "Qué recibe tu empresa",
    deliverables: [
      "El script de Dynamo, documentado, con los nodos agrupados y explicados",
      "Configuración para Dynamo Player: cualquiera del equipo lo ejecuta sin abrir el grafo",
      "Prueba sobre tus propios modelos y comparación con el método manual",
      "Guía de uso para el equipo",
      "Lista de dependencias, sin paquetes externos innecesarios",
      "Una recomendación honesta: si conviene quedarse en Dynamo o pasar a plugin",
    ],
    comparison: {
      title: "Script de Dynamo o plugin en C#",
      criterionLabel: "Criterio",
      leftLabel: "Script de Dynamo",
      rightLabel: "Plugin en C#",
      rows: "Tiempo hasta funcionar | *Días | Semanas || Cambiar las reglas | *En minutos | Requiere desarrollo || Cómo lo ejecuta el equipo | Desde Dynamo Player | Con un botón en la barra superior || Velocidad con modelos grandes | Media | *Alta || Manejo de errores y registro | Básico | *Completo || Ideal para | Validar y tareas que cambian | Producción diaria",
    },
    guides: [
      "dynamo-vs-csharp-civil3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
      "dynamo-csharp-con-ia-claude",
      "automatizar-civil-3d-guia-completa",
    ],
    faqs: [
      {
        q: "¿Qué es Dynamo y para qué sirve?",
        a: "Es la herramienta de programación visual que Autodesk incluye con Revit y Civil 3D. Sirve para automatizar tareas repetitivas conectando bloques, sin escribir código: colocar elementos, numerar, renombrar, extraer datos o generar geometría por reglas.",
      },
      {
        q: "¿Dynamo funciona en Civil 3D?",
        a: "Sí. Civil 3D incluye Dynamo, con nodos propios para alineaciones, perfiles, superficies y corredores. Es especialmente útil para colocar elementos a lo largo de una alineación y para extraer datos del modelo.",
      },
      {
        q: "¿Cuánto tarda desarrollar un script de Dynamo?",
        a: "La mayoría de las rutinas están listas en días o en un par de semanas, incluida la prueba sobre tus modelos. Es la vía más rápida de automatizar.",
      },
      {
        q: "¿Los scripts dejan de funcionar al actualizar Revit o Civil 3D?",
        a: "A veces necesitan ajustes, sobre todo si dependen de paquetes externos. Por eso los desarrollamos con la menor cantidad posible de dependencias y documentados, para que actualizarlos sea sencillo.",
      },
      {
        q: "¿Pueden revisar o arreglar scripts que ya tenemos?",
        a: "Sí. Revisamos el grafo, corregimos lo que falla con tus modelos actuales, lo documentamos y lo dejamos listo para Dynamo Player.",
      },
      {
        q: "¿Cuándo conviene pasar de Dynamo a un plugin?",
        a: "Cuando la rutina se usa en cada proyecto, la ejecutan varias personas, trabaja con modelos grandes o necesita manejar errores sin intervención. Ahí un plugin es más rápido y más robusto.",
      },
    ],
    ctaTitle: "¿Qué tarea te gustaría tener automatizada la próxima semana?",
    ctaBody:
      "Cuéntanos la tarea y cómo la resuelve hoy tu equipo. Te decimos si un script de Dynamo la resuelve y en cuánto tiempo.",
  },

  // ---------------------------------------------------------------------------
  "auditoria-procesos-bim": {
    seoTitle: "Auditoría y consultoría BIM para empresas",
    metaDescription:
      "Auditoría BIM de modelos y procesos para empresas de ingeniería y construcción: diagnóstico con números y un plan para corregir, estandarizar y automatizar.",
    keywords: [
      "auditoría bim",
      "consultoría bim",
      "auditoría de modelos bim",
      "consultoría bim perú",
      "diagnóstico bim empresa",
      "bim consulting",
      "implementación bim empresa",
    ],
    serviceType: "Auditoría y consultoría BIM",
    eyebrow: "Servicio · Auditoría y consultoría BIM",
    h1: "Auditoría y consultoría BIM: descubre dónde pierde horas tu equipo y qué automatizar primero",
    intro:
      "Revisamos tus modelos y medimos cómo trabaja tu equipo. En cuatro semanas recibes un diagnóstico con números y un plan priorizado: qué corregir, qué estandarizar y qué automatizar primero, con el ahorro estimado de cada acción.",
    answer:
      "La auditoría BIM de Zeist es un diagnóstico de cuatro semanas que combina dos revisiones: la auditoría del modelo, que verifica la calidad técnica de los archivos —nomenclatura, coordenadas, salud del modelo, información y coherencia entre modelo, planos y metrados—, y la auditoría del proceso, que mide dónde se pierden horas, qué tareas se repiten y qué estándares faltan. El resultado es un informe con hallazgos priorizados por impacto y esfuerzo y un plan para corregir, estandarizar y automatizar. No es una certificación: es una herramienta de decisión para la dirección técnica.",
    facts: [
      { label: "Duración", value: "4 semanas" },
      { label: "Alcance", value: "Modelos y procesos" },
      { label: "Resultado", value: "Plan priorizado con ahorro estimado" },
      { label: "Modalidad", value: "Remota · presencial en Trujillo" },
    ],
    prefill:
      "Hola Zeist. Me interesa una auditoría BIM para nuestra empresa. Somos una empresa de:",
    painsTitle: "Una auditoría BIM es para tu empresa si…",
    pains: [
      {
        title: "Las observaciones se repiten",
        body: "Las entregas vuelven con los mismos comentarios: metrados que no cuadran, formato, láminas desactualizadas.",
      },
      {
        title: "Cada proyecto sale distinto",
        body: "La calidad del entregable depende de quién lo hizo, no de un estándar que todos aplican.",
      },
      {
        title: "Se acerca una licitación con requisitos BIM",
        body: "Necesitas saber si tus modelos y tu forma de trabajar cumplen lo que te van a exigir, por ejemplo los requisitos del Plan BIM Perú.",
      },
      {
        title: "Los modelos están lentos o se corrompen",
        body: "El equipo pierde tiempo esperando al modelo y nadie sabe exactamente por qué.",
      },
      {
        title: "Quieres automatizar y no sabes por dónde empezar",
        body: "Hay muchas ideas y poco tiempo. Necesitas saber cuál devuelve más horas antes de invertir.",
      },
      {
        title: "El equipo hace horas extra en cada entrega",
        body: "El esfuerzo existe; lo que falta es saber a dónde se va.",
      },
    ],
    buildsTitle: "Qué revisamos en la auditoría BIM",
    buildsIntro: "Dos frentes, con un checklist que adaptamos a tu estándar y a tus tipos de proyecto:",
    builds: [
      {
        title: "Calidad de los modelos",
        body: "Nomenclatura, estructura de archivos, coordenadas compartidas, niveles y rejillas, advertencias, CAD importado y familias.",
        guide: "revit-lento-modelo-pesado-auditoria",
      },
      {
        title: "Información y coherencia",
        body: "Parámetros obligatorios, códigos de partida y coherencia entre el modelo, los planos y los metrados.",
        guide: "auditoria-bim-checklist-empresa",
      },
      {
        title: "Tiempos y reprocesos",
        body: "Cuánto tarda cada etapa, qué se rehace en cada revisión y por qué.",
        guide: "reprocesos-obra-costo-oculto",
      },
      {
        title: "Estándares y plantillas",
        body: "Si existe un estándar escrito y si está incorporado en las plantillas que usa el equipo.",
        guide: "estandarizar-procesos-bim-empresa",
      },
      {
        title: "Personas y conocimiento",
        body: "Qué tareas dependen de una sola persona y qué pasa con la entrega cuando esa persona no está.",
      },
      {
        title: "Oportunidades de automatización",
        body: "Tareas repetitivas candidatas a Dynamo o plugin, con las horas al año que consumen hoy.",
        guide: "automatizar-tareas-revit-dynamo-plugins",
      },
    ],
    processTitle: "Cómo es la auditoría, semana a semana",
    process: [
      {
        title: "Alcance",
        body: "Elegimos dos o tres proyectos representativos y las disciplinas que entran. Definimos qué necesita saber la dirección.",
        time: "Semana 1",
      },
      {
        title: "Revisión de modelos",
        body: "Corremos el checklist del modelo, con herramientas automáticas donde es posible.",
        time: "Semana 2",
      },
      {
        title: "Análisis del proceso",
        body: "Entrevistas cortas con el equipo y observación de una entrega real. Medimos tiempos.",
        time: "Semana 3",
      },
      {
        title: "Informe y plan",
        body: "Hallazgos priorizados, plan en tres frentes y línea base para medir el avance. Lo presentamos a la dirección.",
        time: "Semana 4",
      },
      {
        title: "Implementación (opcional)",
        body: "Puedes ejecutar el plan con tu equipo o con nosotros: estándares, plantillas, scripts de Dynamo y plugins.",
        time: "Después",
      },
    ],
    deliverablesTitle: "Qué recibe tu empresa",
    deliverables: [
      "Un diagnóstico con números: horas por tarea, rondas de observación y estado de los modelos",
      "Hallazgos priorizados por impacto y esfuerzo",
      "Un plan de acción en tres frentes: corregir, estandarizar y automatizar",
      "El ahorro estimado de cada automatización recomendada",
      "Una línea base de indicadores para medir el avance",
      "Una presentación de resultados para la dirección",
    ],
    comparison: {
      title: "Decidir con auditoría o sin ella",
      criterionLabel: "Decisión",
      leftLabel: "Con auditoría",
      rightLabel: "Sin auditoría",
      rows: "Qué automatizar primero | *Lo que más horas devuelve, medido | Lo que parece urgente || Observaciones repetidas | *Se ataca la causa | Se corrige cada síntoma || Inversión en herramientas | *Donde hay retorno | Donde alguien la pidió || Avance | *Medido contra una línea base | Sin referencia || Requisitos del cliente | *Brechas identificadas antes | Se descubren en la revisión",
    },
    guides: [
      "auditoria-bim-checklist-empresa",
      "estandarizar-procesos-bim-empresa",
      "plan-bim-peru-obligatorio-guia-empresas",
      "reprocesos-obra-costo-oculto",
    ],
    faqs: [
      {
        q: "¿Qué es una auditoría BIM?",
        a: "Es una revisión estructurada de cómo una empresa produce sus proyectos en BIM: la calidad de sus modelos y la eficiencia de su proceso. Termina en un informe con hallazgos priorizados y un plan para corregir, estandarizar y automatizar.",
      },
      {
        q: "¿Cuánto dura la auditoría?",
        a: "Cuatro semanas para un alcance de dos o tres proyectos representativos: alcance, revisión de modelos, análisis del proceso e informe final.",
      },
      {
        q: "¿Qué necesitan de nuestro equipo?",
        a: "Acceso a los modelos de los proyectos elegidos, entrevistas cortas con las personas clave y la posibilidad de observar una entrega real. Está pensada para no frenar la producción.",
      },
      {
        q: "¿La auditoría sirve para cumplir el Plan BIM Perú?",
        a: "Ayuda a identificar las brechas entre cómo trabajas hoy y lo que exigen los requisitos de información de la entidad. No es una certificación, pero te dice qué corregir antes de la próxima licitación.",
      },
      {
        q: "¿Qué pasa después de la auditoría?",
        a: "Tienes un plan priorizado. Puedes ejecutarlo con tu equipo o con nosotros: estándares, plantillas, scripts de Dynamo y plugins a medida.",
      },
      {
        q: "¿Es presencial o remota?",
        a: "Remota para empresas de todo el Perú y Latinoamérica. En Trujillo y La Libertad también podemos hacer visitas presenciales.",
      },
    ],
    ctaTitle: "Sabe en cuatro semanas dónde se van las horas de tu equipo",
    ctaBody:
      "Cuéntanos el tamaño de tu equipo y el tipo de proyectos. Te proponemos el alcance de la auditoría y lo que vas a recibir al final.",
  },

  // ---------------------------------------------------------------------------
  "cursos-mentorias-bim": {
    seoTitle: "Cursos de Revit API y Dynamo para equipos BIM",
    metaDescription:
      "Cursos y mentorías en vivo de Revit API, Civil 3D API y Dynamo para equipos de ingeniería: casos reales de tu empresa, de cero a herramientas funcionando.",
    keywords: [
      "curso revit api",
      "curso dynamo civil 3d",
      "curso dynamo revit",
      "curso civil 3d api",
      "capacitación bim empresas",
      "capacitación bim perú",
      "revit api training",
    ],
    serviceType: "Formación en Revit API, Civil 3D API y Dynamo",
    eyebrow: "Servicio · Cursos y mentorías",
    h1: "Cursos de Revit API, Civil 3D API y Dynamo para equipos BIM",
    intro:
      "Formamos a tu equipo para que construya y mantenga sus propias automatizaciones. Sesiones en vivo, con los proyectos reales de tu empresa, desde Dynamo hasta plugins en C# para Revit y Civil 3D.",
    answer:
      "Los cursos y mentorías de Zeist enseñan a equipos de ingeniería a automatizar Revit y Civil 3D: Dynamo para rutinas sin código, y programación en C# sobre la API de Autodesk para crear plugins instalables. Se dictan en vivo y en línea, adaptados al nivel del equipo, y trabajan sobre casos reales de la empresa, de modo que la formación termina con herramientas funcionando en la oficina. Incluyen Civil 3D e infraestructura, un área que la mayoría de los cursos, centrados en Revit, no cubre.",
    facts: [
      { label: "Modalidad", value: "En vivo y en línea" },
      { label: "Programas", value: "Dynamo · Revit API · Civil 3D API" },
      { label: "Formato", value: "Equipos o mentoría 1 a 1" },
      { label: "Resultado", value: "Herramientas funcionando en tu oficina" },
    ],
    prefill:
      "Hola Zeist. Me interesa formación en Revit API / Civil 3D API / Dynamo para nuestro equipo. Somos:",
    painsTitle: "La formación es para tu empresa si…",
    pains: [
      {
        title: "Dependes de una persona o de terceros",
        body: "Cada automatización pasa por la única persona que sabe, o por un proveedor externo.",
      },
      {
        title: "Quieres capacidad propia",
        body: "Tu empresa quiere crear y mantener sus herramientas dentro del equipo.",
      },
      {
        title: "Tu equipo ya usa Dynamo y quiere dar el salto",
        body: "Las rutinas se quedaron cortas y el siguiente paso es programar plugins en C#.",
      },
      {
        title: "Los cursos genéricos no te sirven",
        body: "Casi todos están centrados en Revit y en ejemplos de edificación. Tu trabajo es infraestructura y Civil 3D.",
      },
      {
        title: "Recibiste un plugin y quieres mantenerlo",
        body: "Tu equipo necesita entender el código para ajustarlo cuando cambie el proceso.",
      },
    ],
    buildsTitle: "Programas de formación",
    buildsIntro: "Cada programa se adapta al nivel del equipo y a los casos de la empresa:",
    builds: [
      {
        title: "Dynamo aplicado a Revit y Civil 3D",
        body: "De cero a rutinas de producción: lógica, nodos, datos y buenas prácticas para que los grafos no se rompan.",
        guide: "dynamo-vs-csharp-civil3d-revit",
      },
      {
        title: "Revit API con C#",
        body: "El primer plugin, transacciones, filtros, interfaz de usuario y despliegue en la oficina.",
        guide: "revit-api-espanol-primeros-pasos",
      },
      {
        title: "Civil 3D API con C#",
        body: "Alineaciones, perfiles, superficies, redes y corredores desde código.",
        guide: "automatizar-civil-3d-guia-completa",
      },
      {
        title: "Desarrollo asistido por IA",
        body: "Cómo usar asistentes de IA para acelerar el desarrollo de rutinas y plugins sin perder el control del código.",
        guide: "dynamo-csharp-con-ia-claude",
      },
      {
        title: "Mentoría 1 a 1",
        body: "Acompañamiento sobre un proyecto real de la empresa, con revisiones de código y decisiones de arquitectura.",
        guide: "crear-plugin-civil-3d-con-claude-code-sin-programar",
      },
    ],
    processTitle: "Cómo funciona la formación",
    process: [
      {
        title: "Diagnóstico de nivel",
        body: "Conocemos al equipo, su experiencia y las tareas que quiere automatizar.",
        time: "Antes de empezar",
      },
      {
        title: "Programa a medida",
        body: "Elegimos los temas y los casos de la empresa que se van a trabajar.",
        time: "Unos días",
      },
      {
        title: "Sesiones en vivo",
        body: "Clases prácticas en línea, con ejercicios sobre modelos reales y espacio para preguntas.",
        time: "Según el programa",
      },
      {
        title: "Proyecto aplicado",
        body: "El equipo construye una herramienta para un caso real de la empresa, con nuestra guía.",
        time: "Durante el curso",
      },
      {
        title: "Seguimiento",
        body: "Mentoría para resolver dudas cuando el equipo empieza a crear sus propias herramientas.",
        time: "Después del curso",
      },
    ],
    deliverablesTitle: "Qué recibe tu equipo",
    deliverables: [
      "Sesiones en vivo con ingenieros que desarrollan plugins y rutinas en producción",
      "Material de apoyo y código de ejemplo de cada tema",
      "Plantillas de proyecto para empezar sus propios plugins",
      "Una herramienta funcionando para un caso real de la empresa",
      "Criterios para decidir cuándo usar Dynamo y cuándo un plugin",
    ],
    comparison: {
      title: "Formación a medida o curso genérico",
      criterionLabel: "Criterio",
      leftLabel: "Formación a medida",
      rightLabel: "Curso genérico",
      rows: "Casos de trabajo | *Los proyectos de tu empresa | Ejemplos genéricos || Civil 3D e infraestructura | *Incluidos | Pocas veces || Resultado al terminar | *Una herramienta en uso | Ejercicios resueltos || Dudas | *En vivo, con quien desarrolla | Foro o correo || Ritmo | *Adaptado al equipo | Fijo",
    },
    guides: [
      "programacion-para-ingenieros-civiles",
      "revit-api-espanol-primeros-pasos",
      "aprende-a-programar-desde-cero",
      "dynamo-vs-csharp-civil3d-revit",
    ],
    faqs: [
      {
        q: "¿Necesitamos saber programar para tomar el curso?",
        a: "No. Para Dynamo no hace falta ninguna base de programación. Para Revit API y Civil 3D API empezamos desde los fundamentos de C#, con ejemplos de ingeniería.",
      },
      {
        q: "¿Los cursos son en línea?",
        a: "Sí, en vivo y en línea, para equipos de todo el Perú y Latinoamérica.",
      },
      {
        q: "¿El curso es de Revit o de Civil 3D?",
        a: "Según tu equipo. Hay programas para Revit, para Civil 3D y combinados. A diferencia de la mayoría de cursos, Civil 3D e infraestructura están incluidos.",
      },
      {
        q: "¿Podemos trabajar con proyectos de nuestra empresa?",
        a: "Sí, es la idea: el proyecto aplicado se hace sobre un caso real, para que la formación termine con una herramienta funcionando.",
      },
      {
        q: "¿Qué diferencia hay entre el curso y la mentoría 1 a 1?",
        a: "El curso forma a un equipo en un programa estructurado. La mentoría acompaña a una o pocas personas en un proyecto concreto, con revisiones de su código y de sus decisiones.",
      },
      {
        q: "¿Para quién es la formación?",
        a: "Para ingenieros civiles, arquitectos, modeladores y coordinadores BIM que quieren automatizar su trabajo, y para empresas que quieren crear y mantener sus propias herramientas.",
      },
    ],
    ctaTitle: "Forma a tu equipo para crear sus propias herramientas",
    ctaBody:
      "Cuéntanos cuántas personas son, qué programas usan y qué quieren automatizar. Te proponemos un programa a medida.",
  },
};
