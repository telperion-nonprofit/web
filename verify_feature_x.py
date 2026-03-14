from playwright.sync_api import Page, expect, sync_playwright
import time

def test_qr_modal(page: Page):
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:4321")

    # Dismiss global promo modal
    promo_modal_close = page.locator("#climate-fresk-close")
    if promo_modal_close.is_visible():
        promo_modal_close.click()

    # 2. Act: Open the donation modal.
    # We use evaluate to dispatch the custom event since it's an easy way to trigger it.
    page.evaluate("document.dispatchEvent(new CustomEvent('open-donation-modal'))")

    # 3. Wait for the modal to be visible and have opacity
    modal = page.locator("#donation-modal")
    expect(modal).to_be_visible()

    # 4. Take a screenshot of the initial state
    page.screenshot(path="/home/jules/verification/modal-initial.png")

    # 5. Click the "100 Kč" button to generate a specific QR code
    btn_100 = page.locator("button.amount-btn[data-amount='100']")
    btn_100.click()

    # 6. Wait for a moment to let the QR code generate
    time.sleep(1)

    # 7. Take a screenshot showing the active state and QR code
    page.screenshot(path="/home/jules/verification/modal-100kc.png")

    # 8. Click the "Other" option
    btn_other = page.locator("button.amount-btn[data-amount='other']")
    btn_other.click()

    # 9. Enter a custom amount
    custom_input = page.locator("#custom-amount-input")
    expect(custom_input).to_be_visible()
    custom_input.fill("1337")

    time.sleep(1)

    # 10. Take a screenshot showing the custom amount input
    page.screenshot(path="/home/jules/verification/modal-custom.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_qr_modal(page)
        finally:
            browser.close()
