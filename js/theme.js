const switchBtn = document.querySelector(".header__switch");
const body = document.querySelector("[data-theme]");

switchBtn.addEventListener("click", function () {
  let currentTheme = body.dataset.theme;

  if (currentTheme == "light") {
    toggleTheme("dark");
  } else {
    toggleTheme("light");
  }

  function toggleTheme(theme) {
    body.dataset.theme = theme;
  }
});

const usedark = window.matchMedia("(prefers-color-scheme: dark)");

function checkTheme() {
  if (usedark.matches) {
    body.dataset.theme = "dark";
  } else {
    body.dataset.theme = "light";
  }
}

usedark.addEventListener("change", () => {
  checkTheme();
});

checkTheme();
