// Mobile menu (guard nulls)
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => menu.classList.toggle('open'));
}

// Footer year (guard null)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Typed.js role animation (guard if library missing)
if (window.Typed) {
  new Typed('#typedRole', {
    strings: ['Developer', 'Frontend Engineer', 'Web Designer'],
    typeSpeed: 85,
    backSpeed: 45,
    backDelay: 1200,
    loop: true
  });
} else {
  // optional: console.warn('Typed.js not loaded');
}

// ScrollReveal: flashy bounce-in + fade (guard if library missing)
if (window.ScrollReveal) {
  const sr = ScrollReveal({
    distance: '60px',
    duration: 1100,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    reset: false // CHANGED THIS LINE
  });
  sr.reveal('.hero > div:first-child', { origin: 'left' });
  sr.reveal('.avatar', { origin: 'right', delay: 150 });
  sr.reveal('.card', { origin: 'bottom', interval: 120, scale: 0.92 });
} else {
  // optional: console.warn('ScrollReveal not loaded');
}

// Neon border pulse on hover (CSS is primary; here we add tilt/parallax)
const tiltCards = document.querySelectorAll('.card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rotateY = ((x / r.width) - 0.5) * 10;  // tilt range
    const rotateX = -((y / r.height) - 0.5) * 10;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Clickable stat cards → toggle detail sections
const stats = document.querySelectorAll('.stat');
const detailBoxes = document.querySelectorAll('.details');
function hideAllDetails(){ detailBoxes.forEach(b => b.classList.remove('show')); }
function clearActive(){ stats.forEach(x => x.classList.remove('active')); }

stats.forEach(s => {
  // Accessibility: allow Enter/Space to activate
  s.setAttribute('role','button');
  s.setAttribute('tabindex','0');

  const handleActivate = () => {
    const target = s.getAttribute('data-target');
    if(!target){
      console.warn('Stat without target', s);
      return;
    }
    const el = document.querySelector(target);
    if(!el){
      console.error('Target not found for', target);
      return;
    }
    // Always open the clicked section (no toggle-close)
    hideAllDetails();
    clearActive();
    el.classList.add('show');
    s.classList.add('active');
    // Scroll into view accounting for sticky nav height
    const nav = document.querySelector('nav');
    const offset = (nav && nav.offsetHeight ? nav.offsetHeight : 90) + 10; // extra padding
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  s.addEventListener('click', handleActivate);
  s.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      handleActivate();
    }
  });
});

console.log(`Stat handlers bound: ${stats.length}`);

// Open Projects by default on large screens
if (window.innerWidth >= 900) {
  const defaultEl = document.querySelector('#projectsList');
  if (defaultEl) {
    defaultEl.classList.add('show');
  }
}

// test
function copyToClipboard(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ " + text + " copied!", "success");
  }).catch(() => {
    showToast("❌ Failed to copy!", "error");
  });
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;
  document.body.appendChild(toast);

  // Show animation
  setTimeout(() => { toast.classList.add("show"); }, 100);

  // Auto-hide after 2.5s
  const autoHide = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);

  // Manual close
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(autoHide);
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  });
}

// --- Certificate Modal Logic ---
const certModal = document.getElementById('certModal');
const certViewer = document.getElementById('certViewer');
const certCards = document.querySelectorAll('.cert-card');
const closeModalBtn = document.querySelector('.close-btn');

// Function to open the modal
function openModal(pdfSrc) {
  if (certModal && certViewer) {
    certViewer.setAttribute('src', pdfSrc);
    certModal.classList.add('show');
  }
}

// Function to close the modal
function closeModal() {
  if (certModal) {
    certModal.classList.remove('show');
    certViewer.setAttribute('src', ''); // Clear src to stop loading
  }
}

// Add click event listeners to each certificate card
certCards.forEach(card => {
  card.addEventListener('click', () => {
    const pdfSrc = card.getAttribute('data-src');
    if (pdfSrc && pdfSrc !== 'path/to/your-cert.pdf') { // Only open if the path is valid
        openModal(pdfSrc);
    }
  });
});

// Add click event for the close button
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

// Add click event to close modal when clicking on the background overlay
if (certModal) {
  certModal.addEventListener('click', (event) => {
    if (event.target === certModal) {
      closeModal();
    }
  });
}

// Add keydown event to close modal with the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && certModal.classList.contains('show')) {
    closeModal();
  }
});