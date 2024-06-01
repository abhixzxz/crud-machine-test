const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const multer = require("multer");
const path = require("path");

const PORT = require("../helpers/index.js");
const fs = require("fs");

// Set up storage engine
const up_folder = path.join(__dirname, "../storage/app/public");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(up_folder)) {
      fs.mkdirSync(up_folder, { recursive: true });
    }
    cb(null, up_folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Add a new company
router.post("/addCompany", upload.single("logo"), (req, res) => {
  const { name, email, website } = req.body;
  const defaultAvatar =
    "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
  const logo = req?.file?.filename
    ? `${req.protocol}://${req.get("host")}/storage/app/public/${
        req.file.filename
      }`
    : defaultAvatar;
  console.log(logo);
  const sql =
    "INSERT INTO company_details (name, email, logo, website) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, logo, website], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res
      .status(201)
      .json({ message: "Company added successfully", id: result.insertId });
  });
});

// Get all companies
router.get("/getAllCompany", (req, res) => {
  const sql = "SELECT * FROM company_details";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json(results);
  });
});

router.delete("/deleteCompany/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM company_details WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company deleted successfully" });
  });
});

// Update a company
router.put("/updateCompany/:id", upload.single("logo"), (req, res) => {
  const companyId = req.params.id;
  const { name, email, website } = req.body;

  // Check if a new logo is uploaded
  let logo = null;
  if (req.file) {
    logo = `${req.protocol}://${req.get("host")}/storage/app/public/${
      req.file.filename
    }`;
  }

  // Construct the SQL query
  let sql = "UPDATE company_details SET";
  const params = [];
  if (name) {
    sql += " name = ?,";
    params.push(name);
  }
  if (email) {
    sql += " email = ?,";
    params.push(email);
  }
  if (logo) {
    sql += " logo = ?,";
    params.push(logo);
  }
  if (website) {
    sql += " website = ?,";
    params.push(website);
  }
  // Remove the trailing comma
  sql = sql.slice(0, -1);

  sql += " WHERE id = ?";
  params.push(companyId);

  // Execute the SQL query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company updated successfully" });
  });
});

module.exports = router;
