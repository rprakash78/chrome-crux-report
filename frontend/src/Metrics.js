import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";

const MetricsTable = ({ data }) => {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  //   const handleFilterChange = (e) => {
  //     setFilter(e.target.value);
  //   };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sorting order if clicking on the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sorting column
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredData =
    data.metrics &&
    Object.entries(data.metrics)
      .filter(([key]) => key.includes(filter.toLowerCase()))
      .sort((a, b) => {
        const valueA = a[1].percentiles ? a[1].percentiles.p75 : 0;
        const valueB = b[1].percentiles ? b[1].percentiles.p75 : 0;

        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Metrics Table
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("key")}>Metric</TableCell>
              <TableCell onClick={() => handleSort("percentiles.p75")}>
                P75
              </TableCell>
              {/* Add more headers as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {value.percentiles ? value.percentiles.p75 : "N/A"}
                </TableCell>
                {/* Add more cells as needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MetricsTable;
