import "dotenv/config";
import express from "express";
import cors from "cors";
import mysql from "mysql";
import login from "./login.js";
import register from "./register.js";

const app = express();
const port = 8080;

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fiszki"
});

export default connection;

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database!');
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.post("/login", login);

app.post("/register", register);

app.get("/sprawdzUzytkownika/:nazwa", (req, res) => {
  connection.query("SELECT id FROM users WHERE nazwa = ?", [req.params.nazwa], async (err, results) => {
    if (err) throw err;

      if (results.length > 0) {
        return res.status(200).json({
          exists: true
        });
      } else {
        return res.status(200).json({
          exists: false
        });
      }
  })
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});