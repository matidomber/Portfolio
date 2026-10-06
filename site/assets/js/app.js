// mateuszdombrowski.com — zachowanie i animacje.
// Stany końcowe są w CSS: bez skryptu, bez GSAP albo przy ograniczonym ruchu strona jest pełna i statyczna.
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var fontsReady = d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve();

  // ---------- Kody kreskowe: Code 128B dla fontu Libre Barcode 128 (da się je zeskanować telefonem).
  function code128(text) {
    var v = Array.prototype.map.call(text, function (c) { return c.charCodeAt(0) - 32; });
    var sum = 104;
    v.forEach(function (x, i) { sum += x * (i + 1); });
    var ch = function (x) { return String.fromCharCode(x === 0 ? 194 : (x < 95 ? x + 32 : x + 100)); };
    return 'Ì' + v.map(ch).join('') + ch(sum % 103) + 'Î';
  }
  var bars = $$('.bars');
  bars.forEach(function (el) { el.textContent = code128(el.dataset.code); });
  function fitBars() {
    bars.forEach(function (el) {
      el.style.transform = '';
      var host = el.parentElement;
      var cs = getComputedStyle(host);
      var w = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var max = el.classList.contains('bars-foot') ? 6 : 1.6;
      var k = Math.min(max, w / el.scrollWidth);
      el.style.transform = 'scaleX(' + k.toFixed(4) + ')';
    });
  }
  fontsReady.then(fitBars);
  var resizeT;
  window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(fitBars, 150); });

  // ---------- Formularz: Web3Forms, gdy jest klucz; bez klucza otwiera program pocztowy z gotową wiadomością.
  var form = d.getElementById('form');
  var waybill = $('.waybill');
  function stampSent() {
    waybill.classList.add('sent');
    if (hasGsap && !reduce.matches) {
      gsap.fromTo('.stamp-sent', { scale: 2.3, rotation: -32, opacity: 0 }, { scale: 1, rotation: -12, opacity: 0.92, duration: 0.38, ease: 'power4.in' });
      gsap.to(waybill, { x: 3, duration: 0.05, repeat: 3, yoyo: true, ease: 'none', delay: 0.36, clearProps: 'x' });
    }
  }
  if (form) {
    var msg = d.getElementById('form-msg');
    var submit = form.querySelector('button[type="submit"]');
    var say = function (cls, text) { msg.className = 'form-msg' + (cls ? ' ' + cls : ''); msg.textContent = text; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.botcheck.checked) return;
      var fields = form.querySelectorAll('[required]');
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) {
          fields[i].focus();
          say('err', fields[i].type === 'email' && fields[i].value ? 'Sprawdź adres e-mail.' : 'Uzupełnij wszystkie pola.');
          return;
        }
      }
      var data = new FormData(form);
      var key = form.dataset.key;
      if (!key) {
        var text = data.get('message') + '\n\n' + data.get('name') + '\n' + data.get('email');
        window.location.href = 'mailto:kontakt@mateuszdombrowski.com?subject=' + encodeURIComponent('Zapytanie ze strony') +
          '&body=' + encodeURIComponent(text);
        say('', 'Otwieram program pocztowy z gotową wiadomością.');
        return;
      }
      data.append('access_key', key);
      data.append('subject', 'Zapytanie ze strony mateuszdombrowski.com');
      data.append('from_name', 'mateuszdombrowski.com');
      submit.disabled = true;
      say('', 'Wysyłam…');
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: data })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.success) throw new Error('send');
          form.reset();
          stampSent();
          say('ok', 'Dziękuję, wiadomość dotarła. Odpiszę w ciągu 24 godzin w dzień roboczy.');
        })
        .catch(function () { say('err', 'Nie udało się wysłać. Napisz bezpośrednio na kontakt@mateuszdombrowski.com.'); })
        .then(function () { submit.disabled = false; });
    });
  }

  // ---------- FAQ: płynne rozwijanie (bez GSAP i przy ograniczonym ruchu działa zwykłe <details>).
  $$('.faq-label details').forEach(function (det) {
    var sum = $('summary', det);
    var ans = $('.ans', det);
    sum.addEventListener('click', function (e) {
      if (!hasGsap || reduce.matches) return;
      e.preventDefault();
      if (det.open) {
        gsap.to(ans, { height: 0, duration: 0.22, ease: 'power2.inOut', onComplete: function () { det.open = false; gsap.set(ans, { clearProps: 'height' }); } });
      } else {
        det.open = true;
        gsap.fromTo(ans, { height: 0 }, { height: 'auto', duration: 0.3, ease: 'power3.out', clearProps: 'height' });
      }
    });
  });

  // ---------- Powrót na górę: przycisk po przewinięciu i link w stopce (działa też bez GSAP).
  var lenisRef = null;
  var easeInOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  function scrollTopNow() {
    var focusTop = function () { var b = $('.brand'); if (b) b.focus({ preventScroll: true }); };
    if (lenisRef) {
      lenisRef.scrollTo(0, { duration: 1.6, easing: easeInOutCubic, onComplete: focusTop });
    } else {
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
      setTimeout(focusTop, reduce.matches ? 0 : 900);
    }
  }
  var toTop = $('.to-top');
  if (toTop) {
    var ticking = false;
    var onScrollTop = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; toTop.classList.toggle('on', window.scrollY > window.innerHeight * 1.4); });
    };
    window.addEventListener('scroll', onScrollTop, { passive: true });
    onScrollTop();
    toTop.addEventListener('click', scrollTopNow);
  }
  $$('[data-top]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); scrollTopNow(); }); });

  var btn = d.getElementById('print');
  var live = d.getElementById('demo-live');
  var DONE = 'Wydrukowano raport: 15 rekordów, 7 poprawnych, 4 do sprawdzenia, 4 z błędem.';

  if (!hasGsap) {
    // Bez bibliotek: wszystko widoczne od razu, bez loadera.
    root.classList.remove('js', 'ld-on');
    if (btn) btn.addEventListener('click', function () { live.textContent = DONE; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Animacje wejścia nie zostają w tyle za przewijaniem: gdy sekcja minie górną ćwiartkę ekranu, kończą się od razu.
  ScrollTrigger.defaults({ toggleActions: 'play complete none none', end: 'top 25%' });
  if (window.Draggable) gsap.registerPlugin(Draggable);
  if (window.InertiaPlugin) gsap.registerPlugin(InertiaPlugin);
  root.classList.add('ready');

  // ---------- LOADER: pliki wpadają do kartonu, klapy się zamykają, taśma, naklejka, paczka odjeżdża.
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var pageLoaded = new Promise(function (r) { if (d.readyState === 'complete') r(); else window.addEventListener('load', r, { once: true }); });
  function runLoader() {
    var el = d.getElementById('loader');
    if (!el || !root.classList.contains('ld-on')) return Promise.resolve();
    if (reduce.matches) { root.classList.remove('ld-on'); return Promise.resolve(); }
    try { sessionStorage.setItem('md-ld', '1'); } catch (e) {}
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    d.body.style.overflow = 'hidden';
    var box = d.getElementById('ld-box');
    var txt = d.getElementById('ld-text');
    var P = {
      f1: '100,160 200,110 240,130 140,180',
      f2up: '200,110 300,160 300,104 200,54', f2: '200,110 300,160 250,185 150,135',
      f3: '300,160 200,210 160,190 260,140',
      f4up: '200,210 100,160 100,104 200,154', f4: '200,210 100,160 150,135 250,185'
    };
    var resolveGate;
    var gate = new Promise(function (r) { resolveGate = r; });
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    var skip = function () { tl.timeScale(4); };
    var done = function () {
      el.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      el.style.display = 'none';
      root.classList.remove('ld-on');
      d.body.style.overflow = '';
    };
    el.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    tl.from(box, { opacity: 0, scale: 0.9, y: 18, duration: 0.5, ease: 'expo.out', transformOrigin: '50% 60%' })
      .from(txt, { opacity: 0, y: 6, duration: 0.4 }, 0.12);
    ['#ld-p1', '#ld-p2', '#ld-p3'].forEach(function (f, i) {
      var t = 0.24 + i * 0.13;
      tl.set(f, { x: 182 + i * 18, y: -80 - i * 30, rotation: [-12, 8, -5][i], transformOrigin: '50% 50%' }, 0)
        .to(f, { opacity: 1, duration: 0.08, ease: 'none' }, t)
        .to(f, { y: 148 + i * 5, rotation: [-4, 3, -2][i], duration: 0.5, ease: 'power2.in' }, t)
        .to(f, { opacity: 0, duration: 0.14, ease: 'none' }, t + 0.5);
    });
    tl.add(function () {
        ['ld-f1', 'ld-f3', 'ld-f2', 'ld-f4', 'ld-tape', 'ld-label'].forEach(function (id) { box.appendChild(d.getElementById(id)); });
        txt.textContent = 'Zaklejam';
      }, 1.02)
      .to(['#ld-f1', '#ld-f2'], { fill: '#d6b88d', duration: 0.24, ease: 'none' }, 1.04)
      .to('#ld-f1', { attr: { points: P.f1 }, duration: 0.22, ease: 'power2.inOut' }, 1.04)
      .to('#ld-f3', { attr: { points: P.f3 }, duration: 0.22, ease: 'power2.inOut' }, 1.09)
      .to('#ld-f2', { keyframes: [{ attr: { points: P.f2up }, duration: 0.12, ease: 'power1.in' }, { attr: { points: P.f2 }, duration: 0.17, ease: 'power2.out' }] }, 1.22)
      .to('#ld-f4', { keyframes: [{ attr: { points: P.f4up }, duration: 0.12, ease: 'power1.in' }, { attr: { points: P.f4 }, duration: 0.17, ease: 'power2.out' }] }, 1.3)
      .to('#ld-tape', { strokeDashoffset: 0, duration: 0.34, ease: 'power2.out' }, 1.64)
      .add(function () { txt.textContent = 'Gotowe do wysyłki'; }, 1.96)
      .set('#ld-label', { opacity: 1 }, 1.98)
      .fromTo('#ld-label .ld-label-in', { scale: 1.6, rotation: -12, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 0.16, ease: 'power4.in' }, 1.98)
      .to(box, { x: 3, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' }, 2.13)
      .addLabel('exit', 2.45)
      .addPause('exit', function () {
        Promise.race([Promise.all([fontsReady, pageLoaded]), wait(1500)]).then(function () { tl.play(); });
      })
      .to(box, { x: '+=1500', rotation: 9, skewX: -6, duration: 0.5, ease: 'power2.in' }, 'exit')
      .to(txt, { opacity: 0, duration: 0.2, ease: 'none' }, 'exit')
      .add(function () { resolveGate(); }, 'exit+=0.3')
      .to(el, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 'exit+=0.38')
      .add(done);
    return gate;
  }
  var loaderGate = runLoader();

  // Pływający przycisk kontaktu: widoczny między etykietą a formularzem.
  var floatCta = $('.float-cta');
  ScrollTrigger.create({
    trigger: '.hero', start: 'bottom 30%', endTrigger: '#kontakt', end: 'top 85%',
    onToggle: function (self) { floatCta.classList.toggle('on', self.isActive); root.classList.toggle('cta-on', self.isActive); }
  });

  // ---------- ZAWIESZKA: zdjęcie na sznurku przyklejonym taśmą do etykiety. Wahadło z bezwładnością; można złapać i pchnąć.
  function setupTag(animate) {
    var tag = $('.hangtag');
    var sticker = $('.sticker');
    var head = $('.hero .head');
    var h1 = d.getElementById('h1');
    if (!tag || !sticker || !head || !h1) return { cleanup: function () {}, drop: function () {} };
    var card = $('.ht-card', tag), tape = $('.ht-tape', tag);
    var segs = tag.querySelectorAll('.ht-seg');
    var CW = 136, HOLE = 16, G = 3900, DAMP = 1.5, K = 150, KD = 10.5;
    var P = { x: 0, y: 0 }, L = 120;
    var th = 0, om = 0, ph = 0, pw = 0, r = 0, rv = 0;
    var dragging = false, grab = null, last = null, running = false, visible = true;
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    function measure() {
      var fs = parseFloat(getComputedStyle(h1).fontSize) || 80;
      P.x = head.offsetLeft + head.offsetWidth - 100;
      P.y = head.offsetTop + 6;
      L = Math.round(fs * 0.98 + 40);
      tape.style.transform = 'translate(' + (P.x - 27) + 'px,' + (P.y - 12) + 'px) rotate(-7deg)';
      segs[0].style.height = segs[1].style.height = (L / 2 + 1) + 'px';
    }
    function render() {
      var len = L - r;
      var hx = P.x + Math.sin(th) * len, hy = P.y + Math.cos(th) * len;
      card.style.transform = 'translate(' + (hx - CW / 2).toFixed(2) + 'px,' + (hy - HOLE).toFixed(2) + 'px) rotate(' + (ph * 57.29578).toFixed(2) + 'deg)';
      // Sznurek z dwóch odcinków po L/2, przesuwanych tylko transformacją (bez przeliczania układu).
      // Napięty: odcinki w jednej linii; z luzem: zgięcie w punkcie M poniżej linii P-H.
      var half = L / 2, sx = Math.sin(th), cy = Math.cos(th), mx2, my2;
      if (r < 0.5) { mx2 = P.x + sx * half; my2 = P.y + cy * half; }
      else {
        var e = Math.sqrt(Math.max(0, half * half - (len / 2) * (len / 2)));
        var nx = cy, ny = -sx;
        if (ny < 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
        mx2 = P.x + sx * len / 2 + nx * e; my2 = P.y + cy * len / 2 + ny * e;
      }
      var a1 = -Math.atan2(mx2 - P.x, my2 - P.y) * 57.29578, a2 = -Math.atan2(hx - mx2, hy - my2) * 57.29578;
      segs[0].style.transform = 'translate(' + P.x.toFixed(2) + 'px,' + P.y.toFixed(2) + 'px) rotate(' + a1.toFixed(2) + 'deg)';
      segs[1].style.transform = 'translate(' + mx2.toFixed(2) + 'px,' + my2.toFixed(2) + 'px) rotate(' + a2.toFixed(2) + 'deg)';
    }
    function settled() { return Math.abs(th) < 0.002 && Math.abs(om) < 0.004 && Math.abs(ph - th) < 0.002 && Math.abs(pw) < 0.004 && r < 0.2; }
    function step(dt) {
      if (!dragging) {
        om += (-(G / L) * Math.sin(th) - DAMP * om) * dt;
        th += om * dt;
        rv += (-420 * r - 34 * rv) * dt; r += rv * dt;
        if (r < 0) { r = 0; rv = 0; }
      }
      // Trzymana w dłoni zostaje prawie pionowo (lekki przechył w stronę ruchu); puszczona wisi wzdłuż sznurka.
      var target = dragging && last ? clamp(last.vx * 0.0006, -0.35, 0.35) : th;
      pw += (K * (target - ph) - KD * pw) * dt;
      ph += pw * dt;
    }
    var tick = function (time, deltaTime) {
      step(Math.min(deltaTime / 1000, 1 / 30));
      render();
      if (!dragging && (settled() || !visible)) stop();
    };
    function start() { if (running || !animate) return; running = true; gsap.ticker.add(tick); }
    function stop() { if (!running) return; running = false; gsap.ticker.remove(tick); }
    function local(e) { var b = sticker.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
    var onDown = function (e) {
      if (!animate || e.button > 0) return;
      e.preventDefault();
      dragging = true;
      try { card.setPointerCapture(e.pointerId); } catch (err) {}
      tag.classList.add('dragging');
      var p = local(e), len = L - r;
      grab = { dx: p.x - (P.x + Math.sin(th) * len), dy: p.y - (P.y + Math.cos(th) * len) };
      last = { x: p.x, y: p.y, t: performance.now(), vx: 0, vy: 0 };
      start();
    };
    var onMovePtr = function (e) {
      if (!dragging) {
        // Muśnięcie kursorem lekko popycha zawieszkę.
        if (animate && e.pointerType === 'mouse' && e.movementX) { om += clamp(e.movementX * 0.0035, -0.07, 0.07); start(); }
        return;
      }
      var p = local(e), now = performance.now(), dtm = Math.max(8, now - last.t);
      last.vx = last.vx * 0.4 + ((p.x - last.x) / dtm * 1000) * 0.6;
      last.vy = last.vy * 0.4 + ((p.y - last.y) / dtm * 1000) * 0.6;
      last.x = p.x; last.y = p.y; last.t = now;
      var dx = p.x - grab.dx - P.x, dy = p.y - grab.dy - P.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist > L) { dx *= L / dist; dy *= L / dist; dist = L; }
      th = Math.atan2(dx, dy); om = 0; r = L - dist; rv = 0;
    };
    var onUp = function () {
      if (!dragging) return;
      dragging = false;
      tag.classList.remove('dragging');
      var len = Math.max(30, L - r);
      om = clamp((last.vx * Math.cos(th) - last.vy * Math.sin(th)) / len, -10, 10);
      start();
    };
    card.addEventListener('pointerdown', onDown);
    card.addEventListener('pointermove', onMovePtr);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onUp);
    var io2 = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible && !settled()) start();
    }) : null;
    if (io2) io2.observe($('.hero'));
    var onResize = function () { measure(); render(); };
    window.addEventListener('resize', onResize);
    measure(); render();
    fontsReady.then(onResize);
    return {
      drop: function () { if (!animate) return; th = 0.5; om = 0; ph = 0.9; pw = 0; render(); start(); },
      cleanup: function () {
        stop();
        card.removeEventListener('pointerdown', onDown);
        card.removeEventListener('pointermove', onMovePtr);
        card.removeEventListener('pointerup', onUp);
        card.removeEventListener('pointercancel', onUp);
        window.removeEventListener('resize', onResize);
        if (io2) io2.disconnect();
        tag.classList.remove('dragging');
      }
    };
  }

  // ---------- Dane tej przesyłki (prawy margines): waga strony, liczba zapytań i czas wczytania, mierzone w przeglądarce.
  function fillWeight() {
    var box = $('.print-weight');
    if (!box || !window.performance || !performance.getEntriesByType) return;
    var nav = performance.getEntriesByType('navigation')[0];
    var res = performance.getEntriesByType('resource');
    var size = function (e) { return e ? (e.encodedBodySize || e.transferSize || 0) : 0; };
    var bytes = size(nav) + res.reduce(function (a, r) { return a + size(r); }, 0);
    var t = nav ? (nav.loadEventEnd || nav.domContentLoadedEventEnd) : 0;
    var set = function (k, v) { var el = $('[data-pw="' + k + '"]', box); if (el) el.textContent = v; };
    if (bytes) set('kb', Math.round(bytes / 1024) + ' KB');
    set('req', String(res.length + 1));
    if (t) set('time', (t / 1000).toFixed(1).replace('.', ',') + ' s');
  }
  window.addEventListener('load', function () { setTimeout(fillWeight, 300); });
  // Stempel pocztowy z dzisiejszą datą.
  $$('[data-today]').forEach(function (el) {
    var n = new Date(), p = function (v) { return (v < 10 ? '0' : '') + v; };
    el.textContent = p(n.getDate()) + '.' + p(n.getMonth() + 1) + '.' + n.getFullYear();
  });

  // ---------- TRASA PACZKI: przystanki w miejscach sekcji, paczka jedzie z postępem przewijania.
  function setupRail(animate) {
    var rail = $('.rail');
    if (!rail) return function () {};
    var track = $('.rail-track', rail), fill = $('.rail-fill', rail), parcel = $('.rail-parcel', rail), cube = $('.rail-parcel .cube', rail);
    var stops = $$('.rail-stops li', rail).map(function (li) { return { li: li, el: $(li.dataset.target), pos: 0 }; });
    var trackH = 0, maxScroll = 1;
    var py = animate ? gsap.quickTo(parcel, 'y', { duration: 0.45, ease: 'power3' }) : function (v) { gsap.set(parcel, { y: v }); };
    function layout() {
      trackH = track.offsetHeight;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      stops.forEach(function (s, i) {
        var top = i === 0 || !s.el ? 0 : s.el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
        s.pos = Math.max(0, Math.min(1, top / maxScroll));
        s.li.style.top = (s.pos * 100).toFixed(2) + '%';
      });
    }
    function update() {
      var p = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      py(p * trackH);
      fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      if (cube) cube.style.setProperty('--ry', (38 + p * 720).toFixed(1) + 'deg');
      var on = 0;
      stops.forEach(function (s, i) { if (p + 0.002 >= s.pos) on = i; });
      stops.forEach(function (s, i) { s.li.classList.toggle('on', i === on); s.li.classList.toggle('done', i < on); });
    }
    layout(); update();
    var st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: function () { layout(); update(); } });
    // Na górze strony zostaje sama etykieta; trasa pojawia się, gdy taśmy miną jej górną krawędź (bez nachodzenia).
    var show = ScrollTrigger.create({
      trigger: '.tapes', end: 'max', invalidateOnRefresh: true,
      start: function () { return 'bottom ' + Math.max(0, Math.round(rail.getBoundingClientRect().top) - 24) + 'px'; },
      onEnter: function () { rail.classList.add('on'); }, onLeaveBack: function () { rail.classList.remove('on'); }
    });
    return function () { st.kill(); show.kill(); rail.classList.remove('on'); };
  }

  var mm = gsap.matchMedia();
  mm.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 901px)',
    mobile: '(max-width: 900px)',
    wide: '(min-width: 1180px)',
    rail: '(min-width: 1600px)',
    prints: '(min-width: 1800px)'
  }, function (ctx) {
    var c = ctx.conditions;
    var cleanups = [];
    if (c.rail) cleanups.push(setupRail(c.motion));
    var tagApi = c.wide ? setupTag(c.motion) : null;
    if (tagApi) cleanups.push(tagApi.cleanup);

    if (!c.motion) {
      if (btn) {
        var onStatic = function () { live.textContent = DONE; };
        btn.addEventListener('click', onStatic);
        cleanups.push(function () { btn.removeEventListener('click', onStatic); });
      }
      return function () { cleanups.forEach(function (f) { f(); }); };
    }

    // ---------- Płynne przewijanie (Lenis) zsynchronizowane z ScrollTrigger.
    var lenis = null;
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      lenisRef = lenis;
      if (root.classList.contains('ld-on')) { lenis.stop(); loaderGate.then(function () { lenis.start(); }); }
      lenis.on('scroll', ScrollTrigger.update);
      var raf = function (t) { lenis.raf(t * 1000); };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      var onLink = function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a || a.hasAttribute('data-top')) return;
        var id = a.getAttribute('href');
        var target = id.length > 1 ? $(id) : null;
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -12, duration: 1.4, easing: easeInOutCubic });
        if (id === '#main') return;
        var focusEl = target.matches('section') ? target : null;
        if (focusEl) { focusEl.setAttribute('tabindex', '-1'); setTimeout(function () { focusEl.focus({ preventScroll: true }); }, 1250); }
      };
      d.addEventListener('click', onLink);
      cleanups.push(function () { d.removeEventListener('click', onLink); gsap.ticker.remove(raf); lenis.destroy(); lenisRef = null; });
    }

    // ---------- ETYKIETA: spada na karton, drukuje się linia po linii, potem taśma i marker.
    var sticker = $('.sticker');
    var intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    gsap.set(sticker, { opacity: 0, y: -60, rotation: -5, scale: 1.05, transformPerspective: 1400 });
    gsap.set('.sticker-shadow', { opacity: 0, scale: 1.1, y: 70 });
    gsap.set('.frame', { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set('.tape-hero', { opacity: 0, x: -40, rotation: -9 });
    gsap.set('.hero .mark', { '--mk': 0 });
    gsap.set('.peek', { opacity: 0, y: -110 });
    intro
      .to(sticker, { opacity: 1, y: 0, rotation: c.desktop ? -0.6 : 0, scale: 1, duration: 0.7, ease: 'expo.out' })
      .to('.sticker-shadow', { opacity: 1, scale: 1, y: c.desktop ? 16 : 12, duration: 0.7, ease: 'expo.out' }, '<')
      .to('.frame', { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'steps(22)', clearProps: 'clipPath' }, 0.3)
      .fromTo('.printhead', { y: 0, opacity: 1 }, { y: function () { return $('.frame').offsetHeight - 3; }, duration: 0.8, ease: 'steps(22)', immediateRender: false }, '<')
      .to('.printhead', { opacity: 0, duration: 0.25, ease: 'power2.out' })
      .to('.tape-hero', { opacity: 1, x: 0, rotation: -2.5, duration: 0.4, ease: 'back.out(2.4)' }, '-=0.25')
      .fromTo('.hangtag', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none', immediateRender: true, onStart: function () { if (tagApi) tagApi.drop(); } }, '<')
      .to('.hero .mark', { '--mk': 1, duration: 0.45, ease: 'power2.inOut', stagger: 0.15 }, '-=0.2')
      .to('.peek', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7');
    loaderGate.then(function () { return Promise.race([fontsReady, wait(1200)]); }).then(function () { intro.play(); });

    // Etykieta lekko odchyla się za kursorem; połysk to osobna warstwa przesuwana transformacją.
    if (c.desktop) {
      var wrapEl = $('.sticker-wrap');
      var glare = $('.glare b');
      var rx = gsap.quickTo(sticker, 'rotationX', { duration: 0.7, ease: 'power3' });
      var ry = gsap.quickTo(sticker, 'rotationY', { duration: 0.7, ease: 'power3' });
      var gx = gsap.quickTo(glare, 'x', { duration: 0.5, ease: 'power3' });
      var gy = gsap.quickTo(glare, 'y', { duration: 0.5, ease: 'power3' });
      var onMove = function (e) {
        if (wrapEl.querySelector('.hangtag.dragging')) return;
        var r = wrapEl.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 5);
        rx(-py * 4);
        // Połysk pokazuje się dopiero, gdy stoi pod kursorem (bez przejazdu z rogu etykiety).
        if (!sticker.classList.contains('glare-on')) { gsap.set(glare, { x: e.clientX - r.left, y: e.clientY - r.top }); sticker.classList.add('glare-on'); }
        gx(e.clientX - r.left);
        gy(e.clientY - r.top);
      };
      var onLeave = function () { rx(0); ry(0); sticker.classList.remove('glare-on'); };
      wrapEl.addEventListener('pointermove', onMove);
      wrapEl.addEventListener('pointerleave', onLeave);
      cleanups.push(function () { wrapEl.removeEventListener('pointermove', onMove); wrapEl.removeEventListener('pointerleave', onLeave); sticker.classList.remove('glare-on'); });
      gsap.to('.sticker-wrap', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // ---------- TAŚMY: przewijają się w pętli, szybciej przy szybkim przewijaniu.
    var loops = [];
    $$('.tape-track').forEach(function (track, i) {
      var first = track.innerHTML;
      var run = track.parentElement;
      while (track.scrollWidth < run.offsetWidth * 2.2) track.insertAdjacentHTML('beforeend', first);
      track.insertAdjacentHTML('beforeend', track.innerHTML);
      var half = track.scrollWidth / 2;
      var dir = i % 2 ? 1 : -1;
      var tw = gsap.fromTo(track, { x: dir < 0 ? 0 : -half }, { x: dir < 0 ? -half : 0, duration: half / 55, ease: 'none', repeat: -1 });
      loops.push(tw);
      cleanups.push(function () { track.innerHTML = first; });
    });
    var restT;
    ScrollTrigger.create({
      trigger: '.tapes', start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { loops.forEach(function (l) { l.paused(!self.isActive); }); },
      onUpdate: function (self) {
        var sign = self.direction === -1 ? -1 : 1;
        var ts = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 260) * sign;
        loops.forEach(function (l) { gsap.to(l, { timeScale: ts, duration: 0.2, overwrite: true }); });
        clearTimeout(restT);
        restT = setTimeout(function () { loops.forEach(function (l) { gsap.to(l, { timeScale: sign, duration: 0.9, overwrite: true }); }); }, 140);
      }
    });
    gsap.from('.tape-run-a', { xPercent: -12, rotation: -7, ease: 'none', scrollTrigger: { trigger: '.tapes', start: 'top bottom', end: 'center 45%', scrub: 0.8 } });
    gsap.from('.tape-run-b', { xPercent: 12, rotation: 6, ease: 'none', scrollTrigger: { trigger: '.tapes', start: 'top bottom', end: 'center 45%', scrub: 0.8 } });

    // ---------- PROTOKÓŁ: kartka wjeżdża, ptaszki rysują się w rytm czytania, na końcu pieczątka.
    gsap.from('.form-sheet', { x: -90, rotation: -5, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.pain', start: 'top 90%' } });
    var tickPaths = $$('.box path');
    gsap.set(tickPaths, { strokeDashoffset: 1 });
    var ticks = gsap.timeline({ scrollTrigger: { trigger: '.checks', start: 'top 85%', end: 'bottom 75%', scrub: 0.35 } });
    tickPaths.forEach(function (p, i) { ticks.to(p, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' }, i * 1.15); });
    gsap.set('.verdict .stamp', { opacity: 0, scale: 2.4, rotation: -30 });
    gsap.set('.verdict-text', { opacity: 0, y: 16 });
    // Pieczątka dopiero po ostatnim ptaszku (na telefonie, gdy werdykt wjedzie na ekran).
    // Sekwencja podpięta pod ScrollTrigger, więc przy szybkim przewijaniu kończy się od razu.
    // Drgnięcie kartki na xPercent (wartości bezwzględne), żeby nie zderzało się z wjazdem kartki po osi x.
    var verdictTl = gsap.timeline({ paused: true })
      .to('.verdict .stamp', { opacity: 0.95, scale: 1, rotation: -9, duration: 0.3, ease: 'power4.in' })
      .to('.form-sheet', { xPercent: 0.6, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' }, '>-0.02')
      .to('.verdict-text', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.05');
    ScrollTrigger.create(c.desktop
      ? { trigger: '.checks', start: 'bottom 75%', end: 'bottom 15%', animation: verdictTl }
      : { trigger: '.verdict', start: 'top 88%', animation: verdictTl });

    // ---------- CENNIK: arkusz opada, wiersze się drukują, kartony obracają się z przewijaniem.
    gsap.from('.price-sheet', { y: 100, rotation: 2.5, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.services', start: 'top 92%' } });
    $$('.price-row').forEach(function (row) {
      gsap.from(row, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'steps(10)', clearProps: 'clipPath', scrollTrigger: { trigger: row, start: 'top 95%' } });
    });
    $$('.price-row .cube').forEach(function (cube, i) {
      gsap.fromTo(cube, { '--ry': (-40 + i * 12) + 'deg' }, {
        '--ry': (120 + i * 12) + 'deg', ease: 'none',
        scrollTrigger: { trigger: cube, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    });
    gsap.fromTo('.clock-hand', { rotation: 0 }, { rotation: 360, svgOrigin: '32 32', ease: 'none', scrollTrigger: { trigger: '.clock', start: 'top bottom', end: 'bottom top', scrub: true } });

    // ---------- PRZYKŁAD: drukarka wydaje paragon, a na kartkach pojawiają się zaznaczenia.
    var roll = d.getElementById('roll');
    var led = $('.led');
    var hlMarks = $$('.hl i');
    var penPaths = $$('.pen path');
    var printing = false;
    var printed = false;
    gsap.set(roll, { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(hlMarks, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(penPaths, { strokeDashoffset: 1 });
    var FEED = 1.9;
    var curPrint = null;
    function printTl() {
      var tl = gsap.timeline({
        onStart: function () { printing = true; btn.disabled = true; },
        onComplete: function () {
          printing = false; printed = true; btn.disabled = false;
          btn.textContent = 'Oderwij i drukuj ponownie';
          live.textContent = DONE;
        }
      });
      curPrint = tl;
      tl.to(led, { opacity: 0.2, duration: 0.11, repeat: 17, yoyo: true, ease: 'none' }, 0)
        .to('.printer-body', { x: 0.7, duration: 0.045, repeat: 41, yoyo: true, ease: 'none' }, 0.1)
        .to(roll, { clipPath: 'inset(0% 0% 0% 0%)', duration: FEED, ease: 'steps(34)' }, 0.1)
        .fromTo(roll, { y: -14 }, { y: 0, duration: FEED, ease: 'none' }, 0.1)
        .set('.printer-body', { x: 0 });
      $$('.hl, .pen').forEach(function (el) {
        var t = 0.1 + FEED * (0.16 + (+el.dataset.at / 22) * 0.6);
        if (el.classList.contains('hl')) tl.to($('i', el), { scaleX: 1, duration: 0.32, ease: 'power2.out' }, t);
        else tl.to($('path', el), { strokeDashoffset: 0, duration: 0.45, ease: 'power2.inOut' }, t);
      });
      return tl;
    }
    function tearAndReprint() {
      if (printing) return;
      printing = true;
      gsap.timeline()
        .to(roll, { y: 160, rotation: 8, opacity: 0, duration: 0.55, ease: 'power2.in' })
        .set(roll, { clipPath: 'inset(0% 0% 100% 0%)', y: 0, rotation: 0, opacity: 1 })
        .to(hlMarks, { scaleX: 0, duration: 0.2, transformOrigin: 'right center' }, '<')
        .to(penPaths, { strokeDashoffset: 1, duration: 0.2 }, '<')
        .set(hlMarks, { transformOrigin: 'left center' })
        .add(function () { printing = false; printTl(); });
    }
    var onPrint = function () { if (printing) return; if (!printed) printTl(); else tearAndReprint(); };
    btn.addEventListener('click', onPrint);
    cleanups.push(function () { btn.removeEventListener('click', onPrint); btn.textContent = 'Drukuj raport'; btn.disabled = false; });
    ScrollTrigger.create({ trigger: '.printer', start: 'top 88%', once: true, onEnter: function () { if (!printed && !printing) printTl(); } });
    // Gdy przewiniesz dalej w trakcie druku, raport od razu się kończy.
    var finishPrint = function () { if (printing && curPrint) curPrint.progress(1); };
    ScrollTrigger.create({ trigger: '.desk', start: 'top bottom', end: 'bottom top', onLeave: finishPrint, onLeaveBack: finishPrint });

    if (c.desktop) {
      var sheets = $$('.sheet');
      gsap.from(sheets, { y: -70, opacity: 0, rotation: function (i) { return [-9, 7, -6, 5][i] || 0; }, duration: 0.75, ease: 'back.out(1.4)', stagger: 0.08, scrollTrigger: { trigger: '.desk', start: 'top 90%' } });
      if (window.Draggable) {
        var drags = Draggable.create(sheets, {
          type: 'x,y', bounds: '.desk', inertia: !!window.InertiaPlugin, zIndexBoost: true,
          onPress: function () { gsap.to(this.target, { scale: 1.035, duration: 0.2, ease: 'power2.out' }); },
          onRelease: function () { gsap.to(this.target, { scale: 1, duration: 0.35, ease: 'power2.out' }); }
        });
        cleanups.push(function () { drags.forEach(function (dr) { dr.kill(); }); });
      }
    }

    // ---------- ŚLEDZENIE: paczka jedzie po osi, statusy zapalają się po kolei.
    var stages = $$('.stage');
    var lineFill = $('.line-fill');
    var trackTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.track', start: 'top 85%', end: 'center 50%', scrub: 0.4, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var p = self.progress;
          stages.forEach(function (s, i) { s.classList.toggle('wait', p < i / (stages.length - 1) - 0.015); });
        }
      }
    });
    stages.forEach(function (s, i) { if (i) s.classList.add('wait'); });
    if (c.desktop) {
      var parcel = $('.parcel');
      var line = $('.line');
      gsap.set(lineFill, { scaleX: 0 });
      trackTl.to(lineFill, { scaleX: 1, ease: 'none' }, 0)
        .fromTo(parcel, { x: function () { return -line.offsetWidth; } }, { x: 0, ease: 'none' }, 0);
      var bob = gsap.to('.parcel .carton', { y: -3, duration: 0.18, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
      ScrollTrigger.create({ trigger: '.track', start: 'top bottom', end: 'bottom top', onToggle: function (self) { bob.paused(!self.isActive); } });
    } else {
      gsap.set(lineFill, { scaleY: 0 });
      trackTl.to(lineFill, { scaleY: 1, ease: 'none' }, 0);
    }
    cleanups.push(function () { stages.forEach(function (s) { s.classList.remove('wait'); }); });
    gsap.from('.track', { y: 80, rotation: -2, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.steps', start: 'top 92%' } });
    gsap.from('.track-note', { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.6, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: '.track-note', start: 'top 97%' } });

    // ---------- KIM JESTEM: zdjęcie drukuje się jak na drukarce termicznej.
    gsap.from('.id-card', { y: 80, rotation: 2, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.about', start: 'top 92%' } });
    gsap.fromTo('.id-photo img', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'steps(24)', scrollTrigger: { trigger: '.id-card', start: 'top 85%' } });

    // ---------- PROJEKTY: zdjęcia spadają na karton, taśma je przykleja; przy najechaniu prostują się.
    $$('.polaroid').forEach(function (p, i) {
      var rot = [-0.8, -1.6, 1.4][i] || 0;
      gsap.set(p, { rotation: rot });
      gsap.from(p, { y: -140, rotation: rot + (i % 2 ? -9 : 9), opacity: 0, duration: 0.85, ease: 'back.out(1.25)', delay: i * 0.1, scrollTrigger: { trigger: p, start: 'top 92%' } });
      gsap.from($('.tape-bit', p), { scaleX: 0, transformOrigin: 'left center', duration: 0.35, ease: 'power2.out', delay: 0.5 + i * 0.1, scrollTrigger: { trigger: p, start: 'top 92%' } });
      if (c.desktop) {
        if (i) gsap.to(p, { yPercent: i === 1 ? 5 : -7, ease: 'none', scrollTrigger: { trigger: '.projects', start: 'top bottom', end: 'bottom top', scrub: true } });
        var enter = function () { gsap.to(p, { rotation: 0, y: -8, scale: 1.012, duration: 0.5, ease: 'power3.out' }); };
        var leave = function () { gsap.to(p, { rotation: rot, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }); };
        p.addEventListener('pointerenter', enter);
        p.addEventListener('pointerleave', leave);
        cleanups.push(function () { p.removeEventListener('pointerenter', enter); p.removeEventListener('pointerleave', leave); });
      }
    });

    // ---------- FAQ i list przewozowy: naklejki dociskane do kartonu.
    gsap.from('.faq-label', { y: 70, rotation: -2, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.faq', start: 'top 92%' } });
    gsap.from('.waybill', { y: 80, rotation: 3, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 92%' } });

    // ---------- Nagłówki jednowierszowe raz się rozciągają, gdy wjeżdżają na ekran.
    // Transformacja zamiast osi szerokości kroju: oś przeliczała układ strony w każdej klatce.
    $$('h2.kin').forEach(function (h) {
      var inner = h.querySelector('.kin-in');
      if (!inner) { inner = d.createElement('span'); inner.className = 'kin-in'; while (h.firstChild) inner.appendChild(h.firstChild); h.appendChild(inner); }
      gsap.fromTo(inner, { scaleX: 0.84 }, { scaleX: 1, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 94%' } });
    });

    // ---------- Nadruki na marginesie przesuwają się wolniej niż treść (głębia).
    if (c.prints) {
      $$('.print').forEach(function (el) {
        gsap.fromTo(el, { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }

    // ---------- Stopka: duży kod kreskowy drukuje się od lewej.
    gsap.from('.foot-code', { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.8, ease: 'steps(20)', clearProps: 'clipPath', scrollTrigger: { trigger: '.foot', start: 'top 96%' } });

    fontsReady.then(function () { ScrollTrigger.refresh(); });
    return function () { cleanups.forEach(function (f) { f(); }); };
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
