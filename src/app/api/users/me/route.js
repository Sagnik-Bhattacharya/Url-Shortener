import { connectDB } from '@/lib/connectDB';
import User from '@/models/user.model';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  await connectDB();
  try {
    const decoded = verifyToken();
    const user = await User.findById(decoded.userId).select('-password');
    return Response.json(user);
  } catch (err) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
