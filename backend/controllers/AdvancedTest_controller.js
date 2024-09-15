const axios = require("axios");
const fileType = require("file-type"); // Helps validate image files

// Azure Custom Vision API Endpoint and Prediction Key
const predictionEndpoint = process.env.SIGHT_PREDICTION_ENDPOINT;
const predictionKey = process.env.SIGHT_PREDICTION_KEY;

// Allowed MIME types for images
const allowedImageTypes = ["image/jpeg", "image/png"];

// Controller function to upload and analyze the image
const uploadImage = async (req, res) => {
  try {
    // Validate that the uploaded file is a valid image
    const type = await fileType.fromBuffer(req.file.buffer);

    if (!type || !allowedImageTypes.includes(type.mime)) {
      return res
        .status(400)
        .json({
          error: "Invalid image format. Only JPEG and PNG are allowed.",
        });
    }

    // Check if the predictionEndpoint is properly configured
    if (
      !predictionEndpoint ||
      !/^https:\/\/sightsense-prediction\.cognitiveservices\.azure\.com\/customvision\/v3\.0\/Prediction\/[a-f0-9\-]+\/classify\/iterations\/[a-zA-Z0-9]+\/image$/.test(
        predictionEndpoint
      )
    ) {
      return res
        .status(500)
        .json({
          error: "Invalid or unsafe prediction endpoint configuration.",
        });
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
