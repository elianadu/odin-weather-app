import "./styles.css";

function toCelsius(temp) {
  let inF = ((temp - 32) * 5) / 9;
  return Math.round(inF * 10) / 10;
}

async function getData(location, inCelsius) {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=XKXUB424T2ZVXCJ6H9YLRS4RP`,
    );
    let data = await response.json();
    let scaledData = {
      icon0: await getWeatherIcon(data.days[0].icon),
      temp0: data.days[0].temp,
      tempFeelsLike0: data.days[0].feelslike,
      desc0: data.days[0].conditions,
    };
    for (let i = 1; i <= 4; i++) {
      scaledData[`temp${i}`] = data.days[i].temp;
      scaledData[`desc${i}`] = data.days[i].conditions;
      scaledData[`icon${i}`] = await getWeatherIcon(data.days[i].icon);
    }
    if (inCelsius) {
      for (let key in scaledData) {
        if (key.startsWith("temp")) {
          scaledData[key] = toCelsius(scaledData[key]);
        }
      }
    }
    return scaledData;
  } catch (error) {
    console.log(error);
    return "error";
  }
}

async function display() {
  let searchBar = document.querySelector(".search-bar input");
  let location = searchBar.value;
  let scaleBtn = document.querySelector(".scale-btn input");
  let inCelsius = scaleBtn.checked;
  let weatherData = await getData(location, inCelsius);

  function displayToday(temp, feelsLike, desc, message, icon) {
    let scale = inCelsius ? "C" : "F";
    let content = document.querySelector(".today");
    content.querySelector(".temp").textContent = `${temp}°${scale}`;
    content.querySelector(".feels-like").textContent = `Feels like ${feelsLike}`;
    content.querySelector(".desc").textContent = desc;
    content.querySelector(".message").textContent = message;
    content.querySelector(".icon").src = icon;
  }

  function displayFutureDay(temp, desc, icon, dayNum) {
    let content = document.querySelector(`.day-${dayNum}`);
    let scale = inCelsius ? "C" : "F";
    content.querySelector(".temp").textContent = `${temp}°${scale}`;
    content.querySelector(".desc").textContent = desc;
    content.querySelector(".icon").src = icon;

  }

  if (weatherData !== "error") {
    displayToday(weatherData.temp0, weatherData.tempFeelsLike0, weatherData.desc0, "my message", weatherData.icon0);
    for (let i = 1; i <= 4; i++) {
      displayFutureDay(weatherData[`temp${i}`], weatherData[`desc${i}`], weatherData[`icon${i}`], i);
    }
  } else {
    searchBar.setCustomValidity("Please enter a valid location");
    searchBar.reportValidity();
  }
}

async function getWeatherIcon(iconName) {
  try {
    let icon = await import(`./icons/${iconName}.png`);
    return icon.default;
  } catch (error) {
    console.log(error);
    return "data:,";
  }
}

let searchBtn = document.getElementById("submit");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  display();
});

let scaleBtn = document.querySelector(".scale-btn input");
scaleBtn.addEventListener("click", () => {
  display();
});

function displayFrontPage() {
}
