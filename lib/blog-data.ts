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
