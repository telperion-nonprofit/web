/// <reference types="astro/client" />

// @fontsource packages ship plain CSS with no type declarations, so their
// side-effect imports would otherwise fail `astro check`.
declare module "@fontsource-variable/*";
