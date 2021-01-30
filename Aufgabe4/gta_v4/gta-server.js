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
// var credentials = require("./credentials.js");
// var cookies = require('cookie-parser');


var app;
app = express(); //npm install express@">=3.0.0 <4.0.0" --save
//var app = connect(); //npm install connect https://github.com/senchalabs/connect#middleware
// app.use(cookies(credentials.cookieSecret));
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

// TODO: CODE ERGÄNZEN
let InMemory = (function (){
    let tagList = [];
    let id = 0;

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

        },

        getTagList: function() {
            return tagList;
        },

        delete: function (GeoTag) {
            tagList.splice(tagList.indexOf(GeoTag), 1);
            //tagList.splice(GeoTag.getCurrentPosition(), 1);
        }
    }
})();
function Page (id){
    this.id = id;
}
let FilterList = (function (){
    let tagList = [];


    var pageCounter=1;
    let pg_array = Array(pageCounter).fill().map((x,i)=>i+1);
    let currentPage = 1;
    let searchList=[];
    let id = 0;

    var searchPage = function(id){
        var anzahl = id+1;
        if (anzahl % 5 >0 ){
            currentPage = Math.floor((anzahl / 5) +1);
        } else {
            currentPage = Math.floor(anzahl/5);
        }
        return currentPage;
    }
    return{

        add: function (tag){
            tag.id = id++;
            tagList.push(tag);
            console.log("ID: " + tag.id);

            if((tag.id) % 5 === 0 && tag.id > 4){
                pageCounter++;
                pg_array = Array(pageCounter).fill().map((x,i)=>i+1);
                //listPage.push(new Page(currentPage+1));
            }
            searchPage(tag.id);
            var endIndex = currentPage*5;
            var begIndex = endIndex-5;
            return tagList.slice(begIndex, endIndex);
        },
        next: function () {
            if (pageCounter > currentPage){
                currentPage = currentPage+1;
            }
            var endIndex = currentPage*5;
            var begIndex = endIndex-5;
            return tagList.slice(begIndex, endIndex);
        },
        previous: function(){
            if (currentPage != 1){
                currentPage = currentPage-1;
            }

            var endIndex = currentPage*5;
            var begIndex = endIndex-5;

            return tagList.slice(begIndex, endIndex);
        },
        explicit: function(page){
            var endIndex = page*5
            var begIndex = endIndex-5;
            console.log("beg Index: " + begIndex + "end Index: " + endIndex);
            return tagList.slice(begIndex, endIndex);
        },
        searchRadius: function(latitude, longitude, radius){
            let tmp = tagList.filter(function (entry) {
                return (
                    (Math.abs(entry.latitude - latitude) <= radius) &&
                    (Math.abs(entry.longitude - longitude) <= radius)
                );
            });
            searchList = tmp;
            return searchList.slice(0,5);
        },
        searchTerm: function (term) {
            let tmp = tagList.filter(function (entry) {

                return entry.name.includes(term)|| entry.hashtag.includes(term)

            });
            searchList = tmp;
            console.log("SearchList: "+searchList);
            return searchList.slice(0,5);
        },
        searchId: function(id){
            let tmp =  tagList.filter(GeoTag => GeoTag.id == id);
            searchList = tmp;
            return searchList;
        },
        searchPrevious: function(){
            if (currentPage != 1){
                currentPage = currentPage-1;
            }

            var endIndex = currentPage*5;
            var begIndex = endIndex-5;

            return searchList.slice(begIndex, endIndex);
        },
        searchNext: function(){
            if (pageCounter > currentPage){
                currentPage = currentPage+1;
            }
            var endIndex = currentPage*5;
            var begIndex = endIndex-5;
            return searchList.slice(begIndex, endIndex);
        },
        searchExplicit: function(page){
            var endIndex = page*5-1
            var begIndex = endIndex-5;
            return searchList.slice(begIndex, endIndex);
        },
        getCurrentPage: function(){
            return currentPage;
        },
        getFirstPageList: function(){
            return tagList.slice(0,5);
        },

        getPageList: function(){
            return pg_array;
        },
        delete: function (GeoTag) {
            tagList.splice(tagList.indexOf(GeoTag), 1);
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
    let numbers = FilterList.getPageList();

    res.render('gta', {
        taglist: FilterList.getFirstPageList(),
        lat: lat,
        long: long,
        datatags: JSON.stringify(FilterList.searchRadius(lat,long,5)),
        //page: FilterList.getCurrentPage(),
        pagesList: numbers

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
app.post('/discovery', function(req, res) {
    var lat = req.body.hid_latitude;
    var long = req.body.hid_longitude;
    var term = req.body.discovery_search;


    if (term) {
        res.render('gta', {
            taglist: InMemory.searchTerm(term),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchTerm(term))
        })
    } else {
        res.render('gta', {
            taglist: InMemory.searchRadius(lat, long, 5),
            lat: lat,
            long: long,
            datatags: JSON.stringify(InMemory.searchRadius(lat, long, 5))
        })
    }});

app.post('/geotags', function(req, res){
    let id = FilterList.add(req.body);
    console.log("Pagarray:" + FilterList.getPageList());
    //res.header('Location', req.url + "/" + id);
    res.status(201).json({
        id,
        pagesList: FilterList.getPageList()
    })

});

app.get('/geotags', function(req, res){
    let stdRadius = 10;
    let lat = req.query.lat;
    let lon = req.query.long;
    let term = req.query.term;
    let id = FilterList.getFirstPageList();

    if(term === undefined){
        res.status(200).json({
            id,
            page: FilterList.getCurrentPage(),
            pagesList: FilterList.getPageList()
        });
    } else if(term === ""){
        res.status(200).json({
            id,
            page: FilterList.getCurrentPage(),
            pagesList: FilterList.getPageList()
        });
    } else {
        let list = FilterList.searchTerm(term);
        console.log("listeFilter: " + list);
        res.status(200).json({
            list,
            page: FilterList.getCurrentPage(),
            pagesList: FilterList.getPageList()
        });
    }
});

app.get('/geotags/previous', function(req,res){
    let list;
    if ( req.query.term !== undefined){
        list = FilterList.searchPrevious();
    }else {
        list =  FilterList.previous();
    }
    res.status(200).json(
        {
            list,
            page:FilterList.getCurrentPage(),
            pagesList:FilterList.getPageList()
        }
    )
});

app.get('/geotags/next', function(req,res){
    let list;
    if ( req.query.term !== undefined){
        list = FilterList.searchNext();
    }else {
        list =  FilterList.next();
    }
    res.status(200).json({
        list,
        page:FilterList.getCurrentPage(),
        pagesList:FilterList.getPageList()
    })
});

app.get('/geotags/pg', function(req,res){
    var page =req.query.pageNumber;
    console.log("page: " + page);
    let list;
    if ( req.query.term !== undefined){
        list = FilterList.searchExplicit();
    }else {
        list =  FilterList.explicit(page);
    }

    res.status(200).json(
        {
            list,
            page: FilterList.getCurrentPage(),
            pagesList: FilterList.getPageList()
        }
    )
});

app.get('/geotags/:id',function(req, res){
    let id = req.params.id;
    res.status(200).json(FilterList.searchId(id)[0]);
});

app.put('/geotags/:id',function(req, res){
    let tag = FilterList.searchId(req.params.id)[0];
    tag.latitude = req.body.latitude ? req.body.latitude : tag.latitude;
    tag.longitude = req.body.longitude ? req.body.longitude : tag.longitude;
    tag.name = req.body.name ? req.body.name : tag.name;
    tag.hashtag = req.body.hashtag ? req.body.hashtag : tag.hashtag;
    tag.id = req.params.id;
    res.status(201).json(tag);
});

app.delete('/geotags/:id',function(req, res){
    if (FilterList.searchId(req.params.id)[0]) {
        FilterList.delete(FilterList.searchId(req.params.id)[0]);
        res.status(201).json(FilterList.getFirstPageList());
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