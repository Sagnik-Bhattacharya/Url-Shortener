import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/user.model";
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  return jwt.verify(token, JWT_SECRET);
};

export async function fetchUser(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) throw new Error('No token');
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    console.log(decoded.userId);
    const user = await User.findOne({ _id: decoded.userId}).populate('urls');
    console.log(user);

    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    console.error('[fetchUser]', err.message);
    return null;
  }
}