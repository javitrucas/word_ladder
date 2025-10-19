import unicodedata
import time

# Crear diccionario de palabras y sus puntuaciones desde el archivo generado
palabras_dict = {}

with open("data/palabras.txt", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("#") or line.strip() == "palabra,puntuacion":
            continue
        parts = line.strip().split(",", 1)
        if len(parts) < 2:
            continue
        palabra, score = parts[0].strip(), parts[1].strip()
        palabras_dict[palabra] = int(float(score))

# Función para verificar si una palabra existe y obtener su puntuación
def existe_palabra(palabra):
    score = palabras_dict.get(palabra)
    if score is None:
        return False, None
    return True, score

#print(existe_palabra("despiojar"))

# Función para obtener palabras según su puntuación
def palabra_segun_score(score):
    list=[]

    for p in palabras_dict:
        if palabras_dict[p]==score:
            list.append(p)

    return list

# print(palabra_segun_score(25))

# Función para quitar tildes, conservando la tilde de la ñ
def _quitar_tildes(s):
        n = unicodedata.normalize("NFD", s)
        filtered = []
        for ch in n:
            # conservar la tilde de la ñ (U+0303), eliminar demás marcas diacríticas
            if unicodedata.combining(ch) and ord(ch) != 0x0303:
                continue
            filtered.append(ch)
        return unicodedata.normalize("NFC", "".join(filtered))

# print(_quitar_tildes("año, acción, pingüino, corazón"))

# Función para verificar si dos palabras son vecinas (difieren en una letra o son iguales)
def es_vecina(palabra1, palabra2):
    palabra1 = palabra1.lower()
    palabra2 = palabra2.lower()

    palabra1 = _quitar_tildes(palabra1)
    palabra2 = _quitar_tildes(palabra2)

    if len(palabra1) != len(palabra2):
        return False
    diferencias = sum(1 for a, b in zip(palabra1, palabra2) if a != b)
    return diferencias == 1 or diferencias == 0

# print(es_vecina("casa","caja"))

# Función para comprobar si una cadena de palabras es correcta
def comprobar_cadena(cadena):
    correcta=True

    for i in range(len(cadena)-1):
        if not es_vecina(cadena[i],cadena[i+1]):
            correcta=False
    
    return correcta

# cadena=["casa","caja","cala","cola","cola"]
# print(comprobar_cadena(cadena))

# Función para obtener la puntuación total de una cadena de palabras
def puntuacion_cadena(cadena):
    puntuacion_total=0

    for palabra in cadena:
        existe, score = existe_palabra(palabra)
        if existe:
            puntuacion_total += score

    return puntuacion_total

# cadena=["casa","caja","cala","cola","cola"]
# print(puntuacion_cadena(cadena))

# Funcion para obtener la cadena más corta entre dos palabras dadas
import time

def obtener_cadenas(palabra_inicio, palabra_fin, max_caminos=None, tiempo_max=None):

    if palabra_inicio not in palabras_dict or palabra_fin not in palabras_dict:
        return None

    palabra_inicio = palabra_inicio.lower()
    palabra_fin = palabra_fin.lower()
    largo = len(palabra_inicio)

    palabras_mismo_largo = {p for p in palabras_dict if len(p) == largo}

    cola = [[palabra_inicio]]  # BFS: lista de caminos
    cadenas_encontradas = []
    encontrado = False

    t_inicio = time.time() if tiempo_max is not None else None

    while cola:
        # Comprobar tiempo si aplica
        if tiempo_max is not None and (time.time() - t_inicio > tiempo_max):
            print(f"Tiempo máximo ({tiempo_max}s) alcanzado.")
            break

        siguiente_nivel = []

        for camino in cola:
            ultima = camino[-1]

            for vecino in palabras_mismo_largo:
                if vecino in camino:
                    continue
                if es_vecina(ultima, vecino):
                    nuevo_camino = camino + [vecino]

                    if vecino == palabra_fin:
                        cadenas_encontradas.append(nuevo_camino)
                        encontrado = True
                        # Si solo queremos la primera cadena, devolvemos directamente
                        if max_caminos == 1:
                            return [nuevo_camino]
                    else:
                        siguiente_nivel.append(nuevo_camino)

        if encontrado and max_caminos is None:
            # Si encontramos al menos una cadena, solo seguimos con este nivel
            # para capturar todas las cadenas de longitud mínima
            cola = siguiente_nivel
            encontrado = False  # no salir todavía
            continue

        cola = siguiente_nivel

        if max_caminos is not None and len(cadenas_encontradas) >= max_caminos:
            break

    return cadenas_encontradas if cadenas_encontradas else None

# print(obtener_cadenas("pato","lago",max_caminos=2))
# print(puntuacion_cadena(obtener_cadenas("pato","lago",max_caminos=2)[0]))