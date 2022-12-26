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

let map, mapEvent

if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
  (pos) => {
   const {latitude, longitude} = pos.coords

   console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`)

   const coordinates = [latitude, longitude]

   map = L.map("map").setView(coordinates, 13)

   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
   }).addTo(map)

   L.marker(coordinates)
    .addTo(map)
    .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    .openPopup()

   map.on("click", function (mapEvt) {
    mapEvent = mapEvt
    form.classList.remove("hidden")
    inputDistance.focus()

    // const {lat, lng} = mapEvent.latlng
    // const popupSettings = {
    //  maxWidth: 250,
    //  minWidth: 100,
    //  autoClose: false,
    //  closeOnClick: false,
    //  className: "running-popup",
    // }

    // L.marker([lat, lng])
    //  .addTo(map)
    //  .bindPopup(L.popup(popupSettings))
    //  .setPopupContent("run")
    //  .openPopup()
   })
  },
  () => {
   alert("could get your location")
  }
 )
}

form.addEventListener("submit", (e) => {
 e.preventDefault()

 //clear input fields
 inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
  ""

 //display the marker
 const {lat, lng} = mapEvent.latlng
 const popupSettings = {
  maxWidth: 250,
  minWidth: 100,
  autoClose: false,
  closeOnClick: false,
  className: "running-popup",
 }
 L.marker([lat, lng])
  .addTo(map)
  .bindPopup(L.popup(popupSettings))
  .setPopupContent("run")
  .openPopup()
})

inputType.addEventListener("change", () => {
 inputElevation.closest("form__row").classList.toggle("form__row--hidden")
 inputCadence.closest("form__row").classList.toggle("form__row--hidden")
})
