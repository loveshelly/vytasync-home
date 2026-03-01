// ── Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Video fallback
const video = document.getElementById('heroVideo');
const fallback = document.getElementById('heroFallback');
if (video) {
  video.addEventListener('error', () => {
    video.style.display = 'none';
    fallback.style.display = 'block';
  });
  // If video has no src that can load
  setTimeout(() => {
    if (video.readyState === 0) {
      video.style.display = 'none';
      fallback.style.display = 'block';
    }
  }, 2000);
}

// ── Product carousel
const prSrcs = [
  "images/img_hero.jpg",
  "images/img_v2_front.jpg",
  "images/img_glowing.png",
  "images/img_v1_system.jpg"
];
function prSwitch(idx, el) {
  document.querySelectorAll('.pr-thumb').forEach((t,i) => t.classList.toggle('active', i===idx));
  const mainImg = document.getElementById('prMainImg');
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = prSrcs[idx];
    mainImg.style.opacity = '1';
    mainImg.style.transition = 'opacity .3s';
  }, 150);
}
// Auto-cycle
let prIdx = 0;
setInterval(() => {
  prIdx = (prIdx + 1) % prSrcs.length;
  prSwitch(prIdx, null);
}, 4500);

// ── FAQ
function toggleFaq(el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ── Scroll reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));