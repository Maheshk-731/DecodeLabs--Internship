// script.js — BuildDeveloper Project 1
// handles: hamburger menu, scroll animations, newsletter form, active nav links


/* ------------------------------------------
   hamburger / mobile menu
------------------------------------------ */

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mob-menu');

burger.addEventListener('click', function() {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('active');
  burger.setAttribute('aria-expanded', isOpen);
});

// close the menu when you tap a link inside it
const menuLinks = mobileMenu.querySelectorAll('a');
menuLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  });
});


/* ------------------------------------------
   scroll reveal (fade-in on scroll)
   using IntersectionObserver — much better
   than the old scroll event approach i used
   to use on every project
------------------------------------------ */

const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry, i) {
    if (entry.isIntersecting) {
      // stagger each element slightly so they don't all pop in at once
      setTimeout(function() {
        entry.target.classList.add('visible');
      }, i * 70);

      observer.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(function(el) {
  observer.observe(el);
});


/* ------------------------------------------
   newsletter form
------------------------------------------ */

const nlBtn   = document.getElementById('nl-btn');
const nlInput = document.getElementById('nl-email');
const nlMsg   = document.getElementById('nl-msg');

nlBtn.addEventListener('click', function() {
  var email = nlInput.value.trim();

  // basic email check — just making sure there's an @ and a dot after it
  // not perfect but good enough for now, TODO: use a regex here later
  var atIndex = email.indexOf('@');
  var isValid = atIndex > 0 && email.slice(atIndex + 1).includes('.');

  if (isValid) {
    nlInput.value = '';
    nlInput.placeholder = 'your@email.com';
    nlInput.style.borderColor = 'var(--mocha)';
    nlMsg.style.display = 'block';
    // console.log('subscribed:', email);
  } else {
    nlInput.style.borderColor = '#c0392b';
    nlInput.placeholder = 'Enter a valid email';
    nlMsg.style.display = 'none';
  }
});

// reset the red border as soon as they start typing again
nlInput.addEventListener('input', function() {
  nlInput.style.borderColor = '';
});


/* ------------------------------------------
   active nav link on scroll
   highlights whichever section is currently
   in view in the top navbar
------------------------------------------ */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function() {
  let scrollPos = window.scrollY;

  sections.forEach(function(section) {
    let sectionTop    = section.offsetTop - 80; // 80 = navbar height offset
    let sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      // clear active from all links first
      navLinks.forEach(function(link) {
        link.classList.remove('active');
        link.style.color = '';
      });

      // then highlight the matching one
      let matchingLink = document.querySelector('.nav-links a[href="#' + section.id + '"]');
      if (matchingLink) {
        matchingLink.classList.add('active');
        matchingLink.style.color = 'var(--mocha)';
      }
    }
  });
});
