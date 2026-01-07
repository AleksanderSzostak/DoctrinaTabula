import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "pg";
 
const { Pool } = pkg;
 
/**
* Neon connection
* DATABASE_URL comes from Netlify environment variables
*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
 
export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
 
  try {
    const { username, password } = JSON.parse(event.body);
 
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing credentials" })
      };
    }
 
    // Look up user
    const result = await pool.query(
      "SELECT id, haslo FROM users WHERE username = $1",
      [username]
    );
 
    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }
 
    const user = result.rows[0];
 
    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
 
    if (!valid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }
 
    // ✅ Create JWT (store ONLY userId)
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
 
    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": [
          `auth=${token}; HttpOnly; Secure; SameSite=Lax; Path=/`
        ]
      },
      body: JSON.stringify({ success: true })
    };
 
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
}
