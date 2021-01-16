/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */


/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var credentials = require("./credentials.js");
var cookies = require('cookie-parser');


var app;
app = express();
app.use(cookies(credentials.cookieSecret));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

// Setze ejs als View Engine
app.set('view engine', 'ejs');

/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */

// TODO: CODE ERGÄNZEN
app.use(express.static(__dirname + "/public"));
/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */

// TODO: CODE ERGÄNZEN
function GeoTag (latitude, longitude, name, hashtag){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;

    this.getLat = function(){
        return this.latitude;
    };
    this.getLong = function(){
        return this.longitude;
    };
    this.getName = function(){
        return this.name;
    };
    this.getHashtag = function(){
        return this.hashtag;
    };

}
/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

// TODO: CODE ERGÄNZEN
let InMemory = (function (){
    let tagList = [];

    return {
        searchRadius: function (latitude, longitude, radius) {
            let matchRadius = tagList.filter(function (entry) {
                return (
                    (Math.abs(entry.getLat() - latitude) <= radius) &&
                    (Math.abs(entry.getLong() - longitude) <= radius)
                );
            });
            return matchRadius;
        },

        searchTerm: function (term) {
            let matchTerm = tagList.filter(function (entry) {
                return (
                    entry.getName().toString().includes(term) ||
                    entry.getHashtag().toString().includes(term)
                );
            });
            return matchTerm;
        },

        add: function (GeoTag) {
            tagList.push(GeoTag);
        },

        delete: function (GeoTag) {
            tagList.splice(GeoTag.getCurrentPosition(), 1);
        }
    }
})();


/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

// zur Erzeugung der Einstiegsseite ist vorgegeben (hier sieht man, wie mit EJS eine HTML-Seite erzeugt wird
app.get('/', function(req, res) {
    let lat = req.body.latitudeGeotag;
    let long = req.body.longitudeGeotag;
    res.render('gta', {
        taglist: [],
        lat: lat,
        long: long,
        datatags: JSON.stringify(InMemory.searchRadius(lat,long,5))

    });
    //Zugriff auf Cookies per res.cookie("name", "wert", {signed: true});
    //Dann res.send(); um Cookies zu senden
    //console.log(req.cookies);
    //console.log(req.signedCookies);
    //var val = req.signedCookies. --name vom cookie--
    //Cookie löschen: res.clearCookie(name)
});

/**
 * Route mit Pfad '/tagging' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'tag-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Mit den Formulardaten wird ein neuer Geo Tag erstellt und gespeichert.
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 */

// TODO: CODE ERGÄNZEN START
app.post('/tagging', function (req, res)  {
    let lat = req.body.latitudeGeotag;
    let long = req.body.longitudeGeotag;
    let name = req.body.name_geotag;
    let hashtag = req.body.hashtag_geotag;
    let geoTag = new GeoTag(lat,long,name,hashtag);

    InMemory.add(geoTag);
    console.log("JSON:");
    console.log(JSON.stringify(InMemory.searchRadius(lat,long,5)));



    res.render('gta',{
        taglist: InMemory.searchRadius(lat,long,5),
        lat: lat,
        long: long,
        datatags: JSON.stringify(InMemory.searchRadius(lat,long,5))
    })
});
/**
 * Route mit Pfad '/discovery' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'filter-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 * Falls 'term' vorhanden ist, wird nach Suchwort gefiltert.
 */

// TODO: CODE ERGÄNZEN
app.post('/discovery', function(req, res){
    var lat = req.body.hid_latitude;
    var long = req.body.hid_longitude;
    var term = req.body.discovery_search;


    if (term){
        res.render('gta',{
            taglist: InMemory.searchTerm(term),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchTerm(term))
        })
    } else {
        res.render('gta',{
            taglist: InMemory.searchRadius(lat,long,5),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchRadius(lat,long,5))
        })
    }

});
/**
 * Setze Port und speichere in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

var server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);

