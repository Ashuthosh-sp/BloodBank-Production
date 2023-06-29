const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1]; //Bearer token
    JWT.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      //decoded is the payload
      if (error) {
        return res.status(401).send({
          message: "Authorization Failed",
          success: false,
          error,
        });
      } else {
        req.body.userId = decoded.userId;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Authorization Failed",
      success: false,
      error,
    });
  }
};
