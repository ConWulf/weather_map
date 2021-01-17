const moment = require('moment-timezone');
$(document).ready(function () {
    const slider = [$('#toggle'), $('#nav--toggle')];
    const overviewCard = $("#current");
    const tabContent = $(".cards");
    const tabs = $(".links");
    const cardArr = [$("#fiveDay"), $("#sevenDay"), $("#hourly")];
    const menu = $('#hamburger-btn');
    const closeBtn = $('#close-overlay');
    const search = [$('#search'), $('#side-bar-search')]
    const langSelect = [$('#nav-lang-select'), $('#side-nav-select')];
    let hourlyId = 0;
    const mapOptions = {
        container: 'map',
        center: [-98.49, 29.42], // starting position [lng, lat]
        zoom: 9, // starting zoom
        minZoom: 1,
        style: 'mapbox://styles/mapbox/navigation-preview-day-v4'
    }
    mapboxgl.accessToken = mapboxKey;
    const map = new mapboxgl.Map(mapOptions);

    const marker = new mapboxgl.Marker({draggable: true})
        .setLngLat([-98.49, 29.42])
        .addTo(map);

    const convertTime = (time) => {
        let hours = parseInt(time.substr(0, time.indexOf(':')))
        if (hours === 0) return time;
        else if (hours > 12) {
            hours %= 12
            return hours + time.slice(time.indexOf(':'));
        } else return time;
    }

    const getLocalTime = (unix, tz) => {
        const milliseconds = unix * 1000;
        const date = moment.tz(milliseconds, tz).format('DD ddd ');
        let exactTime = moment.tz(milliseconds, tz).format('LTS z');
        const id = moment.tz(milliseconds, tz).format('DD');
        let time = moment.tz(milliseconds, tz).format('HH:mm');
        // exactTime = convertTime(exactTime);
        // time = convertTime(time);
        return {
            date,
            time,
            id,
            exactTime
        };
    }


    const renderCurrentWeather = (weatherObj, location) => {
        let {
            current: {
                temp,
                feels_like,
                weather: [{description, icon}],
                dt,
                sunrise,
                sunset,
            },
            timezone
        } = weatherObj;
        getLocalTime(dt, timezone);
        return `<div id="currentCard" class="current-weather-card">
            <div class="flex flex-col">
                <h3 class="text-lg w-9/12" id="location">${location}</h3>
                <h3>as of ${getLocalTime(dt, timezone).exactTime}</h3>
                <div>
                    <p class="right-0 top-0 absolute"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-20"></p>
                    <p class="font-bold text-xl">${temp} °</p>
                </div>
                <p class="font-semibold">${description}</p>
                <p class="font-semibold">Feels Like ${feels_like}</p>
                <div class="text-xs font-medium">
                    <p class="float-left mr-3">Sunset ${getLocalTime(sunset, timezone).time}</p>
                    <p>Sunrise ${getLocalTime(sunrise, timezone).time}</p>
                </div>
            </div>
        </div>`
    }

    const renderHourly = (weatherObj) => {
        let html = ''
        const {timezone} = weatherObj;
        weatherObj.hourly.forEach((obj, i) => {
            hourlyId += 1;
            const {
                dt,
                temp,
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0) {
                html += `<div class="cards-content">
                        <div class="text-sm">
                        <div class="self-center">${getLocalTime(dt, timezone).time}</div>
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
        });
        return html;
    }

    const renderFutureWeather = (weatherObj) => {
        const {daily, timezone} = weatherObj;
        let fiveDay = "";
        let sevenDay = "";
        daily.forEach((obj, i) => {
            const {
                dt,
                temp: {max, min},
                weather: [{description, icon}],
                wind_deg,
                wind_speed,
                uvi,
                humidity
            } = obj;
            if (i > 0 && i <= 5)
                fiveDay += `<div class="cards-content">
                        <div class="text-sm">
                           <div class="mr-3">${getLocalTime(dt, timezone).date}</div>
                            <div>${max}/${min} °F </div>
                            <div class=" absolute right-5 top-0 flex flex-row-reverse items-center">
                                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                                <div>${description}</div>
                            </div>
                            <button id="${getLocalTime(dt, timezone).id}" class="drop_down drop_down-btn">
                                <i class="fas fa-caret-down text-lg icon transition-transform duration-300 ease-linear"></i>
                            </button>         
                        </div>
                        <ul class="slideup ${getLocalTime(dt, timezone).id}">
                            <li class="">Humidity: ${humidity}%</li>
                            <li class="">uvi: ${uvi}</li>
                            <li class="">Wind Speed: ${wind_speed} mph</li>
                            <li class="">Wind Direction: ${wind_deg}</li>
                        </ul>
                    </div>`
            if (i > 0)
                sevenDay += `<div class="cards-content">
                        <div class="text-sm">
                           <div class="mr-3">${getLocalTime(dt, timezone).date}</div>
                            <div>${max}/${min}</div>
                            <div class=" absolute right-5 top-0 flex flex-row-reverse items-center">
                                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
                                <div>${description}</div>
                            </div>
                            <button id="${getLocalTime(dt, timezone).id}" class="drop_down drop_down-btn">
                                <i class="fas fa-caret-down text-lg transition-transform duration-300 ease-linear"></i>
                            </button>         
                        </div>
                        <ul class="slideup ${getLocalTime(dt, timezone).id}">
                            <li class="">Humidity: ${humidity}%</li>
                            <li class="">uvi: ${uvi}</li>
                            <li class="">Wind Speed: ${wind_speed} mph</li>
                            <li class="">Wind Direction: ${wind_deg}</li>
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
            reverseGeocode(lng, lat).then(locationData => {
                overviewCard.html(renderCurrentWeather(weatherData, locationData));
            })
        });
    }
    init(-98.49, 29.42)

    function reverseGeocode(long, lat) {
        return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long}, ${lat}.json?access_token=${mapboxKey}`)
            .then(res => res.json())
            .then(data => {
                let locationArr = data.features[0].place_name.match(/[^,]+/g);
                if (locationArr.length === 1 || locationArr.length === 2)
                    return locationArr.join('');
                locationArr = locationArr.filter(e => {
                    if (e.trim() !== data.features[data.features.length - 1].place_name &&
                        e.trim() !== data.features[0].place_name.substring(0, data.features[0].place_name.indexOf(","))) {
                        return e
                    }
                });
                return locationArr.join(", ");
            });
    }

    marker.on('dragend', function () {
        const lng = marker.getLngLat().lng;
        const lat = marker.getLngLat().lat;
        init(lng, lat);
    });

    function toggleDarkMode() {
        const sliderCheck = $('#toggle:checked');
        console.log(sliderCheck);
        $('html').toggleClass("dark");
        $('.main-bg').toggleClass('dark-bg');
        $('.nav-geocoder .mapboxgl-ctrl-geocoder').toggleClass('dark');
        if (sliderCheck.length === 1)
            map.setStyle("mapbox://styles/mapbox/navigation-preview-night-v4");
        else
            map.setStyle("mapbox://styles/mapbox/navigation-preview-day-v4");
    }

    slider.forEach(toggle => {
        toggle.on('click', toggleDarkMode);
    });


    function showTabContent() {
        for (const content of tabContent) {
            $(content).addClass("hidden");
        }
        for (const content of tabContent) {
            if ($(content).hasClass(($(this).attr('id')))) {
                $(content).removeClass("hidden");
            }
        }
    }

    function focusTab() {
        for (const tab of tabs) {
            $(tab).removeClass('clicked');
        }
        $(this).addClass('clicked');
    }

    tabs.on('click', showTabContent);
    tabs.on('click', focusTab);

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

    menu.on('click', function () {
        const langSelect = $('.lang-select');
        $(this).children().toggleClass('bar-active bar-m--focus');
        $('#side-menu').toggleClass('-right-full right-0');
        langSelect.addClass('max-h-0');
        langSelect.removeClass('p-2 max-h-52');
    });

    closeBtn.on('click', function () {
        const langSelect = $('.lang-select')
        const dropMenu = $('#side-menu')
        closeBtn.toggleClass('hidden');
        $('#search-icon').removeClass('rotate');
        search[0].removeClass('expand');
        $('.nav-geocoder .search-placeholder').addClass('opacity-0');
        langSelect.addClass('max-h-0');
        langSelect.removeClass(' p-3 max-h-80');
        dropMenu.addClass('sm:max-h-0');
        dropMenu.removeClass('sm:max-h-80');
    });

    function placeholder() {
        if ($(this).val().length >= 1) $('.search-placeholder').addClass('hidden');
        else $('.search-placeholder').removeClass('hidden');
    }

    search.forEach(bar => {
        bar.on('input', placeholder)
    });

    search[0].on('click', function () {
        closeBtn.removeClass('hidden');
    });

    $('#nav-geocoder').hover(function () {
        $('#search-icon').addClass('rotate');
        search[0].addClass('expand');
        $('.search-placeholder').removeClass('opacity-0');
    }, function () {
        if (!search[0].is(':focus')) {
            $('#search-icon').removeClass('rotate');
            search[0].removeClass('expand');
            $('.search-placeholder').addClass('opacity-0');
        }
    });

    function langMenuExpand() {
        $('.lang-select').toggleClass('max-h-0 max-h-80 p-3');
        $('#side-menu').toggleClass('sm:max-h-0 sm:max-h-80');
    }

    langSelect.forEach(btn => {
        btn.on('click', langMenuExpand);
    });

    langSelect[0].on('click', function () {
        closeBtn.removeClass('hidden');
    });

// fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/dal.json?&access_token=${mapboxKey}`).then(res => res.json().then(console.log));
});