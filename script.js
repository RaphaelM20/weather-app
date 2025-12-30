const form = document.getElementById("cityForm");

async function getWeather(city) {
  try {
    if (!city) {
      console.log("Please enter a city");
      return;
    }

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=5EGF4RTP3NFBTVUA7WDAQFZSK`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Could not fetch data: ", error);
  }
}

function renderWeather(data) {
  const todayContainer = document.getElementById("today");
  const futureContainer = document.getElementById("future");

  todayContainer.innerHTML = "";
  futureContainer.innerHTML = "";

  //today
  const today = data.days[1];
  const weekday = new Date(today.datetime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const todayIcon = today.icon.replace(/\s|,/g, "").toLowerCase();
  const todayIconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${todayIcon}.png`;

  todayContainer.innerHTML = `
    <h2>${data.resolvedAddress}</h2>
    <h3>${weekday}</h3>
    <img src="${todayIconUrl}" alt="${today.conditions}">
    <p><strong>${today.temp}°F</strong></p>
    <p>${today.description}</p>
    `;

  //future
  for (i = 2; i <= 6; i++) {
    const day = data.days[i];
    const weekday = new Date(day.datetime).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    const iconName = day.icon.replace(/\s|,/g, "").toLowerCase();
    const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${iconName}.png`;

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("weather-day");
    dayDiv.innerHTML = `
        <p><strong>${weekday}</strong></p> 
        <p>${day.description}</p>
        <p>${day.temp}°F</p>
        <img src="${iconUrl}" alt="${day.conditions}">
    `;
    futureContainer.appendChild(dayDiv);
  }
  document.getElementById("forecast-wrapper").style.display = "flex";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = document.getElementById("weather-city").value.trim();
  const cityData = await getWeather(city);
  renderWeather(cityData);
});
