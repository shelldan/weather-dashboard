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



var APIKey = "1d060c627d59790d7956cfb8a086aaa8";
var city;
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
var enterCityName = document.getElementById('enter-city-name')
var searchButton = document.getElementById('search-button')
var sectionEl = document.querySelector('.section')
var cityListEl = document.getElementById('city-list')
var cities = [];

var formSubmitHandler = function(city){
    // event.preventDefault();
    
    // var city = enterCityName.value.trim();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&exclude=hourly,daily" +"&appid=" + APIKey + "&units=imperial";
    


    fetch(queryURL)    
    //.then(response => console.log(response))
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        console.log(data);

        sectionEl.innerHTML = ''

        //Main City 
        var mainDivEl = document.createElement('div')
        mainDivEl.setAttribute('id','main-dashboard')

        var cityHeader =document.createElement('div')
        cityHeader.setAttribute('id','city-header')

        var mainCityName = document.createElement('header')
        mainCityName.setAttribute('id','city-name')

        var mainCityWeatherIcon = document.createElement('img')
        mainCityWeatherIcon.setAttribute('id','mainWeatherIcon')

        var mainCityIcon = data.weather[0].icon

        var mainTemp = document.createElement('p')
        mainTemp.setAttribute('id','temp')

        var mainWind = document.createElement('p')
        mainWind.setAttribute('id','wind')

        var mainHumidity = document.createElement('p')
        mainHumidity.setAttribute('id','humidity')

        // var mainUVIndexDiv = document.createElement('div')
        // mainUVIndexDiv.setAttribute('id','main-uv-div')

        // var mainUVIndex = document.createElement('p')
        // mainUVIndex.setAttribute('id','uv-index')

        // var mainUVIndexValue = document.createElement('p')
        // mainUVIndexValue.setAttribute('id','uv-index-value')

        var lat = data.coord.lat
        var lon = data.coord.lon



        sectionEl.appendChild(mainDivEl)
        //mainDivEl.appendChild(mainCityName)
        mainDivEl.appendChild(cityHeader)
        mainDivEl.appendChild(mainTemp)
        mainDivEl.appendChild(mainWind)
        mainDivEl.appendChild(mainHumidity)
        // mainDivEl.appendChild(mainUVIndexDiv)

        cityHeader.appendChild(mainCityName)
        cityHeader.appendChild(mainCityWeatherIcon)

        // mainUVIndexDiv.appendChild(mainUVIndex)
        // mainUVIndexDiv.appendChild(mainUVIndexValue)

        var mainDayUnix = data.dt

        mainCityName.textContent = city + " ("+moment.unix(mainDayUnix).format('M/D/YYYY') + ") " 
        mainCityWeatherIcon.src ='http://openweathermap.org/img/wn/' + mainCityIcon + '@2x.png' 
        //data.weather[0].icon; // need to add the date and the icon
        
        mainTemp.textContent = 'Temp: ' + data.main.temp + ' °F';
        mainWind.textContent = 'Wind: ' + data.wind.speed + ' MPH'
        mainHumidity.textContent = 'Humidity: ' + data.main.humidity +' %'
        getUVIndex(lat,lon)
        get5Days(lat,lon)
        
        console.log(city)
        console.log(cities)
        var doesCityExist = cities.findIndex(function(element){
            return element===city
        }) // check the city is in the array, if it is, we don't want to add to the array
        console.log(doesCityExist)

        if(doesCityExist === -1){
            cities.push(city) //cities push (city)
            localStorage.setItem('cities',JSON.stringify(cities))

            var newCityButton = document.createElement('button')
            newCityButton.setAttribute('id','new-city-button')
            newCityButton.textContent = city
            newCityButton.addEventListener('click',function(event){
                savedCities(event)
            })

            cityListEl.appendChild(newCityButton) 
        }

        if(doesCityExist){
            cities = localStorage.getItem('cities',JSON.parse(cities))
            console.log(cities)
            
            for (var i =0; i < cities.length; i++){
                var newCityButton = document.createElement('button')
                newCityButton.setAttribute('id','new-city-button')
                newCityButton.textContent = city[i]
            }


        }
    })
    }



    function getUVIndex (lat,lon){


        var UVIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        fetch(UVIndexURL)
        .then(function(UVIndexResponse){
            return UVIndexResponse.json()
        })
        .then(function(UVIndexData){
            console.log(UVIndexData)
            let mainDivEl = document.getElementById('main-dashboard')

            var mainUVIndexDiv = document.createElement('div')
            mainUVIndexDiv.setAttribute('id','main-uv-div')
    
            var mainUVIndex = document.createElement('p')
            mainUVIndex.setAttribute('id','uv-index')
    
            var mainUVIndexValue = document.createElement('p')
            mainUVIndexValue.setAttribute('id','uv-index-value')

            mainDivEl.appendChild(mainUVIndexDiv)

            mainUVIndexDiv.appendChild(mainUVIndex)
            mainUVIndexDiv.appendChild(mainUVIndexValue)

            mainUVIndex.textContent = 'UV Index: ' 
            mainUVIndexValue.textContent = UVIndexData.value

            if(UVIndexData.value>=0 && UVIndexData.value<=4){
                mainUVIndexValue.style.background = 'green'
            } else if(UVIndexData.value>4 && UVIndexData.value<=8){
                mainUVIndexValue.style.background = 'yellow'
            } else(
                mainUVIndexValue.style.background = 'red'
            )
        })

    }

    
    function get5Days(lat,lon){
        //5-Day Forecast: Day 1, 2, 3, 4, 5 

        var fiveDayUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon + '&appid=' + APIKey + "&units=imperial"
        fetch(fiveDayUrl)
        .then(function(fiveDayResponse){
            return fiveDayResponse.json()
        })
        .then(function(fiveDayData){
            console.log(fiveDayData)


            // var header = document.getElementById('supplement-header')
            // if (header){
            //     header.innerHTML = '' //if there is header on the screen, it is already there, and remove it 
            // }

            var supplementDiv = document.createElement('div')
            supplementDiv.setAttribute('id','supplement-header')

            var fiveDayForecastHeader = document.createElement('header')
            fiveDayForecastHeader.setAttribute('id','five-day-forecast')

            sectionEl.appendChild(supplementDiv)
            supplementDiv.appendChild(fiveDayForecastHeader)

            fiveDayForecastHeader.textContent = '5-Day Forecast:'



            //Day 1 
            var supplementDiv = document.createElement('div')
            supplementDiv.setAttribute('id','supplement-dashboard')

            var dayOneDashboard = document.createElement('div')
            dayOneDashboard.setAttribute('class','day-one-dashboard') // change from id to class 

            var dayOneHeader = document.createElement('header')
            dayOneHeader.setAttribute('id','day-one')


            var dayOneWeatherIcon = document.createElement('img')
            dayOneWeatherIcon.setAttribute('id','day-one-weather-icon')
            
            var dayOneTemp = document.createElement('p')
            dayOneTemp.setAttribute('id','day-one-temp')

            var dayOneWind = document.createElement('p')
            dayOneWind.setAttribute('id','day-one-wind')

            var dayOneHumidity = document.createElement('p')
            dayOneHumidity.setAttribute('id','day-one-humidity')

            sectionEl.appendChild(supplementDiv)
            supplementDiv.appendChild(dayOneDashboard)
            dayOneDashboard.appendChild(dayOneHeader)
            dayOneDashboard.appendChild(dayOneWeatherIcon)
            dayOneDashboard.appendChild(dayOneTemp)
            dayOneDashboard.appendChild(dayOneWind)
            dayOneDashboard.appendChild(dayOneHumidity)

            var dayOneUnix = fiveDayData.list[0].dt
            var dayOneWeatherIcon = fiveDayData.list[0].weather[0].icon

            dayOneHeader.textContent = moment.unix(dayOneUnix).format('M/D/YYYY')
            var dayOneIcon = document.getElementById('day-one-weather-icon') //add img 
            dayOneIcon.src ='http://openweathermap.org/img/wn/' + dayOneWeatherIcon + '@2x.png' //add img
            dayOneTemp.textContent = 'Temp: ' + fiveDayData.list[0].main.temp + ' °F'// need to add the icon before here 
            dayOneWind.textContent = 'Wind: ' + fiveDayData.list[0].wind.speed + ' MPH'
            dayOneHumidity.textContent = 'Humidity: ' + fiveDayData.list[0].main.humidity + ' %'
            
                        
            //Day 2 

            var dayTwoDashboard = document.createElement('div')
            dayTwoDashboard.setAttribute('class','day-two-dashboard')

            var dayTwoHeader = document.createElement('header')
            dayTwoHeader.setAttribute('id','day-two')
            

            var dayTwoWeatherIcon = document.createElement('img')
            dayTwoWeatherIcon.setAttribute('id','day-two-weather-icon')

            var dayTwoTemp = document.createElement('p')
            dayTwoTemp.setAttribute('id','day-two-temp')

            var dayTwoWind = document.createElement('p')
            dayTwoWind.setAttribute('id','day-two-wind')

            var dayTwoHumidity = document.createElement('p')
            dayTwoHumidity.setAttribute('id','day-two-humidity')

            supplementDiv.appendChild(dayTwoDashboard)
            dayTwoDashboard.appendChild(dayTwoHeader)
            dayTwoDashboard.appendChild(dayTwoWeatherIcon)
            dayTwoDashboard.appendChild(dayTwoTemp)
            dayTwoDashboard.appendChild(dayTwoWind)
            dayTwoDashboard.appendChild(dayTwoHumidity)

            var dayTwoUnix = fiveDayData.list[8].dt
            var dayTwoWeatherIcon = fiveDayData.list[8].weather[0].icon

            dayTwoHeader.textContent = moment.unix(dayTwoUnix).format('M/D/YYYY')//might need to use moment to update it! 
            var dayTwoIcon = document.getElementById('day-two-weather-icon') //add img 
            dayTwoIcon.src ='http://openweathermap.org/img/wn/' + dayTwoWeatherIcon + '@2x.png' //add img
            dayTwoTemp.textContent = 'Temp: ' + fiveDayData.list[8].main.temp + ' °F'// need to add the icon before here 
            dayTwoWind.textContent = 'Wind: ' + fiveDayData.list[8].wind.speed + ' MPH'
            dayTwoHumidity.textContent = 'Humidity: ' + fiveDayData.list[8].main.humidity + ' %'
            
            
            //Day 3 

            var dayThreeDashboard = document.createElement('div')
            dayThreeDashboard.setAttribute('class','day-three-dashboard')

            var dayThreeHeader = document.createElement('header')
            dayThreeHeader.setAttribute('id','day-three')


            var dayThreeWeatherIcon = document.createElement('img')
            dayThreeWeatherIcon.setAttribute('id','day-three-weather-icon')

            var dayThreeTemp = document.createElement('p')
            dayThreeTemp.setAttribute('id','day-three-temp')

            var dayThreeWind = document.createElement('p')
            dayThreeWind.setAttribute('id','day-three-wind')

            var dayThreeHumidity = document.createElement('p')
            dayThreeHumidity.setAttribute('id','day-three-humidity')

            supplementDiv.appendChild(dayThreeDashboard)
            dayThreeDashboard.appendChild(dayThreeHeader)
            dayThreeDashboard.appendChild(dayThreeWeatherIcon)
            dayThreeDashboard.appendChild(dayThreeTemp)
            dayThreeDashboard.appendChild(dayThreeWind)
            dayThreeDashboard.appendChild(dayThreeHumidity)

            var dayThreeUnix = fiveDayData.list[16].dt
            var dayThreeWeatherIcon = fiveDayData.list[16].weather[0].icon

            dayThreeHeader.textContent = moment.unix(dayThreeUnix).format('M/D/YYYY')//might need to use moment to update it! 
            var dayThreeIcon = document.getElementById('day-three-weather-icon') //add img 
            dayThreeIcon.src ='http://openweathermap.org/img/wn/' + dayThreeWeatherIcon + '@2x.png' //add img
            dayThreeTemp.textContent = 'Temp: ' + fiveDayData.list[16].main.temp + ' °F'// need to add the icon before here 
            dayThreeWind.textContent = 'Wind: ' + fiveDayData.list[16].wind.speed + ' MPH'
            dayThreeHumidity.textContent = 'Humidity: ' + fiveDayData.list[16].main.humidity + ' %'
                        

            //Day 4 

            var dayFourDashboard = document.createElement('div')
            dayFourDashboard.setAttribute('class','day-four-dashboard')

            var dayFourHeader = document.createElement('header')
            dayFourHeader.setAttribute('id','day-four')


            var dayFourWeatherIcon = document.createElement('img')
            dayFourWeatherIcon.setAttribute('id','day-four-weather-icon')

            var dayFourTemp = document.createElement('p')
            dayFourTemp.setAttribute('id','day-four-temp')

            var dayFourWind = document.createElement('p')
            dayFourWind.setAttribute('id','day-four-wind')

            var dayFourHumidity = document.createElement('p')
            dayFourHumidity.setAttribute('id','day-four-humidity')

            supplementDiv.appendChild(dayFourDashboard)
            dayFourDashboard.appendChild(dayFourHeader)
            dayFourDashboard.appendChild(dayFourWeatherIcon)
            dayFourDashboard.appendChild(dayFourTemp)
            dayFourDashboard.appendChild(dayFourWind)
            dayFourDashboard.appendChild(dayFourHumidity)

            var dayFourUnix = fiveDayData.list[24].dt
            var dayFourWeatherIcon = fiveDayData.list[24].weather[0].icon

            dayFourHeader.textContent = moment.unix(dayFourUnix).format('M/D/YYYY') //might need to use moment to update it! 
            var dayFourIcon = document.getElementById('day-four-weather-icon') //add img 
            dayFourIcon.src ='http://openweathermap.org/img/wn/' + dayFourWeatherIcon + '@2x.png' //add img
            dayFourTemp.textContent = 'Temp: ' + fiveDayData.list[24].main.temp + ' °F'// need to add the icon before here 
            dayFourWind.textContent = 'Wind: ' + fiveDayData.list[24].wind.speed + ' MPH'
            dayFourHumidity.textContent = 'Humidity: ' + fiveDayData.list[24].main.humidity + ' %'
        
            
            
            //Day 5 

            var dayFiveDashboard = document.createElement('div')
            dayFiveDashboard.setAttribute('class','day-five-dashboard')

            var dayFiveHeader = document.createElement('header')
            dayFiveHeader.setAttribute('id','day-five')


            var dayFiveWeatherIcon = document.createElement('img')
            dayFiveWeatherIcon.setAttribute('id','day-five-weather-icon')

            var dayFiveTemp = document.createElement('p')
            dayFiveTemp.setAttribute('id','day-five-temp')

            var dayFiveWind = document.createElement('p')
            dayFiveWind.setAttribute('id','day-five-wind')

            var dayFiveHumidity = document.createElement('p')
            dayFiveHumidity.setAttribute('id','day-five-humidity')

            supplementDiv.appendChild(dayFiveDashboard)
            dayFiveDashboard.appendChild(dayFiveHeader)
            dayFiveDashboard.appendChild(dayFiveWeatherIcon)
            dayFiveDashboard.appendChild(dayFiveTemp)
            dayFiveDashboard.appendChild(dayFiveWind)
            dayFiveDashboard.appendChild(dayFiveHumidity)

            var dayFiveUnix = fiveDayData.list[32].dt
            var dayFiveWeatherIcon = fiveDayData.list[32].weather[0].icon

            dayFiveHeader.textContent = moment.unix(dayFiveUnix).format('M/D/YYYY') //might need to use moment to update it! 
            var dayFiveIcon = document.getElementById('day-five-weather-icon') //add img 
            dayFiveIcon.src ='http://openweathermap.org/img/wn/' + dayFiveWeatherIcon + '@2x.png' //add img
            dayFiveTemp.textContent = 'Temp: ' + fiveDayData.list[32].main.temp + ' °F'// need to add the icon before here 
            dayFiveWind.textContent = 'Wind: ' + fiveDayData.list[32].wind.speed + ' MPH'
            dayFiveHumidity.textContent = 'Humidity: ' + fiveDayData.list[32].main.humidity + ' %'
        





        })
    }


//need to create a eventlistener
//when click the button
//it will retrieve the local storage data

//which the button the user pick 

function savedCities (event){
    console.log('click')
    console.log(event)
    console.log(event.target.textContent)
    formSubmitHandler(event.target.textContent)
    
}


searchButton.addEventListener('click',function(event){
    event.preventDefault();
    
    var city = enterCityName.value.trim().toLowerCase();
    formSubmitHandler(city)
})



//if city = blank, alert ('Please enter a Github username')



