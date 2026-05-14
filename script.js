/* ============================================
   Alex Fialka — Portfolio interactions + i18n
============================================ */

(() => {
    'use strict';

    /* ============================================
       Translations (ES default, EN, NL)
    ============================================ */
    const I18N = {
        es: {
            'nav.about': 'Sobre mí',
            'nav.services': 'Servicios',
            'nav.experience': 'Experiencia',
            'nav.skills': 'Skills',
            'nav.cta': 'Contactar',
            'nav.contact': 'Contacto',

            'hero.eyebrow': 'Disponible para proyectos de consultoría',
            'hero.title2': 'Optimización de procesos',
            'hero.title3': 'orientada al negocio',
            'hero.mission': 'Alineo los procesos con la realidad operativa para mejorar la eficiencia, el rendimiento organizacional y el crecimiento sostenible.',
            'hero.subtitle': 'Más de <strong>35 años</strong> ayudando a organizaciones internacionales a alcanzar la <em>excelencia operativa</em> a través de la <em>transformación organizacional</em> y la <em>optimización de procesos de negocio</em>. Pragmático, orientado a resultados y con visión de helicóptero.',
            'hero.btnPrimary': 'Reservar una consultoría',
            'hero.btnGhost': 'Ver trayectoria',
            'hero.stats.years': 'años de experiencia',
            'hero.stats.companies': 'empresas optimizadas',
            'hero.stats.positions': 'posiciones de liderazgo',
            'hero.stats.languages': 'idiomas',

            'hc.role': 'Consultor de procesos · Asesor senior',
            'hc.location': 'Almerimar, España',
            'hc.background': 'Holandés · Background internacional',
            'hc.degree': 'Bachelor Business Administration',
            'hc.tagProcess': 'Procesos',
            'hc.tagOpex': 'Excelencia Op.',
            'hc.tagRisk': 'Riesgo',
            'hc.tagChange': 'Gestión del cambio',

            'about.kicker': '01 — Sobre mí',
            'about.title': 'Convierto la complejidad en <span class="grad">procesos claros, integrados y eficientes</span>.',
            'about.lead': 'Soy consultor de optimización de procesos de negocio orientado a resultados, especializado en alinear los procesos con la realidad operativa de cada organización. He liderado equipos multidisciplinares en sectores diversos: industrial, logístico, marítimo, financiero y de servicios.',
            'about.p2': 'Mi misión: <strong>impulsar la excelencia operativa y la eficiencia sostenible</strong> a través de procesos de negocio integrados y de transformaciones organizacionales que cuajan. En la búsqueda de la mejora continua, considero el respeto, los principios y los valores como elementos clave para alcanzar el éxito.',
            'about.competence.0': 'Pragmático & orientado a resultados',
            'about.competence.1': 'Fiable & comunicativo',
            'about.competence.2': 'Flexible & motivado',
            'about.competence.3': 'Organizador con visión global',
            'about.competence.4': 'Analítico & resolutivo',
            'about.competence.5': 'Decisivo y proactivo',
            'about.competence.6': 'Racional & innovador',
            'about.competence.7': 'Enfocado en resultados',
            'about.quote': 'Respeto, principios y valores son elementos clave para alcanzar el éxito en cualquier proceso de mejora continua.',
            'about.quoteAuthor': '— Filosofía profesional',
            'about.langTitle': 'Idiomas',
            'about.lang.dutch': 'Holandés',
            'about.lang.english': 'Inglés',
            'about.lang.french': 'Francés',
            'about.lang.german': 'Alemán',
            'about.level.native': 'Nativo',
            'about.level.fluent': 'Fluido',
            'about.level.competent': 'Competente',

            'services.kicker': '02 — Consultoría',
            'services.title': 'Servicios profesionales <span class="grad">a medida</span> para tu organización.',
            'services.sub': 'Más de tres décadas de experiencia internacional puestas al servicio de tu empresa. Cada proyecto se diseña a medida, con foco en procesos de negocio integrados y resultados medibles.',
            'services.0.title': 'Optimización de procesos de negocio',
            'services.0.desc': 'Diagnóstico y rediseño de procesos para reducir tiempos, costes y desviaciones aplicando Lean, S5 y 8D — orientado a excelencia operativa.',
            'services.0.items.0': 'Value stream mapping',
            'services.0.items.1': 'KPIs & cuadros de mando',
            'services.0.items.2': 'Estandarización de procesos',
            'services.1.title': 'Excelencia operativa & ISO',
            'services.1.desc': 'Diseño e implementación de sistemas de gestión integrados que alinean calidad, seguridad y medio ambiente con los objetivos de negocio (ISO 9001, 14001, 45001).',
            'services.1.items.0': 'Auditorías internas y externas',
            'services.1.items.1': 'Certificación y mejora continua',
            'services.1.items.2': 'Documentación & flowcharting',
            'services.2.title': 'Transformación organizacional',
            'services.2.desc': 'Acompañamiento end-to-end en procesos de cambio: diagnóstico, awareness, formación y consolidación cultural para que la transformación cuaje.',
            'services.2.items.0': 'Workshops & coaching ejecutivo',
            'services.2.items.1': 'Programas de awareness',
            'services.2.items.2': 'Plan de comunicación interna',
            'services.3.title': 'Gestión integrada de riesgos',
            'services.3.desc': 'Identificación y mitigación de riesgos operativos, técnicos y financieros aplicando HAZOP, FMEA, LMRA y RI&E a los procesos de negocio.',
            'services.3.items.0': 'Risk assessments completos',
            'services.3.items.1': 'Optimización de pólizas y costes',
            'services.3.items.2': 'Planes de continuidad',
            'services.4.title': 'Procurement & supply chain',
            'services.4.desc': 'Rediseño de procesos de compras, gestión de contratos y supply chain para liberar eficiencia sostenible desde el primer pedido.',
            'services.4.items.0': 'Estrategia de procurement',
            'services.4.items.1': 'Contract writing & negociación',
            'services.4.items.2': 'Implementación SAP / IFS',
            'services.5.title': 'Project & contract management',
            'services.5.desc': 'Dirección de proyectos y contratos certificada PRINCE2 — entrega de transformación con control presupuestario riguroso.',
            'services.5.items.0': 'PRINCE2 Practitioner',
            'services.5.items.1': 'Control de costes & deliverables',
            'services.5.items.2': 'Stakeholder management',

            'qarp.kicker': 'Metodología propia',
            'qarp.title': 'QARP · Cuatro pilares para optimizar cualquier proceso',
            'qarp.lead': 'QARP es una metodología propia de optimización de procesos de negocio aplicable a cualquier sector. Cuatro pilares que estructuran la transformación organizacional y aseguran resultados medibles y sostenibles.',
            'qarp.q': 'Quality — procesos diseñados para entregar valor consistente.',
            'qarp.a': 'Assurance — controles que protegen el rendimiento en el tiempo.',
            'qarp.r': 'Risk — gestión integrada del riesgo operativo, técnico y financiero.',
            'qarp.p': 'Process — flujos integrados, alineados con la realidad operativa.',

            'exp.kicker': '03 — Trayectoria',
            'exp.title': 'Una carrera optimizando <span class="grad">procesos en cualquier sector</span>.',
            'exp.sub': 'De Maersk Line en los 80 a la dirección QHSE de grupos multinacionales. 35+ años aplicando excelencia operativa, gestión integrada de riesgos y transformación organizacional. El sector cambia; los principios, no.',
            'exp.0.title': 'Group QHSE Manager',
            'exp.0.desc': 'Lideré la integración de procesos en 7 divisiones y casi 60 empresas operativas. Diseñé un sistema de gestión integrado que alineó calidad, riesgo y operaciones en todas las disciplinas del negocio.',
            'exp.0.tag0': '60 empresas', 'exp.0.tag1': '7 divisiones', 'exp.0.tag2': 'Sistema integrado',
            'exp.1.title': 'Risk Manager',
            'exp.1.desc': 'Rediseñé el proceso de gestión de riesgos sobre US$ 490 mln en activos asegurados. La reorganización generó un 20% de ahorro inicial (US$ 1,5 mln) y un modelo de control replicable.',
            'exp.1.tag1': '-20% costes',
            'exp.1.tag2': 'Riesgo',
            'exp.2.title': 'Quality Assurance Manager',
            'exp.2.desc': 'Implementé un sistema de gestión integrado y lideré la introducción de Lean Manufacturing, reduciendo tiempos a lo largo de todo el ciclo productivo.',
            'exp.2.tag1': 'Procesos',
            'exp.3.title': 'Senior Consultant',
            'exp.3.desc': 'Consultoría en procesos de compras, logística y change management. Desarrollé la metodología QARP (Quality, Assurance, Risk, Process): cuatro pilares para optimizar procesos de negocio en cualquier sector.',
            'exp.3.tag2': 'Procesos',
            'exp.4.title': 'Purchase & Fleet Logistics Manager',
            'exp.4.desc': 'Rediseñé el proceso de procurement (US$ 120 mln/año), supply chain y operaciones de agencia (700 proveedores / 300 agentes portuarios), generando un 20% de ahorro en costes.',
            'exp.4.tag0': 'US$ 120M/año', 'exp.4.tag1': '700 proveedores',
            'exp.5.title': 'Insurance & Claims Manager',
            'exp.5.desc': 'Rediseñé el proceso de gestión de riesgos sobre una cartera de US$ 300 mln asegurados, generando un 64% de ahorro (US$ 1,3 mln) y un sistema de monitorización financiera de grandes reparaciones.',
            'exp.5.tag0': '-64% prima',
            'exp.6.title': 'Operations Manager',
            'exp.6.desc': 'Optimicé las operaciones y los procesos de mantenimiento de dos buques contenedores: +15% ingresos y -30% gastos operativos y de mantenimiento.',
            'exp.6.tag0': '+15% ingresos', 'exp.6.tag1': '-30% costes',
            'exp.7.title': 'Financial Manager',
            'exp.7.desc': 'Rediseñé los procesos financieros, de TI, aduanas y documentación. Reestructuración interna y mejora del rendimiento de varios departamentos.',
            'exp.7.tag0': 'Finanzas',
            'exp.7.tag2': 'Procesos',
            'exp.8.title': 'Manager Finance (multiple disciplines)',
            'exp.8.desc': 'Posiciones directivas en Europa, Oriente Medio y Lejano Oriente. Project manager del grupo internacional de auditoría: credit & risk, eficiencia operativa, formación y procesos antifraude.',
            'exp.8.tag0': 'Internacional',

            'skills.kicker': '04 — Competencias',
            'skills.title': 'Skills, certificaciones y <span class="grad">áreas de expertise</span>.',
            'skills.0': 'Excelencia operativa & ISO',
            'skills.1': 'Gestión de riesgos',
            'skills.2': 'Procesos & Auditoría',
            'skills.3': 'Project & Procurement',
            'skills.4': 'Finance & ICT',
            'skills.5': 'Membresías & Logros',
            'skills.qarpBadge': 'Creador del método QARP · Quality · Assurance · Risk · Process',

            'contact.kicker': '05 — Contacto',
            'contact.title': '¿Quieres alinear tus procesos con la <span class="grad">realidad operativa</span>?',
            'contact.p': 'Cuéntame brevemente tu reto y te respondo en menos de 48 horas. Estoy disponible para proyectos a corto plazo, asesorías recurrentes o intervenciones puntuales en optimización de procesos de negocio, excelencia operativa, gestión de riesgos o transformación organizacional.',
            'contact.info.email': 'Email',
            'contact.info.phone': 'Teléfono',
            'contact.info.location': 'Ubicación',
            'contact.info.locationVal': 'Almerimar, España',

            'form.name': 'Nombre completo',
            'form.namePh': 'Tu nombre',
            'form.email': 'Email',
            'form.emailPh': 'tucorreo@empresa.com',
            'form.company': 'Empresa',
            'form.companyPh': 'Empresa (opcional)',
            'form.topic': 'Tipo de consultoría',
            'form.topic.0': 'Optimización de procesos de negocio',
            'form.topic.1': 'Excelencia operativa & ISO',
            'form.topic.2': 'Transformación organizacional',
            'form.topic.3': 'Gestión integrada de riesgos',
            'form.topic.4': 'Procurement & supply chain',
            'form.topic.5': 'Project & contract management',
            'form.topic.6': 'Otro',
            'form.message': 'Mensaje',
            'form.messagePh': 'Cuéntame en pocas líneas tu situación o reto...',
            'form.send': 'Enviar mensaje',
            'form.consent': 'He leído y acepto la <a href="privacidad.html" target="_blank" rel="noopener">Política de Privacidad</a>.',
            'form.errRequired': 'Por favor completa los campos obligatorios.',
            'form.errEmail': 'Introduce un email válido.',
            'form.errConsent': 'Debes aceptar la Política de Privacidad para enviar el mensaje.',
            'form.success': '¡Gracias! Se abrirá tu cliente de email para enviar el mensaje.',
            'form.mailSubject': 'Consulta web',
            'form.mailNombre': 'Nombre', 'form.mailEmail': 'Email', 'form.mailEmpresa': 'Empresa',
            'form.mailTopic': 'Tipo de consultoría', 'form.mailMessage': 'Mensaje',

            'footer.about': 'Consultor senior de optimización de procesos de negocio. 35+ años alineando procesos con la realidad operativa para impulsar excelencia operativa, transformación organizacional y eficiencia sostenible.',
            'footer.qarpKicker': 'Metodología propia',
            'footer.nav': 'Navegación',
            'footer.services': 'Servicios',
            'footer.contact': 'Contacto',
            'footer.s0': 'Optimización de procesos de negocio',
            'footer.s1': 'Excelencia operativa & ISO',
            'footer.s2': 'Transformación organizacional',
            'footer.s3': 'Gestión integrada de riesgos',
            'footer.s4': 'Procurement & project mgmt',
            'footer.copyright': '© __YEAR__ Alex Fialka — Todos los derechos reservados.',
            'footer.craft': 'Diseñado con ♡ · Business Process Consultancy',
            'footer.legal': 'Aviso Legal',
            'footer.privacy': 'Privacidad',
            'footer.cookies': 'Cookies',

            'cookie.text': 'Esta web utiliza almacenamiento técnico necesario para recordar tu idioma. No usamos cookies de análisis ni publicidad. Al continuar navegando aceptas nuestra <a href="cookies.html">política de cookies</a>.',
            'cookie.accept': 'Aceptar',

            'docTitle': 'Alex Fialka · Consultoría de Optimización de Procesos de Negocio'
        },

        en: {
            'nav.about': 'About',
            'nav.services': 'Services',
            'nav.experience': 'Experience',
            'nav.skills': 'Skills',
            'nav.cta': 'Get in touch',
            'nav.contact': 'Contact',

            'hero.eyebrow': 'Available for consulting projects',
            'hero.title2': 'Business-driven',
            'hero.title3': 'process optimisation',
            'hero.mission': 'Aligning processes with operational reality to improve efficiency, organisational performance and sustainable growth.',
            'hero.subtitle': 'Over <strong>35 years</strong> helping international organisations achieve <em>operational excellence</em> through <em>organisational transformation</em> and <em>business process optimisation</em>. Pragmatic, results-driven and with a helicopter view.',
            'hero.btnPrimary': 'Book a consultation',
            'hero.btnGhost': 'See career path',
            'hero.stats.years': 'years of experience',
            'hero.stats.companies': 'companies optimised',
            'hero.stats.positions': 'leadership roles',
            'hero.stats.languages': 'languages',

            'hc.role': 'Business Process Consultant · Senior Advisor',
            'hc.location': 'Almerimar, Spain',
            'hc.background': 'Dutch · International background',
            'hc.degree': 'Bachelor Business Administration',
            'hc.tagProcess': 'Process',
            'hc.tagOpex': 'Op. Excellence',
            'hc.tagRisk': 'Risk',
            'hc.tagChange': 'Change Mgmt',

            'about.kicker': '01 — About me',
            'about.title': 'I turn complexity into <span class="grad">clear, integrated, efficient processes</span>.',
            'about.lead': 'I am a results-driven business process optimisation consultant, specialising in aligning processes with the operational reality of each organisation. I have led multidisciplinary teams across diverse sectors: industrial, logistics, maritime, financial and services.',
            'about.p2': 'My mission: <strong>driving operational excellence and sustainable efficiency</strong> through integrated business processes and organisational transformations that actually stick. In the pursuit of continuous improvement, I see respect, principles and values as the keys to success.',
            'about.competence.0': 'Pragmatic & results-driven',
            'about.competence.1': 'Reliable & communicative',
            'about.competence.2': 'Flexible & motivated',
            'about.competence.3': 'Organiser with global vision',
            'about.competence.4': 'Analytical & problem-solver',
            'about.competence.5': 'Decisive and proactive',
            'about.competence.6': 'Rational & innovative',
            'about.competence.7': 'Results-focused',
            'about.quote': 'Respect, principles and values are the keys to success in any continuous improvement journey.',
            'about.quoteAuthor': '— Professional philosophy',
            'about.langTitle': 'Languages',
            'about.lang.dutch': 'Dutch',
            'about.lang.english': 'English',
            'about.lang.french': 'French',
            'about.lang.german': 'German',
            'about.level.native': 'Native',
            'about.level.fluent': 'Fluent',
            'about.level.competent': 'Competent',

            'services.kicker': '02 — Consulting',
            'services.title': 'Tailored <span class="grad">professional services</span> for your organisation.',
            'services.sub': 'More than three decades of international experience at the service of your company. Every project is tailored, with a focus on integrated business processes and measurable results.',
            'services.0.title': 'Business process optimisation',
            'services.0.desc': 'Process diagnosis and redesign to reduce time, cost and deviations applying Lean, S5 and 8D — geared towards operational excellence.',
            'services.0.items.0': 'Value stream mapping',
            'services.0.items.1': 'KPIs & dashboards',
            'services.0.items.2': 'Process standardisation',
            'services.1.title': 'Operational excellence & ISO',
            'services.1.desc': 'Design and implementation of integrated management systems that align quality, safety and environment with business objectives (ISO 9001, 14001, 45001).',
            'services.1.items.0': 'Internal and external audits',
            'services.1.items.1': 'Certification & continuous improvement',
            'services.1.items.2': 'Documentation & flowcharting',
            'services.2.title': 'Organisational transformation',
            'services.2.desc': 'End-to-end support through change: diagnosis, awareness, training and cultural consolidation so the transformation actually sticks.',
            'services.2.items.0': 'Workshops & executive coaching',
            'services.2.items.1': 'Awareness programmes',
            'services.2.items.2': 'Internal communication plan',
            'services.3.title': 'Integrated risk management',
            'services.3.desc': 'Identification and mitigation of operational, technical and financial risks applying HAZOP, FMEA, LMRA and RI&E to business processes.',
            'services.3.items.0': 'Complete risk assessments',
            'services.3.items.1': 'Policy and cost optimisation',
            'services.3.items.2': 'Business continuity plans',
            'services.4.title': 'Procurement & supply chain',
            'services.4.desc': 'Process redesign for purchasing, contract management and supply chain to unlock sustainable efficiency from the first order.',
            'services.4.items.0': 'Procurement strategy',
            'services.4.items.1': 'Contract writing & negotiation',
            'services.4.items.2': 'SAP / IFS implementation',
            'services.5.title': 'Project & contract management',
            'services.5.desc': 'PRINCE2-certified project and contract leadership — delivering transformation under tight budget control.',
            'services.5.items.0': 'PRINCE2 Practitioner',
            'services.5.items.1': 'Cost control & deliverables',
            'services.5.items.2': 'Stakeholder management',

            'qarp.kicker': 'Proprietary methodology',
            'qarp.title': 'QARP · Four pillars to optimise any process',
            'qarp.lead': 'QARP is a proprietary business process optimisation methodology that applies to any sector. Four pillars that structure organisational transformation and deliver measurable, sustainable results.',
            'qarp.q': 'Quality — processes designed to deliver consistent value.',
            'qarp.a': 'Assurance — controls that protect performance over time.',
            'qarp.r': 'Risk — integrated management of operational, technical and financial risk.',
            'qarp.p': 'Process — integrated workflows aligned with operational reality.',

            'exp.kicker': '03 — Career',
            'exp.title': 'A career optimising <span class="grad">processes across any sector</span>.',
            'exp.sub': 'From Maersk Line in the 80s to QHSE leadership in multinational groups. 35+ years applying operational excellence, integrated risk management and organisational transformation. The sector changes; the principles do not.',
            'exp.0.title': 'Group QHSE Manager',
            'exp.0.desc': 'Led process integration across 7 divisions and nearly 60 operating companies. Designed an integrated management system that aligned quality, risk and operations across every business discipline.',
            'exp.0.tag0': '60 companies', 'exp.0.tag1': '7 divisions', 'exp.0.tag2': 'Integrated system',
            'exp.1.title': 'Risk Manager',
            'exp.1.desc': 'Redesigned the risk management process across US$ 490M in insured assets. The restructuring delivered a 20% initial saving (US$ 1.5M) and a replicable control model.',
            'exp.1.tag1': '-20% costs',
            'exp.1.tag2': 'Risk',
            'exp.2.title': 'Quality Assurance Manager',
            'exp.2.desc': 'Implemented an integrated management system and led the introduction of Lean Manufacturing, reducing lead times across the full production cycle.',
            'exp.2.tag1': 'Process',
            'exp.3.title': 'Senior Consultant',
            'exp.3.desc': 'Consulting in procurement, logistics and change management processes. Developed the QARP methodology (Quality, Assurance, Risk, Process): four pillars to optimise business processes in any sector.',
            'exp.3.tag2': 'Process',
            'exp.4.title': 'Purchase & Fleet Logistics Manager',
            'exp.4.desc': 'Redesigned the procurement process (US$ 120M/year), supply chain and agency operations (700 suppliers / 300 port agents), generating a 20% cost saving.',
            'exp.4.tag0': 'US$ 120M/year', 'exp.4.tag1': '700 suppliers',
            'exp.5.title': 'Insurance & Claims Manager',
            'exp.5.desc': 'Redesigned the risk management process across a US$ 300M insured portfolio, generating a 64% saving (US$ 1.3M) and a financial monitoring system for major repairs.',
            'exp.5.tag0': '-64% premium',
            'exp.6.title': 'Operations Manager',
            'exp.6.desc': 'Optimised the operations and maintenance processes of two container vessels: +15% revenue and -30% operating & maintenance costs.',
            'exp.6.tag0': '+15% revenue', 'exp.6.tag1': '-30% costs',
            'exp.7.title': 'Financial Manager',
            'exp.7.desc': 'Redesigned finance, IT, customs and documentation processes. Internal restructuring and departmental performance improvement.',
            'exp.7.tag0': 'Finance',
            'exp.7.tag2': 'Process',
            'exp.8.title': 'Manager Finance (multiple disciplines)',
            'exp.8.desc': 'Managerial roles in Europe, the Middle East and the Far East. Project manager within the international audit group: credit & risk, operational efficiency, training and anti-fraud processes.',
            'exp.8.tag0': 'International',

            'skills.kicker': '04 — Competences',
            'skills.title': 'Skills, certifications and <span class="grad">areas of expertise</span>.',
            'skills.0': 'Operational excellence & ISO',
            'skills.1': 'Risk management',
            'skills.2': 'Processes & Audit',
            'skills.3': 'Project & Procurement',
            'skills.4': 'Finance & ICT',
            'skills.5': 'Memberships & Achievements',
            'skills.qarpBadge': 'Creator of the QARP method · Quality · Assurance · Risk · Process',

            'contact.kicker': '05 — Contact',
            'contact.title': 'Want to align your processes with <span class="grad">operational reality</span>?',
            'contact.p': 'Tell me briefly about your challenge and I will reply within 48 hours. Available for short-term projects, ongoing advisory or one-off interventions in business process optimisation, operational excellence, risk management or organisational transformation.',
            'contact.info.email': 'Email',
            'contact.info.phone': 'Phone',
            'contact.info.location': 'Location',
            'contact.info.locationVal': 'Almerimar, Spain',

            'form.name': 'Full name',
            'form.namePh': 'Your name',
            'form.email': 'Email',
            'form.emailPh': 'you@company.com',
            'form.company': 'Company',
            'form.companyPh': 'Company (optional)',
            'form.topic': 'Type of consultancy',
            'form.topic.0': 'Business process optimisation',
            'form.topic.1': 'Operational excellence & ISO',
            'form.topic.2': 'Organisational transformation',
            'form.topic.3': 'Integrated risk management',
            'form.topic.4': 'Procurement & supply chain',
            'form.topic.5': 'Project & contract management',
            'form.topic.6': 'Other',
            'form.message': 'Message',
            'form.messagePh': 'Tell me in a few lines about your situation or challenge...',
            'form.send': 'Send message',
            'form.consent': 'I have read and accept the <a href="privacidad.html" target="_blank" rel="noopener">Privacy Policy</a>.',
            'form.errRequired': 'Please fill in the required fields.',
            'form.errEmail': 'Please enter a valid email.',
            'form.errConsent': 'You must accept the Privacy Policy to send the message.',
            'form.success': 'Thank you! Your email client will open to send the message.',
            'form.mailSubject': 'Website enquiry',
            'form.mailNombre': 'Name', 'form.mailEmail': 'Email', 'form.mailEmpresa': 'Company',
            'form.mailTopic': 'Type of consultancy', 'form.mailMessage': 'Message',

            'footer.about': 'Senior business process optimisation consultant. 35+ years aligning processes with operational reality to drive operational excellence, organisational transformation and sustainable efficiency.',
            'footer.qarpKicker': 'Proprietary methodology',
            'footer.nav': 'Navigation',
            'footer.services': 'Services',
            'footer.contact': 'Contact',
            'footer.s0': 'Business process optimisation',
            'footer.s1': 'Operational excellence & ISO',
            'footer.s2': 'Organisational transformation',
            'footer.s3': 'Integrated risk management',
            'footer.s4': 'Procurement & project mgmt',
            'footer.copyright': '© __YEAR__ Alex Fialka — All rights reserved.',
            'footer.craft': 'Designed with ♡ · Business Process Consultancy',
            'footer.legal': 'Legal Notice',
            'footer.privacy': 'Privacy',
            'footer.cookies': 'Cookies',

            'cookie.text': 'This site uses technical storage strictly necessary to remember your language preference. We do not use analytics or advertising cookies. By continuing to browse you accept our <a href="cookies.html">cookie policy</a>.',
            'cookie.accept': 'Accept',

            'docTitle': 'Alex Fialka · Business Process Optimisation Consultancy'
        },

        nl: {
            'nav.about': 'Over mij',
            'nav.services': 'Diensten',
            'nav.experience': 'Ervaring',
            'nav.skills': 'Skills',
            'nav.cta': 'Contact',
            'nav.contact': 'Contact',

            'hero.eyebrow': 'Beschikbaar voor consultancyprojecten',
            'hero.title2': 'Bedrijfsgerichte',
            'hero.title3': 'procesoptimalisatie',
            'hero.mission': 'Ik breng processen in lijn met de operationele realiteit om efficiëntie, organisatorische prestaties en duurzame groei te verbeteren.',
            'hero.subtitle': 'Ruim <strong>35 jaar</strong> ervaring in het helpen van internationale organisaties bij het bereiken van <em>operationele uitmuntendheid</em> via <em>organisatorische transformatie</em> en <em>bedrijfsprocesoptimalisatie</em>. Pragmatisch, resultaatgericht en met helikopterview.',
            'hero.btnPrimary': 'Plan een consult',
            'hero.btnGhost': 'Bekijk loopbaan',
            'hero.stats.years': 'jaar ervaring',
            'hero.stats.companies': 'geoptimaliseerde bedrijven',
            'hero.stats.positions': 'leiderschapsrollen',
            'hero.stats.languages': 'talen',

            'hc.role': 'Bedrijfsprocesconsultant · Senior adviseur',
            'hc.location': 'Almerimar, Spanje',
            'hc.background': 'Nederlands · Internationale achtergrond',
            'hc.degree': 'Bachelor Bedrijfskunde',
            'hc.tagProcess': 'Processen',
            'hc.tagOpex': 'Op. uitmuntendheid',
            'hc.tagRisk': 'Risico',
            'hc.tagChange': 'Verandermgmt',

            'about.kicker': '01 — Over mij',
            'about.title': 'Ik vertaal complexiteit naar <span class="grad">heldere, geïntegreerde en efficiënte processen</span>.',
            'about.lead': 'Ik ben een resultaatgerichte consultant in bedrijfsprocesoptimalisatie, gespecialiseerd in het afstemmen van processen op de operationele realiteit van elke organisatie. Ik heb multidisciplinaire teams geleid in uiteenlopende sectoren: industrie, logistiek, maritiem, financieel en dienstverlening.',
            'about.p2': 'Mijn missie: <strong>operationele uitmuntendheid en duurzame efficiëntie stimuleren</strong> via geïntegreerde bedrijfsprocessen en organisatorische transformaties die echt beklijven. In het streven naar continue verbetering beschouw ik respect, principes en waarden als sleutelelementen voor succes.',
            'about.competence.0': 'Pragmatisch & resultaatgericht',
            'about.competence.1': 'Betrouwbaar & communicatief',
            'about.competence.2': 'Flexibel & gemotiveerd',
            'about.competence.3': 'Organisator met globale visie',
            'about.competence.4': 'Analytisch & oplossingsgericht',
            'about.competence.5': 'Besluitvaardig en proactief',
            'about.competence.6': 'Rationeel & innovatief',
            'about.competence.7': 'Resultaatgericht',
            'about.quote': 'Respect, principes en waarden zijn sleutelelementen om succes te bereiken in elk continu verbeteringstraject.',
            'about.quoteAuthor': '— Professionele filosofie',
            'about.langTitle': 'Talen',
            'about.lang.dutch': 'Nederlands',
            'about.lang.english': 'Engels',
            'about.lang.french': 'Frans',
            'about.lang.german': 'Duits',
            'about.level.native': 'Moedertaal',
            'about.level.fluent': 'Vloeiend',
            'about.level.competent': 'Competent',

            'services.kicker': '02 — Consultancy',
            'services.title': 'Professionele diensten <span class="grad">op maat</span> voor uw organisatie.',
            'services.sub': 'Meer dan drie decennia internationale ervaring ten dienste van uw bedrijf. Elk project wordt op maat ontworpen, met focus op geïntegreerde bedrijfsprocessen en meetbare resultaten.',
            'services.0.title': 'Bedrijfsprocesoptimalisatie',
            'services.0.desc': 'Diagnose en herontwerp van processen om doorlooptijden, kosten en afwijkingen te verminderen met Lean, S5 en 8D — gericht op operationele uitmuntendheid.',
            'services.0.items.0': 'Value stream mapping',
            'services.0.items.1': 'KPI\'s & dashboards',
            'services.0.items.2': 'Procesharmonisatie',
            'services.1.title': 'Operationele uitmuntendheid & ISO',
            'services.1.desc': 'Ontwerp en implementatie van geïntegreerde managementsystemen die kwaliteit, veiligheid en milieu afstemmen op de bedrijfsdoelen (ISO 9001, 14001, 45001).',
            'services.1.items.0': 'Interne en externe audits',
            'services.1.items.1': 'Certificering & continue verbetering',
            'services.1.items.2': 'Documentatie & flowcharting',
            'services.2.title': 'Organisatorische transformatie',
            'services.2.desc': 'End-to-end begeleiding bij verandering: diagnose, awareness, training en culturele consolidatie, zodat de transformatie écht beklijft.',
            'services.2.items.0': 'Workshops & executive coaching',
            'services.2.items.1': 'Awareness-programma\'s',
            'services.2.items.2': 'Intern communicatieplan',
            'services.3.title': 'Geïntegreerd risicomanagement',
            'services.3.desc': 'Identificatie en mitigatie van operationele, technische en financiële risico\'s door HAZOP, FMEA, LMRA en RI&E toe te passen op bedrijfsprocessen.',
            'services.3.items.0': 'Volledige risico-assessments',
            'services.3.items.1': 'Optimalisatie van polissen en kosten',
            'services.3.items.2': 'Continuïteitsplannen',
            'services.4.title': 'Inkoop & supply chain',
            'services.4.desc': 'Herontwerp van inkoopprocessen, contractmanagement en supply chain om duurzame efficiëntie te ontsluiten vanaf de eerste bestelling.',
            'services.4.items.0': 'Procurement-strategie',
            'services.4.items.1': 'Contract writing & onderhandeling',
            'services.4.items.2': 'SAP / IFS implementatie',
            'services.5.title': 'Project- & contractmanagement',
            'services.5.desc': 'PRINCE2-gecertificeerde project- en contractleiding — transformatie leveren met strakke budgetbewaking.',
            'services.5.items.0': 'PRINCE2 Practitioner',
            'services.5.items.1': 'Kostenbeheersing & deliverables',
            'services.5.items.2': 'Stakeholdermanagement',

            'qarp.kicker': 'Eigen methodologie',
            'qarp.title': 'QARP · Vier pijlers om elk proces te optimaliseren',
            'qarp.lead': 'QARP is een eigen methodologie voor bedrijfsprocesoptimalisatie die toepasbaar is in elke sector. Vier pijlers die organisatorische transformatie structureren en zorgen voor meetbare en duurzame resultaten.',
            'qarp.q': 'Quality — processen die consistent waarde leveren.',
            'qarp.a': 'Assurance — controles die de prestaties in de tijd beschermen.',
            'qarp.r': 'Risk — geïntegreerd beheer van operationeel, technisch en financieel risico.',
            'qarp.p': 'Process — geïntegreerde workflows die aansluiten op de operationele realiteit.',

            'exp.kicker': '03 — Loopbaan',
            'exp.title': 'Een carrière van <span class="grad">procesoptimalisatie in elke sector</span>.',
            'exp.sub': 'Van Maersk Line in de jaren 80 tot QHSE-leiderschap binnen multinationale groepen. 35+ jaar operationele uitmuntendheid, geïntegreerd risicomanagement en organisatorische transformatie. De sector verandert; de principes niet.',
            'exp.0.title': 'Group QHSE Manager',
            'exp.0.desc': 'Leidde de procesintegratie binnen 7 divisies en bijna 60 operationele bedrijven. Ontwierp een geïntegreerd managementsysteem dat kwaliteit, risico en operations afstemde over alle bedrijfsdisciplines.',
            'exp.0.tag0': '60 bedrijven', 'exp.0.tag1': '7 divisies', 'exp.0.tag2': 'Geïntegreerd systeem',
            'exp.1.title': 'Risk Manager',
            'exp.1.desc': 'Herontwierp het risicomanagementproces over US$ 490 mln aan verzekerde activa. De reorganisatie leverde een initiële besparing van 20% op (US$ 1,5 mln) en een herhaalbaar controlemodel.',
            'exp.1.tag1': '-20% kosten',
            'exp.1.tag2': 'Risico',
            'exp.2.title': 'Quality Assurance Manager',
            'exp.2.desc': 'Implementeerde een geïntegreerd managementsysteem en leidde de invoering van Lean Manufacturing, met kortere doorlooptijden in de hele productiecyclus.',
            'exp.2.tag1': 'Processen',
            'exp.3.title': 'Senior Consultant',
            'exp.3.desc': 'Consultancy in inkoop-, logistieke en change-managementprocessen. Ontwikkeling van de QARP-methodologie (Quality, Assurance, Risk, Process): vier pijlers om bedrijfsprocessen in elke sector te optimaliseren.',
            'exp.3.tag2': 'Processen',
            'exp.4.title': 'Purchase & Fleet Logistics Manager',
            'exp.4.desc': 'Herontwierp het inkoopproces (US$ 120 mln/jaar), de supply chain en de agency-operaties (700 leveranciers / 300 havenagenten), met 20% kostenbesparing als resultaat.',
            'exp.4.tag0': 'US$ 120M/jaar', 'exp.4.tag1': '700 leveranciers',
            'exp.5.title': 'Insurance & Claims Manager',
            'exp.5.desc': 'Herontwierp het risicomanagementproces over een portefeuille van US$ 300 mln aan verzekerde waarde, met 64% besparing (US$ 1,3 mln) en een financieel monitoringsysteem voor grote reparaties.',
            'exp.5.tag0': '-64% premie',
            'exp.6.title': 'Operations Manager',
            'exp.6.desc': 'Optimaliseerde de operations en onderhoudsprocessen van twee containerschepen: +15% omzet en -30% operationele en onderhoudskosten.',
            'exp.6.tag0': '+15% omzet', 'exp.6.tag1': '-30% kosten',
            'exp.7.title': 'Financial Manager',
            'exp.7.desc': 'Herontwierp de financiële, IT-, douane- en documentatieprocessen. Interne herstructurering en verbetering van afdelingsprestaties.',
            'exp.7.tag0': 'Finance',
            'exp.7.tag2': 'Processen',
            'exp.8.title': 'Manager Finance (meerdere disciplines)',
            'exp.8.desc': 'Leidinggevende functies in Europa, het Midden-Oosten en het Verre Oosten. Projectmanager binnen de internationale auditgroep: credit & risk, operationele efficiëntie, training en anti-fraudeprocessen.',
            'exp.8.tag0': 'Internationaal',

            'skills.kicker': '04 — Competenties',
            'skills.title': 'Skills, certificeringen en <span class="grad">expertisegebieden</span>.',
            'skills.0': 'Operationele uitmuntendheid & ISO',
            'skills.1': 'Risicomanagement',
            'skills.2': 'Processen & Audit',
            'skills.3': 'Project & Procurement',
            'skills.4': 'Finance & ICT',
            'skills.5': 'Lidmaatschappen & Prestaties',
            'skills.qarpBadge': 'Maker van de QARP-methode · Quality · Assurance · Risk · Process',

            'contact.kicker': '05 — Contact',
            'contact.title': 'Wilt u uw processen afstemmen op de <span class="grad">operationele realiteit</span>?',
            'contact.p': 'Vertel kort over uw uitdaging en ik reageer binnen 48 uur. Beschikbaar voor kortlopende projecten, doorlopend advies of eenmalige interventies in bedrijfsprocesoptimalisatie, operationele uitmuntendheid, risicomanagement of organisatorische transformatie.',
            'contact.info.email': 'E-mail',
            'contact.info.phone': 'Telefoon',
            'contact.info.location': 'Locatie',
            'contact.info.locationVal': 'Almerimar, Spanje',

            'form.name': 'Volledige naam',
            'form.namePh': 'Uw naam',
            'form.email': 'E-mail',
            'form.emailPh': 'u@bedrijf.com',
            'form.company': 'Bedrijf',
            'form.companyPh': 'Bedrijf (optioneel)',
            'form.topic': 'Type consultancy',
            'form.topic.0': 'Bedrijfsprocesoptimalisatie',
            'form.topic.1': 'Operationele uitmuntendheid & ISO',
            'form.topic.2': 'Organisatorische transformatie',
            'form.topic.3': 'Geïntegreerd risicomanagement',
            'form.topic.4': 'Inkoop & supply chain',
            'form.topic.5': 'Project- & contractmanagement',
            'form.topic.6': 'Anders',
            'form.message': 'Bericht',
            'form.messagePh': 'Vertel in een paar regels over uw situatie of uitdaging...',
            'form.send': 'Bericht versturen',
            'form.consent': 'Ik heb het <a href="privacidad.html" target="_blank" rel="noopener">privacybeleid</a> gelezen en accepteer het.',
            'form.errRequired': 'Vul a.u.b. de verplichte velden in.',
            'form.errEmail': 'Voer een geldig e-mailadres in.',
            'form.errConsent': 'U moet het privacybeleid accepteren om het bericht te kunnen versturen.',
            'form.success': 'Bedankt! Uw e-mailclient wordt geopend om het bericht te versturen.',
            'form.mailSubject': 'Aanvraag via website',
            'form.mailNombre': 'Naam', 'form.mailEmail': 'E-mail', 'form.mailEmpresa': 'Bedrijf',
            'form.mailTopic': 'Type consultancy', 'form.mailMessage': 'Bericht',

            'footer.about': 'Senior consultant bedrijfsprocesoptimalisatie. 35+ jaar processen afstemmen op de operationele realiteit voor operationele uitmuntendheid, organisatorische transformatie en duurzame efficiëntie.',
            'footer.qarpKicker': 'Eigen methodologie',
            'footer.nav': 'Navigatie',
            'footer.services': 'Diensten',
            'footer.contact': 'Contact',
            'footer.s0': 'Bedrijfsprocesoptimalisatie',
            'footer.s1': 'Operationele uitmuntendheid & ISO',
            'footer.s2': 'Organisatorische transformatie',
            'footer.s3': 'Geïntegreerd risicomanagement',
            'footer.s4': 'Procurement & project mgmt',
            'footer.copyright': '© __YEAR__ Alex Fialka — Alle rechten voorbehouden.',
            'footer.craft': 'Ontworpen met ♡ · Business Process Consultancy',
            'footer.legal': 'Juridische kennisgeving',
            'footer.privacy': 'Privacy',
            'footer.cookies': 'Cookies',

            'cookie.text': 'Deze website gebruikt technische opslag die strikt noodzakelijk is om uw taalvoorkeur te onthouden. Wij gebruiken geen analyse- of advertentiecookies. Door verder te bladeren accepteert u ons <a href="cookies.html">cookiebeleid</a>.',
            'cookie.accept': 'Accepteren',

            'docTitle': 'Alex Fialka · Bedrijfsprocesoptimalisatie Consultancy'
        }
    };

    const SUPPORTED = ['es', 'en', 'nl'];
    const LANG_KEY = 'af_lang';
    const COOKIE_KEY = 'af_cookie_consent';

    const safeStorage = {
        get(key) { try { return localStorage.getItem(key); } catch { return null; } },
        set(key, val) { try { localStorage.setItem(key, val); } catch {} }
    };

    const getInitialLang = () => {
        const stored = safeStorage.get(LANG_KEY);
        if (stored && SUPPORTED.includes(stored)) return stored;
        const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
        return SUPPORTED.includes(nav) ? nav : 'es';
    };

    let currentLang = getInitialLang();

    const applyLang = (lang) => {
        if (!SUPPORTED.includes(lang)) lang = 'es';
        currentLang = lang;
        const dict = I18N[lang];
        document.documentElement.lang = lang;
        safeStorage.set(LANG_KEY, lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] != null) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (dict[key] != null) el.innerHTML = dict[key];
        });

        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
        });

        if (dict['docTitle']) document.title = dict['docTitle'];

        const year = new Date().getFullYear();
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = year;
        document.querySelectorAll('[data-i18n="footer.copyright"]').forEach(el => {
            el.textContent = (dict['footer.copyright'] || '').replace('__YEAR__', year);
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
            btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
        });
    };

    /* ============================================
       UI behaviour (all safely null-guarded)
    ============================================ */

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Navbar scroll state ---------- */
    const navbar = document.getElementById('navbar');
    const backTop = document.getElementById('backTop');
    const progress = document.getElementById('scrollProgress');

    if (navbar || backTop || progress) {
        const onScroll = () => {
            const y = window.scrollY;
            if (navbar) navbar.classList.toggle('scrolled', y > 24);
            if (backTop) backTop.classList.toggle('show', y > 600);
            if (progress) {
                const docH = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docH > 0 ? Math.min(100, (y / docH) * 100) : 0;
                progress.style.width = pct + '%';
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Mobile menu ---------- */
    const burger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                burger.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Language switcher ---------- */
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang && lang !== currentLang) applyLang(lang);
        });
    });

    applyLang(currentLang);

    /* ---------- Smooth scroll (offset for navbar) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ---------- Cursor glow (desktop) ---------- */
    const cursor = document.getElementById('cursorGlow');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        let tx = 0, ty = 0, cx = 0, cy = 0;
        let raf = null;

        const animate = () => {
            cx += (tx - cx) * 0.15;
            cy += (ty - cy) * 0.15;
            cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', e => {
            tx = e.clientX;
            ty = e.clientY;
            if (!raf) animate();
        });

        document.querySelectorAll('a, button, .service, .t-card, .skill-block, .stat, .chips span, .hc-tags span')
            .forEach(el => {
                el.addEventListener('mouseenter', () => cursor.style.opacity = '0.5');
                el.addEventListener('mouseleave', () => cursor.style.opacity = '1');
            });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    /* ---------- Reveal on scroll ---------- */
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .t-item, .lang').forEach(el => revealObserver.observe(el));

        /* ---------- Counters in hero ---------- */
        const counters = document.querySelectorAll('.stat-num');
        if (counters.length) {
            const countObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const duration = 1600;
                    const start = performance.now();

                    const tick = now => {
                        const t = Math.min(1, (now - start) / duration);
                        const eased = 1 - Math.pow(1 - t, 3);
                        el.textContent = Math.round(target * eased);
                        if (t < 1) requestAnimationFrame(tick);
                        else el.textContent = target;
                    };
                    requestAnimationFrame(tick);
                    countObserver.unobserve(el);
                });
            }, { threshold: 0.5 });

            counters.forEach(c => countObserver.observe(c));
        }

        /* ---------- Active nav link by section ---------- */
        const sections = document.querySelectorAll('section[id]');
        const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
        if (sections.length && navAnchors.length) {
            const navObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.id;
                    navAnchors.forEach(a => {
                        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                    });
                });
            }, { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' });

            sections.forEach(s => navObserver.observe(s));
        }
    }

    /* ---------- Hero card subtle 3D tilt ---------- */
    const heroCard = document.getElementById('heroCard');
    if (heroCard && window.matchMedia('(pointer: fine)').matches) {
        const wrap = heroCard.parentElement;

        wrap.addEventListener('mousemove', e => {
            const r = wrap.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            const rx = (0.5 - y) * 8;
            const ry = (x - 0.5) * 8;
            heroCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        wrap.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'rotateX(0) rotateY(0)';
        });
    }

    /* ---------- Contact form ---------- */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (form && status) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            status.classList.remove('error', 'success');
            const dict = I18N[currentLang];

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            const consent = form.consent && form.consent.checked;

            if (!name || !email || !message) {
                status.textContent = dict['form.errRequired'];
                status.classList.add('error');
                return;
            }

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailOk) {
                status.textContent = dict['form.errEmail'];
                status.classList.add('error');
                return;
            }

            if (!consent) {
                status.textContent = dict['form.errConsent'];
                status.classList.add('error');
                return;
            }

            const subject = encodeURIComponent(`${dict['form.mailSubject']} — ${form.topic.value}`);
            const company = form.company.value.trim();
            const body = encodeURIComponent(
                `${dict['form.mailNombre']}: ${name}\n` +
                `${dict['form.mailEmail']}: ${email}\n` +
                `${dict['form.mailEmpresa']}: ${company || '-'}\n` +
                `${dict['form.mailTopic']}: ${form.topic.value}\n\n` +
                `${dict['form.mailMessage']}:\n${message}`
            );

            window.location.href = `mailto:alex@fialka.es?subject=${subject}&body=${body}`;

            status.textContent = dict['form.success'];
            status.classList.add('success');
            form.reset();
        });
    }

    /* ---------- Parallax orbs in hero ---------- */
    const orbs = document.querySelectorAll('.orb');
    if (orbs.length && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', e => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            orbs.forEach((orb, i) => {
                const f = (i + 1) * 12;
                orb.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
            });
        }, { passive: true });
    }

    /* ---------- Cookie banner ---------- */
    const banner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');

    if (banner && cookieAccept) {
        const hasAccepted = safeStorage.get(COOKIE_KEY) === '1';
        if (!hasAccepted) {
            banner.hidden = false;
            // small delay so the slide-in animation plays
            requestAnimationFrame(() => {
                requestAnimationFrame(() => banner.classList.add('show'));
            });
        }

        cookieAccept.addEventListener('click', () => {
            safeStorage.set(COOKIE_KEY, '1');
            banner.classList.remove('show');
            setTimeout(() => { banner.hidden = true; }, 400);
        });
    }
})();
