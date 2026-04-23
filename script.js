/* ══════════════════════════════════════════
   SyncraOS.io — Script
══════════════════════════════════════════ */


/* ── Counter 0 → 50 ── */
const counterEl = document.getElementById('counter');
let started = false;

function runCounter() {
  if (started) return;
  started = true;
  const duration = 2800;
  const start = performance.now();
  requestAnimationFrame(function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    counterEl.textContent = Math.round(ease * 50);
    if (progress < 1) requestAnimationFrame(tick);
  });
}

const observer = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { runCounter(); observer.disconnect(); }
}, { threshold: 0.5 });
observer.observe(counterEl);

/* ── Comparison Section — Choreographie ── */
const compSection = document.querySelector('.comparison');
if (compSection) {
  const compObs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const tools = compSection.querySelectorAll('.tool-card');
    tools.forEach((t, i) => {
      t.style.animationDelay = `${i * 110}ms`;
      t.classList.add('fly-in');
    });
    setTimeout(() => compSection.querySelector('.syncra-card').classList.add('reveal'), 1200);
    setTimeout(() => compSection.querySelector('.alles-weg').classList.add('show'), 1600);
    setTimeout(() => compSection.querySelector('.tools-stack').classList.add('dimmed'), 2000);
    compObs.disconnect();
  }, { threshold: 0.25 });
  compObs.observe(compSection);
}

/* ── More Features — fly-in beim Scrollen ── */
const moreFeats = document.querySelectorAll('.more-feat-card');
const moreObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 60}ms`;
      entry.target.classList.add('fly-in');
      moreObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
moreFeats.forEach(c => moreObs.observe(c));

/* ── Feature Tabs (with lazy video loading) ── */
function activateLazyVideo(panel) {
  const v = panel.querySelector('video[data-lazy-video]');
  if (!v) return;
  if (!v.dataset.loaded) {
    v.querySelectorAll('source[data-src]').forEach(s => {
      s.src = s.dataset.src;
    });
    v.load();
    v.dataset.loaded = '1';
  }
  v.play().catch(() => {});
}

function pauseAllPanelVideos(except) {
  document.querySelectorAll('.feat-panel video').forEach(v => {
    if (v !== except) v.pause();
  });
}

document.querySelectorAll('.feat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.tab;
    document.querySelectorAll('.feat-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.feat-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.querySelector(`.feat-panel[data-panel="${idx}"]`);
    panel.classList.add('active');
    const newVideo = panel.querySelector('video');
    pauseAllPanelVideos(newVideo);
    activateLazyVideo(panel);
  });
});

/* ── Header scroll class ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


