const geo = navigator.geolocation.getCurrentPosition(setGeo);

function setGeo(geo) {
    let latitude = geo.coords.latitude;
    let longitude = geo.coords.longitude;
    modifyLink(latitude, longitude);
}

function modifyLink(latitude, longitude) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,is_day&current_weather=true&windspeed_unit=ms&forecast_days=1`;
    fetchData(url);
}

function fetchData(url) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => json['current_weather'])
        .then((currentWeather) => showWeather([currentWeather.temperature, currentWeather.windspeed]));
}

function showWeather(tempAndWind) {
    const div = document.createElement('div')
    div.innerText = `Температура: ${tempAndWind[0]} °C
    Скорость ветра: ${tempAndWind[1]} м/с`;
    document.body.appendChild(div);
}

function GetMap() {
    navigator.geolocation.getCurrentPosition(loc => {
        let latitude = loc.coords.latitude;
        let longitude = loc.coords.longitude;
        let map = new Microsoft.Maps.Map('#map', {
            credentials: 'Aj5NPRLxBnDVMP_CFT3WzHuG_ymB0LVODbCbR6gCHyT99qkLVrqNF46z9JEhla5j',
            center: new Microsoft.Maps.Location(latitude, longitude),
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            zoom: 20
        });
        let center = map.getCenter();
        let pin = new Microsoft.Maps.Pushpin(center, {
            title: "Ваше местоположение",
            subtitle: "",
            text: "",
            color: 'red',
        })
        map.entities.push(pin);
    });

}

function placePin() {

}