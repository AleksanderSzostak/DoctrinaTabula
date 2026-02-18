import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "./index.js" 

import * as dotenv from 'dotenv';
dotenv.config();

export default function login(req, res) {
  const password = req.body.hasloTrim;
  const username = req.body.nazwaTrim;

  if (!username || !password) {
      return res.status(400).send({
        message: "Missing credentials"
      });
  }

  connection.query("SELECT id, haslo FROM users WHERE nazwa = ?", [username], async (err, results) => {
    if (err) throw err;
      if (results.length != 1) {
      return res.status(401).send({
          message: "Invalid credentials"
        });
    }

    const valid = await bcrypt.compare(password, results[0].haslo);

    if (!valid) {
      return res.status(401).send({
          message: "Invalid credentials"
        });
    }

    console.log(results[0].id);
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign(
      { userId: results[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: results[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200)
    .cookie("access", token, {
      httpOnly: true,
      secure: false,
      sameSite: true,
      maxAge: 15 * 60 * 1000
    })
    .cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: true,
      path: "/refresh",
      maxAge: 30 * 24 * 60 * 60 * 1000
    }).json({ success: true });
  });
}