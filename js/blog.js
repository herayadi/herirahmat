/* ============================================
   BLOG — Markdown Articles & Detailed View
   ============================================ */

const Blog = (() => {
  const grid = document.getElementById('blog-grid');
  const modalOverlay = document.getElementById('project-modal'); 
  const modalContent = document.getElementById('modal-content');

  let postsData = [];

  /**
   * Initialize Blog Section
   */
  async function init(data) {
    if (!grid) return;
    postsData = data.posts || await API.getPosts() || [];
    _renderPosts();
  }

  /**
   * Render Blog Grid
   */
  function _renderPosts() {
    const lang = I18n.getLanguage();
    if (postsData.length === 0) {
      grid.innerHTML = `<p class="no-data">${lang === 'en' ? 'Stay tuned for upcoming technical articles!' : 'Nantikan artikel teknis mendatang!'}</p>`;
      return;
    }

    let html = '';
    postsData.forEach((post, index) => {
      const date = new Date(post.publishedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const readText = lang === 'en' ? 'Read Article' : 'Baca Artikel';

      html += `
        <article class="card blog-card reveal" style="transition-delay: ${index * 100}ms">
          <div class="blog-date">${date}</div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-summary">${post.summary}</p>
          <button class="btn-text blog-read-more" data-slug="${post.slug}">
            <span>${readText}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </article>
      `;
    });

    grid.innerHTML = html;

    const readMoreBtns = grid.querySelectorAll('.blog-read-more');
    readMoreBtns.forEach(btn => {
      btn.addEventListener('click', () => _openPost(btn.getAttribute('data-slug')));
    });
  }

  /**
   * Open full post in modal
   */
  async function _openPost(slug) {
    const lang = I18n.getLanguage();
    const post = postsData.find(p => p.slug === slug);
    if (!post) return;

    modalContent.innerHTML = `<div class="loader">${lang === 'en' ? 'Loading article...' : 'Memuat artikel...'}</div>`;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const htmlContent = marked.parse(post.content);
    const date = new Date(post.publishedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
      <div class="modal-header">
        <div>
          <div class="blog-date" style="margin-bottom: 0.5rem;">${date}</div>
          <h2>${post.title}</h2>
        </div>
        <button class="modal-close" id="blog-modal-close" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body blog-content-full">
        ${htmlContent}
      </div>
    `;

    modalContent.innerHTML = html;
    document.getElementById('blog-modal-close').addEventListener('click', _closePost);
  }

  function _closePost() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  return { init };
})();
