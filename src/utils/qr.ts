import QRCode from "qrcode";

export interface QRPlatbaOptions {
  iban: string;
  amount?: number;
  message?: string;
}

export function generateSPDString(options: QRPlatbaOptions): string {
  const { iban, amount, message } = options;
  let spd = `SPD*1.0*ACC:${iban}*CC:CZK`;

  if (amount && amount > 0) {
    spd += `*AM:${amount.toFixed(2)}`;
  }

  if (message) {
    // Basic sanitization for SPD message (max 60 chars, remove accents, limit charset if needed, but modern apps support unicode. We will truncate to be safe).
    spd += `*MSG:${message.substring(0, 60)}`;
  }

  return spd;
}

export async function generateQRDataURI(
  options: QRPlatbaOptions,
): Promise<string> {
  const spdString = generateSPDString(options);
  try {
    const dataUrl = await QRCode.toDataURL(spdString, {
      margin: 1,
      width: 256,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("Error generating QR code", err);
    return "";
  }
}
