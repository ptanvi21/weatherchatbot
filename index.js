require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>Weather Bot</h1>')
});

app.get('/user', (req, res) => {
  res.send('Got a POST request')
  console.log("Post")
})

app.post('/webhook',function(req,res){
  var request = require('request');
  var city = req.body.queryResult.parameters.city;
  var dateString = req.body.queryResult.parameters.date;
  var date = new Date(dateString);
  var month = date.getMonth();
  var day = date.getDay();

  console.log("city:", city);
  console.log("Datestring:", dateString);
  console.log("date",date)
  console.log("Month:", month);
  console.log("Day:", day);

  console.log(process.env.WEATHER_API_KEY)

  request("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + process.env.WEATHER_API_KEY, function(error,response,body){
    if(error){
      console.log("Error!", error);
    }  
    console.log('statusCode', response && response.statusCode);
    // console.log(body);
    var obj = JSON.parse(body);
    var list = obj.list[0]; //date
    console.log("Total length:", obj.list.length);

  // for current day

    // var date = new Date(obj.list[0].dt * 1000);
    // var weather = obj.list[0].weather[0].description;
    // console.log("Month:", month);
    // console.log("Day:", day);
    // description = weather;
    // description = description + " " + date.toString();
    // res.send(JSON.stringify({"fulfillmentText": description}))


    var currDate = ' ';

    for(var i=0; i<obj.list.length; i=i+8){
      var s = "";
      var description = "Not found";
      
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
      var weather = obj.list[i].weather[0].description;
      description = weather;
      description = tempC.toFixed(2) + " degrees, " + description + " on  " + currentDate.toString();
      console.log("description", description)
      res.write(JSON.stringify({"fulfillmentText": description}))
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});