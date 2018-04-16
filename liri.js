require("dotenv").config();
const keys = require("./keys.js");
const Twitter = require('twitter');
const fs = require("fs");
const Spotify = require('node-spotify-api');
const request = require("request");
var spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const action = process.argv[2];


switch (action) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        if (process.argv[3] === undefined) {
            let song = "The Sign";
            spotifyThis(song);
        } else {
            let song = process.argv.slice(3).join(' ');
            spotifyThis(song);
        }
        break;

    case "movie-this":
        if (process.argv[3] === undefined) {
            let movie = "Mr. Nobody";
            movieThis(movie);
        } else {
            let movie = process.argv.slice(3).join(' ');
            movieThis(movie);
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
};

function myTweets () {
const params = {screen_name: "lirisimm", count: '20',};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(element => {
                console.log(element.created_at);
                console.log(element.text);
                console.log("---");
                fs.appendFile("log.txt", "\n-------\n" + 
                element.created_at + "\n" +
                element.text + "\n", function(err) {
                    if(err) {
                        console.log(err);
                    } 
                    // else {
                    //     console.log("Added to log.txt");
                    // }
                });
            });
        } else {
            console.log(error);
        }
    });
}

function spotifyThis(song) {
    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }, function (err, data) {
        if (!err) {
            data.tracks.items.forEach(function (object) {
                console.log("---");
                console.log("Artist: " + object.album.artists[0].name);
                console.log("Song: " + object.name);
                console.log("Preview on Spotify: " + object.preview_url);
                console.log("Album: " + object.album.name);
                console.log("---");

                fs.appendFile("log.txt", "\n---\n" + 
                object.album.artists[0].name + "\n" +
                object.name + "\n" +
                object.preview_url + "\n" +
                object.album.name + "\n", function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Added to log.txt");
                    }
                });
            })
        } else {
            return console.log('Error: ' + err);
        }

    })
};
function movieThis(movie) {
    const queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (err, response, body) {
        if (!err) {
            let movieObject = JSON.parse(response.body);

            console.log("---")
            console.log("Movie: " + movieObject.Title);
            console.log("Release Year: " + movieObject.Year);
            console.log("Rating (IMDB): " + movieObject.Ratings[0].Value);
            console.log("Rating (Rotten Tomatoes): " + movieObject.Ratings[1].Value);
            console.log("Country: " + movieObject.Country);
            console.log("Language: " + movieObject.Language);
            console.log("Plot: " + movieObject.Plot);
            console.log("Actors: " + movieObject.Actors);
            console.log("---")


            fs.appendFile("log.txt", "\n---\n" + 
                movieObject.Title + "\n" +
                movieObject.Year + "\n" +
                movieObject.Ratings[0].Value + "\n" +
                movieObject.Ratings[1].Value + "\n" +
                movieObject.Country + "\n" +
                movieObject.Language + "\n" +
                movieObject.Plot + "\n" +
                movieObject.Actors + "\n", function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Added to log.txt");
                    }
                });

        } else {
            console.log(err);
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err)
        }
        const dataArr = data.split(",");
        const userCommand = dataArr[0];
        const action = dataArr[1];
        console.log(spotifyThis(dataArr[1]));

    })
};