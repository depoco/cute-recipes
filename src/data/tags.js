export const tagOptions = [
  { key: "all", label: "Alla" },
  { key: "finger-food", label: "Plockmat" },
  { key: "starter", label: "Förrätt" },
  { key: "main-course", label: "Huvudrätt" },
  { key: "dessert", label: "Dessert" },
  { key: "drinks", label: "Drycker" },
  { key: "sauce", label: "Sås" }
];

export const tagLabels = tagOptions.reduce(function (map, tag) {
  map[tag.key] = tag.label;
  return map;
}, {});
