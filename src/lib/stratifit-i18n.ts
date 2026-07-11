import type { Language } from "./cms-types";

/* ------------------------------------------------------------------ */
/*  Hardcoded-label translations                                      */
/*                                                                   */
/*  Used by Header.tsx + Footer.tsx for chrome that isn't driven by   */
/*  the CMS (or as a fallback when the relevant CMS table is empty).  */
/*  CMS-driven content uses `t()` from cms-types on the JSONB fields; */
/*  this `tLabel()` covers the static fallback strings.               */
/* ------------------------------------------------------------------ */

// Module-local: consumed only by tLabel() below. Re-export if a future
// consumer (e.g. a test or an admin translator UI) needs direct access.
const labelTranslations: Record<string, Record<Language, string>> = {
  // Brand
  stratifit: { en: "Stratifit", fr: "Stratifit", de: "Stratifit", es: "Stratifit" },
  digital_excellence: { en: "Digital Excellence", fr: "Excellence Numérique", de: "Digitale Exzellenz", es: "Excelencia Digital" },
  // Nav labels
  home: { en: "Home", fr: "Accueil", de: "Startseite", es: "Inicio" },
  services: { en: "Services", fr: "Services", de: "Dienstleistungen", es: "Servicios" },
  insights: { en: "Insights", fr: "Idées", de: "Einblicke", es: "Ideas" },
  work: { en: "Work", fr: "Projets", de: "Arbeit", es: "Trabajo" },
  about: { en: "About", fr: "À Propos", de: "Über uns", es: "Acerca de" },
  faq: { en: "FAQ", fr: "FAQ", de: "FAQ", es: "FAQ" },
  contact: { en: "Contact", fr: "Contact", de: "Kontakt", es: "Contacto" },
  testimonials: { en: "Testimonials", fr: "Témoignages", de: "Erfahrungsberichte", es: "Testimonios" },
  buy_business: { en: "Buy a Business", fr: "Acheter une Entreprise", de: "Unternehmen Kaufen", es: "Comprar un Negocio" },
  // Service tiles
  branding: { en: "Branding", fr: "Marque", de: "Marke", es: "Marca" },
  development: { en: "Development", fr: "Développement", de: "Entwicklung", es: "Desarrollo" },
  marketing: { en: "Marketing", fr: "Marketing", de: "Marketing", es: "Marketing" },
  automation: { en: "Automation", fr: "Automatisation", de: "Automatisierung", es: "Automatización" },
  // CTA
  start_project: { en: "Start Your Project", fr: "Démarrer Votre Projet", de: "Starten Sie Ihr Projekt", es: "Inicia Tu Proyecto" },
  // Legal
  privacy: { en: "Privacy Policy", fr: "Politique de Confidentialité", de: "Datenschutz", es: "Política de Privacidad" },
  terms: { en: "Terms of Service", fr: "Conditions d'Utilisation", de: "Nutzungsbedingungen", es: "Términos de Servicio" },
  cookies: { en: "Cookie Policy", fr: "Politique de Cookies", de: "Cookie-Richtlinie", es: "Política de Cookies" },
  // Footer column titles
  platform: { en: "Platform", fr: "Plateforme", de: "Plattform", es: "Plataforma" },
  company: { en: "Company", fr: "Entreprise", de: "Unternehmen", es: "Empresa" },
  legal_col: { en: "Legal", fr: "Mentions Légales", de: "Rechtliches", es: "Legal" },
  // Footer misc
  careers: { en: "Careers", fr: "Carrières", de: "Karriere", es: "Carreras" },
  all_rights_reserved: { en: "All rights reserved", fr: "Tous droits réservés", de: "Alle Rechte vorbehalten", es: "Todos los derechos reservados" },
  back_to_top: { en: "Back to Top", fr: "Retour en Haut", de: "Nach Oben", es: "Volver Arriba" },
  tagline: { en: "Digital excellence, built from foundation to full scale.", fr: "Excellence numérique, du fondamental à la pleine échelle.", de: "Digitale Exzellenz, vom Fundament bis zur vollen Skalierung.", es: "Excelencia digital, construida desde los cimientos hasta el máximo nivel." },
  // Aria labels
  toggle_menu: { en: "Open menu", fr: "Ouvrir le menu", de: "Menü öffnen", es: "Abrir menú" },
  close_menu: { en: "Close menu", fr: "Fermer le menu", de: "Menü schließen", es: "Cerrar menú" },

  /* ============================================================
     Section content (home page)
     Used as the language-aware fallback for the 10 page sections
     when their CMS table is empty. Flat key naming matches the
     existing labelTranslations map shape.
     ============================================================ */

  /* ---------- Hero ---------- */
  hero_badge: { en: "Premium Digital Agency", fr: "Agence Numérique Premium", de: "Premium Digitalagentur", es: "Agencia Digital Premium" },
  hero_heading_1: { en: "We Build Websites, Brands & Systems", fr: "Nous Créons Sites Web, Marques et Systèmes", de: "Wir Bauen Websites, Marken und Systeme", es: "Construimos Sitios Web, Marcas y Sistemas" },
  hero_heading_2: { en: "That Grow Businesses.", fr: "Qui Font Croître les Entreprises.", de: "Die Unternehmen Wachstum Bringen.", es: "Que Hacen Crecer Negocios." },
  hero_subheading: { en: "We help startups and businesses build brands, websites, and systems that turn visitors into paying customers.", fr: "Nous aidons les startups et les entreprises à construire des marques, sites web et systèmes qui transforment les visiteurs en clients payants.", de: "Wir helfen Startups und Unternehmen, Marken, Websites und Systeme zu entwickeln, die Besucher in zahlende Kunden verwandeln.", es: "Ayudamos a startups y empresas a construir marcas, sitios web y sistemas que convierten visitantes en clientes que pagan." },
  hero_cta_secondary: { en: "Book a Strategy Call", fr: "Réserver un Appel Stratégique", de: "Strategiegespräch Buchen", es: "Reservar una Llamada Estratégica" },
  hero_trusted_by_label: { en: "Trusted by Growing Companies", fr: "Choisi par des Entreprises en Croissance", de: "Vertraut von Wachstumsstarken Unternehmen", es: "Confianza de Empresas en Crecimiento" },
  hero_tech_prefix: { en: "Our ", fr: "Notre ", de: "Unser ", es: "Nuestro " },
  hero_tech_highlight: { en: "Tech", fr: "Tech", de: "Tech", es: "Tech" },
  hero_tech_suffix: { en: " Stack", fr: " Stack", de: "-Stack", es: " Stack" },
  hero_tech_subtitle: { en: "We use the best tools in the industry to build, automate, and scale your digital presence.", fr: "Nous utilisons les meilleurs outils du secteur pour construire, automatiser et développer votre présence numérique.", de: "Wir verwenden die besten Tools der Branche, um Ihre digitale Präsenz aufzubauen, zu automatisieren und zu skalieren.", es: "Utilizamos las mejores herramientas de la industria para construir, automatizar y escalar tu presencia digital." },
  hero_stat_projects_l1: { en: "Projects", fr: "Projets", de: "Projekte", es: "Proyectos" },
  hero_stat_projects_l2: { en: "Delivered", fr: "Livrés", de: "Geliefert", es: "Entregados" },
  hero_stat_years_l1: { en: "Years", fr: "Années", de: "Jahre", es: "Años" },
  hero_stat_years_l2: { en: "Experience", fr: "d'Expérience", de: "Erfahrung", es: "de Experiencia" },
  hero_stat_satisfaction_l1: { en: "Client", fr: "Clients", de: "Kunden", es: "Clientes" },
  hero_stat_satisfaction_l2: { en: "Satisfaction", fr: "Satisfaits", de: "Zufrieden", es: "Satisfechos" },

  /* ---------- CoreServices ---------- */
  services_label: { en: "Services", fr: "Services", de: "Dienstleistungen", es: "Servicios" },
  services_title_prefix: { en: "Our Core", fr: "Nos", de: "Unsere Kern", es: "Nuestros" },
  services_title_highlight: { en: "Services", fr: "Services", de: "Dienstleistungen", es: "Servicios" },
  services_subtitle: { en: "Strategic solutions engineered to scale your digital presence with precision and luxury.", fr: "Solutions stratégiques conçues pour développer votre présence numérique avec précision et excellence.", de: "Strategische Lösungen, entwickelt um Ihre digitale Präsenz mit Präzision und Luxus zu skalieren.", es: "Soluciones estratégicas diseñadas para escalar tu presencia digital con precisión y lujo." },
  key_deliverables: { en: "Key Deliverables", fr: "Livrables Clés", de: "Wichtigste Leistungen", es: "Entregables Clave" },
  btn_learn_more: { en: "Learn More", fr: "En Savoir Plus", de: "Mehr Erfahren", es: "Saber Más" },
  service_brand_title: { en: "Brand Design", fr: "Design de Marque", de: "Marken-Design", es: "Diseño de Marca" },
  service_brand_desc: { en: "Crafting unique identities that resonate and leave a lasting impression on your market.", fr: "Créer des identités uniques qui résonnent et laissent une impression durable sur votre marché.", de: "Einzigartige Identitäten, die Anklang finden und einen bleibenden Eindruck hinterlassen.", es: "Creando identidades únicas que resuenan y dejan una impresión duradera." },
  service_brand_d1: { en: "Brand Strategy", fr: "Stratégie de Marque", de: "Markenstrategie", es: "Estrategia de Marca" },
  service_brand_d2: { en: "Logo Design", fr: "Conception de Logo", de: "Logo-Design", es: "Diseño de Logo" },
  service_brand_d3: { en: "Visual Identity", fr: "Identité Visuelle", de: "Visuelle Identität", es: "Identidad Visual" },
  service_brand_d4: { en: "Brand Guidelines", fr: "Charte de Marque", de: "Markenrichtlinien", es: "Guías de Marca" },
  service_website_title: { en: "Website Development", fr: "Développement Web", de: "Webentwicklung", es: "Desarrollo Web" },
  service_website_desc: { en: "High-performance websites and web apps engineered for speed, scale, and conversion.", fr: "Sites web et applications haute performance conçus pour la vitesse, l'échelle et la conversion.", de: "Hochleistungswebsites und Web-Apps für Geschwindigkeit, Skalierung und Konversion.", es: "Sitios web y aplicaciones de alto rendimiento para velocidad, escala y conversión." },
  service_website_d1: { en: "Custom Websites", fr: "Sites Web Personnalisés", de: "Individuelle Websites", es: "Sitios Web Personalizados" },
  service_website_d2: { en: "E‑commerce", fr: "E‑commerce", de: "E‑Commerce", es: "E‑commerce" },
  service_website_d3: { en: "Web Applications", fr: "Applications Web", de: "Webanwendungen", es: "Aplicaciones Web" },
  service_website_d4: { en: "CMS Integration", fr: "Intégration CMS", de: "CMS-Integration", es: "Integración CMS" },
  service_ai_title: { en: "AI & Automation", fr: "IA et Automatisation", de: "KI und Automatisierung", es: "IA y Automatización" },
  service_ai_desc: { en: "Intelligent automation that streamlines operations, qualifies leads, and scales support 24/7.", fr: "Automatisation intelligente qui simplifie les opérations, qualifie les prospects et étend le support 24/7.", de: "Intelligente Automatisierung, die Abläufe rationalisiert, Leads qualifiziert und Support rund um die Uhr skaliert.", es: "Automatización inteligente que agiliza operaciones, califica leads y escala el soporte 24/7." },
  service_ai_d1: { en: "AI Lead Qualification", fr: "Qualification de Leads par IA", de: "KI-Lead-Qualifizierung", es: "Calificación de Leads con IA" },
  service_ai_d2: { en: "AI Chatbots", fr: "Chatbots IA", de: "KI-Chatbots", es: "Chatbots de IA" },
  service_ai_d3: { en: "Workflow Automation", fr: "Automatisation des Flux", de: "Workflow-Automatisierung", es: "Automatización de Flujos" },
  service_ai_d4: { en: "Custom APIs", fr: "APIs Personnalisées", de: "Individuelle APIs", es: "APIs Personalizadas" },
  service_growth_title: { en: "Growth & Marketing", fr: "Croissance et Marketing", de: "Wachstum und Marketing", es: "Crecimiento y Marketing" },
  service_growth_desc: { en: "Data-driven campaigns that amplify your brand and drive measurable revenue growth.", fr: "Campagnes basées sur les données qui amplifient votre marque et stimulent une croissance mesurable.", de: "Datengesteuerte Kampagnen, die Ihre Marke verstärken und messbares Umsatzwachstum fördern.", es: "Campañas basadas en datos que amplifican tu marca e impulsan un crecimiento medible." },
  service_growth_d1: { en: "Performance Marketing", fr: "Marketing de Performance", de: "Performance-Marketing", es: "Marketing de Rendimiento" },
  service_growth_d2: { en: "SEO & SEM", fr: "SEO et SEM", de: "SEO & SEM", es: "SEO y SEM" },
  service_growth_d3: { en: "Content Strategy", fr: "Stratégie de Contenu", de: "Content-Strategie", es: "Estrategia de Contenido" },
  service_growth_d4: { en: "Social Media", fr: "Réseaux Sociaux", de: "Social Media", es: "Redes Sociales" },

  /* ---------- Process ---------- */
  process_label: { en: "Process", fr: "Processus", de: "Prozess", es: "Proceso" },
  process_title_prefix: { en: "How We", fr: "Comment Nous", de: "Wie Wir", es: "Cómo" },
  process_title_highlight: { en: "Work", fr: "Travaillons", de: "Arbeiten", es: "Trabajamos" },
  process_subtitle: { en: "A proven framework that takes you from idea to scale — predictably and efficiently.", fr: "Un cadre éprouvé qui vous emmène de l'idée à l'échelle — de manière prévisible et efficace.", de: "Ein bewährter Rahmen, der Sie vorhersehbar und effizient von der Idee zur Skalierung führt.", es: "Un marco probado que te lleva de la idea a la escala, de forma predecible y eficiente." },
  step_badge: { en: "STEP", fr: "ÉTAPE", de: "SCHRITT", es: "PASO" },
  step_1_title: { en: "Discovery", fr: "Découverte", de: "Entdeckung", es: "Descubrimiento" },
  step_1_desc: { en: "We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.", fr: "Nous plongeons dans vos objectifs, votre public et vos défis pour construire une base solide pour chaque décision.", de: "Wir tauchen tief in Ihre Geschäftsziele, Zielgruppe und Herausforderungen ein.", es: "Profundizamos en tus objetivos, audiencia y desafíos para construir una base sólida." },
  step_2_title: { en: "Strategy", fr: "Stratégie", de: "Strategie", es: "Estrategia" },
  step_2_desc: { en: "We design a comprehensive plan covering brand, web, AI, and growth — aligned with your revenue targets.", fr: "Nous concevons un plan complet couvrant marque, web, IA et croissance — aligné sur vos revenus.", de: "Wir entwerfen einen umfassenden Plan für Marke, Web, KI und Wachstum.", es: "Diseñamos un plan integral que cubre marca, web, IA y crecimiento." },
  step_3_title: { en: "Build", fr: "Construction", de: "Aufbau", es: "Construcción" },
  step_3_desc: { en: "Our team implements systems, websites, automations, and campaigns with precision engineering.", fr: "Notre équipe implémente systèmes, sites web, automatisations et campagnes avec une ingénierie de précision.", de: "Unser Team implementiert Systeme, Websites und Kampagnen mit Präzisionsingenieurskunst.", es: "Nuestro equipo implementa sistemas, sitios web y campañas con ingeniería de precisión." },
  step_4_title: { en: "Launch & Grow", fr: "Lancement et Croissance", de: "Starten & Wachsen", es: "Lanzar y Crecer" },
  step_4_desc: { en: "We optimize, scale, and measure everything. Continuous improvement is built into our DNA.", fr: "Nous optimisons, mettons à l'échelle et mesurons tout. L'amélioration continue est dans notre ADN.", de: "Wir optimieren, skalieren und messen alles. Kontinuierliche Verbesserung liegt in unserer DNA.", es: "Optimizamos, escalamos y medimos todo. La mejora continua está en nuestro ADN." },

  /* ---------- WhyChooseUs ---------- */
  why_us_label: { en: "Why Us", fr: "Pourquoi Nous", de: "Warum Wir", es: "Por Qué Nosotros" },
  why_us_title_prefix: { en: "Not Just Another", fr: "Pas Juste une Autre", de: "Nicht Noch Eine", es: "No Solo Otra" },
  why_us_title_highlight: { en: "Agency", fr: "Agence", de: "Agentur", es: "Agencia" },
  why_us_subtitle: { en: "We build digital assets that drive valuation and market authority — not just websites.", fr: "Nous créons des actifs numériques qui stimulent la valorisation et l'autorité — pas seulement des sites web.", de: "Wir bauen digitale Vermögenswerte, die Bewertung und Marktautorität steigern.", es: "Construimos activos digitales que impulsan la valoración y autoridad en el mercado." },
  benefit_1_title: { en: "Premium Quality & Precision", fr: "Qualité Premium et Précision", de: "Premium-Qualität & Präzision", es: "Calidad Premium y Precisión" },
  benefit_1_desc: { en: "Every deliverable is engineered with meticulous attention to detail, ensuring your brand commands authority from day one.", fr: "Chaque livrable est conçu avec une attention méticuleuse aux détails.", de: "Jeder Liefergegenstand wird mit akribischer Liebe zum Detail entwickelt.", es: "Cada entregable está diseñado con atención meticulosa al detalle." },
  benefit_1_stat_label: { en: "Client Retention", fr: "Fidélisation Client", de: "Kundenbindung", es: "Retención de Clientes" },
  benefit_2_title: { en: "Fast, Reliable Delivery", fr: "Livraison Rapide et Fiable", de: "Schnelle, Zuverlässige Lieferung", es: "Entrega Rápida y Confiable" },
  benefit_2_desc: { en: "Our agile processes mean you get high-quality output on aggressive timelines without sacrificing excellence.", fr: "Nos processus agiles offrent des résultats de haute qualité dans des délais serrés.", de: "Unsere agilen Prozesse liefern Qualität auch unter aggressiven Zeitplänen.", es: "Nuestros procesos ágiles ofrecen resultados de alta calidad en plazos agresivos." },
  benefit_2_stat_label: { en: "Avg. Turnaround", fr: "Délai Moyen", de: "Durchschn. Bearbeitungszeit", es: "Tiempo Promedio" },
  benefit_3_title: { en: "Data-Driven Results", fr: "Résultats Basés sur les Données", de: "Datengesteuerte Ergebnisse", es: "Resultados Basados en Datos" },
  benefit_3_desc: { en: "We measure everything that matters. Every decision is backed by analytics to maximize your return on investment.", fr: "Nous mesurons tout ce qui compte. Chaque décision est étayée par des analyses.", de: "Wir messen alles, was zählt. Jede Entscheidung wird durch Analytik gestützt.", es: "Medimos todo lo que importa. Cada decisión está respaldada por análisis." },
  benefit_3_stat_label: { en: "Avg. ROAS", fr: "ROAS Moyen", de: "Durchschn. ROAS", es: "ROAS Promedio" },
  benefit_4_title: { en: "Modern Technology Stack", fr: "Stack Technologique Moderne", de: "Moderner Technologie-Stack", es: "Stack Tecnológico Moderno" },
  benefit_4_desc: { en: "Built on cutting-edge tools — Next.js, AI, automation — so your infrastructure scales with your ambition.", fr: "Construit sur des outils de pointe — Next.js, IA, automatisation.", de: "Auf modernsten Tools aufgebaut — Next.js, KI, Automatisierung.", es: "Construido sobre herramientas de vanguardia: Next.js, IA, automatización." },
  benefit_4_stat_label: { en: "Tech Partners", fr: "Partenaires Tech", de: "Tech-Partner", es: "Socios Tecnológicos" },

  /* ---------- Packages ---------- */
  pricing_label: { en: "Pricing", fr: "Tarifs", de: "Preise", es: "Precios" },
  pricing_title_prefix: { en: "Service", fr: "Forfaits de", de: "Service", es: "Paquetes de" },
  pricing_title_highlight: { en: "Packages", fr: "Service", de: "Pakete", es: "Servicios" },
  pricing_subtitle: { en: "Transparent pricing for every stage of growth. Start where you are and scale with confidence.", fr: "Tarification transparente pour chaque étape de croissance.", de: "Transparente Preise für jede Wachstumsphase.", es: "Precios transparentes para cada etapa de crecimiento." },
  most_popular: { en: "Most Popular", fr: "Le Plus Populaire", de: "Am Beliebtesten", es: "Más Popular" },
  package_launch_name: { en: "Launch", fr: "Lancement", de: "Start", es: "Lanzamiento" },
  package_launch_desc: { en: "Perfect for startups needing an MVP and brand foundation.", fr: "Parfait pour les startups ayant besoin d'un MVP et d'une base de marque.", de: "Perfekt für Startups, die ein MVP und ein Markenfundament benötigen.", es: "Perfecto para startups que necesitan un MVP y una base de marca." },
  package_launch_f1: { en: "Identity & Logo Design", fr: "Identité et Logo", de: "Identität & Logo", es: "Identidad y Logo" },
  package_launch_f2: { en: "5-Page Responsive Website", fr: "Site Web Responsive 5 Pages", de: "5-Seiten Responsive Website", es: "Sitio Web Responsivo de 5 Páginas" },
  package_launch_f3: { en: "Basic SEO Setup", fr: "Configuration SEO de Base", de: "Grundlegendes SEO-Setup", es: "Configuración SEO Básica" },
  package_launch_f4: { en: "2 Weeks of Support", fr: "2 Semaines de Support", de: "2 Wochen Support", es: "2 Semanas de Soporte" },
  package_launch_cta: { en: "Get Started", fr: "Commencer", de: "Loslegen", es: "Empezar" },
  package_grow_name: { en: "Grow", fr: "Croissance", de: "Wachstum", es: "Crecimiento" },
  package_grow_desc: { en: "For brands ready to capture market share and scale.", fr: "Pour les marques prêtes à conquérir des parts de marché.", de: "Für Marken, die bereit sind, Marktanteile zu gewinnen.", es: "Para marcas listas para capturar participación de mercado." },
  package_grow_f1: { en: "Full Brand System", fr: "Système de Marque Complet", de: "Vollständiges Markensystem", es: "Sistema de Marca Completo" },
  package_grow_f2: { en: "Custom Web App / E‑commerce", fr: "Application Web / E‑commerce", de: "Individuelle Web-App / E‑Commerce", es: "Aplicación Web / E-commerce" },
  package_grow_f3: { en: "CMS Integration", fr: "Intégration CMS", de: "CMS-Integration", es: "Integración CMS" },
  package_grow_f4: { en: "3 Months Growth Marketing", fr: "3 Mois de Marketing de Croissance", de: "3 Monate Wachstumsmarketing", es: "3 Meses de Marketing de Crecimiento" },
  package_grow_f5: { en: "30 Days Post-Launch Support", fr: "30 Jours de Support Post-Lancement", de: "30 Tage Support nach Launch", es: "30 Días de Soporte Post-Lanzamiento" },
  package_grow_cta: { en: "Get Started", fr: "Commencer", de: "Loslegen", es: "Empezar" },
  package_scale_name: { en: "Scale", fr: "Échelle", de: "Skalierung", es: "Escalar" },
  package_scale_desc: { en: "Enterprise-grade solutions for established companies.", fr: "Solutions de niveau entreprise pour les sociétés établies.", de: "Enterprise-grade Lösungen für etablierte Unternehmen.", es: "Soluciones de nivel empresarial para empresas establecidas." },
  package_scale_f1: { en: "Complex Systems Architecture", fr: "Architecture de Systèmes Complexes", de: "Komplexe Systemarchitektur", es: "Arquitectura de Sistemas Complejos" },
  package_scale_f2: { en: "Dedicated Product Team", fr: "Équipe Produit Dédiée", de: "Dediziertes Produktteam", es: "Equipo de Producto Dedicado" },
  package_scale_f3: { en: "AI & Automation Suite", fr: "Suite IA et Automatisation", de: "KI- & Automatisierungs-Suite", es: "Suite de IA y Automatización" },
  package_scale_f4: { en: "Full Growth Engine Setup", fr: "Configuration Moteur de Croissance Complet", de: "Vollständige Wachstums-Engine", es: "Motor de Crecimiento Completo" },
  package_scale_f5: { en: "24/7 SLA Support", fr: "Support SLA 24/7", de: "24/7 SLA-Support", es: "Soporte SLA 24/7" },
  package_scale_cta: { en: "Contact Sales", fr: "Contacter les Ventes", de: "Vertrieb Kontaktieren", es: "Contactar Ventas" },
  package_custom_name: { en: "Custom", fr: "Personnalisé", de: "Individuell", es: "Personalizado" },
  package_custom_desc: { en: "Tailored solutions for unique challenges and enterprise scale.", fr: "Solutions sur mesure pour des défis uniques et l'échelle de l'entreprise.", de: "Maßgeschneiderte Lösungen für einzigartige Herausforderungen.", es: "Soluciones a medida para desafíos únicos y escala empresarial." },
  package_custom_f1: { en: "Custom Scope & Timeline", fr: "Portée et Calendrier Personnalisés", de: "Individueller Umfang & Zeitplan", es: "Alcance y Cronograma Personalizados" },
  package_custom_f2: { en: "Multi-Discipline Team", fr: "Équipe Pluridisciplinaire", de: "Multidisziplinäres Team", es: "Equipo Multidisciplinario" },
  package_custom_f3: { en: "Unlimited Revisions", fr: "Révisions Illimitées", de: "Unbegrenzte Überarbeitungen", es: "Revisiones Ilimitadas" },
  package_custom_f4: { en: "Dedicated Account Manager", fr: "Gestionnaire de Compte Dédié", de: "Dedizierter Account Manager", es: "Gerente de Cuenta Dedicado" },
  package_custom_f5: { en: "Priority Support", fr: "Support Prioritaire", de: "Prioritäts-Support", es: "Soporte Prioritario" },
  package_custom_cta: { en: "Book a Call", fr: "Réserver un Appel", de: "Anruf Buchen", es: "Reservar una Llamada" },

  /* ---------- Portfolio ---------- */
  portfolio_label: { en: "Portfolio", fr: "Portfolio", de: "Portfolio", es: "Portafolio" },
  portfolio_title_prefix: { en: "Our", fr: "Notre", de: "Unsere", es: "Nuestro" },
  portfolio_title_highlight: { en: "Work", fr: "Travail", de: "Arbeit", es: "Trabajo" },
  portfolio_subtitle: { en: "We craft digital experiences that define industries and elevate brands through precision and creativity.", fr: "Nous créons des expériences numériques qui définissent les industries.", de: "Wir gestalten digitale Erlebnisse, die Branchen definieren.", es: "Creamos experiencias digitales que definen industrias." },
  view_case_study: { en: "View Case Study", fr: "Voir l'Étude de Cas", de: "Fallstudie Ansehen", es: "Ver Caso de Estudio" },
  view_all_projects: { en: "View All Projects", fr: "Voir Tous les Projets", de: "Alle Projekte Ansehen", es: "Ver Todos los Proyectos" },
  cat_all: { en: "All", fr: "Tous", de: "Alle", es: "Todos" },
  cat_brand_design: { en: "Brand Design", fr: "Design de Marque", de: "Marken-Design", es: "Diseño de Marca" },
  cat_web_dev: { en: "Web Development", fr: "Développement Web", de: "Webentwicklung", es: "Desarrollo Web" },
  cat_ai_automation: { en: "AI & Automation", fr: "IA et Automatisation", de: "KI & Automatisierung", es: "IA y Automatización" },
  cat_growth_marketing: { en: "Growth Marketing", fr: "Marketing de Croissance", de: "Wachstumsmarketing", es: "Marketing de Crecimiento" },

  /* ---------- Testimonials ---------- */
  testimonials_label: { en: "Testimonials", fr: "Témoignages", de: "Referenzen", es: "Testimonios" },
  testimonials_title_prefix: { en: "What Our Clients", fr: "Ce que Disent nos", de: "Was Unsere Kunden", es: "Lo que Dicen" },
  testimonials_title_highlight: { en: "Say", fr: "Clients", de: "Sagen", es: "Nuestros Clientes" },
  testimonials_subtitle: { en: "Don't take our word for it — hear from the brands we've helped scale.", fr: "Ne nous croyez pas sur parole — écoutez les marques que nous avons aidées.", de: "Verlassen Sie sich nicht nur auf unser Wort — hören Sie von den Marken.", es: "No te fíes solo de nuestra palabra: escucha a las marcas que hemos ayudado." },
  view_all_testimonials: { en: "View All Testimonials", fr: "Voir Tous les Témoignages", de: "Alle Referenzen Ansehen", es: "Ver Todos los Testimonios" },

  /* ---------- Insights ---------- */
  knowledge_label: { en: "Knowledge", fr: "Savoir", de: "Wissen", es: "Conocimiento" },
  insights_title_prefix: { en: "Insights &", fr: "Idées et", de: "Einblicke &", es: "Perspectivas y" },
  insights_title_highlight: { en: "Expertise", fr: "Expertise", de: "Expertise", es: "Experiencia" },
  insights_subtitle: { en: "Thought leadership and industry perspectives from our team of strategists and engineers.", fr: "Leadership éclairé et perspectives sectorielles de notre équipe.", de: "Thought Leadership und Branchenperspektiven von unserem Team.", es: "Liderazgo intelectual y perspectivas de la industria de nuestro equipo." },
  read_insight: { en: "Read Insight", fr: "Lire l'Idée", de: "Einblick Lesen", es: "Leer Perspectiva" },
  view_all_insights: { en: "View All Insights", fr: "Voir Toutes les Idées", de: "Alle Einblicke Ansehen", es: "Ver Todas las Perspectivas" },

  /* ---------- FAQ ---------- */
  support_label: { en: "Support", fr: "Support", de: "Support", es: "Soporte" },
  faq_title_prefix: { en: "Frequently Asked", fr: "Questions", de: "Häufig Gestellte", es: "Preguntas" },
  faq_title_highlight: { en: "Questions", fr: "Fréquentes", de: "Fragen", es: "Frecuentes" },
  faq_subtitle: { en: "Clear answers to the most common questions we hear from clients.", fr: "Des réponses claires aux questions les plus fréquentes.", de: "Klare Antworten auf die häufigsten Fragen, die wir hören.", es: "Respuestas claras a las preguntas más comunes." },
  still_have_questions: { en: "Still have more", fr: "Vous avez encore plus de", de: "Sie haben noch weitere", es: "¿Aún tienes más" },
  still_have_questions_highlight: { en: "questions?", fr: "questions ?", de: "Fragen?", es: "preguntas?" },
  faq_banner_subtitle: { en: "Chat with our FAQ AI bot — instant answers, 24/7.", fr: "Discutez avec notre bot FAQ IA — réponses instantanées, 24/7.", de: "Chatten Sie mit unserem FAQ-AI-Bot — sofortige Antworten, 24/7.", es: "Chatea con nuestro bot de IA de preguntas frecuentes — respuestas instantáneas, 24/7." },
  contact_our_team: { en: "Contact our team", fr: "Contactez notre équipe", de: "Kontaktieren Sie unser Team", es: "Contacta a nuestro equipo" },

  /* ---------- Contact ---------- */
  contact_heading: { en: "Let's Talk", fr: "Parlons-en", de: "Lass uns Reden", es: "Hablemos" },
  contact_subheading: { en: "Ready to start your project? Fill out the form and we'll get back to you within 24 hours.", fr: "Prêt à démarrer votre projet ? Remplissez le formulaire et nous vous répondrons dans les 24 heures.", de: "Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus.", es: "¿Listo para empezar tu proyecto? Completa el formulario y te responderemos en 24 horas." },
  success_title: { en: "Message Sent!", fr: "Message Envoyé !", de: "Nachricht Gesendet!", es: "¡Mensaje Enviado!" },
  success_message: { en: "Thanks for reaching out. We'll get back to you within 24 hours.", fr: "Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures.", de: "Danke für Ihre Nachricht. Wir melden uns innerhalb von 24 Stunden.", es: "Gracias por contactarnos. Te responderemos en 24 horas." },
  form_name: { en: "Your name *", fr: "Votre nom *", de: "Ihr Name *", es: "Tu nombre *" },
  form_email: { en: "you@company.com *", fr: "vous@entreprise.com *", de: "sie@firma.com *", es: "tu@empresa.com *" },
  form_company: { en: "Company name", fr: "Nom de l'entreprise", de: "Firmenname", es: "Nombre de la empresa" },
  form_message: { en: "Tell us about your project *", fr: "Parlez-nous de votre projet *", de: "Erzählen Sie uns von Ihrem Projekt *", es: "Cuéntanos sobre tu proyecto *" },
  form_select_services: { en: "Select services you're interested in", fr: "Sélectionnez les services qui vous intéressent", de: "Wählen Sie die Dienste aus, die Sie interessieren", es: "Selecciona los servicios que te interesan" },
  form_services_selected: { en: "selected", fr: "sélectionné(s)", de: "ausgewählt", es: "seleccionado(s)" },
  form_project_budget: { en: "Project Budget", fr: "Budget du Projet", de: "Projektbudget", es: "Presupuesto del Proyecto" },
  form_select_range: { en: "Select range", fr: "Sélectionner une plage", de: "Bereich auswählen", es: "Seleccionar rango" },
  form_custom_budget: { en: "Custom budget", fr: "Budget personnalisé", de: "Individuelles Budget", es: "Presupuesto personalizado" },
  form_send_message: { en: "Send Message", fr: "Envoyer le Message", de: "Nachricht Senden", es: "Enviar Mensaje" },
};

/**
 * Resolve a label-key to a string in the current language.
 * Falls back to English, then to the raw key (so unknown keys are
 * still visible instead of producing blank UI).
 */
export function tLabel(key: string, lang: Language): string {
  return labelTranslations[key]?.[lang] || labelTranslations[key]?.en || key;
}
