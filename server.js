const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

/*
FIREBASE CONFIG SIMPLE
*/

const base64 = process.env.FIREBASE_KEY_BASE64;

const json = Buffer.from(base64, "base64").toString("utf8");

const serviceAccount = JSON.parse(json);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("🔥 Firebase conectado");

/*
RUTA TEST
*/

app.get("/", (req, res) => {
  res.send("Servidor activo");
});

/*
WEBHOOK
*/

app.post("/webhook", async (req, res) => {

  try {

    await db.collection("test").add({
      mensaje: "Webhook funcionando",
      data: req.body,
      fecha: new Date()
    });

    res.send("Guardado en Firebase");

  } catch (error) {

    console.error(error);

    res.status(500).send("Error");

  }

});

/*
PORT
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
