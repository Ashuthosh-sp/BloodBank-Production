const express = require("express");
const { testController } = require("../controllers/testController");

//router Object
const router = express.Router();

//routes
router.get("/test", testController);
//export route
module.exports = router;
