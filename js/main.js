/**
 * AIPROFITGEN - Main JavaScript
 * Premium Fintech SaaS Platform
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initCounters();
  initAccordions();
  initGallery();
  initForms();
  initPricingToggle();
  initSmoothScroll();
  initScrollToTop();
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  
  // Sticky header on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
    document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navMenu?.classList.contains('active')) {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Mobile dropdown toggles
  navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    toggle?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });
  
  // Close mobile menu on link click
  const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (!animatedElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initCounters() {
  const counters = document.querySelectorAll('.counter, .stats-value, .software-card-earnings-value');
  
  const animateCounter = (element) => {
    const target = parseFloat(element.getAttribute('data-target') || element.textContent.replace(/[^0-9.]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const decimals = element.getAttribute('data-decimals') || 0;
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = prefix + current.toFixed(decimals) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    };
    
    updateCounter();
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    if (counter.hasAttribute('data-target') || counter.textContent.match(/[0-9]/)) {
      observer.observe(counter);
    }
  });
}

// ============================================
// ACCORDIONS
// ============================================

function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    
    header?.addEventListener('click', () => {
      const isActive = accordion.classList.contains('active');
      
      // Close all accordions (optional - remove for multi-open)
      document.querySelectorAll('.accordion.active').forEach(acc => {
        if (acc !== accordion) {
          acc.classList.remove('active');
        }
      });
      
      // Toggle current accordion
      accordion.classList.toggle('active');
    });
  });
}

// ============================================
// GALLERY & LIGHTBOX
// ============================================

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox') || createLightbox();
  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  
  function createLightbox() {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="Gallery image">
      </div>
    `;
    document.body.appendChild(lb);
    return lb;
  }
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================
// FORMS
// ============================================

function initForms() {
  const forms = document.querySelectorAll('form[data-netlify="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
      const originalText = button?.textContent;
      
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending...';
        button.classList.add('loading');
      }
      
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
          showNotification('Message sent successfully!', 'success');
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        showNotification('Error sending message. Please try again.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
          button.classList.remove('loading');
        }
      }
    });
  });
}

// ============================================
// PRICING TOGGLE
// ============================================

function initPricingToggle() {
  const toggles = document.querySelectorAll('.pricing-toggle input');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const period = toggle.checked ? 'yearly' : 'monthly';
      updatePricing(period);
    });
  });
}

function updatePricing(period) {
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  pricingCards.forEach(card => {
    const monthlyPrice = card.getAttribute('data-monthly');
    const yearlyPrice = card.getAttribute('data-yearly');
    const priceElement = card.querySelector('.pricing-price');
    
    if (priceElement && monthlyPrice && yearlyPrice) {
      const price = period === 'yearly' ? yearlyPrice : monthlyPrice;
      priceElement.innerHTML = `$${price}<span>/${period === 'yearly' ? 'year' : 'month'}</span>`;
    }
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// SCROLL TO TOP
// ============================================

function initScrollToTop() {
  const scrollBtn = document.querySelector('.scroll-to-top') || createScrollBtn();
  
  function createScrollBtn() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--gradient-cta);
      color: white;
      border: none;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 100;
      box-shadow: var(--glow-primary);
      font-size: 1.5rem;
    `;
    document.body.appendChild(btn);
    return btn;
  }
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(6, 182, 212, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 2000;
    animation: slideInRight 0.3s ease-out;
    backdrop-filter: blur(10px);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// UTILITIES
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Generate random earnings for demo (visual only)
function generateDemoEarnings() {
  const earningsElements = document.querySelectorAll('[data-demo-earnings]');
  
  earningsElements.forEach(element => {
    const min = parseFloat(element.getAttribute('data-min')) || 100;
    const max = parseFloat(element.getAttribute('data-max')) || 1000;
    const randomValue = (Math.random() * (max - min) + min).toFixed(2);
    element.textContent = `$${randomValue}`;
  });
}

// Initialize demo earnings if present
if (document.querySelector('[data-demo-earnings]')) {
  generateDemoEarnings();
  setInterval(generateDemoEarnings, 5000); // Update every 5 seconds
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Log performance metrics (can be removed in production)
if (window.performance && window.console) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
  });
}

// Export functions for external use
window.AIPROFITGEN = {
  showNotification,
  generateDemoEarnings,
  debounce
};
