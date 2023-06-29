const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");

//GET BLOOD DATA
const bloodGroupDetailsController = async (req, res) => {
  try {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodGroupData = [];
    const organisation =  new mongoose.Types.ObjectId(req.body.userId);

    //get single blood group
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        //COUNT TOTAL IN
        const totalIn = await inventoryModel.aggregate([
          //aggregate is used to perform complex operations like sum, count, etc
          {
            $match: {
              //match is used to match the condition
              bloodGroup: bloodGroup, //
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //COUNT TOTAL OUT
        const totalout = await inventoryModel.aggregate([
          //aggregate is used to perform complex operations like sum, count, etc
          {
            $match: {
              //match is used to match the condition
              bloodGroup: bloodGroup, //
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        //calculate total available blood group in the organisation
        const avalilableBlood =
          (totalIn[0]?.total || 0) - (totalout[0]?.total || 0);
        //push the data to bloodGroupData
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalout[0]?.total || 0,
          avalilableBlood,
        });
      })
    );

    return res.status(200).send({
      message: "Blood group data fetched successfully",
      success: true,
      bloodGroupData,
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

module.exports = {
  bloodGroupDetailsController,
};
