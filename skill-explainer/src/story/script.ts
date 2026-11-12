/** Guion y tiempos de "El Búho y la toma universal" (60 s, 30 fps, 1800 frames). */
export const STORY_TOTAL = 1800;

export const SC = {
  s1: { from: 0, dur: 150 },
  s2: { from: 150, dur: 270 },
  s3: { from: 420, dur: 240 },
  s4: { from: 660, dur: 360 },
  s5: { from: 1020, dur: 360 },
  s6: { from: 1380, dur: 240 },
  s7: { from: 1620, dur: 180 },
};
export type SceneKey = keyof typeof SC;

export type Voice =
  | "owl"
  | "squirrel"
  | "beaver"
  | "fox"
  | "turtle"
  | "teacher";

export type Line = {
  id: string;
  scene: SceneKey;
  start: number; // frame local de la escena
  voice: Voice;
  speaker: string;
  lines: string[];
};

/** Diálogos (se escriben letra a letra, 2 frames por carácter). */
export const LINES: Line[] = [
  {
    id: "s1a",
    scene: "s1",
    start: 44,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["SOY UN BÚHO MUY LISTO..."],
  },
  {
    id: "s1b",
    scene: "s1",
    start: 96,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["...PERO VIVO ENCERRADO."],
  },
  {
    id: "s2a",
    scene: "s2",
    start: 14,
    voice: "squirrel",
    speaker: "ARDILLA",
    lines: ["¡HOLA! MI AGENDA USA", "UN CABLE CUADRADO."],
  },
  {
    id: "s2b",
    scene: "s2",
    start: 98,
    voice: "beaver",
    speaker: "CASTOR",
    lines: ["¡Y MIS ARCHIVOS,", "UNO REDONDO!"],
  },
  {
    id: "s2c",
    scene: "s2",
    start: 170,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["¡NADA ENCAJA!"],
  },
  {
    id: "s3a",
    scene: "s3",
    start: 8,
    voice: "turtle",
    speaker: "TORTUGA",
    lines: ["¿Y SI TODOS HABLAMOS", "EL MISMO IDIOMA?"],
  },
  {
    id: "s4a",
    scene: "s4",
    start: 20,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["¿QUÉ SABES HACER?"],
  },
  {
    id: "s4b",
    scene: "s4",
    start: 64,
    voice: "squirrel",
    speaker: "ARDILLA",
    lines: ["VER TU AGENDA Y", "CREAR EVENTOS."],
  },
  {
    id: "s4c",
    scene: "s4",
    start: 128,
    voice: "beaver",
    speaker: "CASTOR",
    lines: ["LEER Y GUARDAR", "ARCHIVOS."],
  },
  {
    id: "s5a",
    scene: "s5",
    start: 12,
    voice: "teacher",
    speaker: "MAESTRA",
    lines: ["PREPARA MI SEMANA."],
  },
  {
    id: "s5b",
    scene: "s5",
    start: 60,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["VOY A CONSULTARLO."],
  },
  {
    id: "s5c",
    scene: "s5",
    start: 186,
    voice: "turtle",
    speaker: "TORTUGA",
    lines: ["¿PERMITES LEER", "TUS ARCHIVOS?"],
  },
  {
    id: "s5d",
    scene: "s5",
    start: 304,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["¡LISTO, PROFE!"],
  },
  {
    id: "s6a",
    scene: "s6",
    start: 12,
    voice: "fox",
    speaker: "ZORRO",
    lines: ["SOY UNA BASE DE", "NOTAS. ¿ME ENCHUFAS?"],
  },
  {
    id: "s6b",
    scene: "s6",
    start: 112,
    voice: "owl",
    speaker: "BÚHO",
    lines: ["¡SIN CABLES NUEVOS!"],
  },
];

export const lineById = (id: string) => LINES.find((l) => l.id === id)!;

/** Otros eventos (frames locales) que usan tanto las escenas como el sonido. */
export const EV = {
  s1: { title: 0, lock: 100 },
  s2: {
    squirrelIn: 0,
    try1: 44, // el enchufe cuadrado llega al puerto del búho
    bounce1: 66,
    beaverIn: 84,
    try2: 128,
    bounce2: 150,
    dizzy: 172,
    tangle: 196,
    caption: 206,
  },
  s3: {
    turtleIn: 0,
    title: 96,
    subtitle: 118,
    fly: 132,
    plugOwl: 156,
    cableOut: 160,
    plugSq: 184,
    plugBv: 194,
    caption1: 204,
    caption2: 224,
  },
  s4: { tagOwl: 14, tagSq: 58, tagBv: 122, card1: 190, card2: 236, card3: 282 },
  s5: {
    toSquirrel: 104,
    backSquirrel: 128,
    toBeaver: 148,
    turtleIn: 172,
    askPermission: 186,
    cursorMove: 244,
    click: 270,
    granted: 276,
    board: 292,
    heart: 332,
  },
  s6: { foxIn: 0, plug: 100, eqIn: 140, count1: 150, count2: 176, win: 214 },
  s7: {
    title: 10,
    sub: 44,
    clear: 80,
    credits: 130,
    fireworks: [20, 40, 60, 100, 120],
  },
};

/** Textos sueltos (no son diálogos). */
export const STORY_TEXTS = {
  s1: {
    title: "¿QUÉ ES UN MCP?",
    caption: "SABE MUCHO, PERO NO PUEDE TOCAR NADA",
  },
  s2: { caption: "CADA HERRAMIENTA, SU PROPIO CABLE" },
  s3: {
    title: "MCP",
    sub: "MODEL CONTEXT PROTOCOL",
    c1: "UNA TOMA UNIVERSAL",
    c2: "UN ESTÁNDAR ABIERTO",
  },
  s4: {
    owlTag: "CLIENTE|LA IA",
    sqTag: "SERVIDOR|AGENDA",
    bvTag: "SERVIDOR|ARCHIVOS",
    cards: [
      { title: "HERRAMIENTAS", sub: "ACCIONES QUE HACE" },
      { title: "RECURSOS", sub: "DATOS QUE LEE" },
      { title: "PROMPTS", sub: "PLANTILLAS LISTAS" },
    ],
  },
  s5: {
    permission: "PERMISO",
    yes: "SÍ",
    no: "NO",
    caption: "TÚ DECIDES QUÉ PUEDE HACER",
    board: "PLAN DE LA SEMANA",
    days: [
      "LU · AGENDA LIBRE",
      "MA · FRACCIONES",
      "MI · REVISAR TAREAS",
      "JU · QUIZ RÁPIDO",
      "VI · CIERRE Y NOTAS",
    ],
  },
  s6: {
    without: "SIN MCP",
    withMcp: "CON MCP",
    e1: "5 × 4 = 20",
    e1b: "CABLES",
    e2: "5 + 4 = 9",
    e2b: "ENCHUFES",
    caption: "NUEVO AMIGO, MISMO ENCHUFE",
  },
  s7: {
    title: "MCP",
    sub: "LA TOMA UNIVERSAL DE TU IA",
    clear: "¡JUEGO COMPLETADO!",
    credits: "ANIMACIÓN CON CÓDIGO · REMOTION",
  },
};
