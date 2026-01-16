/**
 * AIPROFITGEN - Advanced Animations
 * Custom animation controllers and effects
 */

// ============================================
// FLOATING ELEMENTS
// ============================================

function initFloatingElements() {
  const floatingElements = document.querySelectorAll('[data-float]');
  
  floatingElements.forEach((element, index) => {
    const speed = element.getAttribute('data-float-speed') || 6;
    const delay = index * 0.5;
    
    element.style.animation = `float ${speed}s ease-in-out ${delay}s infinite`;
  });
}

// ============================================
// PARALLAX SCROLL
// ============================================

function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (!parallaxElements.length) return;
  
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  };
  
  window.addEventListener('scroll', throttle(handleScroll, 10));
}

// ============================================
// GRADIENT ANIMATION
// ============================================

function initGradientAnimation() {
  const gradientElements = document.querySelectorAll('[data-gradient-animate]');
  
  gradientElements.forEach(element => {
    element.classList.add('animate-gradient');
  });
}

// ============================================
// TYPED TEXT EFFECT
// ============================================

function typeText(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  
  type();
}

function initTypedText() {
  const typedElements = document.querySelectorAll('[data-typed]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.getAttribute('data-typed');
        const speed = parseInt(element.getAttribute('data-typed-speed')) || 50;
        
        typeText(element, text, speed);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });
  
  typedElements.forEach(el => observer.observe(el));
}

// ============================================
// PULSE GLOW EFFECT
// ============================================

function initPulseGlow() {
  const pulseElements = document.querySelectorAll('[data-pulse]');
  
  pulseElements.forEach(element => {
    element.classList.add('animate-pulse-glow');
  });
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================

function initCursorTrail() {
  if (!document.querySelector('[data-cursor-trail]')) return;
  
  const trail = [];
  const maxTrail = 20;
  
  document.addEventListener('mousemove', (e) => {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: var(--color-accent-purple);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      transform: translate(-50%, -50%);
      animation: cursorFade 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(dot);
    trail.push(dot);
    
    if (trail.length > maxTrail) {
      const oldDot = trail.shift();
      oldDot.remove();
    }
    
    setTimeout(() => dot.remove(), 800);
  });
  
  // Add keyframe animation
  if (!document.querySelector('#cursor-trail-animation')) {
    const style = document.createElement('style');
    style.id = 'cursor-trail-animation';
    style.textContent = `
      @keyframes cursorFade {
        from {
          opacity: 0.8;
          transform: translate(-50%, -50%) scale(1);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// STAGGER ANIMATION
// ============================================

function staggerAnimation(elements, animationClass, delay = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
}

function initStaggerAnimations() {
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  
  staggerGroups.forEach(group => {
    const children = group.children;
    const delay = parseInt(group.getAttribute('data-stagger-delay')) || 100;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          staggerAnimation(Array.from(children), 'animate-in', delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(group);
  });
}

// ============================================
// RIPPLE EFFECT ON CLICK
// ============================================

function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

function initRippleEffect() {
  const rippleButtons = document.querySelectorAll('[data-ripple], .btn');
  
  rippleButtons.forEach(button => {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.addEventListener('click', createRipple);
  });
}

// ============================================
// NUMBER MORPHING
// ============================================

function morphNumber(element, newValue, duration = 1000) {
  const oldValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
  const startTime = Date.now();
  const prefix = element.getAttribute('data-prefix') || '';
  const suffix = element.getAttribute('data-suffix') || '';
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    const currentValue = oldValue + (newValue - oldValue) * easeOutCubic;
    element.textContent = prefix + currentValue.toFixed(2) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
}

// ============================================
// SCROLL REVEAL WITH CUSTOM TIMING
// ============================================

function initAdvancedScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = parseInt(element.getAttribute('data-reveal-delay')) || 0;
        const animation = element.getAttribute('data-reveal') || 'fade-up';
        
        setTimeout(() => {
          element.setAttribute('data-animate', animation);
          element.classList.add('animate-in');
        }, delay);
        
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// ============================================
// NEON GLOW INTENSITY
// ============================================

function initNeonGlow() {
  const neonElements = document.querySelectorAll('[data-neon]');
  
  neonElements.forEach(element => {
    element.classList.add('animate-neon');
    
    // Add hover intensity
    element.addEventListener('mouseenter', () => {
      element.style.animation = 'neon-pulse 1s ease-in-out infinite';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.animation = 'neon-pulse 2s ease-in-out infinite';
    });
  });
}

// ============================================
// CARD TILT EFFECT
// ============================================

function initCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
    
    card.style.transition = 'transform 0.3s ease';
  });
}

// ============================================
// BACKGROUND PARTICLES
// ============================================

function initParticles() {
  const particleContainer = document.querySelector('[data-particles]');
  if (!particleContainer) return;
  
  const particleCount = parseInt(particleContainer.getAttribute('data-particles')) || 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(124, 58, 237, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 15}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    particleContainer.appendChild(particle);
  }
}

// ============================================
// UTILITIES
// ============================================

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initFloatingElements();
  initParallax();
  initGradientAnimation();
  initTypedText();
  initPulseGlow();
  initStaggerAnimations();
  initRippleEffect();
  initAdvancedScrollReveal();
  initNeonGlow();
  initCardTilt();
  initParticles();
  
  // Optional: cursor trail (can be performance-intensive)
  // initCursorTrail();
});

// Export for external use
window.AIPROFITGEN_ANIMATIONS = {
  typeText,
  morphNumber,
  createRipple,
  staggerAnimation,
  throttle
};
