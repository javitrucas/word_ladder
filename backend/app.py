from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import (
    obtener_cadenas,
    comprobar_cadena,
    puntuacion_cadena,
    palabras_dict,
    existe_palabra,
    es_vecina,
    generar_partida_rapida
)
import random

app = FastAPI(title="Word Ladder API")

# Habilitar CORS para permitir conexión con React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"mensaje": "Bienvenido a Word Ladder API"}

@app.get("/nueva_partida")
def nueva_partida():
    partida = generar_partida_rapida(longitud_cadena=5)
    partida["puntuacion_solucion"] = puntuacion_cadena(partida["solucion"])
    return partida

@app.post("/comprobar_palabra")
def comprobar_palabra(palabra_actual: str, palabra_nueva: str):
    existe, _ = existe_palabra(palabra_nueva)
    if not existe:
        return {"valida": False, "motivo": "No existe en el diccionario"}
    if not es_vecina(palabra_actual, palabra_nueva):
        return {"valida": False, "motivo": "No es vecina de la anterior"}
    return {"valida": True}

@app.post("/puntuacion")
def puntuacion(cadena: list[str]):
    if not comprobar_cadena(cadena):
        return {"valida": False, "mensaje": "La cadena no es correcta"}
    puntos = puntuacion_cadena(cadena)
    return {"valida": True, "puntuacion": puntos}
