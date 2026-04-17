/* ============================================
   ABOUT — Bio, Philosophy, Stats Counter
   ============================================ */

const About = (() => {
  const container = document.getElementById("about-content");

  /**
   * Initialize About Section
   */
  function init(data) {
    if (!container || !data.about) return;

    _renderContent(data);
    _initIntersectionObserver();

    console.log("[About] Initialized");
  }

  /**
   * Generate DOM structure
   */
  function _renderContent(data) {
    const { personal, about } = data;

    // 1. Bio & Image Layout
    const bioParagraphs = about.bio.map((text) => `<p>${text}</p>`).join("");
    // Use an emoji as fallback if no actual image file is supplied yet in dummy data
    const avatarHtml = personal.avatar
      ? `<img src="${personal.avatar}" alt="${personal.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : `🧊`;

    const layoutHtml = `
      <div class="about-layout">
        <div class="about-visual reveal">
          <div class="about-image-wrapper">
            ${avatarHtml}
          </div>
        </div>
        <div class="about-bio reveal" style="transition-delay: 100ms">
          ${bioParagraphs}
        </div>
      </div>
    `;

    // 2. Philosophy Cards
    let philosophyHtml = '<div class="philosophy-grid">';
    about.philosophy.forEach((item, index) => {
      const delay = 200 + index * 100;
      philosophyHtml += `
        <div class="card philosophy-card reveal" style="transition-delay: ${delay}ms">
          <div class="philosophy-icon">${item.icon}</div>
          <h3 class="philosophy-title">${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `;
    });
    philosophyHtml += "</div>";

    // 3. Stats Counter
    // let statsHtml = '<div class="stats-grid reveal" style="transition-delay: 200ms">';
    // about.stats.forEach((stat, index) => {
    //   statsHtml += `
    //     <div class="stat-item">
    //       <div class="stat-value-container">
    //         <span class="stat-value" data-target="${stat.value}">0</span>
    //         <span class="stat-suffix">${stat.suffix}</span>
    //       </div>
    //       <div class="stat-label">${stat.label}</div>
    //     </div>
    //   `;
    // });
    // statsHtml += '</div>';

    // Append all parts
    container.innerHTML = layoutHtml + philosophyHtml;
    // container.innerHTML = layoutHtml + philosophyHtml + statsHtml;
  }

  /**
   * Intersection observer for reveal animations and stats counter
   */
  function _initIntersectionObserver() {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");

            // If it's the stats container, trigger the counter animation
            if (entry.target.classList.contains("stats-grid")) {
              _animateStats();
            }

            obs.unobserve(entry.target); // Reveal only once
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
      },
    );

    reveals.forEach((element) => observer.observe(element));
  }

  /**
   * Stats Counter Animation
   */
  function _animateStats() {
    const statValues = document.querySelectorAll(".stat-value");
    const duration = 2000; // 2 seconds

    statValues.forEach((element) => {
      const target = parseFloat(element.getAttribute("data-target"));
      // Handle decimals too
      const isDecimal = target % 1 !== 0;
      let startValue = 0;
      let startTime = null;

      function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing out function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (target - startValue) * easeOut;

        element.innerText = isDecimal
          ? currentValue.toFixed(1)
          : Math.floor(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.innerText = target; // Ensure exact final value
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  return { init };
})();
