# Operação Páscoa Lucrativa — Atelier 21

> Documento mestre do projeto.
> Última atualização: 10/03/2026 — revisão geral do produto, da estratégia e da próxima etapa.

---

## 1. Resumo Executivo

**O que é:** infoproduto low ticket para confeiteiras que querem usar a Páscoa como janela de faturamento, com um caminho integrado de `o que vender + quanto cobrar + como abrir as encomendas`.

**Marca:** Atelier 21 — "Ensinar a fazer e vender doces no século 21"

**Preço atual:** R$ 49,90 com âncora visual de R$ 197,00

**Domínio de produção:** `https://oatelier21.com.br`

**Modelo operacional atual:** produto perpétuo na infraestrutura, com campanha comercial sazonal de Páscoa.

**Status real do projeto em 10/03/2026:**
- produto e área de membros implementados
- produção homologada no servidor com domínio, Nginx, PM2, banco e API pública ativos
- login, `verify`, rotas admin, webhook e envio aceito pela Resend testados em produção
- backup inicial do banco criado em `/var/www/atelier21/shared/atelier21.db.backup-20260310-181050`

**Próxima etapa recomendada:** sair da infraestrutura e entrar em operação de marketing, usando o fluxo já homologado para captar prova social, objeções reais e melhorar conversão.

---

## 2. Estrutura do Produto

O produto entrega **3 módulos** dentro de uma área de membros própria:

### Módulo 1 — O que vender

Guia com **10 receitas clássicas** e **5 queridinhos do TikTok**, com foco em segurança comercial e apelo visual.

Cada receita entrega:
- descrição comercial do produto
- faixa de preço, custo, lucro e margem
- ingredientes
- passo a passo
- dica de embalagem
- links de apoio para YouTube e TikTok

### Módulo 2 — Quanto cobrar

Calculadora interativa de precificação com:
- ingredientes
- embalagem
- mão de obra
- custos fixos
- margem de lucro
- preço sugerido e lucro estimado

### Módulo 3 — Como vender

Bloco de execução comercial dividido em:
- **8 frentes centrais para a campanha de Páscoa**
- **4 próximos passos opcionais** de continuidade e monetização

O foco do ciclo atual deve ficar no bloco sazonal. Continuidade, order bump, upsell e recorrência entram depois da primeira validação comercial.

---

## 3. Público e Promessa Atual

### Personas já explicitadas no produto

| Persona | Leitura prática |
|---------|-----------------|
| Iniciantes do Zero | quer renda rápida, mas trava no cardápio e no medo de errar |
| Mães e Donas de Casa | quer renda em casa, com algo aplicável e direto |
| Confeiteiras Travadas | já produz, mas ainda trava em preço, oferta e vendas |

### Promessa que o produto já sustenta

Entrar na Páscoa com mais clareza para:
- escolher um cardápio com apelo comercial
- cobrar sem sair no prejuízo
- abrir as encomendas com menos improviso

### Dor central que mais organiza a oferta

A cliente não quer só aprender confeitaria. Ela quer **transformar doce em dinheiro nesta data**, sem travar no produto, no preço e na venda.

---

## 4. Estado Atual do Software

### Frontend implementado

- landing page em `/`
- login em `/login`
- área de membros em `/member`
- navegação client-side com fallback para login ou membro conforme autenticação
- lazy loading dos módulos de login e membros

### Conteúdo implementado

- `EasterGuide.tsx`: módulo com 15 produtos
- `PricingCalculator.tsx`: calculadora interativa
- `SalesStrategies.tsx`: bloco comercial sazonal + continuidade
- `SalesPage.tsx`: página de vendas com oferta, FAQ, garantia e CTAs

### Backend implementado

- `POST /api/auth/login`
- `POST /api/auth/verify`
- `POST /api/webhook/kiwify`
- `POST /api/admin/create-user`
- `GET /api/admin/users`
- `GET /api/health`

### Persistência e acesso

- SQLite com tabela `users`
- autenticação por token assinado
- controle de acesso por `access_status`
- criação ou reativação de usuária pelo webhook

### Email pós-compra

- serviço implementado em `src/services/email.ts`
- provider atual: Resend via API HTTP
- envio depende de `RESEND_API_KEY` e remetente válido

### Verificação técnica mais recente

Em 10/03/2026, `npm run build` passou com sucesso.

---

## 5. Infraestrutura e Produção

| Camada | Situação atual | Observação |
|--------|----------------|------------|
| Domínio + HTTPS | online | `oatelier21.com.br` já responde |
| Frontend | publicado | servido via Nginx |
| Backend | publicado | rodando via PM2 na porta `3010` |
| Banco | criado | SQLite em `/var/www/atelier21/shared/atelier21.db` |
| Checkout | pronto no app | falta apenas confirmação via compra real no checkout oficial |
| Webhook | homologado | evento QA `paid` criou acesso com sucesso |
| Email de acesso | homologado | Resend aceitou envio em produção (`email_sent: true`) |

---

## 6. O Que Já Está Validado e O Que Ainda Falta

### Já validado em produção

- estrutura de oferta em 3 módulos
- LP pública por HTTPS
- backend e autenticação reais
- `POST /api/auth/login`
- `POST /api/auth/verify`
- `POST /api/admin/create-user`
- `GET /api/admin/users`
- `POST /api/webhook/kiwify`
- criação de acesso com `access_status = active`
- envio aceito pela Resend
- build de produção
- backup inicial do banco

### O que ainda é confirmação externa, não bloqueio técnico

- compra real pelo checkout oficial da Kiwify
- recebimento do email em uma caixa de entrada real
- coleta de prova social real
- coleta de objeções reais para LP e WhatsApp

---

## 7. Diagnóstico Atual do Projeto

O projeto **não está travado por produto**. Ele já tem:
- promessa clara
- ticket de entrada
- área de entrega pronta
- fluxo técnico de acesso pronto

O maior risco atual está em dois pontos:
- **conversão**, porque a LP ainda depende mais de estrutura do que de prova social e objeções reais
- **operação comercial**, porque agora o gargalo sai da tecnologia e passa para aquisição, mensagem e volume de testes

Também existe um ponto de foco:
- o bloco de continuidade dentro do módulo 3 é útil como backlog, mas não deve competir com a promessa principal de Páscoa neste primeiro ciclo

---

## 8. Próxima Etapa Recomendada

### Meta imediata

**Operar marketing e conversão em cima da infraestrutura já pronta.**

### Ordem recomendada

1. começar tráfego de conteúdo e aquisição com CTA para LP e WhatsApp
2. captar prints, dúvidas e objeções de leads e compradoras
3. inserir prova social real na LP
4. transformar objeções reais em FAQ, Stories e mensagens de apoio
5. organizar um pico sazonal mais agressivo conforme a janela de Páscoa encurta

### Por que essa é a próxima etapa

Porque o lado técnico deixou de ser o gargalo. O projeto já consegue:
- receber tráfego
- entregar checkout
- criar acesso
- validar login
- enviar email

Agora o crescimento depende de marketing, prova e refinamento de mensagem.

---

## 9. Backlog Pós-Tração Inicial

Depois de ganhar prova e volume comercial, a ordem sugerida é:

1. mensagens curtas de recuperação por WhatsApp
2. pre-checkout e recuperação estruturada
3. order bump
4. upsell
5. produto de continuidade pós-Páscoa

---

## 10. Como Rodar Localmente

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
npx tsx src/server.ts
```

Rotas principais:
- `http://localhost:3000/`
- `http://localhost:3000/login`
- `http://localhost:3000/member`

O login depende do backend e do banco ativos.

---

## 11. Documentos Relacionados

- `README.md` — setup técnico rápido
- `ESTRATEGIA_MARKETING_VENDAS.md` — direção comercial do ciclo atual
- `CHECKLIST_IMPLANTACAO_VPS.md` — implantação e homologação na VPS
- `../Docs VTSD/00-Analise-Geral-VTSD-Operacao-Pascoa-Lucrativa.md` — leitura do projeto à luz do acervo VTSD
- `../Docs VTSD/01-Posicionamento-Oferta-e-Mecanismo.md` — leitura de posicionamento e oferta
- `../Docs VTSD/03-Fluxo-Comercial-e-Monetizacao.md` — leitura de fluxo comercial e monetização
