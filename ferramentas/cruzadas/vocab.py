"""Monta vocab.json: palavras do IME-USP que também estão na lista de frequência."""
import os
import re
import subprocess
import sys

from comum import DADOS, VOCAB_JSON, gravar_json, normaliza, ler_pistas_js

URL_IME = "https://www.ime.usp.br/~pf/dicios/br-utf8.txt"

# Termos ofensivos/sexuais/sensíveis (prefixos e palavras exatas, em minúsculas e sem acento).
BLOQ_PREFIXO = (
    "porra", "caralh", "foder", "fode", "fodi", "fodam", "foda", "fudi", "fuder", "putar", "putin",
    "putaria", "puteiro", "putao", "bucet", "merd", "bosta", "cacete", "sexo", "sexu", "sexy",
    "penis", "vagina", "estupr", "prostit", "cuzao", "cuzinho", "piroc", "tesao", "gozar", "gozad",
    "gozei", "orgasm", "crioul", "retardad", "mongol", "imbecil", "idiot", "babac", "otari",
    "vagabund", "vadia", "safad", "bunda", "peitu", "cabaco", "punheta", "masturb", "ereca",
    "erotic", "eroti", "nudez", "pornog", "porno", "suicid", "tarad", "pervers", "libidin",
    "lascivo", "lubric", "mamilo", "genital", "ejacul", "cocain", "maconh", "heroin", "cretin",
    "escroto", "chifrud", "arrombad", "desgraca", "filhadaputa", "xoxota", "rabud", "negrada",
    "macumb", "pederast", "pedofil", "incest", "satan", "camisinha", "preservativ", "adulter",
    "bordel", "stripper", "nazi", "hitler", "assassin", "cadaver", "tesud", "amasso", "homossex",
    "lesbic", "travest", "viagra", "cuz", "gostosa", "gostoso", "mulata", "mulato",
)
BLOQ_EXATA = {"cu", "cus", "pau", "paus", "ass", "anus", "nus", "nua", "nuas", "nu", "boceta",
              "pila", "tora", "rabo", "rabos", "peito", "peitos", "mama", "mamas", "mamar", "mamae",
              "rola", "rolas", "pinto", "pintos", "pica", "picas", "xana", "xereca", "bagos", "bago",
              "teta", "tetas", "gay", "gays", "bicha", "bichas", "viado", "viados", "viadinho",
              "corno", "cornos", "transa", "transar", "transei", "transou", "seio", "seios",
              "diabo", "demonio", "inferno", "preto", "pretos"}
BLOQ_EXATA -= {"preto", "pretos"}
# Formas verbais pouco amigáveis para pistas (terminações).
FIM_VERBAL = ("ou", "aram", "eram", "iram", "avam", "iam", "ando", "endo", "indo", "arem", "erem",
              "irem", "asse", "isse", "assem", "essem", "issem", "amos", "emos", "imos", "aria",
              "eria", "iria", "ariam", "eriam", "iriam", "ara", "era", "ira", "ava", "ei", "ao")
NOMES_RUINS = {"jesus", "deus", "maria", "satanas", "lúcifer", "hitler", "stalin", "mao", "judas", "osama", "bin", "laden"}
# Expressões curtas escritas juntas, palavras estrangeiras comuns e interjeições (todas com pista possível).
EXTRAS = [(x, None) for x in (
    "naverdade deveras atempo aovivo aolado adiante apesar alemdisso porfavor demais afinal "
    "decor derepente porisso emfim emcasa pelomenos atoa avontade dalailama novaaba novaera "
    "uai eita opa oba ufa puxa nossa xi ih ui ai ah oh ora eia epa psiu arre ave "
    "sir enero okay adeus amigo hola show pizza "
    "jogodavelha cafedamanha belohorizonte riodejaneiro saopaulo salvador natal "
    "ana rita lucas pedro paulo marcos tiago bruno carlos jose joao mario luiza lara clara bia ivo ary "
    "daniela raquel silvia sonia vera lucia helena marta elisa eva nina lais livia julia tania "
    "ramon enrico rafael renato ricardo sergio vitor hugo caio davi igor otavio nelson edson "
    "portugal brasil lisboa recife manaus belem goias parana bahia acre amapa para piaui ceara "
    "londres paris roma madri berlim tokyo oslo cairo lima quito bogota havana "
    "tchau fala valeu beleza tranquilo bacana massa legal firmeza topo dezoito vinte "
).split()]
PROIBIDAS_CURTAS = set("PRA PRO LOS LAS VOS HUM OPA NUM NAS DOS DAS AOS LHE HEI SUE ARE IAM EVA DER FOR VIR IDO ORA "
                       "EIS LHES NOS MIM TUA SEU SUA MEU TEU NEM UNS DAI TAL SOB POE POS PUS LEU VIM FUI FIZ DEI DOU "
                       "CAI DAO DOI SAI SOU VOU SEI VEM VIU FEZ FAZ DIZ AMA AMO USA USE VAO IRA ERA FOI VAI TEM SAO "
                       "ANTI SOS AGE MIA ELE ELA ELES ELAS".split())


def baixar():
    destino = os.path.join(DADOS, "br-utf8.txt")
    if not os.path.exists(destino):
        subprocess.check_call(["curl", "-sS", "-o", destino, URL_IME])
    return destino


def eh_verbal(w, grafia):
    """Heurística grosseira: formas conjugadas (não infinitivo) com terminações típicas."""
    if len(w) <= 4:
        return False
    for f in FIM_VERBAL:
        if w.endswith(f) and len(w) >= len(f) + 3:
            # termina em -ao/-ia/-ara/-era etc. também forma substantivos; só barra o claramente verbal
            if f in ("ao", "ia", "era", "ira", "ara", "ava", "aria", "eria", "iria"):
                continue
            return True
    return False


FINAIS = {
    "ar": "o as a amos ais am e es emos eis em ei aste ou aram ava avas avamos aveis avam ara aras aramos areis "
          "arei aras ara aremos areis arao aria arias ariamos arieis ariam asse asses assemos asseis assem ares armos ardes arem ando".split(),
    "er": "o es e emos eis em a as amos ais am i este eu eram ia ias iamos ieis iam era eras eramos ereis erei "
          "eras era eremos erao eria erias eriamos erieis eriam esse esses essemos esseis essem eres ermos erdes erem endo".split(),
    "ir": "o es e imos is em a as amos ais am i iste iu iram ia ias iamos ieis iam ira iras iramos ireis irei "
          "iras ira iremos irao iria irias iriamos irieis iriam isse isses issemos isseis issem ires irmos irdes irem indo".split(),
}


def formas_verbais(ime_freq):
    """Conjunto (sem acento, minúsculo) de formas conjugadas de infinitivos regulares frequentes."""
    formas = set()
    for inf in ime_freq:
        w = normaliza(inf).lower()
        if len(w) < 5 or w[-2:] not in FINAIS or not w.endswith(("ar", "er", "ir")):
            continue
        rad = w[:-2]
        for fim in FINAIS[w[-2:]]:
            formas.add(rad + fim)
    return formas


def construir():
    ime = {}
    nomes = {}
    with open(baixar(), encoding="utf-8") as f:
        for linha in f:
            p = linha.strip()
            if not p or "-" in p or " " in p:
                continue
            if p.islower():
                ime[p] = True
            elif p[0].isupper() and p[1:].islower() and len(p) >= 3:
                nomes[p.lower()] = p
    pistas = ler_pistas_js()
    prioridade = {normaliza(g) for nivel in pistas.values() for g, _ in nivel if re.fullmatch(r"[A-ZÀ-Ú]+", g.upper())}
    freq = {}
    with open(os.path.join(DADOS, "pt_br_50k.txt"), encoding="utf-8") as f:
        for linha in f:
            p = linha.split()
            if len(p) == 2:
                freq[p[0]] = int(p[1])
    infinitivos = [g for g in freq if g in ime and g.endswith(("ar", "er", "ir")) and len(g) >= 5]
    formas = formas_verbais(infinitivos)
    infset = {normaliza(g).lower() for g in infinitivos}
    vistos = {}
    with open(os.path.join(DADOS, "pt_br_50k.txt"), encoding="utf-8") as f:
        for rank, linha in enumerate(f):
            partes = linha.split()
            if len(partes) != 2:
                continue
            g, cont = partes[0], int(partes[1])
            proprio = False
            if g not in ime:
                if g in nomes and cont >= 2500 and g not in NOMES_RUINS:
                    proprio = True
                    g = nomes[g]
                else:
                    continue
            if not re.fullmatch(r"[A-Za-zÀ-ú]+", g):
                continue
            w = normaliza(g)
            if not (3 <= len(w) <= 11) or not re.fullmatch(r"[A-Z]+", w):
                continue
            wl = w.lower()
            if proprio and (len(w) < 4):
                continue
            if any(ch in w for ch in "KWY"):
                continue
            if wl in BLOQ_EXATA or g in BLOQ_EXATA or wl.startswith(BLOQ_PREFIXO):
                continue
            if eh_verbal(wl, g):
                continue
            if w in vistos:  # mesma grafia sem acento: fica a mais frequente
                continue
            ent = {"w": w, "g": g, "n": cont, "r": len(vistos)}
            if proprio:
                ent["p"] = 1
            if wl in formas and wl not in infset:
                ent["v"] = 1
            if w in PROIBIDAS_CURTAS:
                continue
            vistos[w] = ent
    vocab = list(vistos.values())
    # palavras com pista que não entraram nas listas: entram no fim, só para o nível certo
    extras = []
    for g, ps in EXTRAS:
        w = normaliza(g)
        if w not in vistos and not any(e['w'] == w for e in extras):
            extras.append({'w': w, 'g': g, 'n': 0, 'r': 2500 + len(extras) * 3, 'x': 1})
    for nivel, itens in pistas.items():
        for g, _ in itens:
            w = normaliza(g)
            if re.fullmatch(r"[A-Z]{3,11}", w) and w not in vistos and not any(e["w"] == w for e in extras):
                extras.append({"w": w, "g": g.lower(), "n": 0, "r": 99999})
    vocab += extras
    gravar_json(VOCAB_JSON, {"palavras": vocab, "prioridade": sorted(prioridade)},
                separators=(",", ":"))
    return vocab


if __name__ == "__main__":
    v = construir()
    print(len(v), "palavras no vocabulário", file=sys.stderr)
