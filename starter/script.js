'use strict';
// Using the Geolocation API
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    // this.date=...
    // this.id=...
    this.coords = coords; // [lat,lan]
    this.distance = distance;
    this.duration = duration;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling'; //define the type so it can be accessed in the workout available of all the instances
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    // this.type = 'cycling'
    this.elevationGain = elevationGain;
  }
  calcSpeed() {
    //km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1);
// console.log(cycling1);
///////////////////////////////////////////
//application architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map; //set the variables to private
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField); //listen to the change of the workout to decide which metric to use to measure the workout
  }
  //// inputElevation
  ////   .closest('.form__row')
  ////   .classList.toggle('form__row--hidden');
  //// inputCadence
  ////   .closest('.form__row')
  ////   .classList.toggle('form__row--hidden');

  _getPosition() {
    //get users current location
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position'); //if the map cannot be found give th user an alert
        }
      );
  }
  _loadMap(position) {
    // console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},-${longitude}`);
    //set latitude and longitude to coords
    const coords = [latitude, longitude];
    //coords and zoom level high number closer lower farther out
    console.log(this); //get the value of this
    this.#map = L.map('map').setView(coords, 13);
    //   console.log(map);
    //fr/hot was org
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // set the marker icon to the coords of latitude and longitude using current location
    //handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
    //// this.#mapEvent = mapE;
    //// form.classList.remove('hidden'); //remove the hidden class from the form so it appears
    //// inputDistance.focus(); //put cursor on the distance input after selecting the map to put down a tag
  }

  _showForm(mapE) {
    //show the form when the map is clicked on
    this.#mapEvent = mapE;
    form.classList.remove('hidden'); //remove the hidden class from the form so it appears
    inputDistance.focus(); //put cursor on the distance input after selecting the map to put down a tag}
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    //helper function to determine if inputs are valid
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    //helper function to determine if inputs are greater than zero
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault(); //reset the  input values on the form on submission

    //get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    //if workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) || //using helper functions in a guard clause to determine if they are valid inputs
        !allPositive(distance, duration, cadence) //using helper functions in a guard clause to determine if they are valid inputs
      ) {
        return alert('Inputs have to be positive numbers');
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    //if workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //check if data is valid
      if (
        !validInputs(distance, duration, elevation) || //using helper functions in a guard clause to determine if they are valid inputs
        !allPositive(distance, duration) //using helper functions in a guard clause to determine if they are valid inputs
      ) {
        return alert('Inputs have to be positive numbers');
        workout = new Cycling([lat, lng], distance, duration, elevation);
      }
    }
    //Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);
    //Render workout on map as marker
    this.renderWorkoutMarker(workout); //call the rendWorkoutMarker method
    //render workout on list

    // Hide for + clear input fields

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    // display marker
    // console.log(this.#mapEvent);
    // const { lat, lng } = this.#mapEvent.latlng;

    // L.marker([lat, lng]) //controls what the marker looks like and how it acts
    //   .addTo(this.#map)
    //   .bindPopup(
    //     L.popup({
    //       maxWidth: 250,
    //       minWidth: 100,
    //       autoClose: false,
    //       closeOnClick: false,
    //       className: 'running-popup',
    //     })
    //   )
    //   .setPopupContent('Workout')
    //   .openPopup(); //controls what the marker looks like and how it acts
  }
  //creates a method for rendering the workout

  renderWorkoutMarker(workout) {
    L.marker(workout.coords) //controls what the marker looks like and how it acts get the lat and lng
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('workout')
      .openPopup(); //controls what the marker looks like and how it acts
  }
}
//making an object for App called app//calling the app with out this the contents can't be accessed
const app = new App();
//! app._getPosition();//bugs out code bad written in video but does not work.
////////////////////////////////////////////
////////////////////////////////////////////
//!========================================================
//before moving into classes
///// if (navigator.geolocation)
///// navigator.geolocation.getCurrentPosition(
//// function (position) {
//   // console.log(position);
////   const { latitude } = position.coords;
////   const { longitude } = position.coords;
////   console.log(`https://www.google.com/maps/@${latitude},-${longitude}`);
//   //set latitude and longitude to coords
////   const coords = [latitude, longitude];
//   //coords and zoom level high number closer lower farther out
////   map = L.map('map').setView(coords, 13);
//   //   console.log(map);
//   //fr/hot was org
////   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
////     attribution:
////       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
////   }).addTo(map);
//   // set the marker icon to the coords of latitude and longitude using current location
//   //handling clicks on map
////   map.on('click', function (mapE) {
////     mapEvent = mapE;
////     form.classList.remove('hidden');
////    inputDistance.focus();
//// console.log(mapEvent);
// // const { lat, lng } = mapEvent.latlng;

// // L.marker([lat, lng])
////   .addTo(map)
// //   .bindPopup(
// //     L.popup({
// //       maxWidth: 250,
// //       minWidth: 100,
////       autoClose: false,
// //       closeOnClick: false,
// //       className: 'running-popup',
////     })
// //   )
////   .setPopupContent('Workout')
////   .openPopup();
//// on is like a event listener in normal javascript
//// });
//// },
////   function () {
////     alert('Could not get your position');
////   }
//// );
//// form.addEventListener('submit', function (e) {
////   e.preventDefault();
////   inputDistance.value =
////     inputDuration.value =
////     inputCadence.value =
////     inputElevation.value =
////       '';
//   // display marker
////   console.log(mapEvent);
////   const { lat, lng } = mapEvent.latlng;

////   L.marker([lat, lng])
////     .addTo(map)
////     .bindPopup(
////    L.popup({
////        maxWidth: 250,
////         minWidth: 100,
////         autoClose: false,
////         closeOnClick: false,
////         className: 'running-popup',
////       })
////     )
////     .setPopupContent('Workout')
////     .openPopup();
//// });
//// inputType.addEventListener('change', function () {
////   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
////   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//// });
