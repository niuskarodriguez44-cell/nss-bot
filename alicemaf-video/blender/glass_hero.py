# Plano hero AIRE MoE: paneles de vidrio atravesados por hilos de luz cian. Uso:
# blender -b -P glass_hero.py -- <frame> <out.png> [res_pct] [samples]
import bpy, math, sys, random
argv = sys.argv[sys.argv.index('--') + 1:]
frame, out = int(argv[0]), argv[1]
pct = int(argv[2]) if len(argv) > 2 else 100
samples = int(argv[3]) if len(argv) > 3 else 48
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples
sc.cycles.use_denoising = False
sc.cycles.max_bounces = 6; sc.cycles.transmission_bounces = 6
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1920, 1080, pct
sc.render.fps = 30; sc.render.image_settings.file_format = 'PNG'; sc.render.filepath = out
sc.frame_set(frame)
t = frame / 30.0
INK, INDIGO, CYAN = (0.0027, 0.0044, 0.0185, 1), (0.093, 0.112, 0.89, 1), (0.168, 0.807, 0.846, 1)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs[0].default_value = INK
w.node_tree.nodes['Background'].inputs[1].default_value = 1.0
def mat_glass():
    m = bpy.data.materials.new('glass'); m.use_nodes = True; n = m.node_tree.nodes; n.clear()
    o = n.new('ShaderNodeOutputMaterial'); g = n.new('ShaderNodeBsdfGlass')
    g.inputs['Color'].default_value = (0.35, 0.5, 1.0, 1); g.inputs['Roughness'].default_value = 0.02; g.inputs['IOR'].default_value = 1.45
    m.node_tree.links.new(g.outputs[0], o.inputs[0]); return m
def mat_emit(col, s):
    m = bpy.data.materials.new('e'); m.use_nodes = True; n = m.node_tree.nodes; n.clear()
    o = n.new('ShaderNodeOutputMaterial'); e = n.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = col; e.inputs['Strength'].default_value = s
    m.node_tree.links.new(e.outputs[0], o.inputs[0]); return m
def mat_floor():
    m = bpy.data.materials.new('floor'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.01, 0.015, 0.05, 1); b.inputs['Roughness'].default_value = 0.08; b.inputs['Metallic'].default_value = 0.6
    return m
glass, floor = mat_glass(), mat_floor()
# suelo reflectante
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -1.6)); bpy.context.object.data.materials.append(floor)
# paneles de vidrio apilados (eje X = dirección del flujo)
for k, x in enumerate([-3.2, -1.1, 1.1, 3.2]):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, 0.2)); p = bpy.context.object
    p.scale = (0.12, 3.6, 2.9); p.rotation_euler = (0, 0, math.radians(6 * (k - 1.5)))
    bev = p.modifiers.new('b', 'BEVEL'); bev.width = 0.01; bev.segments = 2
    p.data.materials.append(glass)
# hilos de luz: curvas que se estrechan al pasar el vidrio (foco en x≈0)
random.seed(7)
LIT = [mat_emit(CYAN, 14), mat_emit(INDIGO, 22)]
for k in range(46):
    y0, z0 = random.uniform(-2.8, 2.8), random.uniform(-1.4, 2.2)
    pts = []
    for s in range(41):
        x = -9 + s * 0.45
        sq = 1 - 0.86 * math.exp(-((x - 0.0) ** 2) / 7.0)
        pts.append((x, y0 * sq + 0.08 * math.sin(x * 1.3 + k), z0 * sq + 0.2))
    cu = bpy.data.curves.new('c%d' % k, 'CURVE'); cu.dimensions = '3D'
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, p_ in enumerate(pts): sp.points[i].co = (*p_, 1)
    cu.bevel_depth = 0.012; cu.bevel_resolution = 2
    ob = bpy.data.objects.new('l%d' % k, cu); sc.collection.objects.link(ob)
    ob.data.materials.append(LIT[k % 5 == 0])
    # pulso de luz viajero: esfera emisiva que recorre la curva
    ph = ((t * 0.55 + random.random()) % 1.0)
    i = int(ph * 40); px_, py_, pz_ = pts[i]
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(px_, py_, pz_), segments=12, ring_count=8)
    bpy.context.object.data.materials.append(mat_emit((0.9, 1, 1, 1), 60))
# luces suaves de relleno
for loc, col, e in (((0, -6, 4), (0.3, 0.4, 1), 400), ((0, 6, 3), (0.15, 0.8, 0.9), 300)):
    L = bpy.data.lights.new('a', 'AREA'); L.energy = e; L.color = col[:3]; L.size = 5
    o = bpy.data.objects.new('a', L); o.location = loc; sc.collection.objects.link(o)
    o.rotation_euler = (math.radians(65) if loc[1] < 0 else math.radians(-65), 0, 0)
# cámara con deriva lenta (dolly + orbit)
cam = bpy.data.cameras.new('cam'); cam.lens = 38; cam.dof.use_dof = True; cam.dof.focus_distance = 11; cam.dof.aperture_fstop = 4.0
co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
a = math.radians(-32 + 6 * math.sin(t * 0.35)); d = 12.5 - t * 0.25
co.location = (math.sin(a) * d, -math.cos(a) * d, 2.0 + 0.2 * math.sin(t * 0.3))
tgt = bpy.data.objects.new('t', None); tgt.location = (0, 0, 0.3); sc.collection.objects.link(tgt)
tc = co.constraints.new('TRACK_TO'); tc.target = tgt; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
# compositor: resplandor (glare) para el acabado cinematográfico
sc.use_nodes = True; nt = sc.node_tree; nt.nodes.clear()
rl = nt.nodes.new('CompositorNodeRLayers'); gl = nt.nodes.new('CompositorNodeGlare'); gl.glare_type = 'FOG_GLOW'; gl.quality = 'MEDIUM'; gl.threshold = 0.8; gl.size = 7
cp = nt.nodes.new('CompositorNodeComposite')
nt.links.new(rl.outputs[0], gl.inputs[0]); nt.links.new(gl.outputs[0], cp.inputs[0])
bpy.ops.render.render(write_still=True)
