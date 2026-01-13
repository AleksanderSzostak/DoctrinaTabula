import bcrypt from "bcrypt";
import connection from "./index.js"

export default function register(req, res) {
  const password = req.body.hasloTrim;
  const username = req.body.nazwaTrim;

  if (!username || !password) {
      return res.status(400).send({
        message: "Missing credentials"
      });
  }

  connection.query("SELECT id FROM users WHERE nazwa = ?", [username], async (err, results) => {
    if (err) throw err;

      if (results.length > 0) {
        return res.status(400).send({
          message: "User arleady exists"
        });
    } 
    let hashedPassword = await bcrypt.hash(password, 10);
    connection.query("INSERT INTO users (nazwa, email, haslo) VALUES (?, \"brak\", ?)", [username, hashedPassword], (err, results) => {
        if (err) throw err;

        res.status(200).json({ success: true });
    });
  });
}