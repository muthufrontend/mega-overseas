document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // STICKY HEADER & ACTIVE NAV LINKS
  // ==========================================================================
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky header shadow
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Active nav link highlight on scroll
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinksList = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close menu drawer when link is clicked
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ==========================================================================
  // HERO TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterText = document.getElementById('typewriter-text');
  const destinations = ["USA", "UK", "Canada", "Australia", "Germany", "New Zealand", "Ireland & Europe"];
  let destIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;

  const handleTypewriter = () => {
    const currentDest = destinations[destIndex];
    
    if (isDeleting) {
      // Deleting characters
      typewriterText.textContent = currentDest.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 75; // delete faster
    } else {
      // Typing characters
      typewriterText.textContent = currentDest.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }

    // Finished typing word
    if (!isDeleting && charIndex === currentDest.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      destIndex = (destIndex + 1) % destinations.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(handleTypewriter, typingSpeed);
  };

  if (typewriterText) {
    handleTypewriter();
  }

  // ==========================================================================
  // SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-up');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // STATS COUNTER ANIMATION
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const startCounterAnimation = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // milliseconds
    const stepTime = 30; // ms
    const increment = target / (duration / stepTime);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounterAnimation(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => statsObserver.observe(num));

  // ==========================================================================
  // INFINITE TESTIMONIALS SLIDER REPLICATOR
  // ==========================================================================
  const track = document.getElementById('testimonials-track');
  if (track) {
    // Clone all testimonials cards inside the track to make infinite loop work
    const cards = Array.from(track.children);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });
  }

  // ==========================================================================
  // FAQ ACCORDION TOGGLES
  // ==========================================================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isOpen = parent.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isOpen) {
        parent.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================================================
  // CONTACT FORM SUBMISSION
  // ==========================================================================
  const form = document.getElementById('consultation-form');
  const formFeedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const destination = document.getElementById('destination').value;

      if (!name || !phone || !email || !destination) {
        formFeedback.textContent = "Please fill in all required fields.";
        formFeedback.className = "form-feedback error";
        return;
      }

      // Show mock processing state
      formFeedback.textContent = "Sending request... Please wait.";
      formFeedback.className = "form-feedback";

      setTimeout(() => {
        // Success state response
        formFeedback.textContent = `Thank you, ${name}! Your free consultation request has been received. We will call you back shortly.`;
        formFeedback.className = "form-feedback success";
        
        // Reset form inputs
        form.reset();
      }, 1500);
    });
  }
});
