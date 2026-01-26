// import "./styles.css";

function toCelsius(temp) {
  return ((temp - 32) * 5) / 9;
}

async function getData(location, inCelsius) {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=XKXUB424T2ZVXCJ6H9YLRS4RP`,
    );
    let data = await response.json();
    let scaledData = {
      icon: data.days[0].icon,
      zeroTemp: data.days[0].temp,
      zeroFeelsLikeTemp: data.days[0].feelslike,
      zeroConditions: data.days[0].conditions,
      oneTemp: data.days[1].temp,
      twoTemp: data.days[2].temp,
      threeTemp: data.days[3].temp,
      fourTemp: data.days[4].temp,
    };
    if (inCelsius) {
      for (let key of scaledData) {
        if (key.endsWith("Temp")) {
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
  let searchBar = document.querySelector(".search-bar");
  let location = searchBar.value;
  let scaleBtn = document.querySelector(".scale-btn");
  let inCelsius = scaleBtn.checked;
  let weatherData = await getData(location, inCelsius);

  if (weatherData !== "error") {
    let icon = await getWeatherIcon(weatherData.icon);
    const iconImg = document.getElementById("icon");
    if (icon !== "error") {
      console.log(icon);
      iconImg.src = icon;
    } else {
      iconImg.src = "data:,";
    }

    const temp = document.getElementById("temp");
    temp.textContent = `Temperature: ${weatherData.zeroTemp}`;

    const feelsLike = document.getElementById("feels-like");
    feelsLike.textContent = `Feels like: ${weatherData.zeroFeelsLikeTemp}`;

    const desc = document.getElementById("desc");
    desc.textContent = `Description: ${weatherData.zeroConditions}`;
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
    return "error";
  }
}

let searchBtn = document.getElementById("submit");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  display();
});
