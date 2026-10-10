(function () {
  document.documentElement.classList.add('js');

  var header = document.querySelector('.header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');

  // Sombra no header ao rolar
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Animação de entrada e link ativo no menu
  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });

    var links = document.querySelectorAll('.nav__list a');
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { sectionIO.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.getElementById('ano').textContent = new Date().getFullYear();

  // ===== Efeitos =====
  var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Diferenciais: ordem da cascata, luz que segue o mouse e inclinação 3D
  var podeInclinar = !reduzMovimento && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.bento .perk').forEach(function (card, i) {
    card.style.setProperty('--i', i);
    var luz = document.createElement('span');
    luz.className = 'perk__spot';
    luz.setAttribute('aria-hidden', 'true');
    card.insertBefore(luz, card.firstChild);

    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
      if (podeInclinar) {
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 6).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 6).toFixed(2) + 'deg) translateY(-6px)';
      }
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });
  document.querySelectorAll('.structure .chips li').forEach(function (li, i) { li.style.setProperty('--i', i); });

  // Botão elástico: mola com velocidade e amortecimento
  document.querySelectorAll('.js-elastico').forEach(function (btn) {
    if (reduzMovimento) return;
    var escala = 1, vel = 0, alvo = 1, id = null, dentro = false;
    function passo() {
      var forca = (alvo - escala) * 0.22; // rigidez da mola
      vel = (vel + forca) * 0.72;         // amortecimento
      escala += vel;
      if (Math.abs(vel) < 0.0004 && Math.abs(alvo - escala) < 0.0004) {
        escala = alvo;
        btn.style.transform = alvo === 1 ? '' : 'scale(' + alvo + ')';
        id = null;
        return;
      }
      btn.style.transform = 'scale(' + escala.toFixed(4) + ')';
      id = requestAnimationFrame(passo);
    }
    function mirar(v) { alvo = v; if (!id) id = requestAnimationFrame(passo); }
    btn.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { dentro = true; mirar(1.1); } });
    btn.addEventListener('pointerleave', function () { dentro = false; mirar(1); });
    btn.addEventListener('pointerdown', function () { mirar(0.9); });
    btn.addEventListener('pointerup', function () { mirar(dentro ? 1.1 : 1); });
    btn.addEventListener('pointercancel', function () { mirar(1); });
  });
})();
