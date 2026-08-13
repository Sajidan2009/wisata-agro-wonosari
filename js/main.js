// Wisata Agro Wonosari – Main JS v3.0 Premium
// Handles: Smart Navbar, Back-To-Top, Scroll Reveal, Counter Animation, Article Search

document.addEventListener('DOMContentLoaded', function () {

  /* ========================================================
     1. SMART NAVBAR – Hide on scroll down, show on scroll up
     ======================================================== */
  const navbar = document.querySelector('.navbar-custom');
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const currentY = window.scrollY;

        if (navbar) {
          // Shadow on scroll
          if (currentY > 50) {
            navbar.style.boxShadow = '0 4px 24px rgba(27,59,43,0.12)';
          } else {
            navbar.style.boxShadow = '0 2px 20px rgba(27,59,43,0.06)';
          }
          // Hide/show logic
          if (currentY > lastScrollY && currentY > 100) {
            navbar.style.transform = 'translateY(-100%)';
          } else {
            navbar.style.transform = 'translateY(0)';
          }
        }

        // Back-to-top visibility
        const btn = document.getElementById('backToTopBtn');
        if (btn) {
          if (currentY > 380) btn.classList.add('show');
          else btn.classList.remove('show');
        }

        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ========================================================
     2. BACK TO TOP
     ======================================================== */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================================
     3. SCROLL REVEAL (Fade Up, Blur In, Scale, Stagger)
     ======================================================== */
  const revealSelectors = [
    { selector: '[data-reveal]' },
    { selector: '[data-reveal-blur]' },
    { selector: '[data-reveal-scale]' },
    { selector: '.stagger-children' }
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  revealSelectors.forEach(({ selector }) => {
    document.querySelectorAll(selector).forEach(el => revealObserver.observe(el));
  });

  /* ========================================================
     4. COUNTER ANIMATION
     ======================================================== */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('id-ID');
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(c => counterObserver.observe(c));

  /* ========================================================
     5. IMAGE HOVER ZOOM (for fas-card images)
     ======================================================== */
  document.querySelectorAll('.fas-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.06)'; });
    card.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; });
  });

  /* ========================================================
     6. ACTIVE NAVBAR LINK
     ======================================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ========================================================
     7. ARTICLE SEARCH & FILTER (artikel.html)
     ======================================================== */
  const articleSearchInput = document.getElementById('articleSearchInput');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const searchResetBtn = document.getElementById('searchResetBtn');

  if (articleSearchInput) {
    articleSearchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.article-card-item');
      let matches = 0;

      items.forEach(item => {
        const title = item.querySelector('.article-title')?.textContent.toLowerCase() || '';
        const desc  = item.querySelector('.article-desc')?.textContent.toLowerCase() || '';
        const tag   = item.querySelector('.article-tag')?.textContent.toLowerCase() || '';
        const show  = title.includes(query) || desc.includes(query) || tag.includes(query);
        item.style.display = show ? 'block' : 'none';
        if (show) matches++;
      });

      const countEl = document.getElementById('articleCount');
      if (countEl) countEl.textContent = `Menampilkan ${matches} Artikel`;

      if (noResultsMsg) noResultsMsg.classList.toggle('d-none', matches > 0);

      if (query.length > 0) {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      }
    });

    if (searchResetBtn) {
      searchResetBtn.addEventListener('click', function () {
        articleSearchInput.value = '';
        articleSearchInput.dispatchEvent(new Event('input'));
        const allBtn = document.querySelector('.category-btn[data-category="semua"]');
        if (allBtn) allBtn.click();
      });
    }
  }

  /* ========================================================
     8. PREMIUM BUTTON CLICK EFFECT (active press animation)
     ======================================================== */
  document.querySelectorAll('.btn-primary-custom, .btn-amber').forEach(btn => {
    btn.addEventListener('mousedown', () => { btn.style.transform = 'translateY(0px) scale(0.97)'; });
    btn.addEventListener('mouseup', () => { btn.style.transform = ''; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ========================================================
     9. FACILITIES FILTER, LIVE SEARCH & MODAL HANDLER
     ======================================================== */
  const fasFilterBtns = document.querySelectorAll('.fas-filter-btn');
  const fasSearchInput = document.getElementById('facilitySearchInput');
  const fasCards = document.querySelectorAll('.fas-compact-col');
  const fasNoResults = document.getElementById('fasNoResults');

  let activeCategory = 'all';

  function filterFacilities() {
    const searchQuery = fasSearchInput ? fasSearchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    fasCards.forEach(col => {
      const cat = col.getAttribute('data-category') || 'all';
      const title = col.querySelector('.fas-compact-title')?.textContent.toLowerCase() || '';
      const desc = col.querySelector('.fas-compact-desc')?.textContent.toLowerCase() || '';
      const tags = col.querySelector('.fas-compact-tags')?.textContent.toLowerCase() || '';

      const matchesCat = (activeCategory === 'all' || cat === activeCategory);
      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery) || tags.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        col.style.display = 'block';
        visibleCount++;
      } else {
        col.style.display = 'none';
      }
    });

    if (fasNoResults) {
      fasNoResults.classList.toggle('d-none', visibleCount > 0);
    }
  }

  fasFilterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      fasFilterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.getAttribute('data-filter') || 'all';
      filterFacilities();
    });
  });

  if (fasSearchInput) {
    fasSearchInput.addEventListener('input', filterFacilities);
  }

  // Facility Quick View Modal handler
  const facilityModal = document.getElementById('facilityDetailModal');
  if (facilityModal) {
    facilityModal.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      if (!button) return;

      const title = button.getAttribute('data-title') || '';
      const cat = button.getAttribute('data-cat') || '';
      const img = button.getAttribute('data-img') || '';
      const desc = button.getAttribute('data-desc') || '';
      const specs = button.getAttribute('data-specs') || '';

      const modalTitleEl = document.getElementById('modalFasTitle');
      const modalBadgeEl = document.getElementById('modalFasBadge');
      const modalImgEl = document.getElementById('modalFasImg');
      const modalDescEl = document.getElementById('modalFasDesc');

      if (modalTitleEl) modalTitleEl.textContent = title;
      if (modalBadgeEl) modalBadgeEl.textContent = cat;
      if (modalImgEl) {
        modalImgEl.src = img;
        modalImgEl.alt = title;
      }
      if (modalDescEl) modalDescEl.textContent = desc;

      const specsContainer = document.getElementById('modalFasSpecs');
      if (specsContainer) {
        specsContainer.innerHTML = '';
        if (specs) {
          const list = specs.split(';');
          list.forEach(item => {
            if (item.trim()) {
              const specEl = document.createElement('div');
              specEl.className = 'facility-modal-spec-item';
              specEl.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> <span>${item.trim()}</span>`;
              specsContainer.appendChild(specEl);
            }
          });
        }
      }

      const waBtn = document.getElementById('modalFasWaBtn');
      if (waBtn) {
        waBtn.href = `https://wa.me/6281234567890?text=Halo%20Admin%20Wisata%20Agro%20Wonosari,%20saya%20ingin%20tanya%20detail%20fasilitas%20${encodeURIComponent(title)}`;
      }
    });
  }

});

