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
    // console.log(coords);
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
    document.addEventListener('keydown', e => {
      if (e.key == 'Escape') {
        this.#hideForm();
        // remove this event listener
        document.removeEventListener('keydown', e);
      }
    });
  }

  #hideForm() {
    //clearing form on new data input
    inputDuration.value =
      inputDistance.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.classList.add('hidden');
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
    let workout;
    const d = new Date();

    if (type == 'running') {
      const cadence = +inputCadence.value;
      if (
        !validateData(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Invalid Data Input!');
      workout = new Running(
        type,
        [lat, lng],
        distance,
        duration,
        cadence,
        `Running on ${months[d.getMonth()]} ${d.getDate()}`
      );
    }

    if (type == 'cycling') {
      const elevationGain = +inputElevation.value;
      if (
        !validateData(distance, duration, elevationGain) ||
        !allPositive(distance, duration)
      )
        return alert('Invalid Data Input!');

      workout = new Cycling(
        type,
        [lat, lng],
        distance,
        duration,
        elevationGain,
        `Cycling on ${months[d.getMonth()]} ${d.getDate()}`
      );
    }
    this.#workouts.push(workout);
    console.log(this.#workouts);
    // to add marker on the map
    this.#addMarker(workout);
    // to render the workout list on the sidebar
    this.#renderWorkout(workout);

    // hide the current form for next workout addition
    this.#hideForm();
  }
  #addMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          className: `${workout.type}-popup`,
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent(
        `${workout.type == 'cycling' ? '🚴🏻' : '🏃🏻'} ${workout.title} `
      )
      .openPopup();
  }

  #renderWorkout(workout) {
    const html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.title}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type == 'cycling' ? '🚴🏻' : '🏃🏻'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              workout.type == 'cycling' ? workout.speed : workout.pace
            }</span>
            <span class="workout__unit">${
              workout.type == 'cycling' ? 'KM/H' : 'MIN/KH'
            }</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type == 'cycling' ? '🗻' : '🦶🏼'
            }</span>
            <span class="workout__value">${
              workout.type == 'cycling'
                ? workout.elevationGain
                : workout.cadence
            }</span>
            <span class="workout__unit">${
              workout.type == 'cycling' ? 'm' : 'spm'
            }</span>
          </div>
        </li>
    `;
    // console.log(html);
    form.insertAdjacentHTML('afterend', html);
  }
}

const app = new App();

class Workouts {
  date = new Date();
  id = (new Date().getTime() + '').slice(-10);
  constructor(type, coords, distance, duration, title) {
    this.type = type;
    this.coords = coords;
    this.distance = distance; // in KM
    this.duration = duration; // in min
    this.title = title;
  }
}

class Running extends Workouts {
  constructor(type, coords, distance, duration, cadence, title) {
    super(type, coords, distance, duration, title);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workouts {
  constructor(type, coords, distance, duration, elevationGain, title) {
    super(type, coords, distance, duration, title);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
