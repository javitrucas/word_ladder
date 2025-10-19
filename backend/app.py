from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import generar_partida_rapida

app = FastAPI()

# Permitir CORS para React en localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción, restringir a tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"mensaje": "API de Chain Words funcionando"}

@app.get("/nueva_partida")
def nueva_partida():
    partida = generar_partida_rapida(longitud_cadena=5)
    return partida
