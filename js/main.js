// ============================
// DATOS DE GALERÍA
// ============================
const galleryData = [
  { img: "img/cerone/cerone1.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone2.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone3.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone4.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone5.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone6.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone7.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone8.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone9.jpg",  artist: "cerone" },
  { img: "img/cerone/cerone10.jpg", artist: "cerone" },
  { img: "img/cerone/cerone11.jpg", artist: "cerone" },
  { img: "img/cerone/cerone12.jpg", artist: "cerone" },
  { img: "img/cerone/cerone13.jpg", artist: "cerone" },
  { img: "img/cerone/cerone14.jpg", artist: "cerone" },
  { img: "img/yanez/1000133691.jpg", artist: "yanez" },
  { img: "img/yanez/1000133695.jpg", artist: "yanez" },
  { img: "img/yanez/1000133699.jpg", artist: "yanez" },
  { img: "img/yanez/1000133703.jpg", artist: "yanez" },
  { img: "img/yanez/1000133707.jpg", artist: "yanez" },
  { img: "img/yanez/1000133711.jpg", artist: "yanez" },
  { img: "img/yanez/1000133715.jpg", artist: "yanez" },
  { img: "img/yanez/1000133719.jpg", artist: "yanez" },
  { img: "img/yanez/1000133723.jpg", artist: "yanez" },
  { img: "img/yanez/1000133727.jpg", artist: "yanez" },
  { img: "img/yanez/1000133731.jpg", artist: "yanez" },
  { img: "img/yanez/1000133735.jpg", artist: "yanez" },
  { img: "img/yanez/1000133739.jpg", artist: "yanez" },
  { img: "img/yanez/1000133743.jpg", artist: "yanez" },
  { img: "img/yanez/1000133750.jpg", artist: "yanez" },
  { img: "img/yanez/1000133754.jpg", artist: "yanez" },
  { img: "img/yanez/1000133758.jpg", artist: "yanez" },
  { img: "img/yanez/1000133762.jpg", artist: "yanez" },
  { img: "img/yanez/tatuaje1.jpg", artist: "yanez" },
  { img: "img/yanez/tatuaje2.jpg", artist: "yanez" }
];

function artistLabel(artist) {
  return artist === "cerone" ? "Cerone" : "Yanez";
}

// ============================
// SCROLL PROGRESS BAR
// ============================
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const scrolled   = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + "%";
}, { passive: true });

// ============================
// LIGHTBOX
// ============================
let lightboxIndex = 0;
let currentFiltered = [...galleryData];
let lightboxOpen = false;

function openLightbox(idx) {
  lightboxIndex = idx;
  lightboxOpen = true;
  updateLightboxContent();
  const lb = document.getElementById("lightbox");
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightboxOpen = false;
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

function lightboxPrev() {
  lightboxIndex = (lightboxIndex - 1 + currentFiltered.length) % currentFiltered.length;
  updateLightboxContent();
}

function lightboxNext() {
  lightboxIndex = (lightboxIndex + 1) % currentFiltered.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const item   = currentFiltered[lightboxIndex];
  const imgEl  = document.getElementById("lightboxImg");
  imgEl.style.animation = "none";
  imgEl.offsetHeight;
  imgEl.style.animation = "";
  imgEl.src = item.img;
  document.getElementById("lightboxInfo").textContent =
    `${artistLabel(item.artist)}  ·  ${lightboxIndex + 1} / ${currentFiltered.length}`;
}

document.getElementById("lightbox").addEventListener("click", function (e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightboxOpen) return;
  if (e.key === "Escape")     closeLightbox();
  if (e.key === "ArrowLeft")  lightboxPrev();
  if (e.key === "ArrowRight") lightboxNext();
});

// ============================
// GALERÍA PRINCIPAL — con animación en filtros
// ============================
let filterLock = false;

function staggerItems(items) {
  items.forEach((item, i) => {
    item.style.opacity    = "0";
    item.style.transform  = "scale(0.9) translateY(18px)";
    item.style.transition = "none";
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach((item, i) => {
        const delay = i * 38;
        item.style.transition = `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
        item.style.opacity   = "1";
        item.style.transform = "";
      });
      setTimeout(() => { filterLock = false; }, items.length * 38 + 520);
    });
  });
}

function renderGallery(filter, isInit = false) {
  if (filterLock && !isInit) return;

  const grid    = document.getElementById("galleryGrid");
  const countEl = document.getElementById("galleryCount");

  const nextFiltered = filter === "all"
    ? galleryData
    : galleryData.filter((i) => i.artist === filter);

  document.querySelectorAll(".btn-gallery").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  const existing = [...grid.querySelectorAll(".gallery-item")];

  const doRender = () => {
    currentFiltered = nextFiltered;

    if (currentFiltered.length === 0) {
      grid.innerHTML = `<div style="color:var(--text-muted);padding:2rem;grid-column:1/-1;">Sin trabajos en esta categoría.</div>`;
      countEl.textContent = "";
      filterLock = false;
      return;
    }

    countEl.textContent = `${currentFiltered.length} trabajos`;

    grid.innerHTML = currentFiltered.map((item, idx) => `
      <div class="gallery-item" onclick="openLightbox(${idx})">
        <img src="${item.img}" alt="Tatuaje de ${artistLabel(item.artist)} en Santiago" loading="lazy">
        <div class="gallery-item-overlay">
          <span class="gallery-item-artist">${artistLabel(item.artist)}</span>
          <span class="gallery-item-view"><i class="ph ph-magnifying-glass-plus"></i> Ver</span>
        </div>
      </div>`).join("");

    staggerItems([...grid.querySelectorAll(".gallery-item")]);
  };

  if (existing.length > 0 && !isInit) {
    filterLock = true;
    existing.forEach((el, i) => {
      el.style.transition = `opacity 0.15s ease ${i * 12}ms, transform 0.15s ease ${i * 12}ms`;
      el.style.opacity    = "0";
      el.style.transform  = "scale(0.95) translateY(-8px)";
    });
    setTimeout(doRender, existing.length * 12 + 180);
  } else {
    doRender();
  }
}

document.querySelectorAll(".btn-gallery").forEach((btn) =>
  btn.addEventListener("click", () => renderGallery(btn.dataset.filter))
);
renderGallery("all", true);

// ============================
// MINI GALERÍAS (BOOKING)
// ============================
function generateMiniGallery(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items.map((item) => `
    <div class="gallery-mini-item">
      <img src="${item.img}" alt="Tatuaje de ${artistLabel(item.artist)} en Eurocentro Santiago" loading="lazy">
    </div>`).join("");
}

generateMiniGallery("galleryCerone", galleryData.filter((i) => i.artist === "cerone"));
generateMiniGallery("galleryYanez",  galleryData.filter((i) => i.artist === "yanez"));

// ============================
// COUNTER ANIMATION (badge +8 años)
// ============================
function animateCounter(el, target, duration = 1400) {
  const start = performance.now();
  const step  = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = "+" + Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const badgeNumEl = document.querySelector(".about-badge-num");
if (badgeNumEl) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(badgeNumEl, 8);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(badgeNumEl);
  badgeNumEl.textContent = "+0";
}

// ============================
// MOBILE NAV
// ============================
const navToggle = document.getElementById("navToggle");
const navList   = document.getElementById("navList");

navToggle.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.querySelector("i").className = isOpen ? "ph ph-x" : "ph ph-list";
});
navList.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navList.classList.remove("open");
    navToggle.querySelector("i").className = "ph ph-list";
  })
);

// ============================
// SCROLL REVEAL (multi-type)
// ============================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el) =>
  revealObserver.observe(el)
);

// Divider line animation (separate observer for drawLine)
const dividerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        dividerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".about-divider").forEach((el) =>
  dividerObserver.observe(el)
);
