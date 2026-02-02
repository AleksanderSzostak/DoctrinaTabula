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
app.use(cookieParser());

app.post("/login", login);

app.post("/register", register);

app.post("/refresh", refresh);

app.post("/logout", (req, res) => {
  res.clearCookie("access", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.clearCookie("refresh", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.sendStatus(204);
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


function verifyUser(req) {
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

app.get('/zestawy',(req,res)=>{
  let id = verifyUser(req);
  if (!id) {
    return res.status(401).send({
      message: "Unathorized"
    })
  }

  const sql = "SELECT * FROM groups WHERE userId = "+ id;

  connection.query(sql,(err, data)=>{

    if(err) return res.json(err);

    res.json(data);

  })

})

app.get('/fiszki/:id',(req,res)=>{

  const sql = "SELECT id FROM fiszki WHERE groupid = "+ req.params.id;

  connection.query(sql,(err, data)=>{

    if(err) return res.json(err);

      return res.json(data);

    })

})
 