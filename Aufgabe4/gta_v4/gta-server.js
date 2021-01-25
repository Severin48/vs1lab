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


var app;
app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

// Setze ejs als View Engine
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

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
function GeoTag (latitude, longitude, name, hashtag, id){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;
    this.id = id


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

let pageCounter = 1;
let currentPage = 1;

let InMemory = (function (){
    let tagList = [];
    let id = 0;
    let pg = currentPage;


    return {
        searchRadius: function (latitude, longitude, radius) {
            let matchRadius = tagList.filter(function (entry) {
                return (
                    (Math.abs(entry.latitude - latitude) <= radius) &&
                    (Math.abs(entry.longitude - longitude) <= radius)
                );
            });
            return matchRadius;
        },

        searchTerm: function (term) {
            return tagList.filter(function (entry) {

                   return entry.name.includes(term)|| entry.hashtag.includes(term)

            });

        },

        searchId: function(id){
            return tagList.filter(GeoTag => GeoTag.id == id);
        },

        add: function (tag) {
            tag.id = id++;
            tagList.push(tag);
            // if(tagList.length > 5*pageCounter) {
            //     pageCounter++;
            // }
            refreshPartTags();
        },

        getTagList: function() {
            return tagList;
        },

        delete: function (GeoTag) {
            tagList.splice(tagList.indexOf(GeoTag), 1);
            // if(tagList.length < 5*pageCounter) {
            //     pageCounter--;
            // }
            refreshPartTags();
            //tagList.splice(GeoTag.getCurrentPosition(), 1);
        }
    }
})();



let someTags = InMemory.getTagList().slice(getCurrentPage(), getCurrentPage()+5);

function refreshPartTags() {
    pageCounter = Math.floor(InMemory.getTagList().length / 5);
    if (InMemory.getTagList().length % 5 > 0) {
        pageCounter++;
    }
    someTags = InMemory.getTagList().slice(getCurrentPage(), getCurrentPage()+5);
}

function getCurrentPage() {
    return currentPage;
}

function nextPage() {
    if (currentPage < pageCounter) {
        currentPage++;
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
    }
}


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
    console.log("Current Page: " + getCurrentPage())
    res.render('gta', {
        taglist: InMemory.getTagList(),
        lat: lat,
        long: long,
        datatags: JSON.stringify(InMemory.searchRadius(lat,long,5)),
        nrOfTags: InMemory.getTagList().length,
        partTags: someTags,
        page: getCurrentPage()
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
        datatags: JSON.stringify(InMemory.searchRadius(lat,long,5)),
        partTags: someTags,
        page: getCurrentPage()
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
app.post('/discovery', function(req, res) {
    var lat = req.body.hid_latitude;
    var long = req.body.hid_longitude;
    var term = req.body.discovery_search;


    if (term) {
        res.render('gta', {
            taglist: InMemory.searchTerm(term),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchTerm(term)),
            partTags: someTags,
            page: getCurrentPage()
        })
    } else {
        res.render('gta', {
            taglist: InMemory.searchRadius(lat, long, 5),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchRadius(lat, long, 5)),
            partTags: someTags,
            page: getCurrentPage()
        })
    }});

app.post('/geotags', function(req, res){
    let id = InMemory.add(req.body);

    //console.log(InMemory.getTagList());
    res.header('Location', req.url + "/" + id);
    res.status(201).json(someTags);
});

app.get('/geotags', function(req, res){
    let stdRadius = 10;
    let lat = req.query.lat;
    let lon = req.query.long;
    let term = req.query.term;

    if(term === undefined){
        res.status(200).json(InMemory.getTagList());
    } else if(term === ""){
        res.status(200).json(InMemory.getTagList());
    } else {
        //res.status(200).json(InMemory.searchTerm(term));
        res.status(200).json(someTags);
    }
});

app.get('/geotags/previous', function(req, res){
    prevPage();
    refreshPartTags();
    console.log("Current Page(previous): "+getCurrentPage());
    res.render('gta', {
        page: getCurrentPage()
    });
    res.status(200).json(someTags);
});

app.get('/geotags/next', function(req, res){
    nextPage();
    refreshPartTags();
    console.log("Current Page(next): "+getCurrentPage());
    res.render('gta', {
        page: getCurrentPage()
    });
    res.status(200).json(someTags);
});

app.get('/geotags/first', function(req, res){
    refreshPartTags();
    console.log("Current Page(first): "+getCurrentPage());
    res.render('gta', {
        page: getCurrentPage()
    });
    res.status(200).json(someTags);
});

app.get('/geotags/second', function(req, res){
    nextPage();
    refreshPartTags();
    console.log("Current Page(second): "+getCurrentPage());
    res.render('gta', {
        page: getCurrentPage()
    });
    res.status(200).json(someTags);
});

app.get('/geotags/third', function(req, res){
    nextPage();
    nextPage();
    refreshPartTags();
    console.log("Current Page(third): "+getCurrentPage());
    res.render('gta', {
        page: getCurrentPage()
    });
    res.status(200).json(someTags);
});

app.get('/geotags/:id',function(req, res){
    let id = req.params.id;
    res.status(200).json(InMemory.searchId(id)[0]);
});

app.put('/geotags/:id',function(req, res){
    let tag = InMemory.searchId(req.params.id)[0];
    tag.latitude = req.body.latitude ? req.body.latitude : tag.latitude;
    tag.longitude = req.body.longitude ? req.body.longitude : tag.longitude;
    tag.name = req.body.name ? req.body.name : tag.name;
    tag.hashtag = req.body.hashtag ? req.body.hashtag : tag.hashtag;
    tag.id = req.params.id;
    res.status(201).json(tag);
});

app.delete('/geotags/:id',function(req, res){
    if (InMemory.searchId(req.params.id)[0]) {
        InMemory.delete(InMemory.searchId(req.params.id)[0]);
        res.status(201).json(InMemory.getTagList());
    } else {
        res.statusCode = 404;
        res.send("ID NOT FOUND");
    }
});
/**
 * Setze Port und speichere in Express.
 */

let port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

let server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);

