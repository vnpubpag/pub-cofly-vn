/* ============================================
   Colog — Landing Page JS
   JS thuần, nạp bằng is:inline. Chỉ còn hai việc CSS không làm được:
   quả cầu Lottie sau ô hỏi AI, và chữ tự gõ trong ô hỏi.
   Điều hướng trong trang dùng link neo, hiệu ứng cuộn dùng CSS.
   ============================================ */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------
     1. Quả cầu Lottie sau ô hỏi AI
     ------------------------------------------ */
  (function initSphereLottie() {
    var container = document.querySelector(".lp-agent__sphere-bg");
    var section = document.getElementById("usecases");
    if (!container || !section || typeof lottie === "undefined") return;

    var inputEl = section.querySelector(".lp-agent__input");
    if (!inputEl) return;

    // Đặt tâm quả cầu ngang với ô hỏi. Đo bằng offset để không lệch khi phần tử đang chạy hiệu ứng hiện dần.
    function positionSphere() {
      var top = 0;
      var el = inputEl;
      while (el && el !== section) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      container.style.top = top + inputEl.offsetHeight / 2 + "px";
    }

    var anim = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "/colog/assets/sphere_1.json",
    });

    if (reducedMotion) {
      // Không chạy: dừng ở một khung hình giữa vòng để quả cầu vẫn hiện.
      anim.addEventListener("DOMLoaded", function () {
        anim.goToAndStop(60, true);
      });
    } else if ("IntersectionObserver" in window) {
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
    window.addEventListener("load", positionSphere);
    positionSphere();
  })();

  /* ------------------------------------------
     2. Chữ tự gõ trong ô hỏi AI
     HTML đã có sẵn câu đầu tiên, nên tắt JS hoặc giảm chuyển động thì ô hỏi vẫn có chữ.
     ------------------------------------------ */
  (function initTypingAnimation() {
    var el = document.querySelector(".lp-agent__typing");
    if (!el || reducedMotion) return;

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
    var charIndex = phrases[0].length;
    var isDeleting = true;

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

    setTimeout(tick, PAUSE_AFTER_TYPE);
  })();
})();
