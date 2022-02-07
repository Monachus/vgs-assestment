const express = require('express')
const app = express()
const fs = require('fs');
const request = require('axios');
const tunnel = require('tunnel');
var cors = require('cors');
const vgsArguments=process.argv.slice();
console.log("command line arguments: ", vgsArguments);

app.use(express.json())
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}))

app.post('/backend-api', api);
app.post('/echo', echo);
app.get('/', serveHome);
app.get('/index.html', serveHome);
app.get('/*', servePublicContent);


function api(req, res) {
    console.log("this should be the backend api:", req.path);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.body));
}

function echo(req, res) {
    console.log("executing echo command with arguments: ", vgsArguments);
    getData(req.body).then((echoResponse) => {
        console.log("response object", echoResponse);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(echoResponse.json));
    });
    //TODO externalize username & password from host url
    //vaultId= tntqqqjpuoh
    //not sure what the vaultId is used for.
    //https://USehGxsT3Mf7XPFp4HXpWmAJ:ff98e679-9ecf-4ab1-b261-345ed10c1fcc@tntqqqjpuoh.sandbox.verygoodproxy.com:8443/post
}

async function getData(redactedPayload) {
    console.log("arguments received for tunnel are \nusername: ",vgsArguments[2],"\npassword: ",vgsArguments[3])
    const tunnelingAgent = tunnel.httpsOverHttp({
        ca: [ fs.readFileSync(__dirname+'/ca/sandbox.pem')],
        proxy: {
            host: 'tntqqqjpuoh.SANDBOX.verygoodproxy.com',
            port: '8080',
            proxyAuth: vgsArguments[2]+':'+vgsArguments[3]
        }
      });

    return await request.post(
        'https://echo.apps.verygood.systems/post',
        JSON.stringify(redactedPayload),
        {
            httpsAgent: tunnelingAgent,
            proxy: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => {
            console.log('\nResponse from Axios request on REVEAL:');
            console.log(r.data);
            return r.data;
        });
}

function serveHome(req, res) {
    console.log("handling request with params:", req.path);
    fs.readFile(__dirname + "/public/" + "index.html", 'utf8', function (err, data) {
        res.end(data);
    });
}

function servePublicContent(req, res) {
    console.log("handling request with params:", req.path);
    fs.readFile(__dirname + "/public/" + req.path, 'utf8', function (err, data) {
        res.end(data);
    });
}

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})