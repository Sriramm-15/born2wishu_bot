// Throttle function for performance optimization
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
  }
}

// Smooth scrolling for navigation links with error handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Header background on scroll (throttled for performance)
const handleScroll = throttle(() => {
  const header = document.querySelector('header');
  if (!header) return;

  const scrolled = window.scrollY > 100;
  
  header.style.background = scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)';
  header.style.boxShadow = scrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none';
  header.style.transition = 'all 0.3s ease';

  const logo = header.querySelector('.logo');
  const navLinks = header.querySelectorAll('nav a');

  if (logo) logo.style.color = scrolled ? '#333' : '#fff';
  navLinks.forEach(link => {
    link.style.color = scrolled ? '#333' : '#fff';
    link.style.transition = 'color 0.3s ease';
  });
}, 16);

window.addEventListener('scroll', handleScroll);

// Enhanced intersection observer with fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 1s ease-out';
      entry.target.style.animationFillMode = 'both';
    }
  });
}, observerOptions);

// Observe elements when they exist
setTimeout(() => {
  document.querySelectorAll('.card, .step, .feature').forEach(el => observer.observe(el));
}, 100);

// Enhanced ripple effect for buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn, button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Enhanced CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
    
    .btn:hover {
      transform: translateY(-2px);
      transition: transform 0.2s ease;
    }
    
    .floating-emoji {
      animation: bounce 2s infinite;
    }
  `;
  document.head.appendChild(style);
});

// Enhanced parallax with performance optimization
const handleParallax = throttle(() => {
  const scrolled = window.pageYOffset;
  const floatingEmojis = document.querySelectorAll('.floating-emoji');
  
  floatingEmojis.forEach((emoji, index) => {
    const speed = 0.3 + (index * 0.1);
    emoji.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, 16);

window.addEventListener('scroll', handleParallax);

// Enhanced typing effect
function typeWriter(element, text, speed = 100) {
  if (!element) return;
  
  let i = 0;
  element.innerHTML = '';
  element.style.borderRight = '2px solid #333';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Blinking cursor effect
      setTimeout(() => {
        element.style.borderRight = element.style.borderRight === 'none' ? '2px solid #333' : 'none';
      }, 500);
    }
  }
  type();
}

// Enhanced mobile menu
function createMobileMenu() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  
  if (!header || !nav) return;

  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.innerHTML = '☰';
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
  mobileMenuBtn.style.cssText = `
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.2s ease;
  `;

  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: block !important;
      }
      .mobile-menu-btn:hover {
        transform: scale(1.1);
      }
      nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      nav.active {
        max-height: 300px;
      }
      nav ul {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
      }
      nav a {
        color: #333 !important;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        display: block;
        transition: background-color 0.2s ease;
      }
      nav a:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  `;
  document.head.appendChild(mobileStyle);

  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      nav.classList.remove('active');
      mobileMenuBtn.innerHTML = '☰';
    }
  });

  const headerContent = header.querySelector('.header-content') || header;
  headerContent.appendChild(mobileMenuBtn);
}

// Enhanced bot commands section
document.addEventListener('DOMContentLoaded', () => {
  const commandSection = document.createElement('div');
  commandSection.innerHTML = `
    <section id="bot-commands" style="padding: 3rem 2rem; text-align: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); margin: 2rem 0;">
      <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: #333;">🤖 Bot Commands</h2>
      <div style="max-width: 800px; margin: auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; text-align: left;">
          <div class="command-card" style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #4a90e2; margin-bottom: 1rem;">Basic Commands</h3>
            <ul style="list-style: none; padding: 0; line-height: 1.8;">
              <li><strong>/start</strong> - Welcome message 🎉</li>
              <li><strong>/help</strong> - Show command list 📋</li>
              <li><strong>/today</strong> - Today's birthdays 🎂</li>
              <li><strong>/tomorrow</strong> - Tomorrow's birthdays 🕛</li>
            </ul>
          </div>
          <div class="command-card" style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #e74c3c; margin-bottom: 1rem;">Management Commands</h3>
            <ul style="list-style: none; padding: 0; line-height: 1.8;">
              <li><strong>/all</strong> - View all birthdays 📅</li>
              <li><strong>/add Name DD-MM Gender</strong> - Add birthday ➕</li>
              <li><strong>/delete Name</strong> - Delete birthday ❌</li>
            </ul>
          </div>
        </div>
        <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.8); border-radius: 10px;">
          <p style="font-size: 1.1rem; color: #666; margin: 0;"><strong>Example:</strong> /add John 15-03 male</p>
        </div>
      </div>
    </section>
  `;
  
  // Insert before footer or at end of body
  const footer = document.querySelector('footer');
  if (footer) {
    footer.parentNode.insertBefore(commandSection, footer);
  } else {
    document.body.appendChild(commandSection);
  }

  // Add hover effects to command cards
  const commandCards = document.querySelectorAll('.command-card');
  commandCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
});

// Add a "Copy to Clipboard" feature for bot link
function addCopyFeature() {
  const botLink = 'https://t.me/Born2wishu_bot';
  const copyBtn = document.createElement('button');
  copyBtn.innerHTML = '📋 Copy Bot Link';
  copyBtn.className = 'btn copy-btn';
  copyBtn.style.cssText = `
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    margin: 1rem;
    transition: all 0.3s ease;
  `;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(botLink);
      copyBtn.innerHTML = '✅ Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '📋 Copy Bot Link';
      }, 2000);
    } catch (err) {
      console.log('Fallback copy method');
      const textArea = document.createElement('textarea');
      textArea.value = botLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      copyBtn.innerHTML = '✅ Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '📋 Copy Bot Link';
      }, 2000);
    }
  });

  // Add to commands section
  setTimeout(() => {
    const commandsSection = document.getElementById('bot-commands');
    if (commandsSection) {
      commandsSection.appendChild(copyBtn);
    }
  }, 500);
}

// Initialize all features
createMobileMenu();
addCopyFeature();

// Add loading animation
const loadingScreen = document.createElement('div');
loadingScreen.id = 'loading-screen';
loadingScreen.innerHTML = `
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: center; align-items: center; z-index: 9999;">
    <div style="text-align: center; color: white;">
      <div style="font-size: 3rem; animation: bounce 1s infinite;">🎂</div>
      <h2 style="margin: 1rem 0;">Loading Birthday Bot...</h2>
    </div>
  </div>
`;

document.body.appendChild(loadingScreen);

// Remove loading screen when page is fully loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 1500);
});

// Enhanced console logs for developers
console.log('🎂 Enhanced Birthday Reminder Bot Landing Page Loaded!');
console.log('🚀 Features: Smooth scrolling, parallax, ripple effects, mobile menu, copy feature');
console.log('📱 Bot: https://t.me/Born2wishu_bot');
console.log('📧 Contact: sriramalla6@gmail.com');
console.log('⚡ Performance optimized with throttling and error handling');

// Error handling for the entire script
window.addEventListener('error', (e) => {
  console.error('Birthday Bot JS Error:', e.error);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.innerHTML = '☰';
    }
  }
});

// Add scroll-to-top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', throttle(() => {
  if (window.scrollY > 300) {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.transform = 'scale(1)';
  } else {
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.transform = 'scale(0)';
  }
}, 16));

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});