import { test, expect } from '@playwright/test';
import { generateSPDString } from '../src/utils/qr';

test.describe('generateSPDString @unit', () => {
  const baseIban = 'CZ9620100000002102801318';

  test('generates basic string with only required IBAN', () => {
    const result = generateSPDString({ iban: baseIban });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK`);
  });

  test('appends valid amount formatted to 2 decimal places', () => {
    const result = generateSPDString({ iban: baseIban, amount: 1500 });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK*AM:1500.00`);
  });

  test('handles fractional amounts correctly', () => {
    const result = generateSPDString({ iban: baseIban, amount: 1500.5 });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK*AM:1500.50`);
  });

  test('omits amount field if amount is exactly zero', () => {
    const result = generateSPDString({ iban: baseIban, amount: 0 });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK`);
  });

  test('omits amount field if amount is negative', () => {
    const result = generateSPDString({ iban: baseIban, amount: -500 });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK`);
  });

  test('appends a short message', () => {
    const message = 'Platba za sluzby';
    const result = generateSPDString({ iban: baseIban, message });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK*MSG:${message}`);
  });

  test('truncates a message longer than 60 characters', () => {
    // 65 chars long string
    const longMessage = 'A'.repeat(65);
    const result = generateSPDString({ iban: baseIban, message: longMessage });
    // Expect the first 60 characters
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK*MSG:${'A'.repeat(60)}`);
  });

  test('handles all fields combined correctly', () => {
    const result = generateSPDString({
      iban: baseIban,
      amount: 1000,
      message: 'Test message',
    });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK*AM:1000.00*MSG:Test message`);
  });

  test('ignores empty string message', () => {
    const result = generateSPDString({ iban: baseIban, message: '' });
    expect(result).toBe(`SPD*1.0*ACC:${baseIban}*CC:CZK`);
  });
});
