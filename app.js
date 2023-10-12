const http = require('http');
const url = require("url");

const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "compcom_compcom",
    password: "*******",
    database: "compcom_nodemysql"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connecting to database....");
    const sql = "CREATE TABLE IF NOT EXISTS patients (patientId INT(11), name VARCHAR(100), dateOfBirth DATETIME)"; 
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("CONNECTED! Table exsits or was created!");
    });
  });

const server = http.createServer(function (req, res) {
    
    console.log("The server received a request!");

    // Enable CORS (Cross-Origin Resource Sharing) for all routes
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        // Preflight request, respond successfully
        res.writeHead(200);
        res.end();
        return;
    }
    const parsedUrl = url.parse(req.url, true);
    const new_query = parsedUrl.query.query;
    if (req.method === "GET"){
        const parsedUrl = url.parse(req.url, true);
        const new_query = parsedUrl.query.query;

        console.log("Executing SQL query:", new_query);

        db.query(new_query, function(err, result) {
            if (err) throw err;
            console.log("Query result:", result);
            // Assuming the result is an array of rows
            const response = JSON.stringify(result);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(response);
        });
    }


});
server.listen();
