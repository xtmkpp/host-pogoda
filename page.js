$(() => {
    $("#search-button").click((e) => {
        showWeather($(e.currentTarget).val());
    })
    $("#search-input").keypress((e) => {
        if(e.which == 13) showWeather($(e.currentTarget).val());
    });
})

function showWeather() {
    $("#background").fadeOut(400);
    $("#error").slideUp(300);
    $("#content").slideUp(400, () =>{
        //Pogoda na teraz
        var city = $("#search-input").val();
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&lang=pl&APPID=e12eb41847cffd3e2d466bef17886db9",
            dataType: "json"
        }).done((data) => {
            console.log(data);
            $('.icon').attr('src', 'media/icons/' + data.weather[0].icon + '.png').attr('alt', data.weather[0].description);
            $(".temperature").text(Math.round(data.main.temp))
            $(".feels-like").text(Math.round(data.main.feels_like));
            $(".city").text(data.name);
            $(".country").text(data.sys.country);
            $(".time").text("Pogoda dla czasu " + new Date(data.dt*1000).toLocaleTimeString("pl-PL"));
            $(".weather-title").text(data.weather[0].description);
            $(".pressure").text(data.main.pressure);
            $(".humidity").text(data.main.humidity);
            $(".visibility").text(Math.round(data.visibility/1000));
            $(".wind-speed").text(Math.round(data.wind.speed*36)/10);
            $(".wind-deg").text(data.wind.deg);
            $(".wind-img").css('transform', 'rotate('+data.wind.deg+'deg)');
            $(".clouds").text(data.clouds.all);
            $(".rain").text(data.rain ? data.rain["1h"] : "0");

            var bg;
            switch(data.weather[0].icon) {
                case "09d":
                case "09n":
                case "10d":
                case "10n":
                    bg = "rain.png";
                    break;
                case "02d":
                case "02n":
                case "03d":
                case "03n":
                case "04d":
                    bg = "cloud.png";
                case "13d":
                case "13n":
                    bg = "snow.png"
            }
        })

        //Pogoda na następne 5 dni
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&lang=pl&APPID=e12eb41847cffd3e2d466bef17886db9",
            dataType: "json"
        }).done((data) => {
            $("#forecast").html(null)
            data.list.forEach(e => {
                var el = $("<div class='weather-element'></div>");

                var d = new Date(e.dt*1000);
                var data = d.getDate()  + "." + (d.getMonth()+1).toString().padStart(2,'0') + "." + d.getFullYear();
                var godzina = d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');


                el.append("<img src='media/icons/" + e.weather[0].icon + ".png' alt='" + e.weather[0].description + "'/>"+
                            "<p class='bold'>" + Math.round(e.main.temp) + "°C</p>"+
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