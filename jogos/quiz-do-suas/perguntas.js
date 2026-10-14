// Quiz do SUAS - banco de perguntas (45: 15 por nivel)
// Fontes: LOAS (Lei 8.742/1993, texto compilado), Lei 12.435/2011, Constituicao Federal (arts. 203 e 204),
// Tipificacao Nacional dos Servicos Socioassistenciais (Resolucao CNAS 109/2009) e NOB-SUAS 2012 (Resolucao CNAS 33/2012).
(function () {
  var LOAS = "https://www.planalto.gov.br/ccivil_03/leis/l8742.htm";
  var L12435 = "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12435.htm";
  var CF = "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm";
  var TIPIF = "https://www.mds.gov.br/webarquivos/publicacao/assistencia_social/Normativas/tipificacao.pdf";
  var NOB = "https://www.mds.gov.br/webarquivos/public/NOBSUAS_2012.pdf";

  window.QUIZ_PERGUNTAS = {
    normal: [
      {
        cena: "justica",
        pergunta: "Segundo o art. 1º da LOAS, a assistência social é uma política de seguridade social de que natureza?",
        certa: "Não contributiva",
        erradas: ["Contributiva", "Parcialmente contributiva", "Contributiva só para idosos"],
        curiosidade: "LOAS, art. 1º: a assistência social é direito do cidadão e dever do Estado, Política de Seguridade Social não contributiva, que provê os mínimos sociais.",
        fonte: LOAS
      },
      {
        cena: "bairro-periferia",
        pergunta: "Segundo a LOAS, em qual unidade pública a proteção social básica é ofertada precipuamente?",
        certa: "Centro de Referência de Assistência Social (Cras)",
        erradas: ["Centro de Referência Especializado de Assistência Social (Creas)", "Centro de Atenção Psicossocial (Caps)", "Centro de Convivência e Fortalecimento de Vínculos"],
        curiosidade: "LOAS, art. 6º-C (incluído pela Lei 12.435/2011): as proteções básica e especial são ofertadas precipuamente no Cras e no Creas, respectivamente, e pelas entidades sem fins lucrativos de assistência social.",
        fonte: LOAS
      },
      {
        cena: "moradia",
        pergunta: "Segundo a LOAS, em qual unidade pública a proteção social especial é ofertada precipuamente?",
        certa: "Centro de Referência Especializado de Assistência Social (Creas)",
        erradas: ["Centro de Referência de Assistência Social (Cras)", "Centro de Atenção Psicossocial (Caps)", "Centro de Convivência e Fortalecimento de Vínculos"],
        curiosidade: "LOAS, art. 6º-C: o Creas atende indivíduos e famílias em situação de risco pessoal ou social, por violação de direitos ou contingência, que demandam intervenções especializadas.",
        fonte: LOAS
      },
      {
        cena: "feira-trabalho",
        pergunta: "Qual é a garantia mensal do Benefício de Prestação Continuada (BPC), conforme o art. 20 da LOAS?",
        certa: "Um salário mínimo",
        erradas: ["Meio salário mínimo", "Dois salários mínimos", "Um quarto de salário mínimo"],
        curiosidade: "LOAS, art. 20: o BPC é a garantia de um salário-mínimo mensal à pessoa com deficiência e ao idoso que comprovem não possuir meios de prover a própria manutenção nem de tê-la provida pela família.",
        fonte: LOAS
      },
      {
        cena: "idosos-atividade",
        pergunta: "Na redação atual do art. 20 da LOAS, qual é a idade mínima da pessoa idosa para ter direito ao BPC?",
        certa: "65 anos",
        erradas: ["60 anos", "67 anos", "70 anos"],
        curiosidade: "LOAS, art. 20, caput: idoso com 65 anos ou mais. A redação original da LOAS, de 1993, previa 70 anos.",
        fonte: LOAS
      },
      {
        cena: "horta",
        pergunta: "Quem tem direito ao BPC, desde que comprove não ter meios de se manter nem de ser mantido pela família?",
        certa: "Pessoa idosa ou com deficiência",
        erradas: ["Trabalhador desempregado", "Gestante em qualquer idade", "Criança fora da escola"],
        curiosidade: "LOAS, art. 20: o BPC se destina à pessoa com deficiência e ao idoso. Não é aposentadoria: não exige contribuição prévia ao INSS.",
        fonte: LOAS
      },
      {
        cena: "congresso",
        pergunta: "Segundo o art. 203 da Constituição, a assistência social será prestada a quem dela necessitar, independentemente de quê?",
        certa: "De contribuição à seguridade social",
        erradas: ["De vínculo formal de emprego", "De residência fixa comprovada", "De inscrição em programa social"],
        curiosidade: "CF/88, art. 203, caput: a assistência social é prestada a quem dela necessitar, independentemente de contribuição à seguridade social.",
        fonte: CF
      },
      {
        cena: "criancas-brincando",
        pergunta: "Qual é o foco da proteção social básica, segundo o art. 6º-A da LOAS?",
        certa: "Prevenir situações de vulnerabilidade e risco social",
        erradas: ["Reparar violações de direitos já ocorridas", "Acolher quem perdeu todos os vínculos", "Aplicar medidas socioeducativas"],
        curiosidade: "LOAS, art. 6º-A, I: a proteção social básica visa a prevenir situações de vulnerabilidade e risco social, desenvolvendo potencialidades e fortalecendo vínculos familiares e comunitários.",
        fonte: LOAS
      },
      {
        cena: "esplanada",
        pergunta: "A LOAS, que organiza a assistência social no Brasil, é qual lei federal?",
        certa: "Lei nº 8.742, de 1993",
        erradas: ["Lei nº 8.080, de 1990", "Lei nº 8.213, de 1991", "Lei nº 8.069, de 1990"],
        curiosidade: "A Lei nº 8.742/1993 é a Lei Orgânica da Assistência Social. As outras são a Lei Orgânica da Saúde (8.080), a de Benefícios da Previdência (8.213) e o ECA (8.069).",
        fonte: LOAS
      },
      {
        cena: "planalto",
        pergunta: "Qual lei de 2011 alterou a LOAS e passou a organizar a assistência social no Sistema Único (Suas)?",
        certa: "Lei nº 12.435, de 2011",
        erradas: ["Lei nº 10.741, de 2003", "Lei nº 12.101, de 2009", "Lei nº 13.146, de 2015"],
        curiosidade: "A Lei 12.435, de 6 de julho de 2011, deu nova redação a artigos da LOAS e acrescentou outros, como os que tratam do Suas, do Cras, do Creas, do Paif e do Paefi.",
        fonte: L12435
      },
      {
        cena: "atendimento-cadunico",
        pergunta: "O art. 4º da LOAS, ao tratar dos princípios, veda qual tipo de comprovação da necessidade do cidadão?",
        certa: "Comprovação vexatória",
        erradas: ["Comprovação presencial", "Comprovação documental", "Comprovação repetida"],
        curiosidade: "LOAS, art. 4º, III: respeito à dignidade do cidadão, à sua autonomia e ao direito a benefícios e serviços de qualidade, vedando-se qualquer comprovação vexatória de necessidade.",
        fonte: LOAS
      },
      {
        cena: "justica",
        pergunta: "Segundo o art. 5º da LOAS, a descentralização político-administrativa vem acompanhada de qual comando em cada esfera de governo?",
        certa: "Comando único",
        erradas: ["Comando compartilhado", "Comando consultivo", "Comando regional"],
        curiosidade: "LOAS, art. 5º, I: descentralização político-administrativa para Estados, DF e Municípios, e comando único das ações em cada esfera de governo.",
        fonte: LOAS
      },
      {
        cena: "reuniao-conselho",
        pergunta: "Os conselhos de assistência social, instâncias deliberativas do Suas, têm composição de que tipo?",
        certa: "Paritária entre governo e sociedade civil",
        erradas: ["Majoritária de representantes do governo", "Exclusiva de trabalhadores do setor", "Proporcional à população atendida"],
        curiosidade: "LOAS, art. 16: as instâncias deliberativas do Suas têm caráter permanente e composição paritária entre governo e sociedade civil.",
        fonte: LOAS
      },
      {
        cena: "familia-comunidade",
        pergunta: "O registro público que identifica e caracteriza as famílias de baixa renda, previsto no art. 6º-F da LOAS, é o:",
        certa: "Cadastro Único (CadÚnico)",
        erradas: ["Cadastro Nacional de Informações Sociais (CNIS)", "Relação Anual de Informações Sociais (Rais)", "Cadastro de Entidades de Assistência"],
        curiosidade: "LOAS, art. 6º-F: o CadÚnico é o registro público eletrônico para identificação e caracterização socioeconômica das famílias de baixa renda. Para o BPC, a inscrição nele é requisito (art. 20, § 12).",
        fonte: LOAS
      },
      {
        cena: "fachada-cras",
        pergunta: "Segundo o art. 6º-A da LOAS, a assistência social se organiza em quais tipos de proteção?",
        certa: "Proteção social básica e especial",
        erradas: ["Proteção preventiva e curativa", "Proteção primária e secundária", "Proteção emergencial e permanente"],
        curiosidade: "LOAS, art. 6º-A (Lei 12.435/2011): proteção social básica e proteção social especial. A divisão da especial em média e alta complexidade vem da Tipificação Nacional (Res. CNAS 109/2009).",
        fonte: LOAS
      }
    ],

    dificil: [
      {
        cena: "familia-comunidade",
        pergunta: "Qual serviço, da proteção social básica, consiste no trabalho social com famílias e é ofertado necessariamente no Cras?",
        certa: "Serviço de Proteção e Atendimento Integral à Família (Paif)",
        erradas: ["Serviço de Proteção e Atendimento Especializado a Famílias e Indivíduos (Paefi)", "Serviço Especializado em Abordagem Social", "Serviço de Acolhimento Institucional"],
        curiosidade: "LOAS, art. 24-A, e Tipificação Nacional (Res. CNAS 109/2009): o Paif é ofertado necessariamente no Cras, é de oferta exclusivamente estatal e suas ações não devem ter caráter terapêutico.",
        fonte: TIPIF
      },
      {
        cena: "atendimento-cadunico",
        pergunta: "Qual serviço apoia, orienta e acompanha famílias com membros em situação de ameaça ou violação de direitos, tendo o Creas como unidade de referência?",
        certa: "Serviço de Proteção e Atendimento Especializado a Famílias e Indivíduos (Paefi)",
        erradas: ["Serviço de Proteção e Atendimento Integral à Família (Paif)", "Serviço de Convivência e Fortalecimento de Vínculos", "Serviço de Proteção Social Básica no Domicílio"],
        curiosidade: "LOAS, art. 24-B (Lei 12.435/2011): o Paefi integra a proteção social especial. Na Tipificação Nacional, é serviço de média complexidade, ofertado no Creas.",
        fonte: TIPIF
      },
      {
        cena: "oficina-grupo",
        pergunta: "Qual serviço é realizado em grupos, organizado em percursos conforme o ciclo de vida, e complementa o trabalho social com famílias do Paif?",
        certa: "Serviço de Convivência e Fortalecimento de Vínculos",
        erradas: ["Serviço Especializado para Pessoas em Situação de Rua", "Serviço de Acolhimento em República", "Serviço de Proteção Social Especial para Pessoas com Deficiência"],
        curiosidade: "Tipificação Nacional (Res. CNAS 109/2009): o SCFV é serviço de proteção social básica, de caráter preventivo e proativo, articulado ao Paif.",
        fonte: TIPIF
      },
      {
        cena: "feira-trabalho",
        pergunta: "Qual dos serviços abaixo é classificado como de média complexidade na Tipificação Nacional?",
        certa: "Serviço Especializado em Abordagem Social",
        erradas: ["Serviço de Acolhimento em Família Acolhedora", "Serviço de Acolhimento em República", "Serviço de Proteção em Situações de Calamidades Públicas e de Emergências"],
        curiosidade: "Na Tipificação, a média complexidade reúne cinco serviços: Paefi, Abordagem Social, medidas socioeducativas em meio aberto (LA e PSC), serviço para pessoas com deficiência, idosas e suas famílias, e serviço para pessoas em situação de rua.",
        fonte: TIPIF
      },
      {
        cena: "criancas-brincando",
        pergunta: "Qual dos serviços abaixo é classificado como de alta complexidade na Tipificação Nacional?",
        certa: "Serviço de Acolhimento em Família Acolhedora",
        erradas: ["Serviço Especializado em Abordagem Social", "Serviço Especializado para Pessoas em Situação de Rua", "Serviço de Convivência e Fortalecimento de Vínculos"],
        curiosidade: "A alta complexidade reúne os serviços de acolhimento institucional, em república, em família acolhedora e de proteção em situações de calamidades públicas e de emergências.",
        fonte: TIPIF
      },
      {
        cena: "moradia",
        pergunta: "Na Tipificação Nacional, o Serviço de Acolhimento em Repúblicas oferece moradia subsidiada a grupos de qual perfil?",
        certa: "Maiores de 18 anos com vínculos familiares rompidos ou muito fragilizados",
        erradas: ["Crianças de até 6 anos afastadas da família", "Famílias inteiras atingidas por enchentes", "Adolescentes em medida socioeducativa de internação"],
        curiosidade: "Tipificação Nacional (Res. CNAS 109/2009): serviço de alta complexidade, desenvolvido em sistema de autogestão ou cogestão, que busca gradual autonomia e independência dos moradores.",
        fonte: TIPIF
      },
      {
        cena: "centro-convivencia",
        pergunta: "Os benefícios eventuais da LOAS são prestados em virtude de quais situações?",
        certa: "Nascimento, morte, vulnerabilidade temporária e calamidade pública",
        erradas: ["Desemprego, doença, invalidez e velhice", "Maternidade, casamento, viuvez e aposentadoria", "Pobreza extrema, orfandade, doença e abandono"],
        curiosidade: "LOAS, art. 22 (redação da Lei 12.435/2011): benefícios eventuais são provisões suplementares e provisórias, prestadas em virtude de nascimento, morte, situações de vulnerabilidade temporária e de calamidade pública.",
        fonte: LOAS
      },
      {
        cena: "congresso",
        pergunta: "Segundo o art. 22 da LOAS, quem define a concessão e o valor dos benefícios eventuais?",
        certa: "Estados, DF e Municípios, com critérios dos seus conselhos",
        erradas: ["O INSS, por regulamento federal", "A União, por decreto presidencial", "O CNAS, de forma única para todo o país"],
        curiosidade: "LOAS, art. 22, § 1º: a concessão e o valor são definidos pelos Estados, DF e Municípios, previstos nas leis orçamentárias anuais, com base em critérios e prazos definidos pelos respectivos Conselhos de Assistência Social.",
        fonte: LOAS
      },
      {
        cena: "esplanada",
        pergunta: "Qual comissão é a instância nacional de negociação e pactuação entre os gestores federal, estaduais e municipais do Suas?",
        certa: "CIT (Comissão Intergestores Tripartite)",
        erradas: ["CIB (Comissão Intergestores Bipartite)", "CNAS (Conselho Nacional de Assistência Social)", "Conferência Nacional de Assistência Social"],
        curiosidade: "NOB-SUAS 2012, art. 128 e art. 134: a CIT é a instância de negociação e pactuação, no âmbito nacional, quanto aos aspectos operacionais da gestão do Suas. Pactuar não é deliberar: a deliberação cabe aos conselhos.",
        fonte: NOB
      },
      {
        cena: "reuniao-conselho",
        pergunta: "Pela NOB-SUAS 2012, a CIB é a instância de pactuação de que âmbito e reúne quais gestores?",
        certa: "Estadual, com gestores do Estado e dos Municípios",
        erradas: ["Nacional, com gestores da União, dos Estados e do DF", "Municipal, com a prefeitura e o conselho municipal", "Regional, com consórcios e o Ministério Público"],
        curiosidade: "NOB-SUAS 2012, arts. 128 e 130: a CIB é integrada pelo Estado e pelos Municípios (estes representados pelo Coegemas) e pactua aspectos operacionais da gestão do Suas no âmbito estadual.",
        fonte: NOB
      },
      {
        cena: "justica",
        pergunta: "Qual conjunto de instituições é condição para o repasse de recursos da LOAS aos Estados, ao DF e aos Municípios, segundo o art. 30?",
        certa: "Conselho, Fundo e Plano de Assistência Social",
        erradas: ["Conselho, Fundo e Conferência de Assistência Social", "Conselho, Plano Diretor e Ouvidoria", "Fundo, Cras e Cadastro de Entidades"],
        curiosidade: "LOAS, art. 30: é condição para os repasses a efetiva instituição e funcionamento de Conselho de Assistência Social paritário, Fundo de Assistência Social e Plano de Assistência Social.",
        fonte: LOAS
      },
      {
        cena: "planalto",
        pergunta: "Segundo o art. 28, § 1º, da LOAS, o Fundo de Assistência Social é gerido sob orientação e controle de quem?",
        certa: "Do respectivo Conselho de Assistência Social",
        erradas: ["Do Tribunal de Contas competente", "Do Poder Legislativo local", "Da Comissão Intergestores"],
        curiosidade: "LOAS, art. 28, § 1º (Lei 12.435/2011): cabe ao órgão gestor da assistência social, nas três esferas, gerir o Fundo de Assistência Social, sob orientação e controle dos respectivos Conselhos.",
        fonte: LOAS
      },
      {
        cena: "bairro-periferia",
        pergunta: "Qual função da assistência social visa a analisar territorialmente a capacidade protetiva das famílias e a ocorrência de vulnerabilidades, ameaças, vitimizações e danos?",
        certa: "Vigilância socioassistencial",
        erradas: ["Defesa de direitos", "Gestão do trabalho", "Controle social"],
        curiosidade: "LOAS, art. 2º, II (Lei 12.435/2011): a vigilância socioassistencial é um dos objetivos da assistência social, ao lado da proteção social (inciso I) e da defesa de direitos (inciso III).",
        fonte: LOAS
      },
      {
        cena: "horta",
        pergunta: "Qual unidade pública tem abrangência e gestão que pode ser municipal, estadual ou regional, segundo o art. 6º-C da LOAS?",
        certa: "Centro de Referência Especializado de Assistência Social (Creas)",
        erradas: ["Centro de Referência de Assistência Social (Cras)", "Centro de Convivência e Fortalecimento de Vínculos", "Unidade de Acolhimento Institucional para adultos e famílias"],
        curiosidade: "LOAS, art. 6º-C, § 2º: o Creas é unidade pública de abrangência e gestão municipal, estadual ou regional. Já o Cras (§ 1º) é unidade pública municipal, de base territorial.",
        fonte: LOAS
      },
      {
        cena: "oficina-grupo",
        pergunta: "Segundo o art. 6º-B da LOAS, como se chama o reconhecimento de que uma entidade de assistência social integra a rede socioassistencial?",
        certa: "Vinculação ao Suas",
        erradas: ["Inscrição no CadÚnico", "Certificação de entidade filantrópica", "Credenciamento no Conselho Tutelar"],
        curiosidade: "LOAS, art. 6º-B, § 1º: a vinculação ao Suas é o reconhecimento de que a entidade integra a rede socioassistencial. Entre os requisitos estão se constituir conforme o art. 3º e se inscrever no conselho municipal ou do DF.",
        fonte: LOAS
      }
    ],

    impossivel: [
      {
        cena: "reuniao-conselho",
        pergunta: "Pelo art. 17 da LOAS, de quantos membros é composto o CNAS?",
        certa: "18 membros, 9 do governo e 9 da sociedade civil",
        erradas: ["12 membros, 6 do governo e 6 da sociedade civil", "15 membros, 5 do governo e 10 da sociedade civil", "24 membros, 12 do governo e 12 da sociedade civil"],
        curiosidade: "LOAS, art. 17, § 1º: 18 membros e respectivos suplentes. Entre os 9 governamentais, há 1 representante dos Estados e 1 dos Municípios; os 9 da sociedade civil são escolhidos em foro próprio, sob fiscalização do Ministério Público Federal.",
        fonte: LOAS
      },
      {
        cena: "congresso",
        pergunta: "Segundo o art. 17 da LOAS, qual é o mandato dos membros do CNAS?",
        certa: "2 anos, com uma única recondução por igual período",
        erradas: ["4 anos, sem possibilidade de recondução", "3 anos, com reconduções ilimitadas", "1 ano, com até duas reconduções"],
        curiosidade: "LOAS, art. 17, caput: membros nomeados pelo Presidente da República, com mandato de 2 anos, permitida uma única recondução por igual período.",
        fonte: LOAS
      },
      {
        cena: "planalto",
        pergunta: "Segundo o art. 17, § 2º, da LOAS, qual é o mandato do presidente do CNAS, eleito entre seus membros?",
        certa: "1 ano, com uma única recondução",
        erradas: ["2 anos, sem recondução", "6 meses, renovável sem limite", "4 anos, com uma recondução"],
        curiosidade: "LOAS, art. 17, § 2º: o CNAS é presidido por um de seus integrantes, eleito entre os membros, para mandato de 1 ano, permitida uma única recondução por igual período.",
        fonte: LOAS
      },
      {
        cena: "idosos-atividade",
        pergunta: "Conforme o caput do art. 21 da LOAS, de quanto em quanto tempo o BPC deve ser revisto?",
        certa: "A cada 2 anos",
        erradas: ["A cada ano", "A cada 3 anos", "A cada 5 anos"],
        curiosidade: "LOAS, art. 21: o BPC deve ser revisto a cada 2 anos para avaliação da continuidade das condições que lhe deram origem. O pagamento cessa quando elas são superadas ou com a morte do beneficiário (§ 1º).",
        fonte: LOAS
      },
      {
        cena: "moradia",
        pergunta: "Para o BPC, impedimentos de longo prazo da pessoa com deficiência são aqueles que produzem efeitos pelo prazo mínimo de quanto tempo?",
        certa: "2 anos",
        erradas: ["6 meses", "1 ano", "5 anos"],
        curiosidade: "LOAS, art. 20, § 10: considera-se impedimento de longo prazo aquele que produza efeitos pelo prazo mínimo de 2 (dois) anos.",
        fonte: LOAS
      },
      {
        cena: "bairro-periferia",
        pergunta: "Segundo o art. 13, IV, da LOAS, compete a qual ente estimular e apoiar técnica e financeiramente as associações e consórcios municipais na prestação de serviços?",
        certa: "Aos Estados",
        erradas: ["À União", "Ao Distrito Federal", "Aos Municípios"],
        curiosidade: "LOAS, art. 13, IV: compete aos Estados estimular e apoiar técnica e financeiramente as associações e consórcios municipais. O inciso V traz ainda os serviços regionais cujo custo ou falta de demanda municipal justifiquem uma rede desconcentrada.",
        fonte: LOAS
      },
      {
        cena: "esplanada",
        pergunta: "Qual índice, criado no art. 12-A da LOAS pela Lei 12.435/2011, mede os resultados da gestão descentralizada do Suas para apoio financeiro da União?",
        certa: "Índice de Gestão Descentralizada (IGD) do Suas",
        erradas: ["Índice de Desenvolvimento Humano Municipal", "Índice de Gestão do Cadastro Único", "Índice de Vulnerabilidade Social"],
        curiosidade: "LOAS, art. 12-A: a União apoia financeiramente o aprimoramento da gestão descentralizada por meio do IGD-Suas; os resultados do ente contam como prestação de contas dos recursos transferidos.",
        fonte: LOAS
      },
      {
        cena: "planalto",
        pergunta: "Em que data foi sancionada a Lei nº 12.435, que alterou a LOAS?",
        certa: "6 de julho de 2011",
        erradas: ["7 de dezembro de 1993", "7 de julho de 2011", "28 de novembro de 2011"],
        curiosidade: "A Lei 12.435 é de 6 de julho de 2011 (sancionada pela presidenta Dilma Rousseff) e saiu no Diário Oficial de 7 de julho. A LOAS original é de 7 de dezembro de 1993.",
        fonte: L12435
      },
      {
        cena: "justica",
        pergunta: "O art. 1º da Lei 12.435/2011 deu nova redação a quantos artigos da LOAS?",
        certa: "16 artigos",
        erradas: ["9 artigos", "12 artigos", "25 artigos"],
        curiosidade: "Lei 12.435/2011, art. 1º: arts. 2º, 3º, 6º, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 28 e 36. O art. 2º da lei acrescentou outros, como os arts. 6º-A a 6º-E, 12-A e 24-A a 24-C.",
        fonte: L12435
      },
      {
        cena: "congresso",
        pergunta: "Qual artigo da LOAS foi revogado pelo art. 3º da Lei 12.435/2011?",
        certa: "Art. 38",
        erradas: ["Art. 33", "Art. 37", "Art. 40"],
        curiosidade: "Lei 12.435/2011, art. 3º: revoga-se o art. 38 da LOAS, que tratava da redução da idade mínima do BPC para o idoso.",
        fonte: L12435
      },
      {
        cena: "oficina-grupo",
        pergunta: "Em qual artigo da LOAS foi instituído o Paefi, por meio da Lei 12.435/2011?",
        certa: "Art. 24-B",
        erradas: ["Art. 24-A", "Art. 24-C", "Art. 6º-C"],
        curiosidade: "Lei 12.435/2011 acrescentou à LOAS: art. 24-A (Paif), art. 24-B (Paefi) e art. 24-C (Peti). O art. 6º-C trata do Cras e do Creas.",
        fonte: L12435
      },
      {
        cena: "atendimento-cadunico",
        pergunta: "Segundo o art. 20, § 12, da LOAS, quais inscrições são requisitos para a concessão, a manutenção e a revisão do BPC?",
        certa: "CPF e Cadastro Único",
        erradas: ["CPF e CNIS", "Cartão SUS e Cadastro Único", "NIS e Carteira de Trabalho"],
        curiosidade: "LOAS, art. 20, § 12: são requisitos as inscrições no Cadastro de Pessoas Físicas (CPF) e no Cadastro Único para Programas Sociais, conforme previsto em regulamento.",
        fonte: LOAS
      },
      {
        cena: "esplanada",
        pergunta: "Pela NOB-SUAS 2012 (art. 134), quantos membros titulares cada ente (União, Estados e DF, Municípios) indica para a CIT?",
        certa: "5 membros titulares",
        erradas: ["3 membros titulares", "6 membros titulares", "9 membros titulares"],
        curiosidade: "NOB-SUAS 2012, art. 134: a CIT tem 5 titulares da União, 5 dos Estados e DF (indicados pelo Fonseas) e 5 dos Municípios (indicados pelo Congemas), cada um com seus suplentes: 15 titulares no total.",
        fonte: NOB
      },
      {
        cena: "reuniao-conselho",
        pergunta: "Pelo art. 136 da NOB-SUAS 2012, quantos representantes do Estado e dos Municípios, respectivamente, compõem a CIB?",
        certa: "6 do Estado e 6 dos Municípios",
        erradas: ["5 do Estado e 5 dos Municípios", "4 do Estado e 8 dos Municípios", "9 do Estado e 9 dos Municípios"],
        curiosidade: "NOB-SUAS 2012, art. 136, § 1º: 6 representantes do Estado e 6 dos Municípios, indicados pelo Coegemas, contemplando portes e regiões. A composição pode ser ampliada, mas é vedada a redução desses números (§ 4º).",
        fonte: NOB
      },
      {
        cena: "criancas-brincando",
        pergunta: "Pelo art. 22, § 2º, da LOAS, o CNAS pode propor benefícios subsidiários de até qual percentual do salário mínimo para cada criança de até 6 anos?",
        certa: "25%",
        erradas: ["10%", "50%", "75%"],
        curiosidade: "LOAS, art. 22, § 2º (redação da Lei 12.435/2011): benefícios subsidiários de até 25% do salário-mínimo por criança de até 6 anos, conforme as disponibilidades orçamentárias das três esferas.",
        fonte: LOAS
      }
    ]
  };
})();
