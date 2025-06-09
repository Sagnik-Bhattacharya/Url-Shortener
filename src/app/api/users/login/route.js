import { connectDB } from '@/lib/connectDB';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return Response.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken(user._id);

  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return Response.json({ message: 'Login successful' });
}
