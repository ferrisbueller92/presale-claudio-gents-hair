/* Chicanos — progressive enhancement only. Content is fully visible without JS. */
(function () {
  // Respect reduced-motion: pause the hero video; its poster image stays.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video.hero-bg').forEach(function (v) {
      v.removeAttribute('autoplay'); try { v.pause(); } catch (e) {}
    });
  }
  var sel = '.hero-inner,.sec-head,.svc-list li,.gallery figure,.about-copy,.about-media,.r,.visit-copy,.hours';
  var els = Array.prototype.slice.call(document.querySelectorAll(sel));
  els.forEach(function (el) { el.classList.add('reveal'); });
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        setTimeout(function () { e.target.classList.add('is-visible'); }, Math.min(i * 50, 200));
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
})();


/* Hero video — force muted autoplay. Safari (macOS + iOS) ignores the `autoplay` attribute
   and shows a paused frame + play button. WebKit blocks play() during page load but allows
   it once the load event fires, so we kick it off then and retry; a first-interaction
   fallback covers iOS Low Power Mode / "Auto-Play: Never". */
(function () {
  var v = document.querySelector('.hero-media video, .hero video, video[autoplay], video');
  if (!v) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
  v.playsInline = true; v.setAttribute('playsinline', '');
  var play = function () { try { var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} };
  var tries = 0;
  var pump = function () { play(); if (v.paused && ++tries < 10) setTimeout(pump, 300); };
  if (document.readyState === 'complete') pump();
  else window.addEventListener('load', pump, { once: true });
  ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, play, { passive: true, once: true });
  });
})();
