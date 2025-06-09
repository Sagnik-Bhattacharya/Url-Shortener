import QRCode from 'qrcode';
import Url from '@/models/link.model';

export async function generateQRCode(originalUrl, id) {
  try {
    const dataUrl = await QRCode.toDataURL(originalUrl);
    console.log('[QR CODE]', dataUrl);

    const updated = await Url.findByIdAndUpdate(
      id,
      { qrCode: dataUrl },
      { new: true }
    );

    if (!updated) {
      console.error('[QR CODE] Url not found for ID:', id);
    } else {
      console.log('[QR CODE] Updated document:', updated);
    }

    return dataUrl;
  } catch (err) {
    console.error('[QR CODE ERROR]', err);
    return null;
  }
}
