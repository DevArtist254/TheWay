"use strict"

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form")
const containerWorkouts = document.querySelector(".workouts")
const inputType = document.querySelector(".form__input--type")
const inputDistance = document.querySelector(".form__input--distance")
const inputDuration = document.querySelector(".form__input--duration")
const inputCadence = document.querySelector(".form__input--cadence")
const inputElevation = document.querySelector(".form__input--elevation")

//let map, mapEvent - changed to private properties

class Workouts {
 date = new Date()
 //Always have a uniquie id tp help in search
 id = (Date.now + "").slice(-10)

 constructor(coords, distance, duration) {
  this.coords = coords // [lat, lng]
  this.distance = distance // in km
  this.duration = duration // in min
 }
}

class Running extends Workouts {
 constructor(coords, distance, duration, cadence) {
  super(coords, distance, duration)
  this.cadence = cadence
  this.calcPace()
 }

 calcPace() {
  //min/km
  this.pace = this.duration / this.distance

  return this.pace
 }
}

class Cycling extends Workouts {
 constructor(coords, distance, duration, elevationGain) {
  super(coords, distance, duration)
  this.elevationGain = elevationGain
  this.calcSpeed()
 }

 calcSpeed() {
  //km/h
  this.speed = this.distance / (this.duration / 60)
 }
}

class App {
 //Private properties in the class
 #map
 #mapEvent
 #workouts = []

 constructor() {
  this._getPosition()

  form.addEventListener("submit", this._newWorkout.bind(this))

  inputType.addEventListener("change", this._toggleElevationField.bind(this))
 }

 _getPosition() {
  if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
    alert("could get your location")
   })
  }
 }

 _loadMap(pos) {
  const {latitude, longitude} = pos.coords

  console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`)

  const coordinates = [latitude, longitude]

  this.#map = L.map("map").setView(coordinates, 13)

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
   attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(this.#map)

  L.marker(coordinates)
   .addTo(this.#map)
   .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
   .openPopup()

  this.#map.on("click", this._showForm.bind(this))
 }

 _showForm(mapEvt) {
  this.#mapEvent = mapEvt
  form.classList.remove("hidden")
  inputDistance.focus()
 }

 _toggleElevationField() {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
 }

 _newWorkout(e) {
  e.preventDefault()

  const validInputs = (...inputs) => inputs.every((inp) => Number.isFinite(inp))
  const allPositive = (...inputs) => inputs.every((inp) => inp > 0)

  //get data from the form
  const type = inputType.value
  const distance = +inputDistance.value
  const duration = +inputDuration.value

  const {lat, lng} = this.#mapEvent.latlng
  let workout

  //If runing, create a running object
  if (type === "running") {
   const cadence = +inputCadence.value

   //check vaildity - gaurd clause
   if (
    !validInputs(distance, duration, cadence) ||
    !allPositive(distance, duration, cadence)
   )
    return alert("Input have to be +ve numbers!")

   //create a new workout
   workout = new Running([lat, lng], distance, duration, cadence)
  }

  //if workout cycling, create cycling object
  if (type === "cycling") {
   const elevation = +inputElevation.value

   //check vaildity
   if (
    // !Number.isFinite(distance) ||
    // !Number.isFinite(duration) ||
    // !Number.isFinite(elevation)
    !validInputs(distance, duration, elevation) ||
    !allPositive(distance, duration)
   )
    return alert("Input have to be +ve numbers!")

   //create a new workout
   workout = new Cycling([lat, lng], distance, duration, elevation)
  }

  // add new object to workout array
  this.#workouts.push(workout)

  console.log(workout)

  //display the marker

  const popupSettings = {
   maxWidth: 250,
   minWidth: 100,
   autoClose: false,
   closeOnClick: false,
   className: `${type}-popup`,
  }
  L.marker([lat, lng])
   .addTo(this.#map)
   .bindPopup(L.popup(popupSettings))
   .setPopupContent(`${type}`)
   .openPopup()
 }
}

const app = new App()

//Constursture method is called impideanlty
