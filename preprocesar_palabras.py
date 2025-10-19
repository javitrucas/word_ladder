import re
import numpy as np
import unicodedata

def quitar_tildes(s: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize('NFD', s)
        if unicodedata.category(c) != 'Mn'
    )

frecuencias = {}

with open("data/frecuencias_palabras.txt", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("#"):
            continue
        # Captura líneas con formato: número. palabra número número
        m = re.match(r"\s*\d+\.\s*([^\s]+)\s+([\d,]+)", line)
        if m:
            palabra = quitar_tildes(m.group(1).lower())  # quitamos tildes
            freq = int(m.group(2).replace(",", ""))      # quitar comas de miles
            frecuencias[palabra] = freq

max_freq = max(frecuencias.values())
min_freq = min(frecuencias.values())

with open("data/palabras_raw.txt", "r", encoding="utf-8") as f:
    palabras = [
        quitar_tildes(line.strip().lower())  # quitamos tildes
        for line in f
        if line.strip() and not line.lstrip().startswith("#")
    ]

def calcular_puntuacion(palabra):
    freq = frecuencias.get(palabra, None)
    if freq is None:
        return 25  # palabra no encontrada -> muy rara
    norm = (freq - min_freq) / (max_freq - min_freq)
    puntuacion = 1 + 24 * (1 - norm)  # rango 1–25
    return int(round(puntuacion))

with open("data/palabras.txt", "w", encoding="utf-8") as out:
    out.write("palabra,puntuacion\n")
    for p in palabras:
        out.write(f"{p},{calcular_puntuacion(p)}\n")

print("✅ Archivo generado: data/palabras.txt")
