const router = require("express").Router();
let Test = require("../../models/GeneralTest_Modal");
const { route } = require("../User/User");

// Import middleware function - require auth for all routes
const requireAuth = require("../../middleware/requireAuth");
router.use(requireAuth);

// Utility function to sanitize user input
const sanitizeInput = (input) => {
  return typeof input === "string" ? input.replace(/[^a-zA-Z0-9_]/g, "") : "";
};

// Update or add test
router.route("/addTest").post((req, res) => {
  const test_name = "General Test";
  const user_id = sanitizeInput(req.user.firstname);
  const test_date = new Date();
  const test_score = req.body.test_score;

  // Find an existing test record for the user
  Test.findOne({ user_id: user_id })
    .then((existingTest) => {
      if (existingTest) {
        existingTest.test_date = test_date;
        existingTest.test_score = test_score;

        existingTest
          .save()
          .then(() => {
            res.json("Test updated!");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // If no existing record is found, create a new one
        const newTest = new Test({
          test_name,
          user_id,
          test_date,
          test_score,
        });

        newTest
          .save()
          .then(() => {
            res.json("Test added!");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/delete-all").delete((req, res) => {
  const user_id = sanitizeInput(req.user.firstname);

  Test.deleteMany({ user_id: user_id })
    .then(() => {
      res.json(
        "All General Test data for the specified user_id deleted successfully."
      );
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json("Error deleting General Test data for the specified user_id.");
    });
});

module.exports = router;
