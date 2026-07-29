/* ==========================================================================
   TOBY'S GRILL — Interactive JavaScript Logic
   Includes: Navigation, Menu Filtering, Lightbox Modal, PDF Defensive Fallback
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll Behavior
  initHeaderScroll();

  // Initialize Mobile Hamburger Menu
  initMobileMenu();

  // Initialize Menu Filter Tabs
  initMenuFilter();

  // Initialize Gallery Lightbox
  initGalleryLightbox();

  // Initialize Menu PDF / Lightbox Handler
  initMenuModalHandler();

  // Initialize Scroll Entrance Animations
  initScrollAnimations();
});

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* --- Mobile Menu Toggle --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.innerHTML = isOpen 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

/* --- Menu Filtering --- */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!galleryItems.length || !lightboxModal || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const caption = item.querySelector('.gallery-caption');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Toby\'s Grill Gallery';
        if (lightboxCaption && caption) {
          lightboxCaption.textContent = caption.textContent;
        }
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- Menu Modal / PDF Fallback Handler --- */
function initMenuModalHandler() {
  const menuModalBtn = document.getElementById('view-full-menu-btn');
  const menuModal = document.getElementById('menu-modal');
  const menuModalClose = document.getElementById('menu-modal-close');

  if (!menuModalBtn || !menuModal) return;

  menuModalBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Check if menu.pdf exists via fetch
    fetch('assets/menu/menu.pdf', { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          // PDF exists, open directly
          window.open('assets/menu/menu.pdf', '_blank');
        } else {
          // PDF does not exist yet, show fallback modal gracefully
          openMenuModal();
        }
      })
      .catch(() => {
        // Fallback open modal on error
        openMenuModal();
      });
  });

  function openMenuModal() {
    menuModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenuModal() {
    menuModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuModalClose) menuModalClose.addEventListener('click', closeMenuModal);
  menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) closeMenuModal();
  });
}

/* --- Scroll Entrance Animations --- */
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (!animateElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animateElements.forEach(el => observer.observe(el));
}
