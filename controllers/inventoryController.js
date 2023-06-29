const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User does not exists");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Donar cannot add inventory");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Hospital cannot add inventory");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      //total out of requested blood
      const totalOutOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBlood[0]?.total || 0;
      // In and Out calculation
      const availableQuantityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          message: `Only ${availableQuantityOfBloodGroup} ML of ${requestedBloodGroup.toUpperCase()} is available`,
          success: false,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(200).send({
      message: "Inventory created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Creating Inventory",
      success: false,
      error,
    });
  }
};

//get all blood records
const getAllInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organisation: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      message: "Inventory fetched successfully",
      success: true,
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting all Inventory",
      success: false,
      error,
    });
  }
};

//GET BLOOD DATA RECORDS of 3
const getrecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organisation: req.body.userId })
      .sort({ createdAt: -1 })
      .limit(3);
    return res.status(200).send({
      message: " Top 3 Inventory fetched successfully",
      success: true,
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting recent inventory",
      success: false,
      error,
    });
  }
};

//get hospital blood records
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      message: "Hospital Consumer records fetched successfully",
      success: true,
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting all Hospital Consumer records",
      success: false,
      error,
    });
  }
};

//Get Donar Records
const getDonarController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    const donarId = await inventoryModel.distinct("donar", { organisation });
    // console.log(donarId);
    const donar = await userModel.find({ _id: { $in: donarId } }); // $in is used to find the multiple records
    return res.status(200).send({
      message: "Donar fetched successfully",
      success: true,
      donar,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting all Donar",
      success: false,
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    }); //to get the distinct hospital id
    // console.log(hospitalId);
    //find the hospital details
    const hospital = await userModel.find({ _id: { $in: hospitalId } }); // $in is used to find the multiple records
    return res.status(200).send({
      message: "Hospital fetched successfully",
      success: true,
      hospital,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting all Hospital",
      success: false,
      error,
    });
  }
};

// get organisation records
const getOrganisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donar });
    // find organisation
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      message: "Organisation fetched successfully",
      success: true,
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting all Organisation",
      success: false,
      error,
    });
  }
};

// get organisation records for hospital
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    // find organisation
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      message: "Hospital fetched successfully",
      success: true,
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: " Error in Getting all Organisations Hospital",
      success: false,
      error,
    });
  }
};
module.exports = {
  createInventoryController,
  getAllInventoryController,
  getInventoryHospitalController,
  getDonarController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getrecentInventoryController
};
