const express = require("express");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser"); // Import body-parser
const cookieParser = require("cookie-parser");

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
