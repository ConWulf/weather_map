
$(document).ready(function() {

    const html = $('html');
    const slider = $('#toggle');
    const overviewCard = $("#current");
    const tabContent = $(".content");
    const tabs = $(".links");
    const cardArr = [ $("#fiveDay"), $("#sevenDay"), $("#hourly")];
    let hourlyId = 0;
    const bg = $('.main-bg');
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
        const milliseconds = unix * 1000;
        const dateObj = new Date(milliseconds);
        const exactTime = {hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short"}
        const date = {weekday: "long", day: "numeric"}
        const basicTime = {hour: "numeric", minute: "numeric"}
        const id = {day: "numeric"}
        return {
            exactTime: dateObj.toLocaleString("en-US", exactTime),
            date: dateObj.toLocaleString("en-US", date),
            basicTime: dateObj.toLocaleString("en-US", basicTime),
            id: dateObj.toLocaleString("en-US", id),
        }
    }

    const renderCurrentWeather = (weatherObj, location) => {
        let {current: {temp,
            feels_like,
            weather: [{description, icon}],
            dt,
            sunrise,
            sunset
        }} = weatherObj;
        return `<div id="currentCard" class="shadow-lg relative p-3 rounded-lg bg-white mx-auto bg-opacity-30 max-w-2xl text-sm">
        <div class="flex flex-col">
        <h3 class="text-lg w-9/12" id="location">${location}</h3>
        <h3>as of ${convertTime(dt).exactTime}</h3>
            <div>
                <p class="right-0 top-0 absolute"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-20"></p>
                <p class="font-bold text-xl">${temp} °</p>
            </div>
            <p class="font-semibold">${description}</p>
            <p class="font-semibold">Feels Like ${feels_like}</p>
            <div class="text-xs font-medium">
                <p class="float-left mr-3">Sunset ${convertTime(sunset).basicTime}</p>
                <p>Sunrise ${convertTime(sunrise).basicTime}</p>
            </div>
        </div>
    </div>`
    }

    const renderHourly = (weatherObj) => {
        let html = ''
        weatherObj.hourly.forEach((obj, i) => {
            hourlyId += 1;
            const {dt,
                temp,
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0) {
                html += `<div class="relative my-2 p-2 w-full ring-2 ring-blue-600 dark:ring-gray-600 cards ${hourlyId}">
                        <div class="text-sm">
                        <div class="self-center">${convertTime(dt).basicTime}</div>
                        <div>${temp} 
                        <div class=" absolute right-5 top-0 flex flex-row-reverse items-center">
                            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                            <div>${description}</div>
                        </div>
                             <button id="${hourlyId}" class="drop_down drop_down-btn">
                                <i class="fas fa-caret-down text-lg transition-transform duration-300 ease-linear"></i>
                            </button>
                        </div>
                        </div>
                        <ul class="slideup ${hourlyId}">
                            <li class="">${humidity}</li>
                            <li class="">${uvi}</li>
                            <li class="">${wind_speed}</li>
                            <li class="">${wind_deg}</li>
                        </ul>
                    </div>`
            }
        })
        return html;
    }

    const renderFutureWeather = (weatherObj) => {
        const {daily, hourly} = weatherObj;
        let fiveDay = "";
        let sevenDay = "";
        daily.forEach((obj, i) => {
            const {dt,
                temp: { max, min},
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0 && i <= 5)
                fiveDay += `<div class="fiveDay relative p-2 w-full my-2 ring-2 ring-blue-600 dark:ring-gray-600 cards ${convertTime(dt).id}">
                        <div class="text-sm">
                           <div class="mr-3">${convertTime(dt).date}</div>
                            <div>${max}/${min} </div>
                            <div class=" absolute right-5 top-0 flex flex-row-reverse items-center">
                                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                                <div>${description}</div>
                            </div>
                            <button id="${convertTime(dt).id}" class="drop_down drop_down-btn">
                                <i class="fas fa-caret-down text-lg icon transition-transform duration-300 ease-linear"></i>
                            </button>         
                        </div>
                        <ul class="slideup ${convertTime(dt).id}">
                            <li class="">${humidity}</li>
                            <li class="">${uvi}</li>
                            <li class="">${wind_speed}</li>
                            <li class="">${wind_deg}</li>
                        </ul>
                    </div>`
            if (i > 0)
                sevenDay += `<div class="relative my-2 p-2 w-full ring-2 ring-blue-600 dark:ring-gray-600 cards">
                        <div class="text-sm">
                           <div class="mr-3">${convertTime(dt).date}</div>
                            <div>${max}/${min}</div>
                            <div class=" absolute right-5 top-0 flex flex-row-reverse items-center">
                                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                                <div>${description}</div>
                            </div>
                            <button id="${convertTime(dt).id}" class="drop_down drop_down-btn">
                                <i class="fas fa-caret-down text-lg transition-transform duration-300 ease-linear"></i>
                            </button>         
                        </div>
                        <ul class="slideup ${convertTime(dt).id}">
                            <li class="">${humidity}</li>
                            <li class="">${uvi}</li>
                            <li class="">${wind_speed}</li>
                            <li class="">${wind_deg}</li>
                        </ul>
                    </div>`
        });
        return {
            fiveDay,
            sevenDay
        }
    }

    const getWeather = (long, lat) => {
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
            .then(res => res.json());
    }

    const init = (lng, lat) => {
        getWeather(lng, lat).then(weatherData => {
            console.log(weatherData);
            cardArr.forEach(elem => {
               if (renderFutureWeather(weatherData).hasOwnProperty(elem.attr('id')))
                   elem.html(renderFutureWeather(weatherData)[elem.attr('id')]);
            });
            cardArr[2].html(renderHourly(weatherData));
            geocode(lng, lat).then(locationData => {
                overviewCard.html(renderCurrentWeather(weatherData, locationData));
            })
        });
    }
    init(-98.49, 29.42)

    function geocode(long, lat) {
       return fetch (`https://api.mapbox.com/geocoding/v5/mapbox.places/${long}, ${lat}.json?access_token=${mapboxKey}`)
           .then(res => res.json())
           .then(data => {
               console.log(data);
               let locationArr = data.features[0].place_name.match(/[^,]+/g);
               if(locationArr.length === 1 || locationArr.length === 2)
                   return locationArr.join('');
               if(locationArr[locationArr.length - 1].trim() === data.features[data.features.length -1].place_name)
                   locationArr.pop();
               else if (locationArr[0].trim() === data.features[data.features.length -1].place_name)
                   locationArr.shift();
               if (locationArr[0].trim() === data.features[0].place_name.substring(0, data.features[0].place_name.indexOf(",")))
                   locationArr.shift();

               return locationArr.join(", ");
           });
    }

    marker.on('dragend', function() {
        const lng = marker.getLngLat().lng;
        const lat = marker.getLngLat().lat;
        init(lng, lat);
    })

    slider.on('click', function() {
        const sliderCheck = $('#toggle:checked');
        if (sliderCheck.length === 1) {
            html.addClass("dark");
            bg.addClass('dark-bg');
        } else {
            html.removeClass("dark");
            bg.removeClass('dark-bg');
        }


    });

    function showTabContent () {
        for (const content of tabContent) {
            $(content).addClass("hidden");
        }
        for (const content of tabContent) {
            if($(content).hasClass(($(this).attr('id')))) {
                    $(content).removeClass("hidden");
            }
        }
    }

    tabs.on('click', showTabContent);

    function dropDown(e) {
        e.preventDefault();
        Array.from(e.data.node.children()).forEach((elem) => {
            if ($(elem).children().hasClass($(this).attr('id'))) {
                $(elem).children().toggleClass('slidedown');
                $(elem).children().toggleClass('slideup');
            }
        });
        $(this).children().toggleClass('rotate');
    }

    cardArr.forEach(el => {
        el.on('click', '.drop_down', {node: el}, dropDown);
    });

});