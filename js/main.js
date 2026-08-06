// Wisata Agro Wonosari - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
  // ================================================================
  // Navbar: Hide on scroll down, show on scroll up (smart navbar)
  // ================================================================
  const navbar = document.querySelector('.navbar-custom');
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const currentScrollY = window.scrollY;

        if (navbar) {
          // Add scrolled class for shadow effect
          if (currentScrollY > 40) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 20px rgba(46, 125, 50, 0.12)';
          } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = 'none';
          }

          // Hide navbar when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Scrolling DOWN → hide navbar
            navbar.style.transform = 'translateY(-100%)';
          } else {
            // Scrolling UP or at top → show navbar
            navbar.style.transform = 'translateY(0)';
          }
        }

        // Back to Top button visibility
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
          if (currentScrollY > 350) {
            backToTopBtn.classList.add('show');
          } else {
            backToTopBtn.classList.remove('show');
          }
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Ensure navbar transition is smooth
  if (navbar) {
    navbar.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease';
  }

  // ================================================================
  // Back to Top click handler
  // ================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ================================================================
  // Scroll Reveal Animation
  // ================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -25px 0px' });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ================================================================
  // Counter Animation (Hero stats)
  // ================================================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => counterObserver.observe(c));
  }

  // ================================================================
  // Active navbar link highlighting based on current page
  // ================================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ================================================================
  // Article Search & Filter Logic (artikel.html)
  // ================================================================
  const articleSearchInput = document.getElementById('articleSearchInput');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const searchResetBtn = document.getElementById('searchResetBtn');

  if (articleSearchInput) {
    articleSearchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const articleItems = document.querySelectorAll('.article-card-item');
      let matches = 0;

      articleItems.forEach((item) => {
        const title = item.querySelector('.article-title')?.textContent.toLowerCase() || '';
        const desc = item.querySelector('.article-desc')?.textContent.toLowerCase() || '';
        const tag = item.querySelector('.article-tag')?.textContent.toLowerCase() || '';

        const show = title.includes(query) || desc.includes(query) || tag.includes(query);
        item.style.display = show ? 'block' : 'none';
        if (show) matches++;
      });

      // Update count
      const countEl = document.getElementById('articleCount');
      if (countEl) countEl.textContent = `Menampilkan ${matches} Artikel`;

      // Show/hide no results message
      if (noResultsMsg) {
        noResultsMsg.classList.toggle('d-none', matches > 0);
      }

      // Deactivate category buttons on custom search
      if (query.length > 0) {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      }
    });

    if (searchResetBtn) {
      searchResetBtn.addEventListener('click', function () {
        articleSearchInput.value = '';
        articleSearchInput.dispatchEvent(new Event('input'));
        // Re-activate "Semua" category
        const allBtn = document.querySelector('.category-btn[data-category="semua"]');
        if (allBtn) allBtn.click();
      });
    }
  }
});
