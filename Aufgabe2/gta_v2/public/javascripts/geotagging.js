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
//GEOLOCATIONAPI = navigator.geolocation;

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
    //var apiKey = 3Mu8HWGAKCg0huZfoLbeEcbeGjAkB76G;

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
            // TODO Hier Inhalt der Funktion "update" ergänzen
            //geoLocationApi.getCurrentPosition(getLatitude)
            let coords = tryLocate(function () {
                let longTag2 = document.querySelector("#longitude_geotag").value;
                let latTag2 = document.querySelector("#latitude_geotag").value;
                console.log(longTag2, latTag2);
                         // console.log(getLongitude(longTag2, latTag2));
                        /*  var longTag = document.getElementById("longitude_geotag").value;
                            var latTag = document.getElementById("latitude_geotag").value;
                            console.log(longTag, latTag);
                            var longDis = document.getElementById("hidden_longitude").value;
                            var latDis = document.getElementById("hidden_latitude");*/
                document.getElementById("hidden_latitude").value = latTag2;
                document.getElementById("hidden_longitude").value = longTag2;
                var longDis = document.getElementById("hidden_longitude").value;
                var latDis = document.getElementById("hidden_latitude").value;
                console.log(longDis,latDis);
                //hier latitude und longitude Eingabefelder des Tagging-Formulars und des Discovery-Formulars
                // (versteckte Eingabefelder) suchen und in deren value-Attribute Koordinaten schreiben.
            }, onerror);
            if (onerror != null ) {
                alert(onerror);
            }
            //let coords = tryLocate.coords.latitude
            //var coords = GEOLOCATIONAPI.getCurrentPosition()
            // var longitude = tryLocate.coords.longitude

            //console.log(latitude)

            console.log(coords)
            // console.log(longitude)

        }

    }; // ... Ende öffentlicher Teil
})(GEOLOCATIONAPI);

/**
 * $(function(){...}) wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(function() {
    alert("Please change the script 'geotagging.js'");
    // TODO Hier den Aufruf für updateLocation einfügen
    document.getElementById("submit_geotag").onclick = function (event){
        alert('WUHU');
        gtaLocator.updateLocation();
    }
    /*$(".submit_geotag").click( gtaLocator.updateLocation());
    document.getElementById("submit_geotag").onclick = displayCoords();
    function displayCoords() {
        gtaLocator.updateLocation();
    }*/
});