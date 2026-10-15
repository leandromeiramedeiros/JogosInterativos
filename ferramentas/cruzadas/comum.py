"""Funções comuns do gerador e do montador de cruzadas densas."""
import json
import os
import re
import unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
DADOS = os.path.join(AQUI, "dados")
PISTAS_JS = os.path.join(RAIZ, "jogos", "palavras-cruzadas", "pistas.js")
GRADES_JS = os.path.join(RAIZ, "jogos", "palavras-cruzadas", "grades.js")
GRADES_JSON = os.path.join(AQUI, "grades.json")
PISTAS_JSON = os.path.join(AQUI, "pistas.json")
VOCAB_JSON = os.path.join(AQUI, "vocab.json")

TAMANHO = {"medio": 9, "dificil": 11}
QTD_GRADES = 31
# Se o nível não tem pista própria, usa a do nível indicado (nessa ordem).
CADEIA = {"medio": ["medio", "facil"], "dificil": ["dificil", "medio"]}


def sem_acento(s):
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def normaliza(s):
    return sem_acento(s).upper()


def ler_json(caminho, padrao=None):
    if not os.path.exists(caminho):
        return padrao
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def gravar_json(caminho, dados, **kw):
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, **kw)
        f.write("\n")


def ler_pistas_js():
    """Lê pistas.js e devolve {nivel: [(grafia, pista), ...]}."""
    txt = open(PISTAS_JS, encoding="utf-8").read()
    saida, nivel = {}, None
    for linha in txt.splitlines():
        m = re.match(r"^(facil|medio|dificil):\s*\[", linha)
        if m:
            nivel = m.group(1)
            saida[nivel] = []
            continue
        m = re.match(r'^\s*"([^"|]+)\|([^"]+)",?\s*$', linha)
        if m and nivel:
            saida[nivel].append((m.group(1).strip(), m.group(2).strip()))
    return saida


def achar_pista(dic, palavra, nivel):
    """Pista de `palavra` para `nivel` (com a cadeia de reserva) ou None."""
    ent = dic.get(palavra)
    if not ent:
        return None
    for n in CADEIA[nivel]:
        if ent.get(n):
            return ent[n]
    return None


# ---------- geometria da grade ----------

def entradas(linhas):
    """Lista de entradas [(direcao, r, c, tamanho, texto)] varrendo linha a linha.
    Considera palavras de >= 2 casas (para a numeração clássica)."""
    n = len(linhas)
    res = []
    for r in range(n):
        for c in range(len(linhas[r])):
            if linhas[r][c] == "#":
                continue
            ini_h = (c == 0 or linhas[r][c - 1] == "#")
            ini_v = (r == 0 or linhas[r - 1][c] == "#")
            if ini_h:
                t = ""
                cc = c
                while cc < len(linhas[r]) and linhas[r][cc] != "#":
                    t += linhas[r][cc]
                    cc += 1
                if len(t) >= 2:
                    res.append(("h", r, c, len(t), t))
            if ini_v:
                t = ""
                rr = r
                while rr < n and linhas[rr][c] != "#":
                    t += linhas[rr][c]
                    rr += 1
                if len(t) >= 2:
                    res.append(("v", r, c, len(t), t))
    return res


def numerar(linhas):
    """Devolve (numeros, ents): numeros[(r,c)] = n; ents com o número incluído
    [(dir, num, r, c, texto)]."""
    ents = entradas(linhas)
    inicios = sorted({(r, c) for (_, r, c, _, _) in ents})
    numeros = {rc: i + 1 for i, rc in enumerate(inicios)}
    return numeros, [(d, numeros[(r, c)], r, c, t) for (d, r, c, _, t) in ents]
