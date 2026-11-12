# SkillExplainer

Video motion graphics (Remotion + React + TypeScript) que explica qué es una "Skill" de IA para docentes.
1920x1080 · 30 fps · 600 frames (20 s) · composition id `SkillExplainer`.

```bash
cd skill-explainer
npm install
npx remotion studio                          # vista previa
npx remotion render SkillExplainer out/skill.mp4
```

- Textos editables: objeto `TEXTS` al inicio de `src/SkillExplainer.tsx`.
- Música opcional: coloca `public/music.mp3` (si no existe, se omite el audio).
