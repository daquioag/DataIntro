const http = require("http");
const url = require("url");

const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "compcom_compcom",
    password: "*******",
    database: "compcom_nodemysql",
});

db.connect(function (err) {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
    const sql =
        "CREATE TABLE IF NOT EXISTS patients (patientId INT(11)  NOT NULL AUTO_INCREMENT, name VARCHAR(100), dateOfBirth DATETIME, PRIMARY KEY (patientId))";
    db.query(sql, function (err, result) {
        if (err) {
            console.error("Error creating table:", err);
            // Handle the error appropriately, e.g., return an error response to the client
            return;
        }
        console.log("CONNECTED! Table exsits or was created!");
        console.log("Query result:", result);
    });
});


const server = http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url);
    const pathName = parsedUrl.pathname;

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

    if (pathName.includes("/labs/lab5/api/v1/sql") && req.method === "GET") {
        const parsedUrl = url.parse(req.url, true);
        const new_query = parsedUrl.query.query;
        // Check if the 'query' parameter is missing or empty

        if (!new_query || new_query.trim() === "") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: "Bad Request",
                    details: "Query parameter is missing or empty",
                })
            );
            return;
        }
        console.log("Executing SQL query:", new_query);

        db.query(new_query, function (err, result) {
            handleQueryError(res, err);
            console.log("Query result:", result);
            const response = JSON.stringify({
                success: true,
                message: "SQL Query processed!",
                result: result,
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(response);
        });
    } else if (pathName === "/labs/lab5/api/v1/sql" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const { query } = JSON.parse(body);
            db.query(query, function (err, result) {
                handleQueryError(res, err);
                console.log("Query result:", result);
                const response = JSON.stringify({
                    success: true,
                    message: result.message,
                    result: result,
                });
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(response);
            });
        });
    } else {
        // Handle other HTTP methods if needed
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }

    function handleQueryError(res, err) {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ error: "Internal Server Error", details: err.message })
            );
            return;
        }
    }
});
server.listen();
