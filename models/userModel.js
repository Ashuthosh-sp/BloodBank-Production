const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["donar", "admin","hospital","organisation" ],
    },
    name: {
      type: String,
      required: function () {
        return this.role === "admin" ? true : false;
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        return this.role === "hospital" ? true : false;
      },
    },
    organisationName: {
      type: String,
      required: function () {
        return this.role === "organisation" ? true : false;
      },
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Please enter an address"],
    },
    phone: {
      type: String,
      required: [true, "Please enter a phone number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
