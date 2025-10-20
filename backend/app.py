from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from utils import (
    obtener_cadenas,
    comprobar_cadena,
    puntuacion_cadena,
    palabras_dict,
    existe_palabra,
    es_vecina,
    generar_partida_rapida,
    palabra_repetida,
    colores_letras,
    actualizar_vidas,
    graficar_todas_cadenas
)
import random

app = FastAPI(title="Word Ladder API")

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
    partida = generar_partida_rapida(longitud_cadena=10)
    partida["puntuacion_solucion"] = puntuacion_cadena(partida["solucion"])
    partida["vidas"] = 3  # Inicializamos vidas
    partida["palabras_usadas"] = [partida["inicio"]]  # La primera palabra ya usada
    return partida

@app.post("/jugada")
def jugada(
    palabra_actual: str = Body(...),
    palabra_nueva: str = Body(...),
    palabras_usadas: list[str] = Body(...),
    vidas: int = Body(...)
):
    # Verificar si la palabra existe
    existe, score = existe_palabra(palabra_nueva)
    
    # Inicializamos el resultado
    resultado = {"valida": True, "motivo": "", "colores": [], "vidas": vidas, "game_over": False}

    # Palabra repetida
    if palabra_repetida(palabra_nueva, palabras_usadas):
        resultado["valida"] = False
        resultado["motivo"] = "La palabra ya ha sido usada"
        return resultado

    # Palabra no existe
    if not existe:
        resultado["valida"] = False
        resultado["motivo"] = "No existe en el diccionario"
        vidas, game_over = actualizar_vidas(vidas, False)
        resultado["vidas"] = vidas
        resultado["game_over"] = game_over
        return resultado

    # No es vecina
    if not es_vecina(palabra_actual, palabra_nueva):
        resultado["valida"] = False
        resultado["motivo"] = "No es vecina de la anterior"
        return resultado

    # Palabra válida: calculamos colores y actualizamos vidas
    resultado["colores"] = colores_letras(palabra_nueva, palabra_actual)
    resultado["vidas"] = vidas  # No se resta vida si es correcta
    palabras_usadas.append(palabra_nueva)  # Guardamos palabra usada

    return resultado

@app.post("/puntuacion")
def puntuacion(cadena: list[str]):
    if not comprobar_cadena(cadena):
        return {"valida": False, "mensaje": "La cadena no es correcta"}
    puntos = puntuacion_cadena(cadena)
    return {"valida": True, "puntuacion": puntos}

@app.post("/puntuacion_detallada")
def puntuacion_detallada(cadena: list[str] = Body(...)):
    """
    Recibe una lista de palabras y devuelve:
    - detalles: lista de {palabra, puntuacion (int or None)}
    - total: suma de las puntuaciones válidas
    """
    detalles = []
    total = 0
    for w in cadena:
        existe, score = existe_palabra(w)
        if existe and score is not None:
            detalles.append({"palabra": w, "puntuacion": int(score)})
            total += int(score)
        else:
            detalles.append({"palabra": w, "puntuacion": None})
    return {"detalles": detalles, "total": total}

from fastapi.responses import JSONResponse

@app.post("/grafo")
def grafo(cadena_usuario: list[str] = Body(...), partida: dict = Body(...), max_cadenas_extra: int = 10, tiempo_max: int = 5):
    try:
        # graficar_todas_cadenas ahora devuelve el HTML como string
        html = graficar_todas_cadenas(
            cadena_usuario=cadena_usuario,
            partida=partida,
            max_cadenas_extra=max_cadenas_extra,
            tiempo_max=tiempo_max,
            render=False  # añadimos un parámetro para devolver string
        )
        return JSONResponse(content={"html": html})
    except Exception as e:
        return JSONResponse(content={"error": str(e)})
