const switchBtn = document.querySelector(".header__switch");
const body = document.querySelector("[data-theme]");

switchBtn.addEventListener("click", function () {
  let currentTheme = body.dataset.theme;
  console.log("event running");
  if (currentTheme == "light") {
    toggleTheme("dark");
  } else {
    toggleTheme("light");
  }

  function toggleTheme(theme) {
    body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }
});

const usedark = window.matchMedia("(prefers-color-scheme: dark)");

function checkTheme() {
  if (usedark.matches) {
    console.log("adding dark");
    body.dataset.theme = "dark";
  } else {
    console.log("adding light");
    body.dataset.theme = "light";
  }
}

usedark.addEventListener("change", (event) => {
  console.log("adding system theme");
  checkTheme();
});

checkTheme();
