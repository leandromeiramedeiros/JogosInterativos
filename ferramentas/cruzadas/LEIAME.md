# Cruzadas densas (Médio 9x9, Difícil 11x11)

Tudo roda com Python 3 puro (sem pacotes). Execute da raiz do repositório.

## Arquivos
| arquivo | o que é |
| --- | --- |
| `dados/pt_br_50k.txt` | lista de frequência (palavra e contagem) |
| `dados/br-utf8.txt` | dicionário do IME-USP (baixado sozinho; não vai para o git) |
| `vocab.py` / `vocab.json` | cruza as duas listas, filtra e guarda o vocabulário (inclui nomes próprios conhecidos, expressões coladas e interjeições) |
| `moldes.py` | gera moldes simétricos (180°) no estilo losango do O Globo |
| `gerar.py` | preenche os moldes (backtracking + consistência de arco) e gera `grades.json` e `faltando*.json` |
| `pistas.json` | dicionário `{"PALAVRA": {"grafia":"palavra", "facil":"…", "medio":"…", "dificil":"…"}}`; começa com o que existe em `jogos/palavras-cruzadas/pistas.js` |
| `pistas-novas-*.json` | pistas novas escritas à mão (mesmo formato de `pistas.json`) |
| `faltando.json`, `faltando-1..4.json` | palavras usadas nas grades que ainda não têm pista no nível |
| `montar.py` | valida e escreve `jogos/palavras-cruzadas/grades.js` |

Regra de reserva: se uma palavra não tem pista do nível, o montador usa a do nível mais fácil (Médio: `medio`, depois `facil`; Difícil: `dificil`, depois `medio`).

## Montar o jogo
```
python3 ferramentas/cruzadas/montar.py --provisorio   # pistas que faltam viram "(pista em preparo: PALAVRA)"
python3 ferramentas/cruzadas/montar.py                # estrito: erro se faltar pista ou algo estiver errado
python3 ferramentas/cruzadas/montar.py --faltando     # reescreve faltando*.json descontando as pistas novas já escritas
```
O montador falha, com mensagem clara, se: faltar pista; a pista contiver a resposta ou a raiz (4+ letras); a pista passar de 60 caracteres; a grade não for 9x9/11x11, não for simétrica, tiver palavra de menos de 3 letras ou casa que não cruza; ou a numeração não bater com as chaves `h`/`v`.

## Acrescentar pistas
1. Abra um `faltando-N.json` (lista de `{"palavra","grafia","nivel"}`).
2. Crie `pistas-novas-N.json` com `{"CASA": {"grafia":"casa", "medio":"Lugar onde se mora"}, "RAIMI": {"grafia":"Raimi", "dificil":"Sam ___, diretor de cinema"}}`. Palavra que aparece nos dois níveis pede as duas chaves (`medio` e `dificil`).
3. Rode `montar.py`. Pistas curtas (até 60 caracteres), sem a resposta nem palavra da mesma família, flexão igual à da resposta.

Para trocar uma pista já existente, edite-a em `pistas.json` (ou repita a palavra num `pistas-novas-*.json`: o arquivo lido por último vence).

## Gerar mais grades ou outras
```
python3 ferramentas/cruzadas/gerar.py                       # refaz TUDO (31 + 31) com a semente 2026
python3 ferramentas/cruzadas/gerar.py --semente 7           # outras grades
python3 ferramentas/cruzadas/gerar.py --nivel medio --qtd 31 --reuso 2   # só um nível; --reuso maior = mais palavras repetidas entre grades (menos pistas a escrever)
python3 ferramentas/cruzadas/gerar.py --so-faltando         # só recalcula faltando*.json
```
Atenção: regerar muda as grades (e a numeração das pistas); as pistas por palavra em `pistas.json` continuam valendo, então só as palavras novas entram em `faltando`. Se quiser mudar a ordem do vocabulário ou os filtros (palavrões, formas verbais, nomes), edite `vocab.py` e rode `python3 ferramentas/cruzadas/vocab.py`.
Depois de qualquer geração, rode `montar.py`.
