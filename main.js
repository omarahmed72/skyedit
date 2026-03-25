// --- Page Switching Logic ---
// function switchPage(pageId) {
//   const pages = [
//     "home",
//     "about",
//     "explore",
//     "blogs",
//     "contact",
//     "calculator",
//     "sell",
//     "login",
//     "signup",
//   ];

//   // Scroll to top
//   window.scrollTo({ top: 0, behavior: "smooth" });

//   pages.forEach((id) => {
//     const el = document.getElementById(id);
//     if (id === pageId + "-page") {
//       el.classList.remove("hidden");
//       // Force play video when page becomes visible
//       const vid = el.querySelector("video");
//       if (vid) {
//         vid.play().catch((e) => console.log("Autoplay prevented:", e));
//       }
//     } else {
//       el.classList.add("hidden");
//     }
//   });
//   if (pageId === "about") resetAndRunStats();
// }

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
    const step = target / 60; // 60 steps for animation

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

  // Show/Hide sublinks for projects in mobile just for visual effect
  const sublinks = document.querySelectorAll(".mobile-nav-sublink");
  sublinks.forEach((link) => {
    link.style.display = menu.classList.contains("active") ? "block" : "none";
  });
}

// --- Navbar Hide on Scroll ---
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.classList.add("nav-hidden");
  } else {
    navbar.classList.remove("nav-hidden");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// --- Theme Switching & Video Fix ---
// --- Theme Switching & Video Fix ---
const themeIcon = document.getElementById("theme-icon");
const navLogo = document.getElementById("nav-logo");

// Initialize from localStorage
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

// Apply immediately on load
applyTheme();

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  applyTheme();

  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    if (!v.paused) return;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Video auto-replay handled.");
      });
    }
  });
}

// --- UPDATED: Responsive Slider Logic (Replaces Cylinder) ---
const sliderItems = [
  {
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    title: "Aerial View",
  },
  {
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
    title: "Grand Lobby",
  },
  {
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    title: "Rear Facade",
  },
  {
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    title: "Left Wing",
  },
  {
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    title: "Night Mode",
  },
  {
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
    title: "Main Hall",
  },
  {
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    title: "Detailing",
  },
  {
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    title: "Entrance",
  },
  {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    title: "Living Space",
  },
  {
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop",
    title: "Garden",
  },
];

const track = document.getElementById("slider-track");
const dotsContainer = document.getElementById("slider-dots");
let currentIndex = 0;
let slidesPerView = 3;

// Detect screen size to adjust items visible
function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function initSlider() {
  if (!track || !dotsContainer) return;
  track.innerHTML = "";
  dotsContainer.innerHTML = "";
  slidesPerView = getSlidesPerView();

  // Render Slides
  sliderItems.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "slide-item";
    slide.innerHTML = `
      <div class="slide-card">
        <img src="${item.img}" class="slide-img" alt="${item.title}">
        <div class="slide-content">
          <div class="slide-title">${item.title}</div>
          <div class="slide-bar"></div>
        </div>
      </div>
    `;
    track.appendChild(slide);

    // Create Dots (Optional: might be too many dots for many items, limiting or logic needed if list is huge)
    // For simplicity, we create a dot per slide group or just per slide
    const dot = document.createElement("div");
    dot.className = "dot";
    if (index === 0) dot.classList.add("active");
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
  });

  updateSliderPosition();
}

function updateSliderPosition() {
  if (!track) return;
  const slideWidth = 100 / slidesPerView;
  track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

  // Update Dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
  });
}

function moveSlider(direction) {
  const maxIndex = sliderItems.length - 1;
  currentIndex += direction;

  // Infinite loop effect logic
  if (currentIndex < 0) {
    currentIndex = maxIndex;
  } else if (currentIndex > maxIndex) {
    currentIndex = 0;
  }

  updateSliderPosition();
}

function goToSlide(index) {
  currentIndex = index;
  updateSliderPosition();
}

// Resize Listener
window.addEventListener("resize", () => {
  const newSlidesPerView = getSlidesPerView();
  if (newSlidesPerView !== slidesPerView) {
    slidesPerView = newSlidesPerView;
    // Reset to 0 or adjust current index to fit
    if (currentIndex > sliderItems.length - 1) {
      currentIndex = sliderItems.length - 1;
    }
    updateSliderPosition();
  }
});

// Touch / Swipe Logic for Mobile
let touchStartX = 0;
let touchEndX = 0;

if (track) {
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    moveSlider(1); // Swipe Left -> Next
  }
  if (touchEndX > touchStartX + 50) {
    moveSlider(-1); // Swipe Right -> Prev
  }
}

// Initialize
initSlider();

// --- Audio Logic ---
function enableAudio() {
  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    v.muted = false;
    v.volume = 0.5;
    safePlay(v);
  });
  const hint = document.getElementById("sound-hint");
  if (hint) hint.classList.remove("visible");
  document.removeEventListener("click", enableAudio);
  document.removeEventListener("touchstart", enableAudio);
}
document.addEventListener("click", enableAudio);
document.addEventListener("touchstart", enableAudio);

// --- Video Watchdog (Keeps background videos playing) ---
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("pause", (e) => {
    // If the video is on the currently visible page and not hidden
    if (!video.closest(".hidden") && document.visibilityState === "visible") {
      console.log("Video paused unexpectedly, resuming...");
      video.play().catch(() => {});
    }
  });
});

// --- Stats Counter Animation ---
const statsSection = document.getElementById("stats-section");
let hasCounted = false;

const startCounters = () => {
  const counters = document.querySelectorAll(".counter");
  const speed = 50;

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 30);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasCounted) {
        startCounters();
        hasCounted = true;
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

async function safePlay(video) {
  try {
    await video.play();
  } catch (e) {
    console.log("Auto-play prevented");
  }
}

/* --- Custom Select Logic --- */
function toggleCustomSelect() {
  document.getElementById("freq-wrapper").classList.toggle("open");
}

function selectFreq(value, text) {
  document.getElementById("aff-income-freq").value = value;
  document.getElementById("selected-freq-text").innerText = text;
  document.getElementById("freq-wrapper").classList.remove("open");

  const options = document.querySelectorAll(".custom-option");
  options.forEach((opt) => opt.classList.remove("selected"));
  event.target.classList.add("selected");
}

document.addEventListener("click", function (e) {
  const wrapper = document.getElementById("freq-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove("open");
  }
});

/* --- Calculator Logic --- */
let currentCalcMode = "installment";

function switchCalcMode(mode) {
  currentCalcMode = mode;
  document
    .getElementById("tab-installment")
    .classList.toggle("active", mode === "installment");
  document
    .getElementById("tab-affordability")
    .classList.toggle("active", mode === "affordability");

  if (mode === "installment") {
    document.getElementById("form-installment").style.display = "block";
    document.getElementById("form-affordability").style.display = "none";
    document.getElementById("res-installment-view").style.display = "block";
    document.getElementById("res-affordability-view").style.display = "none";
  } else {
    document.getElementById("form-installment").style.display = "none";
    document.getElementById("form-affordability").style.display = "block";
    document.getElementById("res-installment-view").style.display = "none";
    document.getElementById("res-affordability-view").style.display = "block";
  }
}

function calculate() {
  const fmt = (num) => Math.round(num).toLocaleString("en-US") + " EGP";

  if (currentCalcMode === "installment") {
    const price = parseFloat(document.getElementById("calc-price").value) || 0;
    const dpPercent =
      parseFloat(document.getElementById("calc-dp-percent").value) || 0;
    const years = parseFloat(document.getElementById("calc-years").value) || 1;
    const interestRate =
      parseFloat(document.getElementById("calc-interest").value) || 0;

    const dpAmount = price * (dpPercent / 100);
    const loanAmount = price - dpAmount;
    const n = years * 12;
    let monthlyPayment = 0;

    if (interestRate === 0) {
      monthlyPayment = n > 0 ? loanAmount / n : 0;
    } else {
      const r = interestRate / 100 / 12;
      monthlyPayment =
        loanAmount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    document.getElementById("monthly-result").innerText = fmt(monthlyPayment);
    document.getElementById("res-total").innerText = fmt(price);
    document.getElementById("res-dp").innerText = fmt(dpAmount);
    document.getElementById("res-loan").innerText = fmt(loanAmount);
  } else {
    const rawIncome =
      parseFloat(document.getElementById("aff-income").value) || 0;
    const incomeFreq =
      parseFloat(document.getElementById("aff-income-freq").value) || 1;
    const monthlyIncome = rawIncome / incomeFreq;
    const cashDp = parseFloat(document.getElementById("aff-dp").value) || 0;
    const years = parseFloat(document.getElementById("aff-years").value) || 1;
    const interestRate =
      parseFloat(document.getElementById("aff-interest").value) || 0;

    const maxMonthlyPayment = monthlyIncome * 0.4;
    const n = years * 12;
    let maxLoan = 0;

    if (interestRate === 0) {
      maxLoan = maxMonthlyPayment * n;
    } else {
      const r = interestRate / 100 / 12;
      maxLoan =
        maxMonthlyPayment *
        ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    }

    const maxPrice = maxLoan + cashDp;
    document.getElementById("aff-max-price").innerText = fmt(maxPrice);
    document.getElementById("aff-monthly").innerText = fmt(maxMonthlyPayment);
    document.getElementById("aff-loan").innerText = fmt(maxLoan);
  }
}

function calculateInstallment() {
  calculate();
}

/* --- Sell Page Logic --- */
function selectPill(element, groupName) {
  const group = document.getElementById(groupName + "-pills");
  const pills = group.getElementsByClassName("pill-option");

  // Remove active from all in group
  for (let pill of pills) {
    pill.classList.remove("active");
  }
  // Add active to clicked
  element.classList.add("active");
}

function handleFileSelect(event) {
  const files = event.target.files;
  const previewContainer = document.getElementById("preview-container");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith("image/")) continue;

    const reader = new FileReader();
    reader.onload = function (e) {
      const div = document.createElement("div");
      div.className = "preview-img-wrapper";
      div.innerHTML = `
                        <img src="${e.target.result}" class="preview-img">
                        <div class="remove-img-btn" onclick="this.parentElement.remove()">X</div>
                    `;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  }
}

function submitListing() {
  const btn = document.querySelector("#sell-form .submit-btn");
  const originalText = btn.innerText;
  btn.innerText = "Processing...";
  btn.disabled = true;

  // Gather data
  const title = document.getElementById("sell-title")
    ? document.getElementById("sell-title").value
    : "";
  const category = document.getElementById("sell-category")
    ? document.getElementById("sell-category").value
    : "";
  const price = document.getElementById("sell-price")
    ? document.getElementById("sell-price").value
    : "";
  const area = document.getElementById("sell-area")
    ? document.getElementById("sell-area").value
    : "";

  // Get active pills
  const bedroomsActive = document.querySelector(
    "#bedrooms-pills .pill-option.active",
  );
  const bedrooms = bedroomsActive ? bedroomsActive.innerText : "";
  const bathroomsActive = document.querySelector(
    "#bathrooms-pills .pill-option.active",
  );
  const bathrooms = bathroomsActive ? bathroomsActive.innerText : "";

  const desc = document.getElementById("sell-desc")
    ? document.getElementById("sell-desc").value
    : "";
  const gov = document.getElementById("sell-gov")
    ? document.getElementById("sell-gov").value
    : "";
  const city = document.getElementById("sell-city")
    ? document.getElementById("sell-city").value
    : "";
  const name = document.getElementById("sell-name")
    ? document.getElementById("sell-name").value
    : "";
  const phone = document.getElementById("sell-phone")
    ? document.getElementById("sell-phone").value
    : "";
  const email = document.getElementById("sell-email")
    ? document.getElementById("sell-email").value
    : "";

  // Handle Images (take the first preview if exists)
  const previewContainer = document.getElementById("preview-container");
  let imageBase64 =
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80"; // default
  if (previewContainer && previewContainer.querySelector("img")) {
    imageBase64 = previewContainer.querySelector("img").src;
  }

  const obj = {
    id: Date.now(),
    title,
    category,
    price,
    area,
    bedrooms,
    bathrooms,
    desc,
    gov,
    city,
    name,
    phone,
    email,
    image: imageBase64,
    status: "Pending", // Default status
  };

  let sellUnits = JSON.parse(localStorage.getItem("sky_sell_units")) || [];
  sellUnits.push(obj);
  localStorage.setItem("sky_sell_units", JSON.stringify(sellUnits));

  setTimeout(() => {
    btn.innerText = originalText;
    btn.disabled = false;
    showToast("Ad submitted successfully! Under review.", "success");

    // Admin notification simulation
    setTimeout(() => {
      showToast("New Ad Submission Received (Admin)", "admin");
      console.log(
        "New Ad Data:",
        `User: ${name}, Type: ${category}, Price: ${price}`,
      );
    }, 2000);

    document.getElementById("sell-form").reset();
    if (document.getElementById("preview-container")) {
      document.getElementById("preview-container").innerHTML = "";
    }
    // Reset pills
    document
      .querySelectorAll(".pill-option")
      .forEach((p) => p.classList.remove("active"));
  }, 1500);
}

function showToast(message, type = "success") {
  const toast =
    type === "admin"
      ? document.getElementById("admin-toast")
      : document.getElementById("client-toast");
  toast.querySelector("span").innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* --- Audio Logic --- */

/* --- Audio Logic --- */
function enableAudio() {
  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    v.muted = false;
    v.volume = 0.5;
    safePlay(v);
  });
  const hint = document.getElementById("sound-hint");
  if (hint) hint.classList.remove("visible");
  document.removeEventListener("click", enableAudio);
  document.removeEventListener("touchstart", enableAudio);
}

/* --- Blog Logic --- */
document.addEventListener("click", enableAudio);
document.addEventListener("touchstart", enableAudio);

var nextBtn = document.querySelector(".next"),
  prevBtn = document.querySelector(".prev"),
  carousel = document.querySelector(".carousel"),
  list = document.querySelector(".list"),
  item = document.querySelectorAll(".item"),
  runningTime = document.querySelector(".timeRunning");

let timeRunning = 3000;
let timeAutoNext = 7000;

let runTimeOut;
if (nextBtn && prevBtn && carousel && list) {
  nextBtn.onclick = function () {
    showSlider("next");
  };
  prevBtn.onclick = function () {
    showSlider("prev");
  };
  let runNextAuto = setTimeout(() => {
    nextBtn.click();
  }, timeAutoNext);
  
  function resettimeAnimation() {
    if (runningTime) {
      runningTime.style.animation = "none";
      runningTime.offsetHeight; /* trigger reflow */
      runningTime.style.animation = null;
      runningTime.style.animation = "runningTime 7s linear 1 forwards";
    }
  }

  function showSlider(type) {
    let sliderItems = document.querySelectorAll(".carousel .list .item");

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
    }, timeRunning);
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
      nextBtn.click();
    }, timeAutoNext);
    resettimeAnimation();
  }

  // Start the initial animation
  resettimeAnimation();
}

function toggleAccordion(index) {
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  // SVG for Minus icon
  const minusSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
      </svg>
    `;

  // SVG for Plus icon
  const plusSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
      </svg>
    `;

  // Toggle the content's max-height for smooth opening and closing
  if (content.style.maxHeight && content.style.maxHeight !== "0px") {
    content.style.maxHeight = "0";
    icon.innerHTML = plusSVG;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    icon.innerHTML = minusSVG;
  }
}

// ==========================================
// CHATBOT LOGIC
// ==========================================

function toggleChat(shouldFocus = true) {
  const widget = document.getElementById("chatbot-widget");
  if (!widget) return;
  widget.classList.toggle("active");

  // Focus input if opening and requested
  if (widget.classList.contains("active") && shouldFocus) {
    const chatInput = document.getElementById("chat-input");
    if (chatInput) setTimeout(() => chatInput.focus(), 300);
  }
}

function handleChatKey(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

// Function to handle sending message from the bottom input bar
function sendFromBottomBar() {
  const bottomInput = document.getElementById("bottom-bar-input");
  const msg = bottomInput.value.trim();

  // Ensure chat window is open when button is clicked (regardless of text)
  const widget = document.getElementById("chatbot-widget");
  if (widget && !widget.classList.contains("active")) {
    toggleChat(false); // Open without stealing focus immediately if triggered by button click to see history
  }

  if (msg) {
    processMessage(msg); // Send message
    bottomInput.value = ""; // Clear input
  }
}

function handleBottomBarKey(e) {
  if (e.key === "Enter") {
    sendFromBottomBar();
  }
}

function sendOption(optionText) {
  processMessage(optionText);
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (msg) {
    processMessage(msg);
    input.value = "";
  }
}

function processMessage(msg) {
  const chatBody = document.getElementById("chat-body");

  // User Message
  const userDiv = document.createElement("div");
  userDiv.className = "message user-message";
  userDiv.innerText = msg;
  chatBody.appendChild(userDiv);

  // Scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulate Typing
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.innerHTML =
    '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot Response Delay
  setTimeout(() => {
    typingDiv.remove();
    const response = getBotResponse(msg);
    const botDiv = document.createElement("div");
    botDiv.className = "message bot-message";
    botDiv.innerHTML = response;
    chatBody.appendChild(botDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 1000);
}

// Simple Rule-Based AI
function getBotResponse(input) {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
    return "Hello there! Welcome to SkyPioneers. Are you looking to buy, sell, or explore our projects?";
  } else if (
    lowerInput.includes("project") ||
    lowerInput.includes("residential")
  ) {
    return "We have amazing residential projects available! Check out <a href='projects.html' style='color:var(--accent-gold); font-weight:bold;'>Sky City</a> and <a href='projects.html' style='color:var(--accent-gold); font-weight:bold;'>Blue Horizon</a>. Would you like to see the masterplans?";
  } else if (lowerInput.includes("price") || lowerInput.includes("cost")) {
    return "Our units start from <strong>2.5M EGP</strong> with flexible installment plans up to 8 years. You can use our <a href='calculator.html' style='color:var(--accent-gold);'>Mortgage Calculator</a> to estimate your payments.";
  } else if (lowerInput.includes("sell")) {
    return "Great choice! You can list your unit with us directly. Please visit our <a href='sell.html' style='color:var(--accent-gold); font-weight:bold;'>Sell Unit</a> page to upload your property details.";
  } else if (
    lowerInput.includes("contact") ||
    lowerInput.includes("number") ||
    lowerInput.includes("call")
  ) {
    return "You can reach our sales team at <strong>19900</strong> or visit our sales center in New Cairo. Would you like me to have an agent call you?";
  } else if (lowerInput.includes("location") || lowerInput.includes("map")) {
    return "Our primary projects are located in the heart of New Capital and North Coast. You can view the exact locations on our <a href='map.html' style='color:var(--accent-gold);'>Interactive Map</a>.";
  } else {
    return "I'm not sure I understand, but I'd love to help. You can choose an option below or ask about 'Projects', 'Prices', or 'Selling'.";
  }
}

// Open chat when bottom bar input is focused
const bottomBarInput = document.getElementById("bottom-bar-input");
if (bottomBarInput) {
  bottomBarInput.addEventListener("focus", () => {
    const widget = document.getElementById("chatbot-widget");
    if (widget && !widget.classList.contains("active")) {
      toggleChat(false); // Don't steal focus
    }
  });
}

// Add event listener to any button with class .send-btn inside the chat input
// This ensures clicking the send button specifically triggers the logic
document.addEventListener("DOMContentLoaded", () => {
  const sendBtns = document.querySelectorAll(".tesla-chat-input .send-btn");
  sendBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent accidental form submissions
      sendFromBottomBar();
    });
  });
});

// ==========================================
// CHATBOT LOGIC
// ==========================================

// ... (باقي الدوال كما هي) ...


/* ========================================= */
/* GLOBAL SEARCH FEATURE LOGIC               */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Search initializing...");
  const searchTrigger = document.getElementById("global-search-trigger");
  const searchExpandable = document.getElementById("global-search-expandable");
  const searchInput = document.getElementById("global-search-input");
  const searchClose = document.getElementById("global-search-close");
  const searchResults = document.getElementById("global-search-results");

  if (!searchTrigger || !searchExpandable || !searchInput || !searchClose || !searchResults) {
    console.error("Search elements missing:", { searchTrigger, searchExpandable, searchInput, searchClose, searchResults });
    return;
  }

  // Toggle search bar
  searchTrigger.addEventListener("click", (e) => {
    console.log("Search trigger clicked");
    e.stopPropagation();
    searchExpandable.classList.add("active");
    searchInput.focus();
    searchTrigger.style.display = "none";
  });

  // Close search bar
  const closeSearch = () => {
    searchExpandable.classList.remove("active");
    searchResults.classList.remove("active");
    searchInput.value = "";
    setTimeout(() => {
      searchTrigger.style.display = "flex";
      searchResults.innerHTML = "";
    }, 300); // Wait for transition
  };

  searchClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeSearch();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (
      !searchExpandable.contains(e.target) &&
      !searchResults.contains(e.target)
    ) {
      closeSearch();
    }
  });

  // Real-time search logic
  let debounceTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.toLowerCase().trim();

    if (query.length === 0) {
      searchResults.classList.remove("active");
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  function performSearch(query) {
    // Data sources mapping: Icon, Detail Page URL, LocalStorage Key
    const sources = [
      {
        id: "projects",
        title: "Projects",
        icon: "fa-building",
        url: "project-details.html",
        key: "sky_projects",
        parse: (i) => ({ title: i.title, desc: i.developer || i.category }),
      },
      {
        id: "blogs",
        title: "Blogs",
        icon: "fa-newspaper",
        url: "blog-details.html",
        key: "sky_blogs",
        parse: (i) => ({ title: i.title, desc: i.author || i.date }),
      },
      {
        id: "explore",
        title: "Explore",
        icon: "fa-compass",
        url: "explore-details.html",
        key: "sky_explores",
        parse: (i) => ({ title: i.title, desc: i.location || i.description }),
      },
      {
        id: "careers",
        title: "Careers",
        icon: "fa-briefcase",
        url: "career-details.html",
        key: "sky_careers",
        parse: (i) => ({ title: i.title, desc: i.department || i.workplace }),
      },
      {
        id: "developers",
        title: "Developers",
        icon: "fa-hard-hat",
        url: "developer-detalis.html",
        key: "sky_developers",
        parse: (i) => ({ title: i.name, desc: i.desc || i.contactEmail }),
      },
      {
        id: "newsletter",
        title: "Newsletter",
        icon: "fa-envelope",
        url: "newsletter-details.html",
        key: "sky_newsletters",
        parse: (i) => ({ title: i.title, desc: i.date }),
      },
      {
        id: "units",
        title: "Units",
        icon: "fa-home",
        url: "unit-details.html",
        key: "sky_units",
        parse: (i) => ({
          title: i.title,
          desc: i.price ? "$" + i.price : i.size,
        }),
      },
    ];

    let hasResults = false;
    let resultsHTML = "";

    sources.forEach((src) => {
      const dataStr = localStorage.getItem(src.key);
      if (!dataStr) return;

      try {
        const data = JSON.parse(dataStr);
        if (!Array.isArray(data)) return;

        const filtered = data.filter((item) => {
          const parsed = src.parse(item);
          return (
            (parsed.title && parsed.title.toLowerCase().includes(query)) ||
            (parsed.desc && parsed.desc.toLowerCase().includes(query))
          );
        });

        if (filtered.length > 0) {
          hasResults = true;
          resultsHTML += `<div class="search-results-group">
                        <div class="search-group-title">${src.title}</div>`;

          filtered.slice(0, 3).forEach((item) => {
            // Limit to 3 per category to avoid huge lists
            const parsed = src.parse(item);
            resultsHTML += `<a href="${src.url}?id=${item.id}" class="search-result-item">
                            <i class="fas ${src.icon}"></i>
                            <div class="search-result-content">
                                <span class="search-result-title">${parsed.title || "Untitled"}</span>
                                <span class="search-result-desc">${parsed.desc || ""}</span>
                            </div>
                        </a>`;
          });

          if (filtered.length > 3) {
            resultsHTML += `<a href="#" class="search-result-item" style="justify-content: center; color: var(--accent-gold); font-size: 0.8rem;">
                            View all ${filtered.length} results...
                        </a>`;
          }
          resultsHTML += `</div>`;
        }
      } catch (err) {
        console.error("Search parse error in", src.key, err);
      }
    });

    if (!hasResults) {
      searchResults.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
    } else {
      searchResults.innerHTML = resultsHTML;
    }

    searchResults.classList.add("active");
  }
});
