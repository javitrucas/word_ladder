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

def existe_palabra(palabra):
    score = palabras_dict.get(palabra)
    if score is None:
        return False, None
    return True, score

#print(existe_palabra("despiojar"))

def palabra_segun_score(score):
    list=[]

    for p in palabras_dict:
        if palabras_dict[p]==score:
            list.append(p)

    return list

# print(palabra_segun_score(25))