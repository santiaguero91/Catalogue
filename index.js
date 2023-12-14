/*these file just is used to lisent the port and creat a connections, all request of tipy app.get 
must be configurate in app.js

*/

const server = require("./src/app.js");
const { fetchSensors } = require("./src/controllers/sensor/fetchSensors.js");

require("dotenv").config();

server.listen(process.env.PORT, async () => {
    try {
        const req = {};
        const res = {
            status: (code) => ({ json: (data) => console.log(`Response with status ${code}:`, data) }),
        };

        await fetchSensors(req, res);
        console.log(`Listening at: http://localhost:${process.env.PORT}/`);
    } catch (error) {
        console.error('Error during server startup:', error);
    }
});
