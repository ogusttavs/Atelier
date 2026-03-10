import { useState } from 'react';
import { TrendingUp, Gift, Store, Smartphone, Users, Megaphone, Calendar, ShoppingBag, Coffee, HeartHandshake, MapPin, Package, Clock, Star, Zap, MessageCircle, Camera, Award, Truck, Briefcase, Download } from 'lucide-react';
import StrategyCard, { Strategy } from './StrategyCard';

const easterStrategies: Strategy[] = [
        {
            icon: <Gift />,
            title: "1. Degustação Estratégica (Fevereiro/Março)",
            desc: "Venda caixas de mini-degustação a preço de custo 30 dias antes. Quem prova e gosta, compra o ovo grande.",
            steps: [
                "Produza 20-30 caixinhas com 3 mini trufas (uma de cada sabor que você vai vender na Páscoa). O custo total deve ficar entre R$ 3-5 por caixinha.",
                "Venda cada caixinha por R$ 5-8 (preço de custo ou no máximo R$ 2 de lucro). O objetivo NÃO é lucrar aqui — é criar clientes.",
                "Dentro de cada caixa, coloque um cartão com QR code ou link do seu WhatsApp e a frase: 'Gostou? Reserve seu ovo de Páscoa com 10% de desconto até dia X'.",
                "Distribua para vizinhos, colegas de trabalho, grupos da igreja e academia. Priorize quem tem poder de compra e rede de contatos.",
                "Anote o nome e WhatsApp de quem comprou a degustação. 15 dias antes da Páscoa, mande mensagem: 'Oi [nome]! Lembra da degustação? Já estou aceitando encomendas, quer reservar o seu?'",
                "Meta realista: de 30 degustações, converter pelo menos 10 em ovos grandes (R$ 80-120). Faturamento esperado: R$ 800-1.200 só com essa estratégia."
            ]
        },
        {
            icon: <Users />,
            title: "2. Parcerias com Escolas/Creches",
            desc: "Crie kits infantis com margem menor e feche pacotes de 30-50 unidades com diretoras de escolas para presentear os alunos.",
            steps: [
                "Prepare uma amostra do Kit Confeiteiro Infantil ou um cone trufado decorado. Embale com capricho — a primeira impressão é tudo.",
                "Vá presencialmente em 3-5 escolas/creches do seu bairro. Peça para falar com a coordenadora ou diretora. Leve a amostra de presente.",
                "Apresente a proposta: 'Ofereço kits de Páscoa para os alunos com preço especial para pedidos acima de 20 unidades. Cada kit sai por R$ 15-25.' Destaque que é artesanal e personalizado.",
                "Ofereça personalizar os kits com o nome da escola ou da turma (uma tag impressa custa R$ 0,30 e aumenta muito o valor percebido).",
                "Peça 50% de sinal para garantir a reserva e comprar os insumos. Combine a entrega para 2 dias antes do evento da escola.",
                "Após a entrega, peça à diretora para indicar você para outras escolas e para os pais. Deixe cartões de visita com ela."
            ]
        },
        {
            icon: <Camera />,
            title: "3. Antecipação no Instagram",
            desc: "Mostre os bastidores da produção, as caixas chegando, o chocolate derretendo. Crie desejo antes mesmo de abrir a agenda.",
            steps: [
                "30 dias antes da Páscoa, comece a postar stories de 'bastidores': compra de insumos no atacado, chocolate derretendo, formas chegando. Use textos como 'A Operação Páscoa começou...'",
                "Crie uma contagem regressiva nos stories: '15 dias para abrir as encomendas! Quem quer ser avisado primeiro?'. Peça para responderem o story.",
                "Publique 1 post no feed por semana mostrando cada produto do cardápio. Use fotos com luz natural, fundo limpo e decoração de Páscoa. Sempre coloque o preço na legenda.",
                "Grave 2-3 Reels curtos (15-30 segundos) mostrando: a) o chocolate derretendo em câmera lenta, b) a montagem do ovo, c) a embalagem final. Use áudios em alta.",
                "No dia de abrir as encomendas, poste um story com sticker de pergunta: 'Qual sabor você quer?' e depois com sticker de enquete entre os sabores. Isso gera engajamento e o algoritmo entrega mais.",
                "Salve tudo em um Destaque chamado 'Páscoa 2026' para quem visitar seu perfil depois."
            ]
        },
        {
            icon: <Clock />,
            title: "4. Menu Fechado com Escassez Real",
            desc: "Não aceite encomendas infinitas. Diga: 'Tenho apenas 50 vagas para ovos de colher neste ano'. A urgência faz as pessoas comprarem na hora.",
            steps: [
                "Defina um número REAL de ovos que você consegue produzir com qualidade. Seja honesta: se são 40 ovos, não aceite 60. A escassez só funciona se for verdadeira.",
                "Crie um cardápio visual bonito (pode ser no Canva) com todos os produtos, preços e a frase em destaque: 'EDIÇÃO LIMITADA — Apenas [X] unidades disponíveis'.",
                "Poste o cardápio no Instagram e WhatsApp com a legenda: 'Quando acabar, acabou. Ano passado esgotou em 5 dias.' (Se for seu primeiro ano, diga: 'Produção limitada para garantir qualidade artesanal').",
                "A cada 10 vendas, poste uma atualização: 'Mais 10 reservados! Restam apenas [X] vagas'. Isso cria urgência real e social proof ao mesmo tempo.",
                "Quando faltar 20% para esgotar, mande mensagem individual para quem demonstrou interesse mas não comprou: 'Oi! Vi que você curtiu o ovo de pistache. Só tenho mais 5, queria te avisar antes de esgotar'.",
                "Após esgotar, poste: 'ESGOTADO! Obrigada demais! Para não ficar de fora no ano que vem, me siga e ative as notificações'. Isso já planta a semente para o próximo ano."
            ]
        },
        {
            icon: <ShoppingBag />,
            title: "5. Upsell de Lembrancinhas",
            desc: "Quando o cliente pedir um ovo grande, ofereça: 'Por mais R$ 15, quer levar um cone trufado para não deixar a sogra sem presente?'",
            steps: [
                "Monte uma lista de produtos complementares baratos: cones trufados (R$ 8-12), trufa unitária (R$ 5), saquinho de bombons (R$ 10). Esses são seus 'upsells'.",
                "Treine sua frase de upsell (fale naturalmente): 'Ah, e como lembrancinha para quem você não quer gastar tanto, tenho esses cones lindos por só R$ 12. A maioria das clientes leva uns 3-4 junto com o ovo.'",
                "Ofereça o upsell DEPOIS que a pessoa já decidiu comprar o ovo (nunca antes — isso confunde e pode travar a venda principal).",
                "Crie combos prontos: 'Combo Família: 1 ovo grande + 3 cones trufados por R$ [preço com desconto]'. Combos facilitam a decisão.",
                "Para pedidos acima de R$ 150, ofereça frete grátis ou uma trufa de brinde. O custo da trufa é R$ 2-3, mas o valor percebido é alto.",
                "Meta: conseguir que pelo menos 50% dos clientes de ovo grande levem pelo menos 1 item adicional. Isso pode aumentar seu ticket médio em 20-30%."
            ]
        },
        {
            icon: <Megaphone />,
            title: "6. Sorteio Estratégico",
            desc: "Sorteie um ovo grande no Instagram. Regra: marcar 2 amigos da mesma cidade. Excelente para ganhar seguidores locais.",
            steps: [
                "Escolha seu ovo mais bonito e fotografe com embalagem caprichada. Esse será o prêmio. O custo para você é de R$ 25-40 (o investimento vale cada centavo).",
                "Poste a foto com a legenda: 'SORTEIO DE PÁSCOA 🐰 Quer ganhar esse ovo de [sabor] lindoooo? Para participar: 1) Siga @seuperfil 2) Curta este post 3) Marque 2 amigos da [sua cidade] nos comentários.'",
                "Coloque prazo curto: 'Sorteio no dia [3-5 dias após o post]'. Prazo curto gera urgência. Responda TODOS os comentários com um emoji ou 'Boa sorte! 🍫'.",
                "Use stories para lembrar: 'Já participou do sorteio? Corre que encerra amanhã!'. Reposte nos stories os comentários das pessoas marcando amigos.",
                "Faça o sorteio ao vivo nos stories (use apps como Sorteio.com). Anuncie o vencedor e já aproveite: 'Para quem não ganhou, tenho uma surpresa: 10% de desconto em qualquer ovo até sexta!'",
                "Resultados esperados: 50-200 novos seguidores locais qualificados com um investimento de ~R$ 30. Esses seguidores são potenciais clientes para essa e próximas Páscoas."
            ]
        },
        {
            icon: <MapPin />,
            title: "7. Tráfego Pago Local (Ads)",
            desc: "Invista R$ 10/dia no Facebook Ads mostrando um vídeo do seu ovo de colher mais bonito apenas para pessoas num raio de 5km da sua casa.",
            steps: [
                "Crie uma conta no Gerenciador de Anúncios do Meta (Facebook/Instagram). Se ainda não tem, use seu perfil pessoal para criar.",
                "Grave um vídeo de 15-30 segundos mostrando: close no ovo sendo aberto → recheio escorrendo → embalagem bonita. Sem fala, só música de fundo (use áudio trending). Termine com: preço + 'Encomende pelo WhatsApp'.",
                "Crie o anúncio: Objetivo 'Mensagens' (para ir direto pro WhatsApp). Público: mulheres 22-55 anos, raio de 5-10km da sua casa, interesse em 'Páscoa', 'Chocolate' ou 'Confeitaria'.",
                "Defina orçamento de R$ 10-15/dia. Rode por 7-14 dias antes da Páscoa. Total investido: R$ 70-210. Se cada ovo vende por R$ 80+, você precisa de apenas 1-3 vendas para pagar o investimento.",
                "Responda TODAS as mensagens que chegarem pelo WhatsApp em menos de 5 minutos. Velocidade de resposta = taxa de conversão. Tenha o cardápio pronto para enviar.",
                "Acompanhe os resultados diariamente. Se o custo por mensagem está acima de R$ 5, troque o vídeo. Se está abaixo de R$ 3, aumente o orçamento."
            ]
        },
        {
            icon: <Smartphone />,
            title: "8. Catálogo Interativo no WhatsApp",
            desc: "Não mande textão. Tenha um PDF clicável bonito ou use o catálogo do WhatsApp Business com fotos profissionais e preços claros.",
            steps: [
                "Baixe o WhatsApp Business (é grátis). Configure seu perfil comercial com foto, nome 'Atelier [seu nome]', endereço e horário de atendimento.",
                "Vá em 'Catálogo' dentro do WhatsApp Business e adicione cada produto com: foto profissional (use luz natural!), nome do produto, preço e descrição curta.",
                "Alternativamente, crie um PDF no Canva com seu cardápio completo. Use o template 'Cardápio' do Canva, coloque fotos, preços e seu WhatsApp para encomendas.",
                "Quando alguém perguntar 'O que você tem?', envie o catálogo/PDF ao invés de digitar tudo. Economiza tempo e passa profissionalismo.",
                "Configure mensagens automáticas: Saudação ('Oii! 🐰 Que bom ter você aqui! Vou te enviar nosso cardápio de Páscoa!') e Ausência ('Estou na cozinha agora, mas respondo em breve!').",
                "Crie listas de transmissão separadas: 'Clientes VIP' (quem já comprou), 'Interessados Páscoa' (quem pediu catálogo). Envie novidades e promoções por lista, nunca por grupo."
            ]
        },
        {
            icon: <Star />,
            title: "9. Parceria com Micro-Influenciadores",
            desc: "Mande um ovo de presente para blogueiras da sua cidade que tenham entre 5k e 15k seguidores em troca de stories provando o doce.",
            steps: [
                "Pesquise no Instagram perfis da sua cidade com 3k-15k seguidores. Busque por hashtags locais (#[suacidade]food, #confeitaria[suacidade]). Foque em: mães, blogueiras de lifestyle, fitness ou gastronomia.",
                "Selecione 3-5 perfis que tenham engajamento real (comentários genuínos, não só curtidas de bots). Siga e interaja nos posts ANTES de mandar mensagem.",
                "Envie DM profissional e direta: 'Oi [nome]! Sou confeiteira artesanal aqui da [cidade] e adorei seu perfil. Gostaria de te enviar um ovo de presente para experimentar, sem compromisso. Posso te mandar?'",
                "Envie o ovo MAIS BONITO que você fizer. Capriche na embalagem. Inclua um cartão com seu @, um bilhete pessoal e um cupom de desconto personalizado para os seguidores dela.",
                "Se ela gostar e postar (a maioria posta porque é conteúdo pronto), reposte nos seus stories e salve no destaque 'O que falam de mim'. Mesmo que ela não poste, você ganhou uma cliente fiel que vai te indicar.",
                "Custo total: 1 ovo (R$ 25-40). Retorno potencial: 5-20 novas clientes. ROI de 500-1000% se converter pelo menos 3 vendas."
            ]
        },
        {
            icon: <Zap />,
            title: "10. Desconto de Lote Promocional",
            desc: "Crie a 'Semana VIP': Quem encomendar e pagar 50% do valor até o dia 15/03 ganha 10% de desconto. Garante caixa antecipado para comprar insumos.",
            steps: [
                "Defina uma data de corte (ex: 15 de março). Antes dessa data, ofereça 10% de desconto em qualquer produto para quem pagar 50% de sinal via PIX.",
                "Crie um post/story anunciando: '🚨 SEMANA VIP — De 10 a 15 de março, ganhe 10% em qualquer ovo! Reservando agora com sinal de 50%, você garante preço especial + prioridade na entrega.'",
                "Use o dinheiro dos sinais para comprar os insumos. Essa é a grande sacada: você não precisa investir do próprio bolso. Os clientes financiam sua produção.",
                "Monte uma planilha simples: nome do cliente, produto, valor total, sinal pago, saldo restante, data de entrega. Compartilhe a confirmação com o cliente por WhatsApp.",
                "Uma semana antes da entrega, mande: 'Oi [nome]! Seu ovo de [sabor] está quase pronto! 🐰 Lembrando que o saldo de R$ [X] pode ser pago até sexta. Entrego dia [data]. Tudo certo?'.",
                "Meta: conseguir pelo menos 50% das vendas com sinal antecipado. Isso reduz o risco de encalhe (já está tudo vendido antes de produzir) e garante capital de giro."
            ]
        },
    ];

const bonusStrategies: Strategy[] = [
        {
            icon: <Calendar />,
            title: "1. Assinatura Mensal (Clube do Doce)",
            desc: "Clientes pagam um valor fixo por mês para receber uma caixa surpresa de doces todo dia 10. Receita recorrente garantida.",
            steps: [
                "Defina 2-3 planos: Básico (4 doces, R$ 29/mês), Premium (8 doces + novidade, R$ 49/mês), Família (12 doces, R$ 69/mês).",
                "Comece com seus melhores clientes de Páscoa. Após a entrega do ovo, envie: 'Gostou? Imagina receber uma caixa surpresa de doces todo mês! Conheça o Clube do Doce.'",
                "Cobre via PIX recorrente ou boleto. Não precisa de plataforma sofisticada no início. Uma planilha + PIX resolve para até 30 assinantes.",
                "Cada mês, varie os doces: brigadeiros gourmet, trufas, barras, brownies, cookies. A surpresa é o que mantém a assinatura.",
                "Após 3 meses de operação, crie uma lista de espera para novos assinantes. Isso gera exclusividade e procura.",
                "Meta: 20 assinantes a R$ 45/mês = R$ 900/mês de receita recorrente GARANTIDA, sem depender de datas comemorativas."
            ]
        },
        {
            icon: <Briefcase />,
            title: "2. Venda Corporativa",
            desc: "Monte kits para o RH de empresas locais presentearem aniversariantes do mês, Dia das Mães, Dia da Mulher, etc.",
            steps: [
                "Monte um kit corporativo de amostra: 4-6 trufas variadas em caixa elegante com tag personalizável (logo da empresa). Custo: R$ 15-20. Preço: R$ 35-45.",
                "Liste 10-15 empresas médias da sua região (escritórios de contabilidade, advocacia, clínicas, salões grandes). Ligue ou vá pessoalmente pedir para falar com o RH ou a dona.",
                "Apresente a proposta: 'Ofereço kits de doces artesanais personalizados com a marca da empresa para presentear funcionários. Temos pacotes a partir de 10 unidades com preço especial.'",
                "Ofereça contrato de 6-12 meses com entrega mensal (ex: kit aniversariantes do mês). Combine pagamento até o dia 5 do mês seguinte.",
                "Crie um calendário de vendas corporativas: Março (Dia da Mulher), Maio (Dia das Mães), Junho (Dia dos Namorados), Outubro (Dia das Crianças), Dezembro (Natal).",
                "Uma empresa com 50 funcionários = ~4 aniversariantes/mês x R$ 40 = R$ 160/mês fixo. 5 empresas = R$ 800/mês."
            ]
        },
        {
            icon: <Award />,
            title: "3. Programa de Fidelização",
            desc: "Cartão fidelidade físico ou digital: 'Compre 10 fatias de bolo e ganhe 1'. Incentiva a recompra contínua.",
            steps: [
                "Crie um cartão fidelidade simples (Canva tem templates prontos). '10 carimbos = 1 [produto] grátis'. Imprima em gráfica rápida (100 cartões = R$ 15-25).",
                "Dê o cartão a cada cliente junto com a entrega. Já carimbre a primeira compra na frente dele(a). Diga: 'Com 10 carimbos você ganha um ovo/caixa de trufas grátis!'",
                "Para versão digital: crie uma planilha no Google Sheets. A cada compra, registre o nome e envie pelo WhatsApp: 'Oi [nome]! Você agora tem [X] pontos. Faltam [Y] para ganhar seu brinde!'",
                "Ofereça bônus duplo em dias de baixa venda: 'Toda terça-feira, compras valem 2 carimbos!'. Isso estimula vendas nos dias fracos.",
                "Quando o cliente resgatar o brinde, tire uma foto (com permissão) e poste: '[Nome] resgatou seu brinde do Programa VIP! Você também pode. Pergunte como.' — Social proof grátis.",
                "Taxa de retorno esperada: clientes fidelizados compram 3-5x mais ao longo do ano do que clientes sem programa."
            ]
        },
        {
            icon: <Store />,
            title: "4. Feiras e Eventos Locais",
            desc: "Alugue uma barraca em feiras de fim de semana da sua cidade. Ótimo para giro rápido de caixa e divulgação da marca.",
            steps: [
                "Pesquise feiras do seu município: feira livre, feira noturna, feira gastronômica, feira de artesanato. Ligue para a prefeitura ou associação comercial e pergunte sobre vagas.",
                "Invista no visual da barraca: toalha bonita, bandeirolas, placa com nome e preços claros. Uma barraca bem montada vende 3x mais que uma 'mesa com pano branco'.",
                "Leve produtos de giro rápido e impulso: trufas unitárias (R$ 5-8), fatias de bolo (R$ 8-12), cones (R$ 8-10), e no máximo 2-3 ovos montados para exposição/encomenda.",
                "Ofereça degustação de uma trufa cortada em 4 pedacinhos. Custo da degustação: R$ 2. Conversão esperada: 1 a cada 3 provam e compram.",
                "Tenha SEMPRE cartão de visita e seu WhatsApp em QR code na mesa. Mesmo quem não comprar na hora pode encomendar depois.",
                "Meta de faturamento por feira: R$ 200-500 em 4-6 horas. Acompanhe seus custos (aluguel do espaço, insumos, transporte) para garantir lucro."
            ]
        },
        {
            icon: <Coffee />,
            title: "5. Revenda em Pontos Comerciais",
            desc: "Deixe seus doces em consignação em padarias de bairro, salões de beleza de alto padrão e barbearias.",
            steps: [
                "Identifique 5-10 pontos comerciais do seu bairro que tenham fluxo de clientes e combinem com seu produto: padarias, salões, barbearias, estúdios de pilates, cafeterias.",
                "Prepare um 'kit vitrine': 6-10 produtos embalados lindamente + um display simples (pode ser uma bandeja decorada ou suporte de acrílico).",
                "Vá presencialmente e faça a proposta: 'Deixo os produtos aqui em consignação. Você fica com 20-25% de cada venda. Sem risco nenhum para você — o que não vender eu recolho.'",
                "Combine reposição semanal (toda segunda, por exemplo). Controle o estoque com uma planilha compartilhada no WhatsApp com o ponto.",
                "Coloque etiqueta em cada produto com: nome, preço, validade e seu @/WhatsApp. Alguns clientes do ponto vão te seguir e comprar direto.",
                "Comece com 3 pontos. Se funcionar, expanda. Um ponto que vende 5 trufas/dia a R$ 8 = R$ 40/dia x 5 dias = R$ 200/semana. Seu lucro (após 25% do ponto): R$ 150/semana por ponto."
            ]
        },
        {
            icon: <Truck />,
            title: "6. iFood e Delivery Local",
            desc: "Otimize seu cardápio no iFood para vendas de impulso pós-almoço (13h-15h) com combos 'Doce + Refri'.",
            steps: [
                "Cadastre-se no iFood como 'Restaurante' na categoria 'Doces e Sobremesas'. Tenha CNPJ de MEI (custa R$ 0/mês e sai em 1 dia no portal do governo).",
                "Comece com um cardápio enxuto: 3-4 itens estratégicos (fatia de bolo, caixa de trufas, brownie, doce no pote). Não coloque tudo — iFood premia quem é focado.",
                "Use fotos profissionais (luz natural, fundo limpo). Copie o estilo das fotos dos restaurantes mais vendidos da sua região. A foto é 80% da venda no iFood.",
                "Crie combos de impulso: 'Brownie + Água por R$ 14,90' (o combo aumenta ticket médio em 30%). Ative promoções da plataforma quando disponíveis.",
                "Foque no horário de pico: 12h-15h (pós-almoço) e 19h-22h (sobremesa do jantar). Mantenha a loja aberta nesses horários com estoque preparado.",
                "Monitor avaliações: responda TODAS (boas e ruins). Nota acima de 4.5 = posicionamento orgânico melhor na plataforma. Meta: 4.7+ em 30 dias."
            ]
        },
        {
            icon: <Package />,
            title: "7. Embalagem Presenteável o Ano Todo",
            desc: "Venda a experiência. Tenha sempre uma opção de caixa com laço para quem esqueceu de comprar o presente de aniversário.",
            steps: [
                "Tenha sempre 2-3 opções de embalagem presenteável prontas: caixa com laço (R$ 3-5 de custo), saquinho kraft com tag (R$ 1-2), caixa rígida premium (R$ 8-12).",
                "Adicione ao seu cardápio permanente: 'É PRESENTE? A gente embala! Embalagem Standard: +R$ 5 | Embalagem Premium: +R$ 12'. Isso é margem pura.",
                "Invista em tags e adesivos com sua marca (500 adesivos personalizados = R$ 30-50 no Elo7 ou marcenaria local). Sua marca na embalagem = marketing gratuito a cada presente dado.",
                "Crie kits temáticos: Maio (Dia das Mães), Junho (Namorados), Agosto (Dia dos Pais), Outubro (Crianças). Mesmo produto, embalagem diferente = 'produto novo' na percepção do cliente.",
                "No Instagram, faça posts do tipo: 'Esqueceu de comprar o presente? Eu resolvo! 🎁 Encomende até 15h e entrego hoje com embalagem de presente inclusa.'",
                "Clientes que compram como presente voltam em média 4x ao ano (aniversários, formaturas, etc). Uma boa embalagem transforma compra única em cliente recorrente."
            ]
        },
        {
            icon: <HeartHandshake />,
            title: "8. Degustação em Escritórios",
            desc: "Leve uma caixa de amostras grátis em escritórios de contabilidade/advocacia na sexta-feira à tarde. Deixe seu cartão.",
            steps: [
                "Prepare 5-10 caixinhas com 3-4 mini trufas/bombons (custo R$ 3-5 cada). Sexta-feira à tarde é o momento perfeito — as pessoas estão relaxadas e sociáveis.",
                "Escolha escritórios com 10+ funcionários: contabilidades, advocacias, clínicas, escritórios de engenharia, imobiliárias. Vá na recepção e peça para deixar 'uma degustação da confeitaria do bairro'.",
                "Inclua um cartão bonito em cada caixinha: 'De: [Seu Atelier] | Para: Vocês 🍫 | Encomendas: (WhatsApp)'. Mantenha super simples e direto.",
                "Não tente vender na hora. Apenas diga: 'Olá! Sou confeiteira do bairro e trouxe uma degustação para a equipe experimentar. Se gostarem, é só chamar no WhatsApp!'",
                "Na semana seguinte, envie mensagem para o contato que te atendeu: 'Oi! A equipe gostou dos doces? Tenho condições especiais para pedidos do escritório!'",
                "De cada 5 escritórios visitados, espere converter 1-2 em clientes recorrentes. Custo total: R$ 25-50. Retorno potencial: R$ 200-500/mês por escritório."
            ]
        },
        {
            icon: <MessageCircle />,
            title: "9. Grupos de Condomínio",
            desc: "Faça ofertas relâmpago no WhatsApp do seu condomínio: 'Fiz uma fornada de brownie a mais, quem quer? Entrego na porta em 5 min'.",
            steps: [
                "Se você mora em condomínio/prédio com grupo de WhatsApp, esse é seu canal de venda mais poderoso. Zero custo de aquisição, entrega instantânea, sem taxa de plataforma.",
                "Comece discreto: 'Oii vizinhos! Fiz uma fornada de brownies e sobraram alguns. Quem quiser, entrego na porta por R$ 8 a fatia. Disponíveis até acabar!' — parece casual, mas é estratégico.",
                "Se não tiver grupo do condomínio, crie um ou peça ao síndico para divulgar. Ou imprima um flyer simples para o elevador/portaria com QR code do seu WhatsApp.",
                "Crie uma rotina semanal: toda quinta-feira é 'Dia do Doce no Prédio'. Poste no grupo pela manhã e entregue à tarde. A recorrência cria hábito e expectativa.",
                "Ofereça 'entrega na porta em 5 minutos' — essa conveniência é imbatível. Nenhum iFood ou concorrente chega tão rápido. Use isso como seu diferencial.",
                "Expanda para prédios vizinhos: peça para clientes indicarem você nos grupos de seus prédios. Ofereça 10% de desconto na próxima compra para cada indicação."
            ]
        },
        {
            icon: <Store />,
            title: "10. Collab com Outras Marcas",
            desc: "Faça parcerias. Ex: No Dia dos Namorados, junte-se a uma floricultura local para vender o combo 'Buquê + Caixa de Trufas'.",
            steps: [
                "Identifique 3-5 negócios locais complementares (não concorrentes): floricultura, loja de presentes, cafeteria, vinícola, cerimonialista, fotógrafo.",
                "Proposta: 'Vamos criar um combo juntos? Eu entro com as trufas/doces, você entra com [seu produto]. Divulgamos nos dois perfis e rachamos o lucro 50/50.'",
                "Crie o combo com nome atrativo: 'Box Amor' (Dia dos Namorados: buquê + trufas), 'Kit Mãe Merece' (Dia das Mães: vinho + caixa gourmet), 'Cesta Executiva' (corporativo).",
                "Cada marca divulga para sua base de clientes. Isso é o mais valioso: você acessa os clientes do parceiro sem gastar nada em ads. Match perfeito.",
                "Monte pedidos por encomenda (não produza antes de vender). Combine logística: cada um entrega sua parte ou montem juntos num ponto de encontro.",
                "Após a collab, agradeça publicamente no Instagram do outro e vice-versa. Mantenha o relacionamento para próximas datas. Uma boa collab pode virar uma parceria fixa mensal."
            ]
        },
    ];

export default function SalesStrategies() {
    const [activeTab, setActiveTab] = useState<'easter' | 'bonus'>('easter');

    const handleDownloadPdf = () => {
        window.print();
    };

    return (
        <div className="space-y-6" id="strategies-content">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-[#E295A3]/20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-[#E295A3]/20 pb-6 mb-6">
                    <div>
                        <span className="inline-block py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-xs mb-4 uppercase tracking-wider">
                            Módulo 3
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4A3338] mb-3 flex items-center gap-3">
                            <TrendingUp className="text-[#D16075]" size={32} /> Manual de Vendas
                        </h1>
                        <p className="text-base sm:text-lg text-[#70545A]">
                            20 estratégias testadas com passo a passo de execução. Clique em cada uma para expandir.
                        </p>
                    </div>
                    <button
                        onClick={handleDownloadPdf}
                        className="flex items-center gap-2 px-5 py-3 bg-[#4A3338] text-white rounded-xl font-semibold text-sm hover:bg-[#5E4249] transition-colors shrink-0 shadow-md print:hidden"
                    >
                        <Download size={18} /> Baixar em PDF
                    </button>
                </div>

                {/* Usage tip */}
                <div className="bg-[#FFF5F7] p-4 rounded-xl border border-[#E295A3]/20 print:hidden">
                    <p className="text-sm text-[#70545A]">
                        💡 <strong>Clique em cada estratégia</strong> para ver o passo a passo completo de como executar.
                        Use o botão <strong>"Baixar em PDF"</strong> para salvar todo o conteúdo no seu celular/computador.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E295A3]/20 p-2 flex gap-2 print:hidden">
                <button
                    onClick={() => setActiveTab('easter')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all text-center ${activeTab === 'easter'
                            ? 'bg-[#D16075] text-white shadow-md'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    🐰 10 Estratégias de Páscoa
                </button>
                <button
                    onClick={() => setActiveTab('bonus')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all text-center ${activeTab === 'bonus'
                            ? 'bg-[#A8576A] text-white shadow-md'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    📈 10 Estratégias Gerais
                </button>
            </div>

            {/* Strategy Cards */}
            <div className="grid md:grid-cols-1 gap-4">
                {(activeTab === 'easter' ? easterStrategies : bonusStrategies).map((strategy, index) => (
                    <StrategyCard
                        key={index}
                        strategy={strategy}
                        index={index}
                        variant={activeTab}
                    />
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-[#4A3338] to-[#5E4249] text-white p-6 sm:p-8 rounded-2xl shadow-lg print:hidden">
                <h3 className="text-xl font-bold mb-3 text-[#E295A3]">🎯 Por onde começar?</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    Não tente aplicar as 20 estratégias de uma vez. Escolha <strong className="text-white">3 estratégias</strong> para começar:
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="font-bold mb-1">1ª Semana</p>
                        <p className="text-gray-300">Monte seu catálogo no WhatsApp Business (Estratégia 8)</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="font-bold mb-1">2ª Semana</p>
                        <p className="text-gray-300">Faça degustação + sorteio no Instagram (Estratégias 1 e 6)</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="font-bold mb-1">3ª Semana</p>
                        <p className="text-gray-300">Abra encomendas com escassez (Estratégia 4) + upsell (Estratégia 5)</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          #strategies-content {
            padding: 0 !important;
            gap: 8px !important;
          }
          #strategies-content > div {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
        </div>
    );
}
