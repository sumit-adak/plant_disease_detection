import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  CalendarClock, 
  BarChart2, 
  CloudSun, 
  ArrowRight, 
  CheckCircle2,
  Compass,
  Leaf,
  Camera,
  Activity,
  Sparkles,
  Check
} from 'lucide-react';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const worksRef = useRef(null);
  const ctaRef = useRef(null);
  const confidenceCircleRef = useRef(null);

  useGSAP(() => {
    // Navbar Scroll Effect
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbarRef.current?.classList.add('scrolled');
      } else {
        navbarRef.current?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hero Animations (Timeline)
    const heroTl = gsap.timeline();
    heroTl
      .from(".landing-navbar", { y: -25, opacity: 0, duration: 0.85, ease: "power3.out" })
      .from(".hero-badge-pill", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.45")
      .from(".hero-title .title-line", { y: 35, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" }, "-=0.35")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.45")
      .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.45")
      .from(".hero-feature-indicators", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.45")
      .from(".hero-scanner-stage", { scale: 0.93, opacity: 0, duration: 1.1, ease: "power3.out" }, "-=0.9")
      .from(".scanner-floating-card", { y: 25, opacity: 0, stagger: 0.14, duration: 0.8, ease: "back.out(1.2)" }, "-=0.55")
      .from(".handwritten-brand-note", { opacity: 0, rotate: -8, duration: 0.9, ease: "power2.out" }, "-=0.3");

    // Animate the Confidence Progress Ring from 0 to 92%
    gsap.fromTo(".confidence-svg-ring", 
      { strokeDashoffset: 163.36 }, 
      { strokeDashoffset: 13.07, duration: 1.8, delay: 0.7, ease: "power2.out" }
    );

    // Features Scroll Animations
    gsap.from(".features h2", {
      scrollTrigger: { trigger: ".features", start: "top 80%" },
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
    });

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%" },
        y: 40, opacity: 0, duration: 0.7, delay: (i % 3) * 0.1, ease: "power3.out"
      });
    });

    // How It Works Scroll Animations
    gsap.from(".how-it-works h2", {
      scrollTrigger: { trigger: ".how-it-works", start: "top 80%" },
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
    });

    gsap.utils.toArray('.step').forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: "top 85%" },
        x: i % 2 === 0 ? -40 : 40, opacity: 0, duration: 0.8, ease: "power3.out"
      });
    });

    // CTA Scroll Animation
    gsap.from(".cta-content", {
      scrollTrigger: { trigger: ".cta-section", start: "top 85%" },
      y: 40, opacity: 0, duration: 1, ease: "power3.out"
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const topOffset = targetElement.getBoundingClientRect().top + window.scrollY - 105;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="landing-page">
      {/* Floating Pill Navigation Bar */}
      <nav className="landing-navbar" ref={navbarRef}>
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <Leaf size={22} className="logo-leaf-svg" />
          </div>
          <span className="landing-logo-text">PlantCare AI</span>
        </div>
        
        <div className="landing-nav-links">
          <a href="#features" className="nav-link-active" onClick={(e) => handleNavClick(e, '#features')}>
            Features
          </a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')}>
            How It Works
          </a>
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>
            About Us
          </a>
        </div>

        <div className="landing-nav-actions">
          <button className="nav-btn-signin" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="nav-btn-scan" onClick={() => navigate('/dashboard')}>
            <span>Try Free Scan</span>
            <ArrowRight size={16} className="nav-arrow-icon" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" ref={heroRef} id="about">
        {/* Soft Botanical Ambient Overlays */}
        <div className="hero-ambient-orb orb-tl"></div>
        <div className="hero-ambient-orb orb-br"></div>
        <div className="hero-ambient-orb orb-center"></div>

        <div className="hero-container">
          {/* Left Column: Hero Content (~45%) */}
          <div className="hero-content">
            {/* Top Pill Badge */}
            <div className="hero-badge-pill">
              <span className="badge-pill-icon">
                <Leaf size={14} />
              </span>
              <span className="badge-pill-text">AI-Powered Plant Health Assistant</span>
            </div>

            {/* Main Heading (3 visual lines) */}
            <h1 className="hero-title">
              <span className="title-line title-line-1">Save Your Harvest.</span>
              <span className="title-line title-line-2">Detect Disease</span>
              <span className="title-line title-line-3">Instantly.</span>
            </h1>

            {/* Supporting Text */}
            <p className="hero-subtitle">
              Empower your farming with AI-driven plant disease detection. Upload a photo of a leaf and get instant, accurate diagnostics.
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons">
              <button 
                className="clay-hero-btn clay-hero-btn-primary" 
                onClick={() => navigate('/dashboard')}
                aria-label="Start Diagnosis"
              >
                <Camera size={19} className="btn-camera-icon" />
                <span>Start Diagnosis</span>
                <ArrowRight size={18} className="hero-btn-icon" />
              </button>
              <button 
                className="clay-hero-btn clay-hero-btn-secondary" 
                onClick={(e) => handleNavClick(e, '#features')}
                aria-label="Explore More"
              >
                <span>Explore More</span>
              </button>
            </div>

            {/* Feature Indicators */}
            <div className="hero-feature-indicators">
              <div className="feature-indicator-item">
                <div className="indicator-icon-circle icon-circle-leaf">
                  <Leaf size={16} />
                </div>
                <div className="indicator-text">
                  <span className="indicator-title">AI-Powered</span>
                  <span className="indicator-subtitle">Analysis</span>
                </div>
              </div>

              <div className="indicator-separator"></div>

              <div className="feature-indicator-item">
                <div className="indicator-icon-circle icon-circle-zap">
                  <Zap size={16} />
                </div>
                <div className="indicator-text">
                  <span className="indicator-title">Fast &amp;</span>
                  <span className="indicator-subtitle">Accurate</span>
                </div>
              </div>

              <div className="indicator-separator"></div>

              <div className="feature-indicator-item">
                <div className="indicator-icon-circle icon-circle-shield">
                  <ShieldCheck size={16} />
                </div>
                <div className="indicator-text">
                  <span className="indicator-title">Better Yields</span>
                  <span className="indicator-subtitle">Healthier Crops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Square AI Plant Scanner & Floating Diagnostic Cards (~55%) */}
          <div className="hero-image-col">
            <div className="hero-scanner-stage">
              {/* Outer Molded Organic Clay Frame */}
              <div className="scanner-organic-frame">
                {/* Square 1:1 Viewport */}
                <div className="scanner-square-viewport">
                  <img 
                    src="/assets/diseased.png" 
                    alt="Diseased crop leaf showing symptoms" 
                    onError={(e) => { 
                      e.target.src = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'; 
                    }} 
                  />

                  {/* Horizontal Glowing Medical/AI Scanning Beam */}
                  <div className="scanner-scan-beam"></div>

                  {/* Corner Scan HUD Brackets */}
                  <div className="scanner-hud-reticles">
                    <span className="reticle-bracket top-left"></span>
                    <span className="reticle-bracket top-right"></span>
                    <span className="reticle-bracket bottom-left"></span>
                    <span className="reticle-bracket bottom-right"></span>
                  </div>

                  {/* Vignette Depth Overlay */}
                  <div className="scanner-vignette-overlay"></div>
                </div>
              </div>

              {/* Floating Card 1: Scanner Status Card (Top-Left) */}
              <div className="scanner-floating-card card-status float-anim-1">
                <div className="card-status-icon-wrap">
                  <Leaf size={16} className="status-leaf-icon" />
                  <span className="pulse-radar-dot"></span>
                </div>
                <div className="card-status-text">
                  <div className="card-status-title-row">
                    <span className="card-status-title">Scanning...</span>
                    <span className="scan-wave-bars">
                      <i></i><i></i><i></i>
                    </span>
                  </div>
                  <div className="card-status-sub">Analyzing leaf structure</div>
                </div>
              </div>

              {/* Floating Card 2: Diagnosis Card (Top-Right) */}
              <div className="scanner-floating-card card-diagnosis float-anim-2">
                <div className="card-diagnosis-tag-row">
                  <span className="card-diagnosis-tag">Disease Detected</span>
                  <span className="card-diagnosis-alert-dot"></span>
                </div>
                <div className="card-diagnosis-body">
                  <div className="card-diagnosis-thumb">
                    <img 
                      src="/assets/diseased.png" 
                      alt="Lesion detail" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=120&q=80'; }} 
                    />
                  </div>
                  <div className="card-diagnosis-info">
                    <h4 className="disease-title">Leaf Spot</h4>
                    <span className="disease-type">Cercospora Fungal</span>
                  </div>
                  <div className="card-diagnosis-arrow">
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Confidence Card (Middle-Right) */}
              <div className="scanner-floating-card card-confidence float-anim-3">
                <div className="confidence-gauge-wrap">
                  <svg className="confidence-svg" viewBox="0 0 64 64">
                    <circle className="confidence-svg-bg" cx="32" cy="32" r="26" />
                    <circle 
                      ref={confidenceCircleRef}
                      className="confidence-svg-ring" 
                      cx="32" 
                      cy="32" 
                      r="26" 
                    />
                  </svg>
                  <span className="confidence-val">92%</span>
                </div>
                <div className="confidence-label-wrap">
                  <span className="confidence-text-main">Confidence</span>
                  <span className="confidence-text-sub">Diagnostic Certainty</span>
                </div>
              </div>

              {/* Floating Card 4: Recommended Action Card (Bottom-Right) */}
              <div className="scanner-floating-card card-action float-anim-4">
                <div className="card-action-icon-circle">
                  <Leaf size={18} />
                </div>
                <div className="card-action-content">
                  <span className="card-action-badge">Recommended Action</span>
                  <p className="card-action-desc">
                    Use organic fungicide &amp; improve air circulation
                  </p>
                </div>
              </div>

              {/* Right-Side Handwritten Botanical Detail */}
              <div className="handwritten-brand-note">
                <span className="note-text">Healthy Plants, Brighter Futures</span>
                <Leaf size={17} className="note-leaf-icon" />
              </div>

              {/* Botanical Leaf & Halo Depth Ornaments */}
              <div className="scanner-botanical-decorations">
                <div className="botanical-leaf-decor leaf-decor-1">
                  <svg viewBox="0 0 40 40" fill="none">
                    <path d="M5 35C5 35 12 12 35 5C35 5 32 28 5 35Z" fill="#54B981" fillOpacity="0.25" stroke="#378F65" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 35C15 25 25 15 35 5" stroke="#378F65" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="botanical-leaf-decor leaf-decor-2">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M4 28C4 28 10 10 28 4C28 4 25 22 4 28Z" fill="#90A955" fillOpacity="0.22" stroke="#40916C" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M4 28C12 20 20 12 28 4" stroke="#40916C" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="botanical-halo-ring halo-1"></div>
                <div className="botanical-halo-ring halo-2"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features" ref={featuresRef}>
        <h2>Why Choose PlantCare AI?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <Zap size={44} />
            <h3>Lightning Fast AI</h3>
            <p>Get results in under 2 seconds. Our optimized deep learning models process leaf images in real-time.</p>
          </div>
          
          <div className="feature-card">
            <Target size={44} />
            <h3>High Accuracy</h3>
            <p>Trained on over 50,000+ laboratory & field images to accurately identify 50+ plant diseases and deficiencies.</p>
          </div>
          
          <div className="feature-card">
            <ShieldCheck size={44} />
            <h3>Actionable Solutions</h3>
            <p>Receive comprehensive, expert-verified chemical and organic treatment plans tailored to save your harvest.</p>
          </div>

          <div className="feature-card">
            <CalendarClock size={44} />
            <h3>Farm Task Scheduler</h3>
            <p>Plan and automate your daily watering, fertilization, pruning, and harvesting tasks with custom reminders.</p>
          </div>

          <div className="feature-card">
            <BarChart2 size={44} />
            <h3>Interactive Trackers</h3>
            <p>Monitor moisture levels, pesticide cycles, and crop health progression visually over time with historical charts.</p>
          </div>

          <div className="feature-card">
            <CloudSun size={44} />
            <h3>Weather Intelligence</h3>
            <p>Live meteorological integration advising on optimal spraying conditions, temperature alerts, and climate suitability.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works" ref={worksRef}>
        <div className="works-content">
          <h2>Seamless Detection Process</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <h3>Capture or Upload</h3>
                <p>Take a clear photo of the affected plant leaf using your smartphone or upload an existing image.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>
                <h3>AI Analysis</h3>
                <p>Our deep learning convolutional vision models analyze visual symptoms, lesions, and spots with precision.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>
                <h3>Get Results & Treat</h3>
                <p>Receive an instant diagnosis report along with actionable, expert-recommended treatment solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-content">
          <h2>Ready to protect your plants?</h2>
          <p>Join thousands of farmers and gardeners using AI to secure their crop health and maximize yields.</p>
          <button className="landing-btn-primary large" onClick={() => navigate('/dashboard')}>
            Get Started Today <ArrowRight size={18} style={{ marginLeft: '6px' }} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="landing-logo">
            <img src="/assets/logo.svg" alt="PlantCare AI Logo" onError={(e) => { e.target.src = '/assets/logo.png'; }} />
            <span>PlantCare AI</span>
          </div>
          <p>&copy; 2026 PlantCare AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
