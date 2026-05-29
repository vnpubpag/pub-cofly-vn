/* ============================================
   Cofly / CoLog — Landing Page JS
   Ported to Astro (client-side inline)
   ============================================ */

(function () {
  "use strict";

  /* ------------------------------------------
     1. Scroll-to buttons
     ------------------------------------------ */
  document.querySelectorAll("[data-scroll-to]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-scroll-to"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ------------------------------------------
     2. Mobile menu toggle
     ------------------------------------------ */
  var menuBtn = document.querySelector(".lp-header__menu-btn");
  var mobileNav = document.querySelector(".lp-mobile-nav");

  if (menuBtn && mobileNav) {
    function setMenuIcon(isOpen) {
      var bars = menuBtn.querySelector(".icon-bars");
      var close = menuBtn.querySelector(".icon-close");
      if (bars) bars.style.display = isOpen ? "none" : "block";
      if (close) close.style.display = isOpen ? "block" : "none";
    }

    menuBtn.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen);
      setMenuIcon(isOpen);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        setMenuIcon(false);
      });
    });
  }

  /* ------------------------------------------
     3. Header shadow on scroll
     ------------------------------------------ */
  var header = document.querySelector(".lp-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("lp-header--scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------
     4. Fade-in on scroll
     ------------------------------------------ */
  var fadeEls = document.querySelectorAll(".lp-fade-in");
  if (fadeEls.length && "IntersectionObserver" in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------
     5. AI circuit animation pause
     ------------------------------------------ */
  var heroSection = document.querySelector("#hero");
  var aicCircuit = document.querySelector(".lp-ai-circuit");
  if (aicCircuit && heroSection && "IntersectionObserver" in window) {
    var aicObs = new IntersectionObserver(
      function (entries) {
        var visible = entries[0].isIntersecting;
        aicCircuit
          .querySelectorAll(
            ".aic-signal, .aic-chip__glow, .aic-node, .aic-output-card",
          )
          .forEach(function (el) {
            el.style.animationPlayState = visible ? "running" : "paused";
          });
      },
      { threshold: 0.05 },
    );
    aicObs.observe(heroSection);
  }

  /* ------------------------------------------
     6. Platform layer tabs (auto-advance)
     ------------------------------------------ */
  var platformSection = document.querySelector("#platform");
  if (platformSection) {
    (function initPlatformTabs() {
      var tabs = platformSection.querySelectorAll(".lp-platform__tab");
      var panels = platformSection.querySelectorAll(".lp-platform__panel");
      if (!tabs.length || !panels.length) return;

      var autoTimer = null;
      var DURATION = 8000;
      var reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      var layers = [];
      tabs.forEach(function (tab) {
        layers.push(tab.getAttribute("data-layer"));
      });

      function activateTab(layerName) {
        tabs.forEach(function (tab) {
          var isTarget = tab.getAttribute("data-layer") === layerName;
          tab.classList.toggle("is-active", isTarget);
          tab.setAttribute("aria-selected", isTarget ? "true" : "false");
          if (isTarget) {
            var bar = tab.querySelector(".lp-platform__tab-progress-bar");
            if (bar) {
              bar.style.animation = "none";
              void bar.offsetWidth;
              bar.style.animation = "";
            }
          }
        });
        panels.forEach(function (panel) {
          var isTarget = panel.getAttribute("data-layer") === layerName;
          panel.classList.toggle("is-active", isTarget);
          if (isTarget) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      }

      function getActiveIndex() {
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].classList.contains("is-active")) return i;
        }
        return 0;
      }

      function advanceToNext() {
        var next = (getActiveIndex() + 1) % layers.length;
        activateTab(layers[next]);
      }

      function startAutoAdvance() {
        stopAutoAdvance();
        if (!reducedMotion) {
          autoTimer = setInterval(advanceToNext, DURATION);
        }
      }

      function stopAutoAdvance() {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          activateTab(tab.getAttribute("data-layer"));
          startAutoAdvance();
        });
      });

      tabs.forEach(function (tab, index) {
        tab.addEventListener("keydown", function (e) {
          var newIndex = -1;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            newIndex = (index + 1) % tabs.length;
          } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            newIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (e.key === "Home") {
            e.preventDefault();
            newIndex = 0;
          } else if (e.key === "End") {
            e.preventDefault();
            newIndex = tabs.length - 1;
          }
          if (newIndex >= 0) {
            tabs[newIndex].focus();
            activateTab(layers[newIndex]);
            startAutoAdvance();
          }
        });
      });

      if ("IntersectionObserver" in window) {
        var visObs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                startAutoAdvance();
              } else {
                stopAutoAdvance();
              }
            });
          },
          { threshold: 0.2 },
        );
        visObs.observe(platformSection);
      } else {
        startAutoAdvance();
      }

      var tabsContainer = platformSection.querySelector(".lp-platform__tabs");
      if (tabsContainer) {
        tabsContainer.addEventListener("mouseenter", stopAutoAdvance);
        tabsContainer.addEventListener("mouseleave", startAutoAdvance);
      }

      activateTab(layers[0]);
    })();
  }

  /* ------------------------------------------
     7. Spotlight slider
     ------------------------------------------ */
  (function initSpotlightSlider() {
    var track = document.querySelector(".lp-spotlight__track");
    var prevBtn = document.querySelector(".lp-spotlight__arrow--prev");
    var nextBtn = document.querySelector(".lp-spotlight__arrow--next");
    if (!track || !prevBtn || !nextBtn) return;

    var currentIndex = 0;
    var DRAG_THRESHOLD = 40;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 767) return 1;
      if (w <= 1023) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, track.children.length - getVisibleCount());
    }

    function getBaseTranslate() {
      var cards = track.children;
      if (!cards.length) return 0;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      return -(currentIndex * (cards[0].offsetWidth + gap));
    }

    function updateSlider() {
      var cards = track.children;
      if (!cards.length) return;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var offset = currentIndex * (cards[0].offsetWidth + gap);
      track.style.transform = "translateX(-" + offset + "px)";
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= getMaxIndex();
    }

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });
    nextBtn.addEventListener("click", function () {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateSlider();
      }
    });

    window.addEventListener("resize", function () {
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updateSlider();
    });

    updateSlider();

    // Mouse drag
    var wrapper = document.querySelector(".lp-spotlight__track-wrapper");
    var isDragging = false;
    var startX = 0;
    var dragOffset = 0;
    var baseTranslate = 0;

    wrapper.addEventListener("mousedown", function (e) {
      isDragging = true;
      startX = e.clientX;
      baseTranslate = getBaseTranslate();
      track.style.transition = "none";
      wrapper.style.cursor = "grabbing";
      e.preventDefault();
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      dragOffset = e.clientX - startX;
      track.style.transform =
        "translateX(" + (baseTranslate + dragOffset) + "px)";
    });

    window.addEventListener("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = "";
      wrapper.style.cursor = "";
      if (dragOffset < -DRAG_THRESHOLD && currentIndex < getMaxIndex()) {
        currentIndex++;
      } else if (dragOffset > DRAG_THRESHOLD && currentIndex > 0) {
        currentIndex--;
      }
      dragOffset = 0;
      updateSlider();
    });

    // Touch swipe
    var touchStartX = 0;
    var touchDragOffset = 0;

    wrapper.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.touches[0].clientX;
        baseTranslate = getBaseTranslate();
        track.style.transition = "none";
      },
      { passive: true },
    );

    wrapper.addEventListener(
      "touchmove",
      function (e) {
        touchDragOffset = e.touches[0].clientX - touchStartX;
        track.style.transform =
          "translateX(" + (baseTranslate + touchDragOffset) + "px)";
      },
      { passive: true },
    );

    wrapper.addEventListener("touchend", function () {
      track.style.transition = "";
      if (touchDragOffset < -DRAG_THRESHOLD && currentIndex < getMaxIndex()) {
        currentIndex++;
      } else if (touchDragOffset > DRAG_THRESHOLD && currentIndex > 0) {
        currentIndex--;
      }
      touchDragOffset = 0;
      updateSlider();
    });
  })();

  /* ------------------------------------------
     8. Sphere Lottie background
     ------------------------------------------ */
  (function initSphereLottie() {
    var container = document.querySelector(".lp-agent__sphere-bg");
    if (!container || typeof lottie === "undefined") return;

    var section = document.getElementById("usecases");
    var inputEl = section.querySelector(".lp-agent__input");

    function positionSphere() {
      var sectionRect = section.getBoundingClientRect();
      var inputRect = inputEl.getBoundingClientRect();
      var centerY = inputRect.top - sectionRect.top + inputRect.height / 2;
      container.style.top = centerY + "px";
    }

    var anim = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "/assets/sphere_1.json",
    });

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            anim.play();
          } else {
            anim.pause();
          }
        },
        { threshold: 0.05 },
      );
      obs.observe(container);
    } else {
      anim.play();
    }

    window.addEventListener("resize", positionSphere);
    positionSphere();
  })();

  /* ------------------------------------------
     9. Typing animation (agent input)
     ------------------------------------------ */
  (function initTypingAnimation() {
    var el = document.querySelector(".lp-agent__typing");
    if (!el) return;

    var phrases = [
      "Ca đêm qua có sự cố nào chưa xử lý không?",
      "Tóm tắt log vận hành tuần này theo từng ca",
      "Nhân viên nào chưa nộp báo cáo hôm nay?",
      "So sánh số lượng sự cố tháng này với tháng trước",
    ];

    var TYPE_SPEED = 45;
    var DELETE_SPEED = 25;
    var PAUSE_AFTER_TYPE = 1800;
    var PAUSE_AFTER_DELETE = 400;

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function tick() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex >= current.length) {
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER_TYPE);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex <= 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, PAUSE_AFTER_DELETE);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    setTimeout(tick, 600);
  })();

  /* ------------------------------------------
     10. Contact CTA → reveal form
     ------------------------------------------ */
  (function initContactCTA() {
    var section = document.getElementById("contact");
    if (!section) return;
    var ctaBtn = section.querySelector(".lp-final-cta__ctas .cl-btn");
    var ghostWrap = section.querySelector(".lp-final-cta__ghost-form");
    var inner = section.querySelector(".lp-final-cta__inner");
    if (!ctaBtn || !ghostWrap || !inner) return;

    ctaBtn.addEventListener("click", function () {
      inner.classList.add("lp-final-cta--active");
      ghostWrap.setAttribute("aria-hidden", "false");
      ghostWrap.querySelectorAll("[tabindex='-1']").forEach(function (el) {
        el.removeAttribute("tabindex");
      });
      var firstInput = ghostWrap.querySelector("input");
      if (firstInput) firstInput.focus();
    });
  })();
})();
