def existe_palabra(palabra):
    existe = False
    score = None 
    
    with open("data/palabras.txt", "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or line.strip() == "palabra,puntuacion":
                continue

            parts = line.strip().split(",", 1)
            if len(parts) < 2:
                continue

            p, s = parts[0].strip(), parts[1].strip()
            if p == palabra:
                existe = True
                score = int(float(s))
                break
            
    return existe, score

print(existe_palabra("yo"))