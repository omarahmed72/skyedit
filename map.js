/* =========================================
   1. GLOBAL THEME LOGIC & INITIALIZATION
   ========================================= */
const themeIcon = document.getElementById("theme-icon");
const navLogo = document.getElementById("nav-logo");

let savedTheme = localStorage.getItem("theme");
let isDarkMode = savedTheme === "dark";

let updateMapThemeFn = null;

function applyTheme() {
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
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  applyTheme();

  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    if (!v.paused) return;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {});
    }
  });
}

applyTheme();

/* =========================================
   2. GENERAL UI LOGIC (Navbar, Mobile Menu)
   ========================================= */

window.toggleMobileMenu = function () {
  const menu = document.getElementById("mobile-menu");

  // Close other menus if open
  const sidebar = document.getElementById("sidebarContainer");
  const filterMenu = document.getElementById("filtersMenu");
  if (sidebar) sidebar.classList.remove("active");
  if (filterMenu) {
    filterMenu.classList.remove("active");
    document.body.style.overflow = ""; // Unlock scroll if filter closes
  }

  if (menu) {
    menu.classList.toggle("active");
    const sublinks = document.querySelectorAll(".mobile-nav-sublink");
    sublinks.forEach((link) => {
      link.style.display = menu.classList.contains("active") ? "block" : "none";
    });
  }
};

// Optimized Scroll Listener using requestAnimationFrame
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

// --- Click outside to close all menus ---
document.addEventListener("click", function (event) {
  const filterMenu = document.getElementById("filtersMenu");
  const filterBtn = document.querySelector(".filter-toggle-btn");
  const sidebar = document.getElementById("sidebarContainer");
  const listBtn = document.querySelector(".list-toggle-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");

  // Handle Filter Menu click outside
  if (filterMenu && filterMenu.classList.contains("active")) {
    const clickedInsideFilter = filterMenu.contains(event.target);
    const clickedFilterBtn = filterBtn && filterBtn.contains(event.target);

    if (!clickedInsideFilter && !clickedFilterBtn) {
      filterMenu.classList.remove("active");
      document.body.style.overflow = ""; // Unlock body scroll
    }
  }

  // Handle Sidebar click outside
  if (sidebar && sidebar.classList.contains("active")) {
    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedSidebarBtn = listBtn && listBtn.contains(event.target);

    if (!clickedInsideSidebar && !clickedSidebarBtn) {
      sidebar.classList.remove("active");
    }
  }

  // Handle Mobile Menu click outside
  if (mobileMenu && mobileMenu.classList.contains("active")) {
    const clickedInsideMobileMenu = mobileMenu.contains(event.target);
    const clickedMobileBtn =
      mobileMenuBtn && mobileMenuBtn.contains(event.target);

    if (!clickedInsideMobileMenu && !clickedMobileBtn) {
      mobileMenu.classList.remove("active");
      const sublinks = document.querySelectorAll(".mobile-nav-sublink");
      sublinks.forEach((link) => (link.style.display = "none"));
    }
  }
});

/* =========================================
   3. MAP PAGE LOGIC
   ========================================= */

window.addEventListener("load", () => {
  const mapElement = document.getElementById("map");

  if (mapElement && typeof L !== "undefined") {
    const tiles = {
      light:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      satellite: "http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    };

    var streetLayer = L.tileLayer(tiles.light, { maxZoom: 19 });
    var satLayer = L.tileLayer(tiles.satellite, {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    });

    var map = L.map("map", {
      zoomControl: false,
      layers: [streetLayer],
      center: [15, 10],
      zoom: 2.5,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomleft" }).addTo(map);
    var markersLayer = L.layerGroup().addTo(map);
    var masterPlanLayer = L.layerGroup().addTo(map);

    const projects = [
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

    // Performance FIX: Using DocumentFragment to prevent DOM thrashing
    window.renderProjects = function (data) {
      const countEl = document.getElementById("project-count");
      if (countEl) countEl.innerText = data.length;

      const listContainer = document.getElementById("projects-list");
      if (!listContainer) return;

      listContainer.innerHTML = "";
      markersLayer.clearLayers();

      const fragment = document.createDocumentFragment();

      data.forEach((p) => {
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

        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `<img src="${p.thumb}" loading="lazy" decoding="async"><div><h4 style="margin:0; font-size: 0.95rem;">${p.name}</h4><p style="margin:0; font-size:0.8rem">${p.region.toUpperCase()}</p><b style="color:#f77f00">${p.price}</b></div>`;
        card.onclick = () => {
          map.flyTo([p.lat, p.lng], 16);
          marker.openPopup();
        };
        fragment.appendChild(card);
      });
      listContainer.appendChild(fragment);
    };

    window.filterBy = function (region, lat, lng, zoom, btn) {
      map.flyTo([lat, lng], zoom, { duration: 2 });
      document
        .querySelectorAll(".filter-chip")
        .forEach((c) => c.classList.remove("active"));
      if (btn) btn.classList.add("active");

      const filtered =
        region === "all"
          ? projects
          : projects.filter((p) => p.region === region);
      window.renderProjects(filtered);

      const menu = document.getElementById("filtersMenu");
      if (menu && menu.classList.contains("active")) {
        menu.classList.remove("active");
        document.body.style.overflow = ""; // Unlock scroll when closing
      }
    };

    window.toggleFilterMenu = function () {
      const menu = document.getElementById("filtersMenu");
      const sidebar = document.getElementById("sidebarContainer");
      const mobileMenu = document.getElementById("mobile-menu");

      if (sidebar) sidebar.classList.remove("active");
      if (mobileMenu) {
        mobileMenu.classList.remove("active");
        document
          .querySelectorAll(".mobile-nav-sublink")
          .forEach((l) => (l.style.display = "none"));
      }

      if (menu) {
        menu.classList.toggle("active");
        // Add scroll lock identical to the explore page filter sidebar
        if (menu.classList.contains("active")) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    };

    window.toggleSidebar = function () {
      const sidebarContainer = document.getElementById("sidebarContainer");
      const menu = document.getElementById("filtersMenu");
      const mobileMenu = document.getElementById("mobile-menu");

      if (menu) {
        menu.classList.remove("active");
        document.body.style.overflow = ""; // Unlock scroll if filter closes
      }
      if (mobileMenu) {
        mobileMenu.classList.remove("active");
        document
          .querySelectorAll(".mobile-nav-sublink")
          .forEach((l) => (l.style.display = "none"));
      }

      if (sidebarContainer) sidebarContainer.classList.toggle("active");
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

    window.renderProjects(projects);
    startIntro();
  }
});