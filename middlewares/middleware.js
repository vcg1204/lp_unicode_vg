import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authVerify = (req, res, next) => {
  const authHeader = req.header("Authorization"); // Check for Authorization header
  if (!authHeader) return res.status(401).send("Access Denied");

  try {
    const bearer = authHeader.split(" ");
    const bearerToken = bearer[1]; // Extract the token part
    if (bearerToken == null) {
      return res.status(401).send("Token is null");
    }
    const verified = jwt.verify(bearerToken, process.env.secretKey); // Verify token
    req.user = verified; // Attach verified user
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
}
export default authVerify;

