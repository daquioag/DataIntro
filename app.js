const http = require('http');
const url = require("url");


const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "compcom_compcom",
    password: "*******",
    database: "compcom_nodemysql"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connecting to database....");
    const sql = "CREATE TABLE IF NOT EXISTS patients (patientId INT(11)  NOT NULL AUTO_INCREMENT, name VARCHAR(100), dateOfBirth DATETIME, PRIMARY KEY (Personid))"; 
    db.query(sql, function (err, result) {
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
    let new_query;


    if (req.method === "GET"){
        const parsedUrl = url.parse(req.url, true);
        new_query = parsedUrl.query.query;

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

    if (req.method === "POST" && new_query){

        console.log("Executing SQL query:", new_query.trim());

        db.query(new_query, function(err, result) {
            if (err) throw err;
            console.log("Query result:", result);
            // Assuming the result is an array of rows
            const response = JSON.stringify(result);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(response);
        });
    } else{
        const insertSql = "INSERT INTO patients (name, dateOfBirth) VALUES (?, ?)";
        const values = [
          ['Sara Brown', '1901-01-01'],
          ['John Smith', '1941-01-01'],
          ['Jack Ma', '1911-01-30'],
          ['Elon Musk', '1999-01-01']
        ];
        

        const sql = "INSERT INTO patients name dateOfBirth values ('Sara Brown', 1901-01-01), ('Tanner Brown', 1901-01-01),  "; 
        db.query(insertSql, values, function(err, result) {
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
