/*

Mamy cos takiego:
app.post("/sciezka", (req, res) => {
  To idzie na sam poczatek:
  let id = verifyUser();
  if (!id) {
    return res.status(401).send({
      message: "Unathorized"
    })
  }
  I mamy id zalogowanego uzytkownika
});

*/

import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import mysql from "mysql";
import login from "./login.js";
import refresh from "./refresh.js";
import register from "./register.js";
import jwt from "jsonwebtoken";
import zapiszFiszki from "./zapiszFiszki.js";

const app = express();
const port = 8080;

export let connection = mysql.createConnection({
  host: "fiszki.mysql.database.azure.com",
  user: "db_admin",
  password: "Warszawa2025!",
  database: "fiszki",
  port: 3306
  //ssl:{ca:fs.readFileSync("{ca-cert filename}")}
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
app.use(cookieParser());

app.post("/login", login);

app.post("/register", register);

app.post("/refresh", refresh);

app.post("/logout", (req, res) => {
  const token = req.cookies.refresh;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      connection.query("UPDATE users SET tokenVersion = ? WHERE id = ?", [payload.tokenVersion+1, payload.userId], (err, result) => {
        if (err) {throw err}
        res.clearCookie("access", {
          httpOnly: true,
          secure: false,
          sameSite: "strict"
        });
      
        res.clearCookie("refresh", {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          path: "/"
        });
      
        res.sendStatus(204);
      })
    } catch (err) {
      console.log(err);
    }
  }
});



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

app.post('/zapiszFiszki', zapiszFiszki)

export function verifyUser(req) {
  const token = req.cookies.access;

  if (!token) {
    console.log("Wrong cookie")
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.userId;
  } catch (error) {
    console.log("Token verification failed. " + error)
    return null;
  }
}

app.get('/zestawy', (req, res) => {
 
  function queryAsync(sql) {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
 
  const id = verifyUser(req);
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
 
  const sqlgroup = `SELECT * FROM groups WHERE userid = ${id}`;
 
  connection.query(sqlgroup, async (err, groups) => {
    if (err) return res.status(500).json(err);
 
    try {
      const result = [];
      for (const group of groups) {
        const sql = `SELECT * FROM fiszki WHERE groupid = ${group.id}`;
 
        result.push({
          id: group.id,
          nazwa: group.nazwa,
          id: group.id,
          fiszki: queryAsync(sql)
        });
      }
      const resolved = await Promise.all(
        result.map(async g => ({
          id: g.id,
          nazwa: g.nazwa,
          id: g.id,
          fiszki: await g.fiszki
        }))
      );
 
      res.json(resolved);
 
    } catch (e) {
      res.status(500).json(e);
    }
  });
});

app.get('/fiszki',(req,res)=>{
  let id = verifyUser(req);
  if (!id) {
    return res.status(401).send({
      message: "Unathorized"
    })
  }
    const sql = "SELECT fiszki.* FROM fiszki INNER JOIN groups on fiszki.groupid = groups.id WHERE groups.userid = "+id+";";
    db.query(sql,(err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});
 