const fs = require("fs");
const express = require("express")
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

const port = 3000;
var restaurantData;
let popularRestaurants = [];
let newRestaurants = [];
let nearbyRestaurants = [];
let restaurantWithinRange = [];



fs.readFile('restaurantsData.json',(err, data)=>{
    if(err) {
        console.log(err);
    }else{
        restaurantData = JSON.parse(data);
        // console.log(restaurantData);
        // console.log(restaurantData.restaurants.length);

        // restaurantData.sections.restaurants.push(restaurant);
        // json = JSON.stringify(restaurantData);
        // fs.writeFile('restaurantsData.json', json, 'utf8',callback);
        // console.log(restaurantData.sections[0].restaurants);
    }
});


// sorting rule 
// “Popular Restaurants”: highest popularity value first (descending order)
// “New Restaurants”: Newest launch_date first (descending). This list has also a special rule: launch_date must be no older than 4 months.
// “Nearby Restaurants”: Closest to the given location first (ascending).


// console.log(restaurantData);

function dateCompare(a, b){
    const aDate =  new Date(a.launch_date);
    const bDate =  new Date(b.launch_date);
    return bDate - aDate;
}

app.get('/discovery', (req, res)=>{
    const lat = req.query.lat;
    const lon = req.query.lon;
    restaurantData.restaurants.forEach((data)=>{
        // console.log("lon : "+data.location[0], "lat: "+data.location[1]);
        const userlon = data.location[0];
        const userlat = data.location[1];
        // console.log(userlon, lon , userlat, lat);

        // console.log(userlon-lon, userlat-lat);
        const actualDistance = Math.sqrt(Math.pow(userlon-lon,2)+Math.pow(userlat-lat, 2))*111;
        const distance = Math.round(actualDistance * 100) / 100;
        if(distance<1.5)
            restaurantWithinRange.push(data);
        // console.log(Math.round(distance * 100) / 100);
    });
    // console.log(req.query);
    restaurantWithinRange.sort((a,b)=>{return b.popularity-a.popularity});
    // console.log(restaurantWithinRange, restaurantWithinRange.length);
    for(let i = 0;i<10 && i<restaurantWithinRange.length;i++){
        popularRestaurants.push(restaurantWithinRange[i]);
    }
    // console.log(date);
    restaurantWithinRange.sort(dateCompare);
    for(let i = 0;i<10 && i<restaurantWithinRange.length;i++){
        newRestaurants.push(restaurantWithinRange[i]);
    }
    restaurantWithinRange.sort(distanceCompare);

    fs.readFile('discovery_page.json', 'utf8', (err, data)=>{
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        // obj..push({id: 2, square:3}); //add some data
        // json = JSON.stringify(obj); //convert it back to json
        // fs.writeFile('discovery_page.json', json, 'utf8', callback); // write it back 
        obj.sections[0].restaurants = popularRestaurants;
        obj.sections[1].restaurants = newRestaurants;
        json = JSON.stringify(obj);
        fs.writeFile('discovery_page.json',json,'utf8',(err)=>{
            if(err) console.log(err);
            else console.log("Added Successfully");
        });
    }});
    res.sendFile(__dirname+'/discovery_page.json');
    restaurantWithinRange.sort()
    console.log(newRestaurants);
    res.send("Processing the response");
});
app.get('/', (req, res)=>{
    res.send("Hello World");
});


app.listen(port, () =>{
    console.log("Port started listening at 3000");
});