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
    // `*` separates SPD fields and `\n` would terminate the payload, so strip
    // both before embedding: otherwise a message could inject its own fields
    // (including a different ACC). Modern banking apps handle unicode, but the
    // spec caps MSG at 60 characters.
    const safeMessage = message
      .replace(/[*\r\n]/g, " ")
      .trim()
      .substring(0, 60);
    if (safeMessage) {
      spd += `*MSG:${safeMessage}`;
    }
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
