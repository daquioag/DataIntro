const http = require("http");
const url = require("url");
const mysql = require("mysql");
const query_result = "Query result:"

// Define all hard-coded strings and constants
const STRINGS = {
    DATABASE_ERROR: "Error connecting to the database:",
    DATABASE_CONNECTED: "Connected to the database",
    TABLE_CREATION_ERROR: "Error creating table:",
    TABLE_EXISTS_OR_CREATED: "CONNECTED! Table exists or was created!",
    EXECUTING_SQL: "Executing SQL query:",
    SQL_ERROR: "Error executing SQL query:"
};

const ERROR_BAD_REQUEST = {
    error: "Bad Request",
    details: "Query parameter is missing or empty"
};

const ERROR_METHOD_NOT_ALLOWED = {
    error: "Method Not Allowed"
};

const ERROR_INTERNAL_SERVER = STRINGS.SQL_ERROR;
const SQL_PATIENTS_TABLE = "CREATE TABLE IF NOT EXISTS patients (patientId INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100), dateOfBirth DATETIME, PRIMARY KEY (patientId))";
const MESSAGE_SQL_PROCESSED = "SQL Query processed!";

const db = mysql.createConnection({
    host: "localhost",
    user: "compcom_compcom",
    password: "*******", 
    database: "compcom_nodemysql",
});

db.connect(function (err) {
    if (err) {
        console.error(STRINGS.DATABASE_ERROR, err);
        return;
    }
    console.log(STRINGS.DATABASE_CONNECTED);
    
    db.query(SQL_PATIENTS_TABLE, function (err, result) {
        if (err) {
            console.error(STRINGS.TABLE_CREATION_ERROR, err);
            // Handle the error appropriately, e.g., return an error response to the client
            return;
        }
        console.log(STRINGS.TABLE_EXISTS_OR_CREATED);
        console.log(query_result, result);
    });
});

const server = http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url);
    const pathName = parsedUrl.pathname;
    const query_result = "Query result:"

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
            res.end(JSON.stringify(ERROR_BAD_REQUEST));
            return;
        }

        console.log(STRINGS.EXECUTING_SQL, new_query);
        db.query(new_query, function (err, result) {
            handleQueryError(res, err);
            console.log(query_result, result);
            const response = JSON.stringify({
                success: true,
                message: MESSAGE_SQL_PROCESSED,
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
                console.log(query_result, result);
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
        res.end(JSON.stringify(ERROR_METHOD_NOT_ALLOWED));
    }

    function handleQueryError(res, err) {
        if (err) {
            console.error(STRINGS.SQL_ERROR, err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: ERROR_INTERNAL_SERVER, details: err.message }));
            return;
        }
    }
});

server.listen();
