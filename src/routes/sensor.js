const { Router } = require("express");
const { fetchSensors } = require("../controllers/sensor/fetchSensors");
const { filterSensors } = require("../controllers/sensor/filterSensors");
const router = Router();

router.use("/all", fetchSensors); //all sensors
router.use("/filters", filterSensors);

module.exports = router;
