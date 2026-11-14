# Dirección de arte · referencia DeepMind / Gemini

Fuentes leídas el 2026-11-14 (inspiración de principios, no copia; sin assets, tipografía, logos ni gradiente de Google):
- Art&Graft sobre la identidad de Gemini 3: https://abduzeedo.com/node/89300
- Google Design, «Illustrating the Gemini App»: https://design.google/library/gemini-ai-visual-design
- someform Studio, kit 3D de DeepMind: https://www.stashmedia.tv/deep-inside-the-deepmind-rebrand-with-someform-studio/
- Hero de https://deepmind.google/models/gemini/ (vídeo de fondo, analizado fotograma a fotograma)

## Principios citados en las fuentes
1. Partículas como banco de peces: puntos y píldoras que se mueven juntos, cambian de dirección y mantienen la estructura.
2. Dos estados: ambiente (movimiento tranquilo) y activo (formas deliberadas).
3. Elongación: se estiran al viajar y se contraen al asentarse.
4. Movimiento con intención: cada animación tiene inicio y fin definidos y flujo direccional; la actividad interna comunica pensamiento; la velocidad da anticipación y luego liberación.
5. Gradientes con borde delantero nítido y cola difusa: transferencia de energía y dirección.
6. Un círculo/forma como recipiente que concentra la energía en un punto afilado y luego la libera hacia afuera.
7. Suavidad: «cálido, espacial, redondeado», etéreo; borde suave y mucho espacio negativo.
8. Abstracciones 3D: cada forma representa un concepto (AGI) y el relato detrás de la abstracción importa tanto como la imagen.
9. Evitar los tópicos de la IA (redes neuronales, flujos de datos genéricos): presentar el sistema como colaborador reflexivo, no como máquina.

## Lo observado en el hero de deepmind.google/models/gemini (vídeo, 50 s)
- Fondo negro puro; el protagonismo es una sola cosa a la vez.
- Una píldora de entrada («Ask Gemini») con el texto escribiéndose; después, resultados que pasan de imagen real a una forma abstracta limpia (trazo fino blanco, mapa topográfico, nube de partículas).
- Planos muy limpios, mucho aire alrededor, tipografía sans pequeña y ligera.
Límite: el CSS publicado no expone curvas de easing ni tiempos numéricos; mantenemos nuestro `bezier(0.16, 1, 0.3, 1)`.

## Traducción a AliceMaf 12B + AIRE MoE
- Un único campo de partículas con estados ambiente/activo (ya implementado), un solo foco por plano.
- El enrutador concentra las partículas en un punto afilado y las libera hacia los expertos activos (metáfora 6).
- Más espacio negativo, texto más pequeño y ligero, trazo fino; menos blanco quemado (más cola difusa, borde delantero nítido).
- Paleta propia únicamente: índigo → cian sobre azul tinta.
