/* ============================================
   SKILLS — Grouped Cards & Animated Progress Bars
   ============================================ */

const Skills = (() => {
  const container = document.getElementById('skills-grid');
  
  /**
   * Initialize Skills Section
   */
  function init(data) {
    if (!container || !data.skills) return;
    _renderContent(data.skills);
    _initIntersectionObserver();
  }

  /**
   * Render Skills DOM
   */
  function _renderContent(skillsData) {
    const lang = I18n.getLanguage();
    const categories = Array.isArray(skillsData) ? skillsData : Object.values(skillsData);
    
    let html = '';
    
    categories.forEach((category, index) => {
      let itemsHtml = '';
      
      category.items.forEach(skill => {
        let levelTerm = 'Basic';
        if (skill.level >= 85) levelTerm = lang === 'en' ? 'Expert' : 'Ahli';
        else if (skill.level >= 70) levelTerm = lang === 'en' ? 'Advanced' : 'Lanjutan';
        else if (skill.level >= 50) levelTerm = lang === 'en' ? 'Intermediate' : 'Menengah';
        else levelTerm = lang === 'en' ? 'Basic' : 'Dasar';

        itemsHtml += `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-level-text">${skill.level}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" data-width="${skill.level}%"></div>
            </div>
            <div class="skill-tooltip">${levelTerm}</div>
          </div>
        `;
      });
      
      html += `
        <div class="skill-category-card reveal" style="transition-delay: ${index * 100}ms">
          <div class="skill-header">
            <div class="skill-icon">${category.icon}</div>
            <h3 class="skill-title">${category.title}</h3>
          </div>
          <div class="skill-list">
            ${itemsHtml}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  }

  /**
   * Intersection observer to animate progress bars
   */
  function _initIntersectionObserver() {
    const reveals = container.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const progressFills = entry.target.querySelectorAll('.progress-fill');
          progressFills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-width');
            setTimeout(() => { fill.style.width = targetWidth; }, 200);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(element => observer.observe(element));
  }

  return { init };
})();
