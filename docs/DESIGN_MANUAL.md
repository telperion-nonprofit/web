# Design Manual

This document outlines the core design elements used throughout the application, such as colors, typography, and utility classes.

## Colors

The application relies on a refined set of custom CSS variables defined in `src/styles/global.css`:

* **Cream:** `--color-cream` (`#f8f4dd`) - Used primarily as the background color.
* **Brand Green:** `--color-brand-green` (`#2a6a00`) - Used for primary headings and prominent UI elements.
* **Dark Green:** `--color-dark-green` (`#0b210e`) - Used for main body text and secondary elements requiring high contrast.

## Typography

We use two variable fonts to establish a strong typographic hierarchy:

* **Sans-serif (`--font-sans`):** Manrope Variable (`"Manrope Variable", sans-serif`) - Used for body text, interactive elements, and general content.
* **Serif (`--font-serif`):** Playfair Display Variable (`"Playfair Display Variable", serif`) - Used for primary headings (H1, H2, etc.) to add elegance and contrast.

## Utilities

### `@utility glass-card`

This custom Tailwind utility class provides a glassmorphism effect for card components. It is defined as:

```css
@utility glass-card {
  @apply bg-cream/40 backdrop-blur-sm border border-dark-green/10;
}
```

It applies a translucent cream background, a backdrop blur for depth, and a subtle border using the dark green color for definition.
