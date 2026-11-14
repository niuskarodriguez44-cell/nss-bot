// Cronología (segundos). tr = duración de la transición por partículas HACIA esa escena (0 = corte duro).
export const SCENES = [
  {id: 'E1', start: 0, tr: 0},
  {id: 'E2', start: 12, tr: 1.4},
  {id: 'E3', start: 35, tr: 1.4},
  {id: 'E4', start: 60, tr: 1.4},
  {id: 'E5', start: 95, tr: 1.6},
  {id: 'E6', start: 118, tr: 0}, // golpe: corte duro
  {id: 'E7', start: 150, tr: 1.4},
  {id: 'E8', start: 168, tr: 1.6},
] as const;
export const TOTAL_SECONDS = 185;
