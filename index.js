const fs = require("fs");
const express = require("express")
const bodyParser = require("body-parser");
// const restaurantData = require('./restaurants');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
var restaurantData;

fs.readFile('restaurants.json',(err, data)=>{
    if(err) {
        console.log(err);
    }else{
        // console.log(JSON.parse(data));
        restaurantData = JSON.parse(data);
    }
});

app.get('/discovery', (req, res)=>{
    const lat = req.params.lat;
    const lon = req.params.lon;

});
app.get('/', (req, res)=>{
    res.send("Hello World");
});


app.listen(port, () =>{
    console.log("Port started listening at 3000");
});