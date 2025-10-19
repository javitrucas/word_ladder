import random
from utils import (
    generar_partida_rapida,
    obtener_cadenas,
    comprobar_cadena,
    puntuacion_cadena,
    palabras_dict,
    existe_palabra,
    es_vecina,
    graficar_todas_cadenas
)

def jugar():
    # Generar una partida rápida
    partida = generar_partida_rapida(longitud_cadena=5)
    palabra_inicio = partida['inicio']
    palabra_fin = partida['fin']
    solucion = partida['solucion']

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

    # 🎨 Graficar todas las cadenas
    try:
        graficar_todas_cadenas(
            cadena_usuario=cadena_jugador,
            partida=partida,
            max_cadenas_extra=3,
            tiempo_max=5
        )
        print("Grafo generado en 'grafo_partida.html'. Ábrelo en tu navegador para verlo.")
    except Exception as e:
        print("Error al generar el grafo:", e)


jugar()
