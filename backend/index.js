const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "32kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

app.post("/getCrUXReport", async (req, res) => {
  const url = typeof req.body?.url === "string" ? req.body.url.trim() : "";
  const key = process.env.CRUX_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "CRUX_API_KEY is not configured" });
  }

  if (!url || !isHttpUrl(url)) {
    return res.status(400).json({ error: "A valid http(s) URL is required" });
  }

  const apiUrl = "https://chromeuxreport.googleapis.com/v1/records:queryRecord";

  try {
    const response = await axios.post(
      apiUrl,
      { url },
      {
        params: { key },
        timeout: 15000,
      }
    );

    return res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    console.error("CrUX request failed", status);
    res.status(status).json({ error: "Unable to fetch CrUX report" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
