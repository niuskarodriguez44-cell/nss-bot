const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// TU PROYECTO FIREBASE
const PROJECT_ID = "contabilidad-wqr";

// RUTA PRINCIPAL
app.get("/", (req,res)=>{
    res.send("NSS Bot funcionando");
});

// BOT
app.post("/bot", async (req,res)=>{

    const mensaje = req.body.message;

    try{

        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/inventario`;

        const response = await fetch(url);
        const data = await response.json();

        let productos = [];

        if(data.documents){

            data.documents.forEach(doc=>{

                const f = doc.fields;

                productos.push({
                    nombre: f.nombre.stringValue,
                    precio: f.precio.integerValue,
                    stock: f.stock.integerValue
                });

            });

        }

        let respuesta = "Productos disponibles:\n";

        productos.forEach(p=>{
            respuesta += `${p.nombre} - $${p.precio} (${p.stock})\n`;
        });

        res.json({
            reply: respuesta
        });

    }catch(error){

        res.json({
            reply:"Error leyendo inventario"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log("NSS Bot activo en puerto " + PORT);
});