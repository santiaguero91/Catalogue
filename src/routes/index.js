const { Router } = require("express");
const router = Router();

const sensor = require("./sensor.js");

router.use("/sensors", sensor);

module.exports = router;
