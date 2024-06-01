const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

router.post("/register", (req, res) => {
  const sql =
    "INSERT INTO user_details ( `firstName`, `lastName`,`email`, `password`) VALUES (?, ?, ?, ?)";

  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      console.error("Error in hashing password:", err);
      return res.status(500).json({ message: "Error in hashing password" });
    }
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hash,
    ];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error occurred:", err);
        return res.status(400).json({ message: "Registration failed" });
      }
      return res.status(201).json({ message: "Registration successful" });
    });
  });
});

router.post("/login", (req, res) => {
  const sql = "SELECT * FROM user_details WHERE email = ?";

  db.query(sql, [req.body.email], (err, results) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Database query error" });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    bcrypt.compare(
      req.body.password.toString(),
      user.password,
      (err, isMatch) => {
        if (err) {
          console.error("Error in comparing password:", err);
          return res
            .status(500)
            .json({ message: "Error in comparing password" });
        }
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
          { email: req.body.email },
          "yourAccessTokenSecret",
          {
            expiresIn: "1d",
          }
        );

        return res
          .status(200)
          .cookie("auth-token", accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          })
          .json({
            message: "Login successful",
            firstName: user.firstName,
            lastName: user.lastName,
          });
      }
    );
  });
});

module.exports = router;
