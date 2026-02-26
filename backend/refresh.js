import jwt from "jsonwebtoken";
import { connection } from "./index.js";

export default function refresh(req, res) {
    const token = req.cookies.refresh;

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        connection.query("SELECT tokenVersion from users WHERE id = ?", [payload.userId], async (err, results) => {
            if (err) {throw err}
            if (results.length != 1) {
                return res.status(401).send({
                    message: "Unauthorized"
                });
            }

            if (results[0].tokenVersion != payload.tokenVersion) {
                console.log("Wrong token version")
                return res.status(401).send({
                    message: "Unauthorized"
                });
            }

            const newToken = jwt.sign(
                { userId: payload.userId },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            res.status(200).cookie("access", newToken, {
                httpOnly: true,
                secure: true,
                sameSite: true,
                maxAge: 15 * 60 * 1000
            }).json({ success: true });
        })
        
    } catch {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
}