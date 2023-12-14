/*these file is the principal place where the project is deployed, if is true than index.js is connect to option dev and start to use the script properties associated to npm command, those section(index.js)
just is used like place to redirect to the server localhost:PORT(for default 3001 include in .env file)

*/

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");

const server = express();

server.name = "API";

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	 res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); 
	next();
});

server.use("/", routes);

server.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || err;
	res.status(status).send(message);
});

module.exports = server;
