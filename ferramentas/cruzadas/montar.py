#!/usr/bin/env python3
"""Monta jogos/palavras-cruzadas/grades.js a partir de grades.json + pistas.json + pistas-novas-*.json.

Uso:
  python3 ferramentas/cruzadas/montar.py                 # estrito: falha se faltar pista ou algo estiver errado
  python3 ferramentas/cruzadas/montar.py --provisorio    # pistas que faltam viram "(pista em preparo: PALAVRA)"
  python3 ferramentas/cruzadas/montar.py --faltando      # só reescreve faltando*.json com o que ainda não tem pista
"""
import argparse
import glob
import json
import os
import re
import sys

import comum
from comum import (CADEIA, GRADES_JS, GRADES_JSON, PISTAS_JSON, TAMANHO, achar_pista, ler_json, normaliza,
                   numerar, sem_acento)

MAX_PISTA = 60


def carregar_pistas():
    dic = ler_json(PISTAS_JSON, {})
    for arq in sorted(glob.glob(os.path.join(comum.AQUI, "pistas-novas-*.json"))):
        novas = ler_json(arq, {})
        if isinstance(novas, list):  # aceita também lista de {palavra, nivel, pista}
            conv = {}
            for it in novas:
                e = conv.setdefault(it["palavra"], {"grafia": it.get("grafia", it["palavra"].lower())})
                e[it["nivel"]] = it["pista"]
            novas = conv
        for w, ent in novas.items():
            alvo = dic.setdefault(w.upper(), {"grafia": ent.get("grafia", w.lower())})
            for k, v in ent.items():
                if k == "grafia":
                    alvo.setdefault("grafia", v)
                elif v:
                    alvo[k] = v
    return dic


def toks(txt):
    return re.findall(r"[a-z0-9]+", sem_acento(txt).lower())


def problema_pista(resp, pista):
    """Texto do problema se a pista entrega a resposta (ou a raiz), senão None."""
    r = resp.lower()
    t = toks(pista)
    if r in t or (len(r) >= 4 and any(r in x for x in t)):
        return "contém a resposta"
    if len(r) >= 4:
        raiz = r[:max(4, len(r) - 3)]
        for x in t:
            if x.startswith(raiz):
                return f"contém a raiz '{raiz}' (palavra '{x}')"
    return None


def validar_grade(nivel, i, linhas):
    erros = []
    n = TAMANHO[nivel]
    if len(linhas) != n or any(len(l) != n for l in linhas):
        return [f"{nivel}[{i}]: grade fora do tamanho {n}x{n}"]
    for r in range(n):
        for c in range(n):
            ch = linhas[r][c]
            if not (ch == "#" or "A" <= ch <= "Z"):
                erros.append(f"{nivel}[{i}]: caractere inválido em ({r},{c}): {ch!r}")
            if ch != linhas[n - 1 - r][n - 1 - c] and (ch == "#") != (linhas[n - 1 - r][n - 1 - c] == "#"):
                erros.append(f"{nivel}[{i}]: sem simetria de 180 graus em ({r},{c})")
                break
    # toda casa branca em palavra de >= 3 nas duas direções
    for r in range(n):
        for c in range(n):
            if linhas[r][c] == "#":
                continue
            h = c > 0 and linhas[r][c - 1] != "#" or c < n - 1 and linhas[r][c + 1] != "#"
            v = r > 0 and linhas[r - 1][c] != "#" or r < n - 1 and linhas[r + 1][c] != "#"
            if not (h and v):
                erros.append(f"{nivel}[{i}]: casa ({r},{c}) não cruza nas duas direções")
    for (d, r, c, tam, t) in comum.entradas(linhas):
        if tam < 3:
            erros.append(f"{nivel}[{i}]: palavra curta {t} em ({r},{c})")
    return erros


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provisorio", action="store_true")
    ap.add_argument("--faltando", action="store_true")
    a = ap.parse_args()
    grades = ler_json(GRADES_JSON)
    if not grades:
        sys.exit("ERRO: grades.json não existe; rode gerar.py antes.")
    pistas = carregar_pistas()

    if a.faltando:
        import gerar
        lista = gerar.faltando(grades, pistas, gerar.carregar_vocab())
        tam = gerar.gravar_faltando(lista)
        print(f"faltam {len(lista)} pistas, lotes: {tam}")
        return

    erros, saida = [], {}
    em_preparo = 0
    for nivel in ("medio", "dificil"):
        saida[nivel] = []
        gs = grades.get(nivel, [])
        if len(gs) != comum.QTD_GRADES:
            erros.append(f"{nivel}: {len(gs)} grades (esperado {comum.QTD_GRADES})")
        for i, linhas in enumerate(gs):
            e = validar_grade(nivel, i, linhas)
            erros += e
            if e:
                continue
            numeros, ents = numerar(linhas)
            h, v = {}, {}
            for (d, num, r, c, texto) in ents:
                pista = achar_pista(pistas, texto, nivel)
                if not pista:
                    if a.provisorio:
                        pista = f"(pista em preparo: {texto})"
                        em_preparo += 1
                    else:
                        erros.append(f"{nivel}[{i}] {d.upper()}{num}: falta pista para {texto}")
                        continue
                else:
                    p = problema_pista(texto, pista)
                    if p:
                        erros.append(f"{nivel}[{i}] {d.upper()}{num} {texto}: a pista {p}: {pista!r}")
                    if len(pista) > MAX_PISTA:
                        erros.append(f"{nivel}[{i}] {d.upper()}{num} {texto}: pista longa ({len(pista)}): {pista!r}")
                (h if d == "h" else v)[str(num)] = pista
            # numeração: conferência independente
            ch_h = {str(num) for (d, num, *_ ) in ents if d == "h"}
            ch_v = {str(num) for (d, num, *_ ) in ents if d == "v"}
            if set(h) != ch_h or set(v) != ch_v:
                erros.append(f"{nivel}[{i}]: numeração não bate com as pistas")
            saida[nivel].append({"linhas": linhas, "h": h, "v": v})
    if erros:
        print("ERROS:", file=sys.stderr)
        for e in erros[:80]:
            print("  -", e, file=sys.stderr)
        if len(erros) > 80:
            print(f"  ... e mais {len(erros) - 80}", file=sys.stderr)
        sys.exit(1)
    corpo = json.dumps(saida, ensure_ascii=False, indent=1)
    with open(GRADES_JS, "w", encoding="utf-8") as f:
        f.write("/* Gerado por ferramentas/cruzadas/montar.py: não edite à mão. */\n")
        f.write("window.PC_GRADES = " + corpo + ";\n")
    print(f"grades.js escrito: medio={len(saida['medio'])} dificil={len(saida['dificil'])}"
          + (f" ({em_preparo} pistas em preparo)" if em_preparo else ""))


if __name__ == "__main__":
    main()
