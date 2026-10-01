function cardTemplate(pokemon, index) {
  return `
    <section role="button" class="card ${pokemon.types[0]}" id="card-${index}" onclick="openDialog(${index})">
      <div class="poke-number">#${pokemon.id}</div>
      <h3>${capitalize(pokemon.name)}</h3>
      <div class="card-bottom-section">
        <div class="type-wrapper">${typesTemplate(pokemon.types)}</div>
        <img class="card-image" id="card-image-${index}" src="${pokemon.image}" alt="${pokemon.name}" />
      </div>
    </section>`;
}

function typesTemplate(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    html += `<div class="poke-type">${capitalize(types[i])}</div>`;
  }
  return html;
}

function iconTemplate(path) {
  return `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="${path}" />
    </svg>`;
}

function dialogTemplate(pokemon, index) {
  return `
    <article class="detail ${pokemon.types[0]}" id="overlay-pokemon-name">
      ${topTemplate(pokemon, index)}
      ${tableTemplate(pokemon)}
    </article>`;
}

function topTemplate(pokemon, index) {
  return `
    <div class="detail-top">
      ${navTemplate(index)}
      <div class="detail-title">
        <h2 class="detail-name">${capitalize(pokemon.name)}</h2>
        <span class="detail-number">#${formatNumber(pokemon.id)}</span>
      </div>
      <div class="type-wrapper detail-types">${typesTemplate(pokemon.types)}</div>
      <img class="detail-image" id="dialog-image" src="${pokemon.image}" alt="${pokemon.name}" />
    </div>`;
}

function navTemplate(index) {
  return `
    <div class="detail-nav">
      <button class="close-button" id="close-dialog-button" onclick="closeDialog()" aria-label="close">
        ${iconTemplate("M19 12H5M11 6l-6 6 6 6")}
      </button>
      ${arrowsTemplate(index)}
    </div>`;
}

function arrowsTemplate(index) {
  const prevOff = index === 0 ? "disabled" : "";
  const nextOff = index === visiblePokemon.length - 1 ? "disabled" : "";
  return `
    <div class="detail-arrows">
      <button class="nav-button" id="prev-button" onclick="showPrevious()" aria-label="previous" ${prevOff}>
        ${iconTemplate("M15 6l-6 6 6 6")}
      </button>
      <button class="nav-button" id="next-button" onclick="showNext()" aria-label="next" ${nextOff}>
        ${iconTemplate("M9 6l6 6-6 6")}
      </button>
    </div>`;
}

function tableTemplate(pokemon) {
  return `
    <div class="detail-panel">
      <table class="detail-table">
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
