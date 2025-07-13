const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const menuLinks = document.querySelectorAll(".menu-link");

// Updates the theme icon based on current theme and sidebar state
const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon.textContent = sidebar.classList.contains("collapsed")
    ? isDark
      ? "light_mode"
      : "dark_mode"
    : "dark_mode";
};

// Apply dark theme if saved or system prefers, then update icon
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const shouldUseDarkTheme =
  savedTheme === "dark" || (!savedTheme && systemPrefersDark);

document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();

// Toggle between themes on theme button click
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});

// Toggle sidebar collapsed state on buttons click
sidebarToggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    updateThemeIcon();
  });
});

// Expand the sidebar when the search form is clicked
searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    searchForm.querySelector("input").focus();
  }
});

// Expand sidebar by default on large screens
if (window.innerWidth > 768) sidebar.classList.remove("collapsed");

// Handle content switching when clicking on menu items
const contentSections = document.querySelectorAll(".main-content");

// Mini game state variables (đặt ngoài hàm để giữ trạng thái đúng)
let miniGameMatched = 0;
let miniGameCardOne = null,
  miniGameCardTwo = null;
let miniGameDisableDeck = false;

function flipCard({ target: clickedCard }) {
  if (miniGameCardOne !== clickedCard && !miniGameDisableDeck) {
    clickedCard.classList.add("flip");
    if (!miniGameCardOne) {
      miniGameCardOne = clickedCard;
      return;
    }
    miniGameCardTwo = clickedCard;
    miniGameDisableDeck = true;
    let cardOneImg = miniGameCardOne.querySelector(".back-view img").src,
      cardTwoImg = miniGameCardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    miniGameMatched++;
    if (miniGameMatched == 8) {
      setTimeout(() => {
        shuffleCard();
      }, 1000);
    }
    miniGameCardOne.removeEventListener("click", flipCard);
    miniGameCardTwo.removeEventListener("click", flipCard);
    miniGameCardOne = miniGameCardTwo = null;
    miniGameDisableDeck = false;
    return;
  }
  setTimeout(() => {
    miniGameCardOne.classList.add("shake");
    miniGameCardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    miniGameCardOne.classList.remove("shake", "flip");
    miniGameCardTwo.classList.remove("shake", "flip");
    miniGameCardOne = miniGameCardTwo = null;
    miniGameDisableDeck = false;
  }, 1200);
}

function shuffleCard() {
  miniGameMatched = 0;
  miniGameDisableDeck = false;
  miniGameCardOne = miniGameCardTwo = null;
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
  // Chỉ lấy card trong minigame-section .cards
  const cards = document.querySelectorAll("#minigame-section .cards > .card");
  cards.forEach((card, i) => {
    card.classList.remove("flip", "shake");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `img/img-${arr[i]}.png`;
    card.removeEventListener("click", flipCard);
    card.addEventListener("click", flipCard);
  });
}

function initMiniGame() {
  shuffleCard();
}

menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Remove active class from all menu links
    menuLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // Get target ID from data-target attribute
    const targetId = link.getAttribute("data-target");
    if (!targetId) return;

    // Hide all content sections
    contentSections.forEach((section) => section.classList.add("hidden"));

    // Show the selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.remove("hidden");

    // Nếu là tab minigame thì khởi tạo lại minigame
    if (targetId === "minigame-section") {
      setTimeout(initMiniGame, 0);
    }
    if (targetId === "notifications-section") {
      setTimeout(setupDrawingApp, 0);
    }
  });
});

// Auto show first section on page load
document.addEventListener("DOMContentLoaded", () => {
  // Always show the section corresponding to the active menu-link
  const activeLink = document.querySelector(".menu-link.active[data-target]");
  if (activeLink) {
    const targetId = activeLink.getAttribute("data-target");
    contentSections.forEach((section) => section.classList.add("hidden"));
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.remove("hidden");
    if (targetId === "minigame-section") {
      setTimeout(initMiniGame, 0);
    }
    if (targetId === "notifications-section") {
      setTimeout(setupDrawingApp, 0);
    }
  }
});

new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,

  // Pagination bullets
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// drawing app
function setupDrawingApp() {
  const canvas = document.querySelector("#notifications-section canvas"),
    toolBtns = document.querySelectorAll("#notifications-section .tool"),
    fillColor = document.querySelector("#notifications-section #fill-color"),
    sizeSlider = document.querySelector("#notifications-section #size-slider"),
    colorBtns = document.querySelectorAll(
      "#notifications-section .colors .option"
    ),
    colorPicker = document.querySelector(
      "#notifications-section #color-picker"
    ),
    clearCanvas = document.querySelector(
      "#notifications-section .clear-canvas"
    ),
    saveImg = document.querySelector("#notifications-section .save-img");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let prevMouseX,
    prevMouseY,
    snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

  const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
  };

  function resizeCanvas() {
    // Lưu lại hình cũ khi resize
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
    ctx.putImageData(image, 0, 0);
  }

  window.addEventListener("resize", resizeCanvas);

  // Đảm bảo canvas đúng kích thước khi tab được mở
  setTimeout(() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
  }, 10);

  const drawRect = (e) => {
    if (!fillColor.checked) {
      return ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
    }
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  };

  const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(
      Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
    );
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
  };

  const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
  };

  const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
      ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    } else if (selectedTool === "rectangle") {
      drawRect(e);
    } else if (selectedTool === "circle") {
      drawCircle(e);
    } else {
      drawTriangle(e);
    }
  };

  toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector("#notifications-section .options .active")
        .classList.remove("active");
      btn.classList.add("active");
      selectedTool = btn.id;
    });
  });

  sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector("#notifications-section .options .selected")
        .classList.remove("selected");
      btn.classList.add("selected");
      selectedColor = window
        .getComputedStyle(btn)
        .getPropertyValue("background-color");
    });
  });

  colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
  });

  saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  });

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", drawing);
  canvas.addEventListener("mouseup", () => (isDrawing = false));
}

// Khi chuyển sang tab Drawing App thì setup lại canvas
menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Remove active class from all menu links
    menuLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // Get target ID from data-target attribute
    const targetId = link.getAttribute("data-target");
    if (!targetId) return;

    // Hide all content sections
    contentSections.forEach((section) => section.classList.add("hidden"));

    // Show the selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.remove("hidden");

    // Nếu là tab minigame thì khởi tạo lại minigame
    if (targetId === "minigame-section") {
      setTimeout(initMiniGame, 0);
    }
    if (targetId === "notifications-section") {
      setTimeout(setupDrawingApp, 0);
    }
  });
});

// Auto show first section on page load
document.addEventListener("DOMContentLoaded", () => {
  // Always show the section corresponding to the active menu-link
  const activeLink = document.querySelector(".menu-link.active[data-target]");
  if (activeLink) {
    const targetId = activeLink.getAttribute("data-target");
    contentSections.forEach((section) => section.classList.add("hidden"));
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.remove("hidden");
    if (targetId === "minigame-section") {
      setTimeout(initMiniGame, 0);
    }
    if (targetId === "notifications-section") {
      setTimeout(setupDrawingApp, 0);
    }
  }
});

// piano app
const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");

let allKeys = [],
  audio = new Audio();

const playTune = (key) => {
  // Đảm bảo file tồn tại trong thư mục tunes, ví dụ: tunes/a.wav
  audio.src = `img/${key}.wav`;
  audio.currentTime = 0; // reset về đầu mỗi lần bấm
  audio.volume = volumeSlider.value; // cập nhật volume mỗi lần phát
  audio.play();

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (clickedKey) {
    clickedKey.classList.add("active");
    setTimeout(() => {
      clickedKey.classList.remove("active");
    }, 150);
  }
};

pianoKeys.forEach((key) => {
  allKeys.push(key.dataset.key);
  key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
  audio.volume = e.target.value;
};

const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

const pressedKey = (e) => {
  if (allKeys.includes(e.key)) playTune(e.key);
};

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
