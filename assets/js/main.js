/* ============================================================
   Rafael Duarte — interações
   Sem dependências. Apenas transform/opacity (GPU).
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Navbar: escurece + blur ao rolar ---------- */
  const navbar = document.getElementById("navbar");
  let navTicking = false;

  const updateNavbar = () => {
    const menuOpen = document.getElementById("navLinks").classList.contains("is-open");
    navbar.classList.toggle("is-scrolled", menuOpen || window.scrollY > 12);
    navTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!navTicking) {
        navTicking = true;
        requestAnimationFrame(updateNavbar);
      }
    },
    { passive: true }
  );
  updateNavbar();

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu de navegação");
    updateNavbar();
  };

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    updateNavbar();
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll("[data-counter]");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterIO.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.counter));
  }

  /* ---------- Glow acompanhando o cursor (desktop) ---------- */
  const cursorGlow = document.getElementById("cursorGlow");

  if (cursorGlow && finePointer && !reduceMotion) {
    let mx = -9999;
    let my = -9999;
    let gx = mx;
    let gy = my;
    let glowRaf = null;

    const renderGlow = () => {
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      cursorGlow.style.transform = `translate3d(${gx - 280}px, ${gy - 280}px, 0)`;
      if (Math.abs(mx - gx) > 0.5 || Math.abs(my - gy) > 0.5) {
        glowRaf = requestAnimationFrame(renderGlow);
      } else {
        glowRaf = null;
      }
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursorGlow.classList.add("is-active");
        if (glowRaf === null) glowRaf = requestAnimationFrame(renderGlow);
      },
      { passive: true }
    );
  }

  /* ---------- Parallax extremamente leve na imagem da Hero ---------- */
  const heroVisual = document.getElementById("heroVisual");
  const heroImg = heroVisual ? heroVisual.querySelector("img") : null;

  if (heroImg && finePointer && !reduceMotion) {
    const hero = document.querySelector(".hero");
    let px = 0;
    let py = 0;
    let hx = 0;
    let hy = 0;
    let heroRaf = null;

    const renderParallax = () => {
      hx += (px - hx) * 0.06;
      hy += (py - hy) * 0.06;
      heroImg.style.transform = `translate3d(${hx}px, ${hy}px, 0) scale(1.02)`;
      if (Math.abs(px - hx) > 0.05 || Math.abs(py - hy) > 0.05) {
        heroRaf = requestAnimationFrame(renderParallax);
      } else {
        heroRaf = null;
      }
    };

    hero.addEventListener(
      "pointermove",
      (e) => {
        const r = hero.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * -8;
        py = ((e.clientY - r.top) / r.height - 0.5) * -5;
        if (heroRaf === null) heroRaf = requestAnimationFrame(renderParallax);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => {
      px = 0;
      py = 0;
      if (heroRaf === null) heroRaf = requestAnimationFrame(renderParallax);
    });
  }

  /* ---------- Ano do rodapé ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
