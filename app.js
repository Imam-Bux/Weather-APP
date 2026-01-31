const temperature = document.querySelector("#temperature");
const city = document.querySelector("#city");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windspeed");
const input = document.querySelector("#input");
const alertBox = document.querySelector("#alertBox");
const weatherIcon = document.querySelector("#weather-icon");
const googleMap = document.querySelector("#google-map");
const feelsLike = document.querySelector("#feelsLike");
const uvIndex = document.querySelector("#uvIndex");
const alertText = document.querySelector("#alertText")
async function getWeatherData(event) {
    if (event) event.preventDefault();
    try {
        const cityname = input.value;
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f4ee1dd4b6f4d4aaac142934261201&q=${cityname}&aqi=no`)
        const formattedRes = await res.json()
        console.log(formattedRes)
        if (res.ok) {
            const mapCity = formattedRes.location.name;
            const mapCountry = formattedRes.location.country;
            localStorage.setItem("lastCity", formattedRes.location.name);
            googleMap.src = `https://www.google.com/maps?q=${mapCity},${mapCountry}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
            weatherIcon.src = `https:${formattedRes.current.condition.icon}`;;
            feelsLike.textContent = `${formattedRes.current.feelslike_c} ℃`
            uvIndex.textContent = formattedRes.current.uv
            temperature.textContent = `${formattedRes.current.temp_c}℃`
            city.textContent = `${formattedRes.location.name}, ${formattedRes.location.country}`
            humidity.textContent = `${formattedRes.current.humidity}%`
            windSpeed.textContent = `${formattedRes.current.wind_kph}km/h`
            input.value = ""
            alertBox.style.display = "none"
        }
        else {
            alertBox.style.display = "flex"
            input.value = ""
        }
    }
    catch (e) {
        console.log("Something Went Wrong!", e)
        alertBox.style.display = "flex"
    }
}
function boxVanish() {
    alertBox.style.display = "none"
    input.value = ""
    alertText.textContent="City not found"
}
window.addEventListener("DOMContentLoaded", () => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
        input.value = savedCity;
        getWeatherData();
    }
    else {
        input.value = "Hyderabad, Pakistan";
        getWeatherData();
    }
});
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            input.value = `${lat},${lon}`
            getWeatherData()
        }, () => {
            alertBox.style.display = "flex"
            alertText.textContent = "Location access denied. Please search manually."
        })
    }
    else {
        alertBox.style.display = "flex"
        alertText.textContent = "Geolocation is not supported by your browser."
    }

}
