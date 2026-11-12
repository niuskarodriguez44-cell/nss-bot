# SkillExplainer

Video motion graphics (Remotion + React + TypeScript) que explica qué es una "Skill" de IA para docentes.
1920x1080 · 30 fps · 1380 frames (46 s) · composition id `SkillExplainer`.

```bash
cd skill-explainer
npm install
npx remotion studio                          # vista previa
npx remotion render SkillExplainer out/skill.mp4
```

## Escenas
1. Hook · 2. Problema · 3. Construir la skill · 4. Skill de ejemplo (SKILL.md real) ·
5. Cómo la usa Claude · 6. Resultado reutilizable. Tiempos en `src/timeline.ts`.

## Textos
Objeto `TEXTS` al inicio de `src/SkillExplainer.tsx`.

## Audio
`public/music.mp3` y `public/sfx/*.mp3` se generan con síntesis propia (sin copyright):

```bash
python3 scripts/make_audio.py     # requiere numpy
```

Los efectos están sincronizados por frame en `src/Soundtrack.tsx`.
Si falta algún archivo de audio, se omite sin romper el render.
