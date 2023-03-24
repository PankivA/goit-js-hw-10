import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchForm = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const inputHandler = e => {
  e.preventDefault();
  const countryInputText = e.target.value.trim();

  if (!countryInputText) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }

  fetchCountries(countryInputText)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = word => {
  if (word.length >= 2 && word.length <= 10) {
    cleanMarkup(countryInfo);
    const markupList = createListMarkup(word);
    countryList.innerHTML = markupList;  
  } else {
    cleanMarkup(countryList);
    const markupInfo = createInfoMarkup(word);
    countryInfo.innerHTML = markupInfo;   
  }
};

const createListMarkup = word => {
  return word
    .map(
      ({ name, flags }) =>
        `<li>
        <img src="${flags.png}" alt="${name.official}" width="60" height="40">
        <span>${name.official}</span>
        </li>`,
    )
    .join('');
};

const createInfoMarkup = word => {
  return word.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p><span>Capital:</span> ${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages)}</p>`,
  );
};

const cleanMarkup = ref => (ref.innerHTML = '');

searchForm.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));