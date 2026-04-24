/* ============================================
   PROJECTS — Filter, Grid, and Modal
   ============================================ */

const Projects = (() => {
  const filterContainer = document.getElementById('projects-filter');
  const gridContainer = document.getElementById('projects-grid');
  const modalOverlay = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  
  let projectsData = [];
  let currentFilter = 'all';

  /**
   * Initialize Projects Section
   */
  function init(data) {
    if (!gridContainer || !data.projects) return;
    
    projectsData = data.projects;
    
    _renderFilters();
    _renderGrid('all');
    _bindEvents();
    
    if (typeof mermaid !== 'undefined') {
      _initMermaid();
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            _initMermaid();
            if (modalOverlay.classList.contains('active')) {
              _reRenderActiveMermaid();
            }
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true });
    }

    _initIntersectionObserver();
    console.log('[Projects] Initialized');
  }

  function _renderFilters() {
    const categories = ['all', ...new Set(projectsData.map(p => p.category))];
    let html = '';
    categories.forEach(cat => {
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      const activeClass = cat === 'all' ? 'active' : '';
      html += `<button class="filter-btn ${activeClass}" data-filter="${cat}">${label}</button>`;
    });
    filterContainer.innerHTML = html;
  }

  function _renderGrid(filter) {
    let filteredData = projectsData;
    if (filter !== 'all') {
      filteredData = projectsData.filter(p => p.category === filter);
    }
    
    let html = '';
    filteredData.forEach((project, index) => {
      // Backend uses techStack
      const tech = project.techStack || project.tech || [];
      const techHtml = tech.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');
      
      html += `
        <div class="card project-card reveal" data-id="${project.id}" style="transition-delay: ${index * 100}ms">
          <div class="project-icon">${project.icon}</div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-brief">${project.brief}</p>
          <div class="project-tech">
            ${techHtml}
            ${tech.length > 3 ? `<span class="tag">+${tech.length - 3}</span>` : ''}
          </div>
          <div class="project-link">
            <span>View Case Study</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      `;
    });
    
    gridContainer.innerHTML = html;
    
    const cards = gridContainer.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', () => _openModal(card.getAttribute('data-id')));
    });

    setTimeout(() => {
      const reveals = gridContainer.querySelectorAll('.reveal');
      reveals.forEach(r => r.classList.add('active'));
    }, 50);
  }

  function _bindEvents() {
    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        const btns = filterContainer.querySelectorAll('.filter-btn');
        btns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        currentFilter = e.target.getAttribute('data-filter');
        gridContainer.style.opacity = '0';
        setTimeout(() => {
          _renderGrid(currentFilter);
          gridContainer.style.opacity = '1';
        }, 300);
      }
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) _closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) _closeModal();
    });
  }

  function _openModal(projectId) {
    // Non-strict comparison because data-id is string and project.id is number
    const project = projectsData.find(p => p.id == projectId);
    if (!project) return;
    
    const tech = project.techStack || project.tech || [];
    const techHtml = tech.map(t => `<span class="tag">${t}</span>`).join('');
    
    // Backend uses mermaidDiagram
    const architecture = project.mermaidDiagram || project.architecture;
    let diagramHtml = '';
    if (architecture) {
      diagramHtml = `
        <div class="modal-section">
          <h3>Architecture Map</h3>
          <div class="modal-architecture mermaid" id="mermaid-container">
            ${architecture}
          </div>
        </div>
      `;
    }

    const html = `
      <div class="modal-header">
        <div>
          <h2>${project.title}</h2>
          <div class="project-tech" style="margin-bottom:0;">${techHtml}</div>
        </div>
        <button class="modal-close" id="modal-close-btn" aria-label="Close Case Study">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="modal-grid">
          <div class="modal-section">
            <h3>The Problem</h3>
            <p>${project.problem}</p>
          </div>
          <div class="modal-section">
            <h3>The Solution</h3>
            <p>${project.solution}</p>
          </div>
        </div>
        ${diagramHtml}
        <div class="modal-result">
          <h3>Impact & Result</h3>
          <p><strong>${project.result}</strong></p>
        </div>
      </div>
    `;

    modalContent.innerHTML = html;
    document.getElementById('modal-close-btn').addEventListener('click', _closeModal);
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (typeof mermaid !== 'undefined' && architecture) {
      setTimeout(() => {
         mermaid.run({
            nodes: [document.getElementById('mermaid-container')]
         });
      }, 100);
    }
  }

  function _closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!modalOverlay.classList.contains('active')) {
        modalContent.innerHTML = '';
      }
    }, 400);
  }

  function _initMermaid() {
    if (typeof mermaid === 'undefined') return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    });
  }
  
  function _reRenderActiveMermaid() {
    // Optional: Re-render logic
  }

  function _initIntersectionObserver() {
    const reveals = document.querySelectorAll('.projects-filter.reveal, .projects-grid.reveal');
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
