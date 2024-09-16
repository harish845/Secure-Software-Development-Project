require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const csurf = require("csurf"); // CSRF protection middleware
const cookieSession = require("cookie-session");

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

// Set up session handling
app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET || "default_secret", // Use environment variable for session secret
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true, // Mitigates XSS
    secure: process.env.NODE_ENV === "production", // Only set cookies over HTTPS in production
  })
);

// // Enable CSRF Protection
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// Parse JSON request bodies
app.use(express.json()); //to add json to the 'req' Object
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.url = req.url.replace(/[^\w.\/-]/g, "");
  next();
});
app.use(bodyParser.json());

//routes
UserBase(app);
AdminBase(app);
AdvancedTest_base(app);
ClinicBase(app);
GeneralTestBase(app);

// // CSRF Token Handling
app.use((req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken()); // Send CSRF token to the client as a cookie
  next();
});

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
