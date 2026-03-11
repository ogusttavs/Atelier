# Plano de Trafego Adaptado ao Metodo Subido - Atelier 21

> Documento operacional revisado em 11/03/2026.
> Baseado no contexto atual do projeto Atelier 21 e nas aulas do curso Subido de Trafego consultadas localmente.

---

## 1. Contexto lido

### O que o projeto ja tem

- produto low ticket de `R$ 49,90`
- landing page publicada
- checkout Kiwify configurado
- webhook, login e area de membros funcionando
- fluxo principal ja pronto: `Instagram / Conteudo / WhatsApp -> LP -> Checkout -> Acesso`
- promessa central clara: `o que vender + quanto cobrar + como vender na Pascoa`
- FAQ estrutural implementada na LP
- checagem externa do dia: dominio principal respondendo e `/api/health` retornando `ok`

### Restricoes operacionais informadas

- verba inicial: `R$ 50/dia`
- campanha precisa estar rodando ate `11/03/2026`
- o foco e retorno, nao branding amplo

### Leitura do negocio

Pela documentacao do projeto, o Atelier 21 hoje nao esta travado por produto nem por tecnologia. O gargalo saiu da estrutura e foi para:

1. aquisicao
2. prova
3. objecoes reais
4. refinamento de conversao

### Hipoteses assumidas para nao travar a execucao

- a operacao vai comecar pela `Meta Ads`, porque o projeto ja esta centrado em Instagram, Stories, Reels, LP e WhatsApp
- o canal principal de conversao continua sendo `LP + checkout`, com WhatsApp como apoio
- o codigo atual confirma `PageView`; os eventos `ViewContent`, `InitiateCheckout`, `AddToCart` e `Purchase` precisam ser validados antes da publicacao
- ainda nao existe historico robusto de audiencias quentes

Se alguma dessas hipoteses estiver errada, a adaptacao abaixo continua valida como estrutura, mas a segmentacao e a verba entre conjuntos precisam mudar.

---

## 2. O que vem do curso e o que e adaptacao

### Explicito no curso consultado

- para infoprodutos de venda continua, a estrutura-base de campanhas se divide em `vendas`, `remarketing` e `distribuicao de conteudo`
- campanhas de vendas devem olhar para publicos mais recentes, seguidores, leads, visualizadores de video, semelhantes e segmentacoes abertas/detalhadas
- campanhas de remarketing devem focar em quem visitou pagina de vendas ou chegou ao checkout e nao comprou
- branding e envolvimento ajudam a aumentar audiencia e reconhecimento
- objetivo de campanha precisa nascer da estrategia
- estrutura de campanha precisa responder `por que vamos anunciar`, `para quem vamos aparecer` e `o que vamos anunciar`
- ABO da controle de verba por conjunto; CBO deixa a plataforma decidir
- alteracoes de orcamento e lance sao as mudancas mais constantes ate encontrar o `sweet spot`

### Inferencia aplicada ao Atelier 21

Com `R$ 50/dia` e urgencia de retorno, nao faz sentido abrir um playbook completo com tres frentes fortes ao mesmo tempo. Para este momento, a adaptacao mais coerente e:

1. subir `vendas` imediatamente
2. preparar `remarketing` desde o dia 1
3. deixar `branding/distribuicao de conteudo` como apoio organico e, no pago, usar so se houver folga de caixa

Essa priorizacao e uma inferencia operacional a partir do curso, nao uma regra literal do PDF.

---

## 3. Diagnostico rapido do negocio

### Leitura atual

- a oferta tem urgencia natural forte por causa da Pascoa
- o ticket favorece compra de impulso
- a LP ja existe e a promessa esta alinhada com dores claras
- o WhatsApp pode ajudar a destravar compra quente
- o produto parece mais pronto para `conversao direta` do que para uma esteira complexa

### Principal risco

O risco maior nao e subir a campanha. O risco maior e gastar a verba em estrutura demais e sinal de compra de menos.

### Hipotese estrategica principal

Operar o Atelier 21 como `infoproduto perpetuo em infraestrutura` com `execucao comercial sazonal e enxuta`, usando:

- Meta Ads como canal principal
- LP como destino principal
- WhatsApp como apoio para duvida e recuperacao
- criativos de problema x solucao, prova e demonstracao

---

## 4. Perguntas que ainda reduzem risco

Estas perguntas nao bloqueiam a subida, mas mudam a calibragem:

1. Fora do codigo atual, `ViewContent`, `InitiateCheckout`, `AddToCart` e `Purchase` ja estao validados no ecossistema Meta/Kiwify?
2. Ja existe publico de Instagram com algum volume relevante de engajamento?
3. Ja existe trafego na LP para alimentar remarketing?
4. O WhatsApp comercial ja esta pronto para responder rapido?
5. Existe algum grupo de clientes, leads ou seguidores que possa virar publico semelhante?

---

## 5. Estrategia recomendada para subir ate 11/03/2026

### Fase 1 - Arranque de guerra

Periodo: `11/03/2026` ate o momento em que o pixel comecar a acumular sinais.

Objetivo:

- colocar campanha no ar rapido
- concentrar verba em intencao de compra
- gerar trafego para LP
- alimentar o remarketing desde o primeiro dia

### Regra operacional

Com essa verba, o plano precisa comecar simples.

Estrutura recomendada:

- `1 campanha de vendas`
- `2 conjuntos no maximo`
- `3 a 4 anuncios`

Se a audiencia quente estiver pequena demais, reduzir para `1 conjunto` e manter os 3 anuncios.

### Fase 2 - Assim que existir volume

Quando houver publico suficiente de visitantes da LP, iniciadores de checkout ou pessoas muito engajadas:

- manter a campanha de vendas
- ativar uma campanha ou conjunto de `remarketing`

### O que nao entra agora

- campanha separada de branding com peso relevante
- multiplas plataformas ao mesmo tempo
- funil complexo com pre-checkout
- teste de muitas segmentacoes pequenas

---

## 6. Campanhas a subir

## Campanha 1 - Vendas principal

- objetivo: `Vendas`
- plataforma: `Meta Ads`
- papel na estrategia: gerar compra e, ao mesmo tempo, alimentar audiencias para remarketing
- destino principal: `landing page`
- destino secundario: `WhatsApp`, apenas em criativos ou stories de apoio, nao como centro da campanha
- posicionamentos: automáticos como ponto de partida

### Conjunto A - Publico quente/mais recente

- publico:
  - envolvimento com Instagram/Facebook
  - visualizacao de video
  - seguidores
  - lista de leads, se existir
- janela inicial:
  - `30 dias` para envolvimento/video quando houver volume
  - `180 dias` para seguidores/listas, se necessario
- verba sugerida:
  - `R$ 20/dia`, se houver volume real
  - `R$ 0` se a audiencia estiver pequena demais; nesse caso concentrar tudo no Conjunto B

### Conjunto B - Publico frio qualificado

- publico:
  - segmentacao Advantage
  - interesses detalhados ligados ao universo do produto
  - publico semelhante de clientes/leads, se existir
- verba sugerida:
  - `R$ 30/dia`
  - ou `R$ 50/dia` se o conjunto quente ainda nao tiver volume

### Papel dos anuncios dentro da campanha

Anuncio 1:
- angulo: `Nao sei o que vender na Pascoa`
- funcao: captar quem trava no cardapio

Anuncio 2:
- angulo: `Tenho medo de cobrar errado`
- funcao: captar quem sente inseguranca com lucro e precificacao

Anuncio 3:
- angulo: `Nao sei como abrir encomendas e vender`
- funcao: captar quem ja sabe produzir, mas trava no comercial

Anuncio 4:
- angulo: `Veja o que existe dentro do produto`
- funcao: demonstracao e prova do conteudo

## Campanha 2 - Remarketing

Subir somente quando houver audiencia minima.

- objetivo: `Vendas`
- papel na estrategia: capturar quem quase comprou
- destino:
  - LP para visitantes mornos
  - checkout ou LP com CTA direto, para quem ja chegou mais quente

### Publicos

- visitantes da pagina de vendas `14 dias`
- iniciadores de checkout `7 dias`
- visitantes da LP `14 dias`

### Verba sugerida

- `R$ 10 a R$ 15/dia`

### De onde sai essa verba

Sai da campanha principal. Exemplo:

- vendas: `R$ 35 a R$ 40/dia`
- remarketing: `R$ 10 a R$ 15/dia`

Se o remarketing nao gastar ou estiver sem volume, a verba volta para vendas.

---

## 7. Nomenclatura recomendada

Padrao adaptado da logica do modulo de estrutura e nomenclatura:

### Campanha

`VENDAS | MORNO+FRIO | AUTO | PCOA26 | LP`

### Conjuntos

`01 | AUTO | ENG30_VIDEO30_SEG180`

`02 | AUTO | ADV_INT_LOOK`

### Anuncios

`AD01 | NAO_SEI_O_QUE_VENDER`

`AD02 | COBRAR_SEM_PREJUIZO`

`AD03 | ABRIR_ENCOMENDAS`

`AD04 | DEMO_AREA_MEMBROS`

Se preferir mais leitura humana:

- `AD01 | cardapio`
- `AD02 | precificacao`
- `AD03 | vendas`
- `AD04 | prova`

---

## 8. Orcamento inicial recomendado

### Ponto de partida

`R$ 50/dia`

### Distribuicao recomendada

#### Opcao mais conservadora

- `R$ 50/dia` em uma unica campanha de vendas
- `1 ou 2 conjuntos`, dependendo do volume de audiencia

#### Opcao com remarketing ativado

- `R$ 35 a R$ 40/dia` em vendas
- `R$ 10 a R$ 15/dia` em remarketing

### Qual tipo de orcamento usar

Para este contexto, a adaptacao mais segura e `ABO`.

Motivo:

- com pouco dinheiro, voce precisa controlar quanto cada conjunto recebe
- no CBO, a Meta pode concentrar tudo em um unico conjunto e matar o teste

Isso esta alinhado com a explicacao do curso sobre `ABO x CBO` e e a adaptacao mais prudente para a sua verba.

### Quando subir ou descer a verba

Se o custo estiver caro e a campanha estiver gastando rapido demais sem sinal de compra, o primeiro ajuste e reduzir o orcamento ou concentrar a estrutura.

Se houver compra ou sinal de compra consistente, o numero pode subir aos poucos.

O curso sustenta a alteracao de orcamento como uma das alavancas mais frequentes; o valor exato do aumento ou da reducao aqui e inferencia aplicada.

---

## 9. Plano de criativos

Todos os criativos abaixo seguem a linha do curso: ICP claro, anuncio como principal alavanca, CTA cedo e criativo com funcao definida.

## Criativo 1 - Problema x solucao | Cardapio

- publico: frio e morno
- estagio: descoberta qualificada
- formato: Reel vertical
- angulo: `Nao sei o que vender na Pascoa`
- promessa: mais clareza para decidir um cardapio que tenha apelo comercial
- prova: mostrar parte das receitas e da estrutura interna
- CTA: `Clique para ver como organizar produto, preco e venda`

## Criativo 2 - Problema x solucao | Preco

- publico: frio e morno
- estagio: descoberta / consideracao
- formato: Reel vertical ou Story
- angulo: `voce nao precisa cobrar no chute`
- promessa: parar de errar no preco
- prova: demonstracao da calculadora
- CTA: `Veja como calcular sem improviso`

## Criativo 3 - Dor comercial | Venda

- publico: morno e quente
- estagio: consideracao
- formato: Reel com fala direta
- angulo: `postar nao e vender`
- promessa: abrir encomendas com menos travamento
- prova: mostrar o modulo de vendas e as frentes do produto
- CTA: `Entre na pagina e veja tudo que esta incluido`

## Criativo 4 - Demonstracao

- publico: quente
- estagio: decisao
- formato: Story sequencial ou video curto
- angulo: `olha o que tem dentro`
- promessa: clareza sobre a entrega
- prova: area de membros, modulos, calculadora, visual das aulas
- CTA: `Acesse a pagina e entre hoje`

## Criativo 5 - Prova de economia

- publico: frio e morno
- estagio: decisao
- formato: Story ou carrossel em video
- angulo: `uma venda pode pagar o produto`
- promessa: baixo risco de entrada
- prova: comparativo visual simples
- CTA: `Entenda a oferta na pagina`

---

## 10. Variacoes de copy

## 10 hooks / aberturas

1. `Nao sabe o que vender na Pascoa sem ficar perdida no cardapio?`
2. `Se voce tem medo de cobrar errado, esse anuncio e para voce.`
3. `Receita bonita nao paga boleto sozinha na Pascoa.`
4. `Tem gente boa na cozinha perdendo dinheiro porque precifica no chute.`
5. `Se voce trava na hora de abrir encomendas, presta atencao nisso.`
6. `Nao e falta de talento. Muitas vezes e falta de clareza no produto, no preco e na venda.`
7. `Quer usar a Pascoa para faturar sem improvisar tudo de ultima hora?`
8. `Voce nao precisa inventar 20 doces para vender bem na Pascoa.`
9. `O erro nao esta so na receita. Muitas vezes esta no jeito de montar a oferta.`
10. `Se voce quer vender nesta Pascoa mesmo comecando do zero, veja isso.`

## 10 textos principais

1. `A Operacao Pascoa Lucrativa foi feita para quem quer parar de travar no que vender, no quanto cobrar e em como abrir as encomendas.`
2. `Dentro do Atelier 21 voce encontra cardapio com apelo comercial, calculadora de precificacao e orientacao para vender com mais clareza nesta Pascoa.`
3. `O foco aqui nao e confeitaria avancada. O foco e transformar doce em dinheiro com mais organizacao nesta data.`
4. `Se voce sente que tem vontade, mas ainda falta seguranca para montar a oferta, esse produto organiza o caminho.`
5. `Em vez de juntar conteudo solto, voce entra em uma estrutura pronta para decidir produto, preco e venda.`
6. `A proposta e simples: te ajudar a chegar na Pascoa sem improvisar o cardapio, o lucro e a abertura das encomendas.`
7. `Esse produto foi montado para quem quer uma solucao direta, com acesso rapido e aplicacao imediata.`
8. `Voce nao precisa continuar tentando descobrir tudo sozinha em cima da hora.`
9. `A area de membros junta os tres pontos que mais travam a venda sazonal: escolha do produto, precificacao e execucao comercial.`
10. `Se a sua meta e vender mais cedo e com menos erro, clique e veja a estrutura completa.`

## 10 headlines / titulos

1. `Lucre na Pascoa com mais clareza`
2. `Pare de cobrar no chute`
3. `O que vender, quanto cobrar e como vender`
4. `Operacao pronta para a sua Pascoa`
5. `Entre na Pascoa com mais seguranca comercial`
6. `Cardapio, precificacao e vendas em um so lugar`
7. `Nao improvise sua Pascoa`
8. `Use a Pascoa para faturar com mais estrategia`
9. `A forma mais clara de organizar sua venda de Pascoa`
10. `Venda na Pascoa sem travar no caminho`

## 10 fechamentos / CTAs

1. `Clique e veja a pagina completa.`
2. `Entre agora e veja tudo que esta dentro da area de membros.`
3. `Acesse a oferta e entenda como funciona.`
4. `Se fez sentido, toque no link e veja a estrutura completa.`
5. `Clique para conhecer o produto por dentro.`
6. `Veja a pagina e decida com clareza.`
7. `Entre agora para organizar sua Pascoa com antecedencia.`
8. `Toque no link e veja se essa operacao faz sentido para voce.`
9. `Abra a pagina e veja como o Atelier 21 esta estruturado.`
10. `Clique para sair do improviso e entrar em execucao.`

---

## 11. Rotina de execucao para as proximas 24 horas

## Hoje - 11/03/2026

1. validar dominio, checkout e eventos
2. criar publicos:
   - engajamento Instagram/Facebook
   - visualizacao de video
   - seguidores
   - visitantes da LP
   - initiate checkout, se o evento estiver validado
   - purchase, se o evento estiver validado
3. subir 3 a 4 criativos
4. configurar campanha de vendas com ABO
5. revisar link da LP e carregamento
6. deixar WhatsApp comercial pronto para resposta

## Publicacao do dia

1. publicar campanha
2. acompanhar entrega, CPM, CTR, cliques e chegada na LP
3. verificar se algum conjunto nao esta entregando
4. pausar complexidade, nao sair criando mais campanha cedo demais

## Depois da primeira leitura

1. se houver clique e pouca conexao na LP, revisar destino
2. se houver muito clique e pouca compra, revisar pagina e demonstracao
3. se houver entrega ruim, revisar criativo primeiro
4. se houver volume de visitantes, ativar remarketing

## Nota de estado real

- o plano parte de uma base tecnica pronta para vender
- o codigo atual comprova `PageView` do Meta Pixel
- a publicacao paga de hoje depende de validar no Gerenciador de Eventos os eventos de fundo de funil antes de otimizar em `Purchase`

---

## 12. Alavancas editaveis

Voce pode mexer nestas alavancas sem quebrar a logica da estrategia:

- `canal`: manter Meta agora ou, depois, testar Google
- `destino`: LP como principal; WhatsApp como apoio
- `verba`: concentrar tudo em vendas ou abrir remarketing quando houver volume
- `publico`: quente, semelhante, advantage, interesses detalhados
- `angulo`: cardapio, precificacao, vendas, demonstracao
- `volume criativo`: 3 anuncios no minimo; 4 se conseguir
- `estrutura`: 1 conjunto se a verba apertar; 2 se houver volume e controle

O que nao deveria ser alterado agora:

- transformar a operacao em multiplas plataformas ao mesmo tempo
- gastar verba relevante em branding antes de provar conversao
- complicar o funil com mais etapas sem dados

---

## 13. Base documental utilizada

### Projeto Atelier 21

- `Site/PROJETO.md`
- `Site/README.md`
- `Site/ESTRATEGIA_MARKETING_VENDAS.md`
- `Docs VTSD/05-Plano-de-Acao-Sazonal.md`
- `Docs VTSD/04-Conteudo-e-Conversao-para-Pascoa.md`
- `Docs VTSD/03-Fluxo-Comercial-e-Monetizacao.md`
- `Docs VTSD/02-Copy-e-Pagina-de-Vendas.md`
- `Docs VTSD/01-Posicionamento-Oferta-e-Mecanismo.md`
- `Docs VTSD/06-Sugestoes-VTSD-Oferta-Copy-Modelo-de-Negocio.md`

### Curso Subido de Trafego

- `m6a05_planejamento_de_campanhas_para_infoprodutos_de_venda_continua`
- `m6a01_como_criar_uma_estrategia_de_trafego_pago`
- `m6a07_quando_unir_e_separar_conjuntos_de_anuncios_e_campanhas`
- `m3a4_estrutura_e_nomenclatura_de_campanhas`
- `m3a5_selecao_de_objetivos_e_metas_de_desempenho`
- `m3a7_os_4_tipos_de_orcamento`
- `m5a4_como_e_quando_alterar_lances_e_orcamentos`
- `m2a6_como_fazer_uma_pesquisa_de_icp`
- `m2a7_anuncios_o_segredo_dos_anuncios_online`
- `m6a10_distribuicao_de_conteudo`
