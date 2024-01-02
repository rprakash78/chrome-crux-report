const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/getCrUXReport", async (req, res) => {
  const body = req.body;
  const key = "<API KEY>";
  const apiUrl = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${key}`;

  try {
    // console.log(origin);
    // Make a request to the CrUX API
    console.log(apiUrl);
    console.log(body);
    const response = await axios.post(apiUrl, body);

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
