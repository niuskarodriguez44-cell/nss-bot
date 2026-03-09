const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

/*
========================
FIREBASE CONFIG
========================
*/

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  })
});

const db = admin.firestore();

console.log("🔥 Firebase conectado correctamente");

/*
========================
TEST SERVER
========================
*/

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

/*
========================
WEBHOOK
========================
*/

app.post("/webhook", async (req, res) => {

  try {

    const data = req.body;

    console.log("Webhook recibido:", data);

    await db.collection("webhooks").add({
      data: data,
      fecha: new Date()
    });

    res.status(200).send("Webhook recibido");

  } catch (error) {

    console.error("Error webhook:", error);

    res.status(500).send("Error");

  }

});

/*
========================
PORT
========================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
