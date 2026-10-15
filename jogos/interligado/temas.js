/* Interligado: mapas de palavras por tema e nível.
   Cada mapa tem a palavra do tema (a primeira, já aparece aberta) e as ligações entre palavras.
   Uma palavra pode ter grafias alternativas separadas por "|": a primeira é a que aparece no mapa.
   Toda palavra deve ter pelo menos duas ligações, para que dê para deduzi-la pelas vizinhas. */
window.INTERLIGADO_TEMAS = {
  futebol: {
    nome: "Futebol",
    cor: "#2f8a4e",
    niveis: {
      facil: {
        ligacoes: [
          ["futebol","bola"],["futebol","juiz"],["futebol","estádio"],
          ["bola","gol"],["bola","luva"],
          ["gol","goleiro"],["gol","rede"],["gol","torcida"],
          ["goleiro","luva"],["goleiro","rede"],
          ["juiz","apito"],["juiz","cartão"],["apito","cartão"],
          ["cartão","vermelho"],["vermelho","torcida"],
          ["estádio","torcida"]
        ]
      },
      medio: {
        ligacoes: [
          ["futebol","Brasil"],["futebol","bola"],["futebol","campo"],
          ["Brasil","seleção"],["Brasil","amarelo"],["Brasil","Pelé"],
          ["seleção","camisa"],["seleção","Copa do Mundo"],
          ["camisa","amarelo"],["camisa","dez|10"],
          ["Copa do Mundo","taça"],["Copa do Mundo","campeão"],["taça","campeão"],
          ["Pelé","rei"],["Pelé","dez|10"],["rei","campeão"],
          ["dez|10","craque"],["craque","drible"],["drible","bola"],
          ["bola","chuteira"],["chuteira","grama"],["grama","campo"],
          ["campo","pênalti"],["pênalti","goleiro"],["goleiro","defesa"],["defesa","pênalti"]
        ]
      },
      dificil: {
        ligacoes: [
          ["futebol","Maracanã"],["futebol","técnico"],["futebol","chapéu"],["futebol","grama"],["futebol","Copa"],
          ["Maracanã","Rio de Janeiro"],["Rio de Janeiro","carnaval"],["Rio de Janeiro","praia"],
          ["carnaval","samba"],["samba","escola"],["escola","professor"],["professor","técnico"],
          ["técnico","banco"],["banco","reserva"],["banco","dinheiro"],
          ["reserva","contrato"],["dinheiro","contrato"],["dinheiro","cartão"],
          ["contrato","assinatura"],["assinatura","caneta"],["caneta","papel"],
          ["chapéu","cabeça"],["chapéu","sol"],["cabeça","cabeçada"],["cabeçada","escanteio"],
          ["escanteio","bandeira"],["bandeira","Brasil"],["bandeira","amarelo"],
          ["Brasil","verde"],["Brasil","Copa"],["verde","grama"],["verde","folha"],
          ["Copa","árvore"],["árvore","folha"],["folha","papel"],
          ["papel","cartão"],["cartão","amarelo"],["amarelo","sol"],["sol","praia"],
          ["chapéu","drible"],["caneta","drible"],["drible","craque"],["craque","estrela"],["estrela","sol"],
          ["estrela","Natal"],["árvore","Natal"],["Natal","presente"],["presente","papel"],["reserva","hotel"],["hotel","praia"]
        ]
      }
    }
  },

  natureza: {
    nome: "Natureza",
    cor: "#3f7f3a",
    niveis: {
      facil: {
        ligacoes: [
          ["natureza","árvore"],["natureza","rio"],["natureza","sol"],
          ["árvore","folha"],["árvore","flor"],["folha","chuva"],
          ["flor","abelha"],["flor","sol"],["abelha","mel"],["mel","flor"],
          ["rio","mar"],["rio","chuva"],["mar","céu"],
          ["chuva","nuvem"],["nuvem","céu"],["céu","sol"]
        ]
      },
      medio: {
        ligacoes: [
          ["natureza","floresta"],["natureza","terra"],["natureza","água"],
          ["floresta","Amazônia"],["floresta","montanha"],["Amazônia","rio"],
          ["rio","água"],["água","cachoeira"],["água","chuva"],
          ["cachoeira","pedra"],["pedra","montanha"],["montanha","neve"],
          ["neve","frio"],["frio","inverno"],["inverno","estação"],["inverno","chuva"],
          ["estação","primavera"],["primavera","flor"],["flor","jardim"],
          ["jardim","semente"],["jardim","minhoca"],["semente","terra"],["terra","minhoca"],
          ["chuva","arco-íris"],["arco-íris","cor"],["cor","flor"]
        ]
      },
      dificil: {
        ligacoes: [
          ["natureza","vulcão"],["natureza","Terra"],["natureza","campo"],
          ["vulcão","lava"],["vulcão","terremoto"],["lava","fogo"],
          ["fogo","lenha"],["lenha","árvore"],["lenha","madeira"],["árvore","madeira"],
          ["árvore","raiz"],["árvore","folha"],["raiz","matemática"],["matemática","número"],
          ["número","sorte"],["sorte","trevo"],["trevo","folha"],["folha","outono"],
          ["outono","vento"],["vento","moinho"],["vento","onda"],["moinho","farinha"],
          ["farinha","pão"],["pão","trigo"],["trigo","campo"],["campo","girassol"],
          ["girassol","sol"],["sol","estrela"],["sol","planeta"],["estrela","mar"],
          ["mar","onda"],["onda","surfe|surf"],["surfe|surf","prancha"],["prancha","madeira"],
          ["terremoto","Terra"],["Terra","planeta"],["planeta","estrela"],
          ["sol","lua"],["lua","maré"],["maré","mar"],["maré","onda"],["fogo","fumaça"],["vulcão","fumaça"],["fumaça","nuvem"],["nuvem","vento"],
          ["semente","girassol"],["semente","trigo"],["semente","raiz"],["lenha","cinza"],["cinza","vulcão"],["cinza","fumaça"]
        ]
      }
    }
  },

  musica: {
    nome: "Música",
    cor: "#7a4cc2",
    niveis: {
      facil: {
        ligacoes: [
          ["música","violão"],["música","piano"],["música","cantor"],["música","ritmo"],
          ["violão","corda"],["piano","tecla"],["piano","corda"],
          ["cantor","voz"],["cantor","microfone"],["voz","microfone"],
          ["microfone","palco"],["palco","show"],["show","cantor"],
          ["palco","dança"],["dança","ritmo"],["tecla","ritmo"]
        ]
      },
      medio: {
        ligacoes: [
          ["música","samba"],["música","sertanejo"],["música","rádio"],["música","forró"],["música","nota"],
          ["samba","pandeiro"],["samba","carnaval"],["pandeiro","forró"],
          ["carnaval","fantasia"],["carnaval","máscara"],["fantasia","máscara"],
          ["sertanejo","viola"],["sertanejo","dupla"],["sertanejo","sanfona"],["dupla","viola"],
          ["rádio","notícia"],["rádio","dupla"],["notícia","jornal"],["jornal","fantasia"],
          ["forró","sanfona"],["forró","São João"],["São João","fogueira"],["fogueira","sanfona"],
          ["nota","partitura"],["partitura","maestro"],["maestro","orquestra"],["orquestra","nota"],
          ["jornal","máscara"]
        ]
      },
      dificil: {
        ligacoes: [
          ["música","letra"],["música","rádio"],["música","trilha sonora"],["música","rock"],["música","hino"],
          ["letra","alfabeto"],["letra","hino"],["alfabeto","escola"],["escola","sinal"],
          ["sinal","trânsito"],["sinal","luz"],["trânsito","rádio"],
          ["rádio","antena"],["antena","televisão"],["televisão","novela"],["televisão","cinema"],
          ["novela","trilha sonora"],["trilha sonora","cinema"],["cinema","pipoca"],
          ["pipoca","milho"],["milho","festa junina"],["festa junina","quadrilha"],["festa junina","bandeira"],
          ["quadrilha","dança"],["dança","música"],["dança","balé"],["balé","sapatilha"],["sapatilha","dança"],
          ["rock","guitarra"],["guitarra","elétrica"],["elétrica","energia"],["energia","luz"],
          ["luz","vela"],["vela","bolo"],["bolo","aniversário"],["aniversário","parabéns"],
          ["parabéns","música"],["hino","bandeira"],["bolo","festa junina"],
          ["vela","barco"],["barco","onda"],["onda","rádio"],["rock","disco"],["disco","dança"],["teclado","letra"],["teclado","rock"],
          ["palco","rock"],["palco","luz"],["palco","dança"],["milho","canjica"],["canjica","festa junina"]
        ]
      }
    }
  },

  animais: {
    nome: "Animais",
    cor: "#c9671f",
    niveis: {
      facil: {
        ligacoes: [
          ["animais","cachorro"],["animais","vaca"],["animais","pássaro"],
          ["cachorro","osso"],["cachorro","gato"],["osso","leite"],
          ["gato","rato"],["gato","leite"],["rato","queijo"],
          ["queijo","leite"],["leite","vaca"],["vaca","queijo"],
          ["pássaro","ninho"],["ninho","ovo"],["ovo","galinha"],["galinha","pássaro"]
        ]
      },
      medio: {
        ligacoes: [
          ["animais","leão"],["animais","zoológico"],["animais","elefante"],
          ["leão","rei"],["leão","juba"],["leão","selva"],["leão","jaula"],
          ["rei","coroa"],["coroa","juba"],
          ["selva","macaco"],["selva","tigre"],["macaco","banana"],["macaco","zoológico"],
          ["zoológico","jaula"],["zoológico","girafa"],["girafa","pescoço"],["girafa","África"],
          ["África","zebra"],["África","elefante"],["zebra","listra"],["listra","tigre"],
          ["elefante","tromba"],["elefante","memória"],["tromba","memória"],
          ["tigre","laranja"],["laranja","banana"],["pescoço","coroa"]
        ]
      },
      dificil: {
        ligacoes: [
          ["animais","cobra"],["animais","jacaré"],["animais","cavalo"],["animais","baleia"],["animais","pato"],
          ["cobra","veneno"],["veneno","remédio"],["veneno","sapo"],["remédio","farmácia"],["farmácia","dinheiro"],
          ["jacaré","bolsa"],["jacaré","lama"],["bolsa","dinheiro"],["dinheiro","cofre"],
          ["cofre","porco"],["porco","lama"],
          ["tartaruga","casco"],["tartaruga","lagoa"],["tartaruga","baleia"],
          ["casco","cavalo"],["cavalo","ferradura"],["cavalo","xadrez"],["cavalo","boi"],
          ["ferradura","sorte"],["sorte","xadrez"],["xadrez","peão"],["peão","rodeio"],
          ["rodeio","boi"],["boi","chifre"],["chifre","rodeio"],
          ["baleia","azul"],["azul","céu"],["céu","noite"],
          ["pato","lagoa"],["lagoa","sapo"],
          ["morcego","noite"],["morcego","coruja"],["noite","coruja"],["coruja","céu"],
          ["pato","pena"],["coruja","pena"],["pena","travesseiro"],["travesseiro","noite"],["baleia","tubarão"],["tubarão","dente"],
          ["dente","jacaré"],["arara","azul"],["arara","pena"],["veterinário","remédio"],["veterinário","cavalo"]
        ]
      }
    }
  }
};
