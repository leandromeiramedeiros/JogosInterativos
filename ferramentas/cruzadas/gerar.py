#!/usr/bin/env python3
"""Gerador de cruzadas densas (Médio 9x9, Difícil 11x11).

Uso:
  python3 ferramentas/cruzadas/gerar.py                 # gera tudo (31 grades por nível) e a lista de pistas faltantes
  python3 ferramentas/cruzadas/gerar.py --semente 7     # outra semente
  python3 ferramentas/cruzadas/gerar.py --nivel medio --qtd 5
  python3 ferramentas/cruzadas/gerar.py --so-faltando   # só recalcula faltando*.json a partir de grades.json
"""
import argparse
import math
import random
import sys
import time

import comum
import moldes
import vocab as vocab_mod
from comum import (CADEIA, GRADES_JSON, PISTAS_JSON, QTD_GRADES, TAMANHO, achar_pista, gravar_json,
                   ler_json, ler_pistas_js, normaliza)

POOL = {"medio": 9000, "dificil": 21000}   # quantas palavras do ranking cada nível pode usar
LIMITE_USO = {"medio": 5, "dificil": 4}      # quantas grades podem repetir a mesma palavra
MAX_PARECIDO = 0.30                          # fração máxima de palavras em comum com uma grade anterior


# ---------- vocabulário ----------

def carregar_vocab():
    d = ler_json(comum.VOCAB_JSON)
    if d is None:
        vocab_mod.construir()
        d = ler_json(comum.VOCAB_JSON)
    return d["palavras"]


def montar_pistas_json():
    """Cria/atualiza pistas.json com o que existe em pistas.js (sem apagar nada já presente)."""
    dic = ler_json(PISTAS_JSON, {})
    for nivel, itens in ler_pistas_js().items():
        for graf, pista in itens:
            w = normaliza(graf)
            if not w.isalpha() or not w.isascii():
                continue
            ent = dic.setdefault(w, {"grafia": graf.lower()})
            ent.setdefault(nivel, pista)
    gravar_json(PISTAS_JSON, dic, indent=1, sort_keys=True)
    return dic


def lista_nivel(nivel, vocab, pistas, rng, usos):
    """Palavras candidatas do nível com custo base (menor = melhor)."""
    tam = TAMANHO[nivel]
    limite = POOL[nivel]
    itens = []
    for e in vocab:
        w = e["w"]
        if len(w) > tam:
            continue
        tem = achar_pista(pistas, w, nivel) is not None
        if e["r"] >= limite and not tem:
            continue
        if e["r"] >= 90000 and not tem:
            continue
        if len(w) == 3 and e["r"] > 3500 and not tem:
            continue
        itens.append((w, e, tem))
    return itens


def custo_base(e, tem):
    c = math.log(e["r"] + 80)
    if e.get("v"):
        c += 1.6
    w = e["w"]
    if w.endswith("S") and len(w) > 3:
        c += 0.7
    if tem:
        c -= 1.4
    return c


class Indice:
    """Índice por (tamanho, posição, letra) com máscaras de bits; bit 0 = melhor palavra."""

    def __init__(self, itens, usos, rng, sigma, bonus_reuso, limite_uso):
        por_tam = {}
        for w, e, tem in itens:
            c = custo_base(e, tem) + rng.gauss(0, sigma)
            if usos.get(w, 0) > 0:
                c -= bonus_reuso
            if usos.get(w, 0) >= limite_uso:
                continue
            por_tam.setdefault(len(w), []).append((c, w, e))
        self.palavras = {}
        self.todas = {}
        self.pos = {}
        self.chave = {}
        for L, lst in por_tam.items():
            lst.sort(key=lambda x: x[0])
            ws = [w for _, w, _ in lst]
            self.palavras[L] = ws
            self.todas[L] = (1 << len(ws)) - 1
            tabela = [dict() for _ in range(L)]
            for i, w in enumerate(ws):
                b = 1 << i
                for p, ch in enumerate(w):
                    tabela[p][ch] = tabela[p].get(ch, 0) | b
            self.pos[L] = tabela
        # famílias (mesmo radical) para não repetir no mesmo cruzamento
        fam = {}
        for L, ws in self.palavras.items():
            for i, w in enumerate(ws):
                for k in self.chaves(w):
                    fam.setdefault(k, []).append((L, i))
        self.fam = fam

    @staticmethod
    def chaves(w):
        ks = []
        base = w[:-1] if w.endswith("S") and len(w) > 3 else w
        ks.append("S:" + base)
        if len(base) >= 6:
            ks.append("R:" + base[:5])
        elif len(base) == 5:
            ks.append("R:" + base[:4])
        return ks


def moldes_para(n, rng, qtd):
    return moldes.gerar_moldes(n, qtd, rng.randrange(1 << 30))


def slots_do_molde(molde):
    n = len(molde)
    slots = []
    for r in range(n):
        c = 0
        while c < n:
            if molde[r][c] == "#":
                c += 1
                continue
            c0 = c
            while c < n and molde[r][c] != "#":
                c += 1
            slots.append([(r, x) for x in range(c0, c)])
    for c in range(n):
        r = 0
        while r < n:
            if molde[r][c] == "#":
                r += 1
                continue
            r0 = r
            while r < n and molde[r][c] != "#":
                r += 1
            slots.append([(x, c) for x in range(r0, r)])
    return slots


class Preenchedor:
    def __init__(self, molde, idx, rng, limite_nos, ramos):
        self.n = len(molde)
        self.molde = molde
        self.idx = idx
        self.rng = rng
        self.slots = slots_do_molde(molde)
        self.limite = limite_nos
        self.ramos = ramos
        self.nos = 0
        self.letras = {}
        self.usada = {L: 0 for L in idx.palavras}
        self.escolhida = [None] * len(self.slots)
        self.cruza = {}
        for i, s in enumerate(self.slots):
            for p, cel in enumerate(s):
                self.cruza.setdefault(cel, []).append(i)
        self.abertas_cel = [(cel, tuple(v)) for cel, v in self.cruza.items()]

    def mascara(self, i):
        s = self.slots[i]
        L = len(s)
        if L not in self.idx.todas:
            return 0
        m = self.idx.todas[L] & ~self.usada[L]
        tab = self.idx.pos[L]
        for p, cel in enumerate(s):
            ch = self.letras.get(cel)
            if ch is not None:
                m &= tab[p].get(ch, 0)
                if not m:
                    return 0
        return m

    def propagar(self):
        """Consistência de arco por letra. Devolve dict {slot: máscara} dos slots abertos, ou None."""
        masks = {}
        for i in range(len(self.slots)):
            if self.escolhida[i] is None:
                m = self.mascara(i)
                if not m:
                    return None
                masks[i] = m
        pos = self.idx.pos
        celulas = [(cel, ab) for cel, ab in self.abertas_cel if all(self.escolhida[k] is None for k in ab) and cel not in self.letras]
        for _ in range(4):
            mudou = False
            for cel, (a, b) in celulas:
                pa = self.slots[a].index(cel)
                pb = self.slots[b].index(cel)
                ta = pos[len(self.slots[a])][pa]
                tb = pos[len(self.slots[b])][pb]
                ma, mb = masks[a], masks[b]
                la = {ch for ch, bm in ta.items() if ma & bm}
                lb = {ch for ch, bm in tb.items() if mb & bm}
                inter = la & lb
                if not inter:
                    return None
                if len(inter) < len(la):
                    u = 0
                    for ch in inter:
                        u |= ta[ch]
                    ma &= u
                    if not ma:
                        return None
                    masks[a] = ma
                    mudou = True
                if len(inter) < len(lb):
                    u = 0
                    for ch in inter:
                        u |= tb[ch]
                    mb &= u
                    if not mb:
                        return None
                    masks[b] = mb
                    mudou = True
            if not mudou:
                break
        return masks

    def resolver(self):
        self.nos += 1
        if self.nos > self.limite:
            return False
        masks = self.propagar()
        if masks is None:
            return False
        if not masks:
            return True
        i = min(masks, key=lambda k: (masks[k].bit_count(), self.rng.random()))
        mm = masks[i]
        s = self.slots[i]
        L = len(s)
        ws = self.idx.palavras[L]
        tentativas = 0
        m = mm
        while m and tentativas < self.ramos:
            x = m & -m
            m ^= x
            k = x.bit_length() - 1
            w = ws[k]
            tentativas += 1
            novas = [cel for p, cel in enumerate(s) if cel not in self.letras]
            for p, cel in enumerate(s):
                self.letras[cel] = w[p]
            self.escolhida[i] = w
            agreg = {L: x}
            for ch in Indice.chaves(w):
                for (L2, j) in self.idx.fam.get(ch, ()):
                    agreg[L2] = agreg.get(L2, 0) | (1 << j)
            marcas = []
            for L2, b in agreg.items():
                novo = b & ~self.usada[L2]
                self.usada[L2] |= novo
                marcas.append((L2, novo))
            if self.resolver():
                return True
            for L2, b in marcas:
                self.usada[L2] &= ~b
            for cel in novas:
                del self.letras[cel]
            self.escolhida[i] = None
            if self.nos > self.limite:
                return False
        return False

    def grade(self):
        n = self.n
        g = [["#"] * n for _ in range(n)]
        for (r, c), ch in self.letras.items():
            g[r][c] = ch
        return ["".join(l) for l in g]


def preencher(molde, idx, rng, limite=4000, ramos=14):
    p = Preenchedor(molde, idx, rng, limite, ramos)
    ok = p.resolver()
    return (p.grade() if ok else None), p.nos



def parecidas(palavras, anteriores):
    for outra in anteriores:
        comum_ = len(palavras & outra)
        if comum_ > MAX_PARECIDO * min(len(palavras), len(outra)):
            return True
    return False


def palavras_da_grade(linhas):
    _, ents = comum.numerar(linhas)
    return {t for (_, _, _, _, t) in ents}


def gerar_nivel(nivel, qtd, vocab, pistas, rng, bonus_reuso, verbose=True):
    n = TAMANHO[nivel]
    t0 = time.time()
    itens = lista_nivel(nivel, vocab, pistas, rng, None)
    usos = {}
    grades, conjuntos, usados_molde = [], [], {}
    banco = moldes_para(n, rng, 40)
    tentativas = 0
    while len(grades) < qtd:
        tentativas += 1
        # molde menos usado primeiro
        molde = min(banco, key=lambda m: (usados_molde.get(tuple(m), 0), rng.random()))
        idx = Indice(itens, usos, rng, sigma=0.9, bonus_reuso=bonus_reuso, limite_uso=LIMITE_USO[nivel])
        g, nos = preencher(molde, idx, rng, limite=1500 if n == 9 else 3000, ramos=30)
        if g is None:
            usados_molde[tuple(molde)] = usados_molde.get(tuple(molde), 0) + 0.34
            continue
        pal = palavras_da_grade(g)
        if parecidas(pal, conjuntos):
            continue
        usados_molde[tuple(molde)] = usados_molde.get(tuple(molde), 0) + 1
        grades.append(g)
        conjuntos.append(pal)
        for w in pal:
            usos[w] = usos.get(w, 0) + 1
        if verbose:
            novas = sum(1 for w in pal if usos[w] == 1)
            print(f"  {nivel} {len(grades):2d}/{qtd}  tentativas={tentativas} nos={nos} palavras={len(pal)} novas={novas} t={time.time()-t0:.0f}s",
                  file=sys.stderr, flush=True)
    return grades


def faltando(grades, pistas, vocab):
    graf = {e["w"]: e["g"] for e in vocab}
    lista = []
    for nivel, gs in grades.items():
        palavras = set()
        for g in gs:
            palavras |= palavras_da_grade(g)
        for w in sorted(palavras):
            if achar_pista(pistas, w, nivel) is None:
                lista.append({"palavra": w, "grafia": (pistas.get(w) or {}).get("grafia") or graf.get(w, w.lower()),
                              "nivel": nivel})
    return lista


def gravar_faltando(lista, lotes=4):
    import glob, os
    for f in glob.glob(os.path.join(comum.AQUI, "faltando*.json")):
        os.remove(f)
    gravar_json(os.path.join(comum.AQUI, "faltando.json"), lista, indent=1)
    por_palavra = {}
    for it in lista:
        por_palavra.setdefault(it["palavra"], []).append(it)
    grupos = sorted(por_palavra.values(), key=lambda g: g[0]["palavra"])
    saidas = [[] for _ in range(lotes)]
    for g in grupos:
        menor = min(range(lotes), key=lambda i: (len(saidas[i]), i))
        saidas[menor].extend(g)
    for i, s in enumerate(saidas):
        gravar_json(os.path.join(comum.AQUI, f"faltando-{i + 1}.json"), s, indent=1)
    return [len(s) for s in saidas]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--semente", type=int, default=2026)
    ap.add_argument("--nivel", choices=["medio", "dificil"])
    ap.add_argument("--qtd", type=int, default=QTD_GRADES)
    ap.add_argument("--reuso", type=float, default=1.0, help="bônus para reaproveitar palavras (0 = nenhum)")
    ap.add_argument("--so-faltando", action="store_true")
    a = ap.parse_args()
    vocab = carregar_vocab()
    pistas = montar_pistas_json()
    existentes = ler_json(GRADES_JSON, {"medio": [], "dificil": []})
    if not a.so_faltando:
        rng = random.Random(a.semente)
        for nivel in ([a.nivel] if a.nivel else ["medio", "dificil"]):
            existentes[nivel] = gerar_nivel(nivel, a.qtd, vocab, pistas, rng, a.reuso)
        gravar_json(GRADES_JSON, existentes, indent=1)
    lista = faltando(existentes, pistas, vocab)
    tam = gravar_faltando(lista)
    print("grades:", {k: len(v) for k, v in existentes.items()}, "| faltam pistas:", len(lista), "lotes:", tam, file=sys.stderr)


if __name__ == "__main__":
    main()
