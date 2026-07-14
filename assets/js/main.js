/* ============================================================
   Marina Duarte — interações
   Sem dependências. Transform/opacity apenas. ~3 KB gzip.
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Navbar: transparente → blur ao rolar ---------- */
  const nav = document.getElementById("nav");
  let navTicking = false;
  const onScroll = () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
      navTicking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () =>
    setMenu(toggle.getAttribute("aria-expanded") !== "true")
  );
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  /* ---------- Scroll reveal com stagger ---------- */
  const revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll(".count");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const frame = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    const cio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            runCounter(e.target);
            cio.unobserve(e.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------- Parallax sutil em elementos decorativos ---------- */
  const parallaxEls = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax),
  }));
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      for (const { el, speed } of parallaxEls) {
        el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
      }
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Luz dinâmica na foto do hero (desktop) ---------- */
  const heroPhoto = document.getElementById("heroPhoto");
  if (heroPhoto && finePointer && !reduceMotion) {
    heroPhoto.addEventListener("pointermove", (e) => {
      const r = heroPhoto.getBoundingClientRect();
      heroPhoto.style.setProperty("--lx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      heroPhoto.style.setProperty("--ly", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    });
  }

  /* ---------- Borda iluminada seguindo o cursor (cards) ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".glow-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Ripple elegante nos botões ---------- */
  if (!reduceMotion) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointerdown", (e) => {
        const r = btn.getBoundingClientRect();
        const d = Math.max(r.width, r.height);
        const span = document.createElement("span");
        span.className = "ripple";
        span.style.width = span.style.height = `${d}px`;
        span.style.left = `${e.clientX - r.left - d / 2}px`;
        span.style.top = `${e.clientY - r.top - d / 2}px`;
        btn.appendChild(span);
        span.addEventListener("animationend", () => span.remove());
      });
    });
  }

  /* ---------- FAQ: fecha os demais ao abrir um ---------- */
  const faqs = document.querySelectorAll(".faq__item");
  faqs.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqs.forEach((other) => other !== item && (other.open = false));
    });
  });
})();
