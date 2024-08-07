import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: "15d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwtkey", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      httpOnly: true, // Prevent XSS attacks
      sameSite: isProduction ? "None" : "Lax", // CSRF attacks protection
      secure: isProduction, // Use secure cookies in production
    });

    // Optionally, you can log the token for debugging purposes (commented out for security reasons)
    // console.log("Token generated and set as cookie:", token);
  } catch (error) {
    console.error("Error generating token and setting cookie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default generateTokenAndSetCookie;
