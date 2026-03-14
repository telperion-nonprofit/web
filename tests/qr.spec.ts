import { test, expect } from "@playwright/test";
import { generateSPDString } from "../src/utils/qr";

test.describe("generateSPDString", () => {
  test("should generate SPD string with only IBAN", () => {
    const spd = generateSPDString({ iban: "CZ9620100000002102801318" });
    expect(spd).toBe("SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK");
  });

  test("should generate SPD string with IBAN and amount", () => {
    const spd = generateSPDString({ iban: "CZ9620100000002102801318", amount: 150.5 });
    expect(spd).toBe("SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK*AM:150.50");
  });

  test("should generate SPD string with IBAN and message", () => {
    const spd = generateSPDString({ iban: "CZ9620100000002102801318", message: "Dar na charitu" });
    expect(spd).toBe("SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK*MSG:Dar na charitu");
  });

  test("should generate SPD string with IBAN, amount and message", () => {
    const spd = generateSPDString({ iban: "CZ9620100000002102801318", amount: 500, message: "Příspěvek" });
    expect(spd).toBe("SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK*AM:500.00*MSG:Příspěvek");
  });

  test("should not include amount if amount is 0", () => {
    const spd = generateSPDString({ iban: "CZ9620100000002102801318", amount: 0 });
    expect(spd).toBe("SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK");
  });

  test("should not include amount if amount is negative", () => {
    const spd = generateSPDString({ iban: "CZ9620100000002102801318", amount: -100 });
    expect(spd).toBe("SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK");
  });

  test("should truncate message to 60 characters", () => {
    const longMessage = "A".repeat(100);
    const spd = generateSPDString({ iban: "CZ9620100000002102801318", message: longMessage });
    expect(spd).toBe(`SPD*1.0*ACC:CZ9620100000002102801318*CC:CZK*MSG:${"A".repeat(60)}`);
  });
});
