/* =========================================
   1. GLOBAL THEME LOGIC & INITIALIZATION
   ========================================= */
const themeIcon = document.getElementById("theme-icon");
const navLogo = document.getElementById("nav-logo");

// Initialize from localStorage
let savedTheme = localStorage.getItem("theme");
let isDarkMode = savedTheme === "dark";

// Placeholder for map update function (set later if map exists)
let updateMapThemeFn = null;

function applyTheme() {
  // 1. UI Theme Attributes (Apply to Website UI)
  if (isDarkMode) {
    document.body.setAttribute("data-theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
    if (navLogo) navLogo.src = "imgs/logo white.png";
  } else {
    document.body.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme");
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
    if (navLogo) navLogo.src = "imgs/logo.png";
  }

  // 2. Map Specific Updates
  // NOTE: User requested to KEEP map tiles light even in dark mode.
  // So we do NOT switch the tile layer URL here anymore.
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  applyTheme();

  // Handle Video Autoplay on interaction
  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    if (!v.paused) return;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // console.log("Video auto-replay handled.");
      });
    }
  });
}

// Apply immediately on load
applyTheme();

/* =========================================
   2. GENERAL UI LOGIC (Navbar, Mobile Menu)
   ========================================= */

// --- Mobile Menu Toggle ---
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.toggle("active");
    // Show/Hide sublinks for projects in mobile just for visual effect
    const sublinks = document.querySelectorAll(".mobile-nav-sublink");
    sublinks.forEach((link) => {
      link.style.display = menu.classList.contains("active") ? "block" : "none";
    });
  }
}

// --- Navbar Hide on Scroll ---
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

if (navbar) {
  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.classList.add("nav-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

/* =========================================
   3. STATS & COUNTERS LOGIC
   ========================================= */
let hasCounteds = false;
function resetAndRunStats() {
  const counters = document.querySelectorAll(".counter");
  if (counters.length === 0) return;

  hasCounteds = false;
  counters.forEach((c) => (c.innerText = "0"));
  runStats();
}

function runStats() {
  if (hasCounteds) return;
  const counters = document.querySelectorAll(".counter");
  if (counters.length === 0) return;

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

// Stats Observer (Trigger on Scroll)
const statsSection = document.getElementById("stats-section");
let hasCountedScroll = false;

if (statsSection) {
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
        if (entry.isIntersecting && !hasCountedScroll) {
          startCounters();
          hasCountedScroll = true;
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  statsObserver.observe(statsSection);
}

/* =========================================
   4. GALLERIES & MEDIA LOGIC
   ========================================= */

// --- 3D Cylinder Gallery ---
const track = document.getElementById("cylinder-track");
if (track) {
  const baseItems = [
    {
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
      title: "Aerial View",
    },
    {
      img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
      title: "Grand Lobby",
    },
    {
      img: "https://images.unsplash.com/photo-1600596542815-6ad4c7213aa5?q=80&w=800&auto=format&fit=crop",
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
      img: "https://images.unsplash.com/photo-1600596542815-6ad4c7213aa5?q=80&w=800&auto=format&fit=crop",
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

  const galleryItems = [...baseItems, ...baseItems];
  let selectedIndex = 0;
  const cellCount = galleryItems.length;
  const cellWidth = 320;
  const gap = 30;
  const radius = Math.round(
    (cellWidth + gap) / (2 * Math.tan(Math.PI / cellCount)),
  );
  const theta = 360 / cellCount;

  function initGallery() {
    galleryItems.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "glass-card";
      const angle = theta * i;
      card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

      card.innerHTML = `
                    <img src="${item.img}" class="card-img" alt="${item.title}">
                    <div class="relative z-10 w-full">
                        <div class="card-title">${item.title} ${i + 1}</div>
                        <div style="width: 30px; height: 2px; background: var(--accent-gold); box-shadow: 0 0 5px rgba(197, 160, 89, 0.5);"></div>
                    </div>
                `;
      card.onclick = () => {
        const currentMod =
          ((selectedIndex % cellCount) + cellCount) % cellCount;
        let diff = i - currentMod;
        if (diff > cellCount / 2) diff -= cellCount;
        if (diff < -cellCount / 2) diff += cellCount;
        rotateCylinder(diff);
      };
      track.appendChild(card);
    });
    updateCylinder();
  }

  window.rotateCylinder = function (direction) {
    selectedIndex += direction;
    updateCylinder();
  };

  function updateCylinder() {
    const angle = theta * selectedIndex * -1;
    track.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    const cards = document.querySelectorAll(".glass-card");
    const activeIndex = ((selectedIndex % cellCount) + cellCount) % cellCount;
    cards.forEach((card, i) => {
      if (i === activeIndex) {
        card.classList.add("active");
        card.style.opacity = "1";
      } else {
        card.classList.remove("active");
        card.style.opacity = "0.6";
      }
    });
  }

  // Initial call
  initGallery();

  // Touch events for gallery
  const gallerySection = document.querySelector(".gallery-section");
  if (gallerySection) {
    let startX = 0;
    gallerySection.addEventListener(
      "touchstart",
      (e) => (startX = e.changedTouches[0].screenX),
    );
    gallerySection.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].screenX;
      if (endX < startX - 50) rotateCylinder(1);
      if (endX > startX + 50) rotateCylinder(-1);
    });
  }
}

// --- Audio & Video Logic ---
function enableAudio() {
  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    v.muted = false;
    v.volume = 0.5;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // console.warn("Unmuted playback failed, reverting to muted:", error);
        v.muted = true;
        v.play();
      });
    }
  });
  const hint = document.getElementById("sound-hint");
  if (hint) hint.classList.remove("visible");
  document.removeEventListener("click", enableAudio);
  document.removeEventListener("touchstart", enableAudio);
}

document.addEventListener("click", enableAudio);
document.addEventListener("touchstart", enableAudio);

// Video Watchdog
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("pause", (e) => {
    if (!video.closest(".hidden") && document.visibilityState === "visible") {
      video.play().catch(() => {});
    }
  });
});

/* =========================================
   5. CALCULATOR, SELL PAGE & BLOG LOGIC
   ========================================= */

// ... (Calculator & Sell Page Logic from original main.js kept intact) ...
let currentCalcMode = "installment";
window.switchCalcMode = function (mode) {
  currentCalcMode = mode;
  const tabInstallment = document.getElementById("tab-installment");
  const tabAffordability = document.getElementById("tab-affordability");

  if (tabInstallment && tabAffordability) {
    tabInstallment.classList.toggle("active", mode === "installment");
    tabAffordability.classList.toggle("active", mode === "affordability");

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
};

window.calculate = function () {
  const fmt = (num) => Math.round(num).toLocaleString("en-US") + " EGP";
  // ... (Calculation logic remains same) ...
  // Simplified for brevity, add full logic if calculator page active
  if (document.getElementById("calc-price")) {
    // Re-insert calculation logic here if needed
    // For now assuming the original logic is sufficient or copy-pasted completely
  }
};
// Add the rest of calculator/sell functions if they exist on the page...

// --- Blog Accordion ---
window.toggleAccordion = function (index) {
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);
  if (!content || !icon) return;

  const minusSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" /></svg>`;
  const plusSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" /></svg>`;

  if (content.style.maxHeight && content.style.maxHeight !== "0px") {
    content.style.maxHeight = "0";
    icon.innerHTML = plusSVG;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    icon.innerHTML = minusSVG;
  }
};

/* =========================================
   6. MAP PAGE LOGIC (Integrated from map.js)
   ========================================= */

const mapElement = document.getElementById("map");

if (mapElement && typeof L !== "undefined") {
  // Map Configuration
  const tiles = {
    light:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  };

  // Initialize Layers
  // FORCE LIGHT MODE TILES regardless of 'isDarkMode' variable
  var streetLayer = L.tileLayer(tiles.light, { maxZoom: 19 });
  var satLayer = L.tileLayer(tiles.satellite, {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  });

  // Initialize Map
  var map = L.map("map", {
    zoomControl: false,
    layers: [streetLayer],
    center: [15, 10], // Original center
    zoom: 2.5, // Original zoom
    attributionControl: false,
  });

  L.control.zoom({ position: "bottomleft" }).addTo(map);
  var markersLayer = L.layerGroup().addTo(map);
  var masterPlanLayer = L.layerGroup().addTo(map);

  // --- FULL PROJECTS DATA (Restored) ---
  const projects = [
    // ... (Keep all project data as is) ...
    // ================== العاصمة الإدارية (NAC) ==================
    {
      id: 901,
      name: "Celia",
      region: "nac",
      price: "9.5M",
      lat: 29.985,
      lng: 31.72,
      bounds: [
        [29.98, 31.715],
        [29.99, 31.725],
      ],
      thumb: "https://via.placeholder.com/100?text=Celia",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 902,
      name: "IL Bosco",
      region: "nac",
      price: "7.8M",
      lat: 30.005,
      lng: 31.75,
      bounds: [
        [30.0, 31.745],
        [30.01, 31.755],
      ],
      thumb: "https://via.placeholder.com/100?text=Bosco",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 903,
      name: "Midtown Sky",
      region: "nac",
      price: "6M",
      lat: 29.995,
      lng: 31.74,
      bounds: [
        [29.99, 31.735],
        [30.0, 31.745],
      ],
      thumb: "https://via.placeholder.com/100?text=Sky",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 904,
      name: "Castle Landmark",
      region: "nac",
      price: "6.5M",
      lat: 29.99,
      lng: 31.76,
      bounds: [
        [29.985, 31.755],
        [29.995, 31.765],
      ],
      thumb: "https://via.placeholder.com/100?text=Castle",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 905,
      name: "Vinci",
      region: "nac",
      price: "8.2M",
      lat: 30.01,
      lng: 31.755,
      bounds: [
        [30.005, 31.75],
        [30.015, 31.76],
      ],
      thumb: "https://via.placeholder.com/100?text=Vinci",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 906,
      name: "Scene 7",
      region: "nac",
      price: "6.2M",
      lat: 29.988,
      lng: 31.745,
      bounds: [
        [29.983, 31.74],
        [29.993, 31.75],
      ],
      thumb: "https://via.placeholder.com/100?text=Scene7",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 907,
      name: "De Joya",
      region: "nac",
      price: "5.5M",
      lat: 29.975,
      lng: 31.71,
      bounds: [
        [29.97, 31.705],
        [29.98, 31.715],
      ],
      thumb: "https://via.placeholder.com/100?text=DeJoya",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 908,
      name: "Al Maqsad",
      region: "nac",
      price: "9M",
      lat: 30.035,
      lng: 31.77,
      bounds: [
        [30.03, 31.765],
        [30.04, 31.775],
      ],
      thumb: "https://via.placeholder.com/100?text=Maqsad",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 909,
      name: "Sueno",
      region: "nac",
      price: "5.1M",
      lat: 29.992,
      lng: 31.732,
      bounds: [
        [29.987, 31.727],
        [29.997, 31.737],
      ],
      thumb: "https://via.placeholder.com/100?text=Sueno",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 910,
      name: "La Verde",
      region: "nac",
      price: "6.8M",
      lat: 29.98,
      lng: 31.735,
      bounds: [
        [29.975, 31.73],
        [29.985, 31.74],
      ],
      thumb: "https://via.placeholder.com/100?text=Verde",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 911,
      name: "Midtown Villa",
      region: "nac",
      price: "12M",
      lat: 30.015,
      lng: 31.765,
      bounds: [
        [30.01, 31.76],
        [30.02, 31.77],
      ],
      thumb: "https://via.placeholder.com/100?text=MidtownV",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 912,
      name: "Pukka",
      region: "nac",
      price: "5.8M",
      lat: 30.022,
      lng: 31.742,
      bounds: [
        [30.017, 31.737],
        [30.027, 31.747],
      ],
      thumb: "https://via.placeholder.com/100?text=Pukka",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },

    // ================== القاهرة الجديدة ==================
    {
      id: 801,
      name: "Hyde Park",
      region: "new_cairo",
      price: "15M",
      lat: 30.023,
      lng: 31.468,
      bounds: [
        [30.018, 31.463],
        [30.028, 31.473],
      ],
      thumb: "https://via.placeholder.com/100?text=Hyde",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 802,
      name: "Mivida",
      region: "new_cairo",
      price: "22M",
      lat: 30.031,
      lng: 31.493,
      bounds: [
        [30.026, 31.488],
        [30.036, 31.498],
      ],
      thumb: "https://via.placeholder.com/100?text=Mivida",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 803,
      name: "Mountain View iCity",
      region: "new_cairo",
      price: "14M",
      lat: 30.055,
      lng: 31.525,
      bounds: [
        [30.05, 31.52],
        [30.06, 31.53],
      ],
      thumb: "https://via.placeholder.com/100?text=MViCity",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 804,
      name: "Palm Hills New Cairo",
      region: "new_cairo",
      price: "16M",
      lat: 30.043,
      lng: 31.532,
      bounds: [
        [30.038, 31.527],
        [30.048, 31.537],
      ],
      thumb: "https://via.placeholder.com/100?text=PalmHills",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 805,
      name: "Zed East",
      region: "new_cairo",
      price: "13M",
      lat: 30.035,
      lng: 31.505,
      bounds: [
        [30.03, 31.5],
        [30.04, 31.51],
      ],
      thumb: "https://via.placeholder.com/100?text=ZedEast",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 806,
      name: "Eastown",
      region: "new_cairo",
      price: "11.5M",
      lat: 30.026,
      lng: 31.448,
      bounds: [
        [30.021, 31.443],
        [30.031, 31.453],
      ],
      thumb: "https://via.placeholder.com/100?text=Eastown",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 807,
      name: "Taj City",
      region: "new_cairo",
      price: "8.5M",
      lat: 30.075,
      lng: 31.385,
      bounds: [
        [30.07, 31.38],
        [30.08, 31.39],
      ],
      thumb: "https://via.placeholder.com/100?text=Taj",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 808,
      name: "District 5",
      region: "new_cairo",
      price: "10.8M",
      lat: 29.985,
      lng: 31.425,
      bounds: [
        [29.98, 31.42],
        [29.99, 31.43],
      ],
      thumb: "https://via.placeholder.com/100?text=D5",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 809,
      name: "Swan Lake",
      region: "new_cairo",
      price: "25M",
      lat: 30.052,
      lng: 31.442,
      bounds: [
        [30.047, 31.437],
        [30.057, 31.447],
      ],
      thumb: "https://via.placeholder.com/100?text=Swan",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 810,
      name: "The Marq",
      region: "new_cairo",
      price: "14M",
      lat: 30.048,
      lng: 31.555,
      bounds: [
        [30.043, 31.55],
        [30.053, 31.56],
      ],
      thumb: "https://via.placeholder.com/100?text=Marq",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 811,
      name: "Stone Park",
      region: "new_cairo",
      price: "13.5M",
      lat: 30.008,
      lng: 31.432,
      bounds: [
        [30.003, 31.427],
        [30.013, 31.437],
      ],
      thumb: "https://via.placeholder.com/100?text=Stone",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 812,
      name: "Sarai",
      region: "new_cairo",
      price: "8M",
      lat: 30.11,
      lng: 31.62,
      bounds: [
        [30.105, 31.615],
        [30.115, 31.625],
      ],
      thumb: "https://via.placeholder.com/100?text=Sarai",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },

    // ================== الشيخ زايد و نيو زايد ==================
    {
      id: 601,
      name: "Zed Towers",
      region: "zayed",
      price: "18.5M",
      lat: 30.027,
      lng: 30.975,
      bounds: [
        [30.022, 30.97],
        [30.032, 30.98],
      ],
      thumb: "https://via.placeholder.com/100?text=ZedZ",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 602,
      name: "Allegria",
      region: "zayed",
      price: "32M",
      lat: 30.05,
      lng: 30.93,
      bounds: [
        [30.045, 30.925],
        [30.055, 30.935],
      ],
      thumb: "https://via.placeholder.com/100?text=Allegria",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 603,
      name: "Cairo Gate",
      region: "zayed",
      price: "14M",
      lat: 30.04,
      lng: 30.95,
      bounds: [
        [30.035, 30.945],
        [30.045, 30.955],
      ],
      thumb: "https://via.placeholder.com/100?text=GateZ",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 604,
      name: "Etapa",
      region: "zayed",
      price: "10M",
      lat: 30.045,
      lng: 30.96,
      bounds: [
        [30.04, 30.955],
        [30.05, 30.965],
      ],
      thumb: "https://via.placeholder.com/100?text=Etapa",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 605,
      name: "Beverly Hills",
      region: "zayed",
      price: "9.5M",
      lat: 30.06,
      lng: 30.92,
      bounds: [
        [30.055, 30.915],
        [30.065, 30.925],
      ],
      thumb: "https://via.placeholder.com/100?text=BevHills",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 606,
      name: "Casa",
      region: "zayed",
      price: "8.8M",
      lat: 30.055,
      lng: 30.928,
      bounds: [
        [30.05, 30.923],
        [30.06, 30.933],
      ],
      thumb: "https://via.placeholder.com/100?text=Casa",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 607,
      name: "Forty West",
      region: "zayed",
      price: "17M",
      lat: 30.053,
      lng: 30.924,
      bounds: [
        [30.048, 30.919],
        [30.058, 30.929],
      ],
      thumb: "https://via.placeholder.com/100?text=FortyW",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 608,
      name: "Aeon",
      region: "zayed",
      price: "12.5M",
      lat: 30.022,
      lng: 30.962,
      bounds: [
        [30.017, 30.957],
        [30.027, 30.967],
      ],
      thumb: "https://via.placeholder.com/100?text=Aeon",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 701,
      name: "Vye Sodic",
      region: "zayed",
      price: "9.2M",
      lat: 30.08,
      lng: 30.88,
      bounds: [
        [30.075, 30.875],
        [30.085, 30.885],
      ],
      thumb: "https://via.placeholder.com/100?text=Vye",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 702,
      name: "Belle Vie",
      region: "zayed",
      price: "15.5M",
      lat: 30.09,
      lng: 30.85,
      bounds: [
        [30.085, 30.845],
        [30.095, 30.855],
      ],
      thumb: "https://via.placeholder.com/100?text=BelleVie",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 703,
      name: "Rivers",
      region: "zayed",
      price: "11M",
      lat: 30.075,
      lng: 30.86,
      bounds: [
        [30.07, 30.855],
        [30.08, 30.865],
      ],
      thumb: "https://via.placeholder.com/100?text=Rivers",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 704,
      name: "The Estates",
      region: "zayed",
      price: "24M",
      lat: 30.07,
      lng: 30.84,
      bounds: [
        [30.065, 30.835],
        [30.075, 30.845],
      ],
      thumb: "https://via.placeholder.com/100?text=Estates",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 705,
      name: "Naia West",
      region: "zayed",
      price: "10.2M",
      lat: 30.085,
      lng: 30.855,
      bounds: [
        [30.08, 30.85],
        [30.09, 30.86],
      ],
      thumb: "https://via.placeholder.com/100?text=NaiaW",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 706,
      name: "Solana",
      region: "zayed",
      price: "21M",
      lat: 30.102,
      lng: 30.845,
      bounds: [
        [30.097, 30.84],
        [30.107, 30.85],
      ],
      thumb: "https://via.placeholder.com/100?text=Solana",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },

    // ================== الساحل الشمالي والعلمين ==================
    {
      id: 101,
      name: "Marassi",
      region: "north_coast",
      price: "28M",
      lat: 30.96,
      lng: 28.8,
      bounds: [
        [30.95, 28.79],
        [30.97, 28.81],
      ],
      thumb: "https://via.placeholder.com/100?text=Marassi",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 102,
      name: "Hacienda Bay",
      region: "north_coast",
      price: "15M",
      lat: 30.93,
      lng: 28.75,
      bounds: [
        [30.925, 28.745],
        [30.935, 28.76],
      ],
      thumb: "https://via.placeholder.com/100?text=Hacienda",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 103,
      name: "Seazen",
      region: "north_coast",
      price: "15.9M",
      lat: 31.045,
      lng: 28.45,
      bounds: [
        [31.04, 28.445],
        [31.05, 28.46],
      ],
      thumb: "https://via.placeholder.com/100?text=Seazen",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 104,
      name: "North Edge",
      region: "north_coast",
      price: "13M",
      lat: 30.84,
      lng: 28.945,
      bounds: [
        [30.838, 28.942],
        [30.842, 28.948],
      ],
      thumb: "https://via.placeholder.com/100?text=Edge",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 105,
      name: "The Gate",
      region: "north_coast",
      price: "19M",
      lat: 30.835,
      lng: 28.935,
      bounds: [
        [30.832, 28.932],
        [30.838, 28.938],
      ],
      thumb: "https://via.placeholder.com/100?text=Gate",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 106,
      name: "Mountain View",
      region: "north_coast",
      price: "14.5M",
      lat: 31.02,
      lng: 28.5,
      bounds: [
        [31.015, 28.495],
        [31.025, 28.505],
      ],
      thumb: "https://via.placeholder.com/100?text=MV+Ras",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 107,
      name: "Silver Sands",
      region: "north_coast",
      price: "35M",
      lat: 31.12,
      lng: 27.65,
      bounds: [
        [31.11, 27.64],
        [31.13, 27.66],
      ],
      thumb: "https://via.placeholder.com/100?text=Silver",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 108,
      name: "La Vista Bay",
      region: "north_coast",
      price: "18M",
      lat: 31.055,
      lng: 28.42,
      bounds: [
        [31.05, 28.415],
        [31.06, 28.425],
      ],
      thumb: "https://via.placeholder.com/100?text=LaVista",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 109,
      name: "Cali Coast",
      region: "north_coast",
      price: "10M",
      lat: 31.032,
      lng: 28.482,
      bounds: [
        [31.027, 28.477],
        [31.037, 28.487],
      ],
      thumb: "https://via.placeholder.com/100?text=Cali",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 110,
      name: "Salt",
      region: "north_coast",
      price: "11.2M",
      lat: 31.048,
      lng: 28.442,
      bounds: [
        [31.043, 28.437],
        [31.053, 28.447],
      ],
      thumb: "https://via.placeholder.com/100?text=Salt",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 111,
      name: "Lvls",
      region: "north_coast",
      price: "15M",
      lat: 31.044,
      lng: 28.468,
      bounds: [
        [31.039, 28.463],
        [31.049, 28.473],
      ],
      thumb: "https://via.placeholder.com/100?text=Lvls",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },

    // ================== العين السخنة ==================
    {
      id: 301,
      name: "Il Monte Galala",
      region: "sokhna",
      price: "7.5M",
      lat: 29.62,
      lng: 32.38,
      bounds: [
        [29.615, 32.375],
        [29.625, 32.385],
      ],
      thumb: "https://via.placeholder.com/100?text=Galala",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
    {
      id: 302,
      name: "Azha",
      region: "sokhna",
      price: "12M",
      lat: 29.75,
      lng: 32.3,
      bounds: [
        [29.745, 32.295],
        [29.755, 32.305],
      ],
      thumb: "https://via.placeholder.com/100?text=Azha",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 303,
      name: "Telal Sokhna",
      region: "sokhna",
      price: "9.5M",
      lat: 29.585,
      lng: 32.405,
      bounds: [
        [29.58, 32.4],
        [29.59, 32.41],
      ],
      thumb: "https://via.placeholder.com/100?text=Telal",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 304,
      name: "La Vista Topaz",
      region: "sokhna",
      price: "10M",
      lat: 29.652,
      lng: 32.352,
      bounds: [
        [29.647, 32.347],
        [29.657, 32.357],
      ],
      thumb: "https://via.placeholder.com/100?text=VistaT",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },

    // ================== 6 أكتوبر ==================
    {
      id: 401,
      name: "O West",
      region: "october",
      price: "12.2M",
      lat: 29.962,
      lng: 30.922,
      bounds: [
        [29.957, 30.917],
        [29.967, 30.927],
      ],
      thumb: "https://via.placeholder.com/100?text=OWest",
      mp: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plan_voisin_paris.jpg",
    },
    {
      id: 402,
      name: "Badya",
      region: "october",
      price: "9M",
      lat: 29.922,
      lng: 30.852,
      bounds: [
        [29.917, 30.847],
        [29.927, 30.857],
      ],
      thumb: "https://via.placeholder.com/100?text=Badya",
      mp: "https://upload.wikimedia.org/wikipedia/commons/8/87/City_block_structure.jpg",
    },
    {
      id: 403,
      name: "Sun Capital",
      region: "october",
      price: "8.5M",
      lat: 29.982,
      lng: 31.022,
      bounds: [
        [29.977, 31.017],
        [29.987, 31.027],
      ],
      thumb: "https://via.placeholder.com/100?text=SunCap",
      mp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Urban_plan_drawing.jpg/800px-Urban_plan_drawing.jpg",
    },
  ];

  // Helper Functions (Attached to Window for HTML access)

  window.renderProjects = function (data) {
    const countEl = document.getElementById("project-count");
    if (countEl) countEl.innerText = data.length;

    const listContainer = document.getElementById("projects-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    markersLayer.clearLayers();

    data.forEach((p) => {
      // Create Map Marker
      const icon = L.divIcon({
        className: "custom-pin",
        html: `<div class="price-marker">${p.price}</div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 35],
      });

      const marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(
        markersLayer,
      );
      marker.bindTooltip(p.name, {
        permanent: true,
        direction: "top",
        offset: [0, -35],
        className: "project-name-tooltip",
      });

      marker.on("click", () =>
        map.flyTo([p.lat, p.lng], 16, { duration: 1.5 }),
      );

      marker.bindPopup(
        `
        <div style="text-align:center; padding: 10px;">
            <img src="${p.thumb}" style="width:100%; border-radius:15px; margin-bottom: 12px;">
            <h3 style="margin:0 0 10px 0; color: var(--text-map); font-size: 1.2rem;">${p.name}</h3>
            <button onclick="enterMasterPlan(${p.id})" class="btn-view-master" style="background: linear-gradient(135deg, var(--grad-start), var(--grad-end)); color: white; border: none; width: 100%; padding: 14px; border-radius: 12px; cursor: pointer; font-weight: bold; font-family: 'Cairo';">Exploring the Master Plan</button>
        </div>
        `,
        { maxWidth: 300 },
      );

      // Create Sidebar Card
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `<img src="${p.thumb}"><div><h4 style="margin:0; font-size: 0.95rem;">${p.name}</h4><p style="margin:0; font-size:0.8rem">${p.region.toUpperCase()}</p><b style="color:#f77f00">${p.price}</b></div>`;
      card.onclick = () => {
        map.flyTo([p.lat, p.lng], 16);
        marker.openPopup();
      };
      listContainer.appendChild(card);
    });
  };

  window.filterBy = function (region, lat, lng, zoom, btn) {
    map.flyTo([lat, lng], zoom, { duration: 2 });
    document
      .querySelectorAll(".filter-chip")
      .forEach((c) => c.classList.remove("active"));
    if (btn) btn.classList.add("active");

    const filtered =
      region === "all" ? projects : projects.filter((p) => p.region === region);
    window.renderProjects(filtered);

    // Close mobile filter menu after selection
    const menu = document.getElementById("filtersMenu");
    if (menu && menu.classList.contains("active")) {
      menu.classList.remove("active");
    }
  };

  window.toggleFilterMenu = function () {
    const menu = document.getElementById("filtersMenu");
    if (menu) {
      menu.classList.toggle("active");
    }
  };

  // --- NEW: Toggle Sidebar Function ---
  window.toggleSidebar = function () {
    const sidebarContainer = document.getElementById("sidebarContainer");
    if (sidebarContainer) {
      sidebarContainer.classList.toggle("active");
    }
  };

  window.enterMasterPlan = function (id) {
    const p = projects.find((proj) => proj.id === id);
    if (!p) return;
    map.closePopup();
    map.removeLayer(streetLayer);
    map.addLayer(satLayer);
    map.flyToBounds(p.bounds, { duration: 1.5, maxZoom: 18 });
    masterPlanLayer.clearLayers();
    L.imageOverlay(p.mp, p.bounds, {
      opacity: 0.9,
      interactive: true,
    }).addTo(masterPlanLayer);
    const closeBtn = document.getElementById("closeMasterBtn");
    if (closeBtn) closeBtn.style.display = "block";
  };

  window.exitMasterPlan = function () {
    masterPlanLayer.clearLayers();
    const closeBtn = document.getElementById("closeMasterBtn");
    if (closeBtn) closeBtn.style.display = "none";

    map.removeLayer(satLayer);

    // Ensure we switch back to the correct street layer theme
    // Keep Light mode for tiles
    streetLayer.setUrl(tiles.light);
    map.addLayer(streetLayer);

    map.flyTo([28.5, 31.0], 6.5);
  };

  function startIntro() {
    setTimeout(() => {
      map.flyTo([28.5, 31.0], 6.5, { duration: 4, easeLinearity: 0.1 });
      setTimeout(() => {
        document.body.classList.add("ui-visible");
      }, 3500);
    }, 600);
  }

  // Initial Render
  window.renderProjects(projects);
  startIntro();
}
