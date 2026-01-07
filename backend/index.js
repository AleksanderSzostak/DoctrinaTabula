import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "pg";
import mysql from "mysql";

const app = express();
const port = 8080;

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fiszki"
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database!');
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.post("/login", (req, res) => {
  const password = req.body.hasloTrim;
  const username = req.body.nazwaTrim;

  if (!username || !password) {
      return res.status(400).send({
        message: "Missing credentials"
      });
  }

  connection.query("SELECT id, haslo FROM users WHERE nazwa = ?", [username], async (err, results) => {
  if (err) throw err;
  console.log(results.length);

    if (results.length != 1) {
    return res.status(401).send({
        message: "Invalid credentials"
      });
  }

  const valid = await bcrypt.compare(password, results[0].haslo);
  console.log(valid);

  if (!valid) {
    return res.status(401).send({
        message: "Invalid credentials"
      });
  }
  
  });



  res.json({ haslo: req.body.hasloTrim, nazwa: req.body.nazwaTrim });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.post("/login", (req, res) => {
  res.json({ message: "TEST" });
});
