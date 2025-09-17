import QRCode from 'qrcode';

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Download QR code as PNG file
 */
export function downloadQRCode(dataURL: string, filename: string): void {
  try {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw new Error('Failed to download QR code');
  }
}

/**
 * Get room URL for QR code generation
 */
export function getRoomUrl(roomSlug?: string): string {
  if (typeof window === 'undefined') {
    return roomSlug ? `/rooms/${roomSlug}` : '/';
  }

  const baseUrl = window.location.origin;
  return roomSlug ? `${baseUrl}/rooms/${roomSlug}` : baseUrl;
}

/**
 * Generate filename for QR code download
 */
export function getQRFilename(roomName?: string): string {
  if (!roomName) {
    return 'all-rooms-qr.png';
  }

  const sanitizedName = roomName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `room-${sanitizedName}-qr.png`;
}