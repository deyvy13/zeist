// Per-post structured data that MDX files can reference by slug.
// next-mdx-remote/rsc struggles to pass complex JSX expression props (arrays
// of objects) from MDX to components. So we keep the arrays in TS and let the
// visual components look themselves up via a `slug` string prop.

import type { Locale } from "@/lib/i18n";
import type { FaqItem } from "@/components/visual/faq";

export type RoadmapStep = {
  n: number;
  title: string;
  desc: string;
  tag?: string;
};

type PostData = {
  roadmap?: { title?: string; intro?: string; steps: RoadmapStep[] };
  faqs?: { title?: string; items: FaqItem[] };
};

const data: Record<string, Record<Locale, PostData>> = {
  // ---- PERÚ · contenido geolocalizado (sólo ES) ------------------------------
  // Estos posts existen únicamente en español: la normativa y el mercado son
  // específicos de Perú. buildMetadata y el sitemap ya emiten hreflang sólo
  // para los locales donde el post existe.
  "plan-bim-peru-obligatorio-guia-empresas": {
    es: {
      roadmap: {
        title: "Lo que el Plan BIM Perú exige, en 7 bloques",
        intro:
          "La obligatoriedad arrancó en agosto de 2026. Esto es lo que cambia para consultoras, constructoras y entidades, y qué hacer si aún no estás listo.",
        steps: [
          { n: 1, title: "Qué es el Plan BIM Perú", desc: "Marco normativo: DS 237-2019-EF, DS 289-2019-EF y RD 0007-2025-EF", tag: "Normativa" },
          { n: 2, title: "Desde cuándo es obligatorio", desc: "El hito de agosto 2026 y los tres niveles de gobierno", tag: "Plazos" },
          { n: 3, title: "A quién le aplica exactamente", desc: "Entidades, tipologías críticas y quién queda dentro del alcance", tag: "Alcance" },
          { n: 4, title: "Qué te van a exigir en la práctica", desc: "Entregables, plan de ejecución BIM y requisitos de información", tag: "Requisitos" },
          { n: 5, title: "Dónde fallan las consultoras", desc: "Los 5 puntos donde se acumulan observaciones", tag: "Riesgos" },
          { n: 6, title: "Qué se automatiza para cumplir", desc: "Del control de calidad del modelo a los entregables estandarizados", tag: "Solución" },
          { n: 7, title: "Plan de 90 días si vas tarde", desc: "Ruta realista con proyectos en ejecución", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre el Plan BIM Perú",
        items: [
          {
            q: "¿Desde cuándo es obligatorio el BIM en el Perú?",
            a: "El calendario del Plan BIM Perú marca agosto de 2026 como el fin de la fase de adopción progresiva y el inicio de la obligatoriedad en los tres niveles de gobierno (nacional, regional y local) para proyectos específicos. Antes de eso, la Resolución Directoral N° 0007-2025-EF ya había iniciado la obligatoriedad para 14 tipologías críticas, entre ellas infraestructura de salud, educación y riego."
          },
          {
            q: "¿Cuál es la norma que respalda el Plan BIM Perú?",
            a: "Son tres piezas. El Decreto Supremo N° 237-2019-EF aprobó el Plan Nacional de Competitividad y Productividad, cuya Medida de Política 1.2 establece la adopción progresiva de BIM en el sector público. El Decreto Supremo N° 289-2019-EF aprueba las disposiciones para incorporar BIM en la inversión pública. Y la Resolución Directoral N° 0007-2025-EF inicia la obligatoriedad para las tipologías críticas."
          },
          {
            q: "¿Le aplica a mi empresa si sólo hago proyectos privados?",
            a: "El Plan BIM Perú obliga a las entidades y empresas públicas sujetas al Sistema Nacional de Programación Multianual y Gestión de Inversiones. Si trabajas exclusivamente en privado, no te obliga directamente. Pero si aspiras a contratar con el Estado —o a ser subcontratista de quien lo hace— vas a tener que cumplir los mismos requisitos de información."
          },
          {
            q: "¿Qué pasa si presento un expediente sin cumplir los requisitos BIM?",
            a: "Lo esperable son observaciones que retrasan la aprobación, y en el peor caso quedar fuera de la convocatoria. El problema real no suele ser el modelo en sí, sino la consistencia: que las cantidades del expediente no coincidan con el modelo entregado, o que la información no siga la estructura pedida. Eso se detecta en revisión y devuelve el expediente."
          },
          {
            q: "¿Necesito comprar software nuevo para cumplir?",
            a: "Normalmente no. Si tu equipo ya trabaja con Civil 3D o Revit, tienes la base. Lo que suele faltar no es licencia sino proceso: un estándar de nomenclatura escrito, plantillas con ese estándar incorporado, y una forma de verificar el modelo antes de entregarlo. Eso es organización y herramientas internas, no compra de software."
          },
          {
            q: "¿Cuánto tarda una consultora en estar preparada?",
            a: "Depende del punto de partida. Si ya modelas en Civil 3D o Revit y sólo falta estandarizar y controlar la calidad del entregable, entre 2 y 4 meses con un piloto. Si el equipo todavía trabaja en CAD 2D, cuenta entre 6 y 12 meses porque hay un cambio de método, no sólo de herramienta."
          },
          {
            q: "¿Por dónde empiezo si voy tarde?",
            a: "Por el control de calidad del entregable, no por el modelado perfecto. Lo que más observaciones genera es la inconsistencia entre modelo, metrados y planos. Una herramienta que verifique nomenclatura, capas y coherencia antes de entregar reduce el riesgo inmediato mientras el equipo sube de nivel en lo demás."
          }
        ],
      },
    },
    pt: { },
  },
  "expediente-tecnico-observaciones-reducir": {
    es: {
      roadmap: {
        title: "Por qué te observan el expediente, y cómo evitarlo",
        intro:
          "Las observaciones al expediente técnico son la principal fuente de retraso en obra pública peruana. Casi todas nacen de inconsistencias que se detectan en gabinete.",
        steps: [
          { n: 1, title: "Qué cuesta realmente una observación", desc: "El costo en plazo, en horas y en relación con la entidad", tag: "Diagnóstico" },
          { n: 2, title: "Las 7 observaciones más frecuentes", desc: "Las que se repiten proyecto tras proyecto en revisión", tag: "Patrón" },
          { n: 3, title: "La causa común: el dato en dos sitios", desc: "Modelo, metrado y planos que dejaron de coincidir", tag: "Causa raíz" },
          { n: 4, title: "Autocontrol antes de entregar", desc: "La revisión que la entidad va a hacer, hecha por ti primero", tag: "Solución" },
          { n: 5, title: "Qué se automatiza del control", desc: "Verificación de nomenclatura, coherencia y cantidades", tag: "Herramientas" },
          { n: 6, title: "Cómo montarlo sin frenar la producción", desc: "Plan por fases con proyectos en curso", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre observaciones al expediente técnico",
        items: [
          {
            q: "¿Cuáles son las observaciones más frecuentes a un expediente técnico?",
            a: "Se repiten pocas y siempre las mismas: metrados que no coinciden con los planos, partidas sin sustento de cálculo, planos desactualizados respecto a la última revisión, especificaciones técnicas que no corresponden a las partidas, presupuesto con precios desactualizados, incompatibilidad entre especialidades, y documentación incompleta. La mayoría son de consistencia, no de criterio técnico."
          },
          {
            q: "¿Por qué se generan si el equipo es competente?",
            a: "Porque el problema casi nunca es de competencia técnica, sino de sincronización. El proyecto cambia, se actualiza el modelo, pero no se regeneran los metrados ni se actualizan todos los planos. Cada documento que quedó atrás es una observación esperando. Con equipos buenos y plazos ajustados pasa igual."
          },
          {
            q: "¿Cuánto retrasa una ronda de observaciones?",
            a: "Depende de la entidad, pero entre el tiempo de revisión, el levantamiento y la nueva revisión, cada ronda suele costar semanas. Y no es sólo plazo: son horas del equipo que ya estaba asignado a otro proyecto, y desgaste en la relación con la entidad."
          },
          {
            q: "¿Se pueden evitar del todo?",
            a: "Del todo no — siempre habrá observaciones de criterio, y algunas son legítimas discusiones técnicas. Lo que sí se puede eliminar casi por completo es la familia de observaciones por inconsistencia: metrados que no cuadran, planos desfasados, nomenclatura fuera de estándar. Esas son mecánicas y se detectan automáticamente antes de entregar."
          },
          {
            q: "¿Qué es el autocontrol de calidad del expediente?",
            a: "Hacer tú, antes de entregar, la misma revisión que va a hacer la entidad. En la práctica es una lista de verificación que se ejecuta sobre el modelo y los documentos: coherencia entre metrado y modelo, nomenclatura conforme al estándar, planos generados desde la revisión vigente, partidas con sustento. Si esa revisión es un botón y no una tarea manual, se hace siempre."
          },
          {
            q: "¿Esto sirve para expedientes que no son BIM?",
            a: "Parcialmente. Si el proyecto está en CAD 2D y hojas de cálculo, se puede automatizar la verificación de nomenclatura, capas y algunos cruces de datos. Pero la verificación de coherencia entre modelo y metrado sólo es posible cuando el metrado sale del modelo. Ahí es donde BIM cambia la ecuación."
          }
        ],
      },
    },
    pt: { },
  },
  "automatizacion-bim-trujillo-la-libertad": {
    es: {
      roadmap: {
        title: "El contexto de La Libertad, en 6 bloques",
        intro:
          "Qué se está construyendo en Trujillo y la región, qué exige ahora el Plan BIM, y qué significa para las consultoras y constructoras locales.",
        steps: [
          { n: 1, title: "Qué se está invirtiendo en La Libertad", desc: "Cartera 2026 del GORE, la MPT y Obras por Impuestos", tag: "Mercado" },
          { n: 2, title: "Qué cambió con el Plan BIM", desc: "La obligatoriedad de agosto 2026 aplicada al nivel regional y local", tag: "Normativa" },
          { n: 3, title: "El perfil de la oficina liberteña", desc: "Equipos pequeños, plazos cortos, mucha obra vial y de saneamiento", tag: "Realidad" },
          { n: 4, title: "Las 6 automatizaciones de mayor retorno aquí", desc: "Priorizadas por el tipo de obra que se hace en la región", tag: "Aplicación" },
          { n: 5, title: "Cómo competir con oficinas de Lima", desc: "Dónde está la ventaja real de una consultora regional", tag: "Estrategia" },
          { n: 6, title: "Por dónde empezar este mes", desc: "Primer paso concreto sin parar los proyectos en curso", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Hay empresas de automatización BIM en Trujillo?",
            a: "Muy pocas. El grueso de la oferta de desarrollo BIM en el Perú está concentrada en Lima, y la que existe suele enfocarse en Revit para edificación. Para infraestructura con Civil 3D —que es la mayor parte de la obra pública en La Libertad— la oferta local es prácticamente inexistente. Nosotros trabajamos desde Trujillo y de forma remota para el resto del país."
          },
          {
            q: "¿Qué se está construyendo en La Libertad este año?",
            a: "La cartera 2026 es significativa: el Gobierno Regional anunció 19 proyectos en Trujillo por alrededor de S/ 180 millones mediante Obras por Impuestos, la Municipalidad Provincial de Trujillo programó 28 obras viales y urbanas por más de S/ 80 millones, y hay inversión privada adicional vía Obras por Impuestos. Casi todo es obra vial, urbana y de servicios: exactamente el tipo de proyecto donde Civil 3D pesa más que Revit."
          },
          {
            q: "¿El Plan BIM aplica a los proyectos del gobierno regional y municipal?",
            a: "Sí. El hito de agosto de 2026 marca la obligatoriedad en los tres niveles de gobierno: nacional, regional y local, para proyectos específicos. Eso alcanza directamente a la cartera del Gobierno Regional de La Libertad y de la Municipalidad Provincial de Trujillo, y por lo tanto a las consultoras que elaboran sus expedientes."
          },
          {
            q: "¿Una consultora pequeña de provincia puede competir en esto?",
            a: "Sí, y con ventaja en un punto concreto: conocimiento del territorio y de la entidad. Lo que suele faltar no es capacidad técnica sino método —estandarización y control de calidad del entregable— y eso se resuelve en meses, no en años. Una oficina de 8 personas con procesos ordenados entrega más consistente que una de 40 sin ellos."
          },
          {
            q: "¿Trabajan sólo con empresas de Trujillo?",
            a: "No. Estamos en Trujillo, lo que ayuda para reuniones presenciales y para entender el contexto de las entidades de la región, pero trabajamos de forma remota con oficinas de todo el Perú y de Latinoamérica. El desarrollo de add-ins y la formación funcionan igual de bien a distancia."
          },
          {
            q: "¿Por dónde empieza una oficina que nunca automatizó nada?",
            a: "Por la tarea que más veces se rehace en cada revisión de proyecto. En la obra vial y urbana que predomina en la región, casi siempre son los metrados y las cubicaciones de movimiento de tierras. Se prototipa en Dynamo en días, se valida contra el método manual, y recién si se usa mucho se lleva a una herramienta instalable."
          }
        ],
      },
    },
    pt: { },
  },
  // ---- CORPORATIVO · dolor de dirección --------------------------------------
  "reprocesos-obra-costo-oculto": {
    es: {
      roadmap: {
        title: "Dónde se van el 12-18% del presupuesto",
        intro:
          "El reproceso no aparece en ninguna partida, pero se paga igual. Aquí está de dónde sale, cómo medirlo y cómo reducirlo desde el gabinete.",
        steps: [
          { n: 1, title: "El número que nadie mide", desc: "Entre 5% y 18% del presupuesto, según el estudio", tag: "Diagnóstico" },
          { n: 2, title: "El 70% nace en el diseño", desc: "No es la obra la que falla: es la información que le llega", tag: "Causa raíz" },
          { n: 3, title: "Los 6 orígenes concretos", desc: "Datos desactualizados, criterios distintos, versiones cruzadas", tag: "Causa raíz" },
          { n: 4, title: "Cómo medirlo en tu empresa", desc: "Tres indicadores que puedes empezar a registrar mañana", tag: "Medición" },
          { n: 5, title: "Qué se corrige desde el gabinete", desc: "Las intervenciones con mejor relación coste/impacto", tag: "Solución" },
          { n: 6, title: "Por dónde empezar sin frenar la producción", desc: "Plan de 90 días para una empresa que ya está a tope", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre reprocesos y costos ocultos",
        items: [
          {
            q: "¿Cuánto cuestan realmente los reprocesos en un proyecto de construcción?",
            a: "Los estudios sitúan la pérdida entre el 5% y el 10% del costo total a nivel global. En Latinoamérica las cifras son más altas: en Colombia se ha medido hasta un 12,4% sólo en reprocesos, y entre 12% y 18% cuando se suman las ineficiencias operativas. En un proyecto de un millón, eso son entre 120 000 y 180 000 que no aparecen en ninguna partida del presupuesto."
          },
          {
            q: "¿Por qué se dice que la mayoría de errores nace en el diseño?",
            a: "Porque hasta un 70% de los errores que se detectan en obra tienen su origen en la fase de diseño: información incompleta, cambios tardíos que no se propagan, o datos que dejaron de coincidir con el modelo. Y cerca del 48% se relaciona con fallas de comunicación y coordinación entre disciplinas. El problema casi nunca es la ejecución — es la información que le llega."
          },
          {
            q: "¿Cómo mido los reprocesos si nadie los registra?",
            a: "Empieza por tres indicadores simples: (1) horas dedicadas a rehacer entregables ya emitidos, (2) número de revisiones por documento antes de aprobarse, (3) diferencias detectadas entre la cantidad presupuestada y la real. No necesitas un sistema — una hoja compartida durante un mes ya te da la magnitud."
          },
          {
            q: "¿La automatización realmente reduce los reprocesos o sólo acelera el trabajo?",
            a: "Reduce los reprocesos por una razón concreta: elimina el paso manual donde se introduce el error. Cuando la tabla de cantidades se genera leyendo el modelo, no puede quedar desactualizada respecto al modelo. Cuando la revisión de estándares la hace una herramienta, no depende de que alguien tenga un buen día. La velocidad es el efecto secundario; la consistencia es el efecto principal."
          },
          {
            q: "¿Cuánto tarda en verse el retorno de este tipo de intervención?",
            a: "Las automatizaciones de nivel básico (generar tablas, revisar estándares, exportar datos) se desarrollan en 1-3 semanas y el ahorro se nota desde la primera revisión de proyecto. El retorno completo suele verse en el primer ciclo de proyecto, porque el reproceso evitado es inmediato y medible."
          },
          {
            q: "¿Esto aplica a una empresa que todavía no trabaja con BIM?",
            a: "Parcialmente. Si la información está en CAD y hojas de cálculo, hay mucho que se puede conectar y automatizar sin implantar BIM completo. Pero la reducción más grande de reprocesos viene de tener una única fuente de verdad, y eso sí empuja hacia el modelo. Una auditoría de procesos te dice qué se puede ganar con lo que ya tienes."
          },
          {
            q: "¿Por qué no lo resuelve el software que ya pagamos?",
            a: "Porque el software cubre el 80% genérico. El 20% restante son las reglas de tu empresa: cómo mides tú, qué formato pide tu cliente, qué valida tu control de calidad. Eso ninguna herramienta de catálogo lo trae, y es justamente donde se concentra el trabajo manual que genera los errores."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Onde vão 12-18% do orçamento",
        intro:
          "O retrabalho não aparece em nenhum item, mas é pago igual. Aqui está de onde vem, como medir e como reduzir desde o escritório.",
        steps: [
          { n: 1, title: "O número que ninguém mede", desc: "Entre 5% e 18% do orçamento, conforme o estudo", tag: "Diagnóstico" },
          { n: 2, title: "70% nasce no projeto", desc: "Não é a obra que falha: é a informação que chega nela", tag: "Causa raiz" },
          { n: 3, title: "As 6 origens concretas", desc: "Dados desatualizados, critérios diferentes, versões cruzadas", tag: "Causa raiz" },
          { n: 4, title: "Como medir na sua empresa", desc: "Três indicadores que você pode registrar amanhã", tag: "Medição" },
          { n: 5, title: "O que se corrige no escritório", desc: "As intervenções com melhor relação custo/impacto", tag: "Solução" },
          { n: 6, title: "Por onde começar sem frear a produção", desc: "Plano de 90 dias para uma empresa já no limite", tag: "Ação" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre retrabalho e custos ocultos",
        items: [
          {
            q: "Quanto custam realmente os retrabalhos num projeto de construção?",
            a: "Os estudos situam a perda entre 5% e 10% do custo total globalmente. Na América Latina os números são maiores: na Colômbia mediu-se até 12,4% só em retrabalhos, e entre 12% e 18% somando ineficiências operacionais. Num projeto de um milhão, isso são entre 120 000 e 180 000 que não aparecem em nenhum item do orçamento."
          },
          {
            q: "Por que se diz que a maioria dos erros nasce no projeto?",
            a: "Porque até 70% dos erros detectados em obra têm origem na fase de projeto: informação incompleta, mudanças tardias que não se propagam, ou dados que deixaram de coincidir com o modelo. E cerca de 48% se relaciona a falhas de comunicação e coordenação entre disciplinas. O problema quase nunca é a execução — é a informação que chega nela."
          },
          {
            q: "Como meço os retrabalhos se ninguém os registra?",
            a: "Comece por três indicadores simples: (1) horas dedicadas a refazer entregas já emitidas, (2) número de revisões por documento antes de aprovar, (3) diferenças detectadas entre a quantidade orçada e a real. Você não precisa de um sistema — uma planilha compartilhada durante um mês já dá a magnitude."
          },
          {
            q: "A automação realmente reduz retrabalhos ou só acelera o trabalho?",
            a: "Reduz retrabalhos por uma razão concreta: elimina o passo manual onde o erro é introduzido. Quando a tabela de quantidades é gerada lendo o modelo, não pode ficar desatualizada em relação ao modelo. Quando a revisão de padrões é feita por uma ferramenta, não depende de alguém estar num bom dia. A velocidade é o efeito secundário; a consistência é o principal."
          },
          {
            q: "Quanto tempo leva para ver o retorno desse tipo de intervenção?",
            a: "As automações de nível básico (gerar tabelas, revisar padrões, exportar dados) se desenvolvem em 1-3 semanas e a economia aparece desde a primeira revisão de projeto. O retorno completo costuma se ver no primeiro ciclo de projeto, porque o retrabalho evitado é imediato e mensurável."
          },
          {
            q: "Isso se aplica a uma empresa que ainda não trabalha com BIM?",
            a: "Parcialmente. Se a informação está em CAD e planilhas, há muito que dá para conectar e automatizar sem implantar BIM completo. Mas a maior redução de retrabalho vem de ter uma única fonte de verdade, e isso empurra na direção do modelo. Uma auditoria de processos diz o que dá para ganhar com o que você já tem."
          },
          {
            q: "Por que o software que já pagamos não resolve isso?",
            a: "Porque o software cobre os 80% genéricos. Os 20% restantes são as regras da sua empresa: como você mede, que formato seu cliente pede, o que seu controle de qualidade valida. Isso nenhuma ferramenta de catálogo traz, e é justamente onde se concentra o trabalho manual que gera os erros."
          }
        ],
      },
    },
  },
  // ---- CORPORATIVO · estandarización -----------------------------------------
  "estandarizar-procesos-bim-empresa": {
    es: {
      roadmap: {
        title: "De criterios personales a estándar de empresa",
        intro:
          "Cómo lograr que el entregable salga igual lo haga quien lo haga, sin frenar la producción ni enfrentarse al equipo.",
        steps: [
          { n: 1, title: "La señal de que no tienes estándar", desc: "Cinco síntomas que aparecen antes de que sea un problema caro", tag: "Diagnóstico" },
          { n: 2, title: "Por qué fracasan las implantaciones", desc: "El manual de 80 páginas que nadie lee, y qué hacer en su lugar", tag: "Realidad" },
          { n: 3, title: "Qué estandarizar primero", desc: "Los 5 elementos con mayor impacto y menor resistencia", tag: "Prioridad" },
          { n: 4, title: "Del documento a la herramienta", desc: "Por qué un estándar que no se verifica solo, no existe", tag: "Clave" },
          { n: 5, title: "Cómo manejar la resistencia del equipo", desc: "Lo que funciona y lo que garantiza el rechazo", tag: "Personas" },
          { n: 6, title: "Plan de implantación en 90 días", desc: "Semana a semana, con producción en marcha", tag: "Ejecución" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre estandarización BIM",
        items: [
          {
            q: "¿Por dónde se empieza a estandarizar procesos BIM en una empresa?",
            a: "Por la nomenclatura y la estructura de archivos — es lo que más impacto tiene y lo que menos resistencia genera, porque nadie tiene un apego emocional a cómo se llama un archivo. Después vienen las plantillas, el criterio de medición y el control de calidad previo a la entrega. Intentar estandarizarlo todo a la vez es la causa más común de fracaso."
          },
          {
            q: "¿Cuál es el error más común al implantar estándares BIM?",
            a: "Escribir un manual extenso y asumir que con difundirlo basta. Un estándar que depende de que cada persona lo recuerde y lo aplique manualmente se degrada en semanas. El estándar sólo se sostiene cuando está incorporado a las plantillas y verificado por una herramienta que avisa cuando algo no cumple."
          },
          {
            q: "¿Cómo manejo la resistencia del equipo al cambio?",
            a: "Tres cosas funcionan: (1) que el estándar les quite trabajo en vez de añadírselo — si la herramienta de verificación también corrige, lo adoptan solos; (2) involucrar a los más veteranos en definirlo, porque el rechazo suele venir de sentirse pasados por alto; (3) empezar por un proyecto piloto en vez de imponerlo a toda la empresa de golpe."
          },
          {
            q: "¿Necesito un departamento BIM para tener estándares?",
            a: "No. Necesitas que alguien tenga la responsabilidad asignada y tiempo protegido, aunque sea parcial. Muchas empresas medianas funcionan bien con un coordinador BIM a tiempo parcial más herramientas que automatizan la verificación. El departamento viene después, si el volumen lo justifica."
          },
          {
            q: "¿Cuánto tarda en implantarse un estándar de verdad?",
            a: "Definirlo: 2-4 semanas si hay decisión. Incorporarlo a plantillas y herramientas de verificación: 4-8 semanas. Que el equipo lo tenga interiorizado: un ciclo completo de proyecto. Lo que no funciona es el enfoque de 'lo publicamos y ya está' — sin verificación automática, el estándar se erosiona."
          },
          {
            q: "¿Qué pasa con los proyectos que ya están en marcha?",
            a: "No los migres. El estándar se aplica a proyectos nuevos, y los que están en curso terminan con las reglas con las que empezaron. Intentar reestandarizar un proyecto avanzado genera más reprocesos de los que evita. La única excepción son las plantillas de entrega, que sí se pueden unificar sin tocar el modelo."
          },
          {
            q: "¿Cómo mido si la estandarización está funcionando?",
            a: "Con tres indicadores: número de observaciones en la revisión previa a la entrega (debería bajar), tiempo de incorporación de una persona nueva al proyecto (debería bajar), y variabilidad entre entregables de distintos equipos (debería tender a cero). Si ninguno se mueve en un trimestre, el estándar está en el papel pero no en la práctica."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "De critérios pessoais a padrão de empresa",
        intro:
          "Como conseguir que a entrega saia igual, quem quer que a faça, sem frear a produção nem brigar com a equipe.",
        steps: [
          { n: 1, title: "O sinal de que você não tem padrão", desc: "Cinco sintomas que aparecem antes de virar um problema caro", tag: "Diagnóstico" },
          { n: 2, title: "Por que as implantações fracassam", desc: "O manual de 80 páginas que ninguém lê, e o que fazer no lugar", tag: "Realidade" },
          { n: 3, title: "O que padronizar primeiro", desc: "Os 5 elementos de maior impacto e menor resistência", tag: "Prioridade" },
          { n: 4, title: "Do documento à ferramenta", desc: "Por que um padrão que não se verifica sozinho não existe", tag: "Chave" },
          { n: 5, title: "Como lidar com a resistência da equipe", desc: "O que funciona e o que garante a rejeição", tag: "Pessoas" },
          { n: 6, title: "Plano de implantação em 90 dias", desc: "Semana a semana, com produção rodando", tag: "Execução" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre padronização BIM",
        items: [
          {
            q: "Por onde se começa a padronizar processos BIM numa empresa?",
            a: "Pela nomenclatura e pela estrutura de arquivos — é o que tem mais impacto e o que gera menos resistência, porque ninguém tem apego emocional a como um arquivo se chama. Depois vêm os templates, o critério de medição e o controle de qualidade antes da entrega. Tentar padronizar tudo ao mesmo tempo é a causa mais comum de fracasso."
          },
          {
            q: "Qual é o erro mais comum ao implantar padrões BIM?",
            a: "Escrever um manual extenso e supor que basta divulgá-lo. Um padrão que depende de cada pessoa lembrar e aplicar manualmente se degrada em semanas. O padrão só se sustenta quando está incorporado aos templates e verificado por uma ferramenta que avisa quando algo não cumpre."
          },
          {
            q: "Como lido com a resistência da equipe à mudança?",
            a: "Três coisas funcionam: (1) que o padrão tire trabalho em vez de adicionar — se a ferramenta de verificação também corrige, eles adotam sozinhos; (2) envolver os mais veteranos em defini-lo, porque a rejeição costuma vir de se sentirem ignorados; (3) começar por um projeto piloto em vez de impor a toda a empresa de uma vez."
          },
          {
            q: "Preciso de um departamento BIM para ter padrões?",
            a: "Não. Precisa que alguém tenha a responsabilidade atribuída e tempo protegido, mesmo que parcial. Muitas empresas médias funcionam bem com um coordenador BIM em tempo parcial mais ferramentas que automatizam a verificação. O departamento vem depois, se o volume justificar."
          },
          {
            q: "Quanto tempo leva para implantar um padrão de verdade?",
            a: "Defini-lo: 2-4 semanas se houver decisão. Incorporá-lo a templates e ferramentas de verificação: 4-8 semanas. Que a equipe o tenha internalizado: um ciclo completo de projeto. O que não funciona é a abordagem de 'publicamos e pronto' — sem verificação automática, o padrão se erode."
          },
          {
            q: "O que acontece com os projetos que já estão em andamento?",
            a: "Não os migre. O padrão se aplica a projetos novos, e os que estão em curso terminam com as regras com que começaram. Tentar repadronizar um projeto avançado gera mais retrabalho do que evita. A única exceção são os templates de entrega, que dá para unificar sem tocar o modelo."
          },
          {
            q: "Como meço se a padronização está funcionando?",
            a: "Com três indicadores: número de observações na revisão antes da entrega (deveria cair), tempo de integração de uma pessoa nova ao projeto (deveria cair), e variabilidade entre entregas de equipes diferentes (deveria tender a zero). Se nenhum se move num trimestre, o padrão está no papel mas não na prática."
          }
        ],
      },
    },
  },
  // ---- PILLAR · Cluster C2 (Civil 3D) ----------------------------------------
  "automatizar-civil-3d-guia-completa": {
    es: {
      roadmap: {
        title: "Los 8 bloques de la guía",
        intro:
          "De los términos básicos al plan para escalar de un script personal a una herramienta que usa toda la oficina.",
        steps: [
          { n: 0, title: "Contexto — los términos que necesitas", desc: "API, Dynamo, nodo, grafo, add-in, C#, AutoLISP", tag: "Base" },
          { n: 1, title: "Qué se puede automatizar", desc: "Mapa completo por disciplina: topografía, superficies, corredores, planos", tag: "Panorama" },
          { n: 2, title: "Las 4 vías", desc: "Dynamo, Python, C# y AutoLISP — cuál para qué caso", tag: "Herramientas" },
          { n: 3, title: "Las 15 con mejor retorno", desc: "Ordenadas por ahorro dividido entre esfuerzo, con porcentajes", tag: "Aplicación" },
          { n: 4, title: "Cómo priorizar", desc: "La matriz frecuencia × duración × estabilidad ÷ complejidad", tag: "Método" },
          { n: 5, title: "Tu primera automatización", desc: "Caso completo paso a paso: exportar alineaciones a CSV", tag: "Práctica" },
          { n: 6, title: "Los 7 errores que hacen fracasar", desc: "Patrones que se repiten en todas las oficinas", tag: "Riesgos" },
          { n: 7, title: "De script personal a herramienta", desc: "Las 4 etapas y qué disciplina toca en cada una", tag: "Crecimiento" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre automatizar Civil 3D",
        items: [
          {
            q: "¿Necesito saber programar para automatizar Civil 3D?",
            a: "Para empezar con Dynamo, no. Es programación visual: arrastras nodos y los conectas. Un ingeniero puede construir grafos útiles en una semana. Sí necesitas fundamentos cuando pasas a Python dentro de Dynamo o a add-ins en C#. La ruta desde cero está en nuestra guía de programar para ingenieros civiles."
          },
          {
            q: "¿Qué lenguaje conviene aprender primero?",
            a: "Dynamo (visual) para validar que la automatización merece la pena, y Python para cuando los nodos se queden cortos. C# sólo cuando confirmes que la herramienta la va a usar toda la oficina. AutoLISP únicamente si necesitas tocar entidades puras de AutoCAD — no accede a corredores, superficies ni alineaciones."
          },
          {
            q: "¿Por qué hay tan poco contenido de Civil 3D comparado con Revit?",
            a: "Porque el ecosistema BIM gira en torno a la edificación y la infraestructura queda en segundo plano. No es que haya menos que automatizar — un proyecto de carretera tiene tanto trabajo repetitivo como un edificio. Para quien trabaja con Civil 3D esa escasez es una ventaja competitiva: menos gente domina ese conocimiento."
          },
          {
            q: "¿Cuánto tiempo tardo en tener mi primera automatización funcionando?",
            a: "Un grafo de Dynamo útil: una tarde si el problema está bien definido. Lo que más tarda no es construir el grafo, es escribir con claridad qué entra, qué sale y qué regla aplica. Si no puedes explicarlo en tres frases, todavía no está listo para automatizarse."
          },
          {
            q: "¿Se rompen mis automatizaciones al actualizar Civil 3D?",
            a: "Los grafos de Dynamo suelen sobrevivir bien entre versiones. Los add-ins en C# a veces requieren recompilar y ajustar si la API cambió. La forma de protegerse es tener el código separado en capas: así sólo tocas la parte que habla con la API y el resto queda intacto."
          },
          {
            q: "¿Por dónde empiezo si nunca he automatizado nada?",
            a: "Por la tarea que más te fastidia y que hagas al menos una vez por semana. Normalmente es exportar cubicaciones o renombrar objetos. Escribe el criterio en una hoja, constrúyelo en Dynamo, pruébalo en una copia de un dibujo pequeño, y mide cuánto tiempo te ahorró. Ese primer número es lo que te motiva a seguir."
          },
          {
            q: "¿Vale la pena si soy el único de mi oficina que programa?",
            a: "Sí, pero documenta y comparte desde el principio. El riesgo real no es técnico, es organizativo: si la automatización vive sólo en tu portátil y te vas, se va contigo. Carpeta compartida, nombre con versión y tres líneas explicando qué hace. Eso convierte tu trabajo en un activo de la oficina."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Os 8 blocos do guia",
        intro:
          "Dos termos básicos ao plano para escalar de um script pessoal a uma ferramenta que todo o escritório usa.",
        steps: [
          { n: 0, title: "Contexto — os termos que você precisa", desc: "API, Dynamo, nó, grafo, add-in, C#, AutoLISP", tag: "Base" },
          { n: 1, title: "O que dá para automatizar", desc: "Mapa completo por disciplina: topografia, superfícies, corredores, pranchas", tag: "Panorama" },
          { n: 2, title: "As 4 vias", desc: "Dynamo, Python, C# e AutoLISP — qual para cada caso", tag: "Ferramentas" },
          { n: 3, title: "As 15 com melhor retorno", desc: "Ordenadas por economia dividida pelo esforço, com porcentagens", tag: "Aplicação" },
          { n: 4, title: "Como priorizar", desc: "A matriz frequência × duração × estabilidade ÷ complexidade", tag: "Método" },
          { n: 5, title: "Sua primeira automação", desc: "Caso completo passo a passo: exportar alinhamentos para CSV", tag: "Prática" },
          { n: 6, title: "Os 7 erros que fazem fracassar", desc: "Padrões que se repetem em todos os escritórios", tag: "Riscos" },
          { n: 7, title: "De script pessoal a ferramenta", desc: "As 4 etapas e que disciplina cabe em cada uma", tag: "Crescimento" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre automatizar Civil 3D",
        items: [
          {
            q: "Preciso saber programar para automatizar o Civil 3D?",
            a: "Para começar com Dynamo, não. É programação visual: você arrasta nós e os conecta. Um engenheiro constrói grafos úteis em uma semana. Você precisa de fundamentos quando passa para Python dentro do Dynamo ou para add-ins em C#. A rota do zero está no nosso guia de programar para engenheiros civis."
          },
          {
            q: "Que linguagem convém aprender primeiro?",
            a: "Dynamo (visual) para validar se a automação vale a pena, e Python para quando os nós ficarem curtos. C# só quando confirmar que a ferramenta será usada por todo o escritório. AutoLISP apenas se precisar mexer em entidades puras do AutoCAD — não acessa corredores, superfícies nem alinhamentos."
          },
          {
            q: "Por que existe tão pouco conteúdo de Civil 3D comparado ao Revit?",
            a: "Porque o ecossistema BIM gira em torno da edificação e a infraestrutura fica em segundo plano. Não é que haja menos para automatizar — um projeto rodoviário tem tanto trabalho repetitivo quanto um edifício. Para quem trabalha com Civil 3D essa escassez é uma vantagem competitiva: menos gente domina esse conhecimento."
          },
          {
            q: "Quanto tempo levo para ter minha primeira automação funcionando?",
            a: "Um grafo de Dynamo útil: uma tarde se o problema está bem definido. O que mais demora não é construir o grafo, é escrever com clareza o que entra, o que sai e que regra se aplica. Se você não consegue explicar em três frases, ainda não está pronto para automatizar."
          },
          {
            q: "Minhas automações quebram ao atualizar o Civil 3D?",
            a: "Os grafos de Dynamo costumam sobreviver bem entre versões. Os add-ins em C# às vezes exigem recompilar e ajustar se a API mudou. A forma de se proteger é ter o código separado em camadas: assim você só toca a parte que conversa com a API e o resto fica intacto."
          },
          {
            q: "Por onde começo se nunca automatizei nada?",
            a: "Pela tarefa que mais te irrita e que você faz pelo menos uma vez por semana. Normalmente é exportar cubagens ou renomear objetos. Escreva o critério numa folha, construa no Dynamo, teste numa cópia de um desenho pequeno, e meça quanto tempo economizou. Esse primeiro número é o que te motiva a seguir."
          },
          {
            q: "Vale a pena se sou o único do escritório que programa?",
            a: "Sim, mas documente e compartilhe desde o começo. O risco real não é técnico, é organizacional: se a automação vive só no seu notebook e você sai, vai embora com você. Pasta compartilhada, nome com versão e três linhas explicando o que faz. Isso transforma seu trabalho num ativo do escritório."
          }
        ],
      },
    },
  },
  // ---- PILLAR · Cluster C1 (Add-ins C#) --------------------------------------
  "desarrollo-add-ins-revit-civil-3d-guia-completa": {
    es: {
      roadmap: {
        title: "Los 10 bloques de la guía",
        intro:
          "Del vocabulario mínimo hasta la decisión de desarrollar internamente o encargarlo, pasando por arquitectura, interfaz y distribución.",
        steps: [
          { n: 0, title: "Contexto — el vocabulario mínimo", desc: "Add-in, API, SDK, DLL, compilar, bundle, transacción", tag: "Base" },
          { n: 1, title: "Qué puede hacer un add-in", desc: "Alcance real y qué cambia entre Revit y Civil 3D", tag: "Panorama" },
          { n: 2, title: "Requisitos y setup", desc: "Visual Studio, SDK, Git y las herramientas que ahorran horas", tag: "Setup" },
          { n: 3, title: "La arquitectura recomendada", desc: "Command → Service → Repository y sus 5 ventajas concretas", tag: "Diseño" },
          { n: 4, title: "Anatomía de un add-in", desc: "Los 3 archivos que lo componen y por qué cada uno", tag: "Estructura" },
          { n: 5, title: "El ciclo de desarrollo", desc: "Escribir, compilar, cargar, probar — y el bloqueo del DLL", tag: "Flujo" },
          { n: 6, title: "Del comando al botón", desc: "Pestaña propia, iconos y cuándo hace falta una ventana", tag: "Interfaz" },
          { n: 7, title: "Distribución", desc: "Los 4 niveles: manual, bundle, instalador y App Store", tag: "Entrega" },
          { n: 8, title: "Mantenimiento entre versiones", desc: "Qué se rompe, cómo soportar varias versiones y cuánto presupuestar", tag: "Largo plazo" },
          { n: 9, title: "Desarrollar o encargar", desc: "Los factores de decisión y la vía intermedia que funciona", tag: "Decisión" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre desarrollo de add-ins",
        items: [
          {
            q: "¿Qué diferencia hay entre un add-in y un script de Dynamo?",
            a: "El add-in es un archivo compilado que se instala y añade un botón permanente al programa; el grafo de Dynamo es un archivo que cada usuario abre y ejecuta. La diferencia práctica es la distribución: un add-in lo instalas una vez y toda la oficina usa la misma versión, mientras que un grafo hay que repartirlo y mantenerlo actualizado máquina por máquina."
          },
          {
            q: "¿Es más difícil desarrollar para Civil 3D que para Revit?",
            a: "Las dos APIs tienen dificultad comparable, pero Civil 3D trabaja con objetos más complejos (corredores, superficies, perfiles) y está mucho menos documentada. Además se apoya en la API de AutoCAD, así que acabas usando las dos. La dificultad real no es técnica, es la escasez de ejemplos — sobre todo en español."
          },
          {
            q: "¿Por qué insistís tanto en la arquitectura en capas?",
            a: "Porque Autodesk cambia la API entre versiones. Si tu código está separado en Command, Service y Repository, un cambio de API sólo afecta al Repository y el resto queda intacto. Estructurar bien cuesta 15 minutos al principio; reestructurar un add-in que creció desordenado cuesta días."
          },
          {
            q: "¿Cómo distribuyo el add-in a mi equipo?",
            a: "Para 1-3 personas, copiar el DLL manualmente. Para 3-20, empaquetarlo como bundle: una carpeta con estructura estándar que Autodesk carga sola. Para 20-100, un instalador con Inno Setup. Para más o para clientes externos, actualizaciones automáticas o la Autodesk App Store. Empieza por el bundle: cubre a la mayoría de oficinas."
          },
          {
            q: "¿Puedo desarrollar en Mac o Linux?",
            a: "Puedes escribir el código en cualquier sistema, pero para compilar y probar necesitas Windows con Revit o Civil 3D instalado, porque la API es Windows-only. Muchos desarrolladores usan una máquina virtual con Windows sólo para esa parte."
          },
          {
            q: "¿Qué presupuesto de mantenimiento debo prever?",
            a: "Entre un 15% y un 25% del coste inicial al año. Cubre adaptación a las versiones nuevas de Autodesk, corrección de errores que sólo aparecen con el uso real, y las mejoras que el equipo va a pedir en cuanto la herramienta les guste. Si un proveedor no menciona esto, no ha mantenido muchos add-ins."
          },
          {
            q: "¿Me conviene desarrollarlo internamente o encargarlo?",
            a: "Internamente si tienes a alguien con interés y tiempo protegido de verdad, y la herramienta es específica de vuestro criterio. Encargarlo si es crítica, si la necesitas en semanas o si requiere integraciones complejas. En cualquier caso, exige que el contrato incluya el código fuente: si no, quedas atado al proveedor para cada cambio."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Os 10 blocos do guia",
        intro:
          "Do vocabulário mínimo até a decisão de desenvolver internamente ou encomendar, passando por arquitetura, interface e distribuição.",
        steps: [
          { n: 0, title: "Contexto — o vocabulário mínimo", desc: "Add-in, API, SDK, DLL, compilar, bundle, transação", tag: "Base" },
          { n: 1, title: "O que um add-in pode fazer", desc: "Alcance real e o que muda entre Revit e Civil 3D", tag: "Panorama" },
          { n: 2, title: "Requisitos e setup", desc: "Visual Studio, SDK, Git e as ferramentas que economizam horas", tag: "Setup" },
          { n: 3, title: "A arquitetura recomendada", desc: "Command → Service → Repository e suas 5 vantagens concretas", tag: "Design" },
          { n: 4, title: "Anatomia de um add-in", desc: "Os 3 arquivos que o compõem e por que cada um", tag: "Estrutura" },
          { n: 5, title: "O ciclo de desenvolvimento", desc: "Escrever, compilar, carregar, testar — e o bloqueio do DLL", tag: "Fluxo" },
          { n: 6, title: "Do comando ao botão", desc: "Aba própria, ícones e quando faz falta uma janela", tag: "Interface" },
          { n: 7, title: "Distribuição", desc: "Os 4 níveis: manual, bundle, instalador e App Store", tag: "Entrega" },
          { n: 8, title: "Manutenção entre versões", desc: "O que quebra, como suportar várias versões e quanto orçar", tag: "Longo prazo" },
          { n: 9, title: "Desenvolver ou encomendar", desc: "Os fatores de decisão e a via intermediária que funciona", tag: "Decisão" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre desenvolvimento de add-ins",
        items: [
          {
            q: "Qual a diferença entre um add-in e um script de Dynamo?",
            a: "O add-in é um arquivo compilado que se instala e adiciona um botão permanente ao programa; o grafo de Dynamo é um arquivo que cada usuário abre e executa. A diferença prática é a distribuição: um add-in você instala uma vez e todo o escritório usa a mesma versão, enquanto um grafo precisa ser distribuído e mantido atualizado máquina por máquina."
          },
          {
            q: "É mais difícil desenvolver para Civil 3D do que para Revit?",
            a: "As duas APIs têm dificuldade comparável, mas o Civil 3D trabalha com objetos mais complexos (corredores, superfícies, perfis) e é muito menos documentado. Além disso se apoia na API do AutoCAD, então você acaba usando as duas. A dificuldade real não é técnica, é a escassez de exemplos — sobretudo em português."
          },
          {
            q: "Por que vocês insistem tanto na arquitetura em camadas?",
            a: "Porque a Autodesk muda a API entre versões. Se seu código está separado em Command, Service e Repository, uma mudança de API só afeta o Repository e o resto fica intacto. Estruturar bem custa 15 minutos no início; reestruturar um add-in que cresceu desorganizado custa dias."
          },
          {
            q: "Como distribuo o add-in para minha equipe?",
            a: "Para 1-3 pessoas, copiar o DLL manualmente. Para 3-20, empacotar como bundle: uma pasta com estrutura padrão que a Autodesk carrega sozinha. Para 20-100, um instalador com Inno Setup. Para mais ou para clientes externos, atualizações automáticas ou a Autodesk App Store. Comece pelo bundle: cobre a maioria dos escritórios."
          },
          {
            q: "Posso desenvolver em Mac ou Linux?",
            a: "Pode escrever o código em qualquer sistema, mas para compilar e testar precisa de Windows com Revit ou Civil 3D instalado, porque a API é só Windows. Muitos desenvolvedores usam uma máquina virtual com Windows só para essa parte."
          },
          {
            q: "Que orçamento de manutenção devo prever?",
            a: "Entre 15% e 25% do custo inicial por ano. Cobre adaptação às versões novas da Autodesk, correção de erros que só aparecem com o uso real, e as melhorias que a equipe vai pedir assim que gostar da ferramenta. Se um fornecedor não menciona isso, não manteve muitos add-ins."
          },
          {
            q: "Convém desenvolver internamente ou encomendar?",
            a: "Internamente se você tem alguém com interesse e tempo protegido de verdade, e a ferramenta é específica do seu critério. Encomendar se é crítica, se precisa em semanas ou se requer integrações complexas. Em qualquer caso, exija que o contrato inclua o código-fonte: senão você fica preso ao fornecedor para cada mudança."
          }
        ],
      },
    },
  },
  "guia-vibe-coding-para-empezar": {
    es: {
      roadmap: {
        title: "El método en 6 pasos",
        intro:
          "La diferencia entre un prototipo que se derrumba y una herramienta que el equipo usa está en el orden. Este es el que funciona.",
        steps: [
          { n: 1, title: "Define el problema", desc: "Tarea concreta, entrada, salida y límites explícitos", tag: "Preparación" },
          { n: 2, title: "Da contexto de tu entorno", desc: "Versión, herramientas y tu nivel — en cada sesión", tag: "Preparación" },
          { n: 3, title: "Estructura antes que detalle", desc: "Esqueleto primero, lógica después, interfaz al final", tag: "Orden" },
          { n: 4, title: "Itera en pasos pequeños", desc: "Un cambio, una prueba en modelo copia, un avance guardado", tag: "Ejecución" },
          { n: 5, title: "Aprende a leer el código", desc: "Los fundamentos mínimos para no depender ciegamente", tag: "Criterio" },
          { n: 6, title: "Del prototipo a herramienta real", desc: "Git, errores, pruebas, documentación y distribución", tag: "Producción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre Vibe Coding en BIM",
        items: [
          {
            q: "¿Realmente puedo construir un add-in sin saber programar?",
            a: "Puedes construir herramientas simples y útiles siguiendo un método: exportar datos, renombrar en masa, generar reportes. La IA escribe la primera versión y tú la ajustas. Lo que no puedes es diseñar la arquitectura de un sistema complejo ni sostenerlo para 100 usuarios sin fundamentos. Para lo primero basta con método; para lo segundo hace falta aprender de verdad o delegar."
          },
          {
            q: "¿Qué IA funciona mejor para código de Revit o Civil 3D?",
            a: "Para contextos largos y código complejo, Claude suele dar mejores resultados. ChatGPT va bien para preguntas cortas. La prueba real: hazle la misma pregunta a las dos con el mismo contexto y quédate con la que te dé código que compile a la primera con más frecuencia."
          },
          {
            q: "¿Cuánto tiempo tardo en tener mi primera herramienta funcionando?",
            a: "Un grafo de Dynamo útil: una tarde si el problema está bien definido. Un add-in simple en C#: un fin de semana siguiendo una guía paso a paso. Lo que más tarda no es escribir el código — es definir bien el problema y probarlo con datos reales."
          },
          {
            q: "¿Necesito aprender los fundamentos si la IA escribe el código?",
            a: "Sí, y paradójicamente más que antes. Sin fundamentos no puedes evaluar si lo que te propone es sólido o frágil, no puedes depurar cuando falla, y dependes de la IA para cada cambio. Con fundamentos de lógica, tipos y funciones, la IA te multiplica. Sin ellos, te frustra."
          },
          {
            q: "¿Es seguro ejecutar código generado por IA sobre mis modelos?",
            a: "Sobre una copia de un modelo pequeño, sí. Sobre un modelo de producción sin haberlo probado antes, no. La regla es simple: duplica, prueba, verifica con tus ojos el resultado, y sólo entonces úsalo en serio. Y ten backup."
          },
          {
            q: "¿Cuándo dejo de hacerlo solo y pido ayuda?",
            a: "Cuando la herramienta la usan varias personas y no puedes mantener el ritmo de peticiones, cuando llevas 3-4 intentos con un error que la IA no resuelve, o cuando necesitas distribuirla con instalador a toda la oficina. Ahí una mentoría o delegar el desarrollo sale más barato que seguir peleando."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "O método em 6 passos",
        intro:
          "A diferença entre um protótipo que desmorona e uma ferramenta que a equipe usa está na ordem. Esta é a que funciona.",
        steps: [
          { n: 1, title: "Defina o problema", desc: "Tarefa concreta, entrada, saída e limites explícitos", tag: "Preparação" },
          { n: 2, title: "Dê contexto do ambiente", desc: "Versão, ferramentas e seu nível — em cada sessão", tag: "Preparação" },
          { n: 3, title: "Estrutura antes do detalhe", desc: "Esqueleto primeiro, lógica depois, interface no fim", tag: "Ordem" },
          { n: 4, title: "Itere em passos pequenos", desc: "Uma mudança, um teste em modelo cópia, um avanço salvo", tag: "Execução" },
          { n: 5, title: "Aprenda a ler o código", desc: "Os fundamentos mínimos para não depender cegamente", tag: "Critério" },
          { n: 6, title: "Do protótipo a ferramenta real", desc: "Git, erros, testes, documentação e distribuição", tag: "Produção" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre Vibe Coding em BIM",
        items: [
          {
            q: "Posso mesmo construir um add-in sem saber programar?",
            a: "Você pode construir ferramentas simples e úteis seguindo um método: exportar dados, renomear em massa, gerar relatórios. A IA escreve a primeira versão e você ajusta. O que não pode é desenhar a arquitetura de um sistema complexo nem sustentá-lo para 100 usuários sem fundamentos. Para o primeiro basta método; para o segundo é preciso aprender de verdade ou delegar."
          },
          {
            q: "Qual IA funciona melhor para código de Revit ou Civil 3D?",
            a: "Para contextos longos e código complexo, Claude costuma dar melhores resultados. ChatGPT vai bem para perguntas curtas. O teste real: faça a mesma pergunta às duas com o mesmo contexto e fique com a que der código que compila de primeira com mais frequência."
          },
          {
            q: "Quanto tempo levo para ter minha primeira ferramenta funcionando?",
            a: "Um grafo de Dynamo útil: uma tarde se o problema está bem definido. Um add-in simples em C#: um fim de semana seguindo um guia passo a passo. O que mais demora não é escrever o código — é definir bem o problema e testar com dados reais."
          },
          {
            q: "Preciso aprender os fundamentos se a IA escreve o código?",
            a: "Sim, e paradoxalmente mais que antes. Sem fundamentos você não consegue avaliar se o que ele propõe é sólido ou frágil, não consegue depurar quando falha, e depende da IA para cada mudança. Com fundamentos de lógica, tipos e funções, a IA te multiplica. Sem eles, te frustra."
          },
          {
            q: "É seguro executar código gerado por IA sobre meus modelos?",
            a: "Sobre uma cópia de um modelo pequeno, sim. Sobre um modelo de produção sem ter testado antes, não. A regra é simples: duplique, teste, verifique com seus olhos o resultado, e só então use de verdade. E tenha backup."
          },
          {
            q: "Quando paro de fazer sozinho e peço ajuda?",
            a: "Quando a ferramenta é usada por várias pessoas e você não consegue manter o ritmo de pedidos, quando já tentou 3-4 vezes com um erro que a IA não resolve, ou quando precisa distribuí-la com instalador para todo o escritório. Aí uma mentoria ou delegar o desenvolvimento sai mais barato que continuar brigando."
          }
        ],
      },
    },
  },
  "cuanto-cuesta-un-add-in-revit-civil-3d": {
    es: {
      roadmap: {
        title: "Todo lo que necesitas para presupuestar bien",
        intro:
          "Los 5 bloques que determinan si un add-in te sale a cuenta: niveles y plazos, qué encarece, costes ocultos, alternativas y cálculo de retorno.",
        steps: [
          { n: 1, title: "Los 3 niveles de add-in", desc: "De la herramienta simple al sistema integrado, con plazos reales", tag: "Alcance" },
          { n: 2, title: "Qué encarece un add-in", desc: "Interfaz, integraciones, versiones y casos borde", tag: "Factores" },
          { n: 3, title: "Los costes ocultos", desc: "Mantenimiento anual, soporte, evolución y formación", tag: "Realidad" },
          { n: 4, title: "Comprar, desarrollar o aprender", desc: "Las 4 opciones en orden, y cuándo descartar cada una", tag: "Decisión" },
          { n: 5, title: "Calcula tu retorno", desc: "La fórmula para saber si se amortiza antes de pedir presupuesto", tag: "ROI" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre precios de add-ins",
        items: [
          {
            q: "¿Por qué nadie publica precios de add-ins de Revit o Civil 3D?",
            a: "Porque no son productos de catálogo: cada uno resuelve un proceso distinto. Dos add-ins que suenan igual ('exportar cantidades') pueden diferir 10× en esfuerzo según las reglas de tu oficina, las versiones que soporten y si necesitan interfaz propia. Lo que sí se puede estimar con fiabilidad son los plazos por nivel de complejidad, y eso es lo que cubre este artículo."
          },
          {
            q: "¿Cuánto tarda en desarrollarse un add-in?",
            a: "Una herramienta de un solo propósito (exportar, renombrar, generar un reporte): 1-3 semanas. Una herramienta con interfaz propia y opciones configurables: 4-8 semanas. Un sistema que se integra con base de datos o ERP: 8-16 semanas o más. El 70% de lo que pide una oficina cae en el primer nivel."
          },
          {
            q: "¿Es más caro para Civil 3D que para Revit?",
            a: "No de forma significativa. Las dos APIs de Autodesk son comparables en dificultad. Lo que sí encarece es el número de versiones que hay que soportar y la complejidad de los objetos que manipulas — un corredor de Civil 3D tiene más partes móviles que una pared de Revit, pero eso es alcance, no plataforma."
          },
          {
            q: "¿Qué pasa cuando sale una versión nueva de Autodesk?",
            a: "A veces nada: el add-in sigue funcionando. A veces la API cambia y hay que adaptarlo y volver a probarlo. Por eso conviene presupuestar entre un 15% y un 25% del coste inicial al año para mantenimiento. Si el código está bien separado en capas, adaptarlo suele ser cuestión de horas, no de semanas."
          },
          {
            q: "¿Me conviene más un grafo de Dynamo que un add-in?",
            a: "Si la tarea la van a usar menos de 5-10 personas, no cambia mucho y el rendimiento no es crítico, Dynamo suele ser suficiente y cuesta una fracción. El add-in gana cuando lo va a usar toda la oficina, cuando necesitas una interfaz de verdad, o cuando procesas modelos grandes donde Dynamo se queda corto."
          },
          {
            q: "¿El código fuente es mío?",
            a: "Debería serlo, y conviene dejarlo por escrito en el contrato. Si el proveedor se queda el código, quedas atado a él para cualquier cambio futuro y para cada versión nueva de Autodesk. En Zeist el código fuente y la documentación son tuyos desde el primer día."
          },
          {
            q: "¿Cómo sé si me va a salir a cuenta antes de pedir presupuesto?",
            a: "Con esta fórmula: horas semanales dedicadas a la tarea × número de personas × coste por hora × porcentaje de tiempo que eliminarías × 48 semanas. Si el resultado anual supera con holgura el coste de un desarrollo de 2-4 semanas, tienes un caso claro. El módulo 5 del artículo lo desarrolla con un ejemplo real."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Tudo o que você precisa para orçar bem",
        intro:
          "Os 5 blocos que determinam se um add-in compensa: níveis e prazos, o que encarece, custos ocultos, alternativas e cálculo de retorno.",
        steps: [
          { n: 1, title: "Os 3 níveis de add-in", desc: "Da ferramenta simples ao sistema integrado, com prazos reais", tag: "Escopo" },
          { n: 2, title: "O que encarece um add-in", desc: "Interface, integrações, versões e casos limite", tag: "Fatores" },
          { n: 3, title: "Os custos ocultos", desc: "Manutenção anual, suporte, evolução e formação", tag: "Realidade" },
          { n: 4, title: "Comprar, desenvolver ou aprender", desc: "As 4 opções em ordem, e quando descartar cada uma", tag: "Decisão" },
          { n: 5, title: "Calcule seu retorno", desc: "A fórmula para saber se se amortiza antes de pedir orçamento", tag: "ROI" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre preços de add-ins",
        items: [
          {
            q: "Por que ninguém publica preços de add-ins de Revit ou Civil 3D?",
            a: "Porque não são produtos de catálogo: cada um resolve um processo diferente. Dois add-ins que soam iguais ('exportar quantitativos') podem diferir 10× em esforço conforme as regras do seu escritório, as versões que suportam e se precisam de interface própria. O que dá para estimar com confiabilidade são os prazos por nível de complexidade, e é isso que este artigo cobre."
          },
          {
            q: "Quanto tempo leva para desenvolver um add-in?",
            a: "Uma ferramenta de propósito único (exportar, renomear, gerar um relatório): 1-3 semanas. Uma ferramenta com interface própria e opções configuráveis: 4-8 semanas. Um sistema que integra com banco de dados ou ERP: 8-16 semanas ou mais. 70% do que um escritório pede cai no primeiro nível."
          },
          {
            q: "É mais caro para Civil 3D do que para Revit?",
            a: "Não de forma significativa. As duas APIs da Autodesk são comparáveis em dificuldade. O que encarece é o número de versões que precisa suportar e a complexidade dos objetos que você manipula — um corredor de Civil 3D tem mais partes móveis que uma parede de Revit, mas isso é escopo, não plataforma."
          },
          {
            q: "O que acontece quando sai uma versão nova da Autodesk?",
            a: "Às vezes nada: o add-in continua funcionando. Às vezes a API muda e precisa adaptar e testar de novo. Por isso convém orçar entre 15% e 25% do custo inicial por ano para manutenção. Se o código está bem separado em camadas, adaptar costuma ser questão de horas, não de semanas."
          },
          {
            q: "Compensa mais um grafo de Dynamo que um add-in?",
            a: "Se a tarefa vai ser usada por menos de 5-10 pessoas, não muda muito e a performance não é crítica, Dynamo costuma bastar e custa uma fração. O add-in ganha quando todo o escritório vai usar, quando você precisa de uma interface de verdade, ou quando processa modelos grandes onde o Dynamo não dá conta."
          },
          {
            q: "O código-fonte é meu?",
            a: "Deveria ser, e convém deixar por escrito no contrato. Se o fornecedor fica com o código, você fica preso a ele para qualquer mudança futura e para cada versão nova da Autodesk. Na Zeist o código-fonte e a documentação são seus desde o primeiro dia."
          },
          {
            q: "Como sei se vai compensar antes de pedir orçamento?",
            a: "Com esta fórmula: horas semanais dedicadas à tarefa × número de pessoas × custo por hora × porcentagem de tempo que eliminaria × 48 semanas. Se o resultado anual supera com folga o custo de um desenvolvimento de 2-4 semanas, você tem um caso claro. O módulo 5 do artigo desenvolve com um exemplo real."
          }
        ],
      },
    },
  },
  "crear-plugin-civil-3d-con-claude-code-sin-programar": {
    es: {
      roadmap: {
        title: "De ingeniero civil a autor de tu propio plugin, en 10 pasos",
        intro:
          "Panorama end-to-end con Claude Code: desde entender los términos hasta entregarle un instalador al usuario final. Arquitectura simple, escalable, y explicada sin jerga.",
        steps: [
          { n: 0, title: "Contexto — 10 términos que necesitas entender", desc: "Glosario simple antes de arrancar (API, SDK, DLL, etc.)", tag: "Base" },
          { n: 1, title: "Qué es un plugin de Civil 3D", desc: "Qué puedes automatizar y qué no", tag: "Contexto" },
          { n: 2, title: "Requisitos previos (30 min)", desc: "Programas gratuitos que necesitas instalar", tag: "Setup" },
          { n: 3, title: "Crear el proyecto con Claude Code", desc: "Paso a paso real, el mensaje inicial que funciona", tag: "Inicio" },
          { n: 4, title: "La arquitectura recomendada", desc: "3 capas simples que hacen tu plugin escalable", tag: "Diseño" },
          { n: 5, title: "Cómo hablarle a Claude Code", desc: "Mensajes claros, restricciones y verificación paso a paso", tag: "Prompt" },
          { n: 6, title: "Tu primer comando funcional", desc: "'Hola Civil 3D' — lista todas las alineaciones del dibujo", tag: "Primer plugin" },
          { n: 7, title: "Añadir un botón en la barra superior", desc: "Del comando por teclado a un botón visible con icono", tag: "UI" },
          { n: 8, title: "Empaquetar como bundle", desc: "El formato oficial de Autodesk para plugins listos para instalar", tag: "Build" },
          { n: 9, title: "Distribuir al usuario final", desc: "Instalador, versiones, actualizaciones", tag: "Entrega" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre plugins de Civil 3D con IA",
        items: [
          {
            q: "¿Realmente puedo crear un plugin de Civil 3D sin saber programar?",
            a: "Sí, con matices. Puedes construir plugins simples y útiles (exportar datos, renombrar objetos, generar reportes, automatizar tareas repetitivas) siguiendo esta guía + Claude Code + una tarde. Lo que NO puedes es diseñar arquitectura de un sistema complejo, ni distribuir a 500 usuarios con actualizaciones automáticas, sin ayuda. Para lo primero, IA + fundamentos mínimos alcanzan. Para lo segundo, hace falta un dev."
          },
          {
            q: "¿Qué es Claude Code y en qué se diferencia de Claude for Chrome?",
            a: "Claude Code es una herramienta de CLI (línea de comandos) diseñada para programar. Vive en tu terminal, tiene acceso a tus archivos, ejecuta comandos, y puede iterar sobre un proyecto entero. Claude for Chrome es la extensión de navegador. Para crear un plugin de Civil 3D, Claude Code es superior porque puede leer y modificar tu código directamente, no sólo generar sugerencias."
          },
          {
            q: "¿Qué versión de Visual Studio necesito?",
            a: "Visual Studio Community 2022 (gratuita) es suficiente. Al instalarlo, activa la carga 'Desarrollo de escritorio con .NET'. Necesitas .NET Framework 4.8 (Civil 3D 2024/2025) o .NET 8 (versiones más nuevas). Compruébalo en la documentación oficial del SDK de tu versión de Civil 3D."
          },
          {
            q: "¿Puedo desarrollar plugins de Civil 3D en Mac o Linux?",
            a: "Puedes escribir el código en cualquier sistema (Claude Code funciona en Mac/Linux/Windows). Pero para compilar y probar, necesitas Windows con Civil 3D instalado — la API es Windows-only. Muchos devs usan una máquina virtual Windows para compilar."
          },
          {
            q: "¿Es la arquitectura Command-Service-Repository demasiado para un plugin pequeño?",
            a: "No, y aquí está el truco: la arquitectura toma 15 minutos extra al inicio, y te ahorra semanas cuando el plugin crece. Empezar simple con estructura buena es siempre mejor que empezar caótico y refactorizar después. Claude Code respeta la arquitectura si se la explicas en el prompt inicial."
          },
          {
            q: "¿Cómo distribuyo el plugin a mis compañeros de trabajo?",
            a: "Tres opciones, de más simple a más pro: (1) Copiar el archivo .dll a la carpeta de Civil 3D y registrarlo manualmente — funciona para 1-3 usuarios. (2) Empaquetar como .bundle (formato oficial de Autodesk) — arrastrar y soltar en Civil 3D. (3) Instalador .msi con Inno Setup o WiX — para distribución masiva y actualizaciones automáticas. Empieza con .bundle."
          },
          {
            q: "¿Se romperá mi plugin cuando actualicen Civil 3D?",
            a: "A veces sí. Autodesk cambia partes de la API entre versiones (raramente cosas grandes, pero pasa). La solución: (1) mantén tu código bien separado en capas (por eso la arquitectura importa), (2) compila una versión de tu plugin por cada versión de Civil 3D soportada, (3) suscríbete al canal de release notes de Autodesk. Con IA, adaptar código a una nueva API toma horas, no días."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "De engenheiro civil a autor do seu próprio plugin, em 10 passos",
        intro:
          "Panorama end-to-end com Claude Code: desde entender os termos até entregar um instalador ao usuário final. Arquitetura simples, escalável e explicada sem jargão.",
        steps: [
          { n: 0, title: "Contexto — 10 termos que você precisa entender", desc: "Glossário simples antes de começar (API, SDK, DLL, etc.)", tag: "Base" },
          { n: 1, title: "O que é um plugin de Civil 3D", desc: "O que você pode automatizar e o que não", tag: "Contexto" },
          { n: 2, title: "Requisitos prévios (30 min)", desc: "Programas gratuitos que você precisa instalar", tag: "Setup" },
          { n: 3, title: "Criar o projeto com Claude Code", desc: "Passo a passo real, a mensagem inicial que funciona", tag: "Início" },
          { n: 4, title: "A arquitetura recomendada", desc: "3 camadas simples que tornam seu plugin escalável", tag: "Design" },
          { n: 5, title: "Como falar com o Claude Code", desc: "Mensagens claras, restrições e verificação passo a passo", tag: "Prompt" },
          { n: 6, title: "Seu primeiro comando funcional", desc: "'Olá Civil 3D' — lista todos os alinhamentos do desenho", tag: "Primeiro plugin" },
          { n: 7, title: "Adicionar um botão na barra superior", desc: "Do comando por teclado a um botão visível com ícone", tag: "UI" },
          { n: 8, title: "Empacotar como bundle", desc: "O formato oficial da Autodesk para plugins prontos para instalar", tag: "Build" },
          { n: 9, title: "Distribuir ao usuário final", desc: "Instalador, versões, atualizações", tag: "Entrega" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre plugins de Civil 3D com IA",
        items: [
          {
            q: "Posso mesmo criar um plugin de Civil 3D sem saber programar?",
            a: "Sim, com nuances. Você pode construir plugins simples e úteis (exportar dados, renomear objetos, gerar relatórios, automatizar tarefas repetitivas) seguindo este guia + Claude Code + uma tarde. O que NÃO pode é desenhar arquitetura de um sistema complexo, nem distribuir para 500 usuários com atualizações automáticas, sem ajuda. Para o primeiro, IA + fundamentos mínimos bastam. Para o segundo, precisa de um dev."
          },
          {
            q: "O que é Claude Code e como difere do Claude for Chrome?",
            a: "Claude Code é uma ferramenta de CLI (linha de comando) desenhada para programar. Vive no seu terminal, tem acesso aos seus arquivos, executa comandos, e pode iterar sobre um projeto inteiro. Claude for Chrome é a extensão do navegador. Para criar um plugin de Civil 3D, Claude Code é superior porque pode ler e modificar seu código diretamente, não só gerar sugestões."
          },
          {
            q: "Qual versão de Visual Studio preciso?",
            a: "Visual Studio Community 2022 (gratuito) é suficiente. Ao instalar, ative a carga 'Desenvolvimento desktop com .NET'. Você precisa de .NET Framework 4.8 (Civil 3D 2024/2025) ou .NET 8 (versões mais novas). Verifique na documentação oficial do SDK da sua versão de Civil 3D."
          },
          {
            q: "Posso desenvolver plugins de Civil 3D em Mac ou Linux?",
            a: "Você pode escrever o código em qualquer sistema (Claude Code funciona em Mac/Linux/Windows). Mas para compilar e testar, precisa de Windows com Civil 3D instalado — a API é Windows-only. Muitos devs usam uma máquina virtual Windows para compilar."
          },
          {
            q: "A arquitetura Command-Service-Repository é demais para um plugin pequeno?",
            a: "Não, e aqui está o truque: a arquitetura leva 15 minutos extra no início, e te economiza semanas quando o plugin cresce. Começar simples com estrutura boa é sempre melhor do que começar caótico e refatorar depois. Claude Code respeita a arquitetura se você explicar no prompt inicial."
          },
          {
            q: "Como distribuo o plugin aos meus colegas de trabalho?",
            a: "Três opções, do mais simples ao mais pro: (1) Copiar o arquivo .dll para a pasta do Civil 3D e registrá-lo manualmente — funciona para 1-3 usuários. (2) Empacotar como .bundle (formato oficial da Autodesk) — arrastar e soltar no Civil 3D. (3) Instalador .msi com Inno Setup ou WiX — para distribuição em massa e atualizações automáticas. Comece com .bundle."
          },
          {
            q: "Meu plugin vai quebrar quando atualizarem o Civil 3D?",
            a: "Às vezes sim. A Autodesk muda partes da API entre versões (raramente coisas grandes, mas acontece). A solução: (1) mantenha seu código bem separado em camadas (por isso a arquitetura importa), (2) compile uma versão do seu plugin por versão de Civil 3D suportada, (3) inscreva-se no canal de release notes da Autodesk. Com IA, adaptar código para uma nova API leva horas, não dias."
          }
        ],
      },
    },
  },
  "ramas-ingenieria-sistemas-especializaciones": {
    es: {
      roadmap: {
        title: "De ingeniero civil a ingeniero que automatiza, en 8 pasos",
        intro:
          "No se trata de dejar la ingeniería civil para volverte programador. Se trata de sumar una habilidad que multiplica lo que ya sabes hacer.",
        steps: [
          { n: 1, title: "Por qué tu título es una ventaja, no un lastre", desc: "El dominio del sector vale más que saber programar", tag: "Punto de partida" },
          { n: 2, title: "Qué puedes automatizar realmente", desc: "Las tareas de tu día a día que se resuelven solas", tag: "Aplicación" },
          { n: 3, title: "Las 3 vías según cuánto quieras profundizar", desc: "Dynamo, hojas conectadas o add-ins a medida", tag: "Opciones" },
          { n: 4, title: "Cuánto tiempo necesitas de verdad", desc: "Expectativas realistas por nivel, sin promesas infladas", tag: "Realidad" },
          { n: 5, title: "Los beneficios concretos en tu carrera", desc: "Valor por hora, autonomía y qué puertas se abren", tag: "Retorno" },
          { n: 6, title: "Tu primer mes: qué hacer cada semana", desc: "Plan concreto, no una lista de cursos", tag: "Plan" },
          { n: 7, title: "Los errores que hacen abandonar", desc: "Por qué la mayoría se rinde y cómo evitarlo", tag: "Riesgos" },
          { n: 8, title: "Hasta dónde llegar", desc: "Los 4 niveles y cuándo parar en cada uno", tag: "Horizonte" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Tengo que dejar la ingeniería civil para dedicarme a esto?",
            a: "No, y sería un error. Tu valor está justo en la combinación: entiendes el problema de ingeniería Y sabes automatizarlo. Un desarrollador que aprende BIM tarda años en entender qué es un criterio de medición o por qué un corredor se recalcula. Si dejas la ingeniería, compites de igual a igual con miles de programadores y pierdes tu ventaja."
          },
          {
            q: "¿Necesito estudiar una segunda carrera o un máster?",
            a: "No. Para automatizar tu propio trabajo con Dynamo, unas semanas de práctica aplicada bastan. Para desarrollar herramientas más serias, unos meses. Lo que marca la diferencia no es el título, es haber automatizado tres o cuatro tareas reales de tu trabajo y poder mostrarlas."
          },
          {
            q: "¿Cuánto tiempo al día necesito dedicarle?",
            a: "Una hora al día durante tres meses te da un nivel funcional para automatizar tus tareas repetitivas. La clave es aplicarlo desde la primera semana a un problema real de tu trabajo, no estudiar teoría en abstracto. El aprendizaje que no se aplica se olvida."
          },
          {
            q: "¿Vale la pena si no quiero programar todos los días?",
            a: "Sí. La mayoría de ingenieros que aprenden esto no se vuelven programadores a tiempo completo: automatizan lo suyo, ganan horas cada semana y siguen haciendo ingeniería. Con dedicarle unas horas al mes al mantenimiento de tus herramientas es suficiente."
          },
          {
            q: "¿Qué gano concretamente en mi carrera?",
            a: "Tres cosas medibles: recuperas horas que hoy pierdes en tareas mecánicas, te vuelves la persona que resuelve lo que nadie más puede en tu oficina, y accedes a roles de coordinación BIM o gestión de la información que pagan por encima del proyectista tradicional. Además, es una habilidad que no se puede subcontratar fácil."
          },
          {
            q: "¿Y si la inteligencia artificial acaba haciendo esto solo?",
            a: "Está pasando lo contrario: la IA hace más accesible construir herramientas, así que el cuello de botella se mueve a quién sabe QUÉ construir. Y eso lo sabe quien conoce el proceso de ingeniería, no quien sabe programar. Tu dominio del sector se vuelve más valioso, no menos."
          },
          {
            q: "Soy de una oficina pequeña, ¿esto es para empresas grandes?",
            a: "Al contrario: en una oficina pequeña el impacto es proporcionalmente mayor porque cada hora cuenta más y no hay un departamento de sistemas que lo haga por ti. Muchas de las automatizaciones con mejor retorno se resuelven en horas y no requieren infraestructura de ningún tipo."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "De engenheiro civil a engenheiro que automatiza, em 8 passos",
        intro:
          "Não se trata de largar a engenharia civil para virar programador. Trata-se de somar uma habilidade que multiplica o que você já sabe fazer.",
        steps: [
          { n: 1, title: "Por que seu diploma é uma vantagem, não um peso", desc: "O domínio do setor vale mais que saber programar", tag: "Ponto de partida" },
          { n: 2, title: "O que você pode automatizar de verdade", desc: "As tarefas do seu dia a dia que se resolvem sozinhas", tag: "Aplicação" },
          { n: 3, title: "As 3 vias conforme quanto quiser aprofundar", desc: "Dynamo, planilhas conectadas ou add-ins sob medida", tag: "Opções" },
          { n: 4, title: "Quanto tempo você precisa de verdade", desc: "Expectativas realistas por nível, sem promessas infladas", tag: "Realidade" },
          { n: 5, title: "Os benefícios concretos na sua carreira", desc: "Valor por hora, autonomia e que portas se abrem", tag: "Retorno" },
          { n: 6, title: "Seu primeiro mês: o que fazer cada semana", desc: "Plano concreto, não uma lista de cursos", tag: "Plano" },
          { n: 7, title: "Os erros que fazem desistir", desc: "Por que a maioria desiste e como evitar", tag: "Riscos" },
          { n: 8, title: "Até onde chegar", desc: "Os 4 níveis e quando parar em cada um", tag: "Horizonte" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Tenho que largar a engenharia civil para me dedicar a isso?",
            a: "Não, e seria um erro. Seu valor está justamente na combinação: você entende o problema de engenharia E sabe automatizá-lo. Um desenvolvedor que aprende BIM leva anos para entender o que é um critério de medição ou por que um corredor se recalcula. Se largar a engenharia, compete de igual para igual com milhares de programadores e perde sua vantagem."
          },
          {
            q: "Preciso estudar uma segunda faculdade ou mestrado?",
            a: "Não. Para automatizar seu próprio trabalho com Dynamo, algumas semanas de prática aplicada bastam. Para desenvolver ferramentas mais sérias, alguns meses. O que faz diferença não é o diploma, é ter automatizado três ou quatro tarefas reais do seu trabalho e poder mostrá-las."
          },
          {
            q: "Quanto tempo por dia preciso dedicar?",
            a: "Uma hora por dia durante três meses te dá um nível funcional para automatizar suas tarefas repetitivas. A chave é aplicar desde a primeira semana a um problema real do seu trabalho, não estudar teoria no abstrato. O aprendizado que não se aplica se esquece."
          },
          {
            q: "Vale a pena se eu não quiser programar todos os dias?",
            a: "Sim. A maioria dos engenheiros que aprendem isso não vira programador em tempo integral: automatizam o seu, ganham horas toda semana e seguem fazendo engenharia. Dedicar algumas horas por mês à manutenção das suas ferramentas é suficiente."
          },
          {
            q: "O que ganho concretamente na minha carreira?",
            a: "Três coisas mensuráveis: recupera horas que hoje perde em tarefas mecânicas, vira a pessoa que resolve o que ninguém mais consegue no seu escritório, e acessa cargos de coordenação BIM ou gestão da informação que pagam acima do projetista tradicional. Além disso, é uma habilidade difícil de terceirizar."
          },
          {
            q: "E se a inteligência artificial acabar fazendo isso sozinha?",
            a: "Está acontecendo o contrário: a IA torna mais acessível construir ferramentas, então o gargalo se move para quem sabe O QUE construir. E isso sabe quem conhece o processo de engenharia, não quem sabe programar. Seu domínio do setor fica mais valioso, não menos."
          },
          {
            q: "Sou de um escritório pequeno, isso é para empresas grandes?",
            a: "Ao contrário: num escritório pequeno o impacto é proporcionalmente maior porque cada hora conta mais e não existe um departamento de TI que faça por você. Muitas das automações com melhor retorno se resolvem em horas e não exigem infraestrutura nenhuma."
          }
        ],
      },
    },
  },
  "testear-web-con-claude-for-chrome": {
    es: {
      roadmap: {
        title: "De QA manual a QA automatizado con IA en 8 pasos",
        intro:
          "Todo lo que necesitas para usar Claude for Chrome como tester profesional: seguridad, prompt, cómo evitar borrar datos y cómo exportar los bugs en markdown.",
        steps: [
          { n: 1, title: "Qué es Claude for Chrome", desc: "Extensión oficial de Anthropic que puede navegar por ti", tag: "Contexto" },
          { n: 2, title: "¿Es peligroso? La verdad honesta", desc: "Qué comparte, qué no, y en qué casos NO usarlo", tag: "Seguridad" },
          { n: 3, title: "Instalar y configurar (10 min)", desc: "Setup mínimo + permisos que sí/no dar", tag: "Setup" },
          { n: 4, title: "El prompt ideal para QA Tester", desc: "Estructura probada que ahorra iteraciones", tag: "Prompt" },
          { n: 5, title: "Cómo probar por módulos (metodología)", desc: "Divide y vencerás: no le pidas 'testea todo'", tag: "Método" },
          { n: 6, title: "Controlar qué puede borrar o modificar", desc: "Reglas explícitas para no destruir datos reales", tag: "Crítico" },
          { n: 7, title: "Formato de salida: markdown descargable", desc: "Cómo pedirle el reporte y por qué exportarlo siempre", tag: "Reporte" },
          { n: 8, title: "Cómo accionar los bugs encontrados", desc: "Priorizar, crear tickets, mejoras UX/UI", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre Claude for Chrome",
        items: [
          {
            q: "¿Es seguro instalar Claude for Chrome?",
            a: "La extensión oficial de Anthropic (no confundir con clones no oficiales) es segura como paquete, pero **puede ver y hacer todo lo que tú harías en el navegador**. Instálala sólo desde la Chrome Web Store con el publisher verificado como Anthropic, revisa los permisos que pide, y úsala primero en entornos de prueba o navegación general — no en tu banca online ni con datos sensibles hasta que entiendas su alcance."
          },
          {
            q: "¿Claude guarda mis conversaciones en mi cuenta cuando lo uso como extensión?",
            a: "No en el historial general de tu cuenta claude.ai. Las conversaciones de la extensión viven en el contexto local del sidebar. Por eso **el patrón profesional es pedirle siempre que exporte el resultado a markdown** y descargarlo — si cierras la pestaña o el navegador, se pierde. Trata cada sesión como efímera."
          },
          {
            q: "¿Puedo usar Claude for Chrome gratis?",
            a: "Requiere una cuenta de claude.ai. El plan gratis tiene límites de uso. Para sesiones largas de QA (que consumen bastante contexto) conviene un plan Pro. Alternativa: la Managed Agents / SDK si automatizas testing en pipeline en vez de manualmente."
          },
          {
            q: "¿Qué datos comparto con Claude al usar la extensión?",
            a: "Todo lo que Claude 've' en las pestañas donde le das permiso: contenido de la página, formularios visibles, capturas de pantalla que él genera para razonar. **No** las cookies ni contraseñas guardadas por el navegador (a menos que estén visibles en pantalla). Nunca pruebes con datos personales reales — usa datos falsos."
          },
          {
            q: "¿Cómo evito que Claude modifique o borre cosas importantes?",
            a: "Tres reglas: (1) usa una base de datos de prueba con datos falsos, no producción; (2) en el prompt escribe explícitamente 'NO borres ningún registro' o 'sólo lee, no modifiques'; (3) revisa cada acción antes de darle 'confirmar' — la extensión pide confirmación en acciones destructivas si está bien configurada."
          },
          {
            q: "¿Cuánto tiempo se ahorra usando Claude para QA vs manual?",
            a: "Para regresión funcional de flujos ya conocidos: 60-80% menos tiempo. Para exploratory testing (encontrar bugs raros): 30-50%. Para tests visuales/UX: complementa pero no reemplaza el ojo humano. El mayor ahorro está en **reportes** — Claude documenta cada bug en formato consistente sin que se te olvide ningún dato."
          },
          {
            q: "¿Puede Claude reemplazar a un QA tester humano?",
            a: "No, y no debería. Reemplaza el 60-70% del trabajo repetitivo (regresión, chequeo de formularios, validación de estados). Lo que NO reemplaza: criterio sobre prioridad de bugs, comunicación con producto, entender contexto de negocio, exploratory testing profundo. Piensa en Claude como el junior más rápido del equipo, no como el senior."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "De QA manual a QA automatizado com IA em 8 passos",
        intro:
          "Tudo o que você precisa para usar Claude for Chrome como tester profissional: segurança, prompt, como evitar apagar dados e como exportar os bugs em markdown.",
        steps: [
          { n: 1, title: "O que é Claude for Chrome", desc: "Extensão oficial da Anthropic que pode navegar por você", tag: "Contexto" },
          { n: 2, title: "É perigoso? A verdade honesta", desc: "O que compartilha, o que não, e em quais casos NÃO usar", tag: "Segurança" },
          { n: 3, title: "Instalar e configurar (10 min)", desc: "Setup mínimo + permissões para dar ou não", tag: "Setup" },
          { n: 4, title: "O prompt ideal para QA Tester", desc: "Estrutura testada que economiza iterações", tag: "Prompt" },
          { n: 5, title: "Como testar por módulos (metodologia)", desc: "Dividir para vencer: não peça 'teste tudo'", tag: "Método" },
          { n: 6, title: "Controlar o que pode apagar ou modificar", desc: "Regras explícitas para não destruir dados reais", tag: "Crítico" },
          { n: 7, title: "Formato de saída: markdown baixável", desc: "Como pedir o relatório e por que exportar sempre", tag: "Relatório" },
          { n: 8, title: "Como acionar os bugs encontrados", desc: "Priorizar, criar tickets, melhorias UX/UI", tag: "Ação" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre Claude for Chrome",
        items: [
          {
            q: "É seguro instalar o Claude for Chrome?",
            a: "A extensão oficial da Anthropic (não confunda com clones não oficiais) é segura como pacote, mas **pode ver e fazer tudo que você faria no navegador**. Instale apenas da Chrome Web Store com o publisher verificado como Anthropic, revise as permissões que pede, e use primeiro em ambientes de teste ou navegação geral — não no seu banco online nem com dados sensíveis até entender o alcance."
          },
          {
            q: "O Claude guarda minhas conversas na conta quando uso como extensão?",
            a: "Não no histórico geral da sua conta claude.ai. As conversas da extensão vivem no contexto local do sidebar. Por isso **o padrão profissional é sempre pedir para exportar o resultado em markdown** e baixar — se você fecha a aba ou o navegador, se perde. Trate cada sessão como efêmera."
          },
          {
            q: "Posso usar Claude for Chrome de graça?",
            a: "Requer uma conta claude.ai. O plano grátis tem limites de uso. Para sessões longas de QA (que consomem bastante contexto) vale um plano Pro. Alternativa: Managed Agents / SDK se você automatiza testes em pipeline em vez de manualmente."
          },
          {
            q: "Que dados compartilho com o Claude ao usar a extensão?",
            a: "Tudo o que o Claude 'vê' nas abas onde você dá permissão: conteúdo da página, formulários visíveis, capturas de tela que ele gera para raciocinar. **Não** os cookies nem senhas salvas pelo navegador (a menos que estejam visíveis na tela). Nunca teste com dados pessoais reais — use dados falsos."
          },
          {
            q: "Como evito que o Claude modifique ou apague coisas importantes?",
            a: "Três regras: (1) use um banco de dados de teste com dados falsos, não produção; (2) no prompt escreva explicitamente 'NÃO apague nenhum registro' ou 'apenas leia, não modifique'; (3) revise cada ação antes de confirmar — a extensão pede confirmação em ações destrutivas se estiver bem configurada."
          },
          {
            q: "Quanto tempo se economiza usando Claude para QA vs manual?",
            a: "Para regressão funcional de fluxos já conhecidos: 60-80% menos tempo. Para exploratory testing (achar bugs raros): 30-50%. Para testes visuais/UX: complementa mas não substitui o olho humano. A maior economia está nos **relatórios** — o Claude documenta cada bug em formato consistente sem esquecer nenhum dado."
          },
          {
            q: "O Claude pode substituir um QA tester humano?",
            a: "Não, e não deveria. Substitui 60-70% do trabalho repetitivo (regressão, checagem de formulários, validação de estados). O que NÃO substitui: critério sobre prioridade de bugs, comunicação com produto, entender contexto de negócio, exploratory testing profundo. Pense no Claude como o júnior mais rápido do time, não como o sênior."
          }
        ],
      },
    },
  },
  "deja-de-usar-excel-y-perder-horas": {
    es: {
      roadmap: {
        title: "Las 6 razones por las que tu Excel de metrados te está costando dinero",
        intro:
          "Diagnóstico honesto para oficinas de ingeniería donde los datos del modelo y los de la hoja dejaron de coincidir.",
        steps: [
          { n: 1, title: "Los archivos que nadie sabe cuál es", desc: "12 versiones del mismo metrado, ninguna trazable al modelo", tag: "Problema" },
          { n: 2, title: "Los errores que llegan a la obra", desc: "Fórmulas rotas, rangos incompletos, precios de revisiones viejas", tag: "Problema" },
          { n: 3, title: "El tiempo que no ves", desc: "Horas de exportar, limpiar y consolidar tras cada cambio de trazado", tag: "Problema" },
          { n: 4, title: "Trabajar en equipo sobre hojas", desc: "Sin trazabilidad al modelo ni control de quién cambió qué", tag: "Problema" },
          { n: 5, title: "Conectar el dato al modelo", desc: "Un botón que genera la tabla leyendo del modelo, en tu formato", tag: "Solución" },
          { n: 6, title: "Cuándo dar el salto y cómo", desc: "Señales claras + primer paso barato validando en Dynamo", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Cuándo debo dejar de llevar los metrados en Excel?",
            a: "Cuando cumplas al menos dos: (1) dedicas más de 4 h/semana a exportar y consolidar datos del modelo, (2) has tenido un error de cantidad que llegó al presupuesto o a obra, (3) cada revisión del proyecto obliga a rehacer tablas a mano, (4) más de 3 personas tocan los mismos metrados. Antes de eso, Excel es suficiente y barato."
          },
          {
            q: "¿Tengo que dejar de usar Excel del todo?",
            a: "No, y ese es un malentendido común. Excel sigue siendo el formato de salida, el sitio donde revisas y donde entregas. Lo que cambia es que deja de ser donde el dato se construye a mano: la tabla la genera un add-in leyendo del modelo, y llega a tu Excel ya calculada y con tu formato corporativo."
          },
          {
            q: "¿No me sirve con las tablas nativas de Civil 3D o Revit?",
            a: "Para casos estándar, sí — úsalas antes de automatizar nada. El problema aparece cuando tu criterio de medición tiene reglas propias (qué se excluye, cómo se agrupa, qué redondeo aplica la norma que usas) o cuando el formato de salida tiene que ser el de tu oficina. Ahí las tablas nativas se quedan cortas y empieza el trabajo manual."
          },
          {
            q: "¿Qué pasa con los datos históricos de mis Excel actuales?",
            a: "Se conservan. Automatizar la generación de tablas no borra nada: lo que cambia es de dónde sale el dato de aquí en adelante. Muchas oficinas usan los Excel históricos justamente para validar el add-in — se compara el resultado automático contra el manual durante un par de revisiones hasta confiar."
          },
          {
            q: "¿Cuánto tarda en estar listo?",
            a: "Un prototipo en Dynamo que valida el criterio: horas o pocos días. Un add-in de una sola tabla, instalable en toda la oficina: típicamente 1-3 semanas. Los factores completos están en nuestra guía de cuánto cuesta un add-in."
          },
          {
            q: "¿Y si cambia mi criterio de medición?",
            a: "Se ajusta en un solo sitio y todas las tablas futuras salen bien. Es justamente una de las ventajas frente al método manual, donde hoy tienes que acordarte de aplicar el cambio en cada hoja y en cada tramo — y basta que a una persona se le pase para que el dato quede inconsistente."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "As 6 razões pelas quais seu Excel de quantitativos está te custando dinheiro",
        intro:
          "Diagnóstico honesto para escritórios de engenharia onde os dados do modelo e os da planilha deixaram de coincidir.",
        steps: [
          { n: 1, title: "Os arquivos que ninguém sabe qual é", desc: "12 versões do mesmo quantitativo, nenhuma rastreável ao modelo", tag: "Problema" },
          { n: 2, title: "Os erros que chegam à obra", desc: "Fórmulas quebradas, intervalos incompletos, preços de revisões velhas", tag: "Problema" },
          { n: 3, title: "O tempo que você não vê", desc: "Horas de exportar, limpar e consolidar após cada mudança de traçado", tag: "Problema" },
          { n: 4, title: "Trabalhar em equipe sobre planilhas", desc: "Sem rastreabilidade ao modelo nem controle de quem mudou o quê", tag: "Problema" },
          { n: 5, title: "Conectar o dado ao modelo", desc: "Um botão que gera a tabela lendo do modelo, no seu formato", tag: "Solução" },
          { n: 6, title: "Quando dar o salto e como", desc: "Sinais claros + primeiro passo barato validando em Dynamo", tag: "Ação" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Quando devo parar de levar os quantitativos em Excel?",
            a: "Quando cumprir pelo menos dois: (1) dedica mais de 4 h/semana a exportar e consolidar dados do modelo, (2) já teve um erro de quantidade que chegou ao orçamento ou à obra, (3) cada revisão do projeto obriga a refazer tabelas à mão, (4) mais de 3 pessoas mexem nos mesmos quantitativos. Antes disso, Excel é suficiente e barato."
          },
          {
            q: "Tenho que parar de usar Excel totalmente?",
            a: "Não, e esse é um mal-entendido comum. O Excel segue sendo o formato de saída, o lugar onde você revisa e onde entrega. O que muda é que deixa de ser onde o dado se constrói à mão: a tabela é gerada por um add-in lendo do modelo, e chega ao seu Excel já calculada e com seu formato corporativo."
          },
          {
            q: "As tabelas nativas do Civil 3D ou Revit não bastam?",
            a: "Para casos padrão, sim — use antes de automatizar qualquer coisa. O problema aparece quando seu critério de medição tem regras próprias (o que se exclui, como se agrupa, que arredondamento a norma que você usa aplica) ou quando o formato de saída tem que ser o do seu escritório. Aí as tabelas nativas ficam curtas e começa o trabalho manual."
          },
          {
            q: "O que acontece com os dados históricos dos meus Excel atuais?",
            a: "Se conservam. Automatizar a geração de tabelas não apaga nada: o que muda é de onde sai o dado daqui para frente. Muitos escritórios usam os Excel históricos justamente para validar o add-in — se compara o resultado automático contra o manual durante algumas revisões até confiar."
          },
          {
            q: "Quanto tempo demora para ficar pronto?",
            a: "Um protótipo em Dynamo que valida o critério: horas ou poucos dias. Um add-in de uma só tabela, instalável em todo o escritório: tipicamente 1-3 semanas. Os fatores completos estão no nosso guia de quanto custa um add-in."
          },
          {
            q: "E se meu critério de medição mudar?",
            a: "Se ajusta num lugar só e todas as tabelas futuras saem certas. É justamente uma das vantagens frente ao método manual, onde hoje você tem que lembrar de aplicar a mudança em cada planilha e em cada trecho — e basta uma pessoa esquecer para o dado ficar inconsistente."
          }
        ],
      },
    },
  },
  "dynamo-csharp-con-ia-claude": {
    es: {
      roadmap: {
        title: "Programar plugins sin ser programador — la guía honesta",
        intro:
          "IA como copiloto: qué puedes construir hoy sin saber código, qué no, y cómo evitar los errores clásicos que hacen perder tiempo.",
        steps: [
          { n: 1, title: "Qué cambia con IA en 2026", desc: "Del 'no sé programar' al 'construí mi primer plugin en un fin de semana'", tag: "Contexto" },
          { n: 2, title: "Setup mínimo para empezar", desc: "Claude/ChatGPT + Visual Studio + Dynamo — 30 minutos", tag: "Herramientas" },
          { n: 3, title: "Cómo pedirle a la IA lo que necesitas", desc: "Prompts que funcionan vs prompts que dan vueltas", tag: "Técnica" },
          { n: 4, title: "Los errores que la IA no va a resolver por ti", desc: "Contexto de la API, versionado, distribución, seguridad", tag: "Realidad" },
          { n: 5, title: "Flujo 10x: prototipar en Dynamo, portar a C# con IA", desc: "El patrón que usan los equipos mixtos hoy", tag: "Método" },
          { n: 6, title: "Buenas prácticas mínimas para no ser programador", desc: "Nomenclatura, backups, control de versión simple, tests manuales", tag: "Disciplina" },
          { n: 7, title: "Cuándo pedir ayuda a un profesional", desc: "Señales claras + qué esperar de una mentoría", tag: "Límite" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Realmente puedo programar un plugin de Revit sin saber código?",
            a: "Puedes construir plugins simples y útiles: exportar cubicaciones, renombrar familias, generar reportes. La IA escribe la primera versión, tú la ajustas. Lo que NO puedes es diseñar arquitectura de un sistema grande, ni distribuir a 100 usuarios sin ayuda. Para eso hace falta alguien que sepa."
          },
          {
            q: "¿Cuánto más rápido es desarrollar con Claude vs sin IA?",
            a: "En prototipos y scripts pequeños: 5-10x más rápido. En add-ins de producción con UI, tests, distribución: 2-3x. La IA acelera la escritura de código, no el análisis del problema ni la arquitectura. Ahí sigue mandando el humano."
          },
          {
            q: "¿Qué es mejor para empezar, ChatGPT o Claude?",
            a: "Para código complejo y contextos largos (documentación de la API de Revit, por ejemplo), Claude suele responder mejor. ChatGPT es rápido para preguntas cortas. Prueba los dos con la misma pregunta y quédate con el que te dé código que compila a la primera con más frecuencia."
          },
          {
            q: "¿La IA puede leer la documentación de la API de Autodesk?",
            a: "Sí, pero con matices. Los modelos tienen mucho conocimiento base sobre Revit/Civil 3D API, pero se equivocan con métodos nuevos o versiones específicas. La solución: pega tú mismo el snippet de la documentación oficial en el prompt cuando la IA dude o alucine."
          },
          {
            q: "¿Cómo evito que la IA me genere código que no funciona?",
            a: "1) Dale contexto (qué versión, qué categoría de elementos), 2) pídele que te explique paso a paso antes de escribir, 3) prueba en un modelo pequeño primero, 4) cuando algo falle, no le pidas 'arréglalo' sin darle el mensaje de error completo. Y ten un backup del modelo."
          },
          {
            q: "¿Vale la pena aprender programación 'de verdad' si tengo IA?",
            a: "Sí, al menos los fundamentos. Sin ellos no vas a entender qué te está proponiendo, no vas a poder debuggear, y vas a depender de la IA para todo. Con fundamentos de lógica, POO y arquitectura, la IA te vuelve 10x más productivo. Sin ellos, te frustra."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Programar plugins sem ser programador — o guia honesto",
        intro:
          "IA como copiloto: o que você pode construir hoje sem saber código, o que não, e como evitar os erros clássicos que fazem perder tempo.",
        steps: [
          { n: 1, title: "O que muda com IA em 2026", desc: "Do 'não sei programar' ao 'construí meu primeiro plugin em um fim de semana'", tag: "Contexto" },
          { n: 2, title: "Setup mínimo para começar", desc: "Claude/ChatGPT + Visual Studio + Dynamo — 30 minutos", tag: "Ferramentas" },
          { n: 3, title: "Como pedir à IA o que você precisa", desc: "Prompts que funcionam vs prompts que dão voltas", tag: "Técnica" },
          { n: 4, title: "Os erros que a IA não vai resolver por você", desc: "Contexto da API, versionamento, distribuição, segurança", tag: "Realidade" },
          { n: 5, title: "Fluxo 10x: prototipar em Dynamo, portar para C# com IA", desc: "O padrão que equipes mistas usam hoje", tag: "Método" },
          { n: 6, title: "Boas práticas mínimas para não programadores", desc: "Nomenclatura, backups, controle de versão simples, testes manuais", tag: "Disciplina" },
          { n: 7, title: "Quando pedir ajuda a um profissional", desc: "Sinais claros + o que esperar de uma mentoria", tag: "Limite" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Realmente posso programar um plugin do Revit sem saber código?",
            a: "Pode construir plugins simples e úteis: exportar quantitativos, renomear famílias, gerar relatórios. A IA escreve a primeira versão, você ajusta. O que NÃO pode é desenhar arquitetura de um sistema grande, nem distribuir para 100 usuários sem ajuda. Para isso é preciso alguém que saiba."
          },
          {
            q: "Quanto mais rápido é desenvolver com Claude vs sem IA?",
            a: "Em protótipos e scripts pequenos: 5-10x mais rápido. Em add-ins de produção com UI, testes, distribuição: 2-3x. A IA acelera a escrita de código, não a análise do problema nem a arquitetura. Aí segue mandando o humano."
          },
          {
            q: "O que é melhor para começar, ChatGPT ou Claude?",
            a: "Para código complexo e contextos longos (documentação da API do Revit, por exemplo), Claude costuma responder melhor. ChatGPT é rápido para perguntas curtas. Teste os dois com a mesma pergunta e fique com o que te der código que compila de primeira com mais frequência."
          },
          {
            q: "A IA consegue ler a documentação da API da Autodesk?",
            a: "Sim, com nuances. Os modelos têm muito conhecimento base sobre Revit/Civil 3D API, mas erram com métodos novos ou versões específicas. Solução: cole você mesmo o snippet da documentação oficial no prompt quando a IA duvidar ou alucinar."
          },
          {
            q: "Como evito que a IA gere código que não funciona?",
            a: "1) Dê contexto (qual versão, qual categoria de elementos), 2) peça que explique passo a passo antes de escrever, 3) teste num modelo pequeno primeiro, 4) quando algo falhar, não peça 'conserte' sem dar a mensagem de erro completa. E tenha backup do modelo."
          },
          {
            q: "Vale a pena aprender programação 'de verdade' se tenho IA?",
            a: "Sim, ao menos os fundamentos. Sem eles você não vai entender o que a IA está propondo, não vai conseguir debugar, e vai depender da IA para tudo. Com fundamentos de lógica, POO e arquitetura, a IA te torna 10x mais produtivo. Sem eles, te frustra."
          }
        ],
      },
    },
  },
  "programacion-para-ingenieros-civiles": {
    es: {
      roadmap: {
        title: "De ingeniero civil a ingeniero que automatiza",
        intro:
          "Panorama end-to-end: qué automatizar primero, qué tener en cuenta para no acumular scripts caóticos, y cómo escalar sin ser programador de carrera.",
        steps: [
          { n: 1, title: "Por qué programar cambia tu carrera", desc: "Reduces horas repetitivas, tomas mejores decisiones con datos, subes tu valor por hora", tag: "Motivación" },
          { n: 2, title: "Ideas de automatización que valen la pena", desc: "10 casos concretos + tiempo ahorrado + complejidad", tag: "Aplicación" },
          { n: 3, title: "Arquitectura simple (sin susto)", desc: "Cómo organizar tus scripts en carpetas y capas", tag: "Diseño" },
          { n: 4, title: "Código limpio para ingenieros", desc: "Nombres claros, funciones cortas, comentarios donde valen", tag: "Calidad" },
          { n: 5, title: "Componentes reutilizables", desc: "Escribe una vez, úsalo en cinco proyectos", tag: "Eficiencia" },
          { n: 6, title: "Control de versión sin drama", desc: "Git en 20 minutos con GitHub Desktop", tag: "Disciplina" },
          { n: 7, title: "Testing manual mínimo", desc: "Cómo validar sin volverte QA profesional", tag: "Robustez" },
          { n: 8, title: "Cómo escalar sin ahogarte", desc: "De script personal a herramienta del equipo", tag: "Crecimiento" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Qué lenguaje debe aprender un ingeniero civil?",
            a: "Depende del objetivo. Para automatizar Civil 3D/Revit sin sufrir: Python (Dynamo, IronPython) primero. Si vas a hacer add-ins de producción, C#. Para análisis de datos y reportes: Python con Pandas. Para automatizar CAD sin BIM: AutoLISP sigue vigente. Empieza por Python: cubre 80% de los casos."
          },
          {
            q: "¿Cuánto tiempo debo dedicar a la semana para aprender?",
            a: "5-10 horas por semana durante 3 meses te dan un nivel funcional para automatizar tus tareas diarias. La clave es aplicar lo aprendido a un caso real de tu trabajo desde la segunda semana. Aprender por aprender no funciona; aprender resolviendo un problema real, sí."
          },
          {
            q: "¿Realmente necesito 'arquitectura de software' si sólo hago scripts?",
            a: "Necesitas lo mínimo: organizar en carpetas, separar lo que hace UI de lo que hace cálculo, tener funciones que hagan una cosa. No necesitas microservicios ni patrones enterprise. La regla es: si tu 'script' pasó a llamarse 'proyecto', ya toca invertir 20% del tiempo en estructura."
          },
          {
            q: "¿Cómo empiezo si nunca he abierto Visual Studio ni Python?",
            a: "Instala Python desde python.org, descarga VS Code (editor gratis y ligero), y sigue el primer tutorial oficial: 2 horas. Después: elige la tarea de tu semana que más te fastidia y automatízala paso a paso, con IA de copiloto. Aprender resolviendo es 10x más efectivo que aprender leyendo."
          },
          {
            q: "¿Vale la pena aprender a programar si Autodesk cada año trae más funciones nuevas?",
            a: "Sí. Autodesk cubre 80% de casos genéricos. El 20% específico de tu oficina, tu tipo de proyecto, tus estándares — eso siempre lo automatizarás tú. Y ese 20% es donde se pierde el 60% del tiempo del equipo. La ganancia es enorme y permanente."
          },
          {
            q: "¿Cuándo debo dejar de programar yo y contratar/mentorear a alguien?",
            a: "Cuando (1) tu equipo depende de tus scripts para operar y no puedes mantener el ritmo, (2) necesitas distribuir con instalador a >10 personas, (3) empiezas a tener bugs que no puedes debuggear en 1 hora, (4) los desarrollos ya te toman más tiempo que tu trabajo de ingeniería. Ahí toca una mentoría o delegar a un dev."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "De engenheiro civil a engenheiro que automatiza",
        intro:
          "Panorama end-to-end: o que automatizar primeiro, o que ter em mente para não acumular scripts caóticos, e como escalar sem ser programador de carreira.",
        steps: [
          { n: 1, title: "Por que programar muda sua carreira", desc: "Reduz horas repetitivas, toma melhores decisões com dados, aumenta seu valor por hora", tag: "Motivação" },
          { n: 2, title: "Ideias de automação que valem a pena", desc: "10 casos concretos + tempo economizado + complexidade", tag: "Aplicação" },
          { n: 3, title: "Arquitetura simples (sem susto)", desc: "Como organizar seus scripts em pastas e camadas", tag: "Design" },
          { n: 4, title: "Código limpo para engenheiros", desc: "Nomes claros, funções curtas, comentários onde valem", tag: "Qualidade" },
          { n: 5, title: "Componentes reutilizáveis", desc: "Escreva uma vez, use em cinco projetos", tag: "Eficiência" },
          { n: 6, title: "Controle de versão sem drama", desc: "Git em 20 minutos com GitHub Desktop", tag: "Disciplina" },
          { n: 7, title: "Testes manuais mínimos", desc: "Como validar sem virar QA profissional", tag: "Robustez" },
          { n: 8, title: "Como escalar sem se afogar", desc: "De script pessoal a ferramenta da equipe", tag: "Crescimento" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Que linguagem um engenheiro civil deve aprender?",
            a: "Depende do objetivo. Para automatizar Civil 3D/Revit sem sofrer: Python (Dynamo, IronPython) primeiro. Se for fazer add-ins de produção, C#. Para análise de dados e relatórios: Python com Pandas. Para automatizar CAD sem BIM: AutoLISP segue vigente. Comece por Python: cobre 80% dos casos."
          },
          {
            q: "Quanto tempo por semana devo dedicar para aprender?",
            a: "5-10 horas por semana durante 3 meses te dão um nível funcional para automatizar tarefas diárias. A chave é aplicar o aprendido a um caso real do seu trabalho a partir da segunda semana. Aprender por aprender não funciona; aprender resolvendo um problema real, sim."
          },
          {
            q: "Realmente preciso de 'arquitetura de software' se só faço scripts?",
            a: "Precisa do mínimo: organizar em pastas, separar UI de cálculo, ter funções que fazem uma coisa. Não precisa de microsserviços nem padrões enterprise. Regra: se seu 'script' virou 'projeto', já vale investir 20% do tempo em estrutura."
          },
          {
            q: "Como começo se nunca abri Visual Studio nem Python?",
            a: "Instale Python de python.org, baixe VS Code (editor grátis e leve), e siga o primeiro tutorial oficial: 2 horas. Depois: escolha a tarefa da sua semana que mais te irrita e automatize passo a passo, com IA de copiloto. Aprender resolvendo é 10x mais efetivo que aprender lendo."
          },
          {
            q: "Vale a pena aprender programação se a Autodesk traz funções novas todo ano?",
            a: "Sim. A Autodesk cobre 80% de casos genéricos. Os 20% específicos do seu escritório, seu tipo de projeto, seus padrões — isso você sempre vai automatizar. E esses 20% são onde se perde 60% do tempo da equipe. O ganho é enorme e permanente."
          },
          {
            q: "Quando devo parar de programar eu e contratar/mentorear alguém?",
            a: "Quando (1) sua equipe depende dos seus scripts para operar e você não consegue manter o ritmo, (2) precisa distribuir com instalador para >10 pessoas, (3) começa a ter bugs que não consegue debugar em 1 hora, (4) os desenvolvimentos já te tomam mais tempo que seu trabalho de engenharia. Aí toca uma mentoria ou delegar a um dev."
          }
        ],
      },
    },
  },
  "dynamo-vs-csharp-civil3d-revit": {
    es: {
      roadmap: {
        title: "Los 6 temas que resuelve este artículo",
        intro:
          "Todo lo que necesitas para decidir entre Dynamo y C# para Civil 3D o Revit, con ideas concretas de automatización y ahorro de tiempo.",
        steps: [
          { n: 1, title: "¿Qué es Dynamo?", desc: "Programación visual sin escribir código", tag: "Concepto" },
          { n: 2, title: "¿Qué es programar en C#?", desc: "Add-ins nativos con la API de Autodesk", tag: "Concepto" },
          { n: 3, title: "¿Cuándo usar Dynamo?", desc: "Prototipos, geometría paramétrica, workflows visuales", tag: "Decisión" },
          { n: 4, title: "¿Cuándo usar C#?", desc: "Add-ins de producción, alta perf, UI propia", tag: "Decisión" },
          { n: 5, title: "Diferencias clave", desc: "Tabla comparativa: aprendizaje, velocidad, mantenimiento", tag: "Comparativa" },
          { n: 6, title: "Automatizaciones con ahorro real", desc: "Ejemplos por rubro y % de tiempo ahorrado", tag: "Aplicación" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Necesito saber programar para usar Dynamo?",
            a: "No para lo básico. Dynamo es programación visual: arrastras nodos y los conectas. Pero para casos avanzados —bucles complejos, integraciones, lógica condicional pesada— saber Python o DesignScript ayuda muchísimo. Es la puerta de entrada natural a la automatización BIM."
          },
          {
            q: "¿Vale la pena aprender C# si ya domino Dynamo?",
            a: "Sí, si trabajas con automatizaciones que se usarán muchas veces al día, por muchos usuarios, o si necesitas una interfaz gráfica propia. C# te da rendimiento, distribución como add-in .dll instalable y control total. Dynamo es rápido para explorar; C# es sólido para producción."
          },
          {
            q: "¿Cuál es más rápido de aprender?",
            a: "Dynamo, sin duda. En una semana puedes construir grafos útiles. C# requiere aprender el lenguaje, orientación a objetos, la API de Revit o Civil 3D y el ciclo de compilación. Cuenta 2-3 meses para ser productivo."
          },
          {
            q: "¿Puedo mezclar Dynamo y C#?",
            a: "Sí, y es lo que hacen los equipos maduros. Puedes ejecutar scripts de Dynamo desde add-ins C# (Dynamo Player, DynamoAutomation), o llamar código C# desde nodos Python en Dynamo. Muchas empresas prototipan en Dynamo y luego portan a C# lo que se estabiliza."
          },
          {
            q: "¿Qué ahorro real puedo esperar en el día a día?",
            a: "Depende de tus tareas. Para tareas repetitivas típicas (renombrar familias, exportar planos, generar cubicaciones, checar interferencias, actualizar tablas), es común ahorrar entre 30% y 70% del tiempo semanal. Un add-in C# bien diseñado puede automatizar tareas que antes tomaban horas y reducirlas a segundos."
          },
          {
            q: "¿Necesito licencia especial para desarrollar add-ins?",
            a: "No. La API de Revit y Civil 3D es gratuita (SDK descargable desde Autodesk). Sólo necesitas Visual Studio Community (gratis) y la licencia del software Autodesk que ya usas. Puedes distribuir tus add-ins internamente sin coste adicional."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Os 6 temas que este artigo resolve",
        intro:
          "Tudo o que você precisa para decidir entre Dynamo e C# para Civil 3D ou Revit, com ideias concretas de automação e economia de tempo.",
        steps: [
          { n: 1, title: "O que é Dynamo?", desc: "Programação visual sem escrever código", tag: "Conceito" },
          { n: 2, title: "O que é programar em C#?", desc: "Add-ins nativos com a API da Autodesk", tag: "Conceito" },
          { n: 3, title: "Quando usar Dynamo?", desc: "Protótipos, geometria paramétrica, fluxos visuais", tag: "Decisão" },
          { n: 4, title: "Quando usar C#?", desc: "Add-ins de produção, alta performance, UI própria", tag: "Decisão" },
          { n: 5, title: "Diferenças-chave", desc: "Tabela comparativa: aprendizado, velocidade, manutenção", tag: "Comparativo" },
          { n: 6, title: "Automações com economia real", desc: "Exemplos por área e % de tempo economizado", tag: "Aplicação" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Preciso saber programar para usar Dynamo?",
            a: "Não para o básico. Dynamo é programação visual: você arrasta nós e os conecta. Mas para casos avançados —laços complexos, integrações, lógica condicional pesada— saber Python ou DesignScript ajuda muito. É a porta de entrada natural para automação BIM."
          },
          {
            q: "Vale a pena aprender C# se já domino Dynamo?",
            a: "Sim, se você trabalha com automações usadas muitas vezes ao dia, por muitos usuários, ou se precisa de uma interface gráfica própria. C# dá performance, distribuição como add-in .dll instalável e controle total. Dynamo é rápido para explorar; C# é sólido para produção."
          },
          {
            q: "Qual é mais rápido de aprender?",
            a: "Dynamo, sem dúvida. Em uma semana você constrói grafos úteis. C# exige aprender a linguagem, orientação a objetos, a API do Revit ou Civil 3D e o ciclo de compilação. Conte 2-3 meses para ser produtivo."
          },
          {
            q: "Posso misturar Dynamo e C#?",
            a: "Sim, e é o que equipes maduras fazem. Você pode executar scripts Dynamo a partir de add-ins C# (Dynamo Player, DynamoAutomation), ou chamar código C# a partir de nós Python no Dynamo. Muitas empresas prototipam em Dynamo e portam para C# o que se estabiliza."
          },
          {
            q: "Que economia real posso esperar no dia a dia?",
            a: "Depende das tarefas. Para tarefas repetitivas típicas (renomear famílias, exportar pranchas, gerar quantitativos, checar interferências, atualizar tabelas), é comum economizar entre 30% e 70% do tempo semanal. Um add-in C# bem projetado pode automatizar tarefas que antes levavam horas e reduzi-las a segundos."
          },
          {
            q: "Preciso de licença especial para desenvolver add-ins?",
            a: "Não. A API do Revit e Civil 3D é gratuita (SDK baixável no site da Autodesk). Só precisa do Visual Studio Community (gratuito) e da licença do software Autodesk que já usa. Você pode distribuir seus add-ins internamente sem custo adicional."
          }
        ],
      },
    },
  },
  "aprende-a-programar-desde-cero": {
    es: {
      roadmap: {
        title: "La ruta completa, de un vistazo",
        intro:
          "Once bloques ordenados de menor a mayor complejidad. Al terminar, no sólo sabrás programar: entenderás cómo pensar cualquier problema.",
        steps: [
          { n: 1, title: "Lógica de programación", desc: "Aprender a descomponer problemas en pasos", tag: "Fundamento" },
          { n: 2, title: "Pseudocódigo", desc: "Escribir la solución en español antes de codificarla", tag: "Fundamento" },
          { n: 3, title: "Variables y tipos", desc: "Guardar y clasificar información", tag: "Sintaxis" },
          { n: 4, title: "Operadores", desc: "Aritméticos, comparación y lógicos", tag: "Sintaxis" },
          { n: 5, title: "Condicionales", desc: "Tomar decisiones con if / else", tag: "Control" },
          { n: 6, title: "Bucles", desc: "Repetir tareas con for y while", tag: "Control" },
          { n: 7, title: "Funciones", desc: "Reutilizar lógica y organizar código", tag: "Estructura" },
          { n: 8, title: "Estructuras de datos", desc: "Arrays, objetos, listas y diccionarios", tag: "Datos" },
          { n: 9, title: "POO", desc: "Programación orientada a objetos, clases", tag: "Diseño" },
          { n: 10, title: "Algoritmos básicos", desc: "Búsqueda, ordenamiento, complejidad", tag: "Pensamiento" },
          { n: 11, title: "Primer proyecto", desc: "Aplicar todo en algo real y útil", tag: "Práctica" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Con qué lenguaje debería empezar a programar?",
            a: "Python o JavaScript. Python es más limpio para aprender lógica; JavaScript te permite ver resultados en el navegador desde el minuto uno. Cualquiera de los dos es una buena elección; los conceptos son los mismos.",
          },
          {
            q: "¿Cuánto tiempo se tarda en aprender a programar desde cero?",
            a: "Para escribir programas útiles con soltura: entre 3 y 6 meses estudiando 1-2 horas diarias. Para llegar al nivel profesional: 1-2 años con proyectos reales. La constancia importa más que las horas por día.",
          },
          {
            q: "¿Necesito ser bueno en matemáticas para programar?",
            a: "No para la mayoría del trabajo: web, apps, sistemas empresariales. La lógica y el pensamiento estructurado importan mucho más que las matemáticas avanzadas. Éstas sólo son críticas si te dedicas a machine learning, gráficos 3D o criptografía.",
          },
          {
            q: "¿Debería aprender usando IA como ChatGPT o Claude?",
            a: "Sí, pero como asistente, no como muleta. Úsala para entender qué hace un código o para depurar, no para que te resuelva los ejercicios. Si dejas que la IA piense por ti, no vas a aprender a pensar.",
          },
          {
            q: "¿Qué hago después de terminar esta ruta?",
            a: "Elige una especialización según lo que te llame: desarrollo web (front y back), apps móviles, automatización, datos o IA. Cada camino tiene su propia ruta, pero todos parten de estos fundamentos.",
          },
        ],
      },
    },
    pt: {
      roadmap: {
        title: "A rota completa, de relance",
        intro:
          "Onze blocos ordenados do menor ao maior nível de complexidade. Ao terminar, você não só saberá programar: entenderá como pensar qualquer problema.",
        steps: [
          { n: 1, title: "Lógica de programação", desc: "Aprender a decompor problemas em passos", tag: "Fundamento" },
          { n: 2, title: "Pseudocódigo", desc: "Escrever a solução em português antes de codar", tag: "Fundamento" },
          { n: 3, title: "Variáveis e tipos", desc: "Guardar e classificar informação", tag: "Sintaxe" },
          { n: 4, title: "Operadores", desc: "Aritméticos, de comparação e lógicos", tag: "Sintaxe" },
          { n: 5, title: "Condicionais", desc: "Tomar decisões com if / else", tag: "Controle" },
          { n: 6, title: "Laços", desc: "Repetir tarefas com for e while", tag: "Controle" },
          { n: 7, title: "Funções", desc: "Reutilizar lógica e organizar código", tag: "Estrutura" },
          { n: 8, title: "Estruturas de dados", desc: "Arrays, objetos, listas e dicionários", tag: "Dados" },
          { n: 9, title: "POO", desc: "Programação orientada a objetos, classes", tag: "Design" },
          { n: 10, title: "Algoritmos básicos", desc: "Busca, ordenação, complexidade", tag: "Pensamento" },
          { n: 11, title: "Primeiro projeto", desc: "Aplicar tudo em algo real e útil", tag: "Prática" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Com qual linguagem devo começar a programar?",
            a: "Python ou JavaScript. Python é mais limpo para aprender lógica; JavaScript te permite ver resultados no navegador desde o primeiro minuto. Qualquer uma das duas é uma boa escolha; os conceitos são os mesmos.",
          },
          {
            q: "Quanto tempo leva para aprender a programar do zero?",
            a: "Para escrever programas úteis com fluência: entre 3 e 6 meses estudando 1-2 horas por dia. Para chegar ao nível profissional: 1-2 anos com projetos reais. A constância importa mais do que as horas por dia.",
          },
          {
            q: "Preciso ser bom em matemática para programar?",
            a: "Não para a maior parte do trabalho: web, apps, sistemas empresariais. A lógica e o pensamento estruturado importam muito mais do que matemática avançada. Ela só é crítica se você for para machine learning, gráficos 3D ou criptografia.",
          },
          {
            q: "Devo aprender usando IA como ChatGPT ou Claude?",
            a: "Sim, mas como assistente, não como muleta. Use para entender o que um código faz ou para depurar, não para que resolva os exercícios por você. Se deixar a IA pensar por você, não vai aprender a pensar.",
          },
          {
            q: "O que faço depois de terminar essa rota?",
            a: "Escolha uma especialização de acordo com o que te atrai: desenvolvimento web (front e back), apps móveis, automação, dados ou IA. Cada caminho tem sua própria rota, mas todos partem desses fundamentos.",
          },
        ],
      },
    },
  },
};

export function getPostData(slug: string, locale: Locale): PostData | undefined {
  return data[slug]?.[locale];
}
