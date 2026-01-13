import jwt from "jsonwebtoken";

export default function refresh(req, res) {
    const token = req.cookies.refresh;

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const newToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.status(200).cookie("access", token, {
            httpOnly: true,
            secure: false,
            sameSite: true,
            maxAge: 15 * 60 * 1000
        }).json({ success: true });
    } catch {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
}