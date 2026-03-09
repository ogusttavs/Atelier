import { useState } from 'react';
import { BookOpen, TrendingUp, Star, SlidersHorizontal } from 'lucide-react';
import RecipeCard, { Recipe } from './RecipeCard';

// ─── RECEITAS CLÁSSICAS ────────────────────────────────────────────────────────
const classicRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Ovo de Colher Ninho com Nutella',
    subtitle: 'O clássico campeão de vendas — fácil de fazer e amado por todos',
    description: 'O ovo de colher de Ninho com Nutella é, disparado, o mais vendido do Brasil na Páscoa. A combinação do brigadeiro cremoso de leite Ninho com camadas de Nutella é irresistível. É a aposta mais segura para quem está começando, pois tem alta aceitação, custo acessível e margem excelente. Um único ovo de 350g pode ser vendido por R$ 85 a R$ 95.',
    difficulty: 'Fácil',
    prepTime: '1h30',
    trend: '⭐',
    trendLabel: 'Clássico Campeão',
    avgPrice: 'R$ 85-95',
    estimatedCost: 'R$ 28-35',
    profit: '~R$ 55',
    margin: '160%',
    packagingTip: 'Use caixas craft com visor transparente e finalize com laço de cetim. Uma tag personalizada com o nome do cliente aumenta o valor percebido em até R$ 15. Não economize aqui — a embalagem é o que transforma um doce caseiro em um presente de Páscoa.',
    youtubeQuery: 'ovo de colher ninho com nutella receita passo a passo faça e venda',
    tiktokQuery: 'ovo colher ninho nutella páscoa receita',
    ingredients: [
      '1 lata de leite condensado',
      '1 caixinha de creme de leite',
      '4 colheres de leite Ninho (leite em pó)',
      '1 colher de manteiga sem sal',
      'Nutella (200g)',
      '400g de chocolate ao leite (casca)',
      'Granulado de chocolate para decorar',
    ],
    steps: [
      'Derreta o chocolate e faça as cascas na forma de ovo (350g)',
      'Faça o brigadeiro de Ninho: cozinhe leite condensado, creme de leite, leite em pó e manteiga até o ponto cremoso',
      'Deixe o brigadeiro esfriar completamente (mínimo 4 horas)',
      'Preencha a casca com uma camada de brigadeiro de Ninho',
      'Adicione uma camada generosa de Nutella no centro',
      'Cubra com mais brigadeiro e decore com bolinhas de Ninho e granulado',
    ],
  },
  {
    id: 2,
    name: 'Ovo de Colher de Pistache',
    subtitle: 'A tendência nº 1 da confeitaria — o sabor premium que todos querem',
    description: 'O pistache explodiu em 2024 e continua dominando em 2025/2026. É o sabor que mais cresce no mercado de ovos artesanais. A percepção de valor é altíssima — o cliente associa pistache a sofisticação e paga mais. Pode ser feito com pasta de pistache caseira (mais barato) ou comprada. Combina com chocolate branco e ganache de chocolate ao leite.',
    difficulty: 'Médio',
    prepTime: '2h',
    trend: '🔥',
    trendLabel: 'Tendência #1',
    avgPrice: 'R$ 95-120',
    estimatedCost: 'R$ 40-50',
    profit: '~R$ 60',
    margin: '140%',
    packagingTip: 'Invista em caixa rígida na cor verde escuro ou dourado. Pistache pede embalagem premium. Coloque alguns pistaches inteiros sobre o ovo como decoração — isso justifica o preço mais alto e cria um efeito visual poderoso para fotos no Instagram.',
    youtubeQuery: 'ovo de colher pistache receita passo a passo como fazer páscoa',
    tiktokQuery: 'ovo pistache páscoa 2026 tendência',
    ingredients: [
      '200g de pistache sem casca e sem sal',
      '2 colheres de óleo de coco',
      '1 lata de leite condensado',
      '1 caixinha de creme de leite',
      '200g de chocolate branco',
      '400g de chocolate ao leite ou meio amargo (casca)',
      'Pistache triturado para decorar',
    ],
    steps: [
      'Faça a pasta de pistache: bata o pistache no processador com óleo de coco até virar um creme liso',
      'Faça o brigadeiro de pistache: cozinhe leite condensado, creme de leite e pasta de pistache',
      'Derreta o chocolate branco e misture para dar cremosidade extra',
      'Prepare as cascas de chocolate e deixe cristalizar',
      'Preencha com o recheio de pistache e decore com pistache triturado',
      'Finalize com fios de chocolate branco derretido por cima',
    ],
  },
  {
    id: 3,
    name: 'Ovo de Colher Brigadeiro Gourmet',
    subtitle: 'O favorito eterno — feito com chocolate nobre e cacau de verdade',
    description: 'O brigadeiro gourmet, feito com cacau 50-70% e chocolate nobre, é completamente diferente do brigadeiro de festa de criança. O público percebe essa diferença e paga por ela. É a receita mais segura e com menos risco de encalhe. Funciona como ovo principal do cardápio — o que todo mundo pede. Custo baixo e margem altíssima.',
    difficulty: 'Fácil',
    prepTime: '1h',
    trend: '⭐',
    trendLabel: 'Favorito Eterno',
    avgPrice: 'R$ 75-89',
    estimatedCost: 'R$ 22-28',
    profit: '~R$ 55',
    margin: '200%',
    packagingTip: 'Uma caixa simples com papel de seda marrom e uma colher de madeira amarrada com barbante rústico cria um visual artesanal irresistível. Adicione uma tag "Feito à mão com amor" — parece bobo, mas funciona demais na Páscoa.',
    youtubeQuery: 'ovo de colher brigadeiro gourmet 50% cacau receita passo a passo páscoa',
    tiktokQuery: 'ovo brigadeiro gourmet cacau páscoa receita',
    ingredients: [
      '1 lata de leite condensado',
      '1 caixinha de creme de leite',
      '4 colheres de cacau em pó 50%',
      '1 colher de manteiga sem sal',
      '400g de chocolate meio amargo nobre (casca)',
      'Granulado belga para decorar',
    ],
    steps: [
      'Misture o cacau com o leite condensado antes de levar ao fogo (evita grumos)',
      'Adicione creme de leite e manteiga, cozinhe em fogo baixo mexendo sempre',
      'Quando desgrudar do fundo, desligue e transfira para um prato. Cubra com filme',
      'Tempere o chocolate nobre e faça as cascas (ou use fracionado)',
      'Preencha as cascas com o brigadeiro já frio',
      'Decore com bolinhas de brigadeiro e granulado belga',
    ],
  },
  {
    id: 4,
    name: 'Ovo de Colher Biscoff (Speculoos)',
    subtitle: 'O biscoito belga que virou febre — sabor sofisticado e diferenciado',
    description: 'O Biscoff (biscoito amanteigado belga com especiarias) virou febre na confeitaria em 2024 e segue em alta. Poucos confeiteiros caseiros oferecem esse sabor, o que te dá uma vantagem competitiva. A pasta Biscoff pode ser encontrada em lojas de confeitaria ou feita em casa triturando os biscoitos com manteiga derretida. Combina com chocolate branco e brigadeiro de leite Ninho.',
    difficulty: 'Médio',
    prepTime: '2h',
    trend: '🔥',
    trendLabel: 'Em Alta',
    avgPrice: 'R$ 89-110',
    estimatedCost: 'R$ 35-42',
    profit: '~R$ 58',
    margin: '155%',
    packagingTip: 'Coloque um biscoito Biscoff inteiro sobre o ovo como decoração. Use embalagem em tons de caramelo/dourado. A cor do biscoito nas fotos é extremamente "instagramável" e gera desejo imediato no feed.',
    youtubeQuery: 'ovo de colher biscoff speculoos receita passo a passo como fazer páscoa',
    tiktokQuery: 'ovo biscoff speculoos páscoa receita confeitaria',
    ingredients: [
      '200g de biscoitos Biscoff (ou Speculoos)',
      '50g de manteiga derretida',
      '1 lata de leite condensado',
      '1 caixinha de creme de leite',
      '3 colheres de leite em pó',
      '200g de chocolate branco',
      '400g de chocolate ao leite (casca)',
      'Pasta de Biscoff para camadas',
    ],
    steps: [
      'Triture os biscoitos Biscoff com manteiga derretida para fazer a farofinha crocante',
      'Faça o brigadeiro branco: leite condensado + creme de leite + leite em pó',
      'Derreta o chocolate branco e incorpore ao brigadeiro para mais cremosidade',
      'Monte as cascas de chocolate e deixe cristalizar',
      'Layering: farofinha de Biscoff → brigadeiro branco → pasta de Biscoff → brigadeiro',
      'Decore com farofinha e um biscoito Biscoff inteiro no topo',
    ],
  },
  {
    id: 5,
    name: 'Ovo em Fatias Multi-Sabores',
    subtitle: 'A GRANDE TENDÊNCIA 2026 — até 6 sabores em um único ovo',
    description: 'O ovo em fatias é A grande novidade de 2026 e está viralizando nas redes sociais. Projeções indicam que pode representar 35% das vendas artesanais este ano. O conceito é simples: um ovo grande dividido em fatias triangulares, cada uma com um sabor diferente. O cliente pode comprar fatias avulsas (R$ 20-35 cada) ou o ovo completo. Excelente para quem quer experimentar sem gastar muito.',
    difficulty: 'Médio',
    prepTime: '3h',
    trend: '🚀',
    trendLabel: 'TENDÊNCIA 2026',
    avgPrice: 'R$ 20-35/fatia',
    estimatedCost: 'R$ 5-8/fatia',
    profit: '~R$ 20/fatia',
    margin: '300%',
    packagingTip: 'Embale cada fatia individualmente em embalagem triangular transparente com adesivo do sabor. Monte um kit "Prove Todos" com 6 fatias numa caixa bonita. Esse formato é PERFEITO para fotos e stories — a variedade de cores atrai cliques e compartilhamentos.',
    youtubeQuery: 'ovo em fatias páscoa 2026 receita passo a passo como fazer tendência',
    tiktokQuery: 'ovo em fatias páscoa 2026 viral tendência multi sabores',
    ingredients: [
      '500g de chocolate (casca do ovo grande)',
      'Forma especial de ovo em fatias (BWB ou similar)',
      'Recheio 1: Brigadeiro de Ninho',
      'Recheio 2: Brigadeiro de chocolate',
      'Recheio 3: Maracujá com chocolate branco',
      'Recheio 4: Pistache',
      'Recheio 5: Morango',
      'Recheio 6: Biscoff',
    ],
    steps: [
      'Prepare a forma especial de 6 fatias (pode encontrar na internet ou loja de confeitaria)',
      'Faça as cascas de chocolate em cada compartimento da forma',
      'Prepare os 6 recheios separadamente (use as receitas base de brigadeiro com variações)',
      'Preencha cada fatia com um recheio diferente',
      'Feche o ovo (opcional) ou venda as fatias separadamente',
      'Decore cada fatia com um elemento visual que identifique o sabor',
    ],
  },
  {
    id: 6,
    name: 'Barras Recheadas Gourmet',
    subtitle: 'Práticas, fáceis de transportar e com custo de produção baixo',
    description: 'As barras de chocolate recheadas são a alternativa perfeita aos ovos tradicionais. São mais fáceis de embalar, mais resistentes para transporte e o custo de produção é significativamente menor. Funcionam como produto de entrada — o cliente que ainda não te conhece compra uma barra para experimentar antes de pedir um ovo. Também vendem o ano todo, não apenas na Páscoa.',
    difficulty: 'Fácil',
    prepTime: '1h',
    trend: '⭐',
    trendLabel: 'Prática e Lucrativa',
    avgPrice: 'R$ 25-40',
    estimatedCost: 'R$ 8-12',
    profit: '~R$ 22',
    margin: '200%',
    packagingTip: 'Embale em papel manteiga + cinta de papel craft com adesivo da sua marca. Parece chocolate de loja gourmet gastando centavos. Ofereça em kits de 3 sabores para presente — é irresistível para quem quer algo mais acessível.',
    youtubeQuery: 'barra de chocolate recheada páscoa receita passo a passo faça e venda',
    tiktokQuery: 'barra recheada chocolate páscoa faça e venda receita',
    ingredients: [
      '300g de chocolate ao leite ou meio amargo',
      'Forma de barra de silicone (3 partes)',
      'Brigadeiro cremoso (sabor à escolha)',
      'Nutella ou doce de leite (camadas)',
      'Castanhas trituradas ou confeitos',
    ],
    steps: [
      'Derreta o chocolate e preencha a forma de barra até a marcação',
      'Encaixe a parte de silicone e a terceira parte da forma',
      'Leve ao freezer por 10 minutos para cristalizar',
      'Desenforme a casca de chocolate',
      'Preencha com o recheio escolhido e feche com uma camada de chocolate',
      'Decore a barra antes do chocolate secar (castanhas, granulado, etc.)',
    ],
  },
  {
    id: 7,
    name: 'Cones Trufados Decorados',
    subtitle: 'O produto com a MAIOR margem de lucro — custos quase zero',
    description: 'Os cones trufados são o segredo mais bem guardado das confeiteiras inteligentes. O custo de produção é absurdamente baixo (casquinha + brigadeiro + chocolate), mas o preço percebido é alto quando bem embalado. Vendem em volume altíssimo como lembrancinha de Páscoa. Um kit de 5 cones em embalagem bonita chega fácil a R$ 35-50. A margem pode ultrapassar 300%.',
    difficulty: 'Fácil',
    prepTime: '45min',
    trend: '⭐',
    trendLabel: 'Margem Altíssima',
    avgPrice: 'R$ 35-50/kit 5',
    estimatedCost: 'R$ 8-12/kit',
    profit: '~R$ 32/kit',
    margin: '300%',
    packagingTip: 'Embrulhe cada cone em papel chumbo colorido com a ponta para cima, imitando uma cenoura de Páscoa. Use fitinha verde na ponta. Monte em cestas ou caixas com papel de seda. Parece muito mais caro do que realmente é — esse é o segredo da margem alta.',
    youtubeQuery: 'cones trufados decorados páscoa receita passo a passo lembrancinha faça e venda',
    tiktokQuery: 'cone trufado cenoura páscoa lembrancinha como fazer',
    ingredients: [
      'Casquinhas de sorvete (cone)',
      '200g de chocolate para banhar',
      'Brigadeiro cremoso (3 sabores)',
      'Confeitos coloridos para decorar',
      'Chocolate branco para detalhes',
      'Papel chumbo e fitinhas',
    ],
    steps: [
      'Banhe a casquinha por dentro e por fora com chocolate derretido',
      'Deixe secar completamente sobre uma grade',
      'Prepare os brigadeiros cremosos (chocolate, Ninho, caramelo)',
      'Preencha os cones com os brigadeiros usando saco de confeitar',
      'Feche a abertura com uma camada de chocolate e decore com confeitos',
      'Embale cada cone em papel chumbo formando uma "cenourinha"',
    ],
  },
  {
    id: 8,
    name: 'Trio de Mini Ovos Degustação',
    subtitle: 'O presente perfeito — 3 sabores em uma caixa elegante',
    description: 'O kit de mini ovos de degustação é um sucesso absoluto para presentear. O cliente compra para dar de lembrança no trabalho, para a família, ou para quem não quer gastar muito num ovo grande. Três mini ovos de 50g com sabores diferentes (ex: brigadeiro, Ninho e morango) em uma caixinha bonita. Excelente relação custo-benefício para o cliente e margem ótima para você.',
    difficulty: 'Médio',
    prepTime: '2h',
    trend: '⭐',
    trendLabel: 'Presente Perfeito',
    avgPrice: 'R$ 45-65',
    estimatedCost: 'R$ 15-20',
    profit: '~R$ 38',
    margin: '200%',
    packagingTip: 'Caixa com 3 compartimentos forrados com papel de seda. Cada mini ovo identificado com etiqueta do sabor. Amarre a caixa com fita e coloque uma tag: "3 sabores para adoçar sua Páscoa". Esse kit vende sozinho quando a pessoa vê na foto.',
    youtubeQuery: 'mini ovos de colher trio degustação receita páscoa passo a passo',
    tiktokQuery: 'mini ovos degustação trio páscoa presente receita',
    ingredients: [
      '300g de chocolate para as 6 cascas (3 ovos)',
      'Formas de mini ovo (50g)',
      'Brigadeiro de chocolate (sabor 1)',
      'Brigadeiro de Ninho (sabor 2)',
      'Brigadeiro de morango (sabor 3)',
      'Granulados e confeitos coloridos',
    ],
    steps: [
      'Faça as 6 cascas de mini ovo (2 por ovo) nas formas de 50g',
      'Prepare os 3 sabores de brigadeiro separadamente',
      'Preencha cada par de cascas com um sabor diferente',
      'Decore cada mini ovo com ingredientes que identifiquem o sabor',
      'Monte os 3 ovos na caixa de degustação',
      'Adicione etiquetas com o nome de cada sabor',
    ],
  },
  {
    id: 9,
    name: 'Kit Confeiteiro Infantil',
    subtitle: 'O produto para o público infantil — interativo e criativo',
    description: 'O Kit Confeiteiro é um ovo de chocolate que vem desmontado para a criança montar e decorar em casa. Inclui as cascas de chocolate, confeitos coloridos, granulado, mini marshmallows e um minidocinho. As crianças adoram e os pais pagam felizes. É interativo, divertido e rende fotos incríveis das crianças montando — marketing gratuito dos pais no Instagram.',
    difficulty: 'Fácil',
    prepTime: '1h',
    trend: '⭐',
    trendLabel: 'Público Infantil',
    avgPrice: 'R$ 40-55',
    estimatedCost: 'R$ 12-18',
    profit: '~R$ 30',
    margin: '175%',
    packagingTip: 'Monte tudo em uma caixinha colorida com temática infantil (pode imprimir em papel adesivo). Inclua um "avental" de papel e um chapéu de chef de papel simples. Esses detalhes baratos (custo < R$ 2) aumentam o valor percebido em R$ 15-20 e fazem a criança ficar louca de felicidade.',
    youtubeQuery: 'kit confeiteiro infantil páscoa receita como fazer embalagem faça e venda',
    tiktokQuery: 'kit confeiteiro infantil páscoa decoração criança chocolate',
    ingredients: [
      '2 cascas de chocolate (formando 1 ovo médio)',
      'Confeitos coloridos sortidos (30g)',
      'Granulado de chocolate (20g)',
      'Mini marshmallows (20g)',
      'Chocolate branco derretido em bisnaga (para "colar")',
      'Potinho de brigadeiro (50g)',
      'Colher decorada',
    ],
    steps: [
      'Faça as cascas de chocolate em forma de ovo médio (200-250g)',
      'Separe os confeitos, granulados e marshmallows em potinhos pequenos',
      'Prepare um potinho de brigadeiro para o centro do ovo',
      'Coloque o chocolate branco em bisnaga para a criança usar como "cola"',
      'Monte tudo na caixinha com instruções simples e ilustradas',
      'Adicione uma colherzinha e (opcionalmente) chapéu de chef de papel',
    ],
  },
  {
    id: 10,
    name: 'Trufas Gourmet (Caixa de 12)',
    subtitle: 'O produto de volume — alto giro, produção rápida e venda constante',
    description: 'Uma caixa de 12 trufas gourmet é o produto perfeito para venda em volume. É mais acessível que um ovo (R$ 40-60 a caixa), mais fácil de produzir em escala e vende o ano inteiro, não só na Páscoa. Ofereça 3-4 sabores por caixa (chocolate, pistache, limão, café). As trufas são "entry-level" — quem prova e gosta, volta para comprar o ovo grande. É o produto que abre portas.',
    difficulty: 'Fácil',
    prepTime: '1h30',
    trend: '⭐',
    trendLabel: 'Alto Volume',
    avgPrice: 'R$ 40-60',
    estimatedCost: 'R$ 10-15',
    profit: '~R$ 38',
    margin: '280%',
    packagingTip: 'Caixa rígida com tampa, forrada com forminha de papel para cada trufa. Inclua um cartão com o "mapa de sabores" indicando cada trufa. Amarre com fita e coloque adesivo da sua marca. É um presente pronto — o cliente não precisa pensar em mais nada.',
    youtubeQuery: 'trufas gourmet variadas receita passo a passo caixa presente faça e venda',
    tiktokQuery: 'trufas gourmet páscoa caixa presente receita variadas',
    ingredients: [
      '200g de chocolate ao leite',
      '200g de chocolate meio amargo',
      '200g de chocolate branco',
      '2 caixinhas de creme de leite',
      'Saborizantes: pistache, café, limão, morango',
      'Cacau em pó, coco ralado, granulado',
      'Forminhas de papel para trufas',
    ],
    steps: [
      'Faça 3 ganaches base: chocolate ao leite + creme de leite, meio amargo + creme, branco + creme',
      'A cada ganache, adicione o saborizante (pasta de pistache, essência de café, raspas de limão)',
      'Leve à geladeira por 2 horas para firmar',
      'Modele as trufas com as mãos (use luvas) em bolinhas de 20g cada',
      'Banhe cada trufa em chocolate derretido e passe pelo acabamento (cacau, coco, granulado)',
      'Coloque em forminhas e monte a caixa com 12 trufas (3 de cada sabor)',
    ],
  },
];

// ─── QUERIDINHOS DO TIKTOK ─────────────────────────────────────────────────────
const tiktokRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Cenoura de Chocolate Recheada',
    subtitle: 'O formato surpresa que está dominando o TikTok — visual irresistível',
    description: 'A cenoura de chocolate é o produto viral do momento no TikTok de confeitaria. Feita em molde de silicone formato cenoura, é recheada com brigadeiro, tem casca de chocolate colorido laranja com folhinhas verdes de chocolate branco. Quando a pessoa abre ao meio, revela o recheio cremoso. O vídeo desse corte vira viral com facilidade. Custo baixo, apelo altíssimo.',
    difficulty: 'Fácil',
    prepTime: '1h',
    trend: '🚀',
    trendLabel: 'Viral no TikTok',
    avgPrice: 'R$ 18-28/un',
    estimatedCost: 'R$ 4-7/un',
    profit: '~R$ 16/un',
    margin: '280%',
    packagingTip: 'Embrulhe em celofane transparente com laço de fita verde imitando as folhas. Monte 3 unidades num celofane maior para kit presente. O formato da cenoura dispensa embalagem elaborada — o produto já é o visual.',
    youtubeQuery: 'cenoura de chocolate páscoa molde silicone recheada receita passo a passo',
    tiktokQuery: 'cenoura chocolate páscoa 2026 molde silicone viral',
    ingredients: [
      'Molde de silicone formato cenoura',
      '300g de chocolate ao leite + corante laranja',
      '100g de chocolate branco + corante verde (folhas)',
      '1 lata de leite condensado (brigadeiro recheio)',
      '1 caixinha de creme de leite',
      'Confeitos para decorar',
    ],
    steps: [
      'Misture corante laranja ao chocolate ao leite derretido e preencha o molde de cenoura',
      'Leve ao freezer por 5 minutos, desenforme e faça a casca oca',
      'Prepare o brigadeiro cremoso e deixe esfriar bem',
      'Preencha a cenoura com brigadeiro usando saco de confeitar',
      'Feche com mais chocolate e leve ao frio para selar',
      'Faça as folhinhas: chocolate branco + corante verde, molde com garfo ou folha real',
    ],
  },
  {
    id: 2,
    name: 'Chocolate Bark de Páscoa',
    subtitle: 'O mais fácil de fazer e fotografar — perfeito para começar do zero',
    description: 'O chocolate bark é fenômeno no TikTok por um motivo simples: parece caro, é fácil de fazer e fotografa lindamente. Você derrete o chocolate, espalha numa forma forrada de papel, decora com confeitos coloridos, mini ovos, frutas secas e deixa endurecer. Quebre em pedaços irregulares e venda em embalagem de presente. É arte comestível com custo de brigadeiro.',
    difficulty: 'Fácil',
    prepTime: '30min',
    trend: '🔥',
    trendLabel: 'Super Fácil',
    avgPrice: 'R$ 28-42 (200g)',
    estimatedCost: 'R$ 7-11',
    profit: '~R$ 24',
    margin: '250%',
    packagingTip: 'Embale os pedaços em saquinho de celofane com lacinho ou numa caixinha baixa com papel glassine. A irregularidade dos pedaços é intencional e charmosa — chame de "Bark Artesanal". Fotografe sobre fundo de madeira para um visual premium.',
    youtubeQuery: 'chocolate bark de páscoa receita fácil decorado passo a passo como fazer',
    tiktokQuery: 'chocolate bark páscoa decorado fácil receita viral',
    ingredients: [
      '400g de chocolate branco ou ao leite',
      'Mini ovos de Páscoa coloridos',
      'Confeitos de Páscoa sortidos',
      'Frutas secas (cranberry, damasco)',
      'Castanhas picadas',
      'Corantes alimentícios (opcional)',
    ],
    steps: [
      'Derreta o chocolate e espalhe numa assadeira forrada com papel manteiga (±1cm de espessura)',
      'Antes de secar, espalhe os confeitos, mini ovos e castanhas generosamente',
      'Leve à geladeira por 30 minutos até endurecer completamente',
      'Quebre em pedaços irregulares com as mãos (não corte — o efeito irregular é intencional)',
      'Pese e embale em porções de 100g ou 200g',
      'Fotografe antes de embalar — essa é a foto que vende!',
    ],
  },
  {
    id: 3,
    name: 'Hot Chocolate Bomb (Esfera de Chocolate)',
    subtitle: 'A esfera que "explode" no leite quente — o vídeo que mais viraliza',
    description: 'A bomba de chocolate quente é o produto mais satisfatório de assistir no TikTok. Uma esfera oca de chocolate com cacau, mini marshmallows e confeitos dentro. Quando colocada numa xícara e o leite quente é despejado por cima, a esfera derrete e revela o conteúdo. É uma experiência! O vídeo do "derretimento" gera engajamento enorme e facilita demais a venda.',
    difficulty: 'Médio',
    prepTime: '1h30',
    trend: '🚀',
    trendLabel: 'Viral Garantido',
    avgPrice: 'R$ 22-35/un',
    estimatedCost: 'R$ 6-9/un',
    profit: '~R$ 20/un',
    margin: '250%',
    packagingTip: 'Coloque cada esfera num suporte de acetato transparente dentro de uma caixinha. Inclua uma tag: "Coloque no leite quente e assista a mágica! 🎉". Essa instrução é parte do produto — cria uma experiência que o cliente vai filmar e compartilhar.',
    youtubeQuery: 'hot chocolate bomb esfera de chocolate páscoa receita passo a passo como fazer',
    tiktokQuery: 'hot chocolate bomb esfera chocolate páscoa viral receita',
    ingredients: [
      '300g de chocolate ao leite ou meio amargo',
      'Forma de semiesfera de silicone (6-7cm)',
      'Cacau em pó solúvel (1 colher por esfera)',
      'Mini marshmallows coloridos',
      'Confeitos de Páscoa',
      'Canudo decorativo (opcional)',
    ],
    steps: [
      'Derreta o chocolate e preencha as formas de semiesfera, espalhe com pincel para casca uniforme',
      'Leve ao freezer por 10 minutos, aplique uma segunda camada e congele mais 10 min',
      'Desenforme com cuidado. Você terá duas metades para cada esfera',
      'Preencha uma metade com cacau, marshmallows e confeitos',
      'Aqueça uma frigideira levemente e una as duas metades (o calor sela as bordas)',
      'Decore a esfera por fora com chocolate colorido e confeitos',
    ],
  },
  {
    id: 4,
    name: 'Ovo Geode (Efeito Cristal)',
    subtitle: 'O ovo premium que diferencia você de toda a concorrência do bairro',
    description: 'O ovo geode é a versão luxo dos ovos artesanais e está bombando no TikTok de confeitaria gourmet. A técnica usa candy melts ou isomalt colorido para criar um efeito de pedras preciosas/cristais por dentro e por fora do ovo. O resultado é visual e fotogênico demais — justifica preços entre R$ 120-180 com facilidade. É o ovo que os clientes compartilham no Instagram.',
    difficulty: 'Avançado',
    prepTime: '4h',
    trend: '🔥',
    trendLabel: 'Premium & Exclusivo',
    avgPrice: 'R$ 120-180',
    estimatedCost: 'R$ 40-55',
    profit: '~R$ 100',
    margin: '200%',
    packagingTip: 'Caixa rígida preta ou vinho com papel seda dourado. Coloque a tag "Edição Limitada — Peça Única". Fotografe com iluminação lateral para destacar o brilho dos cristais. Esse ovo é seu produto de vitrine — mesmo que venda poucos, atrai clientes para os outros.',
    youtubeQuery: 'ovo geodo geode páscoa artesanal como fazer isomalt candy crystals decorar',
    tiktokQuery: 'ovo geode geodo páscoa cristal isomalt confeitaria premium',
    ingredients: [
      '500g de chocolate meio amargo nobre (casca)',
      'Isomalt ou candy melts em várias cores (roxo, rosa, azul, dourado)',
      'Corantes em gel lipossolúveis',
      'Purpurina alimentícia dourada',
      'Recheio: brigadeiro gourmet ou ganache premium',
      'Pó metálico comestível',
    ],
    steps: [
      'Faça a casca de chocolate temperado (técnica de temperagem obrigatória para brilho)',
      'Derreta o isomalt com corante e despeje em silicone antiaderente para fazer as "pedras"',
      'Deixe as pedras de isomalt cristalizarem completamente (~1h)',
      'Cole as pedras coloridas na superfície externa do ovo com chocolate derretido',
      'Aplique pó dourado e purpurina com pincel seco para o efeito metálico',
      'Preencha o ovo com brigadeiro e feche. Finalize com mais pedras e brilhos',
    ],
  },
  {
    id: 5,
    name: 'Ovo de Churros com Doce de Leite',
    subtitle: 'O sabor brasileiro que está dominando o TikTok — crocante e irresistível',
    description: 'A combinação de chocolate com doce de leite e farofinha crocante de churros é uma bomba de sabor que está viralizando. O ovo de churros tem casca de chocolate, camadas de doce de leite argentino, creme de churros e farofinha crocante que cria uma textura única. A identidade visual forte — canela, caramelo, crocante — é perfeita para vídeos e diferencia você de qualquer concorrente.',
    difficulty: 'Médio',
    prepTime: '2h30',
    trend: '🚀',
    trendLabel: 'Sabor Único',
    avgPrice: 'R$ 75-100',
    estimatedCost: 'R$ 22-32',
    profit: '~R$ 58',
    margin: '180%',
    packagingTip: 'Embalagem em tons caramelo/marrom. Espalhe farofinha de churros sobre o ovo como decoração final antes de embalar. Coloque um palitinho de churros decorativo. O visual rústico e aromático é parte do apelo — inclua uma tag com os sabores.',
    youtubeQuery: 'ovo de churros páscoa doce de leite farofinha crocante receita passo a passo',
    tiktokQuery: 'ovo churros doce de leite páscoa 2026 crocante receita viral',
    ingredients: [
      '400g de chocolate ao leite (casca)',
      '200g de doce de leite argentino',
      '100g de biscoito tipo maria ou maisena (farofinha)',
      '50g de manteiga + 2 colheres de açúcar + canela',
      '1 lata de leite condensado + creme de leite (creme de churros)',
      'Canela em pó para decorar',
    ],
    steps: [
      'Faça a farofinha: triture os biscoitos, misture com manteiga derretida, açúcar e canela. Torre em frigideira',
      'Prepare o creme de churros: leite condensado + creme de leite + canela, cozinhe até engrossar',
      'Deixe todos os recheios esfriarem completamente',
      'Faça a casca de chocolate e cristalize',
      'Monte em camadas: creme de churros → doce de leite → farofinha crocante → creme → farofinha',
      'Feche o ovo e decore com farofinha, fio de doce de leite e canela por cima',
    ],
  },
];

// ─── TIPOS DE FILTRO ───────────────────────────────────────────────────────────
type DifficultyFilter = 'Todas' | 'Fácil' | 'Médio' | 'Avançado';

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.84 4.84 0 01-1-.07z" />
    </svg>
  );
}

export default function EasterGuide() {
  const [filter, setFilter] = useState<DifficultyFilter>('Todas');

  const filteredRecipes = filter === 'Todas'
    ? classicRecipes
    : classicRecipes.filter(r => r.difficulty === filter);

  const filterOptions: DifficultyFilter[] = ['Todas', 'Fácil', 'Médio', 'Avançado'];

  const filterColors: Record<DifficultyFilter, string> = {
    Todas: 'bg-[#D16075] text-white',
    Fácil: 'bg-green-500 text-white',
    Médio: 'bg-yellow-500 text-white',
    Avançado: 'bg-red-500 text-white',
  };
  const filterInactive = 'bg-white text-gray-500 border border-gray-200 hover:border-[#D16075]/40 hover:text-[#D16075]';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-[#E295A3]/20">
        <div className="border-b border-[#E295A3]/20 pb-6 mb-6">
          <span className="inline-block py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-xs mb-4 uppercase tracking-wider">
            Módulo 1
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4A3338] mb-3 flex items-center gap-3">
            <BookOpen className="text-[#D16075]" size={32} /> 15 Receitas Vencedoras
          </h1>
          <p className="text-base sm:text-lg text-[#70545A]">
            10 receitas clássicas testadas + 5 tendências virais do TikTok Páscoa 2026 — com vídeo, custo e lucro estimado em cada uma.
          </p>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FFF5F7] p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-[#D16075]">15</p>
            <p className="text-xs text-[#A8576A] font-medium">Receitas no Total</p>
          </div>
          <div className="bg-[#FFF5F7] p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-[#D16075] flex items-center justify-center gap-1">
              <TrendingUp size={20} /> 7
            </p>
            <p className="text-xs text-[#A8576A] font-medium">Tendências 2026</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-green-600">140-300%</p>
            <p className="text-xs text-green-600 font-medium">Margem de Lucro</p>
          </div>
          <div className="bg-black p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              <TikTokIcon size={20} /> 5
            </p>
            <p className="text-xs text-gray-300 font-medium">Virais do TikTok</p>
          </div>
        </div>
      </div>

      {/* Dica de uso */}
      <div className="bg-[#4A3338] text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-[#D16075]/20">
        <h3 className="text-lg font-bold text-[#E295A3] mb-2">💡 Como usar este módulo</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Clique em cada receita para ver vídeo tutorial, ingredientes, passo a passo e precificação.
          <strong className="text-white"> Não tente fazer as 15 receitas.</strong> Escolha <strong className="text-[#E295A3]">3 a 5</strong> que façam sentido para o seu público.
          Use os filtros para encontrar o que é mais adequado ao seu nível agora.
        </p>
      </div>

      {/* ── SEÇÃO CLÁSSICAS ───────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Título da seção + filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-bold text-[#4A3338] flex items-center gap-2">
            <Star size={20} className="text-[#D16075]" /> 10 Receitas Clássicas
          </h2>

          {/* Filtros por dificuldade */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={16} className="text-[#A8576A] shrink-0" />
            {filterOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === opt ? filterColors[opt] : filterInactive}`}
              >
                {opt}
                {opt !== 'Todas' && (
                  <span className="ml-1 opacity-70">
                    ({classicRecipes.filter(r => r.difficulty === opt).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Receitas filtradas */}
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-[#A8576A] py-8">Nenhuma receita com esse filtro.</p>
        ) : (
          <div className="space-y-4">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} variant="classic" />
            ))}
          </div>
        )}
      </div>

      {/* ── SEÇÃO TIKTOK ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Header TikTok */}
        <div className="bg-gradient-to-r from-[#010101] to-[#1a1a2e] rounded-2xl p-5 sm:p-7 border border-[#EE1D52]/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#EE1D52] rounded-xl flex items-center justify-center shrink-0">
              <TikTokIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Queridinhos do TikTok
              </h2>
              <p className="text-xs text-[#EE1D52] font-semibold uppercase tracking-wider">Tendências Páscoa 2026</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Receitas que estão <strong className="text-white">viralizando agora</strong> no TikTok. Alta conversão pois os clientes já viram e querem comprar.
            Produza antes dos concorrentes do seu bairro descobrirem.
          </p>
        </div>

        {/* Cards TikTok */}
        <div className="space-y-4">
          {tiktokRecipes.map((recipe, index) => (
            <RecipeCard key={`tiktok-${recipe.id}`} recipe={recipe} index={index} variant="tiktok" />
          ))}
        </div>
      </div>

      {/* Bottom tip */}
      <div className="bg-gradient-to-r from-[#D16075] to-[#A8576A] text-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-3">🎯 Dica Final: Monte Seu Cardápio Assim</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold mb-1">1 Carro-Chefe</p>
            <p className="text-rose-100">Ovo de colher premium (Ninho, Pistache ou Brigadeiro Gourmet)</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold mb-1">1 do TikTok</p>
            <p className="text-rose-100">Cenoura de chocolate, Bark ou Churros — quem oferece primeiro domina</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold mb-1">2 Lembrancinhas</p>
            <p className="text-rose-100">Cones trufados + Trufas gourmet — venda em volume, atraia novos clientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
