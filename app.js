const DEFAULT_QR =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <rect width="320" height="320" rx="28" fill="#ffffff"/>
      <rect x="26" y="26" width="268" height="268" rx="18" fill="#faf5f3" stroke="#8c1125" stroke-width="10"/>
      <rect x="52" y="52" width="70" height="70" rx="10" fill="#111"/>
      <rect x="70" y="70" width="34" height="34" rx="6" fill="#fff"/>
      <rect x="198" y="52" width="70" height="70" rx="10" fill="#111"/>
      <rect x="216" y="70" width="34" height="34" rx="6" fill="#fff"/>
      <rect x="52" y="198" width="70" height="70" rx="10" fill="#111"/>
      <rect x="70" y="216" width="34" height="34" rx="6" fill="#fff"/>
      <rect x="162" y="164" width="18" height="18" rx="4" fill="#111"/>
      <rect x="190" y="164" width="18" height="18" rx="4" fill="#111"/>
      <rect x="218" y="164" width="18" height="18" rx="4" fill="#111"/>
      <rect x="162" y="192" width="18" height="18" rx="4" fill="#111"/>
      <rect x="218" y="192" width="18" height="18" rx="4" fill="#111"/>
      <rect x="162" y="220" width="18" height="18" rx="4" fill="#111"/>
      <rect x="190" y="220" width="46" height="18" rx="4" fill="#111"/>
      <text x="160" y="292" font-family="Arial" font-size="22" text-anchor="middle" fill="#8c1125">QR chuyển khoản</text>
    </svg>
  `);

const STORAGE_KEY = "wedding-red-modern-v5";

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
    "Đến dự buổi tiệc chung vui cùng gia đình chúng tôi. Sự hiện diện của bạn là món quà quý giá nhất cho hành trình yêu thương này.",
  venueName: "Queen Bee Luxury",
  venueAddress: "29 Láng Hạ, Phường Láng Hạ, Hà Nội",
  mapLink: "https://maps.google.com/?q=Queen+Bee+Luxury+Lang+Ha+Ha+Noi",
  familyLeftLine1: "Vũ Văn Hiệp",
  familyLeftLine2: "Nguyễn Thị Ánh",
  familyLeftAddress: "Số 9, Ngõ 102 Trường Chinh, Đống Đa, Hà Nội",
  familyRightLine1: "Đỗ Văn Tuyên",
  familyRightLine2: "Lê Thị Vân",
  familyRightAddress: "Số 32, Phố Đội Cấn, Ba Đình, Hà Nội",
  lunarDate: "(Nhằm ngày 24/03 năm Bính Ngọ)",
  bankName: "Vietcombank",
  bankOwner: "VU DUC ANH",
  bankNumber: "1234567890",
  bankNote:
    "Quét mã QR hoặc chuyển khoản trực tiếp để gửi lời chúc đến tụi mình.",
  coverImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  ],
  qrImage: DEFAULT_QR,
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
  lightboxCounter: document.getElementById("lightbox-counter"),
  qrModal: document.getElementById("qr-modal"),
  shareStatus: document.getElementById("shareStatus"),
};

let config = loadConfig();
let countdownTimer = null;
let petalTimer = null;
let currentLightboxIndex = 0;

/* =========================
   HELPERS
========================= */
function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(base, extra) {
  const output = cloneDeep(base);
  if (!extra || typeof extra !== "object") return output;

  Object.keys(extra).forEach((key) => {
    const baseValue = output[key];
    const extraValue = extra[key];

    if (
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      extraValue &&
      typeof extraValue === "object" &&
      !Array.isArray(extraValue)
    ) {
      output[key] = deepMerge(baseValue, extraValue);
    } else {
      output[key] = extraValue;
    }
  });

  return output;
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDeep(DEFAULT_CONFIG);
    return deepMerge(DEFAULT_CONFIG, JSON.parse(raw));
  } catch {
    return cloneDeep(DEFAULT_CONFIG);
  }
}

function saveConfig(show = false) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    if (show) showToast("Đã lưu cấu hình vào trình duyệt của bạn.");
  } catch {
    showToast("Không lưu được localStorage.");
  }
}

function showToast(message) {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2400);
}

function setShareStatus(message, ready = false) {
  if (!els.shareStatus) return;
  els.shareStatus.innerHTML = message;
  els.shareStatus.style.color = ready ? "var(--wine)" : "var(--muted)";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function setImage(id, src) {
  const el = document.getElementById(id);
  if (el && src) el.src = src;
}

function setLink(id, href, hiddenWhenEmpty = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const valid = typeof href === "string" && href.trim();
  el.href = valid ? href : "#";
  if (hiddenWhenEmpty) {
    el.classList.toggle("is-hidden", !valid);
  }
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function setMobilePreviewMode(enabled) {
  document.body.classList.toggle("mobile-preview-mode", Boolean(enabled));
}

function createSlug(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function createEditKey(length = 18) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.remove();
}

/* =========================
   REMOTE SHARE / SUPABASE
========================= */
function getRemoteConfig() {
  const remote = window.WEDDING_REMOTE || {};
  return {
    supabaseUrl: String(remote.supabaseUrl || "")
      .trim()
      .replace(/\/$/, ""),
    supabasePublishableKey: String(remote.supabasePublishableKey || "").trim(),
    tableName: String(remote.tableName || "wedding_cards").trim(),
  };
}

function canUseRemoteShare() {
  const remote = getRemoteConfig();
  return Boolean(
    remote.supabaseUrl && remote.supabasePublishableKey && remote.tableName,
  );
}

async function fetchRemoteCardBySlug(slug) {
  const remote = getRemoteConfig();
  const url = `${remote.supabaseUrl}/rest/v1/${remote.tableName}?slug=eq.${encodeURIComponent(slug)}&select=*`;

  const response = await fetch(url, {
    headers: {
      apikey: remote.supabasePublishableKey,
      Authorization: `Bearer ${remote.supabasePublishableKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Không đọc được dữ liệu thiệp online.");
  }

  const rows = await response.json();
  return rows?.[0] || null;
}

// Mỗi lần xuất luôn tạo 1 thiệp mới
async function saveRemoteCard() {
  if (!canUseRemoteShare()) {
    throw new Error("Bạn chưa cấu hình Supabase trong window.WEDDING_REMOTE.");
  }

  const remote = getRemoteConfig();
  const newSlug = createSlug();
  const newEditKey = createEditKey();

  const payload = {
    slug: newSlug,
    edit_key: newEditKey,
    title: `${config.groomName} & ${config.brideName}`,
    config: config,
    updated_at: new Date().toISOString(),
  };

  const url = `${remote.supabaseUrl}/rest/v1/${remote.tableName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: remote.supabasePublishableKey,
      Authorization: `Bearer ${remote.supabasePublishableKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Không xuất được thiệp online.");
  }

  const rows = await response.json();
  const row = rows?.[0] || payload;

  const viewUrl = `${window.location.origin}${window.location.pathname}?card=${encodeURIComponent(row.slug)}`;
  const editUrl = `${window.location.origin}${window.location.pathname}?edit=1&card=${encodeURIComponent(row.slug)}&editKey=${encodeURIComponent(row.edit_key || newEditKey)}`;

  return {
    slug: row.slug,
    editKey: row.edit_key || newEditKey,
    viewUrl,
    editUrl,
  };
}

async function handleCopyShareLink() {
  try {
    if (!canUseRemoteShare()) {
      showToast("Chưa cấu hình Supabase nên chưa xuất thiệp online được.");
      return;
    }

    setShareStatus("Đang xuất thiệp online...");
    const result = await saveRemoteCard();
    await copyText(result.viewUrl);

    setShareStatus(
      "Đã xuất xong: <strong>link xem thiệp mới</strong> đã được sao chép.",
      true,
    );
    showToast("Đã xuất thiệp online và sao chép link xem.");

    // Chuyển editor sang bản edit của thiệp mới vừa tạo
    history.replaceState({}, "", result.editUrl);
  } catch (error) {
    setShareStatus("Xuất thiệp thất bại. Kiểm tra lại cấu hình Supabase.");
    showToast(error.message || "Không thể xuất thiệp.");
  }
}

/* =========================
   CONFIG -> DOM
========================= */
function getCompactGalleryImages() {
  return (config.galleryImages || []).filter(
    (src) => typeof src === "string" && src.trim(),
  );
}

function syncGalleryDomImages() {
  const compact = getCompactGalleryImages();

  galleryIds.forEach((id, index) => {
    const el = document.getElementById(id);
    if (!el) return;

    const src = compact[index] || "";
    if (src) {
      el.src = src;
      el.hidden = false;
    } else {
      el.removeAttribute("src");
      el.hidden = true;
    }
  });

  document
    .querySelectorAll("#section-gallery .gallery-item")
    .forEach((item, index) => {
      item.hidden = !compact[index];
      item.dataset.galleryIndex = String(index);
      item.classList.toggle("more", index === 3 && compact.length > 4);
    });
}

function updateGalleryMoreLabel() {
  const more = document.querySelector(".gallery-item.more .gallery-more-count");
  const moreItem = document.querySelector(".gallery-item.more");
  if (!more || !moreItem) return;

  const total = getCompactGalleryImages().length;
  const extra = Math.max(0, total - 4);
  more.textContent = extra > 0 ? "Xem thêm" : "";
  more.hidden = extra <= 0;
  moreItem.hidden = total < 4;
}

function updateSectionVisibility() {
  const map = {
    intro: "section-intro",
    details: "section-details",
    countdown: "section-countdown",
    gallery: "section-gallery",
    bank: "section-bank",
  };

  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.hidden = !config.toggles[key];
  });
}

function updateDetailedDate() {
  const raw = config.countdownTarget || "";
  const date = raw ? new Date(raw) : null;

  if (date && Number.isFinite(date.getTime())) {
    const weekdays = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];

    setText("detail-weekday", weekdays[date.getDay()] || "");
    setText("detail-day", String(date.getDate()).padStart(2, "0"));
    setText("detail-month", String(date.getMonth() + 1).padStart(2, "0"));
    setText("detail-year", String(date.getFullYear()));
  }
}

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
  setText("quote-top", config.quoteTop);
  setText("quote-main", config.quoteMain);
  setText("quote-bottom", config.quoteBottom);
  setText("intro-title", config.introTitle);
  setText("intro-text", config.introText);
  setText("venue-name", config.venueName);
  setText("venue-address", config.venueAddress);
  setText("family-left-line1", config.familyLeftLine1);
  setText("family-left-line2", config.familyLeftLine2);
  setText("family-left-address", config.familyLeftAddress);
  setText("family-right-line1", config.familyRightLine1);
  setText("family-right-line2", config.familyRightLine2);
  setText("family-right-address", config.familyRightAddress);
  setText("detail-lunar", config.lunarDate);
  setText("bank-name", config.bankName);
  setText("bank-owner", config.bankOwner);
  setText("bank-number", config.bankNumber);
  setText("bank-note-modal", config.bankNote);
  setText("bank-note-preview", config.bankNote);
  setText("closing-text", config.closingText);

  setImage("hero-image", config.coverImage);
  setImage("qr-image", config.qrImage || DEFAULT_QR);

  syncGalleryDomImages();
  updateGalleryMoreLabel();
  setLink("map-button", config.mapLink, true);

  if (els.siteRoot) {
    els.siteRoot.dataset.countdownTarget = config.countdownTarget || "";
  }

  updateCountdown();
  updateDetailedDate();
  updateSectionVisibility();
  renderLightboxThumbs();
}

/* =========================
   INPUTS / EDITOR
========================= */
function populateInputs() {
  const values = {
    groomNameInput: config.groomName,
    brideNameInput: config.brideName,
    initialsInput: config.initials,
    closingTextInput: config.closingText,
    quoteTopInput: config.quoteTop,
    quoteMainInput: config.quoteMain,
    quoteBottomInput: config.quoteBottom,
    dateTextInput: config.weddingDateText,
    timeTextInput: config.weddingTimeText,
    countdownInput: config.countdownTarget,
    introTitleInput: config.introTitle,
    introTextInput: config.introText,
    venueNameInput: config.venueName,
    venueAddressInput: config.venueAddress,
    mapLinkInput: config.mapLink,
    familyLeftLine1Input: config.familyLeftLine1,
    familyLeftLine2Input: config.familyLeftLine2,
    familyLeftAddressInput: config.familyLeftAddress,
    familyRightLine1Input: config.familyRightLine1,
    familyRightLine2Input: config.familyRightLine2,
    familyRightAddressInput: config.familyRightAddress,
    lunarDateInput: config.lunarDate,
    bankNameInput: config.bankName,
    bankOwnerInput: config.bankOwner,
    bankNumberInput: config.bankNumber,
    bankNoteInput: config.bankNote,
  };

  Object.entries(values).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input) input.value = value ?? "";
  });

  const toggles = {
    toggleIntro: config.toggles.intro,
    toggleDetails: config.toggles.details,
    toggleCountdown: config.toggles.countdown,
    toggleGallery: config.toggles.gallery,
    toggleBank: config.toggles.bank,
  };

  Object.entries(toggles).forEach(([id, checked]) => {
    const input = document.getElementById(id);
    if (input) input.checked = Boolean(checked);
  });
}

function bindTextInput(id, key, nested) {
  const input = document.getElementById(id);
  if (!input) return;

  input.addEventListener("input", () => {
    if (nested) {
      config[nested][key] = input.value;
    } else {
      config[key] = input.value;
    }
    applyConfig();
    saveConfig();
  });
}

function bindToggle(id, key) {
  const input = document.getElementById(id);
  if (!input) return;

  input.addEventListener("change", () => {
    config.toggles[key] = input.checked;
    applyConfig();
    saveConfig();
  });
}

async function fileToDataUrl(file, options = {}) {
  const type =
    options.type || (file.type === "image/png" ? "image/png" : "image/jpeg");
  const quality = options.quality ?? 0.86;
  const maxSize = options.maxSize ?? 1600;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(type, quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function bindImageUpload(inputId, updater, options = {}) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file, options);
      updater(dataUrl);
      applyConfig();
      saveConfig();
      showToast("Ảnh đã được cập nhật.");
    } catch {
      showToast("Đọc ảnh thất bại. Bạn thử lại giúp mình nhé.");
    } finally {
      input.value = "";
    }
  });
}

function bindEditor() {
  bindTextInput("groomNameInput", "groomName");
  bindTextInput("brideNameInput", "brideName");
  bindTextInput("initialsInput", "initials");
  bindTextInput("closingTextInput", "closingText");
  bindTextInput("quoteTopInput", "quoteTop");
  bindTextInput("quoteMainInput", "quoteMain");
  bindTextInput("quoteBottomInput", "quoteBottom");
  bindTextInput("dateTextInput", "weddingDateText");
  bindTextInput("timeTextInput", "weddingTimeText");
  bindTextInput("countdownInput", "countdownTarget");
  bindTextInput("introTitleInput", "introTitle");
  bindTextInput("introTextInput", "introText");
  bindTextInput("venueNameInput", "venueName");
  bindTextInput("venueAddressInput", "venueAddress");
  bindTextInput("mapLinkInput", "mapLink");
  bindTextInput("familyLeftLine1Input", "familyLeftLine1");
  bindTextInput("familyLeftLine2Input", "familyLeftLine2");
  bindTextInput("familyLeftAddressInput", "familyLeftAddress");
  bindTextInput("familyRightLine1Input", "familyRightLine1");
  bindTextInput("familyRightLine2Input", "familyRightLine2");
  bindTextInput("familyRightAddressInput", "familyRightAddress");
  bindTextInput("lunarDateInput", "lunarDate");
  bindTextInput("bankNameInput", "bankName");
  bindTextInput("bankOwnerInput", "bankOwner");
  bindTextInput("bankNumberInput", "bankNumber");
  bindTextInput("bankNoteInput", "bankNote");

  bindToggle("toggleIntro", "intro");
  bindToggle("toggleDetails", "details");
  bindToggle("toggleCountdown", "countdown");
  bindToggle("toggleGallery", "gallery");
  bindToggle("toggleBank", "bank");

  bindImageUpload("coverUpload", (src) => {
    config.coverImage = src;
  });

  bindImageUpload("galleryUpload1", (src) => {
    config.galleryImages[0] = src;
  });
  bindImageUpload("galleryUpload2", (src) => {
    config.galleryImages[1] = src;
  });
  bindImageUpload("galleryUpload3", (src) => {
    config.galleryImages[2] = src;
  });
  bindImageUpload("galleryUpload4", (src) => {
    config.galleryImages[3] = src;
  });
  bindImageUpload("galleryUpload5", (src) => {
    config.galleryImages[4] = src;
  });
  bindImageUpload("galleryUpload6", (src) => {
    config.galleryImages[5] = src;
  });
  bindImageUpload("galleryUpload7", (src) => {
    config.galleryImages[6] = src;
  });
  bindImageUpload("galleryUpload8", (src) => {
    config.galleryImages[7] = src;
  });
  bindImageUpload("galleryUpload9", (src) => {
    config.galleryImages[8] = src;
  });
  bindImageUpload("galleryUpload10", (src) => {
    config.galleryImages[9] = src;
  });

  document.querySelectorAll("[data-clear-image]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.clearImage);
      if (!Number.isFinite(index)) return;
      config.galleryImages[index] = "";
      applyConfig();
      saveConfig();
      showToast("Đã xóa ảnh khỏi album.");
    });
  });

  bindImageUpload(
    "qrUpload",
    (src) => {
      config.qrImage = src;
    },
    { type: "image/png", quality: 0.92, maxSize: 1000 },
  );

  document.getElementById("replayBtn")?.addEventListener("click", () => {
    replayInvitation();
    showToast("Đã đưa thiệp về trạng thái chờ mở.");
  });

  document
    .getElementById("resetBtn")
    ?.addEventListener("click", resetToDefault);
}

/* =========================
   COUNTDOWN
========================= */
function updateCountdown() {
  clearInterval(countdownTimer);

  const target = new Date(
    els.siteRoot?.dataset.countdownTarget || "",
  ).getTime();

  if (!Number.isFinite(target)) return;

  const tick = () => {
    const diff = target - Date.now();
    const values =
      diff > 0
        ? {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            mins: Math.floor((diff / (1000 * 60)) % 60),
            secs: Math.floor((diff / 1000) % 60),
          }
        : { days: 0, hours: 0, mins: 0, secs: 0 };

    const pairs = {
      "count-days": values.days,
      "count-hours": values.hours,
      "count-mins": values.mins,
      "count-secs": values.secs,
    };

    Object.entries(pairs).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, "0");
    });
  };

  tick();
  countdownTimer = setInterval(tick, 1000);
}

/* =========================
   PETALS
========================= */
function startPetals() {
  clearInterval(petalTimer);
  if (!els.petalsLayer) return;

  petalTimer = setInterval(() => {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.setProperty("--drift-x", `${Math.random() * 120 - 60}px`);
    petal.style.animationDuration = `${4.8 + Math.random() * 3.6}s`;
    petal.style.width = `${10 + Math.random() * 10}px`;
    petal.style.height = `${10 + Math.random() * 10}px`;
    els.petalsLayer.appendChild(petal);

    setTimeout(() => petal.remove(), 9000);
  }, 340);
}

/* =========================
   OPENING / REVEAL
========================= */
function revealSequential() {
  document.querySelectorAll("[data-reveal]").forEach((el, index) => {
    setTimeout(() => el.classList.add("is-inview"), index * 65);
  });
}

function openInvitation() {
  els.openingStage?.classList.add("is-opening");

  setTimeout(() => {
    els.siteRoot?.classList.add("is-visible");
    revealSequential();
  }, 520);

  setTimeout(() => {
    els.openingStage?.classList.add("is-opened");
  }, 980);
}

function replayInvitation() {
  els.openingStage?.classList.remove("is-opened", "is-opening");
  els.openingStage?.removeAttribute("hidden");
  els.siteRoot?.classList.remove("is-visible");
  if (els.siteRoot) els.siteRoot.scrollTop = 0;

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.remove("is-inview");
  });
}

/* =========================
   LIGHTBOX / QR
========================= */
function getGallerySources() {
  return galleryIds
    .map((id) => document.getElementById(id)?.src)
    .filter(Boolean);
}

function renderLightboxThumbs() {
  if (!els.lightboxThumbs) return;

  const sources = getGallerySources();
  els.lightboxThumbs.innerHTML = "";

  sources.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.alt = "Ảnh thu nhỏ " + (index + 1);

    if (index === currentLightboxIndex) {
      thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
      currentLightboxIndex = index;
      updateLightbox();
    });

    els.lightboxThumbs.appendChild(thumb);
  });
}

function updateLightbox() {
  const sources = getGallerySources();
  if (!sources.length) return;

  currentLightboxIndex =
    (currentLightboxIndex + sources.length) % sources.length;

  if (els.lightboxImage) {
    els.lightboxImage.src = sources[currentLightboxIndex];
  }

  if (els.lightboxCounter) {
    els.lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${sources.length}`;
  }

  renderLightboxThumbs();
}

function openLightbox(index) {
  currentLightboxIndex = index;
  els.lightbox?.classList.add("show");
  updateLightbox();
}

function closeLightbox() {
  els.lightbox?.classList.remove("show");
}

function bindPreviewActions() {
  document.querySelectorAll("[data-open-invitation]").forEach((btn) => {
    btn.addEventListener("click", openInvitation);
  });

  document.querySelectorAll("[data-gallery-index]").forEach((item) => {
    item.addEventListener("click", () => {
      openLightbox(Number(item.dataset.galleryIndex || 0));
    });
  });

  document
    .querySelector("[data-close-lightbox]")
    ?.addEventListener("click", closeLightbox);

  document
    .querySelector("[data-lightbox-prev]")
    ?.addEventListener("click", () => {
      currentLightboxIndex -= 1;
      updateLightbox();
    });

  document
    .querySelector("[data-lightbox-next]")
    ?.addEventListener("click", () => {
      currentLightboxIndex += 1;
      updateLightbox();
    });

  els.lightbox?.addEventListener("click", (event) => {
    if (event.target === els.lightbox) closeLightbox();
  });

  document.querySelectorAll("[data-open-qr]").forEach((btn) => {
    btn.addEventListener("click", () => els.qrModal?.classList.add("show"));
  });

  document.querySelector("[data-close-qr]")?.addEventListener("click", () => {
    els.qrModal?.classList.remove("show");
  });

  els.qrModal?.addEventListener("click", (event) => {
    if (event.target === els.qrModal) {
      els.qrModal.classList.remove("show");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
      els.qrModal?.classList.remove("show");
    }

    if (
      event.key === "ArrowRight" &&
      els.lightbox?.classList.contains("show")
    ) {
      currentLightboxIndex += 1;
      updateLightbox();
    }

    if (event.key === "ArrowLeft" && els.lightbox?.classList.contains("show")) {
      currentLightboxIndex -= 1;
      updateLightbox();
    }
  });
}

/* =========================
   VIEW MODE
========================= */
async function initViewMode() {
  const params = new URLSearchParams(window.location.search);
  const hasCard = params.has("card");
  const editMode =
    params.get("edit") === "1" ||
    window.location.protocol === "file:" ||
    !hasCard;

  if (!editMode) {
    document.body.classList.add("guest-view");
    els.editorShell?.setAttribute("hidden", "hidden");
  } else {
    els.editorShell?.removeAttribute("hidden");
    document.body.classList.remove("guest-view");
  }

  if (hasCard && canUseRemoteShare()) {
    try {
      const row = await fetchRemoteCardBySlug(params.get("card"));
      if (row?.config) {
        config = deepMerge(DEFAULT_CONFIG, row.config);
        populateInputs();
        applyConfig();
      }
    } catch {
      showToast("Không tải được dữ liệu thiệp từ link.");
    }
  }

  setShareStatus(
    canUseRemoteShare()
      ? "Mỗi lần bấm <strong>Xuất thiệp online</strong> sẽ tạo ra một thiệp mới và một link mới."
      : "Chưa cấu hình chia sẻ online. Điền <strong>supabaseUrl</strong> và <strong>supabasePublishableKey</strong> trong file để dùng nút xuất thiệp.",
    canUseRemoteShare(),
  );

  if (editMode) {
    replayInvitation();
  } else {
    els.openingStage?.classList.remove("is-opened", "is-opening");
    els.openingStage?.removeAttribute("hidden");
    els.siteRoot?.classList.remove("is-visible");
    if (els.siteRoot) els.siteRoot.scrollTop = 0;

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.remove("is-inview");
    });
  }
}

/* =========================
   MOBILE / SHARE ACTIONS
========================= */
function bindMobileAndShareActions() {
  document.getElementById("previewModeBtn")?.addEventListener("click", () => {
    if (isMobileLayout()) {
      setMobilePreviewMode(true);
      replayInvitation();
    } else {
      showToast("Ở máy tính bạn xem preview ngay bên phải.");
    }
  });

  document.getElementById("mobilePreviewBtn")?.addEventListener("click", () => {
    setMobilePreviewMode(true);
    replayInvitation();
  });

  const backToEdit = () => setMobilePreviewMode(false);

  document
    .getElementById("mobileEditBtn")
    ?.addEventListener("click", backToEdit);
  document
    .getElementById("mobileBackToEditBtn")
    ?.addEventListener("click", backToEdit);

  document
    .getElementById("shareLinkBtn")
    ?.addEventListener("click", handleCopyShareLink);

  document
    .getElementById("mobileCopyLinkBtn")
    ?.addEventListener("click", handleCopyShareLink);

  document
    .getElementById("mobileCopyLinkBtnTop")
    ?.addEventListener("click", handleCopyShareLink);

  document.querySelectorAll(".panel-card").forEach((card, index) => {
    if (index < 6) {
      card.classList.add("is-collapsible");
      const heading = card.querySelector("h2");

      heading?.addEventListener("click", () => {
        if (!isMobileLayout()) return;
        card.classList.toggle("is-collapsed");
      });

      if (isMobileLayout() && index > 0) {
        card.classList.add("is-collapsed");
      }
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileLayout()) {
      setMobilePreviewMode(false);
      document
        .querySelectorAll(".panel-card.is-collapsible")
        .forEach((card) => card.classList.remove("is-collapsed"));
    }
  });
}

/* =========================
   PAGE SHOW FIX
========================= */
window.addEventListener("pageshow", () => {
  const params = new URLSearchParams(window.location.search);
  const isGuestView = params.has("card") && params.get("edit") !== "1";

  if (isGuestView) {
    els.openingStage?.classList.remove("is-opened", "is-opening");
    els.openingStage?.removeAttribute("hidden");
    els.siteRoot?.classList.remove("is-visible");
    if (els.siteRoot) els.siteRoot.scrollTop = 0;

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.remove("is-inview");
    });
  }
});

/* =========================
   RESET
========================= */
function resetToDefault() {
  config = cloneDeep(DEFAULT_CONFIG);
  populateInputs();
  applyConfig();
  saveConfig();
  replayInvitation();
  showToast("Đã đưa thiệp về bản mặc định.");
}

/* =========================
   START
========================= */
bindPreviewActions();
bindEditor();
bindMobileAndShareActions();
populateInputs();
applyConfig();
startPetals();
initViewMode();
saveConfig();
