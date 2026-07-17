/* ============================================================
   SHREE PLASTIC — Premium Script v2.0
   Libraries: GSAP + ScrollTrigger, Swiper, Typed.js, tsParticles,
              CountUp.js, VanillaTilt, GLightbox, AOS
   ============================================================ */

// ─── CLOUD SERVICES CONFIGURATION ───────────────────────────
// Insert your live keys here to connect to EmailJS & WhatsApp.
const CONFIG = {
  // WhatsApp number (include country code, no + or spaces, e.g. 919876543210 for India)
  ADMIN_WHATSAPP_NUMBER: "919427784740",

  // EmailJS configuration for direct email delivery
  EMAILJS_SERVICE_ID: "service_tpki5ps", // (This should look like 'service_abcd123' from emailjs.com)
  EMAILJS_TEMPLATE_ID: "template_klyecvt", // (This should look like 'template_xyz')
  EMAILJS_PUBLIC_KEY: "9N1icCq7lmOlO61o6",
  ADMIN_NOTIFICATION_EMAIL: "shreeplastics14@gmail.com"
};

// Global helper to load scripts dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function initCloudServices() {
  const isEmailJSConfigured = !!CONFIG.EMAILJS_PUBLIC_KEY;
  if (isEmailJSConfigured) {
    if (typeof emailjs === 'undefined') {
      await loadScript("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js");
    }
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. LOADING SCREEN ──────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderLogo = document.querySelector('.loader-logo');
  if (loader && loaderLogo) {
    if (typeof gsap !== 'undefined') {
      gsap.to(loaderLogo, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
      gsap.to(loader, {
        opacity: 0, duration: 0.6, delay: 2.0,
        onComplete: () => { loader.style.display = 'none'; document.body.style.overflow = ''; startAnimations(); }
      });
      document.body.style.overflow = 'hidden';
    } else {
      // Fallback if GSAP fails to load
      loader.style.display = 'none';
      document.body.style.overflow = '';
      startAnimations();
    }
  } else {
    startAnimations();
  }

  /* ─── 2. SCROLL PROGRESS BAR ─────────────────────── */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      progress.style.width = pct + '%';
    }, { passive: true });
  }

  /* ─── 3. FLOATING NAVBAR SHRINK ──────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shrunk', window.scrollY > 60);
    }, { passive: true });
  }

  /* ─── 4. HAMBURGER / MOBILE MENU ─────────────────── */
  const ham = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => { ham.classList.remove('open'); mobileMenu.classList.remove('open'); });
    });
  }

  /* ─── 5. DARK / LIGHT MODE TOGGLE ────────────────── */
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const saved = localStorage.getItem('sp-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  if (themeIcon) themeIcon.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sp-theme', next);
      if (themeIcon) themeIcon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  }

  /* ─── 6. BACK TO TOP ──────────────────────────────── */
  const backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ─── 7. RFQ BOTTOM SHEET ────────────────────────── */
  const rfqOverlay = document.getElementById('rfq-overlay');
  const rfqSheet = document.getElementById('rfq-sheet');
  const closeSheet = document.getElementById('close-sheet');
  const triggers = document.querySelectorAll('.open-rfq');
  const rfqForm = document.getElementById('rfq-form');
  const rfqSuccess = document.getElementById('rfq-success');
  const machineSelect = document.getElementById('rfq-machine');

  function openRFQ(machine = '') {
    if (!rfqOverlay || !rfqSheet) return;
    rfqOverlay.classList.add('open');
    rfqSheet.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (machine && machineSelect) {
      for (let opt of machineSelect.options) {
        if (opt.value.toLowerCase().includes(machine.toLowerCase())) { machineSelect.value = opt.value; break; }
      }
    }
  }
  function closeRFQ() {
    if (!rfqOverlay || !rfqSheet) return;
    rfqOverlay.classList.remove('open');
    rfqSheet.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (rfqForm) rfqForm.style.display = 'block';
      if (rfqSuccess) rfqSuccess.style.display = 'none';
      if (rfqForm) rfqForm.reset();
    }, 500);
  }
  triggers.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault(); openRFQ(btn.dataset.machine || '');
  }));
  if (closeSheet) closeSheet.addEventListener('click', closeRFQ);
  if (rfqOverlay) rfqOverlay.addEventListener('click', closeRFQ);
  if (rfqForm) {
    rfqForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = rfqForm.querySelector('[type=submit]');
      const originalText = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

      // Gather Form Data
      const full_name = document.getElementById('rfq-name').value;
      const company_name = document.getElementById('rfq-company').value || 'Not Provided';
      const email = document.getElementById('rfq-email').value;
      const phone = document.getElementById('rfq-phone').value;
      const country = document.getElementById('rfq-country').value || 'Not Provided';
      const city = document.getElementById('rfq-city').value || 'Not Provided';
      const product_name = document.getElementById('rfq-machine').value;
      const quantity = parseInt(document.getElementById('rfq-qty').value) || 1;
      const budgetVal = document.getElementById('rfq-budget').value;
      const budget = budgetVal ? `$${parseFloat(budgetVal).toLocaleString()}` : 'Not Provided';
      const message = document.getElementById('rfq-message').value;

      try {
        // Send Email via EmailJS
        if (CONFIG.EMAILJS_PUBLIC_KEY) {
          try {
            await initCloudServices();
            const customerParams = {
              to_email: email,
              to_name: full_name,
              request_id: "DIRECT-" + Date.now().toString().slice(-5),
              product_name: product_name,
              quantity: quantity,
              message: "Thank you for your inquiry. We have received your request and will contact you via WhatsApp or Email shortly."
            };

            const adminParams = {
              to_email: CONFIG.ADMIN_NOTIFICATION_EMAIL,
              to_name: "Admin",
              request_id: "DIRECT-" + Date.now().toString().slice(-5),
              product_name: product_name,
              quantity: quantity,
              message: `New Direct Inquiry:
Name: ${full_name}
Company: ${company_name}
Phone: ${phone}
Email: ${email}
Location: ${city}, ${country}
Budget: ${budget}
Requirements: ${message}`
            };

            await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, customerParams);
            await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, adminParams);
          } catch (emailErr) {
            console.error("EmailJS failed to send email notifications:", emailErr);
          }
        }

        // Generate WhatsApp Message
        if (CONFIG.ADMIN_WHATSAPP_NUMBER && CONFIG.ADMIN_WHATSAPP_NUMBER !== "9427784740") {
          const waText = `*New Request For Quotation*%0A%0A*Name:* ${encodeURIComponent(full_name)}%0A*Company:* ${encodeURIComponent(company_name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Location:* ${encodeURIComponent(city)}, ${encodeURIComponent(country)}%0A%0A*Product:* ${encodeURIComponent(product_name)}%0A*Quantity:* ${encodeURIComponent(quantity)}%0A*Est. Budget:* ${encodeURIComponent(budget)}%0A%0A*Requirements:* ${encodeURIComponent(message)}`;

          const waUrl = `https://wa.me/${CONFIG.ADMIN_WHATSAPP_NUMBER}?text=${waText}`;
          window.open(waUrl, '_blank'); // Open WhatsApp in a new tab
        }

        // Show Success View
        rfqForm.style.display = 'none';
        if (rfqSuccess) {
          rfqSuccess.style.display = 'block';
          const successSub = rfqSuccess.querySelector('p');
          if (successSub) {
            successSub.innerHTML = `Your inquiry has been processed. We will get in touch with you shortly.`;
          }
        }
        btn.disabled = false; btn.innerHTML = originalText;
      } catch (err) {
        console.error("Error submitting RFQ:", err);
        alert("There was an error processing your request. Please try contacting us directly.");
        btn.disabled = false; btn.innerHTML = originalText;
      }
    });
  }

  // Touch swipe to close on mobile
  let startY = 0;
  if (rfqSheet) {
    rfqSheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    rfqSheet.addEventListener('touchend', e => {
      if (e.changedTouches[0].clientY - startY > 80) closeRFQ();
    }, { passive: true });
  }

  /* ─── 8. ACTIVE NAV LINK ─────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* ─── 8b. PRODUCT SEARCH & FILTERING (products.html) ─── */
  const searchInput = document.getElementById('product-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-detail-card');

  if (productCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    // Create No Results element
    const container = productCards[0].parentElement;
    const noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'no-results-msg';
    noResultsMsg.style.display = 'none';
    noResultsMsg.innerHTML = `
      <i class="fa-solid fa-magnifying-glass-minus"></i>
      <h3>No Machines Found</h3>
      <p>We couldn't find any machines matching your criteria. Try adjusting your search term or category filter.</p>
    `;
    container.appendChild(noResultsMsg);

    function filterProducts() {
      let visibleCount = 0;

      productCards.forEach(card => {
        const category = card.dataset.category || 'all';
        const searchText = (card.dataset.searchText || '').toLowerCase();

        const matchesCategory = currentCategory === 'all' || category === currentCategory;
        const matchesSearch = !searchQuery || searchText.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          visibleCount++;
          if (card.style.display === 'none') {
            card.style.display = 'grid'; // Grid display matches CSS layout
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            } else {
              card.style.opacity = '1';
            }
          }
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCount === 0) {
        noResultsMsg.style.display = 'block';
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(noResultsMsg, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
      } else {
        noResultsMsg.style.display = 'none';
      }

      // Refresh ScrollTrigger if active to adjust offsets
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

    // Filter click handler
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        filterProducts();
      });
    });

    // Search input handler
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
        }
        filterProducts();
      });
    }

    // Clear search handler
    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        filterProducts();
      });
    }
  }

  /* ─── 9. GSAP ANIMATIONS (called after loader hides) */
  function startAnimations() {

    // Register ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Hero entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      heroTl
        .from('.hero-eyebrow', { opacity: 0, y: 30, duration: 0.7 })
        .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.4')
        .from('.hero-sub', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
        .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
        .from('.hero-stats .stat-item', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, '-=0.3')
        .from('.hero-image-wrap', { opacity: 0, x: 50, duration: 1.0 }, '-=0.9');

      // Section reveals with ScrollTrigger
      gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          opacity: 0, y: 50, duration: 0.9, ease: 'power4.out'
        });
      });

      gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 0, x: -60, duration: 0.9, ease: 'power4.out'
        });
      });

      gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 0, x: 60, duration: 0.9, ease: 'power4.out'
        });
      });

      gsap.utils.toArray('.stagger-children').forEach(parent => {
        gsap.from(parent.children, {
          scrollTrigger: { trigger: parent, start: 'top 80%' },
          opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power4.out'
        });
      });
    }

    /* ─── 10. TYPED.JS ──────────────────────────────── */
    const typedEl = document.getElementById('typed-hero');
    if (typedEl && typeof Typed !== 'undefined') {
      new Typed('#typed-hero', {
        strings: ['Precision Molding', 'Medical Solutions', 'Packaging Systems', 'Automotive Parts'],
        typeSpeed: 55, backSpeed: 30, backDelay: 2200,
        loop: true, cursorChar: '|'
      });
    }

    /* ─── 11. tsParticles HERO BG ───────────────────── */
    if (typeof tsParticles !== 'undefined' && document.getElementById('tsparticles')) {
      tsParticles.load('tsparticles', {
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          number: { value: 55, density: { enable: true, area: 900 } },
          color: { value: '#0071e3' },
          shape: { type: 'circle' },
          opacity: { value: 0.18, random: true },
          size: { value: { min: 1, max: 3 } },
          move: { enable: true, speed: 0.5, direction: 'none', random: true, outModes: { default: 'bounce' } },
          links: { enable: true, distance: 130, color: '#0071e3', opacity: 0.08, width: 1 }
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
          modes: { repulse: { distance: 80, duration: 0.4 } }
        },
        detectRetina: true
      });
    }

    /* ─── 12. CountUp STATS ─────────────────────────── */
    const stats = [
      { id: 'stat-years', end: 18, suffix: '+' },
      { id: 'stat-countries', end: 60, suffix: '+' },
      { id: 'stat-machines', end: 1200, suffix: '+', separator: ',' }
    ];
    if (typeof CountUp !== 'undefined') {
      stats.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            new CountUp(s.id, s.end, {
              suffix: s.suffix || '',
              separator: s.separator || '',
              duration: 2.5, useEasing: true
            }).start();
            observer.disconnect();
          }
        }, { threshold: 0.5 });
        observer.observe(el);
      });
    }

    /* ─── 13. VanillaTilt 3D CARDS ──────────────────── */
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 8, speed: 400, glare: true, 'max-glare': 0.08,
        perspective: 1200, scale: 1.02
      });
    }

    /* ─── 14. SWIPER – Products ─────────────────────── */
    if (typeof Swiper !== 'undefined') {
      const productSwiper = document.querySelector('.products-swiper');
      if (productSwiper) {
        new Swiper('.products-swiper', {
          slidesPerView: 1.15, spaceBetween: 20, centeredSlides: false,
          grabCursor: true, loop: false,
          navigation: { nextEl: '.prod-next', prevEl: '.prod-prev' },
          pagination: { el: '.prod-pagination', clickable: true },
          breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 22 },
            1024: { slidesPerView: 3, spaceBetween: 24 }
          }
        });
      }

      /* ─── 15. SWIPER – Testimonials ─────────────── */
      const testiSwiper = document.querySelector('.testi-swiper');
      if (testiSwiper) {
        new Swiper('.testi-swiper', {
          slidesPerView: 1, spaceBetween: 24,
          grabCursor: true, loop: true,
          autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
          pagination: { el: '.testi-pagination', clickable: true },
          breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }
        });
      }
    }

    /* ─── 16. GLightbox GALLERY ─────────────────────── */
    if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true, loop: true,
        openEffect: 'zoom', closeEffect: 'zoom',
        slideEffect: 'slide', moreLength: 0,
        skin: 'clean'
      });
    }

    /* ─── 17. AOS (Animate On Scroll) ───────────────── */
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800, easing: 'ease-out-cubic',
        once: true, offset: 60
      });
    }

    /* ─── CUSTOM CURSOR ─────────────────────────────── */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    // Only enable custom cursor if NOT a touch device and GSAP is loaded
    if (cursor && follower && typeof gsap !== 'undefined' && window.matchMedia("(pointer: fine)").matches) {
      document.body.style.cursor = 'none';

      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
      });

      gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(follower, { x: followerX, y: followerY });
      });

      document.querySelectorAll('a, button, input, textarea, .btn, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('active');
          follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('active');
          follower.classList.remove('active');
        });
        el.style.cursor = 'none';
      });
    }

    /* ─── 18. MAGNETIC BUTTON EFFECT ────────────────── */
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.03)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

});
