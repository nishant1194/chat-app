import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, "jaisiyaram", {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    httpOnly: true,                   // Prevent XSS attacks
    sameSite: "Strict",               // CSRF protection
    secure: false,                    // Use `true` in production with HTTPS
    path: '/',                        // Ensure the cookie is set for the root path
  });
 
   return token;
};
