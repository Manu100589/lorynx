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
  Compass,
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
  Layers,
  Plus
} from 'lucide-react';
import './App.css';
import { translations } from './translations';

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
  const servicesCarouselRef = useRef(null);
  const quotesCarouselRef = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRendezVousModal, setShowRendezVousModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [processedFounderSrc, setProcessedFounderSrc] = useState(null);
  const [activeValeurIndex, setActiveValeurIndex] = useState(0);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'fr');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let obj = translations[language];
    for (const k of keys) {
      if (!obj || !obj[k]) return key;
      obj = obj[k];
    }
    return obj;
  };

  const valeurs = [
    {
      title: "Excellence",
      description: "Nous nous positionnons pour être les meilleurs dans nos champs de compétence. Avec des méthodes inédites qui garantissent les résultats. Des résultats font nos éloges.",
      icon: <Award size={32} />
    },
    {
      title: "Innovation Continue",
      description: "Une entreprise qui stagne est vouée à la faillite. Nous nous réinventons tous les jours pour vous servir ce qu'il y a de mieux, afin d'anticiper les ruptures sectorielles.",
      icon: <Zap size={32} />
    },
    {
      title: "Performance",
      description: "Traduire la stratégie en indicateurs financiers mesurables. Nous calibrons des solutions pragmatiques conçues pour propulser l'efficacité opérationnelle et la rentabilité.",
      icon: <TrendingUp size={32} />
    },
    {
      title: "Croissance Durable",
      description: "Construire l'avenir sur des bases saines. Nous accompagnons les dirigeants dans l'établissement de structures pérennes capables de résister aux crises macroéconomiques.",
      icon: <ShieldCheck size={32} />
    }
  ];
  
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

  // Process the founder's portrait to key out the white background smoothly
  useEffect(() => {
    const img = new Image();
    img.src = '/founder.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Calculate average brightness
        const brightness = (r + g + b) / 3;
        
        // If the pixel is very bright (near-white), make it transparent or semi-transparent
        if (brightness > 240) {
          const factor = Math.max(0, (255 - brightness) / (255 - 240)); // 0 to 1
          data[i + 3] = Math.floor(data[i + 3] * factor);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setProcessedFounderSrc(canvas.toDataURL());
    };
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

    // Hero Video Zoom at load and Parallax on scroll
    gsap.fromTo('.hero-video-bg',
      { scale: 1.15 },
      { scale: 1.0, duration: 2.2, ease: 'power2.out' }
    );
    gsap.to('.hero-video-bg', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Premium Typographical Hero portrait fade in on scroll
    if (processedFounderSrc) {
      gsap.fromTo('.hero-portrait-img', 
        { opacity: 0, y: 55 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '250px top',
            scrub: 1.2,
          }
        }
      );
    }

    // Hero title backdrop character reveal (Blur + Mask + Letter + Scale)
    gsap.fromTo('.hero-bg-text .char-reveal',
      { filter: 'blur(10px)', y: '90%', opacity: 0, scale: 0.96 },
      {
        filter: 'blur(0px)',
        y: '0%',
        opacity: 0.22,
        scale: 1,
        duration: 1.4,
        stagger: 0.05,
        ease: 'power4.out',
        delay: 0.2
      }
    );
    
    // Parallax on backdrop text
    gsap.to('.hero-bg-text', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Hero left badges slide in
    gsap.fromTo('.hero-badge-pill', {
      x: -40,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 1.0,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.6
    });

    // Hero subtitle word-by-word reveal
    gsap.fromTo('.hero-right-desc .word-reveal',
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.9
      }
    );

    // Hero center action button slide & fade
    gsap.fromTo('.hero-center-actions-bottom', {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 1.2
    });

    // Section title H2 Mask Reveals
    gsap.utils.toArray('.mask-reveal-title').forEach((title) => {
      const text = title.querySelector('.mask-text');
      const overlay = title.querySelector('.mask-overlay');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          toggleActions: 'play reverse play reverse'
        }
      });
      
      tl.to(overlay, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' })
        .set(text, { opacity: 1, filter: 'blur(0px)' })
        .to(overlay, { transformOrigin: 'right', scaleX: 0, duration: 0.5, ease: 'power2.inOut' });
    });

    // Paragraph scroll reveals (Opacity 0 -> 1, translateY 40px -> 0px, 0.8s, 20% visible)
    gsap.utils.toArray('.scroll-fade-p').forEach((p) => {
      gsap.fromTo(p,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: p,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });



    // Reveal 3D Values Carousel on scroll and descroll
    gsap.fromTo('.valeurs-carousel-container', 
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.valeurs-carousel-container',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    // Staggered scroll reveal for Benefits cards on scroll and descroll
    gsap.utils.toArray('.benefit-card').forEach((card) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // Services Section Icons entrance
    gsap.fromTo('.service-icon-box',
      { rotation: -45, scale: 0.5, opacity: 0 },
      {
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    // Stagger reveal the service cards
    gsap.fromTo('.service-card',
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    // Reveal Testimonials on scroll and descroll
    gsap.fromTo('.testimonial-active-card, .testimonial-thumb', 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    // Reveal Blog cards and their image zoom reveals
    gsap.fromTo('.blog-card', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blog-section',
          start: 'top 80%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    // Image Mask Reveal & Parallax
    gsap.utils.toArray('.reveal-image-container').forEach((container) => {
      const overlay = container.querySelector('.reveal-image-overlay');
      const img = container.querySelector('.parallax-img');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
      
      tl.to(overlay, { scaleX: 0, duration: 0.8, ease: 'power2.inOut' })
        .to(img, { scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');
        
      gsap.to(img, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // Reveal Contact form and details on scroll and descroll
    gsap.fromTo('.contact-info, .contact-card', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top 80%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

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

    // Horizontal scroll timeline and Methodology progress bar
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

      // Fill horizontal methodology timeline progress bar
      gsap.fromTo('.methodology-progress-bar-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.methodology-pinned-section',
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: 1.2,
          }
        }
      );
    }

    // Force ScrollTrigger to calculate all scroll positions after elements render
    ScrollTrigger.refresh();

  }, { scope: containerRef, dependencies: [loading, processedFounderSrc] });

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

  const handle3DCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 12; // rotateX
    const angleY = (x - xc) / 12; // rotateY
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-6px)`;
    card.style.boxShadow = `0 25px 50px -12px rgba(7, 26, 53, 0.25), 0 0 25px rgba(200, 169, 90, 0.12)`;
  };

  const handle3DCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    card.style.boxShadow = '';
  };

  const testimonials = [
    {
      quote: t('testimonials.list.0.quote'),
      author: t('testimonials.list.0.author'),
      role: t('testimonials.list.0.role'),
      company: t('testimonials.list.0.company'),
      avatar: "/avatar_jean.png",
      initials: "JM"
    },
    {
      quote: t('testimonials.list.1.quote'),
      author: t('testimonials.list.1.author'),
      role: t('testimonials.list.1.role'),
      company: t('testimonials.list.1.company'),
      avatar: "/avatar_sonia.png",
      initials: "SK"
    },
    {
      quote: t('testimonials.list.2.quote'),
      author: t('testimonials.list.2.author'),
      role: t('testimonials.list.2.role'),
      company: t('testimonials.list.2.company'),
      avatar: "/avatar_alain.png",
      initials: "AN"
    }
  ];

  const blogArticles = [
    {
      id: 1,
      category: "Gouvernance",
      date: "24 Juin 2026",
      title: t('blog.articles.0.title'),
      excerpt: t('blog.articles.0.excerpt'),
      image: "/boardroom_meeting.png",
      keywords: "restructuration entreprise Cameroun, gouvernance stratégique, gestion de crise PME, Loryns Consulting",
      content: t('blog.articles.0.content')
    },
    {
      id: 2,
      category: "Finance",
      date: "18 Juin 2026",
      title: t('blog.articles.1.title'),
      excerpt: t('blog.articles.1.excerpt'),
      image: "/about_tech_work.png",
      keywords: "levée de fonds Afrique, financement PME Cameroun, ingénierie financière, BDEAC, banque Douala",
      content: t('blog.articles.1.content')
    },
    {
      id: 3,
      category: "Digitalisation",
      date: "10 Juin 2026",
      title: t('blog.articles.2.title'),
      excerpt: t('blog.articles.2.excerpt'),
      image: "/about_team_hands.png",
      keywords: "transformation digitale PME, performance opérationnelle, digitalisation Douala, automatisation processus",
      content: t('blog.articles.2.content')
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

  const galleryItems = [
    { src: "/1740742774600.jpgeee.jpeg", category: language === 'fr' ? "Séminaire" : "Seminar", title: language === 'fr' ? "Conférence Stratégique Akwa" : "Akwa Strategic Keynote" },
    { src: "/1767904114499.jpg.jpeg", category: language === 'fr' ? "Gouvernance" : "Governance", title: language === 'fr' ? "Comité de Direction Loryns" : "Loryns Board Meeting" },
    { src: "/1767905080265.jpg.jpeg", category: language === 'fr' ? "Stratégie" : "Strategy", title: language === 'fr' ? "Workshop avec les Associés" : "Partner Workshop Session" },
    { src: "/1767905084579.jpg.jpeg", category: language === 'fr' ? "Finance" : "Finance", title: language === 'fr' ? "Ingénierie Financière" : "Financial Engineering" },
    { src: "/1767905091093.jpg.jpeg", category: language === 'fr' ? "Négociation" : "Negotiation", title: language === 'fr' ? "Partenariat Institutionnel Douala" : "Douala Institutional Partnership" },
    { src: "/1767905095215.jpg.jpeg", category: language === 'fr' ? "Digitalisation" : "Digitalization", title: language === 'fr' ? "Lancement Plateforme PME" : "SME Platform Launch" },
    { src: "/1767905100381.jpg.jpeg", category: language === 'fr' ? "Cabinet" : "Firm", title: language === 'fr' ? "Réunion Équipe Loryns" : "Loryns Team Alignment" },
    { src: "/dddd.jpeg", category: language === 'fr' ? "Conseil" : "Advisory", title: language === 'fr' ? "Évaluation de Portefeuille" : "Portfolio Valuation" }
  ];

  const faqs = [
    {
      question: t('faq.list.0.question'),
      answer: t('faq.list.0.answer')
    },
    {
      question: t('faq.list.1.question'),
      answer: t('faq.list.1.answer')
    },
    {
      question: t('faq.list.2.question'),
      answer: t('faq.list.2.answer')
    },
    {
      question: t('faq.list.3.question'),
      answer: t('faq.list.3.answer')
    },
    {
      question: t('faq.list.4.question'),
      answer: t('faq.list.4.answer')
    }
  ];

  // 17 services grouped into 3 strategic tabs
  const servicesData = {
    conseil: [
      {
        num: "01",
        title: t('services.conseil.0.title'),
        desc: t('services.conseil.0.desc'),
        features: [t('services.conseil.0.features.0'), t('services.conseil.0.features.1'), t('services.conseil.0.features.2')]
      },
      {
        num: "02",
        title: t('services.conseil.1.title'),
        desc: t('services.conseil.1.desc'),
        features: [t('services.conseil.1.features.0'), t('services.conseil.1.features.1'), t('services.conseil.1.features.2')]
      },
      {
        num: "03",
        title: t('services.conseil.2.title'),
        desc: t('services.conseil.2.desc'),
        features: [t('services.conseil.2.features.0'), t('services.conseil.2.features.1'), t('services.conseil.2.features.2')]
      },
      {
        num: "04",
        title: t('services.conseil.3.title'),
        desc: t('services.conseil.3.desc'),
        features: [t('services.conseil.3.features.0'), t('services.conseil.3.features.1'), t('services.conseil.3.features.2')]
      },
      {
        num: "05",
        title: t('services.conseil.4.title'),
        desc: t('services.conseil.4.desc'),
        features: [t('services.conseil.4.features.0'), t('services.conseil.4.features.1'), t('services.conseil.4.features.2')]
      },
      {
        num: "06",
        title: t('services.conseil.5.title'),
        desc: t('services.conseil.5.desc'),
        features: [t('services.conseil.5.features.0'), t('services.conseil.5.features.1'), t('services.conseil.5.features.2')]
      }
    ],
    finance: [
      {
        num: "07",
        title: t('services.finance.0.title'),
        desc: t('services.finance.0.desc'),
        features: [t('services.finance.0.features.0'), t('services.finance.0.features.1'), t('services.finance.0.features.2')]
      },
      {
        num: "08",
        title: t('services.finance.1.title'),
        desc: t('services.finance.1.desc'),
        features: [t('services.finance.1.features.0'), t('services.finance.1.features.1'), t('services.finance.1.features.2')]
      },
      {
        num: "09",
        title: t('services.finance.2.title'),
        desc: t('services.finance.2.desc'),
        features: [t('services.finance.2.features.0'), t('services.finance.2.features.1'), t('services.finance.2.features.2')]
      },
      {
        num: "10",
        title: t('services.finance.3.title'),
        desc: t('services.finance.3.desc'),
        features: [t('services.finance.3.features.0'), t('services.finance.3.features.1'), t('services.finance.3.features.2')]
      },
      {
        num: "11",
        title: t('services.finance.4.title'),
        desc: t('services.finance.4.desc'),
        features: [t('services.finance.4.features.0'), t('services.finance.4.features.1'), t('services.finance.4.features.2')]
      }
    ],
    digital: [
      {
        num: "12",
        title: t('services.digital.0.title'),
        desc: t('services.digital.0.desc'),
        features: [t('services.digital.0.features.0'), t('services.digital.0.features.1'), t('services.digital.0.features.2')]
      },
      {
        num: "13",
        title: t('services.digital.1.title'),
        desc: t('services.digital.1.desc'),
        features: [t('services.digital.1.features.0'), t('services.digital.1.features.1'), t('services.digital.1.features.2')]
      },
      {
        num: "14",
        title: t('services.digital.2.title'),
        desc: t('services.digital.2.desc'),
        features: [t('services.digital.2.features.0'), t('services.digital.2.features.1'), t('services.digital.2.features.2')]
      },
      {
        num: "15",
        title: t('services.digital.3.title'),
        desc: t('services.digital.3.desc'),
        features: [t('services.digital.3.features.0'), t('services.digital.3.features.1'), t('services.digital.3.features.2')]
      },
      {
        num: "16",
        title: t('services.digital.4.title'),
        desc: t('services.digital.4.desc'),
        features: [t('services.digital.4.features.0'), t('services.digital.4.features.1'), t('services.digital.4.features.2')]
      },
      {
        num: "17",
        title: t('services.digital.5.title'),
        desc: t('services.digital.5.desc'),
        features: [t('services.digital.5.features.0'), t('services.digital.5.features.1'), t('services.digital.5.features.2')]
      }
    ]
  };

  const allServicesList = [
    ...servicesData.conseil.map((s, idx) => ({ ...s, category: 'conseil', iconIndex: idx })),
    ...servicesData.finance.map((s, idx) => ({ ...s, category: 'finance', iconIndex: idx })),
    ...servicesData.digital.map((s, idx) => ({ ...s, category: 'digital', iconIndex: idx }))
  ];

  const scrollServices = (direction) => {
    if (servicesCarouselRef.current) {
      const scrollAmount = servicesCarouselRef.current.offsetWidth * 0.75;
      servicesCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollQuotes = (direction) => {
    if (quotesCarouselRef.current) {
      const scrollAmount = quotesCarouselRef.current.offsetWidth * 0.75;
      quotesCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Votre demande de consultation a bien été envoyée. Un associé de Loryns Strategic Consulting vous contactera sous 24 heures.");
  };

  return (
    <div ref={containerRef}>
      {/* Premium noise grain layer */}
      <div className="noise-overlay"></div>

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
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.cabinet')}</a>
            <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.vision')}</a>
            <a href="#valeurs" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.valeurs')}</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.services')}</a>
            <a href="#methodology" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.methodology')}</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.gallery')}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="navbar-link interactive">{t('nav.contact')}</a>
            
            {/* Language Selector */}
            <div className="language-selector-wrap">
              <button 
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} 
                className="language-toggle-btn interactive"
                aria-label="Toggle language"
              >
                <Globe size={15} className="lang-globe-icon" />
                <span className={`lang-text ${language === 'fr' ? 'active' : ''}`}>FR</span>
                <span className="lang-separator">|</span>
                <span className={`lang-text ${language === 'en' ? 'active' : ''}`}>EN</span>
              </button>
            </div>

            <div 
              className="magnetic-wrap"
              onMouseMove={(e) => handleMagneticMove(e, 0.2)}
              onMouseLeave={handleMagneticLeave}
            >
              <button 
                onClick={() => { setShowRendezVousModal(true); setMobileMenuOpen(false); }} 
                className="btn btn-primary navbar-btn interactive"
              >
                {t('nav.rdv')}
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
      <section id="hero" className="hero overlap-section" style={{ '--z-index': 1 }}>
        <div className="hero-frame-container">
          <div className="hero-inner-frame">
            {/* Ambient Background Video */}
            <div className="hero-video-container">
              <video 
                src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c02227d8787f311c6d7132103f6fdf35&profile_id=139&oauth2_token_id=57447761"
                autoPlay 
                loop 
                muted 
                playsInline 
                className="hero-video-bg"
              />
              <div className="hero-video-overlay"></div>
            </div>

            {/* Ambient Background Lights */}
            <div className="hero-ambient-glow"></div>
            <div className="hero-gold-glow"></div>
            
            {/* Big Backdrop Typography with Character Reveals */}
            <div className="hero-bg-text">
              <div className="hero-bg-text-line-1">
                {t('hero.logoLabel').split('').map((char, idx) => (
                  <span key={idx} className="char-reveal">{char}</span>
                ))}
              </div>
              <div className="hero-bg-text-line-2">
                {(language === 'fr' ? 'STRATEGIC' : 'STRATEGIC').split('').map((char, idx) => (
                  <span key={idx} className="char-reveal">{char}</span>
                ))}
              </div>
            </div>

            {/* Center Portrait */}
            {processedFounderSrc && (
              <div className="hero-portrait-container">
                <img 
                  src={processedFounderSrc} 
                  alt="Président Fondateur Loryns" 
                  className="hero-portrait-img" 
                />
              </div>
            )}
            {/* Left Side Pill Badges */}
            <div className="hero-left-badges">
              <div className="hero-badge-pill interactive">
                <span className="gold-dot">•</span> {t('hero.badge2')}
              </div>
              <div className="hero-badge-pill interactive">
                <span className="gold-dot">•</span> {t('hero.badge1')}
              </div>
              <div className="hero-badge-pill interactive">
                <span className="gold-dot">•</span> {t('hero.badge3')}
              </div>
            </div>

            {/* Right Side Slogan/Description */}
            <div className="hero-right-desc">
              <div className="hero-desc-tag">{language === 'fr' ? "Cabinet Conseil Agréé" : "Certified Advisory Firm"}</div>
              <div className="hero-desc-title">{language === 'fr' ? "Nous faisons avancer votre entreprise" : "We move your business forward"}</div>
              <div className="hero-desc-text">
                {(language === 'fr' 
                  ? "Nous calibrons des solutions pragmatiques conçues pour propulser l'efficacité opérationnelle et la rentabilité." 
                  : "We calibrate pragmatic solutions designed to propel operational efficiency and profitability."
                ).split(' ').map((word, idx) => (
                  <span key={idx} className="word-reveal">{word} </span>
                ))}
              </div>
            </div>

            {/* Scroll Mouse Indicator */}
            <a href="#about" className="hero-scroll-indicator-custom interactive">
              <span>{language === 'fr' ? "Faire défiler" : "Scroll down"}</span>
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
              <a href="#services" className="btn btn-primary interactive">{language === 'fr' ? "Découvrir nos services" : "Discover our services"}</a>
            </div>
            <span className="hero-brush-text">{t('hero.brush')}</span>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi Loryns ?" Redesigned */}
      <section id="about" className="about-new-section overlap-section" style={{ '--z-index': 2 }}>
        <div className="container">
          <div className="about-new-card scroll-fade-p">
            
            {/* Left Column: Information */}
            <div className="about-new-left">
              <div className="about-new-badge">
                <Check size={14} className="about-new-badge-icon" />
                <span>{t('about.badge')}</span>
              </div>
              
              <h2 className="about-new-title">
                {t('about.titlePre')} <span className="text-highlight">{t('about.titleHighlight')}</span>
              </h2>
              
              <p className="about-new-description">
                {t('about.description')}
              </p>
              
              <div className="about-new-actions">
                <a href="#contact" className="btn btn-primary interactive">
                  {t('about.btnPrimary')}
                </a>
                <a href="#services" className="btn btn-outline interactive">
                  {t('about.btnOutline')}
                </a>
              </div>
              
              <div className="about-new-stats">
                <div className="about-new-stat-item">
                  <div className="stat-value">
                    <Counter endValue={350} suffix="+" />
                  </div>
                  <div className="stat-label">{t('about.stat1Lbl')}</div>
                </div>
                <div className="about-new-stat-item">
                  <div className="stat-value">
                    <Counter endValue={100} suffix="%" />
                  </div>
                  <div className="stat-label">{t('about.stat2Lbl')}</div>
                </div>
                <div className="about-new-stat-item">
                  <div className="stat-value">
                    <Counter endValue={15} suffix="+" />
                  </div>
                  <div className="stat-label">{t('about.stat3Lbl')}</div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Visual Image and Testimonial Quote */}
            <div className="about-new-right">
              <div className="about-new-image-wrapper">
                <img src="/about_team_collab.png" alt="Loryns Team Collaboration" className="about-new-img" />
                
                {/* Top Right Badge Overlay */}
                <div className="about-new-img-badge-tr">
                  <span>{t('about.imgBadgeTr')}</span>
                </div>
                
                {/* Bottom Left Pill Overlay */}
                <div className="about-new-img-badge-bl">
                  <Check size={12} className="badge-icon-gold" />
                  <span>{t('about.imgBadgeBl')}</span>
                </div>
              </div>
              
              {/* Testimonial Quote Block */}
              <div className="about-new-testimonial">
                <img src="/avatar_jean.png" alt="Jean-Pierre Ngoumou" className="testimonial-avatar" />
                <div className="testimonial-content">
                  <p className="testimonial-quote">
                    {t('about.quote')}
                  </p>
                  <h5 className="testimonial-author">
                    {t('about.author')} <span className="author-role">- {t('about.role')}</span>
                  </h5>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Pinned Vision Section */}
      <section id="vision" className="vision-pinned-section overlap-section" style={{ '--z-index': 3 }}>
        <div className="vision-sticky-wrapper">
          <div className="vision-bg-pattern"></div>
          <div className="vision-ambient-glow"></div>
          
          <div className="container vision-custom-container">
            <div className="vision-grid">
              
              {/* Left Side: Strategic Pillars */}
              <div className="vision-left-side">
                <div className="section-tag" style={{ color: '#C8A95A', marginBottom: '1.5rem' }}>{t('vision.tag')}</div>
                <h3 className="vision-left-title">
                  {language === 'fr' ? "Bâtir les leaders de l'économie africaine de demain." : "Building the leaders of tomorrow's African economy."}
                </h3>
                
                <div className="vision-pillars">
                  <div className="vision-pillar-card interactive">
                    <div className="vision-pillar-num">{t('vision.p1Num')}</div>
                    <div className="vision-pillar-content">
                      <h4>{t('vision.p1Title')}</h4>
                      <p>{t('vision.p1Text')}</p>
                    </div>
                  </div>
                  
                  <div className="vision-pillar-card interactive">
                    <div className="vision-pillar-num">{t('vision.p2Num')}</div>
                    <div className="vision-pillar-content">
                      <h4>{t('vision.p2Title')}</h4>
                      <p>{t('vision.p2Text')}</p>
                    </div>
                  </div>
                  
                  <div className="vision-pillar-card interactive">
                    <div className="vision-pillar-num">{t('vision.p3Num')}</div>
                    <div className="vision-pillar-content">
                      <h4>{t('vision.p3Title')}</h4>
                      <p>{t('vision.p3Text')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Text Reveal in a Premium Glass Card */}
              <div className="vision-right-side">
                <div className="vision-glass-card">
                  <div className="vision-card-glow"></div>
                  <div className="vision-card-header">
                    <div className="vision-card-icon">
                      <Compass size={24} color="#C8A95A" />
                    </div>
                    <span className="vision-card-tag">{language === 'fr' ? "Déclaration de Vision" : "Vision Statement"}</span>
                  </div>
                  
                  <div className="vision-text-reveal-container">
                    <h2 className="vision-text-layer">
                      {(language === 'fr' 
                        ? "Accompagner les dirigeants et les entreprises vers une croissance exponentielle, une meilleure compétitivité sectorielle et une notoriété internationale durable, grâce à un management stratégique rigoureux de haut niveau." 
                        : "Guiding executives and enterprises toward exponential growth, stronger sectoral competitiveness, and sustainable global reputation through high-level strategic management."
                      ).split(' ').map((word, index) => (
                        <span key={index} className="vision-word">
                          {word}{' '}
                        </span>
                      ))}
                    </h2>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs & Pourquoi collaborer (Fondations & Valeur ajoutée) */}
      <section id="valeurs" className="valeurs-benefits-section overlap-section" style={{ '--z-index': 4 }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>{t('valeurs.tag')}</div>
            <h2 className="section-title mask-reveal-title">
              <span className="mask-text">{t('valeurs.title')}</span>
              <span className="mask-overlay"></span>
            </h2>
            <p className="scroll-fade-p" style={{ marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              {t('valeurs.subtitle')}
            </p>
          </div>

          {/* 3D Carousel Viewport */}
          <div className="valeurs-carousel-container">
            <div className="valeurs-carousel-viewport">
              {valeurs.map((valeur, index) => {
                let position = 'far-back';
                if (index === activeValeurIndex) {
                  position = 'active';
                } else if (index === (activeValeurIndex + 1) % valeurs.length) {
                  position = 'next';
                } else if (index === (activeValeurIndex - 1 + valeurs.length) % valeurs.length) {
                  position = 'prev';
                }
                
                return (
                  <div 
                    key={index} 
                    className={`valeur-3d-card ${position}`}
                    onClick={() => {
                      if (position === 'next') setActiveValeurIndex((activeValeurIndex + 1) % valeurs.length);
                      if (position === 'prev') setActiveValeurIndex((activeValeurIndex - 1 + valeurs.length) % valeurs.length);
                    }}
                  >
                    <div className="valeur-icon-container">
                      {valeur.icon}
                    </div>
                    <h3>{valeur.title}</h3>
                    <p>{valeur.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Carousel Controls */}
            <div className="valeurs-carousel-controls">
              <button 
                onClick={() => setActiveValeurIndex((activeValeurIndex - 1 + valeurs.length) % valeurs.length)}
                className="carousel-btn interactive"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="carousel-indicators">
                {valeurs.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveValeurIndex(index)}
                    className={`indicator-dot ${index === activeValeurIndex ? 'active' : ''} interactive`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setActiveValeurIndex((activeValeurIndex + 1) % valeurs.length)}
                className="carousel-btn interactive"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="valeurs-benefits-separator"></div>

          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>{t('benefits.tag')}</div>
            <h2 className="section-title mask-reveal-title">
              <span className="mask-text">{t('benefits.title')}</span>
              <span className="mask-overlay"></span>
            </h2>
            <p className="scroll-fade-p" style={{ marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <TrendingUp size={28} />
              </div>
              <h3>{t('benefits.cards.0.title')}</h3>
              <p>{t('benefits.cards.0.desc')}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Briefcase size={28} />
              </div>
              <h3>{t('benefits.cards.1.title')}</h3>
              <p>{t('benefits.cards.1.desc')}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={28} />
              </div>
              <h3>{t('benefits.cards.2.title')}</h3>
              <p>{t('benefits.cards.2.desc')}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Clock size={28} />
              </div>
              <h3>{t('benefits.cards.3.title')}</h3>
              <p>{t('benefits.cards.3.desc')}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Globe size={28} />
              </div>
              <h3>{t('benefits.cards.4.title')}</h3>
              <p>{t('benefits.cards.4.desc')}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>{t('benefits.cards.5.title')}</h3>
              <p>{t('benefits.cards.5.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Services Redesigned as a Horizontal Carousel */}
      <section id="services" className="services-section overlap-section" style={{ '--z-index': 5 }}>
        <div className="container">
          
          <div className="services-new-header">
            <div className="services-new-header-left">
              <div className="section-tag">★ {t('services.tag')}</div>
              <h2 className="services-new-title">
                {language === 'fr' 
                  ? "Des expertises clés pour propulser votre réussite d'affaires." 
                  : "Essential expertise for modern business success."}
              </h2>
            </div>
            <div className="services-new-header-right">
              <p className="services-new-desc">{t('services.subtitle')}</p>
              <div className="services-carousel-nav">
                <button className="carousel-nav-btn prev interactive" onClick={() => scrollServices('left')} aria-label="Previous">
                  <ChevronLeft size={20} />
                </button>
                <button className="carousel-nav-btn next interactive" onClick={() => scrollServices('right')} aria-label="Next">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="services-carousel-wrapper">
            <div className="services-carousel-track" ref={servicesCarouselRef}>
              {allServicesList.map((service, index) => {
                const cardStyles = ['card-style-white', 'card-style-gold', 'card-style-dark'];
                const styleClass = cardStyles[index % 3];
                return (
                  <div 
                    key={index} 
                    className={`service-new-card ${styleClass} interactive`}
                    onClick={() => setShowRendezVousModal(true)}
                  >
                    <div className="service-new-card-header">
                      <div className="service-new-icon-box">
                        {service.category === 'conseil' && service.iconIndex === 0 && <TrendingUp size={24} />}
                        {service.category === 'conseil' && service.iconIndex === 1 && <Building size={24} />}
                        {service.category === 'conseil' && service.iconIndex === 2 && <BarChart2 size={24} />}
                        {service.category === 'conseil' && service.iconIndex === 3 && <UserCheck size={24} />}
                        {service.category === 'conseil' && service.iconIndex === 4 && <Users size={24} />}
                        {service.category === 'conseil' && service.iconIndex === 5 && <ShieldCheck size={24} />}
                        
                        {service.category === 'finance' && service.iconIndex === 0 && <Briefcase size={24} />}
                        {service.category === 'finance' && service.iconIndex === 1 && <Layers size={24} />}
                        {service.category === 'finance' && service.iconIndex === 2 && <RefreshCw size={24} />}
                        {service.category === 'finance' && service.iconIndex === 3 && <FileText size={24} />}
                        {service.category === 'finance' && service.iconIndex === 4 && <Users size={24} />}
                        
                        {service.category === 'digital' && service.iconIndex === 0 && <Globe size={24} />}
                        {service.category === 'digital' && service.iconIndex === 1 && <Settings size={24} />}
                        {service.category === 'digital' && service.iconIndex === 2 && <Clock size={24} />}
                        {service.category === 'digital' && service.iconIndex === 3 && <MessageSquare size={24} />}
                        {service.category === 'digital' && service.iconIndex === 4 && <MessageCircle size={24} />}
                        {service.category === 'digital' && service.iconIndex === 5 && <Sparkles size={24} />}
                      </div>
                      <div className="service-new-num">#{service.num}</div>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    
                    <button className="service-new-card-btn interactive" onClick={(e) => { e.stopPropagation(); setShowRendezVousModal(true); }}>
                      <span>{language === 'fr' ? "En savoir plus" : "Explore More"}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Pinned Methodology Section */}
      <div className="methodology-pinned-section" id="methodology" style={{ '--z-index': 6 }}>
        <section className="methodology-section" style={{ padding: 0 }}>
          <div className="methodology-viewport-wrapper" style={{ position: 'relative', height: '100vh', minHeight: '560px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100vw', overflow: 'hidden' }}>
            
            <div className="container">
              <div className="section-header" style={{ marginBottom: '2rem' }}>
                <div className="section-tag" style={{ color: '#C8A95A' }}>{t('methodology.tag')}</div>
                <h2 className="section-title mask-reveal-title">
                  <span className="mask-text">{t('methodology.title')}</span>
                  <span className="mask-overlay"></span>
                </h2>
                <p className="scroll-fade-p" style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '1rem' }}>
                  {t('methodology.subtitle')}
                </p>
              </div>
            </div>

            <div className="methodology-scroll-container">
              <div className="methodology-timeline-line">
                <div className="methodology-progress-bar-fill"></div>
              </div>
              <div className="methodology-timeline-track">
                
                <div className="timeline-step">
                  <div className="timeline-step-node">1</div>
                  <div className="timeline-step-card">
                    <h4>{t('methodology.steps.0.title')}</h4>
                    <p>{t('methodology.steps.0.desc')}</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">2</div>
                  <div className="timeline-step-card">
                    <h4>{t('methodology.steps.1.title')}</h4>
                    <p>{t('methodology.steps.1.desc')}</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">3</div>
                  <div className="timeline-step-card">
                    <h4>{t('methodology.steps.2.title')}</h4>
                    <p>{t('methodology.steps.2.desc')}</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">4</div>
                  <div className="timeline-step-card">
                    <h4>{t('methodology.steps.3.title')}</h4>
                    <p>{t('methodology.steps.3.desc')}</p>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-step-node">5</div>
                  <div className="timeline-step-card">
                    <h4>{t('methodology.steps.4.title')}</h4>
                    <p>{t('methodology.steps.4.desc')}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Galerie Section */}
      <section id="gallery" className="gallery-section overlap-section" style={{ '--z-index': 7 }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>{t('gallery.tag')}</div>
            <h2 className="section-title" style={{ opacity: 1, transform: 'none' }}>
              <span>{t('gallery.title')}</span>
            </h2>
            <p style={{ marginTop: '1.5rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', opacity: 0.8 }}>
              {t('gallery.subtitle')}
            </p>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div 
                key={index} 
                className={`gallery-item item-${index + 1} interactive`}
                onClick={() => alert(language === 'fr' ? `Aperçu : ${item.title}` : `Preview: ${item.title}`)}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                <div className="gallery-overlay-icon">
                  <Plus size={24} />
                </div>
                <div className="gallery-item-overlay">
                  <span className="gallery-item-tag">{item.category}</span>
                  <h4 className="gallery-item-caption">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="testimonials" className="testimonials-section overlap-section" style={{ '--z-index': 8 }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>{t('testimonials.tag')}</div>
            <h2 className="section-title mask-reveal-title">
              <span className="mask-text">{t('testimonials.title')}</span>
              <span className="mask-overlay"></span>
            </h2>
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



      {/* FAQ Accordion */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>{t('faq.tag')}</div>
            <h2 className="section-title mask-reveal-title">
              <span className="mask-text">{t('faq.title')}</span>
              <span className="mask-overlay"></span>
            </h2>
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
                <div className="section-tag">{t('contact.tag')}</div>
                <h2 className="section-title mask-reveal-title" style={{ marginBottom: '1.5rem' }}>
                  <span className="mask-text">{t('contact.title')}</span>
                  <span className="mask-overlay"></span>
                </h2>
                <p className="scroll-fade-p">{t('contact.subtitle')}</p>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <MapPin size={24} />
                </div>
                <div className="contact-detail-content">
                  <h4>{t('contact.locTitle')}</h4>
                  <p>{t('contact.locDesc')}</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Phone size={24} />
                </div>
                <div className="contact-detail-content">
                  <h4>{language === 'fr' ? 'Téléphone' : 'Phone'}</h4>
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
                    <MessageCircle size={20} /> {language === 'fr' ? 'Échanger sur WhatsApp' : 'Chat on WhatsApp'}
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
                    <Calendar size={20} /> {language === 'fr' ? 'Réserver un créneau (Calendly)' : 'Book a Meeting (Calendly)'}
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
                    <label htmlFor="firstname">{language === 'fr' ? 'Prénom' : 'First Name'}</label>
                    <input type="text" id="firstname" required placeholder={language === 'fr' ? 'Jean' : 'John'} className="interactive" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">{language === 'fr' ? 'Nom' : 'Last Name'}</label>
                    <input type="text" id="lastname" required placeholder={language === 'fr' ? 'Moudiki' : 'Doe'} className="interactive" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">{language === 'fr' ? 'Email professionnel' : 'Professional Email'}</label>
                  <input type="email" id="email" required placeholder="contact@company.com" className="interactive" />
                </div>

                <div className="form-group">
                  <label htmlFor="company">{language === 'fr' ? 'Entreprise' : 'Company Name'}</label>
                  <input type="text" id="company" placeholder="Afrilog SA" className="interactive" />
                </div>

                <div className="form-group">
                  <label htmlFor="service">{language === 'fr' ? "Sujet d'intérêt" : 'Subject of Interest'}</label>
                  <select id="service" className="interactive">
                    <option value="strategie">{language === 'fr' ? 'Conseil Stratégique & Organisationnel' : 'Strategic & Organizational Consulting'}</option>
                    <option value="financement">{language === 'fr' ? 'Recherche de Financement' : 'Fundraising & Investment'}</option>
                    <option value="digital">{language === 'fr' ? 'Transformation Digitale & Informatique' : 'Digital & IT Transformation'}</option>
                    <option value="conformite">{language === 'fr' ? 'Norme, Qualité & Juridique' : 'Standards, Quality & Legal'}</option>
                    <option value="autre">{language === 'fr' ? 'Autre Demande' : 'Other Request'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{language === 'fr' ? 'Votre message' : 'Your Message'}</label>
                  <textarea id="message" rows="5" required placeholder={language === 'fr' ? "Décrivez brièvement les défis stratégiques de votre organisation..." : "Briefly describe the strategic challenges of your organization..."} className="interactive"></textarea>
                </div>

                <div 
                  className="magnetic-wrap"
                  onMouseMove={(e) => handleMagneticMove(e, 0.1)}
                  onMouseLeave={handleMagneticLeave}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <button type="submit" className="btn btn-primary interactive">
                    {language === 'fr' ? 'Envoyer ma demande' : 'Submit My Request'} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Citations Section */}
      <section className="quotes-section">
        <div className="container">
          <div className="quotes-header">
            <div className="quotes-header-left">
              <div className="section-tag">★ {language === 'fr' ? "Inspirations" : "Inspirations"}</div>
              <h2 className="quotes-title">
                {language === 'fr' 
                  ? "Pensées et principes directeurs d'excellence d'affaires." 
                  : "Key thoughts and principles guiding business excellence."}
              </h2>
            </div>
            <div className="quotes-header-right">
              <div className="quotes-carousel-nav">
                <button className="carousel-nav-btn prev interactive" onClick={() => scrollQuotes('left')} aria-label="Previous">
                  <ChevronLeft size={20} />
                </button>
                <button className="carousel-nav-btn next interactive" onClick={() => scrollQuotes('right')} aria-label="Next">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="quotes-carousel-wrapper">
            <div className="quotes-carousel-track" ref={quotesCarouselRef}>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="quote-card interactive">
                  <img src={`/quote${num}.jpg`} alt={`Loryns Strategic Inspiration ${num}`} loading="lazy" />
                </div>
              ))}
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
              <p>{language === 'fr' ? 'Cabinet conseil stratégique international de haut niveau. Nous accompagnons les dirigeants et propulsons la création de valeur durable en Afrique.' : 'High-level international strategic consulting firm. We guide business leaders and drive sustainable value creation in Africa.'}</p>
            </div>

            <div className="footer-links-col">
              <h4>{language === 'fr' ? 'Cabinet' : 'Company'}</h4>
              <ul className="footer-links">
                <li className="footer-link"><a href="#about" className="interactive">{language === 'fr' ? 'À propos' : 'About'}</a></li>
                <li className="footer-link"><a href="#vision" className="interactive">{t('vision.title')}</a></li>
                <li className="footer-link"><a href="#valeurs" className="interactive">{t('nav.valeurs')}</a></li>
                <li className="footer-link"><a href="#methodology" className="interactive">{t('nav.methodology')}</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>{language === 'fr' ? 'Expertises' : 'Expertise'}</h4>
              <ul className="footer-links">
                <li className="footer-link"><a href="#services" className="interactive">{language === 'fr' ? 'Conseil Stratégique' : 'Strategic Consulting'}</a></li>
                <li className="footer-link"><a href="#services" className="interactive">{language === 'fr' ? 'Services Financiers' : 'Financial Services'}</a></li>
                <li className="footer-link"><a href="#services" className="interactive">{language === 'fr' ? 'Transformation Digitale' : 'Digital Transformation'}</a></li>
                <li className="footer-link"><a href="#services" className="interactive">{language === 'fr' ? 'Expertise Réglementaire' : 'Regulatory Compliance'}</a></li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h4>Newsletter</h4>
              <p>{language === 'fr' ? 'Recevez nos analyses stratégiques mensuelles sur les opportunités de marché en Afrique centrale.' : 'Receive our monthly strategic insights on market opportunities in Central Africa.'}</p>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert(language === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for subscribing!'); }}>
                <input type="email" placeholder={language === 'fr' ? 'votre@adresse.com' : 'your@email.com'} required className="interactive" />
                <button type="submit" className="interactive">{language === 'fr' ? "S'abonner" : 'Subscribe'}</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              {language === 'fr' 
                ? `© ${new Date().getFullYear()} Loryns Strategic Consulting. Tous droits réservés. Mentions Légales | Politique de Confidentialité.`
                : `© ${new Date().getFullYear()} Loryns Strategic Consulting. All rights reserved. Legal Mentions | Privacy Policy.`}
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

            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{language === 'fr' ? 'Planifier un entretien stratégique' : 'Schedule a Strategic Consultation'}</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
              {language === 'fr' 
                ? "Sélectionnez le type d'entretien avec l'un de nos directeurs associés. La séance dure 30 minutes et a pour but de cadrer vos besoins immédiats." 
                : "Select the session type with one of our managing partners. The slot lasts 30 minutes and serves to frame your immediate requirements."}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div 
                className="interactive"
                onClick={() => { alert(language === 'fr' ? "Session choisie. Redirection simulée vers Calendly..." : "Session selected. Simulated redirection to Calendly..."); setShowRendezVousModal(false); }}
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
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{language === 'fr' ? 'Entretien Diagnostic Initial' : 'Initial Diagnostic Meeting'}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{language === 'fr' ? '30 minutes • Visioconférence (Teams/Zoom)' : '30 minutes • Video Conference (Teams/Zoom)'}</p>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-accent)' }} />
              </div>

              <div 
                className="interactive"
                onClick={() => { alert(language === 'fr' ? "Session choisie. Redirection simulée vers Calendly..." : "Session selected. Simulated redirection to Calendly..."); setShowRendezVousModal(false); }}
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
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{language === 'fr' ? 'Consultation Recherche de Financement' : 'Fundraising Consultation'}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{language === 'fr' ? '45 minutes • Visioconférence ou présentiel Akwa' : '45 minutes • Video Conference or On-site at Akwa'}</p>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>

            <button 
              className="btn btn-outline interactive" 
              onClick={() => setShowRendezVousModal(false)}
              style={{ width: '100%' }}
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
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
                <span className="blog-modal-readtime">{language === 'fr' ? 'Lecture : 5 min' : 'Reading time: 5 min'}</span>
              </div>
              <h1 className="blog-modal-title">{selectedArticle.title}</h1>
              
              <div className="blog-modal-body">
                {renderArticleContent(selectedArticle.content)}
              </div>

              {/* SEO Tags metadata display inside article for compliance */}
              <div className="blog-modal-seo-tags">
                <strong>{language === 'fr' ? 'Mots-clés SEO :' : 'SEO Keywords:'}</strong> <em>{selectedArticle.keywords}</em>
              </div>

              <div className="blog-modal-cta">
                <h3>{language === 'fr' ? "Besoin d'un accompagnement personnalisé ?" : 'Need personalized guidance?'}</h3>
                <p>{language === 'fr' ? "Déterminez la viabilité de votre projet avec un expert lors d'un entretien diagnostic offert de 30 minutes." : "Evaluate the viability of your business project with an expert during a free 30-minute diagnostic session."}</p>
                <button 
                  className="btn btn-primary interactive"
                  onClick={() => {
                    setSelectedArticle(null);
                    setShowRendezVousModal(true);
                  }}
                >
                  {language === 'fr' ? 'Prendre rendez-vous' : 'Book a meeting'} <ArrowRight size={18} />
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
          transform: `translate(-50%, -50%) scale(${cursorHovered ? 1.25 : 1})`,
          boxShadow: cursorHovered ? '0 0 20px rgba(200, 169, 90, 0.4)' : 'none'
        }}
      />
    </>
  );
}
