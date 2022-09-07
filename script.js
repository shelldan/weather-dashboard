// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


//weather dashboard API key: 1d060c627d59790d7956cfb8a086aaa8
var APIKey = "1d060c627d59790d7956cfb8a086aaa8";
var city;
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
var enterCityName = document.getElementById('enter-city-name')
var searchButton = document.getElementById('search-button')
var sectionEl = document.querySelector('.section')


var formSubmitHandler = function(event){
    event.preventDefault();
    
    var city = enterCityName.value.trim();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&exclude=hourly,daily" +"&appid=" + APIKey + "&units=imperial";

    //var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=1d060c627d59790d7956cfb8a086aaa8"
    
    fetch(queryURL)
    //.then(response => console.log(response))
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        console.log(data);
      
        var mainDivEl = document.createElement('div')
        mainDivEl.setAttribute('id','main-dashboard')

        var mainCityName = document.createElement('header')
        mainCityName.setAttribute('id','city-name')

        var mainTemp = document.createElement("p")
        mainTemp.setAttribute('id','temp')

        // var cityName = document.createElement('header')
        // cityName.setAttribute('id','city-name')

        // var temp =document.createElement('p')
        // temp.setAttribute('id','temp')

        // var wind = document.createElement('p')
        // wind.setAttribute('id','wind')

        // var humidity = document.createElement('p')
        // humidity.setAttribute('id','humidity')

        // var UVIndex = document.createElement('p')
        // UVIndex.setAttribute('id','uv-index')

        sectionEl.appendChild(mainDivEl)
        mainDivEl.appendChild(mainCityName)
        mainCityName.appendChild(mainTemp)
        // mainDashboard.appendChild(cityName)
        // cityName.appendChild(temp)
        // temp.appendChild(wind)
        // wind.appendChild(humidity)
        // humidity.appendChild(UVIndex)

        mainCityName.textContent = city;
        mainTemp.textContent = data.main.temp;
        // temp.textContent = data.main.temp;
        // wind.textContent = data.wind.speed;
        // humidity.textContent = data.main.humidity;
        // UVIndex.textContent = ;
    
    });



}

searchButton.addEventListener('click',formSubmitHandler)




//UV index = ultraviolet Index 