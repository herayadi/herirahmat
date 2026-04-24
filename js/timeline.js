/* ============================================
   TIMELINE — Experience layout & interactions
   ============================================ */

const Timeline = (() => {
  const container = document.getElementById('timeline');

  /**
   * Initialize Timeline
   */
  function init(data) {
    if (!container || !data.experience) return;

    _renderContent(data.experience);
    _bindEvents();
    _initIntersectionObserver();

    console.log('[Timeline] Initialized');
  }

  /**
   * Generates DOM
   */
  function _renderContent(experienceData) {
    let html = '';
    const lang = I18n.getLanguage();

    experienceData.forEach((exp, index) => {
      const isExpanded = index === 0;
      const cardClass = isExpanded ? 'card timeline-card expanded' : 'card timeline-card';
      const toggleText = isExpanded 
        ? (lang === 'en' ? 'Show Less' : 'Sembunyikan') 
        : (lang === 'en' ? 'Show Details' : 'Lihat Detail');

      const impactHtml = exp.impact.map(item => `<li>${item}</li>`).join('');
      const techHtml = exp.tech.map(tech => `<span class="tag">${tech}</span>`).join('');
      
      // Multi-language fields
      const role = lang === 'en' ? (exp.roleEn || exp.role) : (exp.roleId || exp.role);
      const description = lang === 'en' ? (exp.descriptionEn || exp.description) : (exp.descriptionId || exp.description);
      const impactTitle = lang === 'en' ? 'Key Impact' : 'Dampak Utama';

      // Date Formatting
      const formatPeriod = (e) => {
        if (!e.startDate) return e.period || '';
        const start = new Date(e.startDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { month: 'short', year: 'numeric' });
        if (e.current) return `${start} — ${lang === 'en' ? 'Present' : 'Sekarang'}`;
        if (!e.endDate) return start;
        const end = new Date(e.endDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { month: 'short', year: 'numeric' });
        return `${start} — ${end}`;
      };

      html += `
        <div class="timeline-item reveal" style="transition-delay: ${index * 100}ms">
          <div class="timeline-marker"></div>
          <div class="timeline-content-wrapper">
            <div class="${cardClass}">
              <div class="timeline-header">
                <span class="timeline-date">${formatPeriod(exp)}</span>
                <h3 class="timeline-role">${role}</h3>
                <div class="timeline-company">${exp.company}</div>
              </div>
              
              <div class="timeline-body">
                <p class="timeline-description">${description}</p>
                
                <div class="timeline-impact">
                  <h4>${impactTitle}</h4>
                  <ul>
                    ${impactHtml}
                  </ul>
                </div>
                
                <div class="timeline-tech">
                  ${techHtml}
                </div>
              </div>
              
              <button class="timeline-toggle" aria-expanded="${isExpanded}">
                <span class="toggle-text">${toggleText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Bind expand/collapse events
   */
  function _bindEvents() {
    const toggles = container.querySelectorAll('.timeline-toggle');
    const lang = I18n.getLanguage();

    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.timeline-card');
        const textSpan = e.currentTarget.querySelector('.toggle-text');
        const isExpanded = card.classList.contains('expanded');

        if (isExpanded) {
          card.classList.remove('expanded');
          textSpan.textContent = lang === 'en' ? 'Show Details' : 'Lihat Detail';
          e.currentTarget.setAttribute('aria-expanded', 'false');
        } else {
          card.classList.add('expanded');
          textSpan.textContent = lang === 'en' ? 'Show Less' : 'Sembunyikan';
          e.currentTarget.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * Observer for smooth reveal on scrolling
   */
  function _initIntersectionObserver() {
    const reveals = container.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(element => observer.observe(element));
  }

  return { init };
})();
