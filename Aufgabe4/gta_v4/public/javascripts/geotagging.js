/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...
let ajax = new XMLHttpRequest();
var tagButton = document.getElementById("submit_geotag");
var disButton = document.getElementById("discovery_apply");
var nextButton = document.getElementById("nextPage");
var previousButton = document.getElementById("previousPage");
var pgButton = document.getElementById("pg_btn");

var GeoTag = function (lat, lon, name, hashtag) {
    this.latitude = lat;
    this.longitude = lon;
    this.name = name;
    this.hashtag = hashtag;
}

tagButton.addEventListener("click", function(){
    console.log("Adding")

    ajax.open("POST", "/geotags", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.responseType = "json";

    let lat = document.getElementById("latitude_geotag").value;
    let lon = document.getElementById("longitude_geotag").value;
    let name = document.getElementById("name_geotag").value;
    let hashtag = document.getElementById("hashtag_geotag").value;
    ajax.send(JSON.stringify(new GeoTag(parseFloat(lat), parseFloat(lon), name, hashtag)));

})

disButton.addEventListener("click", function(){
    console.log("Searching");
    let latURL = "?lat=" + document.getElementById("hidden_latitude").value;
    let lonURL = "&lon=" + document.getElementById("hidden_longitude").value;
    let termURL = "&term=" + document.getElementById("discovery_search").value; //DONE corrected here

    ajax.open("GET", "/geotags"+latURL+lonURL+termURL, true);
    ajax.responseType = "json";
    ajax.send(null);
})



ajax.onreadystatechange = function() {
    if(ajax.readyState == 4){
        console.log("Ready!!!");
        console.log(ajax.response);
        let resultArray = ajax.response;
        let results = "";

        resultArray.forEach(function(tag){
            results += "<li>";
            results += (tag.name+" ("+tag.latitude+", "+tag.longitude+") "+tag.hashtag);
            results += "</li>";
        });
        $("#result-img").attr("data-tags",JSON.stringify(ajax.response));
        $("#results").html(results);
        gtaLocator.updateLocation();
    }
}
previousButton.addEventListener("click", function(){
    console.log("previous");
    ajax.open("GET", "/geotags/previous", true);
    ajax.responseType = "json";
    ajax.send(null);
    previousButton.onreadystatechange = function() {
        if(ajax.readyState == 4){
            let resultArray = ajax.response;
            let results = "";

            resultArray.forEach(function(tag){
                results += "<li>";
                results += (tag.name+" ("+tag.latitude+", "+tag.longitude+") "+tag.hashtag);
                results += "</li>";
            });
            $("#result-img").attr("data-tags",JSON.stringify(ajax.response));
            $("#results").html(results);
            gtaLocator.updateLocation();
        }
    }
})
nextButton.addEventListener("click", function(){
    console.log("next");
    ajax.open("GET", "/geotags/next", true);
    ajax.responseType = "json";
    ajax.send(null);
    nextButton.onreadystatechange = function() {
        if(ajax.readyState == 4){
            let resultArray = ajax.response;
            let results = "";

            resultArray.forEach(function(tag){
                results += "<li>";
                results += (tag.name+" ("+tag.latitude+", "+tag.longitude+") "+tag.hashtag);
                results += "</li>";
            });
            $("#result-img").attr("data-tags",JSON.stringify(ajax.response));
            $("#results").html(results);
            gtaLocator.updateLocation();
        }
    }
})
pgButton.addEventListener("click", function(){
    console.log("page");
    ajax.open("GET", "/geotags/pg", true);
    ajax.responseType = "json";
    ajax.send(null);
    pgButton.onreadystatechange = function() {
        if(ajax.readyState == 4){
            let resultArray = ajax.response;
            let results = "";

            resultArray.forEach(function(tag){
                results += "<li>";
                results += (tag.name+" ("+tag.latitude+", "+tag.longitude+") "+tag.hashtag);
                results += "</li>";
            });
            $("#result-img").attr("data-tags",JSON.stringify(ajax.response));
            $("#results").html(results);
            gtaLocator.updateLocation();
        }
    }
})

//TODO: Karte wird nicht aktualisiert und Tags werden nicht angezeigt wenn Suche ohne Suchbegriff eingegeben wird

// Hier wird die verwendete API für Geolocations gewählt
// Die folgende Deklaration ist ein 'Mockup', das immer funktioniert und eine fixe Position liefert.
GEOLOCATIONAPI = {
    getCurrentPosition: function(onsuccess) {
        onsuccess({
            "coords": {
                "latitude": 49.013790,
                "longitude": 8.390071,
                "altitude": null,
                "accuracy": 39,
                "altitudeAccuracy": null,
                "heading": null,
                "speed": null
            },
            "timestamp": 1540282332239
        });
    }
};

// Die echte API ist diese.
// Falls es damit Probleme gibt, kommentieren Sie die Zeile aus.
GEOLOCATIONAPI = navigator.geolocation;

/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator(geoLocationApi) {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function(onsuccess, onerror) {
        if (geoLocationApi) {
            geoLocationApi.getCurrentPosition(onsuccess, function(error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

    // Auslesen Breitengrad aus der Position
    var getLatitude = function(position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function(position) {
        return position.coords.longitude;
    };

    // Hier Google Maps API Key eintragen
    var apiKey = "B5aYS78xCzpTsiqpdXgnuttHp69wXiHr";

    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function(lat, lon, tags, zoom) {
        zoom = typeof zoom !== 'undefined' ? zoom : 10;

        if (apiKey === "YOUR_API_KEY_HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "&pois=You," + lat + "," + lon;
        if (tags !== undefined) tags.forEach(function(tag) {
            tagList += "|" + tag.name + "," + tag.latitude + "," + tag.longitude;
        });

        var urlString = "https://www.mapquestapi.com/staticmap/v4/getmap?key=" +
            apiKey + "&size=600,400&zoom=" + zoom + "&center=" + lat + "," + lon + "&" + tagList;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
    };

    return { // Start öffentlicher Teil des Moduls ...

        // Public Member

        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",

        updateLocation: function() {

            var updateLocationFields = function (position) {
                document.getElementById('latitude_geotag').value = getLatitude(position);
                document.getElementById('longitude_geotag').value = getLongitude(position);
                document.getElementById('hidden_latitude').value = getLatitude(position);
                document.getElementById('hidden_longitude').value = getLongitude(position);
                document.getElementById('result-img').src = getLocationMapSrc(getLatitude(position), getLongitude(position));
            };

            var showErrorMessage = function (message) {
                alert(message);
            };
            if (document.getElementById('latitude_geotag').value === '')
                tryLocate(updateLocationFields, showErrorMessage);
            else {
                const taglist_json = document.getElementById('result-img').getAttribute('data-tags');

                document.getElementById('result-img').src = getLocationMapSrc(document.getElementById('latitude_geotag').value, document.getElementById('longitude_geotag').value, JSON.parse(taglist_json));
            }
        }
    }; // ... Ende öffentlicher Teil
})(GEOLOCATIONAPI);

/**
 * $(function(){...}) wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */


$(function () {
    gtaLocator.updateLocation();
});

