const DEFAULT_QR =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <rect width="320" height="320" rx="28" fill="#ffffff"/>
      <rect x="26" y="26" width="268" height="268" rx="18" fill="#faf5f3" stroke="#8c1125" stroke-width="10"/>
      <text x="160" y="160" font-family="Arial" font-size="22" text-anchor="middle" fill="#8c1125">QR Demo</text>
    </svg>
  `);

const STORAGE_KEY = "wedding-red-modern-v6";

const DEFAULT_CONFIG = {
  groomName: "Đức Anh",
  brideName: "Thanh Mai",
  initials: "Đ&T",
  quoteTop: "all your",
  quoteMain: "LOVE",
  quoteBottom: "need is",
  closingText: "Thank You",
  weddingDateText: "10 Tháng 5, 2026",
  weddingTimeText: "18:00",
  countdownTarget: "2026-05-10T18:00",
  introTitle: "Trân trọng kính mời",
  introText:
    "Đến dự buổi tiệc chung vui cùng gia đình chúng tôi. Sự hiện diện của bạn là món quà quý giá nhất.",
  venueName: "Queen Bee Luxury",
  venueAddress: "29 Láng Hạ, Phường Láng Hạ, Hà Nội",
  mapLink: "https://maps.google.com/?q=Queen+Bee+Luxury+Lang+Ha+Ha+Noi",
  familyLeftLine1: "Vũ Văn Hiệp",
  familyLeftLine2: "Nguyễn Thị Ánh",
  familyLeftAddress: "Hà Nội",
  familyRightLine1: "Đỗ Văn Tuyên",
  familyRightLine2: "Lê Thị Vân",
  familyRightAddress: "Hà Nội",
  lunarDate: "(Nhằm ngày 24/03 năm Bính Ngọ)",
  bankName: "Vietcombank",
  bankOwner: "VU DUC ANH",
  bankNumber: "1234567890",
  bankNameBride: "VietinBank",
  bankOwnerBride: "DO THI THANH MAI",
  bankNumberBride: "0987654321",
  bankNote: "Quét mã QR hoặc chuyển khoản trực tiếp.",
  musicLink:
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3", // Demo nhạc nhẹ
  coverImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  galleryImages: [],
  qrImage: DEFAULT_QR,
  qrImageBride: DEFAULT_QR,
  toggles: {
    intro: true,
    details: true,
    countdown: true,
    gallery: true,
    bank: true,
  },
};

const galleryIds = [
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
  "gallery-6",
  "gallery-7",
  "gallery-8",
  "gallery-9",
  "gallery-10",
];

const els = {
  editorShell: document.getElementById("editor-shell"),
  openingStage: document.getElementById("opening-stage"),
  siteRoot: document.getElementById("site-root"),
  petalsLayer: document.getElementById("petals-layer"),
  toast: document.getElementById("toast"),
  lightbox: document.getElementById("lightbox"),
  lightboxImage: document.getElementById("lightbox-image"),
  lightboxThumbs: document.getElementById("lightbox-thumbs"),
  qrModal: document.getElementById("qr-modal"),
  shareStatus: document.getElementById("shareStatus"),
  heartFireworksContainer: document.getElementById("heart-fireworks-container"),
  bgMusic: document.getElementById("bg-music"),
  musicToggle: document.getElementById("music-toggle"),
};

let config = loadConfig();
let countdownTimer = null;
let petalTimer = null;
let currentLightboxIndex = 0;

/* =========================
   HELPERS & LOCAL STORAGE
========================= */
function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}
function deepMerge(base, extra) {
  const output = cloneDeep(base);
  if (!extra || typeof extra !== "object") return output;
  Object.keys(extra).forEach((key) => {
    if (
      output[key] &&
      typeof output[key] === "object" &&
      !Array.isArray(output[key]) &&
      extra[key] &&
      typeof extra[key] === "object" &&
      !Array.isArray(extra[key])
    ) {
      output[key] = deepMerge(output[key], extra[key]);
    } else {
      output[key] = extra[key];
    }
  });
  return output;
}
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? deepMerge(DEFAULT_CONFIG, JSON.parse(raw))
      : cloneDeep(DEFAULT_CONFIG);
  } catch {
    return cloneDeep(DEFAULT_CONFIG);
  }
}
function saveConfig() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {}
}
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}
window.downloadQR = function (imageId, filename) {
  const img = document.getElementById(imageId);
  if (!img || !img.src) return;
  const link = document.createElement("a");
  link.href = img.src;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}
function setImage(id, src) {
  const el = document.getElementById(id);
  if (el && src) el.src = src;
}

/* =========================
   MUSIC LOGIC
========================= */
function setupMusic() {
  if (els.bgMusic) {
    els.bgMusic.src = config.musicLink || "";
    els.bgMusic.load();
  }
}

function toggleMusic() {
  if (!els.bgMusic || !els.bgMusic.src) return;
  if (els.bgMusic.paused) {
    els.bgMusic.play();
    els.musicToggle.classList.add("playing");
  } else {
    els.bgMusic.pause();
    els.musicToggle.classList.remove("playing");
  }
}

els.musicToggle?.addEventListener("click", toggleMusic);

/* =========================
   CONFIG BINDING
========================= */
function applyConfig() {
  setText("opening-initials", config.initials);
  setText("gift-initials", config.initials);
  setText("opening-groom", config.groomName);
  setText("opening-bride", config.brideName);
  setText("hero-groom", config.groomName);
  setText("hero-bride", config.brideName);
  setText("detail-groom-name", config.groomName);
  setText("detail-bride-name", config.brideName);
  setText("opening-date", config.weddingDateText);
  setText("hero-date", config.weddingDateText);
  setText("hero-time", config.weddingTimeText);
  setText("event-time", config.weddingTimeText);

  setText("bank-groom-name", config.groomName);
  setText("bank-bride-name", config.brideName);
  setText("bank-name", config.bankName);
  setText("bank-owner", config.bankOwner);
  setText("bank-number", config.bankNumber);
  setText("bank-name-bride", config.bankNameBride);
  setText("bank-owner-bride", config.bankOwnerBride);
  setText("bank-number-bride", config.bankNumberBride);

  setImage("hero-image", config.coverImage);
  setImage("qr-image", config.qrImage || DEFAULT_QR);
  setImage("qr-image-bride", config.qrImageBride || DEFAULT_QR);

  setupMusic();
}

function populateInputs() {
  const inputs = [
    "groomNameInput",
    "brideNameInput",
    "initialsInput",
    "closingTextInput",
    "quoteTopInput",
    "quoteMainInput",
    "quoteBottomInput",
    "dateTextInput",
    "timeTextInput",
    "countdownInput",
    "introTitleInput",
    "introTextInput",
    "venueNameInput",
    "venueAddressInput",
    "mapLinkInput",
    "familyLeftLine1Input",
    "familyLeftLine2Input",
    "familyLeftAddressInput",
    "familyRightLine1Input",
    "familyRightLine2Input",
    "familyRightAddressInput",
    "lunarDateInput",
    "bankNameInput",
    "bankOwnerInput",
    "bankNumberInput",
    "bankNameBrideInput",
    "bankOwnerBrideInput",
    "bankNumberBrideInput",
    "bankNoteInput",
    "musicLinkInput",
  ];
  inputs.forEach((id) => {
    const el = document.getElementById(id);
    const key = id.replace("Input", "");
    if (el) el.value = config[key] ?? "";
  });
}

function bindTextInput(id, key) {
  const input = document.getElementById(id);
  if (input)
    input.addEventListener("input", () => {
      config[key] = input.value;
      applyConfig();
      saveConfig();
    });
}

function bindEditor() {
  [
    "groomName",
    "brideName",
    "initials",
    "closingText",
    "quoteTop",
    "quoteMain",
    "quoteBottom",
    "weddingDateText",
    "weddingTimeText",
    "countdownTarget",
    "introTitle",
    "introText",
    "venueName",
    "venueAddress",
    "mapLink",
    "familyLeftLine1",
    "familyLeftLine2",
    "familyLeftAddress",
    "familyRightLine1",
    "familyRightLine2",
    "familyRightAddress",
    "lunarDate",
    "bankName",
    "bankOwner",
    "bankNumber",
    "bankNameBride",
    "bankOwnerBride",
    "bankNumberBride",
    "bankNote",
    "musicLink",
  ].forEach((key) => bindTextInput(`${key}Input`, key));

  document.getElementById("replayBtn")?.addEventListener("click", () => {
    replayInvitation();
  });
}

/* =========================
   HEART RAIN ANIMATION (2 GIÂY TRONG SUỐT)
========================= */
function triggerHeartBurst() {
  if (!els.heartFireworksContainer) return;

  // 1. Phủ màn trắng
  els.heartFireworksContainer.classList.add("flash-white");

  // 2. Trái tim khổng lồ nhịp đập
  const giantHeart = document.createElement("div");
  giantHeart.className = "fw-heart animate";
  els.heartFireworksContainer.appendChild(giantHeart);

  // 3. Đúng 700ms trái tim nổ tung thành mưa tim nhỏ
  setTimeout(() => {
    const particleCount = 140; // 140 trái tim nhỏ
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div");
      p.className = "fw-small-heart";

      // Phân bổ bắn đều ra 360 độ
      const angle = Math.random() * Math.PI * 2;
      // Vận tốc bung ra
      const velocity = 80 + Math.random() * 250;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      // Random độ trong suốt và kích thước
      p.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2); // Trong suốt từ 0.4 đến 0.9
      const size = Math.random() * 14 + 10; // Kích thước từ 10px đến 24px
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      els.heartFireworksContainer.appendChild(p);

      // Cho rớt xuống sâu (ty + 600px) và xoay lộn xộn trong không trung
      p.animate(
        [
          { transform: `translate(0, 0) scale(1) rotate(0deg)` },
          {
            transform: `translate(${tx}px, ${ty + 600}px) scale(0.6) rotate(${Math.random() * 200 - 100}deg)`,
          },
        ],
        {
          duration: 1800 + Math.random() * 600, // Tim rơi lác đác trong khoảng 1.8s - 2.4s
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        },
      );

      // Rơi xong thì dọn dẹp
      setTimeout(() => p.remove(), 2600);
    }
  }, 700);

  // Dọn tim to
  setTimeout(() => giantHeart.remove(), 1200);

  // Gỡ màn trắng từ từ
  setTimeout(() => {
    els.heartFireworksContainer.classList.remove("flash-white");
  }, 2500);
}

function revealSequential() {
  document.querySelectorAll("[data-reveal]").forEach((el, index) => {
    setTimeout(() => el.classList.add("is-inview"), index * 65);
  });
}

function openInvitation() {
  els.openingStage?.classList.add("is-opening");

  // Kích hoạt mưa tim
  triggerHeartBurst();

  // BẬT NHẠC
  if (
    els.bgMusic &&
    els.bgMusic.src &&
    els.bgMusic.src !== window.location.href
  ) {
    els.bgMusic
      .play()
      .then(() => {
        els.musicToggle.classList.add("playing");
        els.musicToggle.style.display = "flex"; // Hiện nút tắt bật
      })
      .catch((e) => console.log("Trình duyệt chặn autoplay âm thanh."));
  }

  // Đợi mưa tim rơi gần xong (khoảng 2.6 giây) thì mới từ từ hiện thiệp lên
  setTimeout(() => {
    els.siteRoot?.classList.add("is-visible");
    revealSequential();
  }, 2600);

  // Clean hoàn toàn vỏ thiệp
  setTimeout(() => {
    els.openingStage?.classList.add("is-opened");
  }, 3400);
}

function replayInvitation() {
  els.openingStage?.classList.remove("is-opened", "is-opening");
  els.openingStage?.removeAttribute("hidden");
  els.siteRoot?.classList.remove("is-visible");
  els.heartFireworksContainer?.classList.remove("flash-white");

  if (els.bgMusic) {
    els.bgMusic.pause();
    els.bgMusic.currentTime = 0;
  }
  if (els.musicToggle) {
    els.musicToggle.style.display = "none";
    els.musicToggle.classList.remove("playing");
  }

  if (els.siteRoot) els.siteRoot.scrollTop = 0;
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.remove("is-inview");
  });
}

/* =========================
   EVENTS & INIT
========================= */
document
  .querySelectorAll("[data-open-invitation]")
  .forEach((btn) => btn.addEventListener("click", openInvitation));

document
  .querySelectorAll("[data-open-qr]")
  .forEach((btn) =>
    btn.addEventListener("click", () => els.qrModal?.classList.add("show")),
  );
document
  .querySelector("[data-close-qr]")
  ?.addEventListener("click", () => els.qrModal?.classList.remove("show"));
els.qrModal?.addEventListener("click", (e) => {
  if (e.target === els.qrModal) els.qrModal.classList.remove("show");
});

populateInputs();
applyConfig();

const params = new URLSearchParams(window.location.search);
if (
  params.get("edit") !== "1" &&
  window.location.protocol !== "file:" &&
  params.has("card")
) {
  document.body.classList.add("guest-view");
  els.editorShell?.setAttribute("hidden", "hidden");
} else {
  replayInvitation();
}
bindEditor();
