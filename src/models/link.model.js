// models/Url.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    qrCode: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);

export default Url;
