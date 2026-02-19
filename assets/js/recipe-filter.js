(function () {
  function setActiveFilter(buttons, tag) {
    buttons.forEach(function (button) {
      var active = button.getAttribute("data-filter") === tag;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyFilter(tag, query) {
    var cards = document.querySelectorAll("[data-recipe-card]");
    var visibleCount = 0;
    var normalizedQuery = (query || "").trim().toLowerCase();

    cards.forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      var matchesTag = tag === "all" || tags.indexOf(tag) !== -1;
      var cardText = card.textContent.toLowerCase();
      var matchesQuery = !normalizedQuery || cardText.indexOf(normalizedQuery) !== -1;
      var visible = matchesTag && matchesQuery;
      card.hidden = !visible;

      if (visible) {
        visibleCount += 1;
      }
    });

    var emptyState = document.querySelector("[data-filter-empty]");
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  function initRecipeFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    if (!buttons.length) {
      return;
    }
    var searchInput = document.querySelector("[data-recipe-search]");

    var activeTag = "all";
    setActiveFilter(buttons, activeTag);
    applyFilter(activeTag, searchInput ? searchInput.value : "");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeTag = button.getAttribute("data-filter") || "all";
        setActiveFilter(buttons, activeTag);
        applyFilter(activeTag, searchInput ? searchInput.value : "");
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        applyFilter(activeTag, searchInput.value);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initRecipeFilter);
})();
