'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
let inputDistance = document.querySelector('.form__input--distance');
let inputDuration = document.querySelector('.form__input--duration');
let inputCadence = document.querySelector('.form__input--cadence');
let inputElevation = document.querySelector('.form__input--elevation');

form.addEventListener('submit', e => {
  //preventing default submit behavior: Page Refresh
  e.preventDefault();

  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        className: 'running-popup',
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
      })
    )
    .setPopupContent('Workout')
    .openPopup();

  //clearing form on new data input
  inputDuration.value =
    inputDistance.value =
    inputCadence.value =
    inputElevation.value =
      '';
});

document.querySelector('.form__input--type').addEventListener('change', () => {
  // const cad = document.querySelector('#cad');
  // const elev = document.querySelector('#elev');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

// Testing snippet to access DOM elements without using querySelector, just by using id name

// let isHidden = false;
// function tg() {
//   if (isHidden) {
//     lg.style.display = 'block';
//     isHidden = false;
//   } else {
//     lg.style.display = 'none';
//     isHidden = true;
//   }
// }

class App {
  #map;
  #mapEvent;
  constructor() {
    this.#getPosition();
  }

  #getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        function () {
          alert('Allow location to use this app!');
        }
      );
    }
  }
  #loadMap(position) {
    const { latitude, longitude } = position.coords;
    // const { longitude } = position.coords;
    const coords = [latitude, longitude];
    console.log(coords);
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker(coords)
    //   .addTo(map)
    //   .bindPopup('Location', L.popup({ autoClose: false }))
    //   .openPopup();
    // // console.log(map.mapEvent);
    this.#map.on('click', mapE => {
      this.#mapEvent = mapE;
      // console.log(mapEvent);
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }
  #showForm() {}
  #toggleElevationField() {}
  #newWorkout() {}
}

const app = new App();
