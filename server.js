const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
//dot env config
dotenv.config();

//mongodb collection
connectDB();
//rest Object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

//STATIC FOLDER
app.use(express.static(path.join(__dirname, "./client/build")));

//STATIC ROUTES
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log(
    `Node server running in${process.env.DEV_MODE} on port ${process.env.PORT}`
      .bgBlue.white
  )
);
