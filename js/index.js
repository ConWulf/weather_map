
$(document).ready(function() {

    const html = $('html');
    const slider = $('#toggle');
    const overviewCard = $("#current");
    const tabContent = $(".content");
    const tabs = $(".links");
    const fiveDay = $("#fiveDay");
    const sevenDay = $("#sevenDay");
    const hourly = $("#hourly");
    let clicked = false;
    const mapOptions = {
        container: 'map',
        center: [-98.49, 29.42], // starting position [lng, lat]
        zoom: 9, // starting zoom
        minZoom: 1,
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

    const marker = new mapboxgl.Marker({draggable: true})
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
        let options = {weekday: "long", day: "numeric"}
        return dateObj.toLocaleString("en-US", options);
    }

    const basicTime = (unix) => {
        let milliseconds = unix * 1000;
        let dateObj = new Date(milliseconds);
        let options = {hour: "numeric", minute: "numeric"}
        return dateObj.toLocaleString("en-US", options);
    }

    const id = (unix) => {
        let milliseconds = unix * 1000;
        let dateObj = new Date(milliseconds);
        let options = {day: "numeric"}
        return dateObj.toLocaleString("en-US", options);
    }

    const renderCurrentWeather = (weatherObj, location) => {
        let {current: {temp,
            feels_like,
            weather: [{description, icon}],
            dt,
            sunrise,
            sunset
        }} = weatherObj;
        return `<div id="currentCard" class="relative p-3 rounded-lg bg-white mx-auto bg-opacity-60 max-w-2xl text-sm">
        <div class="flex flex-col">
        <h3 href="#" class="text-lg" id="location">${location}</h3>
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
        weatherObj.daily.forEach((obj, i) => {
            const {dt,
                temp: { max, min},
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0 && i <= 5) {
                html += `<div class="five_day relative p-2 w-72 sm:m-2 flex flex-col sm:ring-2 sm:ring-blue-400">
<!--                        <span class="self-center"></span>-->
                        <div class="text-sm">
                           <span class="mr-3">${convertDate(dt)}</span>
                            <span>${max}/${min}</span>
                            <img class=" w-10 absolute right-12 top-0" src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                            <button id="${id(dt)}" class="drop_down absolute right-2 top-3 focus:outline-none focus:ring rounded-full w-3 h-3 flex items-center justify-center">
                                <i class="fas fa-caret-down "></i>
                            </button>
                            
                        </div>
                        <span class="${id(dt)}">${description}</span>
                        <span class="extra_info ${id(dt)}">${humidity}</span>
                        <span class="extra_info ${id(dt)}">${uvi}</span>
                        <span class="extra_info ${id(dt)}">${wind_speed}</span>
                        <span class="extra_info ${id(dt)}">${wind_deg}</span>
                    </div>`
            }
        })
        return html;
    }

    const renderSevenDay = (weatherObj) => {
        let html = ''
        weatherObj.daily.forEach((obj, i) => {
            const {dt,
                temp: { max, min},
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0) {
                html += `<div class="relative my-2 p-2 w-72 sm:mx-2 flex flex-col sm:ring-2 sm:ring-blue-400">
                        <span class="self-center">${convertDate(dt)}</span>
                        <span>${max}/${min} 
                            <img class=" w-16 absolute right-0 top-0" src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                            <i class="fas fa-caret-down"></i>
                        </span>
                        <span>${description}</span>
                        <span>${humidity}</span>
                        <span>${uvi}</span>
                        <span>${wind_speed}</span>
                        <span>${wind_deg}</span>
                    </div>`
            }
        })
        return html;
    }

    const renderHourly = (weatherObj) => {
        let html = ''
        weatherObj.hourly.forEach((obj, i) => {
            const {dt,
                temp,
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0) {
                html += `<div class="relative my-2 p-2 w-72 sm:mx-2 flex flex-col sm:ring-2 sm:ring-blue-400">
                        <span class="self-center">${basicTime(dt)}</span>
                        <span>${temp} 
                            <img class=" w-16 absolute right-0 top-0" src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                            <i class="fas fa-caret-down"></i>
                        </span>
                        <span>${description}</span>
                        <span>${humidity}</span>
                        <span>${uvi}</span>
                        <span>${wind_speed}</span>
                        <span>${wind_deg}</span>
                    </div>`
            }
        })
        return html;
    }

    const getWeather = (long, lat) => {
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
            .then(res => res.json());
    }

    const init = (lng, lat) => {
        getWeather(lng, lat).then(weatherData => {
            console.log(weatherData);
            fiveDay.html(renderFiveDay(weatherData));
            sevenDay.html(renderSevenDay(weatherData));
            hourly.html(renderHourly(weatherData));
            geocode(lng, lat).then(locationData => {
                overviewCard.html(renderCurrentWeather(weatherData, locationData));
            })
        });
    }
    init(-98.49, 29.42)

    function geocode(long, lat) {
       return fetch (`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},        ${lat}.json?access_token=${mapboxKey}`)
           .then(res => res.json())
           .then(data => data.features[3].place_name.slice(0, data.features[3].place_name.indexOf(',')))
    }

    marker.on('dragend', function() {
        const lng = marker.getLngLat().lng;
        const lat = marker.getLngLat().lat;
        init(lng, lat);
    })

    slider.on('click', function() {
        const card = $("#currentCard");
        const fiveDay = $('#fiveDay');
        const sliderCheck = $('#toggle:checked');
        if (sliderCheck.length === 1) {
            html.addClass("dark");
            card.addClass("bg-opacity-30");
            card.removeClass("bg-opacity-60");
            fiveDay.addClass('bg-opacity-20');
            fiveDay.removeClass('bg-opacity-60');
            for (const tab of tabs) {
                $(tab).addClass('bg-opacity-20')
            }
        } else {
            html.removeClass("dark");
            card.removeClass("bg-opacity-30");
            card.addClass("bg-opacity-60");
            fiveDay.removeClass('bg-opacity-20');
            fiveDay.addClass('bg-opacity-60');
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

    tabs.on('click', showTabContent);

    fiveDay.on('click', '.drop_down', function(e) {
        e.preventDefault();
        Array.from(fiveDay.children()).forEach((elem) => {
            if($(elem).children().hasClass($(this).attr('id'))) {
                $(elem).children().removeClass('extra_info');
            }
        })
        fiveDay.on('click', '.drop_down', function() {
            Array.from(fiveDay.children()).forEach((elem) => {
                for (const [i, el] of Array.from($(elem).children()).entries()) {
                    if (i > 1 && $(elem).children().hasClass($(this).attr('id'))) {
                        console.log(el);
                        $(el).addClass('extra_info');
                    }
                }
            });
        });
    });


});