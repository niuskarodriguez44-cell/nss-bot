# Sonidos usados

La banda sonora (`public/audio/soundtrack.wav`, 90 s, 48 kHz estéreo) se genera con `scripts/make_audio.py` y sigue `src/timeline.ts`.

## CC0 de terceros
Paquete **Interface Sounds** de Kenney (Kenney Vleugels, https://kenney.nl). Licencia Creative Commons Zero (CC0 1.0), uso personal y comercial, crédito no obligatorio. Copia utilizada: https://github.com/Calinou/kenney-interface-sounds (la licencia está en `audio/kenney/LICENSE.txt`).

| Archivo | Uso |
|---|---|
| `tick_004.wav` | clic suave al entrar cada subtítulo/rótulo |
| `open_003.wav` | aparición del nombre del instituto (E1) |
| `select_007.wav` | decisión del enrutador (E4) |
| `confirmation_001.wav` | salida combinada (E4) |
| `glass_006.wav` | nodos del isotipo y las tres áreas de AIRE MoE (E5, E6) |
| `pluck_001.wav` | palabras absorbidas por el isotipo (E5) |

(`glass_002`, `tick_001`, `maximize_008` están copiados pero no se usan en esta versión.)

## Síntesis original (sin licencia de terceros)
Whooshes de transición, riser, golpe/boom de entrada a AIRE MoE, campanas, destellos (shimmer), pulsos graves y cama ambiente: generados con numpy/scipy en `scripts/make_audio.py`.

## Bibliotecas profesionales que sí convendría usar para la versión final
No son accesibles desde el entorno de desarrollo (Freesound, Pixabay, Mixkit bloqueados); descargar y sustituir si se desea más calidad:
- Sonniss GameAudioGDC (royalty-free, sin atribución; verificar la licencia del paquete concreto): https://sonniss.com/gameaudiogdc
- Freesound filtrando por CC0: https://freesound.org
- Kenney (CC0): https://kenney.nl/assets?q=audio
