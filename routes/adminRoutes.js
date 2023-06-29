const express = require("express");
const {
  getDonarListController,
  getHospitalListController,
  getOrgListController,
  deleteController,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
//ROUTER OBJECT
const router = express.Router();
//Routes

//GET THE DONAR LIST
router.get(
  "/donar-list",
  authMiddleware,
  adminMiddleware,
  getDonarListController
);
//GET THE HOSPITAL  LIST
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);


//GET THE ORGANISATION  LIST
router.get(
    "/org-list",
    authMiddleware,
    adminMiddleware,
    getOrgListController
  );

  // DELETE DONAR
router.delete( '/delete/:id', authMiddleware, adminMiddleware,deleteController);
//exports
module.exports = router;
