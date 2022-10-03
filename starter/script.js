'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;
// Using the Geolocation API
class App {
  #map; //set the variables to private
  #mapEvent;
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this)); {
    //   e.preventDefault();
    //   inputDistance.value =
    //     inputDuration.value =
    //     inputCadence.value =
    //     inputElevation.value =
    //       '';
    //   // display marker
    //   console.log(mapEvent);
    //   const { lat, lng } = mapEvent.latlng;

    //   L.marker([lat, lng])
    //     .addTo(map)
    //     .bindPopup(
    //       L.popup({
    //         maxWidth: 250,
    //         minWidth: 100,
    //         autoClose: false,
    //         closeOnClick: false,
    //         className: 'running-popup',
    //       })
    //     )
    //     .setPopupContent('Workout')
    //     .openPopup();
    // });
    inputType.addEventListener('change', function () {
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    });
  }
  _getPosition() {
    //get users current location
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
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
    this.#map.on('click', function (mapE) {
      this.#mapEvent = mapE;
      form.classList.remove('hidden'); //remove the hidden class from the form so it appears
      inputDistance.focus(); //put cursor on the distance input after selecting the map to put down a tag
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
    });
  }
  _showForm() {}
  _toggleElevationField() {}
  _newWorkout(e) {
    e.preventDefault();
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    // display marker
    // console.log(this.#mapEvent);
    const { lat, lng } = mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )}
      .setPopupContent('Workout')
      .openPopup();
  
}
//making an object for App called app
const app = new App();
app._getPosition();

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    // function (position) {
    //   // console.log(position);
    //   const { latitude } = position.coords;
    //   const { longitude } = position.coords;
    //   console.log(`https://www.google.com/maps/@${latitude},-${longitude}`);
    //   //set latitude and longitude to coords
    //   const coords = [latitude, longitude];
    //   //coords and zoom level high number closer lower farther out
    //   map = L.map('map').setView(coords, 13);
    //   //   console.log(map);
    //   //fr/hot was org
    //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution:
    //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   }).addTo(map);
    //   // set the marker icon to the coords of latitude and longitude using current location
    //   //handling clicks on map
    //   map.on('click', function (mapE) {
    //     mapEvent = mapE;
    //     form.classList.remove('hidden');
    //     inputDistance.focus();
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
    // });
    // },
    function () {
      alert('Could not get your position');
    }
  );
// form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   inputDistance.value =
//     inputDuration.value =
//     inputCadence.value =
//     inputElevation.value =
//       '';
//   // display marker
//   console.log(mapEvent);
//   const { lat, lng } = mapEvent.latlng;

//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: 'running-popup',
//       })
//     )
//     .setPopupContent('Workout')
//     .openPopup();
// });
// inputType.addEventListener('change', function () {
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
// });
