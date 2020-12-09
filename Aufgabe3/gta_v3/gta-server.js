/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */


/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
//var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');

var app;
app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

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
function GeoTag (latitude, longitude, name, hashtag ){
    this.longitude = longitude;
    this.latitude = latitude;
    this.name = name;
    this.hashtag = hashtag;

    this.getLatitude = function(){
        return this.latitude;
    };
    this.getLongitude = function(){
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
var taglist = [];
function inMemory(){
    let tag = new GeoTag(this.longitude, this.latitude, this.name, this.hashtag);
    taglist.push(tag);
}

function searchName(name){
    for (let tag in taglist){
        if (tag.name === name) {
            //found
            //return tag.longitude, tag.latitude;
            return tag;
        }
    }
}

function searchRadius(lon, lat, radius) {
    let inRadius = [];
    for (let tag in taglist){
        if ((tag.longitude <= lon + radius || tag.longitude > lon - radius) && (tag.latitude <= lat + radius || tag.latitude > lat - radius)) {
            //found
            inRadius.push(tag);
        }
    }
    return inRadius;
}

function addGeoTag(){
    let tag = new GeoTag(this.longitude, this.latitude, this.name, this.hashtag);
    taglist.push(tag);
}

function deleteGeoTag(tag){
    taglist.splice(taglist.indexOf(tag), 1);
}

var InMemory = (function(){
    var taglist = [];
    return {
        searchRadius: function (latitude, longitude, radius){
            var resultList = taglist.filter(function (entry){
                return (
                    (Math.abs(entry.getLatitude()-latitude) < radius) &&
                    (Math.abs(entry.getLongitude()-longitude) < radius)
                );
            });
            return resultList;
        },
        searchBegriff: function (suchbegriff){
            var resultList = taglist.filter(function (entry){
                return (
                    entry.getName().toString().includes(suchbegriff) || entry.getHashtag().toString().includes(suchbegriff)
                );
            });
            return resultList;
        },
        add: function (GeoTag){
            taglist.push;
        },
        delete: function (GeoTag){
            taglist.splice(GeoTag.getCurrentPosition(),1);
        }
    }
})




/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

app.get('/', function(req, res) {
    let lat = req.body.latitude;
    let long = req.body.latitude;
    res.render('gta', {
        taglist: InMemory.searchRadius(lat,long,5),
        lat:lat,
        long:long,
        datatags: JSON.stringify(InMemory.searchRadius(lat,long,5))
    });
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
app.post('tagging', function (req, res){
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let name = req.body.name;
    let hashtag = req.body.hashtag;

    InMemory.add(new GeoTag(lat,long,name,hashtag));

    res.render('gta',{
        taglist: InMemory.searchRadius(lat,long,5),
        lat: lat,
        long: long,
        datatags: JSON.stringify(InMemory.searchRadius(lat,long,5))
    });
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
    var lat = req.body.hid_lat;
    var long = req.body.hid_long;
    var term = req.body.search;

    if (term){
        res.render('gta',{
            taglist: InMemory.searchBegriff(term),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchBegriff(term))
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

