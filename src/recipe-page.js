import { recipes } from "./data/recipes.js";

var storageKey = "cuteRecipesLanguage";
function normalizePath(path) {
  return path && path.charAt(0) === "/" ? path.slice(1) : path;
}

function getRecipeFromUrl() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  if (!slug) {
    return null;
  }

  return recipes.find(function (recipe) {
    return recipe.slug === slug;
  }) || null;
}

function heading(level, text) {
  var node = document.createElement(level);
  node.textContent = text;
  return node;
}

function list(type, items) {
  var node = document.createElement(type);
  items.forEach(function (item) {
    var li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
  return node;
}

function renderGroups(section, headingText, groups) {
  section.appendChild(heading("h3", headingText));
  groups.forEach(function (group) {
    if (group.title) {
      var p = document.createElement("p");
      var strong = document.createElement("strong");
      strong.textContent = group.title;
      p.appendChild(strong);
      section.appendChild(p);
    }

    section.appendChild(list("ul", group.items));
  });
}

function renderStepGroups(section, headingText, groups) {
  section.appendChild(heading("h3", headingText));
  groups.forEach(function (group) {
    if (group.title) {
      var p = document.createElement("p");
      var strong = document.createElement("strong");
      strong.textContent = group.title;
      p.appendChild(strong);
      section.appendChild(p);
    }

    section.appendChild(list("ol", group.items));
  });
}

function renderLangSection(section, lang, data) {
  section.innerHTML = "";

  if (data.intro) {
    var intro = document.createElement("p");
    intro.textContent = data.intro;
    section.appendChild(intro);
  }

  renderGroups(section, lang === "sv" ? "Ingredienser" : "Ingredients", data.ingredients);
  renderStepGroups(section, lang === "sv" ? "Gör så här" : "Instructions", data.steps);

  if (data.timing && data.timing.length) {
    section.appendChild(heading("h3", lang === "sv" ? "Tidsåtgång" : "Timing"));
    section.appendChild(list("ul", data.timing));
  }

  if (data.nutrition) {
    section.appendChild(heading("h3", data.nutrition.title));
    section.appendChild(list("ul", data.nutrition.items));
  }

  if (data.assumptions) {
    var assumptionsTitle = document.createElement("p");
    var assumptionsStrong = document.createElement("strong");
    assumptionsStrong.textContent = data.assumptions.title;
    assumptionsTitle.appendChild(assumptionsStrong);
    section.appendChild(assumptionsTitle);
    section.appendChild(list("ul", data.assumptions.items));
  }
}

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

function showMissingRecipe() {
  var titleNode = document.querySelector("[data-recipe-title]");
  var article = document.querySelector("[data-recipe-content]");
  var aside = article ? article.querySelector(".recipe-aside") : null;
  var sections = document.querySelectorAll("[data-lang-content]");

  document.title = "Recept hittades inte | Cute Recipes";

  if (titleNode) {
    titleNode.textContent = "Recept hittades inte";
  }

  if (aside) {
    aside.hidden = true;
  }

  sections.forEach(function (section) {
    section.hidden = false;
    section.innerHTML = "";
  });

  if (sections[0]) {
    var p = document.createElement("p");
    p.textContent = "Det gick inte att hitta receptet. Gå tillbaka till startsidan och prova igen.";
    sections[0].appendChild(p);
  }

  if (sections[1]) {
    var pEn = document.createElement("p");
    pEn.textContent = "The recipe could not be found. Go back to the homepage and try again.";
    sections[1].appendChild(pEn);
  }
}

function initRecipePage() {
  var recipe = getRecipeFromUrl();

  if (!recipe) {
    showMissingRecipe();
    return;
  }

  document.title = recipe.title + " | Cute Recipes";

  var titleNode = document.querySelector("[data-recipe-title]");
  var imageNode = document.querySelector("[data-recipe-image]");
  var svSection = document.querySelector("[data-lang-content='sv']");
  var enSection = document.querySelector("[data-lang-content='en']");

  if (!titleNode || !imageNode || !svSection || !enSection) {
    return;
  }

  titleNode.textContent = recipe.title;
  imageNode.src = normalizePath(recipe.image);
  imageNode.alt = recipe.imageAlt.sv || recipe.title;

  renderLangSection(svSection, "sv", recipe.content.sv);
  renderLangSection(enSection, "en", recipe.content.en);

  var savedLang = localStorage.getItem(storageKey);
  var activeLang = savedLang === "en" ? "en" : "sv";
  applyLanguage(activeLang);

  document.querySelectorAll("[data-lang-choice]").forEach(function (button) {
    button.addEventListener("click", function () {
      var nextLang = button.getAttribute("data-lang-choice");
      localStorage.setItem(storageKey, nextLang);
      applyLanguage(nextLang);
    });
  });
}

document.addEventListener("DOMContentLoaded", initRecipePage);
