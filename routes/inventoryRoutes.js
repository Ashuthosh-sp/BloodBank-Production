const express = require("express");
const {
  createInventoryController,
  getAllInventoryController,
  getDonarController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getrecentInventoryController,
} = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getAllInventoryController);

//GET recent 3 BLOOD RECORDS
router.get(
  "/get-recent-inventory",
  authMiddleware,
  getrecentInventoryController
);

//GET HOSPITAL BLOOD RECORDS
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);

//GET ALL DONARR RECORDS
router.get("/get-donar", authMiddleware, getDonarController);

//GET HOSPITAL RECORDS
router.get("/get-hospital", authMiddleware, getHospitalController);

//GET ORGANISATION RECORDS
router.get("/get-organisation", authMiddleware, getOrganisationController);

//GET hospitak RECORDS
router.get(
  "/get-organisation-for-hospital",
  authMiddleware,
  getOrganisationForHospitalController
);
module.exports = router;
