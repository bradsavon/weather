const https = require('https');

https.get('https://api.rainviewer.com/public/weather-maps.json', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Radar Past Last:", json.radar?.past?.slice(-1));
            console.log("Satellite Infrared Last:", json.satellite?.infrared?.slice(-1));
            console.log("Host:", json.host);
        } catch (e) {
            console.error(e);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
