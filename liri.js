require("dotenv").config();
var fs = require("fs")
var keys = require("./keys.js");
var axios = require("axios")
var moment = require("moment")
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var value = process.argv.slice(3).join("+");

switch (action) {
    case "spotify-this-song":
        spotifySearch(value)
        break;

    case "concert-this":
        concert(value)
        break;

    case "movie-this":
        movie(value)
        break;

    case "do-what-it-says":
        doWhatItSays()
        break;

    default:
        console.log("error")
        console.log("Please enter a valid command")
        break;
}

function spotifySearch(a) {
    spotify.search({ type: 'track', query: a, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var returnResults = [
         "songName: " + data.tracks.items[0].name,
         "spotifyLink: " + data.tracks.items[0].external_urls.spotify,
         "album: " + data.tracks.items[0].album.name,
        "artistName: " + data.tracks.items[0].artists[0].name
    ].join("\n\n")

        // console.log(returnResults);
        console.log(returnResults);
    });
}

function concert(a) {
    var artist = a;
    // console.log("jaron",artist)
    var bandsInTown = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(bandsInTown).then(function (response) {
        var dateTime = moment(response.data[0].datetime).format("LLLL")
        var showConcertData = [
            "Lineup: " + response.data[0].lineup,
            "Venue: " + response.data[0].venue.name,
            "Location: " + response.data[0].venue.region + "," + response.data[0].venue.city,
            "Date: " + dateTime,
        ].join("\n\n")
        console.log(showConcertData)
    })
}

function movie(a) {
    var movie = a;
    var omdb = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    axios.get(omdb).then(function (response) {
        // console.log(response)
        var results = [
            "Title:" + response.data.Title,
            "Year Released:" + response.data.Year,
            "IMDB Rating:" + response.data.imdbRating,
            "Rotten Tomatoes Rating:" + response.data.tomatoRating,
            "Country:" + response.data.Country,
            "Language:" + response.data.Language,
            "Plot:" + response.data.Plot,
            "Actors:" + response.data.Actors,
        ].join("\n\n")

        console.log(results)
    })

}

function doWhatItSays() {
fs.readFile("random.txt","utf8",function(error,data){
    if (error) throw error

    var dataArray =  data.split(",")
    for (var i = 0; i < dataArray.length; i++) {
     var spotifyRandom = dataArray[1]
     var concertRandom = dataArray[3]  
     var movieRandom = dataArray[5]
    }
    spotifySearch(spotifyRandom);
    // console.log("spotify",spotifyRandom)
    concert(concertRandom);
    // console.log("concert",concertRandom)
    movie(movieRandom);
    // console.log("movie",movieRandom)
})
}

