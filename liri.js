require("dotenv").config();
var request = require("request");
// console.log("Dotenv keys: ", process.env);
var keys = require("./keys.js");
var momentReq = require("moment");
momentReq().format();
var spotifyReq = require('node-spotify-api');
var axiosReq = require("axios");
var client = new spotifyReq(keys.spotifyKeys);
var fs = require("fs");
var command = process.argv[2];
var value = process.argv[3];

var getArtist = function(artist) {
     return artist.name;
};

var getConcert = function(artistName) {
     if (artistName) {
     var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=" + process.env.BAND_ID;
     axiosReq.get(queryURL)
     .then(function (response) {
          var artinfo = response.data;
          for (var i = 0; i < artinfo.length; i++) {
               console.log("----------------------------------------");
               console.log("Venue Name: ",  artinfo[i].venue.name);
               console.log("Venue Location: ", artinfo[i].venue.city, artinfo[i].venue.country);
               console.log("Date of event: ", momentReq(artinfo[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
               console.log("----------------------------------------");
          };
     })
     } else {
          console.log("LIRI doesn't know that. \n Try one of the following parameters:\n 1.spotify-this-song [song] \n 2.movie-this [movie]\n 3.concert-this [band]\n 4.do-what-it-says");
     }
};


var getMovie = function(movieName) {
     var queryURL = 'http://www.omdbapi.com/?t=' + movieName + '&apikey=' + process.env.OMDB_ID;
     axiosReq.get(queryURL)
     .then(function (response) {
          var mvinfo = response.data;
          console.log("Title:-> ", mvinfo.Title);
          console.log("Release Year:-> ", mvinfo.Year);
          console.log("IMDB Rating:-> ", mvinfo.imdbRating);
          console.log("Country:-> ", mvinfo.Country);
          console.log("Plot:-> ", mvinfo.Plot);
          console.log("Language:-> ", mvinfo.Language);
          console.log("Actors:-> ", mvinfo.Actors);
          console.log("----------------------------------------")
     });
};

var getMySong = function(songName) {
if (songName) {client.search({ type: 'track', query: songName }, function(err, data) {
     if (err) {
               return console.log('Error occurred: ' + err);
          };
     var songs = data.tracks.items;

     for(var i=0; i<songs.length; i++) {
               console.log(i);
               console.log("artist's: " + songs[i].artists.map(getArtist));
               console.log("song name: " + songs[i].name);
               console.log("preview song: " + songs[i].preview_url);
               console.log("albums: " + songs[i].album.name);
               console.log("-----------------------------------------")
          };
     });} 
     else {
          console.log("LIRI doesn't know that. \n Try one of the following parameters:\n 1.spotify-this-song [song] \n 2.movie-this [movie]\n 3.concert-this [band]\n 4.do-what-it-says");
     }
};

var watch = function(command, value) {
     switch(command) {
          case "spotify-this-song":
               getMySong(value);
               break;
          case "movie-this":
               if (value){
               getMovie(value);
               } else {
                    value = "mrnobody";
                    console.log("You should watch: " + getMovie(value));
               };
               break;
          case "concert-this":
               getConcert(value);
               break;
          case "do-what-it-says":
               fs.readFile("random.txt", "utf8", function(error, data) {
                    if (error) {
                         return console.log(error);
                    }

                    var array = data.split(",");
                    command = array[0];
                    value = array[1];
                    getMySong(value);
               });
               break;
               
          default:
          console.log("LIRI doesn't know that. \n Try one of the following parameters:\n 1.spotify-this-song [song] \n 2.movie-this [movie]\n 3.concert-this [band]\n 4.do-what-it-says");
     }
}

var runCommand = function(argOne, argTwo) {
     watch(argOne, argTwo);
};

runCommand(command, value);

// If the input is empty make the value equal "song, band name".w