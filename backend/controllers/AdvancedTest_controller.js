const https = require("https");
const { URL } = require("url");

// Azure Custom Vision API Endpoint and Prediction Key
const predictionEndpoint = process.env.SIGHT_PREDICTION_ENDPOINT;
const predictionKey = process.env.SIGHT_PREDICTION_KEY;

// Helper function to validate URL
const isValidURL = (endpoint) => {
  try {
    const parsedUrl = new URL(endpoint);
    const validProtocols = ["https:"];
    const isPublicIP = !parsedUrl.hostname.match(
      /^(localhost|127\.0\.0\.1|\[::1\])$/
    ); // Block local addresses

    // Verify protocol
    if (!validProtocols.includes(parsedUrl.protocol)) {
      return false;
    }

    return isPublicIP; // Ensure it's not a local address
  } catch (err) {
    return false;
  }
};

// Controller function to upload and analyze the image
const uploadImage = (req, res) => {
  if (!predictionKey) {
    return res.status(500).json({ error: "Prediction Key is not defined." });
  }

  if (!isValidURL(predictionEndpoint)) {
    return res.status(500).json({ error: "Invalid or unauthorized endpoint." });
  }

  const parsedUrl = new URL(predictionEndpoint);

  const options = {
    method: "POST",
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    port: 443,
    headers: {
      "Prediction-Key": predictionKey,
      "Content-Type": "application/octet-stream",
      "Content-Length": req.file.buffer.length,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        res.json(JSON.parse(data));
      } catch (err) {
        res.status(500).json({ error: "Failed to parse response from API." });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Request Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the image." });
  });

  request.write(req.file.buffer);
  request.end();
};

module.exports = {
  uploadImage,
};
