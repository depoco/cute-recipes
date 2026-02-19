import { recipes } from "./data/recipes.js";
import { tagOptions, tagLabels } from "./data/tags.js";

function buildFilterButtons(container, onSelect) {
  tagOptions.forEach(function (tag, index) {
    var button = document.createElement("button");
    button.className = "filter-btn" + (index === 0 ? " is-active" : "");
    button.type = "button";
    button.dataset.filter = tag.key;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    button.textContent = tag.label;
    button.addEventListener("click", function () {
      onSelect(tag.key);
    });
    container.appendChild(button);
  });
}

function recipeCard(recipe) {
  var li = document.createElement("li");
  li.dataset.recipeCard = "";
  li.dataset.tags = recipe.tags.join(" ");

  var link = document.createElement("a");
  link.className = "recipe-link";
  link.href = "/recipe.html?slug=" + encodeURIComponent(recipe.slug);

  var img = document.createElement("img");
  img.className = "recipe-thumb";
  img.src = recipe.image;
  img.alt = recipe.imageAlt.sv || recipe.title;

  var info = document.createElement("div");
  info.className = "recipe-info";

  var title = document.createElement("span");
  title.className = "recipe-title";
  title.textContent = recipe.title;

  var tags = document.createElement("div");
  tags.className = "recipe-tags";
  tags.setAttribute("aria-label", "Kategorier");

  recipe.tags.forEach(function (tag) {
    var chip = document.createElement("span");
    chip.className = "tag-chip";
    chip.textContent = tagLabels[tag] || tag;
    tags.appendChild(chip);
  });

  info.appendChild(title);
  info.appendChild(tags);
  link.appendChild(img);
  link.appendChild(info);
  li.appendChild(link);

  return li;
}

function setActiveFilter(tag) {
  document.querySelectorAll("[data-filter]").forEach(function (button) {
    var active = button.dataset.filter === tag;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function applyFilter(tag, query) {
  var cards = document.querySelectorAll("[data-recipe-card]");
  var normalizedQuery = (query || "").trim().toLowerCase();
  var visibleCount = 0;

  cards.forEach(function (card) {
    var tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
    var cardText = card.textContent.toLowerCase();
    var matchesTag = tag === "all" || tags.indexOf(tag) !== -1;
    var matchesQuery = !normalizedQuery || cardText.indexOf(normalizedQuery) !== -1;
    var visible = matchesTag && matchesQuery;

    card.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  var empty = document.querySelector("[data-filter-empty]");
  if (empty) {
    empty.hidden = visibleCount !== 0;
  }
}

function initHome() {
  var list = document.querySelector("[data-recipe-list]");
  var filterWrap = document.querySelector("[data-filter-buttons]");
  var search = document.querySelector("[data-recipe-search]");

  if (!list || !filterWrap || !search) {
    return;
  }

  recipes.forEach(function (recipe) {
    list.appendChild(recipeCard(recipe));
  });

  var activeTag = "all";
  buildFilterButtons(filterWrap, function (nextTag) {
    activeTag = nextTag;
    setActiveFilter(activeTag);
    applyFilter(activeTag, search.value);
  });

  search.addEventListener("input", function () {
    applyFilter(activeTag, search.value);
  });

  applyFilter(activeTag, search.value);
}

document.addEventListener("DOMContentLoaded", initHome);
