/* ============================================
   I18N — Internationalization Manager
   ============================================ */

const I18n = (() => {
  const STORAGE_KEY = 'portfolio_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
  
  // Static translations dictionary
  const translations = {
    en: {
      nav_about: "About",
      nav_experience: "Experience",
      nav_projects: "Projects",
      nav_skills: "Skills",
      nav_blog: "Blog",
      nav_contact: "Contact",
      hero_cta: "View My Work",
      hero_scroll: "Scroll to explore",
      about_title: "Professional Philosophy",
      experience_subtitle: "My professional journey and the impact I've delivered",
      projects_title: "Featured Projects",
      projects_subtitle: "Documentation-driven case studies highlighting architectural decisions and impact.",
      skills_subtitle: "Technologies and tools I work with daily",
      blog_title: "Technical Blog",
      blog_subtitle: "Insights on middleware, integration patterns, and software architecture.",
      contact_title: "Let's Connect",
      contact_subtitle: "Have a project in mind or just want to say hello?",
      contact_label_name: "Name",
      contact_label_email: "Email",
      contact_label_message: "Message",
      contact_btn_send: "Send Message",
      contact_download_cv: "Download CV"
    },
    id: {
      nav_about: "Tentang",
      nav_experience: "Pengalaman",
      nav_projects: "Proyek",
      nav_skills: "Keahlian",
      nav_blog: "Blog",
      nav_contact: "Kontak",
      hero_cta: "Lihat Karya Saya",
      hero_scroll: "Scroll untuk jelajah",
      about_title: "Filosofi Profesional",
      experience_subtitle: "Perjalanan profesional dan dampak yang saya berikan",
      projects_title: "Proyek Unggulan",
      projects_subtitle: "Studi kasus berbasis dokumentasi yang menyoroti keputusan arsitektur.",
      skills_subtitle: "Teknologi dan alat yang saya gunakan sehari-hari",
      blog_title: "Blog Teknis",
      blog_subtitle: "Wawasan tentang middleware, pola integrasi, dan arsitektur perangkat lunak.",
      contact_title: "Mari Terhubung",
      contact_subtitle: "Punya proyek atau sekadar ingin menyapa?",
      contact_label_name: "Nama",
      contact_label_email: "Email",
      contact_label_message: "Pesan",
      contact_btn_send: "Kirim Pesan",
      contact_download_cv: "Unduh CV"
    }
  };

  /**
   * Initialize i18n
   */
  function init(appData) {
    _bindEvents(appData);
    _applyTranslations(appData);
    _updateSwitcherUI();
    
    console.log(`[I18n] Initialized with language: ${currentLang}`);
  }

  /**
   * Bind Language Switcher events
   */
  function _bindEvents(appData) {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;

      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) return;

      setLanguage(lang, appData);
    });
  }

  /**
   * Change Language
   */
  function setLanguage(lang, appData) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    _applyTranslations(appData);
    _updateSwitcherUI();
    
    // Some modules might need re-rendering for complex dynamic content
    About.init(appData); // Re-init about to swap bioId/bioEn
    Timeline.init(appData); 
  }

  /**
   * Apply translations to DOM
   */
  function _applyTranslations(appData) {
    // 1. Translate Static Elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });

    // 2. Handle Dynamic Content in appData
    // We update the appData object reference so other modules use the correct lang
    if (appData.personal) {
      // Bio handling
      appData.about.bio = currentLang === 'en' 
        ? [appData.personal.bioEn] 
        : [appData.personal.bioId];
    }
    
    // Update Document attributes
    document.documentElement.setAttribute('lang', currentLang);
  }

  /**
   * Update Switcher Buttons UI
   */
  function _updateSwitcherUI() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
      if (btn.getAttribute('data-lang') === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function getLanguage() {
    return currentLang;
  }

  return { init, setLanguage, getLanguage };
})();
