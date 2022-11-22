let APIKey = "41ca4e709252b2dfe7bd9fbf87bfdb1a";
// let APIURL = "http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"

let cityInput = document.getElementById("cityInput");
let form = document.getElementById("form");
let currentDate = document.getElementById("current-date");
let currentCity = document.querySelector("#current-city");
let currentTemp = document.getElementById("current-temp")
let currentWind = document.getElementById("current-wind")
let currentHumid = document.getElementById("current-humid")
let currentImg = document.getElementById("current-img");
let fiveDayWrapper = document.getElementById("five-day-wrapper");
let searchButtons = document.getElementById("weather-buttons");
let cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityValue = cityInput.value;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${APIKey}`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            getCoordinates(data)
            saveButtons(data);
        })
})

function getCoordinates(data) {
    let lat = data[0].lat;
    let lon = data[0].lon;

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            displayCurrentWeather(data)
            displayFiveDayWeather(data);
        })
}

function displayCurrentWeather(data) {
    console.log(data)

    currentCity.textContent = data.city.name;
    let tempinKelvin = data.list[0].main.temp;
    currentTemp.textContent = (((tempinKelvin - 273.15) * 1.8) + 32).toFixed(2);
    currentWind.textContent = data.list[0].wind.speed;
    currentHumid.textContent = data.list[0].main.humidity;
    let currentFormatedDate = data.list[0].dt_txt.split(" ")[0].split("-");
    let currentYear = currentFormatedDate[0]
    let currentMonth = currentFormatedDate[1]
    let currentDay = currentFormatedDate[2]
    currentDate.textContent = ` (${currentDay}/${currentMonth}/${currentYear})`;
    currentImg.src = `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`
}

function displayFiveDayWeather(data) {
    fiveDayWrapper.innerHTML = "";
    for (let i = 0; i < data.list.length; i = i + 8) {
        let currentFormatedDate = data.list[i].dt_txt.split(" ")[0].split("-");
        let currentYear = currentFormatedDate[0]
        let currentMonth = currentFormatedDate[1]
        let currentDay = currentFormatedDate[2]
        let tempinKelvin = data.list[0].main.temp;
        fiveDayWrapper.innerHTML += `
        <div class="five-day-card">
        <h3 class="five-day-date">(${currentDay}/${currentMonth}/${currentYear})</h3>
        <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="weather">
        <p>Temp: <span id="five-day-temp">${(((tempinKelvin - 273.15) * 1.8) + 32).toFixed(2)} </span>F</p>
        <p>Wind: <span id="five-day-temp">${data.list[i].wind.speed}</span>MPH</p>
        <p>Humidity: <span id="five-day-temp">${data.list[i].main.humidity} </span>%</p>
    </div>
        `
    }
}

function saveButtons(data) {
    console.log(data)
    let cityName = data[0].name;
    cityArray.push(cityName)
    console.log(cityArray)
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

function displayButtons() {
    if (cityArray.length > 8) {
        cityArray = cityArray.slice(0, 8)
    }
    for (let i = 0; i < cityArray.length; i++) {
        searchButtons.innerHTML += `
        <button class="weather-btn">${cityArray[i]}</button>
        `
    }

    searchButtons.addEventListener("click", function (e) {
        let cityValue = e.target.textContent

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${APIKey}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                getCoordinates(data)
            })
    })
}

displayButtons();