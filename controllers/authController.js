const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email }); // Check if user already exists
    if (existingUser) {
      return res.status(200).send({
        message: "User already exists",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // Hash the password
    req.body.password = hashedPassword; // Replace the password with hashed password

    //rest data
    const user = new userModel(req.body); // Create new user
    await user.save(); // Save user to database
    return res.status(200).send({
      message: "User created successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

//login controller

const loginController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(404).send({
        message: "User does not exists",
        success: false,
      });
    }

    //check role
    if(existingUser.role !== req.body.role){
      return res.status(500).send({
        message: "Role Does not match",
        success: false,
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        message: "Password does not match",
        success: false,
      });
    }
    //create token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    ); // Create token  //expiresIn:"1h" means token will expire in 1 hour
    return res.status(200).send({
      success: true,
      message: "User logged in successfully",
      token,
      existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: " Error while Logging in",
      success: false,
      error,
    });
  }
};

//current user controller

const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    return res.status(200).send({
      message: " Current user fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: " Unable to get current user",
      success: false,
      error,
    });
  }
};
module.exports = { registerController, loginController, currentUserController };
