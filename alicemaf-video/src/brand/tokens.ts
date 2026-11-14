import {Easing, staticFile} from 'remotion';

export const colors = {
  inkBlue: '#080E25',   // Azul tinta (fondo)
  indigo: '#565EF2',    // Índigo
  indigoDeep: '#4046C8',
  cyan: '#72E8ED',      // Cian
  teal: '#007681',      // Turquesa (fondos claros)
  coolWhite: '#F5F7FF', // Blanco frío
  slate: '#BAC6E8',     // texto secundario sobre azul tinta
} as const;

export const fonts = {
  sans: "'Open Sans', sans-serif",
  mono: "'Liberation Mono', monospace",
} as const;

export const fontFaces = [
  {family: 'Open Sans', weight: 400, file: 'fonts/open-sans-latin-400-normal.woff2'},
  {family: 'Open Sans', weight: 600, file: 'fonts/open-sans-latin-600-normal.woff2'},
  {family: 'Open Sans', weight: 700, file: 'fonts/open-sans-latin-700-normal.woff2'},
  {family: 'Open Sans', weight: 800, file: 'fonts/open-sans-latin-800-normal.woff2'},
  {family: 'Liberation Mono', weight: 400, file: 'fonts/LiberationMono-Regular.ttf'},
  {family: 'Liberation Mono', weight: 700, file: 'fonts/LiberationMono-Bold.ttf'},
].map((f) => ({...f, url: staticFile(f.file)}));

export const assets = {
  isotipo: staticFile('brand/isotipo.png'),
  icimaf: staticFile('brand/icimaf.png'),
  toroide: staticFile('brand/toroide.jpg'),
  cristal: staticFile('brand/cristal.jpg'),
};

/** Easing de marca: expo.out equivalente. Sin rebotes. */
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const FPS = 30;
export const SAFE = 0.05; // margen de seguridad de texto: 5 %
export const MIN_TEXT_SECONDS = 2;

/** true cuando blender/render_hero.sh terminó y existe public/hero/aire.mp4 */
export const HERO_VIDEO = false;
