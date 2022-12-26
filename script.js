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

  //clear input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
   ""

  //display the marker
  const {lat, lng} = this.#mapEvent.latlng
  const popupSettings = {
   maxWidth: 250,
   minWidth: 100,
   autoClose: false,
   closeOnClick: false,
   className: "running-popup",
  }
  L.marker([lat, lng])
   .addTo(this.#map)
   .bindPopup(L.popup(popupSettings))
   .setPopupContent("run")
   .openPopup()
 }
}

const app = new App()

//Constursture method is called impideanlty
