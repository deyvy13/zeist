import type { ServicePage, ServiceSlug } from "@/lib/services";

export const servicesPt: Record<ServiceSlug, ServicePage> = {
  // ---------------------------------------------------------------------------
  "add-ins-revit-civil-3d": {
    seoTitle: "Desenvolvimento de plugins para Revit e Civil 3D",
    metaDescription:
      "Desenvolvemos plugins e add-ins sob medida para Revit e Civil 3D em C#: quantitativos, pranchas, redes, armadura e controle de qualidade com o seu padrão.",
    keywords: [
      "plugin para revit",
      "desenvolvimento de plugins revit",
      "plugins para civil 3d",
      "desenvolvimento de add-ins revit",
      "programador revit api",
      "revit plugin development",
      "civil 3d api c#",
    ],
    serviceType: "Desenvolvimento de plugins e add-ins para Revit e Civil 3D",
    eyebrow: "Serviço · Plugins e add-ins sob medida",
    h1: "Desenvolvimento de plugins para Revit e Civil 3D sob medida",
    intro:
      "Transformamos as tarefas que sua equipe repete em cada projeto em botões dentro do Revit e do Civil 3D. Programamos em C# sobre a API oficial da Autodesk, com o seu padrão, a sua nomenclatura e os seus formatos de entrega. E o código é seu.",
    answer:
      "Um plugin (ou add-in) para Revit ou Civil 3D é um programa instalado dentro do software que adiciona botões próprios na barra superior. É programado em C# sobre a API oficial da Autodesk — a interface que permite controlar o Revit e o Civil 3D a partir de código — e serve para automatizar tarefas repetitivas com regras fixas: quantitativos, pranchas, redes de tubulação, armadura ou controle de qualidade. A Zeist desenvolve plugins sob medida para empresas de engenharia e construção: diagnóstico, protótipo, desenvolvimento, instalador para todo o escritório e suporte quando sai uma nova versão.",
    facts: [
      { label: "Prazo típico", value: "4 a 8 semanas" },
      { label: "Tecnologia", value: "C# / .NET · API da Autodesk" },
      { label: "Propriedade", value: "O código é seu" },
      { label: "Modalidade", value: "Remota · Brasil e América Latina" },
    ],
    prefill:
      "Olá Zeist. Tenho interesse em desenvolver um plugin para Revit / Civil 3D. Esta é a tarefa que queremos automatizar:",
    painsTitle: "Se sua equipe vive alguma destas situações, um plugin sob medida é para você",
    pains: [
      {
        title: "As mesmas tarefas em cada projeto",
        body: "Quantitativos, pranchas, renomear vistas, exportar desenhos. Tarefas sem critério técnico que consomem dias de engenheiros a cada entrega.",
      },
      {
        title: "Entregas que dependem de hora extra",
        body: "O projeto está pronto, mas produzir a entrega leva a última semana inteira, e qualquer mudança de última hora põe a data em risco.",
      },
      {
        title: "Erros que aparecem na revisão",
        body: "Quantitativos que não batem com as pranchas, nomenclatura fora do padrão, pranchas desatualizadas. Apontamentos que se repetem projeto após projeto.",
      },
      {
        title: "O Dynamo já não basta",
        body: "Rotinas que só uma pessoa sabe executar, que quebram a cada versão ou que ficam lentas com modelos grandes.",
      },
      {
        title: "As ferramentas genéricas não aplicam o seu padrão",
        body: "Os plugins comerciais resolvem o caso geral, mas não os seus itens, a sua nomenclatura nem o formato que o seu cliente exige.",
      },
    ],
    buildsTitle: "Plugins que desenvolvemos para Revit e Civil 3D",
    buildsIntro: "Cada plugin é construído com as regras do seu escritório. Estes são os casos mais frequentes:",
    builds: [
      {
        title: "Quantitativos a partir do modelo",
        body: "Volumes de corte e aterro, áreas por camada, comprimentos e contagens, no seu formato de itens e prontos para o orçamento.",
        guide: "deja-de-usar-excel-y-perder-horas",
      },
      {
        title: "Produção automática de pranchas",
        body: "Planta e perfil, seções, carimbo com estacas, revisões e exportação com a nomenclatura do cliente.",
        guide: "produccion-planos-automatica-civil-3d-revit",
      },
      {
        title: "Redes de tubulação e bancos de dutos em 3D",
        body: "Da polilinha 2D à rede 3D com curvas, tês e junções por regra, e bancos de dutos gerados a partir do traçado.",
        guide: "redes-tuberias-civil-3d-accesorios",
      },
      {
        title: "Modelagem e verificação de armadura no Revit",
        body: "Armadura automática a partir do quadro de armaduras, verificação por norma e quantitativo de aço por bitola, elemento e pavimento.",
        guide: "plugin-acero-revit-modelado-revision",
      },
      {
        title: "Comparação de versões de modelos",
        body: "O que mudou entre a versão que você tinha e a que chegou: adicionados, removidos, deslocados e modificados, com relatório.",
        guide: "comparar-modelos-revit-civil-3d-detectar-cambios",
      },
      {
        title: "Revit e Excel nos dois sentidos",
        body: "Exportar, editar parâmetros em massa e importá-los de volta com validação prévia e registro de cada alteração.",
        guide: "exportar-tablas-revit-excel-editar-parametros",
      },
      {
        title: "Auditoria e controle de qualidade",
        body: "Saúde do modelo, conferência do padrão e revisão automática antes de cada entrega.",
        guide: "revit-lento-modelo-pesado-auditoria",
      },
    ],
    processTitle: "Como desenvolvemos o seu plugin",
    process: [
      {
        title: "Diagnóstico",
        body: "Vemos a tarefa no seu processo real, medimos quanto tempo ela consome e escrevemos as regras que o plugin deve aplicar. O diagnóstico inicial é gratuito.",
        time: "1 semana",
      },
      {
        title: "Protótipo",
        body: "Validamos a lógica num projeto real, no Dynamo ou numa versão mínima do plugin. Se não der o mesmo resultado do método manual, corrige-se antes de seguir.",
        time: "1-2 semanas",
      },
      {
        title: "Desenvolvimento",
        body: "Programamos o plugin em C# com tratamento de erros, registro do que ele faz e testes sobre os seus próprios modelos.",
        time: "2-4 semanas",
      },
      {
        title: "Instalação e treinamento",
        body: "Instalador para todo o escritório, botão na barra superior, treinamento da equipe e manual de uso.",
        time: "Alguns dias",
      },
      {
        title: "Suporte",
        body: "Ajustes após a entrega e atualização quando a Autodesk publica uma nova versão do Revit ou do Civil 3D.",
        time: "Contínuo",
      },
    ],
    deliverablesTitle: "O que sua empresa recebe",
    deliverables: [
      "O plugin instalado, com seu botão na barra superior do Revit ou do Civil 3D",
      "Um instalador para distribuí-lo em todo o escritório",
      "O código-fonte completo: o plugin é propriedade da sua empresa",
      "Manual de uso e treinamento para a equipe",
      "Documentação técnica para que outro desenvolvedor possa mantê-lo",
      "Testes sobre os seus próprios modelos antes da entrega",
    ],
    comparison: {
      title: "Plugin sob medida ou ferramenta genérica",
      criterionLabel: "Critério",
      leftLabel: "Plugin sob medida",
      rightLabel: "Ferramenta genérica",
      rows: "Aplica o seu padrão e a sua nomenclatura | *Exatamente | Só se coincidir || Formato das suas entregas | *O da sua empresa e do seu cliente | O do fabricante || Regras do seu escritório | *Escritas na ferramenta | É preciso se adaptar || Propriedade do código | *Sua | Do fornecedor || Mudanças quando o processo muda | *Se ajusta | Depende do fornecedor || Tempo até usar | Semanas | *Imediato",
    },
    guides: [
      "desarrollo-add-ins-revit-civil-3d-guia-completa",
      "cuanto-cuesta-un-add-in-revit-civil-3d",
      "dynamo-vs-csharp-civil3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
    ],
    faqs: [
      {
        q: "Quanto custa desenvolver um plugin para Revit ou Civil 3D?",
        a: "Depende do escopo: quantas regras ele aplica, quantas versões do programa precisa suportar e quão diferentes são os casos que deve resolver. Depois do diagnóstico, que é gratuito, entregamos uma proposta com escopo, prazo e custo. Os fatores que mexem no preço estão explicados no nosso guia de custos de add-ins.",
      },
      {
        q: "Quanto tempo leva desenvolver um plugin?",
        a: "O habitual são 4 a 8 semanas do diagnóstico até a instalação no escritório. Ferramentas pequenas, como uma renomeação ou uma exportação com regras, podem ficar prontas antes.",
      },
      {
        q: "O código do plugin é nosso?",
        a: "Sim. Entregamos o código-fonte completo e a documentação técnica. O plugin é propriedade da sua empresa e pode ser mantido pela sua equipe ou por outro desenvolvedor.",
      },
      {
        q: "Quais versões do Revit e do Civil 3D vocês suportam?",
        a: "As que o seu escritório usa. Cada versão do Revit e do Civil 3D exige compilar o plugin para ela, então define-se no início quais entram. Quando a Autodesk publica uma nova, o plugin é atualizado.",
      },
      {
        q: "Precisamos saber programar para usar o plugin?",
        a: "Não. O plugin é um botão na barra superior do Revit ou do Civil 3D. Se você também quiser que sua equipe possa modificá-lo, oferecemos formação em Revit API, Civil 3D API e Dynamo.",
      },
      {
        q: "Qual a diferença entre um plugin e um script do Dynamo?",
        a: "O Dynamo é ideal para validar uma automação rápido. Um plugin é melhor para o uso diário: qualquer pessoa da equipe usa, trata erros, é rápido com modelos grandes e se instala em todo o escritório. Muitas vezes começamos no Dynamo e terminamos num plugin.",
      },
      {
        q: "Vocês trabalham com empresas no Brasil?",
        a: "Sim. A equipe está em Trujillo, no Peru, e trabalha de forma remota com empresas do Brasil e da América Latina. O diagnóstico, as revisões e a instalação são feitos a distância.",
      },
    ],
    ctaTitle: "Que tarefa você gostaria de transformar em um botão?",
    ctaBody:
      "Conte o que sua equipe faz à mão em cada projeto. No diagnóstico gratuito medimos quanto tempo isso consome e dizemos se vale um plugin, um script do Dynamo ou nenhum dos dois.",
  },

  // ---------------------------------------------------------------------------
  "automatizacion-dynamo": {
    seoTitle: "Scripts de Dynamo para Revit e Civil 3D sob medida",
    metaDescription:
      "Scripts de Dynamo sob medida para Revit e Civil 3D: documentados, testados nos seus modelos e prontos para o Dynamo Player. A forma mais rápida de automatizar.",
    keywords: [
      "scripts dynamo revit",
      "scripts dynamo civil 3d",
      "automação com dynamo",
      "dynamo para civil 3d",
      "rotinas dynamo",
      "dynamo automation revit",
      "curso dynamo civil 3d",
    ],
    serviceType: "Automação com Dynamo para Revit e Civil 3D",
    eyebrow: "Serviço · Automação com Dynamo",
    h1: "Scripts de Dynamo para Revit e Civil 3D, prontos para a sua produção",
    intro:
      "Desenvolvemos rotinas de Dynamo que automatizam tarefas repetitivas no Revit e no Civil 3D em dias, não em meses. Documentadas, testadas nos seus modelos e prontas para que sua equipe as execute pelo Dynamo Player sem abrir o grafo.",
    answer:
      "O Dynamo é a ferramenta de programação visual que a Autodesk inclui com o Revit e o Civil 3D: permite montar rotinas conectando blocos, sem escrever código. Um script de Dynamo automatiza tarefas com regras fixas — posicionar elementos ao longo de um eixo, numerar, renomear, extrair dados para o Excel — e é a forma mais rápida de automatizar, porque uma rotina é validada em dias. A Zeist desenvolve scripts de Dynamo sob medida, documentados e testados nos modelos de cada empresa, e quando uma rotina é usada em todo projeto, a transforma num plugin instalável.",
    facts: [
      { label: "Prazo típico", value: "Dias a 2 semanas" },
      { label: "Execução", value: "Dynamo Player, sem abrir o grafo" },
      { label: "Programas", value: "Revit e Civil 3D" },
      { label: "Próximo passo", value: "Plugin, se for usado sempre" },
    ],
    prefill:
      "Olá Zeist. Tenho interesse em automatizar uma tarefa com Dynamo no Revit / Civil 3D. Esta é a tarefa:",
    painsTitle: "Um script de Dynamo sob medida faz sentido se…",
    pains: [
      {
        title: "Você precisa de resultado nesta semana",
        body: "A tarefa dói hoje e não dá para esperar o desenvolvimento de um plugin. Um script resolve o problema enquanto se decide o próximo passo.",
      },
      {
        title: "As regras ainda mudam",
        body: "O critério se ajusta projeto a projeto. Um grafo de Dynamo se modifica em minutos; convém esperar a regra se estabilizar antes de levá-la a um plugin.",
      },
      {
        title: "Você já testou o Dynamo e não funcionou",
        body: "Grafos baixados que não rodam com os seus modelos, rotinas que só quem fez entende ou que quebram a cada versão.",
      },
      {
        title: "Você quer validar antes de investir",
        body: "Antes de encomendar um plugin, quer comprovar com os seus próprios projetos que a automação economiza o que promete.",
      },
    ],
    buildsTitle: "Scripts de Dynamo que desenvolvemos",
    buildsIntro: "Rotinas típicas, sempre adaptadas às suas regras e aos seus modelos:",
    builds: [
      {
        title: "Posicionamento de elementos ao longo de um eixo",
        body: "No Civil 3D: postes, placas, defensas ou marcos posicionados por estaca e afastamento, com a cota do terreno ou do corredor.",
        guide: "plugin-civil-3d-dibujo-3d-automatizado",
      },
      {
        title: "Numeração e renomeação em massa",
        body: "Ambientes, portas, vistas, pranchas ou alinhamentos com a nomenclatura do seu padrão.",
        guide: "automatizar-tareas-revit-dynamo-plugins",
      },
      {
        title: "Extração de dados para o Excel",
        body: "Quantidades, parâmetros e listas do modelo exportados no formato que o seu escritório usa.",
        guide: "deja-de-usar-excel-y-perder-horas",
      },
      {
        title: "Parâmetros a partir do Excel",
        body: "Códigos de orçamento, classificações e dados de fabricante carregados no modelo a partir de uma planilha.",
        guide: "exportar-tablas-revit-excel-editar-parametros",
      },
      {
        title: "Geometria paramétrica",
        body: "Elementos gerados a partir de regras: taludes, muros, fechamentos ou componentes repetitivos.",
      },
      {
        title: "Conferência do padrão",
        body: "Revisão de nomenclatura e parâmetros obrigatórios antes de cada entrega, com um relatório do que não cumpre.",
        guide: "auditoria-bim-checklist-empresa",
      },
    ],
    processTitle: "Como trabalhamos um script de Dynamo",
    process: [
      {
        title: "Diagnóstico",
        body: "Vemos a tarefa, o resultado que você espera e as regras que sua equipe aplica. O diagnóstico inicial é gratuito.",
        time: "Alguns dias",
      },
      {
        title: "Desenvolvimento do grafo",
        body: "Montamos a rotina com os nós agrupados e comentados, sem pacotes externos desnecessários que quebrem com as atualizações.",
        time: "Dias a 2 semanas",
      },
      {
        title: "Teste nos seus modelos",
        body: "Executamos num projeto real e comparamos o resultado com o método manual.",
        time: "Alguns dias",
      },
      {
        title: "Entrega para o Dynamo Player",
        body: "Entradas claras para que qualquer pessoa da equipe a execute sem abrir o grafo, com um guia de uso.",
        time: "Ao terminar",
      },
      {
        title: "Passagem para plugin (opcional)",
        body: "Se a rotina é usada em todo projeto, a levamos para um plugin instalável para todo o escritório.",
        time: "Quando se justifica",
      },
    ],
    deliverablesTitle: "O que sua empresa recebe",
    deliverables: [
      "O script de Dynamo, documentado, com os nós agrupados e explicados",
      "Configuração para o Dynamo Player: qualquer pessoa da equipe o executa sem abrir o grafo",
      "Teste nos seus próprios modelos e comparação com o método manual",
      "Guia de uso para a equipe",
      "Lista de dependências, sem pacotes externos desnecessários",
      "Uma recomendação honesta: se convém ficar no Dynamo ou passar para plugin",
    ],
    comparison: {
      title: "Script de Dynamo ou plugin em C#",
      criterionLabel: "Critério",
      leftLabel: "Script de Dynamo",
      rightLabel: "Plugin em C#",
      rows: "Tempo até funcionar | *Dias | Semanas || Mudar as regras | *Em minutos | Exige desenvolvimento || Como a equipe executa | Pelo Dynamo Player | Com um botão na barra superior || Velocidade com modelos grandes | Média | *Alta || Tratamento de erros e registro | Básico | *Completo || Ideal para | Validar e tarefas que mudam | Produção diária",
    },
    guides: [
      "dynamo-vs-csharp-civil3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
      "dynamo-csharp-con-ia-claude",
      "automatizar-civil-3d-guia-completa",
    ],
    faqs: [
      {
        q: "O que é o Dynamo e para que serve?",
        a: "É a ferramenta de programação visual que a Autodesk inclui com o Revit e o Civil 3D. Serve para automatizar tarefas repetitivas conectando blocos, sem escrever código: posicionar elementos, numerar, renomear, extrair dados ou gerar geometria por regras.",
      },
      {
        q: "O Dynamo funciona no Civil 3D?",
        a: "Sim. O Civil 3D inclui o Dynamo, com nós próprios para alinhamentos, perfis, superfícies e corredores. É especialmente útil para posicionar elementos ao longo de um alinhamento e para extrair dados do modelo.",
      },
      {
        q: "Quanto tempo leva desenvolver um script de Dynamo?",
        a: "A maioria das rotinas fica pronta em dias ou em um par de semanas, incluindo o teste nos seus modelos. É o caminho mais rápido para automatizar.",
      },
      {
        q: "Os scripts param de funcionar ao atualizar o Revit ou o Civil 3D?",
        a: "Às vezes precisam de ajustes, sobretudo se dependem de pacotes externos. Por isso os desenvolvemos com o mínimo possível de dependências e documentados, para que atualizá-los seja simples.",
      },
      {
        q: "Vocês podem revisar ou consertar scripts que já temos?",
        a: "Sim. Revisamos o grafo, corrigimos o que falha com os seus modelos atuais, documentamos e deixamos pronto para o Dynamo Player.",
      },
      {
        q: "Quando convém passar do Dynamo para um plugin?",
        a: "Quando a rotina é usada em todo projeto, executada por várias pessoas, trabalha com modelos grandes ou precisa tratar erros sem intervenção. Aí um plugin é mais rápido e mais robusto.",
      },
    ],
    ctaTitle: "Que tarefa você gostaria de ter automatizada na semana que vem?",
    ctaBody:
      "Conte a tarefa e como sua equipe a resolve hoje. Dizemos se um script de Dynamo resolve e em quanto tempo.",
  },

  // ---------------------------------------------------------------------------
  "auditoria-procesos-bim": {
    seoTitle: "Auditoria e consultoria BIM para empresas",
    metaDescription:
      "Auditoria BIM de modelos e processos para empresas de engenharia e construção: diagnóstico com números e um plano para corrigir, padronizar e automatizar.",
    keywords: [
      "auditoria bim",
      "consultoria bim",
      "consultoria em bim",
      "auditoria de modelos bim",
      "diagnóstico bim empresa",
      "bim consulting",
      "implantação bim empresa",
    ],
    serviceType: "Auditoria e consultoria BIM",
    eyebrow: "Serviço · Auditoria e consultoria BIM",
    h1: "Auditoria e consultoria BIM: descubra onde sua equipe perde horas e o que automatizar primeiro",
    intro:
      "Revisamos os seus modelos e medimos como sua equipe trabalha. Em quatro semanas você recebe um diagnóstico com números e um plano priorizado: o que corrigir, o que padronizar e o que automatizar primeiro, com a economia estimada de cada ação.",
    answer:
      "A auditoria BIM da Zeist é um diagnóstico de quatro semanas que combina duas revisões: a auditoria do modelo, que verifica a qualidade técnica dos arquivos — nomenclatura, coordenadas, saúde do modelo, informação e coerência entre modelo, pranchas e quantitativos —, e a auditoria do processo, que mede onde se perdem horas, quais tarefas se repetem e quais padrões faltam. O resultado é um relatório com achados priorizados por impacto e esforço e um plano para corrigir, padronizar e automatizar. Não é uma certificação: é uma ferramenta de decisão para a direção técnica.",
    facts: [
      { label: "Duração", value: "4 semanas" },
      { label: "Escopo", value: "Modelos e processos" },
      { label: "Resultado", value: "Plano priorizado com economia estimada" },
      { label: "Modalidade", value: "Remota" },
    ],
    prefill:
      "Olá Zeist. Tenho interesse numa auditoria BIM para a nossa empresa. Somos uma empresa de:",
    painsTitle: "Uma auditoria BIM é para a sua empresa se…",
    pains: [
      {
        title: "Os apontamentos se repetem",
        body: "As entregas voltam com os mesmos comentários: quantitativos que não batem, formato, pranchas desatualizadas.",
      },
      {
        title: "Cada projeto sai diferente",
        body: "A qualidade da entrega depende de quem fez, não de um padrão que todos aplicam.",
      },
      {
        title: "Uma licitação com requisitos BIM se aproxima",
        body: "Você precisa saber se seus modelos e seu jeito de trabalhar cumprem o que vai ser exigido, como os requisitos da Estratégia BIM BR.",
      },
      {
        title: "Os modelos estão lentos ou corrompem",
        body: "A equipe perde tempo esperando o modelo e ninguém sabe exatamente por quê.",
      },
      {
        title: "Você quer automatizar e não sabe por onde começar",
        body: "Há muitas ideias e pouco tempo. É preciso saber qual devolve mais horas antes de investir.",
      },
      {
        title: "A equipe faz hora extra em toda entrega",
        body: "O esforço existe; o que falta é saber para onde ele vai.",
      },
    ],
    buildsTitle: "O que revisamos na auditoria BIM",
    buildsIntro: "Duas frentes, com um checklist que adaptamos ao seu padrão e aos seus tipos de projeto:",
    builds: [
      {
        title: "Qualidade dos modelos",
        body: "Nomenclatura, estrutura de arquivos, coordenadas compartilhadas, níveis e eixos, advertências, CAD importado e famílias.",
        guide: "revit-lento-modelo-pesado-auditoria",
      },
      {
        title: "Informação e coerência",
        body: "Parâmetros obrigatórios, códigos de orçamento e coerência entre o modelo, as pranchas e os quantitativos.",
        guide: "auditoria-bim-checklist-empresa",
      },
      {
        title: "Tempos e retrabalho",
        body: "Quanto demora cada etapa, o que se refaz em cada revisão e por quê.",
        guide: "reprocesos-obra-costo-oculto",
      },
      {
        title: "Padrões e modelos",
        body: "Se existe um padrão escrito e se ele está incorporado nos modelos que a equipe usa.",
        guide: "estandarizar-procesos-bim-empresa",
      },
      {
        title: "Pessoas e conhecimento",
        body: "Quais tarefas dependem de uma só pessoa e o que acontece com a entrega quando ela não está.",
      },
      {
        title: "Oportunidades de automação",
        body: "Tarefas repetitivas candidatas a Dynamo ou plugin, com as horas por ano que consomem hoje.",
        guide: "automatizar-tareas-revit-dynamo-plugins",
      },
    ],
    processTitle: "Como é a auditoria, semana a semana",
    process: [
      {
        title: "Escopo",
        body: "Escolhemos dois ou três projetos representativos e as disciplinas que entram. Definimos o que a direção precisa saber.",
        time: "Semana 1",
      },
      {
        title: "Revisão de modelos",
        body: "Rodamos o checklist do modelo, com ferramentas automáticas onde for possível.",
        time: "Semana 2",
      },
      {
        title: "Análise do processo",
        body: "Entrevistas curtas com a equipe e observação de uma entrega real. Medimos tempos.",
        time: "Semana 3",
      },
      {
        title: "Relatório e plano",
        body: "Achados priorizados, plano em três frentes e linha de base para medir o avanço. Apresentamos à direção.",
        time: "Semana 4",
      },
      {
        title: "Implantação (opcional)",
        body: "Você pode executar o plano com sua equipe ou conosco: padrões, modelos, scripts de Dynamo e plugins.",
        time: "Depois",
      },
    ],
    deliverablesTitle: "O que sua empresa recebe",
    deliverables: [
      "Um diagnóstico com números: horas por tarefa, rodadas de apontamentos e estado dos modelos",
      "Achados priorizados por impacto e esforço",
      "Um plano de ação em três frentes: corrigir, padronizar e automatizar",
      "A economia estimada de cada automação recomendada",
      "Uma linha de base de indicadores para medir o avanço",
      "Uma apresentação de resultados para a direção",
    ],
    comparison: {
      title: "Decidir com auditoria ou sem ela",
      criterionLabel: "Decisão",
      leftLabel: "Com auditoria",
      rightLabel: "Sem auditoria",
      rows: "O que automatizar primeiro | *O que mais devolve horas, medido | O que parece urgente || Apontamentos repetidos | *Ataca-se a causa | Corrige-se cada sintoma || Investimento em ferramentas | *Onde há retorno | Onde alguém pediu || Avanço | *Medido contra uma linha de base | Sem referência || Requisitos do cliente | *Lacunas identificadas antes | Descobertas na revisão",
    },
    guides: [
      "auditoria-bim-checklist-empresa",
      "estandarizar-procesos-bim-empresa",
      "reprocesos-obra-costo-oculto",
      "revit-lento-modelo-pesado-auditoria",
    ],
    faqs: [
      {
        q: "O que é uma auditoria BIM?",
        a: "É uma revisão estruturada de como uma empresa produz seus projetos em BIM: a qualidade dos modelos e a eficiência do processo. Termina num relatório com achados priorizados e um plano para corrigir, padronizar e automatizar.",
      },
      {
        q: "Quanto tempo dura a auditoria?",
        a: "Quatro semanas para um escopo de dois ou três projetos representativos: escopo, revisão de modelos, análise do processo e relatório final.",
      },
      {
        q: "O que vocês precisam da nossa equipe?",
        a: "Acesso aos modelos dos projetos escolhidos, entrevistas curtas com as pessoas-chave e a possibilidade de observar uma entrega real. Foi pensada para não travar a produção.",
      },
      {
        q: "A auditoria serve para atender requisitos BIM de órgãos públicos?",
        a: "Ajuda a identificar as lacunas entre como você trabalha hoje e o que os requisitos de informação exigem. Não é uma certificação, mas diz o que corrigir antes da próxima licitação.",
      },
      {
        q: "O que acontece depois da auditoria?",
        a: "Você tem um plano priorizado. Pode executá-lo com sua equipe ou conosco: padrões, modelos, scripts de Dynamo e plugins sob medida.",
      },
      {
        q: "É presencial ou remota?",
        a: "Remota, para empresas do Brasil e da América Latina. Revisões, entrevistas e apresentação de resultados são feitas a distância.",
      },
    ],
    ctaTitle: "Saiba em quatro semanas para onde vão as horas da sua equipe",
    ctaBody:
      "Conte o tamanho da sua equipe e o tipo de projetos. Propomos o escopo da auditoria e o que você vai receber no final.",
  },

  // ---------------------------------------------------------------------------
  "cursos-mentorias-bim": {
    seoTitle: "Cursos de Revit API e Dynamo para equipes BIM",
    metaDescription:
      "Cursos e mentorias ao vivo de Revit API, Civil 3D API e Dynamo para equipes de engenharia: casos reais da sua empresa, do zero a ferramentas funcionando.",
    keywords: [
      "curso revit api",
      "curso dynamo civil 3d",
      "curso dynamo revit",
      "curso civil 3d api",
      "treinamento bim empresas",
      "capacitação bim",
      "revit api training",
    ],
    serviceType: "Formação em Revit API, Civil 3D API e Dynamo",
    eyebrow: "Serviço · Cursos e mentorias",
    h1: "Cursos de Revit API, Civil 3D API e Dynamo para equipes BIM",
    intro:
      "Formamos sua equipe para construir e manter as próprias automações. Sessões ao vivo, com os projetos reais da sua empresa, do Dynamo até plugins em C# para Revit e Civil 3D.",
    answer:
      "Os cursos e mentorias da Zeist ensinam equipes de engenharia a automatizar o Revit e o Civil 3D: Dynamo para rotinas sem código, e programação em C# sobre a API da Autodesk para criar plugins instaláveis. São ministrados ao vivo e online, adaptados ao nível da equipe, e trabalham sobre casos reais da empresa, de modo que a formação termina com ferramentas funcionando no escritório. Incluem Civil 3D e infraestrutura, uma área que a maioria dos cursos, centrados no Revit, não cobre.",
    facts: [
      { label: "Modalidade", value: "Ao vivo e online" },
      { label: "Programas", value: "Dynamo · Revit API · Civil 3D API" },
      { label: "Formato", value: "Equipes ou mentoria individual" },
      { label: "Resultado", value: "Ferramentas funcionando no seu escritório" },
    ],
    prefill:
      "Olá Zeist. Tenho interesse em formação em Revit API / Civil 3D API / Dynamo para a nossa equipe. Somos:",
    painsTitle: "A formação é para a sua empresa se…",
    pains: [
      {
        title: "Você depende de uma pessoa ou de terceiros",
        body: "Toda automação passa pela única pessoa que sabe, ou por um fornecedor externo.",
      },
      {
        title: "Você quer capacidade própria",
        body: "Sua empresa quer criar e manter suas ferramentas dentro da equipe.",
      },
      {
        title: "Sua equipe já usa Dynamo e quer dar o salto",
        body: "As rotinas ficaram curtas e o próximo passo é programar plugins em C#.",
      },
      {
        title: "Os cursos genéricos não servem",
        body: "Quase todos são centrados no Revit e em exemplos de edificações. O seu trabalho é infraestrutura e Civil 3D.",
      },
      {
        title: "Você recebeu um plugin e quer mantê-lo",
        body: "Sua equipe precisa entender o código para ajustá-lo quando o processo mudar.",
      },
    ],
    buildsTitle: "Programas de formação",
    buildsIntro: "Cada programa se adapta ao nível da equipe e aos casos da empresa:",
    builds: [
      {
        title: "Dynamo aplicado ao Revit e ao Civil 3D",
        body: "Do zero a rotinas de produção: lógica, nós, dados e boas práticas para que os grafos não quebrem.",
        guide: "dynamo-vs-csharp-civil3d-revit",
      },
      {
        title: "Revit API com C#",
        body: "O primeiro plugin, transações, filtros, interface de usuário e implantação no escritório.",
        guide: "desarrollo-add-ins-revit-civil-3d-guia-completa",
      },
      {
        title: "Civil 3D API com C#",
        body: "Alinhamentos, perfis, superfícies, redes e corredores a partir de código.",
        guide: "automatizar-civil-3d-guia-completa",
      },
      {
        title: "Desenvolvimento assistido por IA",
        body: "Como usar assistentes de IA para acelerar o desenvolvimento de rotinas e plugins sem perder o controle do código.",
        guide: "dynamo-csharp-con-ia-claude",
      },
      {
        title: "Mentoria individual",
        body: "Acompanhamento num projeto real da empresa, com revisões de código e decisões de arquitetura.",
        guide: "crear-plugin-civil-3d-con-claude-code-sin-programar",
      },
    ],
    processTitle: "Como funciona a formação",
    process: [
      {
        title: "Diagnóstico de nível",
        body: "Conhecemos a equipe, sua experiência e as tarefas que quer automatizar.",
        time: "Antes de começar",
      },
      {
        title: "Programa sob medida",
        body: "Escolhemos os temas e os casos da empresa que serão trabalhados.",
        time: "Alguns dias",
      },
      {
        title: "Sessões ao vivo",
        body: "Aulas práticas online, com exercícios sobre modelos reais e espaço para perguntas.",
        time: "Conforme o programa",
      },
      {
        title: "Projeto aplicado",
        body: "A equipe constrói uma ferramenta para um caso real da empresa, com a nossa orientação.",
        time: "Durante o curso",
      },
      {
        title: "Acompanhamento",
        body: "Mentoria para tirar dúvidas quando a equipe começa a criar as próprias ferramentas.",
        time: "Depois do curso",
      },
    ],
    deliverablesTitle: "O que sua equipe recebe",
    deliverables: [
      "Sessões ao vivo com engenheiros que desenvolvem plugins e rotinas em produção",
      "Material de apoio e código de exemplo de cada tema",
      "Modelos de projeto para começar os próprios plugins",
      "Uma ferramenta funcionando para um caso real da empresa",
      "Critérios para decidir quando usar Dynamo e quando um plugin",
    ],
    comparison: {
      title: "Formação sob medida ou curso genérico",
      criterionLabel: "Critério",
      leftLabel: "Formação sob medida",
      rightLabel: "Curso genérico",
      rows: "Casos de trabalho | *Os projetos da sua empresa | Exemplos genéricos || Civil 3D e infraestrutura | *Incluídos | Raramente || Resultado ao terminar | *Uma ferramenta em uso | Exercícios resolvidos || Dúvidas | *Ao vivo, com quem desenvolve | Fórum ou e-mail || Ritmo | *Adaptado à equipe | Fixo",
    },
    guides: [
      "programacion-para-ingenieros-civiles",
      "aprende-a-programar-desde-cero",
      "dynamo-vs-csharp-civil3d-revit",
      "desarrollo-add-ins-revit-civil-3d-guia-completa",
    ],
    faqs: [
      {
        q: "Precisamos saber programar para fazer o curso?",
        a: "Não. Para o Dynamo não é preciso nenhuma base de programação. Para Revit API e Civil 3D API começamos pelos fundamentos de C#, com exemplos de engenharia.",
      },
      {
        q: "Os cursos são online?",
        a: "Sim, ao vivo e online, para equipes do Brasil e da América Latina.",
      },
      {
        q: "O curso é de Revit ou de Civil 3D?",
        a: "Depende da sua equipe. Há programas para Revit, para Civil 3D e combinados. Ao contrário da maioria dos cursos, Civil 3D e infraestrutura estão incluídos.",
      },
      {
        q: "Podemos trabalhar com projetos da nossa empresa?",
        a: "Sim, essa é a ideia: o projeto aplicado é feito sobre um caso real, para que a formação termine com uma ferramenta funcionando.",
      },
      {
        q: "Qual a diferença entre o curso e a mentoria individual?",
        a: "O curso forma uma equipe num programa estruturado. A mentoria acompanha uma ou poucas pessoas num projeto concreto, com revisões do código e das decisões.",
      },
      {
        q: "Para quem é a formação?",
        a: "Para engenheiros civis, arquitetos, modeladores e coordenadores BIM que querem automatizar o próprio trabalho, e para empresas que querem criar e manter suas próprias ferramentas.",
      },
    ],
    ctaTitle: "Forme sua equipe para criar as próprias ferramentas",
    ctaBody:
      "Conte quantas pessoas são, quais programas usam e o que querem automatizar. Propomos um programa sob medida.",
  },
};
