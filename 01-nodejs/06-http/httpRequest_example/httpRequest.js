const http = require('http');
const url = require('url');

function getCode(host, port, path, queryString) {
    console.log("(" + host + ":" + port + path + ")" + "Running httpHelper.getCode()")

    // Construct url and query string
    const requestUrl = url.parse(url.format({
        protocol: 'http',
        hostname: host,
        pathname: path,
        port: port,
        query: queryString
    }));

    console.log("(" + host + path + ")" + "Sending GET request")
    // Send request
    console.log(url.format(requestUrl))
    http.get(url.format(requestUrl), (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            console.log("GET chunk: " + chunk);
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log("GET end of response: " + data);
        });

    }).on("error", (err) => {
        console.log("GET Error: " + err);
    });
}

const run = (function() {
    const host = 'api.github.com';
    const port = '';
    const path = '/repos/request/request';
    const queryString = '';
    getCode(host, port, path, queryString);
})();