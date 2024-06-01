const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const companiesRoute = require("./routes/companiesRoutes.js");
const employeesRoute = require("./routes/employeeRoutes.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { PORT } = require("./helpers/index.js");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/storage", express.static(__dirname + "/storage"));

// Routes section
app.use("/api/auth", authRoutes);
app.use("/api/companies", companiesRoute);
app.use("/api/employees", employeesRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
