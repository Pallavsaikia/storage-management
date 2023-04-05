// const https = require('https');
const http = require('http');
const fs = require('fs');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || 3000;
// const server = https.createServer({
//     key: fs.readFileSync('key.pem'),
//     cert:fs.readFileSync('cert.pem')
// },app);


const server = http.createServer(app);

server.listen(port);
