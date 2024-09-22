require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const UserBase = require("./routes/User/User_base");
const AdminBase = require("./routes/User/Admin_base");
const AdvancedTest_base = require("./routes/AdvancedTest/AdvancedTest_base");
const GeneralTestBase = require("./routes/Generaltest/GeneralTest_base");
const ClinicBase = require("./routes/Clinical/Clinic_base");

//express app
const app = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());

// Parse JSON request bodies
app.use(express.json()); //to add json to the 'req' Object
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Request path: %s, Request method: %s", req.path, req.method);
  next();
});
app.use(bodyParser.json());

//routes
UserBase(app);
AdminBase(app);
AdvancedTest_base(app);
ClinicBase(app);
GeneralTestBase(app);


//connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log(
        "Connected to db & listening for requests on port ",
        process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
