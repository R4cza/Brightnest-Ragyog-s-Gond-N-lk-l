const THEME_KEY = "brightnest-theme";
const TRANSITION_KEY = "brightnest-page-transition";
const SKIP_THEME_MODAL_KEY = "brightnest-skip-theme-modal-once";

const temaModal = document.getElementById("temaModal");
const temaToggle = document.getElementById("temaToggle");
const temaValasztok = document.querySelectorAll("[data-theme-choice]");
const temaMegerosit = document.getElementById("temaMegerosit");

let pendingTheme = "light";

function applyTheme(theme, persist = false) {
  document.body.setAttribute("data-theme", theme);
  if (persist) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

function syncThemeButtons(theme) {
  temaValasztok.forEach((button) => {
    const selectedTheme = button.getAttribute("data-theme-choice");
    button.classList.toggle("aktiv", selectedTheme === theme);
  });
}

function openThemeModal() {
  if (!temaModal) {
    return;
  }

  temaModal.classList.add("nyitva");
  temaModal.setAttribute("aria-hidden", "false");
}

function closeThemeModal() {
  if (!temaModal) {
    return;
  }

  temaModal.classList.remove("nyitva");
  temaModal.setAttribute("aria-hidden", "true");
}

function triggerBodyAnimation(className, duration) {
  document.body.classList.remove(className);
  window.requestAnimationFrame(() => {
    document.body.classList.add(className);
  });

  window.setTimeout(() => {
    document.body.classList.remove(className);
  }, duration);
}

function triggerStartupAnimation() {
  triggerBodyAnimation("splash-active", 1650);
}

function triggerFormTransitionAnimation() {
  triggerBodyAnimation("form-atmenet-active", 980);
}

function triggerHomeTransitionAnimation() {
  triggerBodyAnimation("home-atmenet-active", 1080);
}

function triggerThemeSwapAnimation() {
  triggerBodyAnimation("tema-csere-active", 720);
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "light" || savedTheme === "dark") {
  pendingTheme = savedTheme;
  applyTheme(savedTheme, false);
  syncThemeButtons(savedTheme);
} else {
  pendingTheme = "light";
  applyTheme("light", false);
  syncThemeButtons("light");
}

const shouldSkipThemeModal = sessionStorage.getItem(SKIP_THEME_MODAL_KEY) === "true";
if (shouldSkipThemeModal) {
  sessionStorage.removeItem(SKIP_THEME_MODAL_KEY);
} else {
  openThemeModal();
}

temaValasztok.forEach((button) => {
  button.addEventListener("click", function () {
    pendingTheme = button.getAttribute("data-theme-choice") || "light";
    applyTheme(pendingTheme, false);
    syncThemeButtons(pendingTheme);
  });
});

if (temaMegerosit) {
  temaMegerosit.addEventListener("click", function () {
    applyTheme(pendingTheme, true);
    closeThemeModal();
    triggerStartupAnimation();
  });
}

if (temaToggle) {
  temaToggle.addEventListener("click", function () {
    const currentTheme = document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    pendingTheme = nextTheme;
    applyTheme(nextTheme, true);
    syncThemeButtons(nextTheme);
    triggerThemeSwapAnimation();
  });
}

const pendingTransition = sessionStorage.getItem(TRANSITION_KEY);
if (pendingTransition === "form") {
  triggerFormTransitionAnimation();
}

if (pendingTransition === "home") {
  triggerHomeTransitionAnimation();
}

if (pendingTransition) {
  sessionStorage.removeItem(TRANSITION_KEY);
  const revealDelay = pendingTransition === "home" ? 720 : 620;
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition-pending");
    document.documentElement.removeAttribute("data-pending-transition");
  }, revealDelay);
} else {
  document.documentElement.classList.remove("transition-pending");
  document.documentElement.removeAttribute("data-pending-transition");
}

document.querySelectorAll("[data-transition]").forEach((link) => {
  link.addEventListener("click", function () {
    const transitionType = link.getAttribute("data-transition");
    if (!transitionType) {
      return;
    }

    sessionStorage.setItem(TRANSITION_KEY, transitionType);
    sessionStorage.setItem(SKIP_THEME_MODAL_KEY, "true");
  });
});

const kapcsolatUrlap = document.getElementById("kapcsolatUrlap");
const emailMezo = document.getElementById("email");
const emailHiba = document.getElementById("emailHiba");
const kuldesGomb = document.getElementById("kuldesGomb");

if (kapcsolatUrlap && emailMezo && emailHiba && kuldesGomb) {
  kapcsolatUrlap.addEventListener("submit", function (event) {
    if (emailMezo.value.trim() === "") {
      event.preventDefault();
      emailHiba.classList.remove("rejtett");
      emailMezo.classList.add("hiba-mezo");
      return;
    }

    emailHiba.classList.add("rejtett");
    emailMezo.classList.remove("hiba-mezo");
    kuldesGomb.disabled = true;
    kuldesGomb.textContent = "Küldés...";
  });

  emailMezo.addEventListener("input", function () {
    if (emailMezo.value.trim() !== "") {
      emailHiba.classList.add("rejtett");
      emailMezo.classList.remove("hiba-mezo");
    }
  });
}
