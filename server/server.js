const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes section
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
