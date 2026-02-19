(function () {
  var storageKey = "cuteRecipesLanguage";

  function applyLanguage(lang) {
    var sections = document.querySelectorAll("[data-lang-content]");
    var buttons = document.querySelectorAll("[data-lang-choice]");

    sections.forEach(function (section) {
      section.hidden = section.getAttribute("data-lang-content") !== lang;
    });

    buttons.forEach(function (button) {
      var active = button.getAttribute("data-lang-choice") === lang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function initLanguageToggle() {
    var buttons = document.querySelectorAll("[data-lang-choice]");
    if (!buttons.length) {
      return;
    }

    var savedLang = localStorage.getItem(storageKey);
    var initialLang = savedLang === "en" ? "en" : "sv";
    applyLanguage(initialLang);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var lang = button.getAttribute("data-lang-choice");
        localStorage.setItem(storageKey, lang);
        applyLanguage(lang);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initLanguageToggle);
})();
