import { test, mock, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import QRCode from 'qrcode';
import { generateQRDataURI } from '../../src/utils/qr';

describe('generateQRDataURI', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  test('should return data URI on success', async () => {
    const mockDataUri = 'data:image/png;base64,mockBase64String';
    mock.method(QRCode, 'toDataURL', async () => mockDataUri);

    const result = await generateQRDataURI({
      iban: 'CZ1234567890123456789012',
      amount: 100,
      message: 'Test message',
    });

    assert.strictEqual(result, mockDataUri);
  });

  test('should catch errors and return an empty string', async () => {
    const errorMsg = 'Mocked QR Code Generation Error';
    mock.method(QRCode, 'toDataURL', async () => {
      throw new Error(errorMsg);
    });

    // Mock console.error to prevent it from polluting the test output
    // and to verify it is called correctly.
    const consoleErrorMock = mock.method(console, 'error', () => {});

    const result = await generateQRDataURI({
      iban: 'CZ1234567890123456789012',
    });

    assert.strictEqual(result, '');
    assert.strictEqual(consoleErrorMock.mock.calls.length, 1);

    // Check if console.error was called with the correct arguments
    const callArgs = consoleErrorMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], 'Error generating QR code');
    assert.ok(callArgs[1] instanceof Error);
    assert.strictEqual(callArgs[1].message, errorMsg);
  });
});
