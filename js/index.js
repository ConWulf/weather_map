
$(document).ready(function() {

    const html = $('html');
    const slider = $('#toggle');
    const overviewCard = $("#current");
    const tabContent = $(".content");
    const tabs = $(".links");
    const fiveDay = $("#fiveDay");
    const mapOptions = {
        container: 'map',
        center: [-98.49, 29.42], // starting position [lng, lat]
        zoom: 9, // starting zoom
        minZoom: 2,
        style: 'mapbox://styles/mapbox/satellite-streets-v11'
    }

    mapboxgl.accessToken = mapboxKey;
    const map = new mapboxgl.Map(mapOptions);

    const geocodeOptions = {
        accessToken: mapboxKey,
        mapboxgl: mapboxgl,
        marker: false,
        collapsed: true
    }

    const geocoder = new MapboxGeocoder(geocodeOptions);
    document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

    const marker = new mapboxgl.Marker()
        .setLngLat([-98.49, 29.42])
        .addTo(map);

    const convertTime = (unix) => {
        let milliseconds = unix * 1000;
        let dateObj = new Date(milliseconds);
        let options = {hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short"}
        return dateObj.toLocaleString("en-US", options);
    }

    const convertDate = (unix) => {
        let milliseconds = unix * 1000;
        let dateObj = new Date(milliseconds);
        let options = {weekday: "long", month: "long", day: "numeric"}
        return dateObj.toLocaleString("en-US", options);
    }

    const basicTime = (unix) => {
        let milliseconds = unix * 1000;
        let dateObj = new Date(milliseconds);
        let options = {hour: "numeric", minute: "numeric"}
        return dateObj.toLocaleString("en-US", options);
    }

    const renderCurrentWeather = (weatherObj) => {
        let {current: {temp,
            feels_like,
            weather: [{description, icon}],
            dt,
            sunrise,
            sunset
        }} = weatherObj;
        return `<div id="currentCard" class="relative p-3 rounded-lg bg-white mx-auto bg-opacity-60 max-w-2xl text-sm">
        <div class="flex flex-col">
        <h3 href="#" class="text-lg">Weather Today In Location</h3>
        <h3>as of ${convertTime(dt)}</h3>
            <div>
                <p class="right-0 top-0 absolute"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-20"></p>
                <p class="font-bold text-xl">${temp} °</p>
            </div>
            <p class="font-semibold">${description}</p>
            <p class="font-semibold">Feels Like ${feels_like}</p>
            <div class="text-xs font-medium">
                <p class="float-left mr-3">Sunset ${basicTime(sunset)}</p>
                <p>Sunrise ${basicTime(sunrise)}</p>
            </div>
        </div>
    </div>`
    }

    const renderFiveDay = (weatherObj) => {
        let html = ''
        weatherObj.daily.forEach(obj => {
            const {dt,
                temp: { max, min},
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            html += `<div>
                        <span>${convertDate(dt)}</span>
                        <span>${max}/${min}</span>
                        <span><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon"></span>
                        <span>${description}</span>
                        <span>${humidity}</span>
                        <span>${uvi}</span>
                        <span>${wind_speed}</span>
                        <span>${wind_deg}</span>
                    </div>`
        })
        return html;
    }



    const getWeather = (lat, long) => {
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
            .then(res => res.json());
    }

    getWeather(29.42, -98.49).then(data => {
        console.log(data);
        overviewCard.append(renderCurrentWeather(data));
        fiveDay.append(renderFiveDay(data))
    });

    slider.on('click', function() {
        const card = $("#currentCard");
        const sliderCheck = $('#toggle:checked');
        if (sliderCheck.length === 1) {
            html.addClass("dark");
            card.addClass("bg-opacity-30");
            card.removeClass("bg-opacity-60");
            for (const tab of tabs) {
                $(tab).addClass('bg-opacity-20')
            }
        } else {
            html.removeClass("dark");
            card.removeClass("bg-opacity-30");
            card.addClass("bg-opacity-60");
            for (const tab of tabs) {
                $(tab).removeClass('bg-opacity-20')
            }
        }


    });

    function showTabContent () {
        for (const content of tabContent) {
            $(content).addClass("hidden");
        }

        for (const tab of tabs) {
            $(tab).addClass('bg-gray-200');
            $(tab).removeClass('bg-gray-500');
        }

        for (const content of tabContent) {
            if($(content).hasClass(($(this).attr('id')))) {
                $(content).removeClass("hidden");
            }
        }

        $(this).removeClass('bg-gray-200');
        $(this).addClass('bg-gray-500');
    }

    tabs.on('click', showTabContent)

});