import { connectDB } from '@/lib/connectDB';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();
  const { name, username, email, password } = await req.json();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return Response.json({ message: 'Email already registered' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, username, email, password: hashedPassword });
  await newUser.save();

  return Response.json({ message: 'User registered successfully' });
}
