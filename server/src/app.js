const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Import other routes here
// const metricsRoutes = require('./routes/metricsRoutes');
// app.use('/api/metrics', metricsRoutes);

module.exports = app;
