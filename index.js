/*these file just is used to lisent the port and creat a connections, all request of tipy app.get 
must be configurate in app.js

*/

const server = require("./src/app.js");

require("dotenv").config();

server.listen(process.env.PORT, () => {
	console.log(`Listening at: http://localhost:${process.env.PORT}/`);
});
