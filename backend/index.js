const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Cargar palabras y puntuaciones
const palabras_dict = {};
const lines = fs.readFileSync("../data/palabras.txt", "utf8").split("\n");
lines.forEach(line => {
    if(!line || line.startsWith("palabra")) return;
    const [palabra, score] = line.split(",");
    palabras_dict[palabra.trim()] = parseInt(score);
});

// Función simple para verificar si dos palabras son vecinas
function es_vecina(p1, p2) {
    if(p1.length !== p2.length) return false;
    let diff = 0;
    for(let i=0;i<p1.length;i++){
        if(p1[i]!==p2[i]) diff++;
        if(diff>1) return false;
    }
    return diff===1;
}

app.get("/", (req,res)=>{
    res.send("Servidor backend funcionando. Usa /api/iniciar o /api/verificar");
});

// Ruta para iniciar juego
app.get("/api/iniciar", (req, res) => {
    const palabras = Object.keys(palabras_dict).filter(p => p.length>=4 && p.length<=5);
    let inicio, fin;
    while(true){
        inicio = palabras[Math.floor(Math.random()*palabras.length)];
        fin = palabras[Math.floor(Math.random()*palabras.length)];
        if(inicio!==fin) break;
    }
    res.json({palabraInicio: inicio, palabraFin: fin});
});

// Ruta para verificar palabra
app.post("/api/verificar", (req,res)=>{
    const { palabraAnterior, palabraActual } = req.body;
    const existe = palabras_dict[palabraActual] !== undefined;
    const vecina = es_vecina(palabraAnterior, palabraActual);
    res.json({valida: existe && vecina});
});

const port = 3001;
app.listen(port, ()=>console.log(`Servidor backend corriendo en http://localhost:${port}`));
