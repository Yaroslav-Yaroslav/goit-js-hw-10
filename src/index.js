import './css/styles.css';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));
let searchCountry = '';

function onInputSearch(e) {
  searchCountry = e.target.value.trim();
  if (searchCountry === '') return;

  fetchCountries(searchCountry)
    .then(countries => {
      if (countries.length > 10) {
        clearListCountries();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length > 1 && countries.length <= 10) {
        clearInfoCountry();
        appendMarkupList(countries);
      }
      if (countries.length === 1) {
        clearListCountries();
        appendMarkupInfo(countries);
      }
    })
    .catch(() => {
      clearListCountries();
      clearInfoCountry();
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearListCountries() {
  refs.list.innerHTML = '';
}
function clearInfoCountry() {
  refs.info.innerHTML = '';
}
function markupList(countries) {
  return countries
    .map(
      ({ name, flags }) => `<li>
                  <img src=${flags.svg} alt=${flags.alt} width="30">
                 ${name.official}
              </li>`
    )
    .join('');
}
function appendMarkupList(countries) {
  return refs.list.insertAdjacentHTML('beforeend', markupList(countries));
}
function markupInfo(countries) {
  const { flags, name, capital, languages, population } = countries[0];
  return `<h2><img src=${flags.svg} alt=${flags.alt} width="40">${
    name.official
  }</h2>
<ul>
  <li><span>Capital:</span> ${capital}</li>
  <li><span>Population:</span> ${population}</li>
  <li><span>Languages:</span> ${Object.values(languages).join(', ')}</li>
</ul>`;
}
function appendMarkupInfo(countries) {
  refs.info.insertAdjacentHTML('beforeend', markupInfo(countries));
}
