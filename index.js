const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
require("dotenv").config();

const port = process.env.PORT || 3000;

// var result = undefined;
var result = undefined;

app.post('/webhook', function (req, res) {
	// console.log('Received a post request');
	if (!req.body) {
    return res.sendStatus(400);
  }
	res.setHeader('Content-Type', 'application/json');
	// console.log('Received post request from DialogFlow');
	// console.log(req.body);
  var cityName = req.body.queryResult.parameters['city'];
  // console.log("City is : ",cityName);
  var w = getWeather(cityName);
  // console.log("w:", w)
	let response = ""; //Default response from the webhook 
	let responseObj = {
		"fulfillmentText": response,
		"fulfillmentMessages": [{
			"text": {
				"text": [w]
			}
		}],
		"source": ""
	}
	// console.log('Response to dialogflow');
	return res.json(responseObj);
})



function parseResponse(err, response, body) {
	if (err) {
		console.log('error:', err);
	}
    // var obj = JSON.parse(body);
    // var list = obj.list[0]; //date
    // console.log("Total length:", obj.list.length);

  // for current day

    // var date = new Date(obj.list[0].dt * 1000);
    // var weather = obj.list[0].weather[0].description;
    // console.log("Month:", month);
    // console.log("Day:", day);
    // description = weather;
    // description = description + " " + date.toString();
    // res.send(JSON.stringify({"fulfillmentText": description}))

    // var temperature = obj.list[i].main.temp;
    //   var tempC = temperature - 273.15;
    //   var weather = obj.list[i].weather[0].description;
    //   description = weather;
    //   description = tempC.toFixed(2) + " degrees, " + description + " on  " + currentDate.toString();
    //   console.log("description", description)
    //   res.write(JSON.stringify({"fulfillmentText": description}))

	  var obj = JSON.parse(body);
    var list = obj.list[0]; //date
    var len = obj.list.length;
    console.log("Total length:", len );

	if (obj.message === 'city not found') {
		result = 'Unable to get weather ' + obj.message;
	} else {
    var city = obj.city.name;
    console.log("City in post req:",city);
    for(var i=0; i<len; i=i+8){
      var currDate = ' ';
      var time = obj.list[i].dt_txt;
      // console.log("Time:", time);
      var nextdate = time.split(" ");
      // console.log("nextdate", nextdate[0])
      if(currDate != nextdate){
        currDate = nextdate;
        // console.log("currDate", currDate[0])
        var currentDate = currDate[0].split(',');
        // console.log("currentDate", currentDate)
      }
      var temperature = obj.list[i].main.temp;
      var tempC = temperature - 273.15;
      // console.log("temp:",tempC);
      var weather = obj.list[i].weather[0].description;
      description = weather;
      description = tempC.toFixed(2) + " degrees, " + description + " on  " + currentDate.toString();
      
      if(i==0){
        des0 = "Weather in "+ city + " for today and next 4 days is as follows: " + "\n" + description + ".\n";
      }
      else if(i==8){
        des1 = description + ".\n";
      }
      else if(i==16){
        des2 = description + ".\n";
      }
      else if(i==24){
        des3 = description + ".\n";
      }
      else if(i==32){
        des4 = description + ".\n";
      }
      // result = des0 + des1 + des2 + des3 + des4;
      // console.log("Result", result)
    }
    result = des0 + des1 + des2 + des3 + des4;
    console.log("Result", result)
    // return result;
	}
  return result;
}

function getWeather(city) {
  // console.log(process.env.WEATHER_API_KEY)
  // console.log("City in getcity", city);
  var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + process.env.WEATHER_API_KEY;
  // console.log(url);
  //parse response from url
	var req = request(url, parseResponse);
	while (result === undefined) {
    //block this code
		require('deasync').runLoopOnce();
	}
  // console.log("Result in getWeather:",result)
	return result;
}


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
  // console.log("working")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
