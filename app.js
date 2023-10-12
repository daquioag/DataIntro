var http = require('http');


const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "compcom_compcom",
    password: "*******",
    database: "compcom_nodemysql"
});
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    db.connect(function (err){
        if (err){
            throw err;
        }
        var message = 'Connected It works!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
    });
});
server.listen();
