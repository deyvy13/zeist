import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { AnalyticsOptOut, type AnalyticsOptOutLabels } from "@/components/analytics-optout";

// Privacy policy. Describes what the site actually does — keep it in sync with
// components/analytics.tsx (GA4 + consent regions), components/contact-form.tsx
// and cta-tracker (WhatsApp and email clicks), the tools (local processing, OSM and AWS tiles)
// and every localStorage key. Update `updated` whenever any of those change.

type Section = { id: string; h: string; paras?: string[]; list?: string[]; after?: string[] };

type Copy = {
  title: string;
  description: string;
  updated: string;
  summaryTitle: string;
  summary: string[];
  tableTitle: string;
  tableHead: [string, string, string, string];
  tableRows: [string, string, string, string][];
  sections: Section[];
  optout: AnalyticsOptOutLabels & { title: string };
};

const wa = site.whatsapp.display;
const mail = site.email;

const copy: Record<Locale, Copy> = {
  es: {
    title: "Política de privacidad",
    description:
      "Qué datos trata Zeist, para qué y cómo ejercer tus derechos: analítica sin publicidad, herramientas que funcionan en tu navegador, WhatsApp y correo.",
    updated: "Última actualización: 10 de octubre de 2026",
    summaryTitle: "En corto",
    summary: [
      "No vendemos ni cedemos tus datos, y no mostramos publicidad.",
      "Las calculadoras y conversores funcionan en tu navegador: lo que ingresas no llega a nuestros servidores.",
      "Medimos las visitas con Google Analytics, sin cookies en Europa, y puedes desactivar la medición en este navegador.",
      "Si nos escribes por WhatsApp o por correo, usamos tus datos solo para responderte.",
    ],
    tableTitle: "Qué datos tratamos y para qué",
    tableHead: ["Dato", "Para qué", "Dónde se procesa", "Cuánto tiempo"],
    tableRows: [
      [
        "Navegación: páginas vistas, país aproximado, tipo de dispositivo, clics en botones de contacto y uso de las herramientas",
        "Saber qué contenido sirve y mejorar el sitio",
        "Google Analytics 4",
        "Hasta 14 meses",
      ],
      [
        "Lo que escribes por WhatsApp, por correo o en el formulario: nombre, mensaje, tu correo si lo agregas y la página desde la que escribes",
        "Responderte y preparar el diagnóstico o la propuesta",
        "WhatsApp (Meta), Gmail (Google) y nuestros dispositivos",
        "Mientras dure tu consulta o la relación comercial",
      ],
      [
        "Preferencias guardadas en tu navegador: tema, historial del conversor y avance de lectura",
        "Recordar tus preferencias",
        "Solo en tu navegador",
        "Hasta que borres los datos del navegador",
      ],
      [
        "Registros técnicos del servidor: dirección IP, navegador, fecha y página solicitada",
        "Servir el sitio y protegerlo de abusos",
        "Vercel (alojamiento)",
        "Según la política del proveedor",
      ],
    ],
    sections: [
      {
        id: "responsable",
        h: "1. Quién es responsable",
        paras: [
          `El responsable del tratamiento es **Zeist**, un equipo de automatización BIM con base en Trujillo, La Libertad, Perú. Para cualquier consulta sobre tus datos, escríbenos por WhatsApp al ${wa}, al correo [${mail}](mailto:${mail}) o desde la [página de contacto](/es/contacto).`,
        ],
      },
      {
        id: "analitica",
        h: "2. Medición con Google Analytics",
        paras: [
          "Usamos Google Analytics 4 para contar visitas y saber qué páginas y herramientas se usan. No mostramos publicidad, y el almacenamiento con fines publicitarios está desactivado en todos los casos.",
          "En el Espacio Económico Europeo, el Reino Unido y Suiza, la medición funciona **sin cookies**: Google recibe solo señales anónimas. En el resto de países, Google Analytics usa sus cookies de medición.",
          "Además de las páginas vistas, registramos los clics en los botones de WhatsApp, de correo y de contacto (qué botón, en qué página y en qué idioma) y el uso de las herramientas (qué herramienta, el formato exportado y la cantidad de puntos o vértices). **Nunca enviamos las coordenadas, archivos o datos que ingresas en las herramientas.**",
          "Los datos de eventos se conservan 14 meses.",
        ],
        after: [
          "También puedes instalar el [complemento de inhabilitación de Google Analytics](https://tools.google.com/dlpage/gaoptout) o bloquear las cookies desde tu navegador. Más información en la [política de privacidad de Google](https://policies.google.com/privacy).",
        ],
      },
      {
        id: "whatsapp",
        h: "3. WhatsApp, correo y formulario de contacto",
        paras: [
          "El formulario de contacto no envía datos a un servidor nuestro: arma el mensaje y abre WhatsApp en tu dispositivo. Nada se envía hasta que lo confirmas en WhatsApp.",
          "Cuando usas un botón de WhatsApp del sitio, el mensaje incluye el título de la página desde la que escribes, para entender mejor tu consulta. Puedes editarlo o borrarlo antes de enviarlo.",
          "WhatsApp es un servicio de Meta con su [propia política de privacidad](https://www.whatsapp.com/legal/privacy-policy). Usamos lo que nos escribes solo para responderte y preparar el diagnóstico o la propuesta que pidas.",
          `Si nos escribes al correo [${mail}](mailto:${mail}), el mensaje llega a una cuenta de Gmail, un servicio de Google con su [propia política de privacidad](https://policies.google.com/privacy). Lo usamos solo para responderte.`,
        ],
      },
      {
        id: "herramientas",
        h: "4. Herramientas gratuitas",
        paras: [
          "Las calculadoras y conversores funcionan en tu navegador: las coordenadas, los archivos DXF y los datos que ingresas se procesan en tu equipo y no se envían a nuestros servidores. Los archivos que descargas se generan en tu propio navegador.",
          "Los mapas cargan imágenes de [OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy), y el generador de curvas de nivel descarga datos de elevación del servicio público Terrain Tiles en Amazon Web Services. Como ocurre con cualquier mapa web, esos servicios reciben tu dirección IP y la zona del mapa que estás viendo.",
        ],
      },
      {
        id: "cookies",
        h: "5. Cookies y almacenamiento local",
        paras: ["Esto es todo lo que el sitio guarda en tu navegador:"],
        list: [
          "**_ga** y **_ga_…**: cookies de Google Analytics para distinguir visitas. No se usan en el Espacio Económico Europeo, el Reino Unido ni Suiza.",
          "**zeist-theme**: si prefieres el tema claro u oscuro.",
          "**zeist-coords-history**: el historial del conversor de coordenadas.",
          "**zeist-progress-…**: qué módulos de cada guía ya abriste.",
          "**zeist-wa-bubble**: evita mostrar dos veces el aviso de WhatsApp en la misma visita.",
          "**zeist-analytics-optout**: tu decisión, si desactivas la medición.",
        ],
        after: ["No usamos cookies de publicidad ni de redes sociales."],
      },
      {
        id: "terceros",
        h: "6. Con quién compartimos datos",
        paras: [
          "No vendemos ni cedemos tus datos. Solo intervienen los proveedores que hacen funcionar el sitio: Google (analítica y correo), Meta (WhatsApp), Vercel (alojamiento), la Fundación OpenStreetMap (mapas) y Amazon Web Services (datos de elevación).",
          "Sus servidores pueden estar fuera del Perú, por lo que usar el sitio implica una transferencia internacional de datos a esos proveedores, que aplican sus propias medidas de seguridad.",
        ],
      },
      {
        id: "derechos",
        h: "7. Tus derechos",
        paras: [
          "De acuerdo con la Ley N.° 29733, Ley de Protección de Datos Personales, y su Reglamento (Decreto Supremo N.° 016-2024-JUS), puedes pedir el acceso, la rectificación, la cancelación o la portabilidad de tus datos, u oponerte a su tratamiento.",
          `Para ejercerlos, escríbenos por WhatsApp al ${wa} o al correo [${mail}](mailto:${mail}) indicando qué derecho quieres ejercer. Te responderemos dentro de los plazos que fija la ley. Si consideras que no atendimos tu pedido, puedes acudir a la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.`,
          "Si escribes desde el Brasil, también tienes los derechos de la LGPD (Ley n.º 13.709/2018); desde el Espacio Económico Europeo o el Reino Unido, los del Reglamento General de Protección de Datos.",
        ],
      },
      {
        id: "menores",
        h: "8. Menores de edad",
        paras: ["El sitio está dirigido a profesionales y empresas. No recogemos a sabiendas datos de menores de edad."],
      },
      {
        id: "seguridad",
        h: "9. Seguridad",
        paras: [
          "El sitio funciona con conexión cifrada (HTTPS). No tenemos cuentas de usuario ni una base de datos de visitantes: la mayor parte de lo que haces aquí se queda en tu navegador.",
        ],
      },
      {
        id: "cambios",
        h: "10. Cambios en esta política",
        paras: ["Si cambia la forma en que tratamos datos, actualizaremos esta página y su fecha de actualización."],
      },
    ],
    optout: {
      title: "Desactivar la medición en este navegador",
      active: "La medición está activa en este navegador.",
      inactive: "La medición está desactivada en este navegador.",
      disable: "Desactivar la medición",
      enable: "Volver a activarla",
      enabledNote: "Si la reactivas, se aplicará desde la próxima página que visites.",
      unavailable: "La medición no está activa en esta versión del sitio.",
    },
  },
  pt: {
    title: "Política de privacidade",
    description:
      "Que dados a Zeist trata neste site, para quê e como exercer seus direitos: análise sem publicidade, ferramentas que funcionam no navegador, WhatsApp e e-mail.",
    updated: "Última atualização: 10 de outubro de 2026",
    summaryTitle: "Em resumo",
    summary: [
      "Não vendemos nem cedemos seus dados, e não exibimos publicidade.",
      "As calculadoras e conversores funcionam no seu navegador: o que você digita não chega aos nossos servidores.",
      "Medimos as visitas com o Google Analytics, sem cookies na Europa, e você pode desativar a medição neste navegador.",
      "Se você nos escreve pelo WhatsApp ou por e-mail, usamos seus dados só para responder.",
    ],
    tableTitle: "Que dados tratamos e para quê",
    tableHead: ["Dado", "Para quê", "Onde é processado", "Por quanto tempo"],
    tableRows: [
      [
        "Navegação: páginas vistas, país aproximado, tipo de dispositivo, cliques em botões de contato e uso das ferramentas",
        "Saber que conteúdo é útil e melhorar o site",
        "Google Analytics 4",
        "Até 14 meses",
      ],
      [
        "O que você escreve pelo WhatsApp, por e-mail ou no formulário: nome, mensagem, seu e-mail se você incluir e a página de onde escreve",
        "Responder e preparar o diagnóstico ou a proposta",
        "WhatsApp (Meta), Gmail (Google) e nossos dispositivos",
        "Enquanto durar a consulta ou a relação comercial",
      ],
      [
        "Preferências salvas no seu navegador: tema, histórico do conversor e progresso de leitura",
        "Lembrar suas preferências",
        "Só no seu navegador",
        "Até você apagar os dados do navegador",
      ],
      [
        "Registros técnicos do servidor: endereço IP, navegador, data e página solicitada",
        "Servir o site e protegê-lo de abusos",
        "Vercel (hospedagem)",
        "Conforme a política do fornecedor",
      ],
    ],
    sections: [
      {
        id: "responsavel",
        h: "1. Quem é o responsável",
        paras: [
          `O controlador dos dados é a **Zeist**, uma equipe de automação BIM com sede em Trujillo, La Libertad, Peru. Para qualquer dúvida sobre seus dados, escreva pelo WhatsApp para ${wa}, para o e-mail [${mail}](mailto:${mail}) ou pela [página de contato](/pt/contacto).`,
        ],
      },
      {
        id: "analise",
        h: "2. Medição com o Google Analytics",
        paras: [
          "Usamos o Google Analytics 4 para contar visitas e saber quais páginas e ferramentas são usadas. Não exibimos publicidade, e o armazenamento para fins publicitários está desativado em todos os casos.",
          "No Espaço Econômico Europeu, no Reino Unido e na Suíça, a medição funciona **sem cookies**: o Google recebe só sinais anônimos. Nos demais países, o Google Analytics usa seus cookies de medição.",
          "Além das páginas vistas, registramos os cliques nos botões de WhatsApp, de e-mail e de contato (qual botão, em que página e em que idioma) e o uso das ferramentas (qual ferramenta, o formato exportado e a quantidade de pontos ou vértices). **Nunca enviamos as coordenadas, arquivos ou dados que você digita nas ferramentas.**",
          "Os dados de eventos são guardados por 14 meses.",
        ],
        after: [
          "Você também pode instalar o [complemento de desativação do Google Analytics](https://tools.google.com/dlpage/gaoptout) ou bloquear os cookies no seu navegador. Mais informações na [política de privacidade do Google](https://policies.google.com/privacy).",
        ],
      },
      {
        id: "whatsapp",
        h: "3. WhatsApp, e-mail e formulário de contato",
        paras: [
          "O formulário de contato não envia dados a um servidor nosso: ele monta a mensagem e abre o WhatsApp no seu dispositivo. Nada é enviado até você confirmar no WhatsApp.",
          "Quando você usa um botão de WhatsApp do site, a mensagem inclui o título da página de onde você escreve, para entendermos melhor sua consulta. Você pode editar ou apagar antes de enviar.",
          "O WhatsApp é um serviço da Meta com sua [própria política de privacidade](https://www.whatsapp.com/legal/privacy-policy). Usamos o que você nos escreve só para responder e preparar o diagnóstico ou a proposta que você pedir.",
          `Se você nos escreve para o e-mail [${mail}](mailto:${mail}), a mensagem chega a uma conta do Gmail, um serviço do Google com sua [própria política de privacidade](https://policies.google.com/privacy). Usamos só para responder.`,
        ],
      },
      {
        id: "ferramentas",
        h: "4. Ferramentas gratuitas",
        paras: [
          "As calculadoras e conversores funcionam no seu navegador: as coordenadas, os arquivos DXF e os dados que você digita são processados no seu computador e não são enviados aos nossos servidores. Os arquivos que você baixa são gerados no seu próprio navegador.",
          "Os mapas carregam imagens do [OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy), e o gerador de curvas de nível baixa dados de elevação do serviço público Terrain Tiles na Amazon Web Services. Como acontece com qualquer mapa na web, esses serviços recebem seu endereço IP e a área do mapa que você está vendo.",
        ],
      },
      {
        id: "cookies",
        h: "5. Cookies e armazenamento local",
        paras: ["Isto é tudo o que o site guarda no seu navegador:"],
        list: [
          "**_ga** e **_ga_…**: cookies do Google Analytics para distinguir visitas. Não são usados no Espaço Econômico Europeu, no Reino Unido nem na Suíça.",
          "**zeist-theme**: se você prefere o tema claro ou escuro.",
          "**zeist-coords-history**: o histórico do conversor de coordenadas.",
          "**zeist-progress-…**: quais módulos de cada guia você já abriu.",
          "**zeist-wa-bubble**: evita mostrar duas vezes o aviso do WhatsApp na mesma visita.",
          "**zeist-analytics-optout**: sua decisão, se você desativar a medição.",
        ],
        after: ["Não usamos cookies de publicidade nem de redes sociais."],
      },
      {
        id: "terceiros",
        h: "6. Com quem compartilhamos dados",
        paras: [
          "Não vendemos nem cedemos seus dados. Só participam os fornecedores que fazem o site funcionar: Google (análise e e-mail), Meta (WhatsApp), Vercel (hospedagem), a Fundação OpenStreetMap (mapas) e a Amazon Web Services (dados de elevação).",
          "Os servidores deles podem estar fora do Peru e do Brasil, então usar o site implica uma transferência internacional de dados para esses fornecedores, que aplicam suas próprias medidas de segurança.",
        ],
      },
      {
        id: "direitos",
        h: "7. Seus direitos",
        paras: [
          "Se você está no Brasil, a Lei Geral de Proteção de Dados (Lei n.º 13.709/2018) garante, entre outros, os direitos de confirmação e acesso, correção, anonimização, bloqueio ou eliminação, portabilidade e revogação do consentimento. Como a Zeist está no Peru, também se aplica a Lei n.º 29733 de Proteção de Dados Pessoais e seu Regulamento (Decreto Supremo n.º 016-2024-JUS).",
          `Para exercer seus direitos, escreva pelo WhatsApp para ${wa} ou para o e-mail [${mail}](mailto:${mail}) indicando qual direito deseja exercer. Responderemos dentro dos prazos legais. Você também pode recorrer à autoridade de proteção de dados do seu país; no Brasil, a Autoridade Nacional de Proteção de Dados (ANPD).`,
        ],
      },
      {
        id: "menores",
        h: "8. Menores de idade",
        paras: ["O site é dirigido a profissionais e empresas. Não coletamos intencionalmente dados de menores de idade."],
      },
      {
        id: "seguranca",
        h: "9. Segurança",
        paras: [
          "O site funciona com conexão criptografada (HTTPS). Não temos contas de usuário nem um banco de dados de visitantes: a maior parte do que você faz aqui fica no seu navegador.",
        ],
      },
      {
        id: "mudancas",
        h: "10. Mudanças nesta política",
        paras: ["Se mudar a forma como tratamos dados, atualizaremos esta página e sua data de atualização."],
      },
    ],
    optout: {
      title: "Desativar a medição neste navegador",
      active: "A medição está ativa neste navegador.",
      inactive: "A medição está desativada neste navegador.",
      disable: "Desativar a medição",
      enable: "Reativar",
      enabledNote: "Se você reativar, ela valerá a partir da próxima página que visitar.",
      unavailable: "A medição não está ativa nesta versão do site.",
    },
  },
  en: {
    title: "Privacy policy",
    description:
      "What data Zeist handles on this site, why, and how to exercise your rights: analytics with no ads, tools that run in your browser, WhatsApp and email.",
    updated: "Last updated: October 10, 2026",
    summaryTitle: "In short",
    summary: [
      "We don't sell or share your data, and we don't show ads.",
      "The calculators and converters run in your browser: what you enter never reaches our servers.",
      "We measure visits with Google Analytics, cookieless in Europe, and you can turn measurement off in this browser.",
      "If you message us on WhatsApp or by email, we use your data only to reply.",
    ],
    tableTitle: "What data we handle and why",
    tableHead: ["Data", "Purpose", "Where it's processed", "How long"],
    tableRows: [
      [
        "Browsing: pages viewed, approximate country, device type, clicks on contact buttons and tool usage",
        "Know which content is useful and improve the site",
        "Google Analytics 4",
        "Up to 14 months",
      ],
      [
        "What you write on WhatsApp, by email or in the form: name, message, your email if you add it, and the page you're writing from",
        "Reply to you and prepare the diagnosis or proposal",
        "WhatsApp (Meta), Gmail (Google) and our devices",
        "For as long as your inquiry or the business relationship lasts",
      ],
      [
        "Preferences stored in your browser: theme, converter history and reading progress",
        "Remember your preferences",
        "Only in your browser",
        "Until you clear your browser data",
      ],
      [
        "Server logs: IP address, browser, date and requested page",
        "Serve the site and protect it from abuse",
        "Vercel (hosting)",
        "Per the provider's policy",
      ],
    ],
    sections: [
      {
        id: "controller",
        h: "1. Who is responsible",
        paras: [
          `The data controller is **Zeist**, a BIM automation team based in Trujillo, La Libertad, Peru. For any question about your data, message us on WhatsApp at ${wa}, email [${mail}](mailto:${mail}) or use the [contact page](/en/contacto).`,
        ],
      },
      {
        id: "analytics",
        h: "2. Measurement with Google Analytics",
        paras: [
          "We use Google Analytics 4 to count visits and learn which pages and tools are used. We don't show ads, and advertising storage is disabled in every case.",
          "In the European Economic Area, the United Kingdom and Switzerland, measurement runs **without cookies**: Google receives only anonymous signals. Everywhere else, Google Analytics uses its measurement cookies.",
          "Besides page views, we record clicks on WhatsApp, email and contact buttons (which button, on which page and in which language) and tool usage (which tool, the export format and the number of points or vertices). **We never send the coordinates, files or data you enter in the tools.**",
          "Event data is kept for 14 months.",
        ],
        after: [
          "You can also install the [Google Analytics opt-out browser add-on](https://tools.google.com/dlpage/gaoptout) or block cookies in your browser. More in [Google's privacy policy](https://policies.google.com/privacy).",
        ],
      },
      {
        id: "whatsapp",
        h: "3. WhatsApp, email and the contact form",
        paras: [
          "The contact form doesn't send data to a server of ours: it composes the message and opens WhatsApp on your device. Nothing is sent until you confirm it in WhatsApp.",
          "When you use a WhatsApp button on the site, the message includes the title of the page you're writing from, so we understand your question better. You can edit or delete it before sending.",
          "WhatsApp is a Meta service with its [own privacy policy](https://www.whatsapp.com/legal/privacy-policy). We use what you write only to reply and to prepare the diagnosis or proposal you ask for.",
          `If you email us at [${mail}](mailto:${mail}), the message reaches a Gmail account, a Google service with its [own privacy policy](https://policies.google.com/privacy). We use it only to reply.`,
        ],
      },
      {
        id: "tools",
        h: "4. Free tools",
        paras: [
          "The calculators and converters run in your browser: the coordinates, DXF files and data you enter are processed on your device and never sent to our servers. The files you download are generated in your own browser.",
          "Maps load imagery from [OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy), and the contour generator downloads elevation data from the public Terrain Tiles service on Amazon Web Services. As with any web map, those services receive your IP address and the map area you're viewing.",
        ],
      },
      {
        id: "cookies",
        h: "5. Cookies and local storage",
        paras: ["This is everything the site stores in your browser:"],
        list: [
          "**_ga** and **_ga_…**: Google Analytics cookies that tell visits apart. Not used in the European Economic Area, the United Kingdom or Switzerland.",
          "**zeist-theme**: whether you prefer the light or dark theme.",
          "**zeist-coords-history**: the coordinate converter's history.",
          "**zeist-progress-…**: which modules of each guide you've opened.",
          "**zeist-wa-bubble**: avoids showing the WhatsApp prompt twice in the same visit.",
          "**zeist-analytics-optout**: your choice, if you turn measurement off.",
        ],
        after: ["We don't use advertising or social media cookies."],
      },
      {
        id: "sharing",
        h: "6. Who we share data with",
        paras: [
          "We don't sell or share your data. Only the providers that run the site are involved: Google (analytics and email), Meta (WhatsApp), Vercel (hosting), the OpenStreetMap Foundation (maps) and Amazon Web Services (elevation data).",
          "Their servers may be outside Peru and outside your country, so using the site involves an international transfer of data to those providers, which apply their own security measures.",
        ],
      },
      {
        id: "rights",
        h: "7. Your rights",
        paras: [
          "Zeist is based in Peru, where Law No. 29733 on Personal Data Protection and its Regulation (Supreme Decree No. 016-2024-JUS) give you the right to access, rectify, cancel or port your data, and to object to its processing. If you're in the European Economic Area or the United Kingdom, you also have your rights under the GDPR.",
          `To exercise them, message us on WhatsApp at ${wa} or email [${mail}](mailto:${mail}) stating which right you want to exercise. We'll reply within the legal deadlines. You can also contact the data protection authority in your country.`,
        ],
      },
      {
        id: "minors",
        h: "8. Minors",
        paras: ["The site is aimed at professionals and companies. We don't knowingly collect data from minors."],
      },
      {
        id: "security",
        h: "9. Security",
        paras: [
          "The site runs over an encrypted connection (HTTPS). There are no user accounts and no visitor database: most of what you do here stays in your browser.",
        ],
      },
      {
        id: "changes",
        h: "10. Changes to this policy",
        paras: ["If the way we handle data changes, we'll update this page and its date."],
      },
    ],
    optout: {
      title: "Turn off measurement in this browser",
      active: "Measurement is on in this browser.",
      inactive: "Measurement is off in this browser.",
      disable: "Turn off measurement",
      enable: "Turn it back on",
      enabledNote: "If you turn it back on, it applies from the next page you visit.",
      unavailable: "Measurement isn't active on this version of the site.",
    },
  },
};

// Minimal inline markup for the copy above: **bold** and [text](href).
// Internal links (starting with "/") use next/link; external ones open in a new tab.
function inline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(<strong key={i++}>{m[1]}</strong>);
    } else if (m[3].startsWith("/")) {
      parts.push(
        <Link key={i++} href={m[3]} className="font-medium text-[color:var(--color-mint-700)] underline underline-offset-2">
          {m[2]}
        </Link>,
      );
    } else if (m[3].startsWith("mailto:")) {
      parts.push(
        <a key={i++} href={m[3]} className="font-medium text-[color:var(--color-mint-700)] underline underline-offset-2">
          {m[2]}
        </a>,
      );
    } else {
      parts.push(
        <a
          key={i++}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[color:var(--color-mint-700)] underline underline-offset-2"
        >
          {m[2]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.map((p, k) => <Fragment key={k}>{p}</Fragment>);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const c = copy[locale];
  return buildMetadata({
    locale,
    path: "privacidad",
    title: c.title,
    description: c.description,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = copy[lang];
  const analyticsIndex = c.sections.findIndex((s) => s.id === "analitica" || s.id === "analise" || s.id === "analytics");

  return (
    <article className="container-zeist py-16">
      <div className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-4xl md:text-5xl">{c.title}</h1>
          <p className="mt-4 text-sm text-[color:var(--color-muted)]">{c.updated}</p>
        </header>

        <section className="surface mt-10 rounded-2xl p-6">
          <h2 className="text-xl">{c.summaryTitle}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[color:var(--color-foreground)]">
            {c.summary.map((s) => (
              <li key={s}>{inline(s)}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl">{c.tableTitle}</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[color:var(--color-border)]">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
                  {c.tableHead.map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.tableRows.map((row) => (
                  <tr key={row[0]} className="border-b border-[color:var(--color-border)] last:border-0 align-top">
                    {row.map((cell, k) => (
                      <td key={k} className={`px-4 py-3 ${k === 0 ? "" : "text-[color:var(--color-muted)]"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {c.sections.map((s, idx) => (
          <section key={s.id} id={s.id} className="mt-12 scroll-mt-24">
            <h2 className="text-2xl">{s.h}</h2>
            {s.paras?.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-[color:var(--color-foreground)]/90">
                {inline(p)}
              </p>
            ))}
            {s.list && (
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {s.list.map((li) => (
                  <li key={li} className="leading-relaxed">
                    {inline(li)}
                  </li>
                ))}
              </ul>
            )}
            {idx === analyticsIndex && (
              <div className="mt-6">
                <h3 className="mb-3 text-lg">{c.optout.title}</h3>
                <AnalyticsOptOut labels={c.optout} />
              </div>
            )}
            {s.after?.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-[color:var(--color-foreground)]/90">
                {inline(p)}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
