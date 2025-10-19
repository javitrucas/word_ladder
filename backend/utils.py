import unicodedata
import time
import random

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

# Función para generar una partida rápida con una cadena de longitud dada
def generar_partida_rapida(longitud_cadena=5):
    palabras_posibles = [p for p in palabras_dict if 2 <= len(p) <= 5]

    palabra_actual = random.choice(palabras_posibles)
    cadena = [palabra_actual]

    for _ in range(longitud_cadena - 1):
        # Buscar vecinos válidos de la palabra actual
        vecinos = [p for p in palabras_posibles if es_vecina(palabra_actual, p) and p not in cadena]
        if not vecinos:
            break  # no hay vecinos, termina la cadena
        palabra_actual = random.choice(vecinos)
        cadena.append(palabra_actual)

    palabra_inicio = cadena[0]
    palabra_fin = cadena[-1]

    return {
        "inicio": palabra_inicio,
        "fin": palabra_fin,
        "solucion": cadena
    }

# print(generar_partida_rapida(5))

# Funciones adicionales para la gestión de partidas
def palabra_repetida(palabra, palabras_usadas):
    """Devuelve True si la palabra ya se ha usado en la partida."""
    return palabra in palabras_usadas

def colores_letras(palabra_actual, palabra_anterior):
    """
    Devuelve una lista con colores para cada letra:
    'green' si coincide con la palabra anterior en la misma posición
    'yellow' si la letra está en la palabra anterior pero en otra posición
    'none' si no coincide
    """
    colores = []
    for i, letra in enumerate(palabra_actual):
        if palabra_anterior and i < len(palabra_anterior):
            if letra == palabra_anterior[i]:
                colores.append('green')
            elif letra in palabra_anterior:
                colores.append('yellow')
            else:
                colores.append('none')
        else:
            colores.append('none')
    return colores

def actualizar_vidas(vidas, palabra_existe):
    """
    Resta una vida si la palabra no existe, devuelve nuevas vidas y si se acabó el juego.
    """
    if not palabra_existe:
        vidas -= 1
    return vidas, vidas <= 0

from pyvis.network import Network
import networkx as nx
from utils import obtener_cadenas

def graficar_todas_cadenas(cadena_usuario, partida, max_cadenas_extra=3, tiempo_max=5, render=True):
    G = nx.Graph()
    inicio = partida['inicio']
    fin = partida['fin']

    # 1️⃣ Cadena generada (verde)
    if partida.get('solucion'):
        for i in range(len(partida['solucion']) - 1):
            G.add_edge(partida['solucion'][i], partida['solucion'][i+1], color='green', width=3)

    # 2️⃣ Cadena del usuario (azul)
    if cadena_usuario[0] != inicio:
        print("La cadena del usuario no empieza en la palabra inicial.")
        return
    if cadena_usuario[-1] == fin:
        print("¡Usuario completó la cadena!")
    for i in range(len(cadena_usuario) - 1):
        G.add_edge(cadena_usuario[i], cadena_usuario[i+1], color='blue', width=5)

    # 3️⃣ Cadena más corta (roja)
    cadenas_cortas = obtener_cadenas(inicio, fin, max_caminos=1, tiempo_max=tiempo_max)
    cadena_corta = []
    if cadenas_cortas:
        cadena_corta = cadenas_cortas[0]
        for i in range(len(cadena_corta) - 1):
            G.add_edge(cadena_corta[i], cadena_corta[i+1], color='red', width=4)

    # 4️⃣ Cadenas extra (gris)
    cadenas_extra = obtener_cadenas(inicio, fin, max_caminos=max_cadenas_extra, tiempo_max=tiempo_max)
    if cadenas_extra:
        for cadena in cadenas_extra:
            if cadena not in [partida.get('solucion'), cadena_usuario, cadena_corta]:
                for i in range(len(cadena) - 1):
                    G.add_edge(cadena[i], cadena[i+1], color='lightgray', width=2)

    # 5️⃣ Crear grafo interactivo
    net = Network(height="700px", width="100%", notebook=True, bgcolor="#222222", font_color="white")
    net.from_nx(G)

    # Colores de nodos según prioridad: usuario > generada > corta > extras
    for nodo in G.nodes():
        if nodo in cadena_usuario:
            net.get_node(nodo)['color'] = 'blue'
        elif partida.get('solucion') and nodo in partida['solucion']:
            net.get_node(nodo)['color'] = 'green'
        elif nodo in cadena_corta:
            net.get_node(nodo)['color'] = 'red'
        else:
            net.get_node(nodo)['color'] = 'lightgray'

    # Resaltar inicio y fin
    net.get_node(inicio)['size'] = 25
    net.get_node(fin)['size'] = 25
    net.get_node(inicio)['color'] = 'gold'
    net.get_node(fin)['color'] = 'gold'

    if render:
        net.show("grafo_partida.html")
        return None
    else:
        return net.generate_html()
