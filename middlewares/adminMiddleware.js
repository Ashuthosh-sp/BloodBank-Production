const userModel = require("../models/userModel");
module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.userId);
    //checking if user is admin
    if (user.role !== "admin") {
      return res.status(401).send({
        message: "Authorization Failed of Admin",
        success: false,
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Authorization Failed of Admin",
      success: false,
      error,
    });
  }
};
