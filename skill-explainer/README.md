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

## Video 2 · AgentPlanner (60 s)
Cómo un agente de IA ayuda a planificar clases a largo plazo (cámara virtual, cursor, UI estilo editorial).
```bash
npx remotion render AgentPlanner out/agent_planner.mp4
```
Código en `src/agent/`; textos en `AGENT_TEXTS` (`src/agent/AgentPlanner.tsx`); tiempos en `src/agent/theme.ts`.

## Sonido
- Efectos: pack **uisfx** (CC0) incluido con la skill Real SFX → `python3 scripts/build_sfx_pack.py` los copia a `public/sfx/`.
- Música: generada con `python3 scripts/make_audio.py skill|agent` (síntesis propia).
