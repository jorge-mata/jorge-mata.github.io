import { animate, stagger, inView } from "https://cdn.jsdelivr.net/npm/motion@11/+esm";

/* -------------------------------------------------------------
   Setup
------------------------------------------------------------- */
document.documentElement.classList.remove("no-js");
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Recalculate ScrollTrigger positions once fonts/late content settle the final layout.
window.addEventListener("load", () => ScrollTrigger.refresh());
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* -------------------------------------------------------------
   Page loader
------------------------------------------------------------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: "power2.out",
    onComplete: () => loader.remove(),
  });
});

/* -------------------------------------------------------------
   Snake-like traveling border on "Let's talk" buttons, reacting to scroll
------------------------------------------------------------- */
(function initSnakeButtons() {
  const buttons = document.querySelectorAll(".snake-btn");
  if (!buttons.length || prefersReducedMotion) return;

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    onUpdate: (self) => {
      const angle = self.progress * 720;
      buttons.forEach((btn) => btn.style.setProperty("--angle", angle + "deg"));
    },
  });
})();

/* -------------------------------------------------------------
   Vertical scroll-progress indicator (fills like a download bar)
------------------------------------------------------------- */
(function initScrollProgress() {
  const fill = document.querySelector(".scroll-progress-fill");
  const hero = document.getElementById("hero");
  if (!fill || !hero) return;

  gsap.to(fill, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
})();

/* -------------------------------------------------------------
   Custom cursor (GSAP quickTo for buttery follow)
------------------------------------------------------------- */
(function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring || prefersReducedMotion) return;

  const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  document.querySelectorAll("a, button, .magnetic, .tilt-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-active");
      gsap.to(ring, { scale: 1.6, duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active");
      gsap.to(ring, { scale: 1, duration: 0.3 });
    });
  });
})();

/* -------------------------------------------------------------
   Mobile nav toggle
------------------------------------------------------------- */
(function initNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("flex");
    menu.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.classList.toggle("nav-open");
    if (!prefersReducedMotion) {
      gsap.from(menu.children, { y: -12, opacity: 0, stagger: 0.06, duration: 0.35, ease: "power2.out" });
    }
  });

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
      toggle.classList.remove("nav-open");
    })
  );
})();

/* -------------------------------------------------------------
   Nav underline indicator that glides to the hovered/active link
------------------------------------------------------------- */
(function initNavIndicator() {
  const nav = document.getElementById("navLinks");
  const indicator = document.getElementById("navIndicator");
  if (!nav || !indicator) return;

  const moveTo = (el) => {
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    gsap.to(indicator, {
      x: rect.left - navRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const active = nav.querySelector(".nav-link.is-active");
  if (active) moveTo(active);

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", () => moveTo(link));
  });
  nav.addEventListener("mouseleave", () => {
    if (active) moveTo(active);
    else gsap.to(indicator, { opacity: 0, duration: 0.3 });
  });
})();

/* -------------------------------------------------------------
   Scroll-triggered reveal animations
------------------------------------------------------------- */
(function initReveals() {
  const items = gsap.utils.toArray(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  items.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );
  });

  gsap.utils.toArray(".reveal-stagger").forEach((group) => {
    const children = group.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 85%", once: true },
      }
    );
  });
})();

/* -------------------------------------------------------------
   Parallax blobs following pointer + scroll drift
------------------------------------------------------------- */
(function initBlobs() {
  const blobs = gsap.utils.toArray(".blob");
  if (!blobs.length || prefersReducedMotion) return;

  blobs.forEach((blob, i) => {
    const depth = (i + 1) * 18;
    const moveX = gsap.quickTo(blob, "x", { duration: 0.9, ease: "power2.out" });
    const moveY = gsap.quickTo(blob, "y", { duration: 0.9, ease: "power2.out" });
    window.addEventListener("mousemove", (e) => {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      moveX(relX * depth);
      moveY(relY * depth);
    });

    gsap.to(blob, {
      y: "+=60",
      duration: 6 + i,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  });
})();

/* -------------------------------------------------------------
   Bokeh particle field (hero spotlight background)
------------------------------------------------------------- */
(function initParticleField() {
  document.querySelectorAll("[data-particles]").forEach((field) => {
    const count = parseInt(field.getAttribute("data-particles"), 10) || 40;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";

      // Bias particles toward the right/center, sparser near the top-left beam source.
      const left = 20 + Math.random() * 80;
      const top = Math.random() * 100;
      const isBokeh = Math.random() < 0.25;
      const size = isBokeh ? 10 + Math.random() * 18 : 2 + Math.random() * 4;

      particle.style.left = left + "%";
      particle.style.top = top + "%";
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.opacity = (isBokeh ? 0.25 : 0.5) + Math.random() * 0.35;
      particle.style.filter = isBokeh ? "blur(4px)" : "blur(0.5px)";
      field.appendChild(particle);

      if (prefersReducedMotion) continue;

      gsap.to(particle, {
        y: -20 - Math.random() * 40,
        x: (Math.random() - 0.5) * 20,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(particle, {
        opacity: Math.random() * 0.2,
        duration: 1.5 + Math.random() * 3,
        delay: Math.random() * 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  });
})();

/* -------------------------------------------------------------
   Hero heading: split into characters and animate in on load
------------------------------------------------------------- */
(function initHeroSplit() {
  const heading = document.querySelector("[data-split]");
  if (!heading) return;

  const words = heading.textContent.trim().split(/\s+/);
  heading.textContent = "";
  const chars = [];

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";

    [...word].forEach((char) => {
      const charSpan = document.createElement("span");
      charSpan.textContent = char;
      charSpan.style.display = "inline-block";
      wordSpan.appendChild(charSpan);
      chars.push(charSpan);
    });

    heading.appendChild(wordSpan);
    if (wordIndex < words.length - 1) {
      heading.appendChild(document.createTextNode(" "));
    }
  });

  if (prefersReducedMotion) return;

  gsap.fromTo(
    chars,
    { opacity: 0, y: 60, rotateX: -60 },
    { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.025, ease: "back.out(1.7)", delay: 0.3 }
  );
})();

/* -------------------------------------------------------------
   Rotating role/tagline text (Motion)
------------------------------------------------------------- */
(function initRoleRotator() {
  const el = document.querySelector("[data-role-rotator]");
  if (!el) return;

  let roles = [];
  try {
    roles = JSON.parse(el.getAttribute("data-role-rotator"));
  } catch {
    return;
  }
  if (!roles.length) return;

  let i = 0;
  el.textContent = roles[0];

  if (prefersReducedMotion) return;

  setInterval(() => {
    i = (i + 1) % roles.length;
    animate(el, { opacity: [1, 0], y: [0, -10] }, { duration: 0.35 }).finished.then(() => {
      el.textContent = roles[i];
      animate(el, { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
    });
  }, 2600);
})();

/* -------------------------------------------------------------
   Magnetic buttons (Motion)
------------------------------------------------------------- */
(function initMagnetic() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      animate(btn, { x: x * 0.35, y: y * 0.35 }, { duration: 0.3, easing: "ease-out" });
    });
    btn.addEventListener("mouseleave", () => {
      animate(btn, { x: 0, y: 0 }, { duration: 0.5, easing: [0.34, 1.56, 0.64, 1] });
    });
  });
})();

/* -------------------------------------------------------------
   Tilt cards (Motion) — used on project & skill cards
------------------------------------------------------------- */
(function initTiltCards() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      animate(
        card,
        { rotateY: px * 14, rotateX: py * -14, scale: 1.02 },
        { duration: 0.4, easing: "ease-out" }
      );
    });
    card.addEventListener("mouseleave", () => {
      animate(card, { rotateY: 0, rotateX: 0, scale: 1 }, { duration: 0.6, easing: [0.34, 1.56, 0.64, 1] });
    });
  });
})();

/* -------------------------------------------------------------
   Fade-in on scroll into view (Motion inView) for elements
   that want a lighter-weight alternative to GSAP ScrollTrigger
------------------------------------------------------------- */
(function initInViewFade() {
  document.querySelectorAll(".fade-in-view").forEach((el) => {
    if (prefersReducedMotion) {
      el.style.opacity = 1;
      return;
    }
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, easing: "ease-out" });
    });
  });
})();

/* -------------------------------------------------------------
   Portfolio filter (portfolio.html)
------------------------------------------------------------- */
(function initFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const match = filter === "all" || card.getAttribute("data-category") === filter;
        if (match) {
          card.style.display = "";
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
        } else {
          gsap.to(card, {
            opacity: 0,
            y: 20,
            duration: 0.25,
            onComplete: () => (card.style.display = "none"),
          });
        }
      });
    });
  });
})();

/* -------------------------------------------------------------
   Animated counters (about.html stats)
------------------------------------------------------------- */
(function initCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = el.getAttribute("data-count").includes(".") ? 1 : 0;
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => (el.textContent = counter.val.toFixed(decimals) + suffix),
        }),
    });
  });
})();

/* -------------------------------------------------------------
   Skill bars (about.html)
------------------------------------------------------------- */
(function initSkillBars() {
  document.querySelectorAll(".skill-bar-fill").forEach((bar) => {
    const pct = bar.getAttribute("data-percent") || "0";
    ScrollTrigger.create({
      trigger: bar,
      start: "top 92%",
      once: true,
      onEnter: () => gsap.to(bar, { width: pct + "%", duration: 1.2, ease: "power3.out" }),
    });
  });
})();

/* -------------------------------------------------------------
   Timeline reveal (about.html)
------------------------------------------------------------- */
(function initTimeline() {
  const track = document.querySelector("[data-timeline-track]");
  if (!track) return;
  gsap.fromTo(
    track,
    { scaleY: 0 },
    {
      scaleY: 1,
      transformOrigin: "top",
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 0.6,
      },
    }
  );
})();

/* -------------------------------------------------------------
   Marquee (infinite horizontal scroll of skills/tools)
------------------------------------------------------------- */
(function initMarquee() {
  document.querySelectorAll(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
    if (prefersReducedMotion) return;
    gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
  });
})();

/* -------------------------------------------------------------
   Vertical marquee (infinite downward scroll, e.g. hero skills column)
------------------------------------------------------------- */
(function initVerticalMarquee() {
  document.querySelectorAll(".marquee-track-vertical").forEach((track) => {
    track.innerHTML += track.innerHTML;
    if (prefersReducedMotion) return;
    gsap.fromTo(
      track,
      { yPercent: -50 },
      { yPercent: 0, duration: 18, ease: "none", repeat: -1 }
    );
  });
})();

/* -------------------------------------------------------------
   Contact form (contact.html) — fake submit with success state
------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const message = document.getElementById("formMessage");
  if (!form || !message) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending...";

    setTimeout(() => {
      btn.textContent = label;
      btn.disabled = false;
      form.reset();
      message.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
      message.classList.remove("hidden");
      if (!prefersReducedMotion) {
        gsap.fromTo(message, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      } else {
        message.style.opacity = 1;
      }
    }, 900);
  });
})();

/* -------------------------------------------------------------
   Section heading gradient sweep on scroll
------------------------------------------------------------- */
(function initSectionLabels() {
  gsap.utils.toArray(".eyebrow").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: -16 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      }
    );
  });
})();
