const fs = require("fs");
const express = require("express")
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// app.use(express.static ));


const port = 3000;
var restaurantData;
let popularRestaurants = [];
let newRestaurants = [];
let nearbyRestaurants = [];
let restaurantWithinRange = [];


// reading from restaurantsData.json
fs.readFile('restaurantsData.json',(err, data)=>{
    if(err) {
        console.log(err);
    }else{
        restaurantData = JSON.parse(data);
    }
});

// comparator function for Sorting Dates
function dateCompare(a, b){
    const aDate =  new Date(a.launch_date);
    const bDate =  new Date(b.launch_date);
    return bDate - aDate;
}

// comparator function for Sort according to popularity
function popularityCompare(a, b){
    return b.popularity - a.popularity;
}

// comparator function for Sorting according to distance
function distanceCompare(a, b){
    
}

app.get('/discovery', (req, res)=>{
    const lat = req.query.lat;
    const lon = req.query.lon;
    restaurantData.restaurants.forEach((data)=>{
        const userlon = data.location[0];
        const userlat = data.location[1];
        const actualDistance = Math.sqrt(Math.pow(userlon-lon,2)+Math.pow(userlat-lat, 2))*111;
        const distance = Math.round(actualDistance * 100) / 100;
        if(distance<1.5)
            restaurantWithinRange.push(data);
    });
    restaurantWithinRange.sort(popularityCompare);
    for(let i = 0;i<10 && i<restaurantWithinRange.length;i++){
        popularRestaurants.push(restaurantWithinRange[i]);
    }
    restaurantWithinRange.sort(dateCompare);
    for(let i = 0;i<10 && i<restaurantWithinRange.length;i++){
        newRestaurants.push(restaurantWithinRange[i]);
    }
    restaurantWithinRange.sort((a,b)=>{
        const distance1 = Math.round((Math.sqrt(Math.pow(a.location[0]-lon,2)+Math.pow(a.location[1]-lat, 2))*111) * 100) / 100;
        const distance2 = Math.round((Math.sqrt(Math.pow(b.location[0]-lon,2)+Math.pow(b.location[1]-lat, 2))*111) * 100) / 100;
        return distance1-distance2;
    });
    for(let i = 0;i<10 && i<restaurantWithinRange.length;i++){
        nearbyRestaurants.push(restaurantWithinRange[i]);
    }
    
    fs.readFile('discovery_page.json', 'utf8', (err, data)=>{
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.sections[0].restaurants = popularRestaurants;
        obj.sections[1].restaurants = newRestaurants;
        obj.sections[2].restaurants = nearbyRestaurants;
        json = JSON.stringify(obj);
        fs.writeFile('discovery_page.json',json,'utf8',(err)=>{
            if(err) console.log(err);
            else console.log("Added Successfully");
        });
    }});
    nearbyRestaurants.forEach(data=>{
        const userlon = data.location[0];
        const userlat = data.location[1];
        const actualDistance = Math.sqrt(Math.pow(userlon-lon,2)+Math.pow(userlat-lat, 2))*111;
        const distance = Math.round(actualDistance * 100) / 100;
        console.log(distance);
    })
    res.sendFile(__dirname+'/discovery_page.json');
});
app.get('/', (req, res)=>{
    res.send("Hello World");
});


app.listen(port, () =>{
    console.log("Port started listening at 3000");
});