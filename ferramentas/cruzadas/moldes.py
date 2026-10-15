"""Moldes (máscaras) simétricos de cruzadas densas."""
import random


def runs_ok(m, n, minimo=3, maximo=None):
    """Toda sequência de casas brancas (linhas e colunas) tem entre `minimo` e `maximo` casas."""
    for eixo in (0, 1):
        for i in range(n):
            tam = 0
            for j in range(n + 1):
                preta = j == n or (m[i][j] if eixo == 0 else m[j][i])
                if preta:
                    if 0 < tam < minimo or (maximo and tam > maximo):
                        return False
                    tam = 0
                else:
                    tam += 1
    return True


def conexo(m, n):
    brancas = [(r, c) for r in range(n) for c in range(n) if not m[r][c]]
    if not brancas:
        return False
    visto = {brancas[0]}
    pilha = [brancas[0]]
    while pilha:
        r, c = pilha.pop()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            rr, cc = r + dr, c + dc
            if 0 <= rr < n and 0 <= cc < n and not m[rr][cc] and (rr, cc) not in visto:
                visto.add((rr, cc))
                pilha.append((rr, cc))
    return len(visto) == len(brancas)


def sem_bloco_2x2(m, n):
    for r in range(n - 1):
        for c in range(n - 1):
            if m[r][c] and m[r + 1][c] and m[r][c + 1] and m[r + 1][c + 1]:
                return False
    return True


def base_molde(n, rng):
    """Casas pretas de partida: cantos em degrau (como o losango do O Globo) + bloco central."""
    pretas = set()
    if n == 11:
        degrau = rng.choice([(3, 2, 1), (3, 2, 1), (3, 2, 1), (3, 2), (2, 1)])
        centro = rng.choice(["cruz", "cruz", "cruz", "mais", "barra"])
    else:
        degrau = rng.choice([(2, 1), (2, 1), (2,), (3, 1), ()])
        centro = rng.choice(["mais", "mais", "barra", "nada", "cruz"])
    for i, k in enumerate(degrau):
        for j in range(k):
            for (r, c) in ((i, j), (i, n - 1 - j), (n - 1 - i, j), (n - 1 - i, n - 1 - j)):
                pretas.add((r, c))
    m = n // 2
    if centro == "cruz":      # barra horizontal larga + um acima e um abaixo (como no exemplo)
        meia = 2
        for c in range(m - meia, m + meia + 1):
            pretas.add((m, c))
        for d in range(1, (3 if n == 11 else 2)):
            pretas.add((m - d, m)); pretas.add((m + d, m))
    elif centro == "mais":
        for c in range(m - 1, m + 2):
            pretas.add((m, c))
        pretas.add((m - 1, m)); pretas.add((m + 1, m))
    elif centro == "barra":
        for c in range(m - 1, m + 2):
            pretas.add((m, c))
    return pretas


def gerar_molde(n, minimo_pretas, maximo_pretas, rng, maxrun=None):
    """Máscara n×n (True = preta) com simetria de rotação de 180°; None se não deu certo.
    Famílias: losango (cantos em degrau + centro), degraus nos cantos, blocos nas bordas, espalhada."""
    for _ in range(80):
        familia = rng.choice(["losango", "degraus", "bordas", "espalhada", "espalhada", "centro"])
        mm = [[False] * n for _ in range(n)]
        if familia == "losango":
            base = base_molde(n, rng)
        elif familia == "degraus":
            base = {p for p in base_molde(n, rng) if abs(p[0] - n // 2) + abs(p[1] - n // 2) > 3}
        elif familia == "centro":
            base = {p for p in base_molde(n, rng) if abs(p[0] - n // 2) + abs(p[1] - n // 2) <= 3}
        elif familia == "bordas":
            base = set()
            for _k in range(rng.randint(2, 3)):
                lado = rng.randrange(4)
                ini = rng.randint(2, n - 5)
                for j in range(ini, ini + rng.randint(1, 2)):
                    base |= {[(0, j), (j, 0), (n - 1, j), (j, n - 1)][lado]}
        else:
            base = set()
        for r, c in base:
            mm[r][c] = mm[n - 1 - r][n - 1 - c] = True
        if not (runs_ok(mm, n, 3, None) or familia in ("bordas", "espalhada", "centro", "degraus")):
            continue
        # completa com pares aleatórios (viés para as bordas nas famílias abertas)
        alvo = rng.randint(minimo_pretas, maximo_pretas)
        tent = 0
        while sum(map(sum, mm)) < alvo and tent < 500:
            tent += 1
            if familia in ("bordas", "degraus") and rng.random() < 0.5:
                r, c = rng.choice([(0, rng.randrange(n)), (rng.randrange(n), 0), (1, rng.randrange(n)), (rng.randrange(n), 1)])
            else:
                r, c = rng.randrange(n), rng.randrange(n)
            if mm[r][c]:
                continue
            r2, c2 = n - 1 - r, n - 1 - c
            if sum(map(sum, mm)) + (1 if (r, c) == (r2, c2) else 2) > maximo_pretas:
                continue
            mm[r][c] = mm[r2][c2] = True
            if not (runs_ok(mm, n, 3, None) and sem_bloco_2x2(mm, n) and conexo(mm, n)):
                mm[r][c] = mm[r2][c2] = False
        cont = sum(map(sum, mm))
        if minimo_pretas <= cont <= maximo_pretas and runs_ok(mm, n, 3, maxrun) and conexo(mm, n) and sem_bloco_2x2(mm, n):
            return mm
    return None


def molde_para_texto(m):
    return ["".join("#" if x else "." for x in linha) for linha in m]


def gerar_moldes(n, quantidade, seed=1):
    rng = random.Random(seed)
    lo, hi = (15, 21) if n == 9 else (22, 31)
    maxrun = n - 1
    vistos, saida = set(), []
    falhas = 0
    while len(saida) < quantidade and falhas < 3000:
        m = gerar_molde(n, lo, hi, rng, maxrun)
        t = tuple(molde_para_texto(m)) if m else None
        if m is None or t in vistos:
            falhas += 1
            continue
        vistos.add(t)
        saida.append(list(t))
    return saida
