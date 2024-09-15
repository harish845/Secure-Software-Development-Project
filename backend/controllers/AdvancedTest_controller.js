const axios = require("axios");

// Azure Custom Vision API Endpoint and Prediction Key
const predictionEndpoint = process.env.SIGHT_PREDICTION_ENDPOINT;
const predictionKey = process.env.SIGHT_PREDICTION_KEY;

// Whitelist of allowed endpoints
const allowedEndpoints = [predictionEndpoint];

// Controller function to upload and analyze the image
const uploadImage = async (req, res) => {
  try {
    // Ensure the endpoint is in the whitelist
    if (!allowedEndpoints.includes(predictionEndpoint)) {
      throw new Error("Endpoint not allowed.");
    }

    // Send the image to the Azure Custom Vision API
    const response = await axios.post(predictionEndpoint, req.file.buffer, {
      headers: {
        "Prediction-Key": predictionKey,
        "Content-Type": "application/octet-stream",
      },
    });

    // Send the API response to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the image." });
  }
};

module.exports = {
  uploadImage,
};
