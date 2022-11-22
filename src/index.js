import './css/styles.css';

import debounce from "lodash.debounce";
import API from "./fetchCountries";
import {Notify} from 'notiflix/build/notiflix-block-aio';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
    input:document.querySelector("#search-box"),
    ul:document.querySelector(".country-list"),
    box:document.querySelector(".country-info"),
}

refs.input.addEventListener("input", debounce(onInputChange), DEBOUNCE_DELAY);

function onInputChange(event) {
    const needCountry = inputTrim(event);

    if(needCountry) {
        API.fetchCountries(needCountry)
        .then(countryFind)
        .catch(errorFind);
    }

    refs.ul.innerHTML = "";
    refs.box.innerHTML = "";
};

function inputTrim(event) {
    return event.target.value.trim();
}

function countryFind(neededCountries) {
    if(neededCountries.message === 'Page Not Found'|| neededCountries.message === 'Not Found') {
        Notiflix.Notify.failure("Oops, there is no country with that name");
        console.error("Oops, there is no country with that name");
    } else if(neededCountries.length === 1) {
        const markup = (createMarkup(neededCountries));

        refs.ul.innerHTML = "";
        refs.box.innerHTML = markup;
} else if(neededCountries.length > 1 && neededCountries.length <= 10) {
    const countryList = createCountryList(neededCountries);

    refs.box.innerHTML = "";
    refs.ul.insertAdjacentHTML("beforeend", countryList);
} else if(neededCountries.length > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
    refs.box.innerHTML = "";
    refs.ul.innerHTML = "";
}
}

function errorFind(error) {
    Notiflix.Notify.failure("Oops, there is no country with that name");
    console.error("Oops, there is no country with that name");
}

function createCountryList(neededCountries) {
    return neededCountries
    .map(({name, flags}) => {
        return `<li class="country">
            <img class="country__img" src="${flags.svg}" alt="${name.official}" width="60" height="30">
            <p class="country__info">${name.official}</p>
            </li>`;
    }).join('');
}

function createMarkup(neededCountries) {
    return neededCountries
    .map(({name, flags, capital, population, languages}) =>{
    const allLanguages = Object.values(languages).join(", ");
    
    return `<div class="country__info-box>
                <p class="country__title" >${name.official}</p>
                <img class="country__img" src="${flags.svg}" alt="${name.official}" width="60" height="30">
            </div>
    <p class="country__description">Capital: <span>${capital}</span></p>
    <p class="country__description">Population: <span>${population}</span></p>
    <p class="country__description">languages: <span>${allLanguages}</span></p>`;
}).join("");
}