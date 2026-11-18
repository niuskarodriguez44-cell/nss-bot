# CubanBot vertical · guion de narración (con etiquetas de emoción para ElevenLabs v4)

Voz usada antes: "Carlos Garza | Mexican Narrator" (voice_id HS7W0ly7cmPolP5WMyz9), modelo eleven_v4.

```
[curious, intrigued] Tu IA responde en segundos... [pause] ¿y después? [pause]
[serious, slower] Los trabajos de verdad no duran segundos. [pause] Duran semanas. [pause]
[hopeful, warm] Imagina un equipo que no pierde el hilo... del día uno, [pause] al día treinta. [pause]
[excited, energetic] ¡Presentamos CubanBot! Agentes que investigan, programan... y automatizan por ti. [pause]
[confident] Conecta tus apps una vez, y deja que trabajen. [pause]
[softly, tender] Incluso... mientras duermes. [long pause]
[warmly, inspiring] Tú decides el rumbo. [pause] Ellos hacen el camino. [pause]
[excited, proud] CubanBot. [pause] [smiling] Próximamente.
```

Al tener el mp3: guardarlo como `public/vertical/narracion.mp3`, medir las frases con
`python3 scripts/narration_segments.py 8` (ajustando la ruta) y poner esos valores en `SEG` de
`src/vertical/theme.ts` y en `scripts/make_music_vertical.py`.
