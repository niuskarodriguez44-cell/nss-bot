const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// leer credencial desde Railway
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("NSS BOT funcionando");
});

// consultar inventario
app.get("/producto/:nombre", async (req, res) => {
  const nombre = req.params.nombre;

  const snapshot = await db
    .collection("productos")
    .where("nombre", "==", nombre)
    .get();

  if (snapshot.empty) {
    return res.json({ mensaje: "Producto no encontrado" });
  }

  const producto = snapshot.docs[0].data();

  res.json(producto);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor NSS activo en puerto", PORT);
});
