import random
from utils import obtener_cadenas, comprobar_cadena, puntuacion_cadena, palabras_dict, existe_palabra, es_vecina

def jugar():
    # Filtrar palabras
    palabras_posibles = [p for p in palabras_dict if 2 <= len(p) <= 5]

    # Elegir palabras aleatorias con solución
    while True:
        palabra_inicio = random.choice(palabras_posibles)
        palabra_fin = random.choice(palabras_posibles)
        if palabra_inicio == palabra_fin:
            continue
        # Buscar solución mínima y guardarla
        solucion = obtener_cadenas(palabra_inicio, palabra_fin, max_caminos=1)
        if solucion:
            solucion = solucion[0]  # Tomamos la primera cadena mínima
            break

    print("¡Nuevo juego!")
    print(f"Palabra inicial: {palabra_inicio}")
    print(f"Palabra final: {palabra_fin}")
    print("Introduce palabras paso a paso (una por línea). Para terminar, escribe 'FIN'.")

    cadena_jugador = [palabra_inicio]

    while True:
        palabra = input(f"Palabra siguiente (vecina de '{cadena_jugador[-1]}'): ").strip().lower()
        if palabra == "fin":
            break
        # Verificar existencia y vecindad
        existe, _ = existe_palabra(palabra)
        if not existe:
            print("❌ La palabra no existe. Intenta otra.")
            continue
        if not es_vecina(cadena_jugador[-1], palabra):
            print("❌ La palabra no es vecina de la anterior. Intenta otra.")
            continue

        cadena_jugador.append(palabra)

        if palabra == palabra_fin:
            print("🎉 ¡Has llegado a la palabra final!")
            break

    # Comprobar si la cadena es correcta
    if cadena_jugador[-1] != palabra_fin:
        print("❌ No llegaste a la palabra final.")
        print(f"Una solución posible era: {solucion}")
    elif not comprobar_cadena(cadena_jugador):
        print("❌ La cadena no es válida.")
        print(f"Una solución posible era: {solucion}")
    else:
        print("✅ Cadena correcta!")
        print(f"Tu puntuación total: {puntuacion_cadena(cadena_jugador)}")

    print("Cadena final del jugador:", cadena_jugador)


jugar()
