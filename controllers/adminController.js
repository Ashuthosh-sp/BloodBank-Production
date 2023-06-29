const userModel = require("../models/userModel");

// GET THE DONAR LIST
const getDonarListController = async (req, res) => {
  try {
    const donarData = await userModel.find({ role: "donar" }).sort({
      createdAt: -1,
    });
    return res.status(200).send({
      message: "Donar List of Admin fetched successfully",
      success: true,
      Totalcount: donarData.length,
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in getting donar list of Admin",
      success: false,
      error,
    });
  }
};

// GET THE HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel.find({ role: "hospital" }).sort({
      createdAt: -1,
    });
    return res.status(200).send({
      message: "Hospital List of Admin fetched successfully",
      success: true,
      Totalcount: hospitalData.length,
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in getting Hospital list of Admin",
      success: false,
      error,
    });
  }
};

// GET THE ORGANISATION LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel.find({ role: "organisation" }).sort({
      createdAt: -1,
    });
    return res.status(200).send({
      message: "Organisation List of Admin fetched successfully",
      success: true,
      Totalcount: orgData.length,
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in getting Organisation list of Admin",
      success: false,
      error,
    });
  }
};

//DELETE Record
const deleteController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      message: "Record deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in deleting Record",
      success: false,
      error,
    });
  }
};



// EXPORT
module.exports = {
  getDonarListController,
  getHospitalListController,
  getOrgListController,
  deleteController,
};
