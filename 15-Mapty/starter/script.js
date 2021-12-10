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
  #workouts = [];
  constructor() {
    this.#getPosition();
    form.addEventListener('submit', this.#newWorkout.bind(this));

    inputType.addEventListener('change', this.#toggleElevationField);
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
    const coords = [latitude, longitude];
    console.log(coords);
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this.#showForm.bind(this));
  }
  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  #toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  #newWorkout(e) {
    //preventing default submit behavior: Page Refresh
    e.preventDefault();

    const validateData = (...inputs) => inputs.every(i => Number.isFinite(i));

    const allPositive = (...inputs) => inputs.every(i => i > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    if (type == 'running') {
      const cadence = +inputCadence.value;
      if (
        !validateData(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Invalid Data Input!');
      this.#workouts.push(new Running([lat, lng], distance, duration, cadence));
    }

    if (type == 'cycling') {
      const elevationGain = +inputElevation.value;
      if (
        !validateData(distance, duration, elevationGain) ||
        !allPositive(distance, duration)
      )
        return alert('Invalid Data Input!');

      this.#workouts.push(
        new Cycling([lat, lng], distance, duration, elevationGain)
      );
    }
    console.log(this.#workouts);
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

const app = new App();

class Workouts {
  date = new Date();
  id = (new Date().getTime() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in KM
    this.duration = duration; // in min
  }
}

class Running extends Workouts {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workouts {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
