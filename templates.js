function getUlTemplate(cardsHtml) {
  return `<ul class="card-list" aria-label="Pokemon list">${cardsHtml}</ul>`;
}

function notFoundTemplate() {
  return `<p class="not-found" data-id="not-found">No match found.</p>`;
}

function cardTemplate(pokemon, index) {
  return `
    <li>
      <button class="card ${pokemon.types[0]}" id="card-${index}" data-id="card"
        aria-label="Show details of ${capitalize(pokemon.name)}" onclick="openDialog(${index})">
        <span class="poke-number">#${pokemon.id}</span>
        <span class="card-name">${capitalize(pokemon.name)}</span>
        <span class="card-bottom-section">
          <span class="type-wrapper">${getTypesHtml(pokemon.types)}</span>
          <img class="card-image" id="card-image-${index}" data-id="card-image" src="${pokemon.image}" alt="${pokemon.name}" />
        </span>
      </button>
    </li>`;
}

function typeTemplate(type) {
  return `<span class="poke-type">${capitalize(type)}</span>`;
}

function iconTemplate(path) {
  return `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="${path}" />
    </svg>`;
}

function dialogTemplate(pokemon, prevOff, nextOff) {
  return `
    <div class="detail ${pokemon.types[0]}" id="overlay-pokemon-name" data-id="overlay-pokemon-name">
      ${topTemplate(pokemon, prevOff, nextOff)}
      ${tableTemplate(pokemon)}
    </div>`;
}

function topTemplate(pokemon, prevOff, nextOff) {
  return `
    <div class="detail-top">
      ${navTemplate(prevOff, nextOff)}
      <div class="detail-title">
        <h2 class="detail-name">${capitalize(pokemon.name)}</h2>
        <span class="detail-number">#${formatNumber(pokemon.id)}</span>
      </div>
      <div class="type-wrapper detail-types">${getTypesHtml(pokemon.types)}</div>
      <img class="detail-image" id="dialog-image" data-id="dialog-image" src="${pokemon.image}" alt="${pokemon.name}" />
    </div>`;
}

function navTemplate(prevOff, nextOff) {
  return `
    <div class="detail-nav">
      <button class="close-button" id="close-dialog-button" data-id="close-dialog-button"
        onclick="closeDialog()" aria-label="Close details">
        ${iconTemplate("M18 6L6 18M6 6l12 12")}
      </button>
      ${arrowsTemplate(prevOff, nextOff)}
    </div>`;
}

function arrowsTemplate(prevOff, nextOff) {
  return `
    <div class="detail-arrows">
      ${prevButtonTemplate(prevOff)}
      ${nextButtonTemplate(nextOff)}
    </div>`;
}

function prevButtonTemplate(disabled) {
  return `
    <button class="nav-button" id="prev-button" data-id="prev-button"
      onclick="showPrevious()" aria-label="Previous Pokemon" ${disabled}>
      ${iconTemplate("M15 6l-6 6 6 6")}
    </button>`;
}

function nextButtonTemplate(disabled) {
  return `
    <button class="nav-button" id="next-button" data-id="next-button"
      onclick="showNext()" aria-label="Next Pokemon" ${disabled}>
      ${iconTemplate("M9 6l6 6-6 6")}
    </button>`;
}

function tableTemplate(pokemon) {
  return `
    <div class="detail-panel">
      <table class="detail-table">
        ${getStatRowsHtml(pokemon.stats)}
        ${rowTemplate("Base Experience", pokemon.baseExp)}
        ${rowTemplate("Main Move", pokemon.mainMove)}
        ${rowTemplate("Height", pokemon.height)}
        ${rowTemplate("Weight", pokemon.weight)}
        ${rowTemplate("Abilities", pokemon.abilities)}
      </table>
    </div>`;
}

function rowTemplate(label, value) {
  return `<tr><th>${label}</th><td>${value}</td></tr>`;
}
