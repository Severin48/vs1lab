/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

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
    const tags = new Array();
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
            /*if (tag == null) {
                //geoLocationApi.getCurrentPosition(getLatitude)
                let coords = tryLocate(function () {
                    let lon = document.querySelector("#longitude_geotag").value;
                    console.log(lon);
                    let lat = document.querySelector("#latitude_geotag").value;
                    let name_geo = document.querySelector("#name_geotag").value;
                    let tag = {name: name_geo, longitude: lon, latitude: lat}
                    tags.push(tag)
                    console.log("Tag: " + tag)
                    console.log("Tags: " + tags)
                    document.getElementById("hidden_latitude").value = lat;
                    document.getElementById("hidden_longitude").value = lon;
                    let img_src = getLocationMapSrc(lat, lon, tags, 10);
                    document.getElementById("result-img").src = img_src;
                }, function () {
                    if (onerror !== null) {
                        alert(onerror)
                    }
                })
                console.log(coords)
            } else {*/
            tryLocate((position =>{
                console.log(position.coords);
                const lat = getLatitude(position);
                const lon = getLongitude(position);
                document.querySelector("#longitude_geotag").value = lon;
                document.querySelector("#latitude_geotag").value = lat;
                document.querySelector("#hidden_longitude").value = lon;
                document.querySelector("#hidden_latitude").value = lat;
                let name_tag = "current_position";
                let tag = {name: name_tag, longitude: lon, latitude: lat}
                tags.push(tag);
                console.log("Tag: " + tag);
                console.log("Tags: " + tags);
                let img_src = getLocationMapSrc(lat, lon, tags, 10);
                document.getElementById("result-img").src = img_src;
            })
            ,(msg =>{
                alert(msg);
                }))
            }


    }; // ... Ende öffentlicher Teil
})(GEOLOCATIONAPI);

/**
 * $(function(){...}) wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(function() {
    $(document).ready()
    {
        gtaLocator.updateLocation();
    }
    document.getElementById("submit_geotag").onclick = function (event){

        gtaLocator.updateLocation();
    }

});