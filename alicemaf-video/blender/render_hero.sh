#!/bin/bash
# Renderiza el plano hero (68 fotogramas) y lo codifica a 30 fps con interpolación de movimiento.
cd "$(dirname "$0")"
for f in $(seq 0 67); do
  o=../out/blender/aire/$(printf "%04d" $f).png
  [ -f "$o" ] || blender -b -P glass_hero.py -- $f "$o" 100 40 > /dev/null 2>&1
done
mkdir -p ../public/hero
ffmpeg -y -v error -framerate 4 -i ../out/blender/aire/%04d.png -vf "minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,format=yuv420p" -c:v libx264 -crf 14 -preset medium ../public/hero/aire.mp4
echo done > ../out/blender/aire/DONE
