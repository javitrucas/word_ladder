import unicodedata

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