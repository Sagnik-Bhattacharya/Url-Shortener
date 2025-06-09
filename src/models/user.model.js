import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    avatar: String,
    urls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url' , default: [] }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
