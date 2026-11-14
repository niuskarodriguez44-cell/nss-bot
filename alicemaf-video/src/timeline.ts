// Cronología 1:30 (segundos). tr = transición por partículas HACIA esa escena (0 = corte duro).
export const SCENES = [
  {id: 'E1', start: 0, tr: 0},    // Apertura ICIMAF
  {id: 'E2', start: 8, tr: 1.4},  // Presentamos AliceMaf 12B + AIRE MoE
  {id: 'E3', start: 20, tr: 1.4}, // El reto
  {id: 'E4', start: 30, tr: 1.4}, // Mezcla de expertos
  {id: 'E5', start: 51, tr: 1.6}, // AliceMaf 12B
  {id: 'E6', start: 63, tr: 0},   // AIRE MoE: golpe (corte duro)
  {id: 'E7', start: 80, tr: 1.4}, // Cierre
] as const;
export const TOTAL_SECONDS = 90;
