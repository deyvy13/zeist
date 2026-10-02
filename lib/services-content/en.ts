import type { ServicePage, ServiceSlug } from "@/lib/services";

export const servicesEn: Record<ServiceSlug, ServicePage> = {
  // ---------------------------------------------------------------------------
  "add-ins-revit-civil-3d": {
    seoTitle: "Revit and Civil 3D Plugin Development Company",
    metaDescription:
      "Custom Revit and Civil 3D plugins built in C#: quantity takeoffs, sheet production, pipe networks, rebar and QA checks to your standards. You own the code.",
    keywords: [
      "revit plugin development company",
      "revit add-in development",
      "custom revit plugins",
      "civil 3d plugin development",
      "civil 3d api c#",
      "revit api developer",
      "autodesk plugin development",
    ],
    serviceType: "Revit and Civil 3D plugin and add-in development",
    eyebrow: "Service · Custom plugins and add-ins",
    h1: "Custom Revit and Civil 3D plugin development",
    intro:
      "We turn the tasks your team repeats on every project into buttons inside Revit and Civil 3D. We write them in C# on Autodesk's official API, following your standards, your naming conventions and your deliverable formats. And you own the code.",
    answer:
      "A Revit or Civil 3D plugin (also called an add-in) is a program installed inside the software that adds its own buttons to the top toolbar. It is written in C# on Autodesk's official API — the interface that lets code control Revit and Civil 3D — and it automates repetitive, rule-based tasks: quantity takeoffs, sheet production, pipe networks, rebar or quality checks. Zeist builds custom plugins for engineering and construction firms: diagnosis, prototype, development, an installer for the whole office, and support when a new version comes out.",
    facts: [
      { label: "Typical timeline", value: "4 to 8 weeks" },
      { label: "Technology", value: "C# / .NET · Autodesk API" },
      { label: "Ownership", value: "You own the code" },
      { label: "Delivery", value: "Remote · worldwide" },
    ],
    prefill:
      "Hi Zeist. We're interested in a custom plugin for Revit / Civil 3D. This is the task we want to automate:",
    painsTitle: "If your team deals with any of these, a custom plugin is for you",
    pains: [
      {
        title: "The same tasks on every project",
        body: "Takeoffs, sheets, renaming views, exporting drawings. Tasks with no engineering judgment that eat up days of engineering time on every deliverable.",
      },
      {
        title: "Deadlines that depend on overtime",
        body: "The design is done, but producing the deliverable takes the whole last week, and any last-minute change puts the date at risk.",
      },
      {
        title: "Errors that show up in review",
        body: "Quantities that don't match the drawings, non-standard naming, outdated sheets. The same review comments, project after project.",
      },
      {
        title: "Dynamo isn't enough anymore",
        body: "Scripts only one person knows how to run, that break with every version or slow down on large models.",
      },
      {
        title: "Off-the-shelf tools don't follow your standards",
        body: "Commercial plugins solve the general case, not your cost codes, your naming or the format your client requires.",
      },
    ],
    buildsTitle: "Plugins we build for Revit and Civil 3D",
    buildsIntro: "Every plugin is built around your office's rules. These are the most common cases:",
    builds: [
      {
        title: "Quantity takeoffs from the model",
        body: "Cut and fill volumes, areas by layer, lengths and counts, in your cost-code format and ready for the estimate.",
        guide: "deja-de-usar-excel-y-perder-horas",
      },
      {
        title: "Automated sheet production",
        body: "Plan and profile, cross sections, title blocks with stationing, revisions and export with the client's naming.",
        guide: "produccion-planos-automatica-civil-3d-revit",
      },
      {
        title: "Pipe networks and duct banks in 3D",
        body: "From a 2D polyline to a 3D network with elbows, tees and wyes placed by rule, and duct banks generated from their route.",
        guide: "redes-tuberias-civil-3d-accesorios",
      },
      {
        title: "Rebar modeling and checking in Revit",
        body: "Automatic rebar from the reinforcement schedule, code checks and rebar takeoffs by bar size, element and level.",
        guide: "plugin-acero-revit-modelado-revision",
      },
      {
        title: "Model version comparison",
        body: "What changed between the version you had and the one that just arrived: added, deleted, moved and modified, with a report.",
        guide: "comparar-modelos-revit-civil-3d-detectar-cambios",
      },
      {
        title: "Revit and Excel, both ways",
        body: "Export, edit parameters in bulk and import them back, with validation first and a log of every change.",
        guide: "exportar-tablas-revit-excel-editar-parametros",
      },
      {
        title: "Model audits and quality control",
        body: "Model health, standards checks and automatic review before every deliverable.",
        guide: "revit-lento-modelo-pesado-auditoria",
      },
    ],
    processTitle: "How we build your plugin",
    process: [
      {
        title: "Diagnosis",
        body: "We look at the task in your actual workflow, measure how much time it takes and write down the rules the plugin must apply. The initial diagnosis is free.",
        time: "1 week",
      },
      {
        title: "Prototype",
        body: "We validate the logic on a real project, in Dynamo or as a minimal version of the plugin. If it doesn't match the manual result, it gets fixed before we move on.",
        time: "1-2 weeks",
      },
      {
        title: "Development",
        body: "We write the plugin in C# with error handling, a log of what it does and tests on your own models.",
        time: "2-4 weeks",
      },
      {
        title: "Installation and training",
        body: "An installer for the whole office, a button on the top toolbar, team training and a user manual.",
        time: "A few days",
      },
      {
        title: "Support",
        body: "Adjustments after delivery and updates when Autodesk releases a new version of Revit or Civil 3D.",
        time: "Ongoing",
      },
    ],
    deliverablesTitle: "What your firm gets",
    deliverables: [
      "The plugin installed, with its button on the Revit or Civil 3D top toolbar",
      "An installer to deploy it across the whole office",
      "The complete source code: the plugin belongs to your firm",
      "A user manual and training for the team",
      "Technical documentation so another developer can maintain it",
      "Tests on your own models before delivery",
    ],
    comparison: {
      title: "Custom plugin or off-the-shelf tool",
      criterionLabel: "Criterion",
      leftLabel: "Custom plugin",
      rightLabel: "Off-the-shelf tool",
      rows: "Follows your standards and naming | *Exactly | Only if they match || Deliverable format | *Your firm's and your client's | The vendor's || Your office's rules | *Built into the tool | You adapt to it || Code ownership | *Yours | The vendor's || Changes when your process changes | *It adapts | Up to the vendor || Time to first use | Weeks | *Immediate",
    },
    guides: [
      "desarrollo-add-ins-revit-civil-3d-guia-completa",
      "cuanto-cuesta-un-add-in-revit-civil-3d",
      "dynamo-vs-csharp-civil3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
    ],
    faqs: [
      {
        q: "How much does it cost to develop a Revit or Civil 3D plugin?",
        a: "It depends on scope: how many rules it applies, how many versions of the software it must support and how different the cases it has to handle are. After the diagnosis, which is free, we send a proposal with scope, timeline and cost. The factors that drive the price are explained in our add-in cost guide.",
      },
      {
        q: "How long does it take to develop a plugin?",
        a: "Typically 4 to 8 weeks from diagnosis to installation in your office. Small tools, such as a batch rename or a rule-based export, can be ready sooner.",
      },
      {
        q: "Do we own the plugin's code?",
        a: "Yes. We deliver the complete source code and technical documentation. The plugin belongs to your firm, and your team or another developer can maintain it.",
      },
      {
        q: "Which versions of Revit and Civil 3D do you support?",
        a: "Whichever your office uses. Each Revit and Civil 3D version needs the plugin compiled for it, so we agree at the start which ones are included. When Autodesk releases a new one, the plugin is updated.",
      },
      {
        q: "Do we need to know how to code to use the plugin?",
        a: "No. The plugin is a button on the Revit or Civil 3D top toolbar. If you also want your team to be able to modify it, we offer training in the Revit API, the Civil 3D API and Dynamo.",
      },
      {
        q: "What's the difference between a plugin and a Dynamo script?",
        a: "Dynamo is ideal for validating an automation quickly. A plugin is better for daily use: anyone on the team can run it, it handles errors, it's fast on large models and it installs across the whole office. We often start in Dynamo and finish with a plugin.",
      },
      {
        q: "Do you work with companies outside Peru?",
        a: "Yes. Our team is based in Trujillo, Peru, and works remotely with firms in the US, Europe and Latin America. Peru is on UTC-5 all year, so our working day overlaps with US business hours. Diagnosis, reviews and installation are all done remotely.",
      },
    ],
    ctaTitle: "Which task would you turn into a button?",
    ctaBody:
      "Tell us what your team does by hand on every project. In the free diagnosis we measure how much time it takes and tell you whether it calls for a plugin, a Dynamo script or neither.",
  },

  // ---------------------------------------------------------------------------
  "automatizacion-dynamo": {
    seoTitle: "Custom Dynamo Scripts for Revit and Civil 3D",
    metaDescription:
      "Custom Dynamo scripts for Revit and Civil 3D: documented routines, tested on your models and ready for Dynamo Player. The fastest way to start automating.",
    keywords: [
      "dynamo scripts for revit",
      "dynamo for civil 3d",
      "civil 3d dynamo scripts",
      "dynamo automation revit",
      "custom dynamo scripts",
      "dynamo script developer",
      "dynamo player scripts",
    ],
    serviceType: "Dynamo automation for Revit and Civil 3D",
    eyebrow: "Service · Dynamo automation",
    h1: "Dynamo scripts for Revit and Civil 3D, ready for production",
    intro:
      "We build Dynamo routines that automate repetitive tasks in Revit and Civil 3D in days, not months. Documented, tested on your models and ready for your team to run from Dynamo Player without opening the graph.",
    answer:
      "Dynamo is the visual programming tool Autodesk ships with Revit and Civil 3D: it lets you build routines by connecting blocks, without writing code. A Dynamo script automates rule-based tasks — placing elements along an alignment, numbering, renaming, extracting data to Excel — and it's the fastest way to automate, because a routine can be validated in days. Zeist builds custom Dynamo scripts, documented and tested on each firm's models, and when a routine is used on every project, turns it into an installable plugin.",
    facts: [
      { label: "Typical timeline", value: "Days to 2 weeks" },
      { label: "Runs in", value: "Dynamo Player, without opening the graph" },
      { label: "Software", value: "Revit and Civil 3D" },
      { label: "Next step", value: "A plugin, if it's used every day" },
    ],
    prefill:
      "Hi Zeist. We'd like to automate a task with Dynamo in Revit / Civil 3D. This is the task:",
    painsTitle: "A custom Dynamo script makes sense if…",
    pains: [
      {
        title: "You need results this week",
        body: "The task hurts today and you can't wait for a plugin to be developed. A script solves the problem while you decide the next step.",
      },
      {
        title: "The rules still change",
        body: "The criteria shift from project to project. A Dynamo graph can be changed in minutes; it pays to let the rule settle before turning it into a plugin.",
      },
      {
        title: "You tried Dynamo and it didn't work",
        body: "Downloaded graphs that don't run on your models, routines only their author understands, or scripts that break with every version.",
      },
      {
        title: "You want proof before you invest",
        body: "Before commissioning a plugin, you want to confirm on your own projects that the automation saves what it promises.",
      },
    ],
    buildsTitle: "Dynamo scripts we build",
    buildsIntro: "Typical routines, always adapted to your rules and your models:",
    builds: [
      {
        title: "Placing elements along an alignment",
        body: "In Civil 3D: poles, signs, guardrails or markers placed by station and offset, at the elevation of the surface or the corridor.",
        guide: "plugin-civil-3d-dibujo-3d-automatizado",
      },
      {
        title: "Bulk numbering and renaming",
        body: "Rooms, doors, views, sheets or alignments named to your standard.",
        guide: "automatizar-tareas-revit-dynamo-plugins",
      },
      {
        title: "Data extraction to Excel",
        body: "Quantities, parameters and schedules from the model, exported in the format your office uses.",
        guide: "deja-de-usar-excel-y-perder-horas",
      },
      {
        title: "Parameters from Excel",
        body: "Cost codes, classifications and manufacturer data loaded into the model from a spreadsheet.",
        guide: "exportar-tablas-revit-excel-editar-parametros",
      },
      {
        title: "Parametric geometry",
        body: "Elements generated from rules: slopes, walls, enclosures or repetitive components.",
      },
      {
        title: "Standards checks",
        body: "Naming and required-parameter checks before every deliverable, with a report of what fails.",
        guide: "auditoria-bim-checklist-empresa",
      },
    ],
    processTitle: "How we deliver a Dynamo script",
    process: [
      {
        title: "Diagnosis",
        body: "We look at the task, the result you expect and the rules your team applies. The initial diagnosis is free.",
        time: "A few days",
      },
      {
        title: "Graph development",
        body: "We build the routine with nodes grouped and annotated, with no unnecessary external packages that break with updates.",
        time: "Days to 2 weeks",
      },
      {
        title: "Testing on your models",
        body: "We run it on a real project and compare the result with the manual method.",
        time: "A few days",
      },
      {
        title: "Handover for Dynamo Player",
        body: "Clear inputs so anyone on the team can run it without opening the graph, plus a user guide.",
        time: "On completion",
      },
      {
        title: "Move to a plugin (optional)",
        body: "If the routine is used on every project, we turn it into an installable plugin for the whole office.",
        time: "When it pays off",
      },
    ],
    deliverablesTitle: "What your firm gets",
    deliverables: [
      "The Dynamo script, documented, with nodes grouped and explained",
      "Dynamo Player setup: anyone on the team runs it without opening the graph",
      "Testing on your own models and a comparison with the manual method",
      "A user guide for the team",
      "A dependency list, with no unnecessary external packages",
      "An honest recommendation: stay in Dynamo or move to a plugin",
    ],
    comparison: {
      title: "Dynamo script or C# plugin",
      criterionLabel: "Criterion",
      leftLabel: "Dynamo script",
      rightLabel: "C# plugin",
      rows: "Time to a working tool | *Days | Weeks || Changing the rules | *In minutes | Requires development || How the team runs it | From Dynamo Player | With a button on the top toolbar || Speed on large models | Medium | *High || Error handling and logging | Basic | *Complete || Best for | Validating and changing tasks | Daily production",
    },
    guides: [
      "dynamo-vs-csharp-civil3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
      "dynamo-csharp-con-ia-claude",
      "automatizar-civil-3d-guia-completa",
    ],
    faqs: [
      {
        q: "What is Dynamo and what is it used for?",
        a: "It's the visual programming tool Autodesk ships with Revit and Civil 3D. It automates repetitive tasks by connecting blocks, without writing code: placing elements, numbering, renaming, extracting data or generating geometry from rules.",
      },
      {
        q: "Does Dynamo work in Civil 3D?",
        a: "Yes. Civil 3D includes Dynamo, with its own nodes for alignments, profiles, surfaces and corridors. It's especially useful for placing elements along an alignment and for extracting data from the model.",
      },
      {
        q: "How long does it take to develop a Dynamo script?",
        a: "Most routines are ready in days or a couple of weeks, including testing on your models. It's the fastest route to automation.",
      },
      {
        q: "Do scripts stop working when Revit or Civil 3D is updated?",
        a: "Sometimes they need adjustments, especially if they rely on external packages. That's why we build them with as few dependencies as possible and document them, so updating them is simple.",
      },
      {
        q: "Can you review or fix scripts we already have?",
        a: "Yes. We review the graph, fix what fails on your current models, document it and set it up for Dynamo Player.",
      },
      {
        q: "When should you move from Dynamo to a plugin?",
        a: "When the routine is used on every project, run by several people, works on large models or needs to handle errors without supervision. At that point a plugin is faster and more robust.",
      },
    ],
    ctaTitle: "Which task would you like automated by next week?",
    ctaBody:
      "Tell us the task and how your team handles it today. We'll tell you whether a Dynamo script solves it and how long it will take.",
  },

  // ---------------------------------------------------------------------------
  "auditoria-procesos-bim": {
    seoTitle: "BIM Audit and BIM Consulting Services",
    metaDescription:
      "BIM audit of models and workflows for engineering and construction firms: a diagnosis backed by numbers and a plan to fix, standardize and automate.",
    keywords: [
      "bim audit",
      "bim consulting services",
      "bim model audit",
      "bim consultancy",
      "bim workflow assessment",
      "bim implementation consulting",
      "revit model audit",
    ],
    serviceType: "BIM audit and consulting",
    eyebrow: "Service · BIM audit and consulting",
    h1: "BIM audit and consulting: find out where your team loses hours and what to automate first",
    intro:
      "We review your models and measure how your team works. In four weeks you get a diagnosis backed by numbers and a prioritized plan: what to fix, what to standardize and what to automate first, with the estimated savings of each action.",
    answer:
      "Zeist's BIM audit is a four-week diagnosis that combines two reviews: a model audit, which checks the technical quality of the files — naming, coordinates, model health, information and consistency between model, drawings and quantities — and a process audit, which measures where hours are lost, which tasks are repeated and which standards are missing. The result is a report with findings prioritized by impact and effort, and a plan to fix, standardize and automate. It isn't a certification: it's a decision-making tool for technical leadership.",
    facts: [
      { label: "Duration", value: "4 weeks" },
      { label: "Scope", value: "Models and workflows" },
      { label: "Outcome", value: "Prioritized plan with estimated savings" },
      { label: "Delivery", value: "Remote" },
    ],
    prefill:
      "Hi Zeist. We're interested in a BIM audit for our firm. About us:",
    painsTitle: "A BIM audit is for your firm if…",
    pains: [
      {
        title: "The same review comments keep coming back",
        body: "Deliverables return with the same comments: quantities that don't add up, formatting, outdated sheets.",
      },
      {
        title: "Every project comes out different",
        body: "Deliverable quality depends on who did the work, not on a standard everyone follows.",
      },
      {
        title: "A bid with BIM requirements is coming up",
        body: "You need to know whether your models and workflow meet what will be required, such as the client's information requirements under ISO 19650.",
      },
      {
        title: "Models are slow or keep getting corrupted",
        body: "The team loses time waiting on the model and nobody knows exactly why.",
      },
      {
        title: "You want to automate but don't know where to start",
        body: "There are plenty of ideas and little time. You need to know which one gives back the most hours before you invest.",
      },
      {
        title: "The team works overtime on every deliverable",
        body: "The effort is there; what's missing is knowing where it goes.",
      },
    ],
    buildsTitle: "What we review in the BIM audit",
    buildsIntro: "Two fronts, with a checklist we adapt to your standards and project types:",
    builds: [
      {
        title: "Model quality",
        body: "Naming, file structure, shared coordinates, levels and grids, warnings, imported CAD and families.",
        guide: "revit-lento-modelo-pesado-auditoria",
      },
      {
        title: "Information and consistency",
        body: "Required parameters, cost codes and consistency between the model, the drawings and the quantities.",
        guide: "auditoria-bim-checklist-empresa",
      },
      {
        title: "Time and rework",
        body: "How long each stage takes, what gets redone in each review and why.",
        guide: "reprocesos-obra-costo-oculto",
      },
      {
        title: "Standards and templates",
        body: "Whether a written standard exists and whether it's built into the templates the team uses.",
        guide: "estandarizar-procesos-bim-empresa",
      },
      {
        title: "People and knowledge",
        body: "Which tasks depend on a single person and what happens to the deliverable when that person is away.",
      },
      {
        title: "Automation opportunities",
        body: "Repetitive tasks that are candidates for Dynamo or a plugin, with the hours per year they consume today.",
        guide: "automatizar-tareas-revit-dynamo-plugins",
      },
    ],
    processTitle: "How the audit works, week by week",
    process: [
      {
        title: "Scope",
        body: "We choose two or three representative projects and the disciplines included, and define what leadership needs to know.",
        time: "Week 1",
      },
      {
        title: "Model review",
        body: "We run the model checklist, with automated tools wherever possible.",
        time: "Week 2",
      },
      {
        title: "Workflow analysis",
        body: "Short interviews with the team and observation of a real deliverable. We measure times.",
        time: "Week 3",
      },
      {
        title: "Report and plan",
        body: "Prioritized findings, a three-front plan and a baseline to measure progress. We present it to leadership.",
        time: "Week 4",
      },
      {
        title: "Implementation (optional)",
        body: "You can carry out the plan with your team or with us: standards, templates, Dynamo scripts and plugins.",
        time: "Afterwards",
      },
    ],
    deliverablesTitle: "What your firm gets",
    deliverables: [
      "A diagnosis backed by numbers: hours per task, review rounds and model health",
      "Findings prioritized by impact and effort",
      "A three-front action plan: fix, standardize and automate",
      "The estimated savings of each recommended automation",
      "A baseline of indicators to measure progress",
      "A results presentation for leadership",
    ],
    comparison: {
      title: "Deciding with an audit or without one",
      criterionLabel: "Decision",
      leftLabel: "With an audit",
      rightLabel: "Without an audit",
      rows: "What to automate first | *What gives back the most hours, measured | Whatever feels urgent || Recurring review comments | *The root cause is addressed | Each symptom is patched || Tool investment | *Where there's a return | Wherever someone asked || Progress | *Measured against a baseline | No reference point || Client requirements | *Gaps identified up front | Discovered in review",
    },
    guides: [
      "auditoria-bim-checklist-empresa",
      "estandarizar-procesos-bim-empresa",
      "reprocesos-obra-costo-oculto",
      "revit-lento-modelo-pesado-auditoria",
    ],
    faqs: [
      {
        q: "What is a BIM audit?",
        a: "A structured review of how a firm produces its projects in BIM: the quality of its models and the efficiency of its workflow. It ends with a report of prioritized findings and a plan to fix, standardize and automate.",
      },
      {
        q: "How long does the audit take?",
        a: "Four weeks for a scope of two or three representative projects: scoping, model review, workflow analysis and final report.",
      },
      {
        q: "What do you need from our team?",
        a: "Access to the models of the selected projects, short interviews with key people and the chance to observe a real deliverable. It's designed not to slow down production.",
      },
      {
        q: "Does the audit help with ISO 19650 or public-sector BIM requirements?",
        a: "It identifies the gaps between how you work today and what the client's information requirements demand. It isn't a certification, but it tells you what to fix before the next bid.",
      },
      {
        q: "What happens after the audit?",
        a: "You have a prioritized plan. You can carry it out with your team or with us: standards, templates, Dynamo scripts and custom plugins.",
      },
      {
        q: "Is it on-site or remote?",
        a: "Remote, for firms anywhere. Reviews, interviews and the results presentation are all done online.",
      },
    ],
    ctaTitle: "Find out in four weeks where your team's hours go",
    ctaBody:
      "Tell us your team size and the kind of projects you deliver. We'll propose the audit scope and what you'll receive at the end.",
  },

  // ---------------------------------------------------------------------------
  "cursos-mentorias-bim": {
    seoTitle: "Revit API, Civil 3D API and Dynamo Training",
    metaDescription:
      "Live Revit API, Civil 3D API and Dynamo courses and mentoring for engineering teams: your firm's real projects, from zero to working tools.",
    keywords: [
      "revit api course",
      "revit api training",
      "revit api course c#",
      "civil 3d api training",
      "dynamo training for civil 3d",
      "dynamo course revit",
      "bim training for companies",
    ],
    serviceType: "Revit API, Civil 3D API and Dynamo training",
    eyebrow: "Service · Courses and mentoring",
    h1: "Revit API, Civil 3D API and Dynamo training for BIM teams",
    intro:
      "We train your team to build and maintain its own automations. Live sessions on your firm's real projects, from Dynamo to C# plugins for Revit and Civil 3D.",
    answer:
      "Zeist's courses and mentoring teach engineering teams to automate Revit and Civil 3D: Dynamo for no-code routines, and C# programming on the Autodesk API to build installable plugins. They're taught live and online, adapted to the team's level, and built around the firm's real cases, so the training ends with tools working in the office. They cover Civil 3D and infrastructure, an area most courses — focused on Revit — leave out.",
    facts: [
      { label: "Delivery", value: "Live and online" },
      { label: "Programs", value: "Dynamo · Revit API · Civil 3D API" },
      { label: "Format", value: "Teams or 1-on-1 mentoring" },
      { label: "Outcome", value: "Tools working in your office" },
    ],
    prefill:
      "Hi Zeist. We're interested in Revit API / Civil 3D API / Dynamo training for our team. About us:",
    painsTitle: "Training is for your firm if…",
    pains: [
      {
        title: "You depend on one person or on outsiders",
        body: "Every automation goes through the one person who knows how, or through an outside vendor.",
      },
      {
        title: "You want in-house capability",
        body: "Your firm wants to build and maintain its tools within the team.",
      },
      {
        title: "Your team already uses Dynamo and wants to step up",
        body: "The routines have hit their limits, and the next step is writing C# plugins.",
      },
      {
        title: "Generic courses don't fit",
        body: "Almost all of them focus on Revit and building examples. Your work is infrastructure and Civil 3D.",
      },
      {
        title: "You received a plugin and want to maintain it",
        body: "Your team needs to understand the code to adjust it when the workflow changes.",
      },
    ],
    buildsTitle: "Training programs",
    buildsIntro: "Each program is adapted to the team's level and the firm's cases:",
    builds: [
      {
        title: "Dynamo for Revit and Civil 3D",
        body: "From zero to production routines: logic, nodes, data and good practices so graphs don't break.",
        guide: "dynamo-vs-csharp-civil3d-revit",
      },
      {
        title: "Revit API with C#",
        body: "Your first plugin, transactions, filters, user interface and deployment across the office.",
        guide: "desarrollo-add-ins-revit-civil-3d-guia-completa",
      },
      {
        title: "Civil 3D API with C#",
        body: "Alignments, profiles, surfaces, networks and corridors from code.",
        guide: "automatizar-civil-3d-guia-completa",
      },
      {
        title: "AI-assisted development",
        body: "How to use AI assistants to speed up building routines and plugins without losing control of the code.",
        guide: "dynamo-csharp-con-ia-claude",
      },
      {
        title: "1-on-1 mentoring",
        body: "Guidance on a real project of your firm, with code reviews and architecture decisions.",
        guide: "crear-plugin-civil-3d-con-claude-code-sin-programar",
      },
    ],
    processTitle: "How the training works",
    process: [
      {
        title: "Level assessment",
        body: "We get to know the team, its experience and the tasks it wants to automate.",
        time: "Before we start",
      },
      {
        title: "Tailored program",
        body: "We choose the topics and the firm's cases we'll work on.",
        time: "A few days",
      },
      {
        title: "Live sessions",
        body: "Hands-on online classes, with exercises on real models and time for questions.",
        time: "Per program",
      },
      {
        title: "Applied project",
        body: "The team builds a tool for a real case at the firm, with our guidance.",
        time: "During the course",
      },
      {
        title: "Follow-up",
        body: "Mentoring to answer questions as the team starts building its own tools.",
        time: "After the course",
      },
    ],
    deliverablesTitle: "What your team gets",
    deliverables: [
      "Live sessions with engineers who build plugins and routines for production",
      "Course materials and sample code for every topic",
      "Project templates to start your own plugins",
      "A working tool for a real case at your firm",
      "Criteria for deciding when to use Dynamo and when to build a plugin",
    ],
    comparison: {
      title: "Tailored training or generic course",
      criterionLabel: "Criterion",
      leftLabel: "Tailored training",
      rightLabel: "Generic course",
      rows: "Practice cases | *Your firm's projects | Generic examples || Civil 3D and infrastructure | *Included | Rarely || Outcome | *A tool in use | Solved exercises || Questions | *Live, with the people who build | Forum or email || Pace | *Adapted to the team | Fixed",
    },
    guides: [
      "programacion-para-ingenieros-civiles",
      "aprende-a-programar-desde-cero",
      "dynamo-vs-csharp-civil3d-revit",
      "desarrollo-add-ins-revit-civil-3d-guia-completa",
    ],
    faqs: [
      {
        q: "Do we need to know how to code to take the course?",
        a: "No. Dynamo needs no programming background. For the Revit API and the Civil 3D API we start from C# fundamentals, with engineering examples.",
      },
      {
        q: "Are the courses online?",
        a: "Yes, live and online, for teams anywhere.",
      },
      {
        q: "Is the course for Revit or for Civil 3D?",
        a: "It depends on your team. There are programs for Revit, for Civil 3D and combined. Unlike most courses, Civil 3D and infrastructure are included.",
      },
      {
        q: "Can we work on our own firm's projects?",
        a: "Yes, that's the idea: the applied project is built on a real case, so the training ends with a working tool.",
      },
      {
        q: "What's the difference between the course and 1-on-1 mentoring?",
        a: "The course trains a team through a structured program. Mentoring supports one or a few people on a specific project, with reviews of their code and decisions.",
      },
      {
        q: "Who is the training for?",
        a: "Civil engineers, architects, BIM modelers and coordinators who want to automate their work, and firms that want to build and maintain their own tools.",
      },
    ],
    ctaTitle: "Train your team to build its own tools",
    ctaBody:
      "Tell us how many people, which software they use and what they want to automate. We'll propose a tailored program.",
  },
};
