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
        title: "Las 8 grandes ramas donde puedes especializarte",
        intro:
          "De las áreas más comerciales (donde hay mucho trabajo y mucha competencia) a los nichos rentables donde pocos entran. Cada una con pros, contras y perfil ideal.",
        steps: [
          { n: 1, title: "Desarrollo de software", desc: "Frontend, backend, fullstack, mobile — el corazón de la industria", tag: "Comercial" },
          { n: 2, title: "Data e Inteligencia Artificial", desc: "Data science, ML engineer, MLOps, ingeniero de datos", tag: "En auge" },
          { n: 3, title: "Cloud y DevOps", desc: "SRE, DevOps, cloud architect, platform engineer", tag: "Comercial" },
          { n: 4, title: "Ciberseguridad", desc: "Pentester, blue team, red team, GRC, forense digital", tag: "Alto valor" },
          { n: 5, title: "Product, UX y diseño", desc: "Product manager, product designer, UX researcher", tag: "Híbrido" },
          { n: 6, title: "Automatización de industrias", desc: "BIM/CAD ingeniería civil, industria 4.0, robótica, salud", tag: "Nicho rentable" },
          { n: 7, title: "Emergentes y de nicho", desc: "Blockchain, AR/VR, IoT, edge, quantum, sistemas embebidos", tag: "Alto riesgo/premio" },
          { n: 8, title: "Cómo elegir tu rama", desc: "Framework simple de 4 preguntas para decidir sin arrepentirte", tag: "Decisión" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes sobre ramas de sistemas",
        items: [
          {
            q: "¿Qué especialización de Ingeniería de Sistemas paga más?",
            a: "Los rangos más altos suelen estar en: (1) ciberseguridad senior (especialmente cloud security y red team), (2) MLOps / AI Engineer con experiencia real en producción, (3) Cloud Architect en empresas grandes, (4) nichos verticales como quant developer o BIM automation para grandes constructoras. En general, cuanto más específico y demandado + menos oferta, mejor pagado."
          },
          {
            q: "¿Puedo cambiar de rama después de años trabajando?",
            a: "Sí, y es común. La mayoría de fundamentos son transferibles (lógica, resolución de problemas, comunicación técnica). Cambiar suele tomar 6-12 meses de reconversión con proyectos personales, cursos y un salto de puesto. La IA acelera muchísimo esa transición — puedes ser productivo en una tecnología nueva en semanas."
          },
          {
            q: "¿Necesito un máster o certificación para especializarme?",
            a: "Depende de la rama. Para dev/DevOps/cloud casi nunca — el portfolio y la experiencia mandan. Para ciberseguridad y cloud arquitecto las certificaciones (OSCP, AWS Solutions Architect) sí abren puertas. Para data/IA en investigación, un máster ayuda; para roles aplicados, no. En automatización industrial, el dominio del sector (ing. civil, salud, industria) pesa más que cualquier título extra."
          },
          {
            q: "¿La IA va a reemplazar mi especialización?",
            a: "Va a transformar todas, no reemplazar. Los perfiles junior de tareas mecánicas (crear CRUDs, tests básicos) están más expuestos. Los perfiles que integran IA como copiloto multiplican su productividad. Las ramas más 'seguras' de disrupción a corto plazo: ciberseguridad, cloud architecture, automatización específica de industria, product management. Ver también nuestra guía de [Vibe Coding](/es/blog/guia-vibe-coding-para-empezar)."
          },
          {
            q: "¿Cuál es mejor para trabajar remoto?",
            a: "Desarrollo de software, DevOps y data son las más 100% remoto-friendly (mercado global). Ciberseguridad depende del cliente (algunas empresas exigen on-site por regulación). Automatización industrial suele requerir presencia física al inicio pero mucho remoto después. Product y UX son cada vez más remotas también."
          },
          {
            q: "Si soy ingeniero civil, ¿tiene sentido pivotar a sistemas?",
            a: "No pivotes — combina. La automatización BIM/CAD (Dynamo, Revit API, C#) es un nicho enorme y poco competido donde un ingeniero civil que sabe programar vale mucho más que un dev que aprende BIM. Lee [Dynamo vs C# en Civil 3D y Revit](/es/blog/dynamo-vs-csharp-civil3d-revit) y [Programación para ingenieros civiles](/es/blog/programacion-para-ingenieros-civiles)."
          },
          {
            q: "¿Cómo sé qué rama es para mí?",
            a: "Cuatro preguntas: (1) ¿te motiva más lo visual o lo abstracto? (2) ¿te gusta trabajar solo profundo o coordinar gente? (3) ¿toleras alto estrés puntual (ciber, SRE) o prefieres ritmo estable? (4) ¿te apasiona alguna industria específica (salud, construcción, finanzas)? Combinando esas respuestas con tu contexto local (qué se paga bien en tu ciudad), la rama surge. El módulo 8 del artículo tiene el framework completo."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "Os 8 grandes ramos onde você pode se especializar",
        intro:
          "Das áreas mais comerciais (muito trabalho e muita competição) aos nichos rentáveis onde poucos entram. Cada um com prós, contras e perfil ideal.",
        steps: [
          { n: 1, title: "Desenvolvimento de software", desc: "Frontend, backend, fullstack, mobile — o coração da indústria", tag: "Comercial" },
          { n: 2, title: "Dados e Inteligência Artificial", desc: "Data science, ML engineer, MLOps, engenheiro de dados", tag: "Em alta" },
          { n: 3, title: "Cloud e DevOps", desc: "SRE, DevOps, cloud architect, platform engineer", tag: "Comercial" },
          { n: 4, title: "Cibersegurança", desc: "Pentester, blue team, red team, GRC, forense digital", tag: "Alto valor" },
          { n: 5, title: "Product, UX e design", desc: "Product manager, product designer, UX researcher", tag: "Híbrido" },
          { n: 6, title: "Automação de indústrias", desc: "BIM/CAD engenharia civil, indústria 4.0, robótica, saúde", tag: "Nicho rentável" },
          { n: 7, title: "Emergentes e de nicho", desc: "Blockchain, AR/VR, IoT, edge, quantum, sistemas embarcados", tag: "Alto risco/prêmio" },
          { n: 8, title: "Como escolher seu ramo", desc: "Framework simples de 4 perguntas para decidir sem se arrepender", tag: "Decisão" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes sobre ramos de sistemas",
        items: [
          {
            q: "Qual especialização de Engenharia de Sistemas paga mais?",
            a: "Os patamares mais altos costumam estar em: (1) cibersegurança sênior (especialmente cloud security e red team), (2) MLOps / AI Engineer com experiência real em produção, (3) Cloud Architect em empresas grandes, (4) nichos verticais como quant developer ou automação BIM para grandes construtoras. Em geral, quanto mais específico e demandado + menos oferta, melhor pago."
          },
          {
            q: "Posso mudar de ramo depois de anos trabalhando?",
            a: "Sim, e é comum. A maioria dos fundamentos é transferível (lógica, resolução de problemas, comunicação técnica). Mudar costuma levar 6-12 meses de reconversão com projetos pessoais, cursos e um salto de posição. A IA acelera muito essa transição — você pode ser produtivo em uma tecnologia nova em semanas."
          },
          {
            q: "Preciso de mestrado ou certificação para me especializar?",
            a: "Depende do ramo. Para dev/DevOps/cloud quase nunca — portfólio e experiência mandam. Para cibersegurança e cloud architect as certificações (OSCP, AWS Solutions Architect) abrem portas. Para dados/IA em pesquisa, mestrado ajuda; para papéis aplicados, não. Em automação industrial, o domínio do setor (eng. civil, saúde, indústria) pesa mais que qualquer título extra."
          },
          {
            q: "A IA vai substituir minha especialização?",
            a: "Vai transformar todas, não substituir. Perfis júnior de tarefas mecânicas (criar CRUDs, testes básicos) estão mais expostos. Perfis que integram IA como copiloto multiplicam sua produtividade. Ramos mais 'seguros' de disrupção a curto prazo: cibersegurança, cloud architecture, automação específica de indústria, product management. Veja também nosso guia de [Vibe Coding](/pt/blog/guia-vibe-coding-para-empezar)."
          },
          {
            q: "Qual é melhor para trabalho remoto?",
            a: "Desenvolvimento de software, DevOps e dados são os mais 100% remote-friendly (mercado global). Cibersegurança depende do cliente (algumas empresas exigem on-site por regulação). Automação industrial costuma exigir presença física no início mas muito remoto depois. Product e UX são cada vez mais remotos também."
          },
          {
            q: "Se sou engenheiro civil, faz sentido pivotar para sistemas?",
            a: "Não pivote — combine. A automação BIM/CAD (Dynamo, Revit API, C#) é um nicho enorme e pouco competido onde um engenheiro civil que sabe programar vale muito mais que um dev que aprende BIM. Leia [Dynamo vs C# no Civil 3D e Revit](/pt/blog/dynamo-vs-csharp-civil3d-revit) e [Programação para engenheiros civis](/pt/blog/programacion-para-ingenieros-civiles)."
          },
          {
            q: "Como sei qual ramo é para mim?",
            a: "Quatro perguntas: (1) te motiva mais o visual ou o abstrato? (2) gosta de trabalhar sozinho a fundo ou coordenar pessoas? (3) tolera alto estresse pontual (ciber, SRE) ou prefere ritmo estável? (4) te apaixona alguma indústria específica (saúde, construção, finanças)? Combinando essas respostas com seu contexto local (o que paga bem na sua cidade), o ramo surge. O módulo 8 do artigo tem o framework completo."
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
        title: "Las 6 razones por las que tu Excel te está costando dinero",
        intro:
          "Diagnóstico honesto para emprendedores y PYMEs que sienten que su operación 'se les va de las manos' con hojas de cálculo.",
        steps: [
          { n: 1, title: "Los archivos que ya no encuentras", desc: "Versiones duplicadas, correos con adjuntos perdidos", tag: "Problema" },
          { n: 2, title: "Los errores silenciosos", desc: "Fórmulas rotas, filas borradas por accidente, celdas mal sumadas", tag: "Problema" },
          { n: 3, title: "El tiempo que no ves", desc: "Cuántas horas al mes pierdes copiando y pegando", tag: "Problema" },
          { n: 4, title: "Trabajar en equipo se vuelve imposible", desc: "Nadie sabe cuál es 'la buena', dos personas editan a la vez", tag: "Problema" },
          { n: 5, title: "Qué es un sistema (sin tecnicismos)", desc: "Web propia, datos en la nube, acceso desde cualquier lugar", tag: "Solución" },
          { n: 6, title: "Cuándo saltar y cómo empezar", desc: "Señales claras + primer paso pequeño y barato con IA", tag: "Acción" },
        ],
      },
      faqs: {
        title: "Preguntas frecuentes",
        items: [
          {
            q: "¿Cuándo debo dejar de usar Excel en mi negocio?",
            a: "Cuando cumplas al menos dos: (1) dedicas más de 5 h/semana a mover datos entre archivos, (2) has tenido errores que cuestan dinero por fórmulas rotas o versiones desactualizadas, (3) tu equipo son más de 2-3 personas editando lo mismo, (4) necesitas ver información en tiempo real o desde el celular. Antes de eso, Excel es barato y suficiente."
          },
          {
            q: "¿Es muy caro tener un sistema a medida en vez de Excel?",
            a: "Ya no. Con IA y metodología ágil, un MVP funcional (con lo esencial: registrar, listar, buscar, editar, respaldar en la nube) puede costar mucho menos que hace 5 años. La inversión típica se recupera en 3-9 meses solo con el tiempo ahorrado de tu equipo."
          },
          {
            q: "¿No es más simple pagar una herramienta como Notion o Airtable?",
            a: "Sí, para empezar. Notion, Airtable, Google Sheets con AppSheet son un buen escalón intermedio si tu proceso es genérico. Pero si tu operación tiene reglas propias (facturación con impuestos específicos, control de producción, inventarios con lotes), un sistema a medida escala mejor y no te ata a suscripciones que crecen con cada usuario."
          },
          {
            q: "¿Perderé todos mis datos actuales de Excel?",
            a: "No. Un sistema serio se diseña para importar tus Excel actuales en el primer día. Se limpia, se estructura, y queda como base de datos. Nunca empiezas de cero — tus años de información se preservan y quedan mucho mejor organizados."
          },
          {
            q: "¿Cuánto tarda en estar listo?",
            a: "Depende del alcance. Un MVP con las 5-8 funciones más críticas: 4-8 semanas típicamente. Sistemas más completos (facturación electrónica, integraciones, roles): 2-4 meses. Y sigue creciendo con el negocio — no es 'lo entregamos y adiós'."
          },
          {
            q: "¿Y si mañana quiero cambiar algo del sistema?",
            a: "Ahí está la ventaja. Tu sistema es tuyo — el código es tu propiedad. Cualquier cambio es una tarea de programación, no un rediseño. Y con IA, esos cambios son mucho más rápidos y baratos que hace 5 años."
          }
        ],
      },
    },
    pt: {
      roadmap: {
        title: "As 6 razões pelas quais seu Excel está te custando dinheiro",
        intro:
          "Diagnóstico honesto para empreendedores e PMEs que sentem que sua operação 'está saindo do controle' com planilhas.",
        steps: [
          { n: 1, title: "Os arquivos que você não acha mais", desc: "Versões duplicadas, e-mails com anexos perdidos", tag: "Problema" },
          { n: 2, title: "Os erros silenciosos", desc: "Fórmulas quebradas, linhas apagadas sem querer, células mal somadas", tag: "Problema" },
          { n: 3, title: "O tempo que você não vê", desc: "Quantas horas por mês você perde copiando e colando", tag: "Problema" },
          { n: 4, title: "Trabalhar em equipe fica impossível", desc: "Ninguém sabe qual é 'a boa', duas pessoas editam ao mesmo tempo", tag: "Problema" },
          { n: 5, title: "O que é um sistema (sem tecnicismos)", desc: "Web própria, dados na nuvem, acesso de qualquer lugar", tag: "Solução" },
          { n: 6, title: "Quando dar o salto e como começar", desc: "Sinais claros + primeiro passo pequeno e barato com IA", tag: "Ação" },
        ],
      },
      faqs: {
        title: "Perguntas frequentes",
        items: [
          {
            q: "Quando devo parar de usar Excel no meu negócio?",
            a: "Quando cumprir pelo menos dois: (1) dedica mais de 5 h/semana movendo dados entre arquivos, (2) já teve erros que custaram dinheiro por fórmulas quebradas ou versões desatualizadas, (3) sua equipe são mais de 2-3 pessoas editando o mesmo, (4) precisa ver informação em tempo real ou pelo celular. Antes disso, Excel é barato e suficiente."
          },
          {
            q: "É muito caro ter um sistema sob medida em vez de Excel?",
            a: "Já não. Com IA e metodologia ágil, um MVP funcional (com o essencial: registrar, listar, buscar, editar, backup na nuvem) pode custar muito menos do que há 5 anos. O investimento típico se paga em 3-9 meses só com o tempo economizado da equipe."
          },
          {
            q: "Não é mais simples pagar uma ferramenta como Notion ou Airtable?",
            a: "Sim, para começar. Notion, Airtable, Google Sheets com AppSheet são um bom degrau intermediário se seu processo é genérico. Mas se sua operação tem regras próprias (faturamento com impostos específicos, controle de produção, estoques com lotes), um sistema sob medida escala melhor e não te prende a assinaturas que crescem com cada usuário."
          },
          {
            q: "Vou perder todos meus dados atuais do Excel?",
            a: "Não. Um sistema sério é desenhado para importar seus Excel atuais no primeiro dia. Se limpa, se estrutura, e fica como banco de dados. Você nunca começa do zero — seus anos de informação são preservados e ficam muito melhor organizados."
          },
          {
            q: "Quanto tempo demora para ficar pronto?",
            a: "Depende do escopo. Um MVP com as 5-8 funções mais críticas: 4-8 semanas tipicamente. Sistemas mais completos (nota fiscal, integrações, papéis): 2-4 meses. E segue crescendo com o negócio — não é 'entregamos e tchau'."
          },
          {
            q: "E se amanhã eu quiser mudar algo no sistema?",
            a: "Aí está a vantagem. Seu sistema é seu — o código é sua propriedade. Qualquer mudança é uma tarefa de programação, não um redesenho. E com IA, essas mudanças são muito mais rápidas e baratas do que há 5 anos."
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
