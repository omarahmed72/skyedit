const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "unit-details.html");
let content = fs.readFileSync(filePath, "utf8");

// Replace the content wrapper with a dynamic div
const contentPattern =
  /<div class="content-wrapper">[\s\S]*?(?=<\/div>\s*<\/div>\s*<!-- Footer -->)/;
content = content.replace(
  contentPattern,
  '<div class="content-wrapper" id="dynamic-unit-wrapper">\n        <!-- Dynamic Content Injected Here -->\n      ',
);

// Replace the DOMContentLoaded script
const scriptPattern =
  /\/\/ --- Carousel Slider Logic ---.*?(?=<\/script>\s*<\/body>)/s;
const newScript = `// --- Dynamic Unit Logic ---
      document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const unitId = parseInt(urlParams.get("id"));
        
        // Default mock unit info
        let defaultUnit = {
          id: 1,
          type: "Townhouse",
          project: "Jirian - Nations Of Sky",
          title: "Townhouse Middle for sale in Jirian - Nations Of Sky with 3 bedrooms in New Zayed by Nations Of Sky",
          location: "Jirian - Nations Of Sky, New Zayed, Egypt",
          badge: "Property",
          price: 22000000,
          area: "185",
          ref: "108611",
          bedrooms: 3,
          bathrooms: 4,
          delivery: "2030",
          saleType: "Developer Sale",
          finishing: "Finished",
          amenities: "Commercial Strip",
          planYears: 8,
          planQuarterly: "618,750 EGP",
          planDown: "1,100,000 EGP (1/2)",
          about: "A 3 bedroom Townhouse in Jirian - Nations of Sky by Nations Of Sky. The Townhouse size is 185 m² with 4 bathrooms. This property will be ready for delivery finished by 2030-02-28.",
          images: [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1996&auto=format&fit=crop"
          ],
          devLogo: "https://cbe-realestate-egypt.fsn1.your-objectstorage.com/centro/logo/cropped-circle-image-copy.webp"
        };

        let unit = defaultUnit;
        if(unitId) {
          let units = JSON.parse(localStorage.getItem("sky_units")) || [];
          let found = units.find(u => u.id === unitId);
          if(found) unit = found;
        }

        // Render content
        const wrapper = document.getElementById("dynamic-unit-wrapper");
        
        let sliderImages = (unit.images && unit.images.length > 0) ? unit.images : defaultUnit.images;
        let sliderHTML = sliderImages.map(img => \`<div class="item" style="background-image: url('\${img}');"></div>\`).join("");
        
        let amenitiesHTML = "";
        if(unit.amenities) {
           amenitiesHTML = unit.amenities.split(',').map(a => \`
              <div class="amenity-item">
                <i class="fa-solid fa-check" style="font-size: 18px; color: var(--accent-gold)"></i>
                <span>\${a.trim()}</span>
              </div>
           \`).join("");
        }

        wrapper.innerHTML = \`
        <!-- Breadcrumbs -->
        <div class="breadcrumbs">
          <i class="fa-solid fa-house"></i>
          <a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right"></i>
          <a href="projects.html">\${unit.project || "Project"}</a>
          <i class="fa-solid fa-chevron-right"></i>
          <span>\${unit.title || unit.type || "Unit Details"}</span>
        </div>

        <!-- Project Hero Carousel -->
        <section class="project-hero">
          <div class="carousel">
            <div class="list" id="project-hero-list">
              \${sliderHTML}
            </div>
            <div class="arrows">
              <button class="prev"><i class="fa-solid fa-angle-left"></i></button>
              <button class="next"><i class="fa-solid fa-angle-right"></i></button>
            </div>
            <div class="project-logo-overlay">
              <img id="project-hero-logo" src="\${unit.devLogo || defaultUnit.devLogo}" alt="Logo" onerror="this.style.display='none'"/>
            </div>
          </div>
        </section>

        <!-- Header Info Card -->
        <div class="unit-header-card">
          <div class="unit-header-info">
            <img src="\${unit.devLogo || defaultUnit.devLogo}" alt="Developer Logo" class="dev-logo" onerror="this.src='imgs/cropped-circle-image-2-copy.webp'" />
            <div class="unit-title-group">
              <h1 class="unit-title">\${unit.title || unit.type || "N/A"}</h1>
              <div class="unit-location">\${unit.location || "N/A"}</div>
              <div class="property-badge">\${unit.badge || "Property"}</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 5px;">Price</div>
              <div class="unit-price">\${Number(unit.price).toLocaleString()} EGP</div>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-call"><i class="fa-solid fa-phone"></i> Call Us</button>
            <button class="btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Whatsapp</button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="unit-content-layout">
          <!-- Details List Table -->
          <div class="details-section">
            <div class="detail-row" style="border-bottom: 2px solid var(--text-color); padding-bottom: 15px; margin-bottom: 5px;">
              <span class="detail-label" style="font-size: 18px">\${unit.type || "Unit"}</span>
              <span class="detail-value" style="font-size: 18px; color: var(--accent-gold)">\${unit.area || "N/A"}</span>
            </div>
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-label">Reference No.</span><span class="detail-value">\${unit.ref || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bedrooms</span><span class="detail-value">\${unit.bedrooms || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bathrooms</span><span class="detail-value">\${unit.bathrooms || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Delivery In</span><span class="detail-value">\${unit.delivery || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Compound</span><span class="detail-value" style="color: var(--accent-gold); cursor: pointer; text-decoration: underline;">\${unit.project || "N/A"}<i class="fa-solid fa-arrow-right ml-1" style="font-size: 10px"></i></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Sale Type</span><span class="detail-value">\${unit.saleType || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Finishing</span><span class="detail-value">\${unit.finishing || "N/A"}</span>
              </div>
            </div>
          </div>

          <!-- Actions Grid -->
          <div class="actions-section">
            <h2 class="section-title">Details</h2>
            <div class="action-cards-grid">
              <div class="action-card"><i class="fa-solid fa-map-location-dot"></i><span>View on Map</span></div>
              <div class="action-card"><i class="fa-solid fa-layer-group"></i><span>Floor Plan</span></div>
              <div class="action-card"><i class="fa-solid fa-cubes"></i><span>Master Plan</span></div>
            </div>
          </div>

          <!-- Amenities -->
          <div class="amenities-section">
            <h2 class="section-title">Amenities</h2>
            <div class="amenities-list">\${amenitiesHTML}</div>
          </div>

          <!-- Payment Plans -->
          <div class="payment-section">
            <h2 class="section-title">Payment Plans</h2>
            <div class="payment-plan-card">
              <div class="plan-info">
                <div class="plan-tag"><i class="fa-solid fa-bookmark"></i> Original Plan</div>
                <div class="plan-details">
                  <h4>\${unit.planQuarterly || "N/A"} <span style="font-size: 14px; font-weight: 500">Quarterly</span></h4>
                  <p>\${unit.planDown || "N/A"} Down Payment</p>
                </div>
              </div>
              <div class="plan-years">\${unit.planYears || "N/A"} Years <i class="fa-solid fa-chevron-right"></i></div>
            </div>
          </div>

          <!-- About Unit -->
          <div class="about-section">
            <h2 class="section-title">About Property</h2>
            <p class="about-text">\${unit.about || "N/A"}</p>
          </div>
        </div>
        \`;
        
        // Re-initialize Slider
        const nextBtn = document.querySelector(".project-hero .next");
        const prevBtn = document.querySelector(".project-hero .prev");
        const carousel = document.querySelector(".project-hero .carousel");
        let list = document.querySelector(".project-hero .carousel .list");

        let timeRunning = 2000;
        let timeAutoNext = 4000;
        let runTimeOut;
        let runNextAuto;

        const showSlider = (type) => {
          const items = document.querySelectorAll(".project-hero .carousel .list .item");
          if (items.length === 0) return;

          if (type === "next") {
            list.appendChild(items[0]);
            carousel.classList.add("next");
          } else {
            list.prepend(items[items.length - 1]);
            carousel.classList.add("prev");
          }

          clearTimeout(runTimeOut);
          runTimeOut = setTimeout(() => {
            if (carousel) carousel.classList.remove("next");
            if (carousel) carousel.classList.remove("prev");
          }, timeRunning);

          clearTimeout(runNextAuto);
          runNextAuto = setTimeout(() => {
            if (nextBtn) nextBtn.click();
          }, timeAutoNext);
        };

        if (nextBtn) nextBtn.onclick = () => showSlider("next");
        if (prevBtn) prevBtn.onclick = () => showSlider("prev");

        if (nextBtn) {
          runNextAuto = setTimeout(() => {
            nextBtn.click();
          }, timeAutoNext);
        }
      `;

content = content.replace(scriptPattern, newScript);

fs.writeFileSync(filePath, content, "utf8");
console.log("Update complete");
