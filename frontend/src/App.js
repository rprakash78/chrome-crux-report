import React, { useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import MetricsTable from "./Metrics";
import axios from "axios";

const App = () => {
  const [urls, setUrls] = useState("");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const urlArray = urls.split("\n").filter((url) => url.trim() !== ""); // Split URLs by new line
      const responsesArray = await Promise.all(
        urlArray.map(async (url) => {
          const response = await axios.post(
            "http://localhost:5000/getCrUXReport",
            { url }
          );
          return response.data;
        })
      );

      setResponses(responsesArray);
      setError(null);
    } catch (err) {
      setResponses([]);
      setError(err.message || "An error occurred");
    }
  };

  const calculateSummary = () => {
    if (responses.length === 0) {
      return null;
    }

    const summary = {
      average: {},
      sum: {},
    };

    Object.keys(responses[0].record.metrics).forEach((metric) => {
      const metricValues = responses.map(
        (response) => response.record.metrics[metric].percentiles.p75
      );
      summary.average[metric] =
        metricValues.reduce((acc, value) => acc + value, 0) /
        metricValues.length;
      summary.sum[metric] = metricValues.reduce((acc, value) => acc + value, 0);
    });

    return summary;
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Chrome CrUX Report App
      </Typography>
      <TextField
        label="Enter URLs (one per line)"
        variant="outlined"
        multiline
        fullWidth
        rows={4}
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

      {responses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <MetricsTable data={responses[0].record} />
          <div style={{ marginTop: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Summary:
            </Typography>
            <Typography variant="body1">
              Average and Sum of P75 Percentiles for each metric:
            </Typography>
            <pre>{JSON.stringify(calculateSummary(), null, 2)}</pre>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Error:
          </Typography>
          <Typography color="error">{error}</Typography>
        </div>
      )}
    </Container>
  );
};

export default App;
