/* --- Stats Counter Logic --- */
let hasCounteds = false;
function resetAndRunStats() {
  hasCounteds = false;
  const counters = document.querySelectorAll(".counter");
  counters.forEach((c) => (c.innerText = "0"));
  runStats();
}
resetAndRunStats();

function runStats() {
  if (hasCounteds) return;
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const isDecimal = counter.getAttribute("data-decimal") === "true";
    let current = 0;
    const step = target / 60;

    const update = () => {
      current += step;
      if (current < target) {
        counter.innerText = isDecimal ? current.toFixed(1) : Math.ceil(current);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
  hasCounteds = true;
}

// --- Mobile Menu Toggle ---
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("active");

  const sublinks = document.querySelectorAll(".mobile-nav-sublink");
  sublinks.forEach((link) => {
    link.style.display = menu.classList.contains("active") ? "block" : "none";
  });
}

// Performance FIX: Throttled Scroll Listener (Passive is ON)
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");
let isScrolling = false;

if (navbar) {
  window.addEventListener(
    "scroll",
    function () {
      if (!isScrolling) {
        window.requestAnimationFrame(function () {
          let scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add("nav-hidden");
          } else {
            navbar.classList.remove("nav-hidden");
          }
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
          isScrolling = false;
        });
        isScrolling = true;
      }
    },
    { passive: true },
  );
}

// --- Theme Switching ---
const themeIcon = document.getElementById("theme-icon");
const navLogo = document.getElementById("nav-logo");

let savedTheme = localStorage.getItem("theme");
let isDarkMode = savedTheme === "dark";

function applyTheme() {
  if (isDarkMode) {
    document.body.setAttribute("data-theme", "dark");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
    if (navLogo) navLogo.src = "imgs/logo white.png";
  } else {
    document.body.removeAttribute("data-theme");
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
    if (navLogo) navLogo.src = "imgs/logo.png";
  }
}

applyTheme();

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  applyTheme();
}

// --- Audio Fix ---
function enableAudio() {
  const videos = document.querySelectorAll("video");
  if (videos.length === 0) return;
  videos.forEach((v) => {
    v.muted = false;
    v.volume = 0.5;
    const playPromise = v.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        v.muted = true;
        v.play();
      });
    }
  });
  const hint = document.getElementById("sound-hint");
  if (hint) hint.classList.remove("visible");
}

document.addEventListener("click", enableAudio, { once: true, passive: true });
document.addEventListener("touchstart", enableAudio, {
  once: true,
  passive: true,
});

// --- OPTIMIZED Blog Carousel Logic (iOS/Safari Fix) ---
var nextBtn = document.querySelector(".next"),
  prevBtn = document.querySelector(".prev"),
  carousel = document.querySelector(".carousel"),
  list = document.querySelector(".list"),
  runningTime = document.querySelector(".timeRunning");

if (nextBtn && prevBtn && carousel) {
  let timeRunning = 500;
  let timeAutoNext = 7000;
  let isAnimating = false; // يمنع تداخل الأوامر عند الضغط السريع

  nextBtn.onclick = function () {
    if (!isAnimating) showSlider("next");
  };
  prevBtn.onclick = function () {
    if (!isAnimating) showSlider("prev");
  };

  let runTimeOut;
  let runNextAuto = setTimeout(() => {
    nextBtn.click();
  }, timeAutoNext);

  function resettimeAnimation() {
    runningTime.style.animation = "none";
    runningTime.offsetHeight; /* Trigger reflow safely */
    runningTime.style.animation = "runningTime 7s linear 1 forwards";
  }

  function showSlider(type) {
    isAnimating = true;
    let sliderItems = document.querySelectorAll(".carousel .list .item");

    // السحر هنا: نأمر المتصفح بتأجيل تعديل الـ DOM حتى يكون مستعداً للرسم
    // هذا يمنع اللاج في الآيفون بشكل قاطع
    window.requestAnimationFrame(() => {
      if (type === "next") {
        list.appendChild(sliderItems[0]);
        carousel.classList.add("next");
      } else {
        list.prepend(sliderItems[sliderItems.length - 1]);
        carousel.classList.add("prev");
      }

      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        carousel.classList.remove("next");
        carousel.classList.remove("prev");
        isAnimating = false; // تحرير القفل بعد انتهاء الحركة
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        nextBtn.click();
      }, timeAutoNext);

      resettimeAnimation();
    });
  }

  resettimeAnimation();
}

// --- OPTIMIZED Blog Carousel Logic ---
// var nextBtn = document.querySelector(".next"),
//   prevBtn = document.querySelector(".prev"),
//   carousel = document.querySelector(".carousel"),
//   list = document.querySelector(".list"),
//   runningTime = document.querySelector(".timeRunning");

// if (nextBtn && prevBtn && carousel) {
//   let timeRunning = 500; // تم تقليل وقت الأنيميشن ليكون أسرع وأكثر استجابة
//   let timeAutoNext = 7000;
//   let isAnimating = false; // متغير لمنع المستخدم من الضغط السريع الذي يسبب اللاج

//   nextBtn.onclick = function () {
//     if (!isAnimating) showSlider("next");
//   };
//   prevBtn.onclick = function () {
//     if (!isAnimating) showSlider("prev");
//   };

//   let runTimeOut;
//   let runNextAuto = setTimeout(() => {
//     nextBtn.click();
//   }, timeAutoNext);

//   function resettimeAnimation() {
//     runningTime.style.animation = "none";
//     runningTime.offsetHeight;
//     runningTime.style.animation = "runningTime 7s linear 1 forwards";
//   }

//   function showSlider(type) {
//     isAnimating = true; // قفل الأزرار أثناء الحركة
//     let sliderItems = document.querySelectorAll(".carousel .list .item");

//     if (type === "next") {
//       list.appendChild(sliderItems[0]);
//       carousel.classList.add("next");
//     } else {
//       list.prepend(sliderItems[sliderItems.length - 1]);
//       carousel.classList.add("prev");
//     }

//     clearTimeout(runTimeOut);
//     runTimeOut = setTimeout(() => {
//       carousel.classList.remove("next");
//       carousel.classList.remove("prev");
//       isAnimating = false; // فتح الأزرار بعد انتهاء الحركة
//     }, timeRunning);

//     clearTimeout(runNextAuto);
//     runNextAuto = setTimeout(() => {
//       nextBtn.click();
//     }, timeAutoNext);

//     resettimeAnimation();
//   }

//   resettimeAnimation();
// }
