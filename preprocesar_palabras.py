import re
import unicodedata

num_puntuaciones = 25
quitar_tildes_opcional = True

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
        m = re.match(r"\s*\d+\.\s*([^\s]+)\s+([\d,]+)", line)
        if m:
            palabra = m.group(1).lower()
            if quitar_tildes_opcional:
                palabra = quitar_tildes(palabra)
            freq = int(m.group(2).replace(",", ""))
            frecuencias[palabra] = freq

with open("data/palabras_raw.txt", "r", encoding="utf-8") as f:
    palabras_raw = [line.strip().lower() for line in f if line.strip()]
    if quitar_tildes_opcional:
        palabras_raw = [quitar_tildes(p) for p in palabras_raw]

# Palabras en frecuencias primero, luego las que solo están en raw
palabras_completas = list(frecuencias.keys())
for p in palabras_raw:
    if p not in frecuencias:
        palabras_completas.append(p)

total_palabras = len(palabras_completas)
palabras_por_bloque = total_palabras // num_puntuaciones

# Las que no tienen frecuencia se ponen al final
palabras_ordenadas = sorted(
    palabras_completas,
    key=lambda x: frecuencias.get(x, -1),  # -1 para las raras
    reverse=True
)

puntuaciones = {}
for i, palabra in enumerate(palabras_ordenadas):
    bloque = i // palabras_por_bloque
    bloque = min(bloque, num_puntuaciones - 1)
    puntuaciones[palabra] = bloque + 1

with open("data/palabras.txt", "w", encoding="utf-8") as out:
    out.write("palabra,puntuacion\n")
    for p in palabras_raw:
        score = puntuaciones.get(p, num_puntuaciones)
        out.write(f"{p},{score}\n")

print(f"✅ Archivo generado: data/palabras.txt con {num_puntuaciones} niveles de puntuación")
