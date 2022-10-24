$(() => {
    $("#search-button").click(() => {
        showWeatherCity($("#search-input").val());
        $('#forecast').scrollLeft(0);
    })
    $("#search-input").keypress(e => {
        if (e.which == 13) 
        {
            showWeatherCity($(e.currentTarget).val());
            $('#forecast').scrollLeft(0);
        }
    });

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            showWeatherCoords(pos.coords.latitude, pos.coords.longitude)
        })
    }
})

function showWeatherCity(city) {
    showWeather("q=" + city);
}
function showWeatherCoords(lat, lon) {
    showWeather("lat=" + lat + "&lon=" + lon);
}

function showWeather(queryParam) {
    $("#background").fadeOut(400);
    $("#error").slideUp(300);
    $("#content").slideUp(400, () => {
        //Pogoda na teraz
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?" + queryParam + "&units=metric&lang=pl&APPID=e12eb41847cffd3e2d466bef17886db9",
            dataType: "json"
        }).done(data => {
            $(".icon").attr("src", "media/icons/" + data.weather[0].icon + ".png").attr("alt", data.weather[0].description);
            $(".temperature").text(Math.round(data.main.temp))
            $(".feels-like").text(Math.round(data.main.feels_like));
            $(".city").text(data.name);
            $(".country").text(data.sys.country);
            $(".time").text("Pogoda dla czasu " + new Date(data.dt * 1000).toLocaleTimeString("pl-PL"));
            $(".description").text(data.weather[0].description);
            $(".pressure").text(data.main.pressure);
            $(".humidity").text(data.main.humidity);
            $(".visibility").text(Math.round(data.visibility / 1000));
            $(".wind-speed").text(Math.round(data.wind.speed * 36) / 10);
            $(".wind-deg").text(data.wind.deg);
            $(".wind-img").css("transform", "rotate(" + data.wind.deg + "deg)");
            $(".clouds").text(data.clouds.all);
            $(".rain").text(data.rain ? data.rain["1h"] : "0");
        })

        //Pogoda na następne 5 dni
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?" + queryParam + "&units=metric&lang=pl&APPID=e12eb41847cffd3e2d466bef17886db9",
            dataType: "json"
        }).done(data => {
            $("#forecast").html(null)
            data.list.forEach(e => {
                var el = $("<div class='weather-element'></div>");

                var d = new Date(e.dt * 1000);
                var data = d.getDate() + "." + (d.getMonth() + 1).toString().padStart(2, '0') + "." + d.getFullYear();
                var godzina = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');


                el.append(
                    "<img src='media/icons/" + e.weather[0].icon + ".png' alt='" + e.weather[0].description + "'/>" +
                    "<p class='bold'>" + Math.round(e.main.temp) + "°C</p>" +
                    "<p>" + godzina + "</p>" +
                    "<p>" + data + "</p>"
                );

                $("#forecast").append(el);
            });
            $("#content").slideDown(500);
        }).fail(() => {
            $("#error").slideDown(400);
        });
    })
}