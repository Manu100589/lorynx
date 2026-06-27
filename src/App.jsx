import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { 
  TrendingUp, 
  Award, 
  Zap, 
  ShieldCheck, 
  Briefcase, 
  BarChart2, 
  MessageSquare, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Check, 
  Globe, 
  FileText, 
  Settings, 
  Users, 
  ArrowUpRight, 
  MessageCircle, 
  Calendar, 
  Sparkles,
  Building,
  UserCheck,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// High-fidelity smooth counting stats component
const Counter = ({ endValue, suffix = '', prefix = '', decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = parseFloat(endValue);
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing: easeOutQuad
            const easeProgress = progress * (2 - progress);
            const currentValue = start + easeProgress * (end - start);
            
            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [endValue, hasAnimated, duration]);

  return (
    <span ref={elementRef} className="counter-val">
      {prefix}
      {count.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState('conseil');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRendezVousModal, setShowRendezVousModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Custom cursor states
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);

  const containerRef = useRef(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Loader duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setLoaderVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Cursor Mouse Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const isHoverable = e.target.closest('a, button, .interactive, select, input, textarea, .faq-trigger, .services-tab-trigger, .timeline-step');
      setCursorHovered(!!isHoverable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Custom Cursor Trail Easing
  useEffect(() => {
    let frameId;
    const updateTrail = () => {
      setCursorTrail((prev) => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      frameId = requestAnimationFrame(updateTrail);
    };
    updateTrail();
    return () => cancelAnimationFrame(frameId);
  }, [cursorPos]);

  // Hard refresh ScrollTrigger dimensions after layout settles (Vite HMR & Font load fix)
  useEffect(() => {
    if (loading) return;
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleLoad);
    
    // Multiple fallback timers to guarantee calculations run after CSS compiles
    const timers = [
      setTimeout(() => ScrollTrigger.refresh(), 100),
      setTimeout(() => ScrollTrigger.refresh(), 400),
      setTimeout(() => ScrollTrigger.refresh(), 800),
    ];

    return () => {
      window.removeEventListener('load', handleLoad);
      timers.forEach(clearTimeout);
    };
  }, [loading]);

  // GSAP Animations
  useGSAP(() => {
    if (loading) {
      // Loader SVG drawing
      gsap.fromTo('.loader-logo-circle', 
        { strokeDasharray: 251, strokeDashoffset: 251 }, 
        { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }
      );
      gsap.fromTo('.loader-logo-bars', 
        { strokeDasharray: 100, strokeDashoffset: 100 }, 
        { strokeDashoffset: 0, duration: 1.5, delay: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo('.loader-logo-arrow', 
        { strokeDasharray: 100, strokeDashoffset: 100 }, 
        { strokeDashoffset: 0, duration: 1.5, delay: 0.6, ease: 'power2.out' }
      );
      gsap.to('.loader-text', { opacity: 1, y: 0, duration: 0.8, delay: 1.2 });
      return;
    }

    // Premium Typographical Hero entrance sequence
    gsap.from('.hero-bg-text-line-1, .hero-bg-text-line-2', {
      y: 80,
      opacity: 0,
      duration: 1.4,
      stagger: 0.2,
      ease: 'power4.out',
      delay: 0.2
    });

    gsap.from('.hero-badge-pill', {
      x: -50,
      opacity: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.7
    });

    gsap.from('.hero-center-actions-bottom', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 1.0
    });

    // Pinned Vision Text Highlight scroll reveal
    const words = gsap.utils.toArray('.vision-word');
    gsap.to(words, {
      opacity: 1,
      color: '#FFFFFF',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.vision-pinned-section',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      }
    });

    // Staggered scroll reveal for Valeurs cards (revealing one by one as they scroll in)
    gsap.utils.toArray('.valeur-card').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Staggered scroll reveal for Benefits cards (features scrolling/revealing on scroll)
    gsap.utils.toArray('.benefit-card').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Scroll progress bar indicator
    gsap.to('.scroll-progress-bar', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // Horizontal scroll timeline on all screens
    const track = document.querySelector('.methodology-timeline-track');
    if (track) {
      const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.methodology-pinned-section',
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 1.2,
          pin: true,
          invalidateOnRefresh: true,
        }
      });
    }

    // Force ScrollTrigger to calculate all scroll positions after elements render
    ScrollTrigger.refresh();

  }, { scope: containerRef, dependencies: [loading] });

  // Custom magnetic button tracking (standard GSAP effect)
  const handleMagneticMove = (e, strength = 0.3) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMagneticLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  const testimonials = [
    {
      quote: "Loryns Consulting a transformé notre gouvernance. Grâce à leur diagnostic rigoureux et leur plan d'action, notre chiffre d'affaires a augmenté de 40% en deux ans.",
      author: "Jean-Pierre Moudiki",
      role: "Directeur Général",
      company: "Afrilog Douala",
      avatar: "/avatar_jean.png",
      initials: "JM"
    },
    {
      quote: "Leur accompagnement dans la recherche de financement a été déterminant pour notre projet d'infrastructure. Une expertise de niveau international, ancrée dans la réalité locale.",
      author: "Sonia Kamga",
      role: "Co-fondatrice",
      company: "NextGen Telecom",
      avatar: "/avatar_sonia.png",
      initials: "SK"
    },
    {
      quote: "Une équipe d'experts à l'écoute, pragmatique et orientée résultats. Le management de transition proposé par Loryns a stabilisé nos opérations en période de crise.",
      author: "Alain Ndongo",
      role: "PCA",
      company: "Société Camerounaise de Distribution",
      avatar: "/avatar_alain.png",
      initials: "AN"
    }
  ];

  const blogArticles = [
    {
      id: 1,
      category: "Gouvernance",
      date: "24 Juin 2026",
      title: "Restructuration d'Entreprise au Cameroun : Comment éviter la faillite dans les 3 premières années",
      excerpt: "Découvrez les facteurs clés de la mortalité précoce des PME à Douala et Yaoundé, et comment un audit de gouvernance rigoureux peut sauver votre structure.",
      image: "/blog_restructuring.png",
      keywords: "restructuration entreprise Cameroun, gouvernance stratégique, gestion de crise PME, Loryns Consulting",
      content: `
# Restructuration d'Entreprise au Cameroun : Comment éviter la faillite précoce

En Afrique subsaharienne, et plus particulièrement au Cameroun, la dynamique entrepreneuriale est l'une des plus fortes au monde. Cependant, les statistiques révèlent une réalité plus sombre : **près de 80% des jeunes entreprises disparaissent avant leur 3e anniversaire**, et plus de 54% des PME déclarent faillite au cours de leur première décennie d'existence. 

À Douala, poumon économique, des centaines d'entreprises ferment discrètement leurs portes chaque année. Pourquoi un tel taux d'échec ? Et surtout, comment y faire face grâce à la **restructuration stratégique** ?

## 1. Les causes majeures de la mortalité des PME au Cameroun

Nos diagnostics menés auprès de dizaines d'entreprises locales identifient trois faiblesses cardinales :
* **Une gouvernance informelle** : Les décisions stratégiques reposent trop souvent sur une seule personne, sans conseil d'administration structuré ni processus de validation des risques.
* **Le pilotage financier à vue** : L'absence de comptabilité analytique et de tableaux de bord financiers réguliers empêche d'anticiper les crises de trésorerie.
* **L'inadaptation aux ruptures sectorielles** : Face à l'inflation et à la numérisation rapide, les business models traditionnels s'essoufflent sans réinventer leur offre.

## 2. Qu'est-ce que la restructuration d'entreprise ?

Contrairement aux idées reçues, restructurer n'est pas uniquement synonyme de réduction d'effectifs en situation désespérée. Il s'agit d'une **réingénierie opérationnelle et financière** destinée à relancer la rentabilité d'une structure en perte de vitesse.

Chez *Loryns Strategic Consulting*, notre processus s'articule autour de trois leviers d'urgence :
1. **Le Diagnostic Flash** : Un audit complet en 15 jours pour identifier les goulets d'étranglement financiers et opérationnels.
2. **Le Management de Transition** : La mise à disposition d'un Directeur Général ou Financier intérimaire pour restructurer la comptabilité et stabiliser la trésorerie.
3. **La rationalisation des charges** : La renégociation des contrats d'intermédiation et de distribution pour dégager de l'oxygène financier.

## 3. L'importance cruciale de la gouvernance stratégique

La restructuration réussie repose sur une transition de la gestion purement familiale vers une **gouvernance d'entreprise moderne et transparente**. En structurant vos comités de direction et en intégrant des conseillers externes qualifiés, vous rassurez non seulement vos partenaires commerciaux, mais vous ouvrez aussi la voie à de futurs financements institutionnels.

*Ne laissez pas votre entreprise grossir les statistiques de faillite. Prenez les devants et sollicitez un diagnostic de gouvernance complet dès aujourd'hui.*
      `
    },
    {
      id: 2,
      category: "Finance",
      date: "18 Juin 2026",
      title: "Levée de Fonds en Afrique Centrale : Stratégies clés pour séduire les bailleurs de fonds",
      excerpt: "Comment structurer son dossier de financement et calibrer sa modélisation financière pour convaincre les banques et les fonds d'investissement régionaux.",
      image: "/blog_funding.png",
      keywords: "levée de fonds Afrique, financement PME Cameroun, ingénierie financière, BDEAC, banque Douala",
      content: `
# Levée de Fonds en Afrique Centrale : Comment convaincre les investisseurs ?

L'accès au capital est le principal frein à l'expansion des PME et des projets d'infrastructure au Cameroun et dans toute la zone CEMAC. Pourtant, les liquidités existent : banques commerciales locales, institutions financières internationales (BAD, BDEAC, SFI) et fonds d'investissement privés cherchent activement des projets viables.

Le défi réside dans la **calibration financière** et la présentation du projet. Voici comment optimiser votre ingénierie financière pour lever des fonds avec succès.

## 1. Comprendre les attentes des investisseurs en zone CEMAC

Qu'il s'agisse d'un crédit bancaire classique ou d'une entrée au capital par un fonds de capital-investissement (Private Equity), les bailleurs évaluent trois piliers fondamentaux :
* **La qualité et la transparence des états financiers** : Les bilans audités et certifiés sont la condition sine qua non de toute étude de dossier.
* **La solidité du business plan** : Une modélisation financière rigoureuse sur 5 ans intégrant différents scénarios de croissance (optimiste, réaliste, pessimiste).
* **Le dispositif de réduction des risques** : Quelles sont les garanties réelles ? La structure juridique de l'entreprise est-elle conforme aux règles OHADA ?

## 2. Les étapes pour structurer une levée de fonds réussie

Pour maximiser vos chances d'obtenir un financement, nous conseillons une approche en quatre étapes méthodiques :
1. **L'Évaluation de la capacité d'endettement** : Analyser le ratio d'endettement actuel et déterminer le besoin de financement réel (BFR ou investissement long terme).
2. **La rédaction de l'Information Memorandum (InfoMemo)** : Un document de présentation synthétique et percutant décrivant le marché, le positionnement commercial et la gouvernance.
3. **La modélisation financière avancée** : Construction de prévisions de flux de trésorerie (Cash Flow Statements) robustes avec calcul du TRI (Taux de Rendement Interne) et de la VAN (Valeur Actuelle Nette).
4. **La négociation des Term Sheets** : Cadrer les conditions de remboursement, les covenants bancaires ou la gouvernance partagée en cas d'ouverture de capital.

## 3. Le rôle de l'ingénierie financière de Loryns

Un dirigeant de PME n'a pas toujours en interne les compétences d'un banquier d'affaires. C'est là que l'accompagnement de *Loryns Strategic Consulting* prend tout son sens. Nous structurons vos dossiers financiers pour parler le langage exact des banques et des fonds d'investissement, et nous vous introduisons directement auprès de réseaux d'intermédiation stratégiques en zone Afrique centrale.

*Vous préparez un grand projet d'infrastructure ou d'expansion industrielle ? Contactez nos experts en ingénierie financière pour valider votre modèle de financement.*
      `
    },
    {
      id: 3,
      category: "Digitalisation",
      date: "10 Juin 2026",
      title: "La Transformation Digitale : Le levier incontournable de performance pour les PME en 2026",
      excerpt: "Au-delà de la communication, apprenez comment automatiser vos processus métier internes pour réduire les coûts et sécuriser vos opérations.",
      image: "/blog_digital.png",
      keywords: "transformation digitale PME, performance opérationnelle, digitalisation Douala, automatisation processus",
      content: `
# La Transformation Digitale : Levier de Performance Incontournable pour les PME

Dans le paysage économique hyper-compétitif de 2026, la transformation digitale ne se résume plus à posséder une page Facebook ou un site web institutionnel. Elle représente la **colonne vertébrale opérationnelle** d'une entreprise moderne.

Pour les PME camerounaises, automatiser ses processus internes est devenu un enjeu de survie et de compétitivité.

## 1. La digitalisation opérationnelle : Définition et bénéfices

Trop d'entreprises locales souffrent de lenteurs administratives dues au traitement manuel des informations : doubles saisies, pertes de factures, reporting commercial obsolète. La transformation digitale consiste à déployer des outils logiciels intégrés pour rationaliser ces tâches.

Les gains pour une PME sont immédiats :
* **Réduction drastique des coûts d'exploitation** : Moins de papier, moins d'erreurs humaines et réduction des heures de saisie à faible valeur ajoutée.
* **Sécurisation des processus financiers** : Suivi en temps réel de la facturation et réduction du délai de recouvrement des créances.
* **Décisions basées sur les données** : Des indicateurs de performance (KPI) mis à jour instantanément pour le comité de direction.

## 2. Par où commencer sa transformation digitale ?

Plutôt que d'acheter des logiciels coûteux qui ne seront pas adaptés à vos équipes, nous préconisons une démarche pragmatique :
1. **La cartographie des processus métiers** : Identifier quelles étapes créent le plus de friction dans vos ventes, vos RH ou votre logistique.
2. **Le choix de solutions agiles et cloud** : Privilégier des outils simples d'intégration (CRM, outils d'automatisation comme Zapier ou Make, ou ERP open-source).
3. **La conduite du changement** : La clé de voûte de la réussite réside dans la formation de vos équipes. Un outil digital n'est utile que s'il est adopté à 100%.

## 3. L'approche technologique intégrée de Loryns

Chez *Loryns Strategic Consulting*, nous combinons le conseil stratégique traditionnel avec le génie logiciel. Nos ingénieurs conçoivent des passerelles d'automatisation personnalisées et déploient des solutions de reporting décisionnel pour rationaliser votre gestion managériale. Nous veillons à ce que chaque investissement technologique se traduise par une hausse immédiate de votre rentabilité opérationnelle.

*Prêt à accélérer la performance digitale de votre entreprise ? Discutez avec un de nos consultants techniques pour concevoir votre plan de transition.*
      `
    }
  ];

  const renderArticleContent = (content) => {
    return content.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="blog-h1">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="blog-h2">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item) => item.replace(/^[\*\-]\s+/, ''));
        return (
          <ul key={idx} className="blog-ul">
            {items.map((item, iIdx) => <li key={iIdx}>{item}</li>)}
          </ul>
        );
      }
      if (trimmed.match(/^\d+\.\s+/)) {
        const items = trimmed.split('\n').map((item) => item.replace(/^\d+\.\s+/, ''));
        return (
          <ol key={idx} className="blog-ol">
            {items.map((item, iIdx) => <li key={iIdx}>{item}</li>)}
          </ol>
        );
      }
      let htmlText = trimmed;
      htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={idx} className="blog-p" dangerouslySetInnerHTML={{ __html: htmlText }} />;
    });
  };

  const faqs = [
    {
      question: "Comment se déroule la première prise de contact ?",
      answer: "Nous commençons par un entretien d'évaluation gratuit pour comprendre vos défis immédiats, suivi d'un pré-diagnostic rapide permettant de cadrer notre future intervention."
    },
    {
      question: "Comment structurez-vous vos honoraires de conseil ?",
      answer: "Nos honoraires s'adaptent à la nature de la mission : taux journalier pour le conseil d'accompagnement, forfait fixe pour les projets structurés, ou une part variable basée sur les résultats (success fees) pour la recherche de financement."
    },
    {
      question: "Quels types d'entreprises accompagnez-vous ?",
      answer: "Nous intervenons auprès des Start-up innovantes en recherche de structuration, des PME en phase de croissance ou de restructuration, ainsi que des grandes entreprises publiques et privées à l'échelle africaine."
    },
    {
      question: "Proposez-vous un accompagnement juridique et financier complet ?",
      answer: "Oui, grâce à notre pool d'experts en services financiers et juridiques, nous couvrons la création d'entreprise, la conformité réglementaire, la négociation de partenariats et le montage de dossiers d'investissement."
    },
    {
      question: "Comment garantissez-vous le suivi de la mise en œuvre ?",
      answer: "Notre méthodologie intègre une phase dédiée de 'Suivi & Performance'. Nos consultants accompagnent vos équipes opérationnelles pendant plusieurs mois sur le terrain pour valider l'exécution et ajuster le tir."
    }
  ];

  // 17 services grouped into 3 strategic tabs
  const servicesData = {
    conseil: [
      {
        num: "01",
        title: "Conseil stratégique",
        desc: "Accompagner les dirigeants dans la définition de leur vision, la croissance durable et la résilience face aux mutations du marché.",
        features: ["Revue de business model", "Plan de croissance à 5 ans", "Optimisation de portefeuille"]
      },
      {
        num: "02",
        title: "Management des entreprises",
        desc: "Restructuration organisationnelle et audit managérial complet à 360° pour sécuriser vos opérations.",
        features: ["Gouvernance d'entreprise", "Régulation des processus", "Coaching exécutif"]
      },
      {
        num: "03",
        title: "Études et conseils",
        desc: "Analyses sectorielles approfondies et études de faisabilité pour guider vos lancements et investissements en Afrique.",
        features: ["Études de marché", "Analyses macroéconomiques", "Plans d'affaires validés"]
      },
      {
        num: "04",
        title: "Négociation",
        desc: "Conseil et appui direct lors de négociations commerciales ou partenariats complexes pour optimiser vos termes.",
        features: ["Closing de contrats", "Stratégies d'achat/vente", "Gestion de conflits d'associés"]
      },
      {
        num: "05",
        title: "Intermédiation",
        desc: "Mise en relation d'affaires stratégiques et facilitation de partenariats gagnant-gagnant à l'international.",
        features: ["Lobbying institutionnel", "Réseautage d'affaires", "Recherche de partenaires clés"]
      },
      {
        num: "06",
        title: "Expertise en norme & qualité",
        desc: "Accompagnement des banques, télécoms et hôtels pour s'aligner sur les réglementations en vigueur et standards internationaux.",
        features: ["Conformité réglementaire", "Certification ISO", "Prévention des pénalités"]
      }
    ],
    finance: [
      {
        num: "07",
        title: "Services financiers",
        desc: "Conseil en investissement de capitaux, acquisitions de titres (actions/obligations) et évaluation de valeur.",
        features: ["Plans d'investissement", "Valorisation d'entreprise", "Conseils cotation en Bourse"]
      },
      {
        num: "08",
        title: "Recherche de financement",
        desc: "Structuration de dossiers financiers haut de gamme et mise en relation avec des bailleurs de fonds mondiaux.",
        features: ["Levée de fonds", "Ingénierie de la dette", "Financement de projets d'envergure"]
      },
      {
        num: "09",
        title: "Recouvrement de créances",
        desc: "Sécurisation de vos liquidités et gestion éthique, ferme et amiable du recouvrement de vos factures impayées.",
        features: ["Négociation amiable", "Suivi pré-contentieux", "Optimisation du DSO"]
      },
      {
        num: "10",
        title: "Services juridiques",
        desc: "Création de structures, secrétariat juridique de haut niveau et assistance contractuelle sur mesure.",
        features: ["Création d'entreprise", "Rédaction de pactes d'associés", "Conformité OHADA"]
      },
      {
        num: "11",
        title: "Gestion RH",
        desc: "Recrutement de talents stratégiques, audit social, gestion de la paie et régulation des relations de travail.",
        features: ["Recrutement exécutif", "Externalisation de la paie", "Plans de formation continue"]
      }
    ],
    digital: [
      {
        num: "12",
        title: "Transformation digitale",
        desc: "Audit de maturité numérique et migration de vos anciens processus vers des écosystèmes digitaux performants.",
        features: ["Stratégie Cloud", "Audit informatique", "Conduite du changement"]
      },
      {
        num: "13",
        title: "Développement informatique",
        desc: "Fourniture de progiciels, développement d'applications mobiles et web adaptées à votre contexte métier.",
        features: ["Solutions SaaS personnalisées", "Développement Web & Mobile", "Applications ERP/CRM"]
      },
      {
        num: "14",
        title: "Automatisation des processus",
        desc: "Suppression des tâches répétitives par l'implémentation de robots logiciels (RPA) et d'outils collaboratifs.",
        features: ["Workflows automatisés", "Gain de temps opérationnel", "Intégration d'outils métier"]
      },
      {
        num: "15",
        title: "Services de communication",
        desc: "Stratégie de marque haut de gamme, création d'identité visuelle, graphisme et campagnes publicitaires multicanales.",
        features: ["Charte graphique & Webdesign", "Copywriting de marque", "Campagnes publicitaires payantes"]
      },
      {
        num: "16",
        title: "Community Management",
        desc: "Fidélisation de votre audience et valorisation de votre e-réputation sur les réseaux sociaux professionnels.",
        features: ["Gestion LinkedIn & Facebook", "Création de contenus vidéos/visuels", "Modération active"]
      },
      {
        num: "17",
        title: "Architecture intérieure",
        desc: "Aménagement haut de gamme des espaces de travail et habitations pour allier confort, design et productivité.",
        features: ["Workspace Branding", "Plan d'aménagement 3D", "Mobilier premium sur mesure"]
      }
    ]
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Votre demande de consultation a bien été envoyée. Un associé de Loryns Strategic Consulting vous contactera sous 24 heures.");
  };

  return (
    <div ref={containerRef}>
      {/* Custom Mouse Cursor */}
      <CustomCursor cursorPos={cursorPos} cursorTrail={cursorTrail} cursorHovered={cursorHovered} />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar"></div>
      </div>

      {/* Premium Loader */}
      {loaderVisible && (
        <div className="loader-wrapper" style={{ opacity: loading ? 1 : 0, visibility: loading ? 'visible' : 'hidden' }}>
          <svg className="loader-logo-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#C8A95A" strokeWidth="2.5" fill="none" className="loader-logo-circle" />
            <path d="M35 65 L35 55 M45 65 L45 45 M55 65 L55 35 M65 65 L65 25" stroke="#C8A95A" strokeWidth="3.5" strokeLinecap="round" fill="none" className="loader-logo-bars" />
            <path d="M30 65 L45 45 L55 35 L68 22 M60 22 L68 22 L68 30" stroke="#C8A95A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="loader-logo-arrow" />
          </svg>
          <div className="loader-text">LORYNS CONSULTING</div>
        </div>
      )}

      {/* Sticky Navigation Header */}
      <header className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="#" className="navbar-brand interactive">
            <svg className="navbar-logo-icon" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#C8A95A" strokeWidth="3" />
              <path d="M35 65 L35 55 M45 65 L45 45 M55 65 L55 35 M65 65 L65 25" stroke="#C8A95A" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M30 65 L45 45 L55 35 L68 22 M60 22 L68 22 L68 30" stroke="#C8A95A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>LORYNS</span>
          </a>

          <nav className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Cabinet</a>
            <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Vision</a>
            <a href="#valeurs" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Valeurs</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Nos Services</a>
            <a href="#methodology" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Méthodologie</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Insights</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">Contact</a>
            
            <div 
              className="magnetic-wrap"
              onMouseMove={(e) => handleMagneticMove(e, 0.2)}
              onMouseLeave={handleMagneticLeave}
            >
              <button 
                onClick={() => { setShowRendezVousModal(true); setMobileMenuOpen(false); }} 
                className="btn btn-primary navbar-btn interactive"
              >
                Prise de RDV
              </button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-mobile-toggle interactive" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-frame-container">
          <div className="hero-inner-frame">
            {/* Ambient Background Lights */}
            <div className="hero-ambient-glow"></div>
            <div className="hero-gold-glow"></div>
            
            {/* Big Backdrop Typography */}
            <div className="hero-bg-text">
              <div className="hero-bg-text-line-1">LORYNS</div>
              <div className="hero-bg-text-line-2">STRATEGIC</div>
            </div>

            {/* Left Side Pill Badges */}
            <div className="hero-left-badges">
              <div className="hero-badge-pill interactive">
                <span className="gold-dot">•</span> Gouvernance & Stratégie
              </div>
              <div className="hero-badge-pill interactive">
                <span className="gold-dot">•</span> Ingénierie Financière
              </div>
              <div className="hero-badge-pill interactive">
                <span className="gold-dot">•</span> Transformation Digitale
              </div>
            </div>

            {/* Scroll Mouse Indicator */}
            <a href="#about" className="hero-scroll-indicator-custom interactive">
              <span>Faire défiler</span>
              <div className="hero-scroll-mouse-custom"></div>
            </a>
          </div>

          {/* Bottom Center Action Button (placed in the bottom frame margin) */}
          <div className="hero-center-actions-bottom">
            <div 
              className="magnetic-wrap"
              onMouseMove={(e) => handleMagneticMove(e, 0.25)}
              onMouseLeave={handleMagneticLeave}
            >
              <a href="#services" className="btn btn-primary interactive">Découvrir nos services</a>
            </div>
            <span className="hero-brush-text">Consulting</span>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi Loryns ?" */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <div className="section-tag">Qui sommes-nous</div>
              <h2 className="section-title" style={{ marginBottom: '2rem' }}>Pourquoi Loryns ?</h2>
              <p className="about-text-lead">
                En Afrique, de nombreuses entreprises disparaissent avant leur cinquième année faute d'une stratégie adaptée.
              </p>
              <p className="about-text-desc">
                Loryns Strategic Consulting accompagne les organisations, dirigeants et professionnels pour renforcer leur gouvernance, rationaliser leur management et construire une croissance solide, pérenne et compétitive face aux crises économiques modernes.
              </p>
              
              <div className="about-image-wrapper interactive" style={{ position: 'relative', marginBottom: '2.5rem', borderRadius: '16px', overflow: 'hidden', height: '260px', border: '1px solid rgba(7, 26, 53, 0.08)', boxShadow: 'var(--shadow-soft)' }}>
                <img src="/boardroom_meeting.png" alt="Collaborateurs Loryns Strategic Consulting" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div 
                className="magnetic-wrap"
                onMouseMove={(e) => handleMagneticMove(e, 0.15)}
                onMouseLeave={handleMagneticLeave}
              >
                <a href="#contact" className="btn btn-outline interactive">
                  Discuter avec un associé <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">
                  <Counter endValue={80} suffix="%" />
                </div>
                <div className="stat-label">Taux de faillite</div>
                <div className="stat-desc">des nouvelles entreprises africaines avant leur 3e année.</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">
                  <Counter endValue={54.2} suffix="%" decimals={1} />
                </div>
                <div className="stat-label">Fermetures</div>
                <div className="stat-desc">des Start-up africaines créées au cours de la dernière décennie.</div>
              </div>

              <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                <div className="stat-number">
                  <Counter endValue={350} prefix="+" />
                </div>
                <div className="stat-label">Entreprises camerounaises</div>
                <div className="stat-desc">déclarent faillite en moyenne chaque année pour cause de mauvaise gestion.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Vision Section */}
      <section id="vision" className="vision-pinned-section">
        <div className="vision-sticky-wrapper">
          <div className="vision-bg-pattern"></div>
          <div className="vision-container">
            <div className="section-tag" style={{ color: '#C8A95A' }}>Notre Vision</div>
            
            {/* ScrollTrigger will dynamically light up words in this text */}
            <h2 className="vision-text-layer">
              {`Accompagner les dirigeants et les entreprises vers une croissance exponentielle, une meilleure compétitivité sectorielle et une notoriété internationale durable, grâce à un management stratégique rigoureux de haut niveau.`.split(' ').map((word, index) => (
                <span key={index} className="vision-word">
                  {word}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </section>

      {/* Nos Valeurs & Pourquoi collaborer (Fondations & Valeur ajoutée) */}
      <section id="valeurs" className="valeurs-benefits-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Fondations</div>
            <h2 className="section-title">Nos Valeurs Cardinales</h2>
            <p style={{ marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Des standards éthiques et opérationnels rigoureux au service de l'excellence de votre organisation.
            </p>
          </div>

          <div className="valeurs-grid">
            <div className="valeur-card interactive">
              <div className="valeur-icon-container">
                <Award size={32} />
              </div>
              <h3>Excellence</h3>
              <p>Nous nous positionnons pour être les meilleurs dans nos champs de compétence. Avec des méthodes inédites qui garantissent les résultats. Des résultats font nos éloges.</p>
            </div>

            <div className="valeur-card interactive">
              <div className="valeur-icon-container">
                <Zap size={32} />
              </div>
              <h3>Innovation Continue</h3>
              <p>Une entreprise qui stagne est vouée à la faillite. Nous nous réinventons tous les jours pour vous servir ce qu'il y a de mieux, afin d'anticiper les ruptures sectorielles.</p>
            </div>

            <div className="valeur-card interactive">
              <div className="valeur-icon-container">
                <TrendingUp size={32} />
              </div>
              <h3>Performance</h3>
              <p>Traduire la stratégie en indicateurs financiers mesurables. Nous calibrons des solutions pragmatiques conçues pour propulser l'efficacité opérationnelle et la rentabilité.</p>
            </div>

            <div className="valeur-card interactive">
              <div className="valeur-icon-container">
                <ShieldCheck size={32} />
              </div>
              <h3>Croissance Durable</h3>
              <p>Construire l'avenir sur des bases saines. Nous accompagnons les dirigeants dans l'établissement de structures pérennes capables de résister aux crises macroéconomiques.</p>
            </div>
          </div>

          <div className="valeurs-benefits-separator"></div>

          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Valeur ajoutée</div>
            <h2 className="section-title">Pourquoi collaborer avec nous ?</h2>
            <p style={{ marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Ce que vous gagnerez à structurer votre croissance stratégique avec Loryns.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Augmentation du chiffre d'affaires</h3>
              <p>Optimisation de vos offres, meilleure pénétration commerciale et structuration des réseaux d'intermédiation clés.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Briefcase size={28} />
              </div>
              <h3>Optimisation des coûts</h3>
              <p>Élimination des inefficacités opérationnelles, renégociation de contrats et réduction des gaspillages.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={28} />
              </div>
              <h3>Optimisation des ressources</h3>
              <p>Alignement optimal de vos compétences internes, automatisation logicielle et gouvernance managériale claire.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Clock size={28} />
              </div>
              <h3>Gain de temps stratégique</h3>
              <p>Déléguez l'ingénierie financière et les audits complexes pour vous recentrer sur votre cœur de métier.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Globe size={28} />
              </div>
              <h3>Positionnement sur le marché</h3>
              <p>Alignement sur les normes internationales pour accéder à des marchés étrangers et accroître votre e-réputation.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Accompagnement durable</h3>
              <p>Un partenariat fondé sur la confiance, le suivi continu et la formation continue de vos ressources clés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Offre de service</div>
            <h2 className="section-title">Domaines d'Expertise</h2>
            <p style={{ marginTop: '1.5rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              Une gamme complète de solutions stratégiques, financières et technologiques à 360° pour les dirigeants d'Afrique et d'Europe.
            </p>
          </div>

          <div className="services-tabs">
            <button 
              className={`services-tab-trigger interactive ${activeServiceTab === 'conseil' ? 'active' : ''}`}
              onClick={() => setActiveServiceTab('conseil')}
            >
              Stratégie & Conseil
            </button>
            <button 
              className={`services-tab-trigger interactive ${activeServiceTab === 'finance' ? 'active' : ''}`}
              onClick={() => setActiveServiceTab('finance')}
            >
              Finances & Affaires
            </button>
            <button 
              className={`services-tab-trigger interactive ${activeServiceTab === 'digital' ? 'active' : ''}`}
              onClick={() => setActiveServiceTab('digital')}
            >
              Digital & Créativité
            </button>
          </div>

          <div className="services-grid">
            {servicesData[activeServiceTab].map((service, index) => (
              <div key={index} className="service-card interactive">
                <div className="service-header">
                  <div className="service-icon-box">
                    {activeServiceTab === 'conseil' && index === 0 && <TrendingUp size={24} />}
                    {activeServiceTab === 'conseil' && index === 1 && <Building size={24} />}
                    {activeServiceTab === 'conseil' && index === 2 && <BarChart2 size={24} />}
                    {activeServiceTab === 'conseil' && index === 3 && <UserCheck size={24} />}
                    {activeServiceTab === 'conseil' && index === 4 && <Users size={24} />}
                    {activeServiceTab === 'conseil' && index === 5 && <ShieldCheck size={24} />}
                    
                    {activeServiceTab === 'finance' && index === 0 && <Briefcase size={24} />}
                    {activeServiceTab === 'finance' && index === 1 && <Layers size={24} />}
                    {activeServiceTab === 'finance' && index === 2 && <RefreshCw size={24} />}
                    {activeServiceTab === 'finance' && index === 3 && <FileText size={24} />}
                    {activeServiceTab === 'finance' && index === 4 && <Users size={24} />}
                    
                    {activeServiceTab === 'digital' && index === 0 && <Globe size={24} />}
                    {activeServiceTab === 'digital' && index === 1 && <Settings size={24} />}
                    {activeServiceTab === 'digital' && index === 2 && <Clock size={24} />}
                    {activeServiceTab === 'digital' && index === 3 && <MessageSquare size={24} />}
                    {activeServiceTab === 'digital' && index === 4 && <MessageCircle size={24} />}
                    {activeServiceTab === 'digital' && index === 5 && <Sparkles size={24} />}
                  </div>
                  <div className="service-number">{service.num}</div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul className="service-features-list">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned Methodology Section */}
      <div className="methodology-pinned-section" id="methodology">
        <section className="methodology-section" style={{ padding: 0 }}>
          <div className="methodology-viewport-wrapper" style={{ position: 'relative', height: '100vh', minHeight: '560px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100vw', overflow: 'hidden' }}>
            
            <div className="container">
              <div className="section-header" style={{ marginBottom: '2rem' }}>
                <div className="section-tag" style={{ color: '#C8A95A' }}>Processus</div>
                <h2 className="section-title">Notre Méthodologie</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '1rem' }}>
                  Un processus rigoureux en 5 étapes pour garantir la réussite et le suivi continu de nos interventions.
                </p>
              </div>
            </div>

            <div className="methodology-scroll-container">
              <div className="methodology-timeline-line"></div>
              <div className="methodology-timeline-track">
                
                <div className="timeline-step">
                  <div className="timeline-step-node">1</div>
                  <div className="timeline-step-card">
                    <h4>Diagnostic</h4>
                    <p>Audit initial rigoureux de vos opérations, identification des goulets d'étranglement et analyse de la gouvernance.</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">2</div>
                  <div className="timeline-step-card">
                    <h4>Analyse stratégique</h4>
                    <p>Calibration des scénarios de croissance, modélisation financière et benchmark de la concurrence.</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">3</div>
                  <div className="timeline-step-card">
                    <h4>Plan d'action</h4>
                    <p>Co-construction des livrables de transformation, assignation des KPI et définition du budget.</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">4</div>
                  <div className="timeline-step-card">
                    <h4>Mise en œuvre</h4>
                    <p>Accompagnement opérationnel rapproché par nos consultants spécialisés pour encadrer les équipes.</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">5</div>
                  <div className="timeline-step-card">
                    <h4>Suivi & Performance</h4>
                    <p>Évaluation mensuelle des résultats et ajustements stratégiques réguliers pour pérenniser l'activité.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>



      {/* Témoignages */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Témoignages</div>
            <h2 className="section-title">La voix de nos clients</h2>
          </div>

          <div className="testimonial-container">
            <div className="testimonial-slider">
              <div className="testimonial-slide">
                <span className="testimonial-quote-icon">“</span>
                <p className="testimonial-text">
                  {testimonials[activeTestimonial].quote}
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ overflow: 'hidden' }}>
                    {testimonials[activeTestimonial].avatar ? (
                      <img 
                        src={testimonials[activeTestimonial].avatar} 
                        alt={testimonials[activeTestimonial].author} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      testimonials[activeTestimonial].initials
                    )}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonials[activeTestimonial].author}</h4>
                    <p>{testimonials[activeTestimonial].role} — {testimonials[activeTestimonial].company}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-controls">
              <button 
                className="testimonial-btn interactive"
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="testimonial-btn interactive"
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Actualités & Insights</div>
            <h2 className="section-title">Nos Analyses & Conseils</h2>
            <p style={{ marginTop: '1.5rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              Décryptages stratégiques et ingénierie d'affaires pour guider les PME et dirigeants d'Afrique centrale face aux enjeux de croissance.
            </p>
          </div>

          <div className="blog-grid">
            {blogArticles.map((article) => (
              <div 
                key={article.id} 
                className="blog-card interactive" 
                onClick={() => setSelectedArticle(article)}
                style={{ cursor: 'pointer' }}
              >
                <div className="blog-card-image">
                  <img src={article.image} alt={article.title} />
                  <div className="blog-card-category">{article.category}</div>
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-date">{article.date}</div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="blog-card-link">
                    Lire l'article <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 className="section-title">Questions Fréquentes</h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button 
                  className="faq-trigger interactive"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <div className="faq-icon-holder">
                    <ArrowRight size={18} style={{ transform: activeFaq === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                  </div>
                </button>
                <div 
                  className="faq-content"
                  style={{ maxHeight: activeFaq === index ? '300px' : '0px' }}
                >
                  <div className="faq-content-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div>
                <div className="section-tag">Contactez-nous</div>
                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Prêt à accélérer votre croissance ?</h2>
                <p>Rencontrons-nous pour analyser vos défis opérationnels et structurer une feuille de route adaptée.</p>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <MapPin size={24} />
                </div>
                <div className="contact-detail-content">
                  <h4>Localisation</h4>
                  <p>Rue de la Joie, Akwa, Douala — Cameroun</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Phone size={24} />
                </div>
                <div className="contact-detail-content">
                  <h4>Téléphone</h4>
                  <p><a href="tel:+237677549121" className="interactive">+237 677 54 91 21</a></p>
                  <p><a href="tel:+237697952330" className="interactive">+237 697 95 23 30</a></p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Mail size={24} />
                </div>
                <div className="contact-detail-content">
                  <h4>Email</h4>
                  <p><a href="mailto:lorynsstrategicconsulting@gmail.com" className="interactive">lorynsstrategicconsulting@gmail.com</a></p>
                </div>
              </div>

              <div className="contact-actions">
                <div 
                  className="magnetic-wrap"
                  onMouseMove={(e) => handleMagneticMove(e, 0.2)}
                  onMouseLeave={handleMagneticLeave}
                >
                  <a 
                    href="https://wa.me/237677549121" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-whatsapp interactive"
                  >
                    <MessageCircle size={20} /> Échanger sur WhatsApp
                  </a>
                </div>

                <div 
                  className="magnetic-wrap"
                  onMouseMove={(e) => handleMagneticMove(e, 0.2)}
                  onMouseLeave={handleMagneticLeave}
                >
                  <button 
                    onClick={() => setShowRendezVousModal(true)} 
                    className="btn btn-primary interactive"
                  >
                    <Calendar size={20} /> Réserver un créneau (Calendly)
                  </button>
                </div>
              </div>

              {/* Map embed styled to fit midnight blue branding */}
              <div className="contact-map-mock">
                <iframe 
                  title="Loryns Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.813636735165!2d9.691234776100588!3d4.048654495925345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061128b03061bb9%3A0x6b4fb7c6d66beff6!2sAkwa%2C%20Douala%2C%20Cameroun!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(0.9) contrast(1.2) invert(0.05)' }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="firstname">Prénom</label>
                    <input type="text" id="firstname" required placeholder="Jean" className="interactive" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">Nom</label>
                    <input type="text" id="lastname" required placeholder="Moudiki" className="interactive" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email professionnel</label>
                  <input type="email" id="email" required placeholder="jean.moudiki@entreprise.cm" className="interactive" />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Entreprise</label>
                  <input type="text" id="company" placeholder="Afrilog SA" className="interactive" />
                </div>

                <div className="form-group">
                  <label htmlFor="service">Sujet d'intérêt</label>
                  <select id="service" className="interactive">
                    <option value="strategie">Conseil Stratégique & Organisationnel</option>
                    <option value="financement">Recherche de Financement</option>
                    <option value="digital">Transformation Digitale & Informatique</option>
                    <option value="conformite">Norme, Qualité & Juridique</option>
                    <option value="autre">Autre Demande</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Votre message</label>
                  <textarea id="message" rows="5" required placeholder="Décrivez brièvement les défis stratégiques de votre organisation..." className="interactive"></textarea>
                </div>

                <div 
                  className="magnetic-wrap"
                  onMouseMove={(e) => handleMagneticMove(e, 0.1)}
                  onMouseLeave={handleMagneticLeave}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <button type="submit" className="btn btn-primary interactive">
                    Envoyer ma demande <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="footer-brand-logo interactive">
                <svg className="navbar-logo-icon" viewBox="0 0 100 100" style={{ width: '40px', height: '40px' }}>
                  <circle cx="50" cy="50" r="40" stroke="#C8A95A" strokeWidth="3" />
                  <path d="M35 65 L35 55 M45 65 L45 45 M55 65 L55 35 M65 65 L65 25" stroke="#C8A95A" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M30 65 L45 45 L55 35 L68 22 M60 22 L68 22 L68 30" stroke="#C8A95A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: '1.4rem' }}>LORYNS</span>
              </a>
              <p>Cabinet conseil stratégique international de haut niveau. Nous accompagnons les dirigeants et propulsons la création de valeur durable en Afrique.</p>
            </div>

            <div className="footer-links-col">
              <h4>Cabinet</h4>
              <ul className="footer-links">
                <li className="footer-link"><a href="#about" className="interactive">À propos</a></li>
                <li className="footer-link"><a href="#vision" className="interactive">Notre Vision</a></li>
                <li className="footer-link"><a href="#valeurs" className="interactive">Nos Valeurs</a></li>
                <li className="footer-link"><a href="#methodology" className="interactive">Méthodologie</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Expertises</h4>
              <ul className="footer-links">
                <li className="footer-link"><a href="#services" className="interactive">Conseil Stratégique</a></li>
                <li className="footer-link"><a href="#services" className="interactive">Services Financiers</a></li>
                <li className="footer-link"><a href="#services" className="interactive">Transformation Digitale</a></li>
                <li className="footer-link"><a href="#services" className="interactive">Expertise Réglementaire</a></li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h4>Newsletter</h4>
              <p>Recevez nos analyses stratégiques mensuelles sur les opportunités de marché en Afrique centrale.</p>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Merci pour votre inscription !"); }}>
                <input type="email" placeholder="votre@adresse.com" required className="interactive" />
                <button type="submit" className="interactive">S'abonner</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              &copy; {new Date().getFullYear()} Loryns Strategic Consulting. Tous droits réservés. Mentions Légales | Politique de Confidentialité.
            </div>

            <div className="footer-socials">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon interactive"><Globe size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon interactive"><ArrowUpRight size={20} /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon interactive"><Users size={20} /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Calendly Booking Modal Mock */}
      {showRendezVousModal && (
        <div 
          className="rendezvous-modal-backdrop" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(7, 26, 53, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div 
            className="rendezvous-modal-card glass-card"
            style={{
              maxWidth: '650px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '3rem',
              color: 'var(--color-primary)',
              position: 'relative',
              textAlign: 'center',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
            }}
          >
            <button 
              onClick={() => setShowRendezVousModal(false)}
              className="interactive"
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                border: 'none',
                background: 'rgba(7,26,53,0.05)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(200,169,90,0.1)', borderRadius: '50%', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Calendar size={36} />
            </div>

            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Planifier un entretien stratégique</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
              Sélectionnez le type d'entretien avec l'un de nos directeurs associés. La séance dure 30 minutes et a pour but de cadrer vos besoins immédiats.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div 
                className="interactive"
                onClick={() => { alert("Session choisie. Redirection simulée vers Calendly..."); setShowRendezVousModal(false); }}
                style={{
                  border: '1.5px solid rgba(7, 26, 53, 0.1)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Entretien Diagnostic Initial</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>30 minutes • Visioconférence (Teams/Zoom)</p>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-accent)' }} />
              </div>

              <div 
                className="interactive"
                onClick={() => { alert("Session choisie. Redirection simulée vers Calendly..."); setShowRendezVousModal(false); }}
                style={{
                  border: '1.5px solid rgba(7, 26, 53, 0.1)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Consultation Recherche de Financement</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>45 minutes • Visioconférence ou présentiel Akwa</p>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>

            <button 
              className="btn btn-outline interactive" 
              onClick={() => setShowRendezVousModal(false)}
              style={{ width: '100%' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Blog Article Full View Modal */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div className="blog-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn interactive" onClick={() => setSelectedArticle(null)}>
              <X size={24} />
            </button>
            <div className="blog-modal-header-image">
              <img src={selectedArticle.image} alt={selectedArticle.title} />
              <div className="blog-modal-category">{selectedArticle.category}</div>
            </div>
            <div className="blog-modal-content-wrapper">
              <div className="blog-modal-meta">
                <span className="blog-modal-date">{selectedArticle.date}</span>
                <span className="blog-modal-separator">•</span>
                <span className="blog-modal-readtime">Lecture : 5 min</span>
              </div>
              <h1 className="blog-modal-title">{selectedArticle.title}</h1>
              
              <div className="blog-modal-body">
                {renderArticleContent(selectedArticle.content)}
              </div>

              {/* SEO Tags metadata display inside article for compliance */}
              <div className="blog-modal-seo-tags">
                <strong>Mots-clés SEO :</strong> <em>{selectedArticle.keywords}</em>
              </div>

              <div className="blog-modal-cta">
                <h3>Besoin d'un accompagnement personnalisé ?</h3>
                <p>Déterminez la viabilité de votre projet avec un expert lors d'un entretien diagnostic offert de 30 minutes.</p>
                <button 
                  className="btn btn-primary interactive"
                  onClick={() => {
                    setSelectedArticle(null);
                    setShowRendezVousModal(true);
                  }}
                >
                  Prendre rendez-vous <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents helper for Custom Cursor tracking
function CustomCursor({ cursorPos, cursorTrail, cursorHovered }) {
  return (
    <>
      <div 
        className="custom-cursor-dot" 
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`
        }}
      />
      <div 
        className="custom-cursor" 
        style={{
          left: `${cursorTrail.x}px`,
          top: `${cursorTrail.y}px`,
          width: cursorHovered ? '48px' : '24px',
          height: cursorHovered ? '48px' : '24px',
          backgroundColor: cursorHovered ? 'rgba(200, 169, 90, 0.1)' : 'transparent',
          borderColor: cursorHovered ? '#C8A95A' : '#C8A95A',
          transform: `translate(-50%, -50%) scale(${cursorHovered ? 1.25 : 1})`
        }}
      />
    </>
  );
}
