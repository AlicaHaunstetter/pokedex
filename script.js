const START_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

let allPokemon = [];
let visiblePokemon = [];
let nextUrl = START_URL;
let currentIndex = 0;
let searchTerm = "";

async function init() {
  await loadPokemon();
}

async function loadPokemon() {
  setLoading(true);
  try {
    const list = await fetchJson(nextUrl);
    const batch = await loadDetails(list.results);
    allPokemon = allPokemon.concat(batch);
    nextUrl = list.next;
  } catch (error) {
    console.error("Loading failed:", error);
  }
  setLoading(false);
  visiblePokemon = filterPokemon();
  renderCards();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("HTTP " + response.status);
  return await response.json();
}

async function loadDetails(results) {
  const batch = [];
  for (let i = 0; i < results.length; i++) {
    const data = await fetchJson(results[i].url);
    batch.push(createPokemon(data));
  }
  return batch;
}

function createPokemon(data) {
  return {
    id: data.id,
    name: data.name,
    types: getTypes(data),
    image: getImage(data),
    height: formatHeight(data.height),
    weight: formatWeight(data.weight),
    abilities: getAbilities(data),
    baseExp: data.base_experience || "-",
    mainMove: getMainMove(data),
    stats: getStats(data),
  };
}

function getTypes(data) {
  const types = [];
  for (let i = 0; i < data.types.length; i++) {
    types.push(data.types[i].type.name);
  }
  return types;
}

function getAbilities(data) {
  const names = [];
  for (let i = 0; i < data.abilities.length; i++) {
    names.push(cleanName(data.abilities[i].ability.name));
  }
  return names.join(", ");
}

function getStats(data) {
  const stats = [];
  for (let i = 0; i < data.stats.length; i++) {
    stats.push({
      name: formatStatName(data.stats[i].stat.name),
      value: data.stats[i].base_stat,
    });
  }
  return stats;
}

function getMainMove(data) {
  if (data.moves.length === 0) return "-";
  return cleanName(data.moves[0].move.name);
}

function getImage(data) {
  const other = data.sprites.other;
  let image = other.dream_world.front_default;
  if (!image) image = other["official-artwork"].front_default;
  if (!image) image = data.sprites.front_default;
  return image;
}

function formatHeight(decimeters) {
  const meters = decimeters / 10;
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = (totalInches % 12).toFixed(1);
  return `${feet}'${inches}" (${meters.toFixed(2)} m)`;
}

function formatWeight(hectograms) {
  const kg = hectograms / 10;
  const lbs = (kg * 2.20462).toFixed(1);
  return `${lbs} lbs (${kg.toFixed(1)} kg)`;
}

function formatStatName(name) {
  if (name === "hp") return "HP";
  return cleanName(name);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function cleanName(text) {
  return capitalize(text.replaceAll("-", " "));
}

function formatNumber(id) {
  return String(id).padStart(3, "0");
}

function setLoading(isLoading) {
  const button = document.getElementById("load-more-button");
  document.getElementById("loading").hidden = !isLoading;
  button.disabled = isLoading;
  button.hidden = !nextUrl;
}

function getInputValue() {
  return document.getElementById("search-input").value.trim().toLowerCase();
}

function checkInput() {
  const value = getInputValue();
  document.getElementById("search-button").disabled = value.length < 3;
  if (value.length === 0 && searchTerm !== "") resetSearch();
}

function filterPokemon() {
  return allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm),
  );
}

function startSearch() {
  searchTerm = getInputValue();
  visiblePokemon = filterPokemon();
  renderCards();
}

function resetSearch() {
  searchTerm = "";
  visiblePokemon = allPokemon;
  renderCards();
}

function renderCards() {
  document.getElementById("load-more-button").hidden =
    searchTerm !== "" || !nextUrl;
  const content = document.getElementById("content");
  if (visiblePokemon.length === 0 && searchTerm !== "") {
    content.innerHTML = notFoundTemplate();
    return;
  }
  let cardsHtml = "";
  for (let i = 0; i < visiblePokemon.length; i++) {
    cardsHtml += cardTemplate(visiblePokemon[i], i);
  }
  content.innerHTML = getUlTemplate(cardsHtml);
}

function openDialog(index) {
  currentIndex = index;
  renderDialog();
  document.body.classList.add("no-scroll");
  document.getElementById("dialog").showModal();
}

function renderDialog() {
  const dialog = document.getElementById("dialog");
  const prevOff = currentIndex === 0 ? "disabled" : "";
  const nextOff = currentIndex === visiblePokemon.length - 1 ? "disabled" : "";
  dialog.innerHTML = dialogTemplate(
    visiblePokemon[currentIndex],
    prevOff,
    nextOff,
  );
}

function getTypesHtml(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    html += typeTemplate(types[i]);
  }
  return html;
}

function getStatRowsHtml(stats) {
  let html = "";
  for (let i = 0; i < stats.length; i++) {
    html += rowTemplate(stats[i].name, stats[i].value);
  }
  return html;
}

function closeDialog() {
  document.getElementById("dialog").close();
}

function unlockScroll() {
  document.body.classList.remove("no-scroll");
}

function closeOnBackdrop(event) {
  if (event.target === event.currentTarget) closeDialog();
}

function showPrevious() {
  if (currentIndex === 0) return;
  currentIndex--;
  renderDialog();
}

function showNext() {
  if (currentIndex >= visiblePokemon.length - 1) return;
  currentIndex++;
  renderDialog();
}
