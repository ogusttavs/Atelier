# 🐰 Operação Páscoa Lucrativa — Atelier 21

> Documento mestre do projeto. Atualizado sempre que houver mudanças, novas ideias ou progresso.
> **Última atualização:** 09/03/2026 — revisão técnica e alinhamento de produção

---

## 1. Visão Geral

**O que é:** Infoproduto digital para confeiteiras iniciantes e intermediárias que querem lucrar vendendo doces artesanais na Páscoa (e o ano todo).

**Marca:** Atelier 21 — "Ensinar a fazer e vender doces no século 21"

**Preço:** R$ 49,90 (acesso vitalício) — âncora de R$ 197,00

**Domínio de produção:** `https://oatelier21.com.br`

**Público-alvo:**
| Persona | Perfil |
|---------|--------|
| Iniciantes do Zero | Precisa de renda rápida, nunca fez doce, mas tem vontade de aprender |
| Mães e Donas de Casa | Renda extra sem sair de casa, aproveitando tempo livre |
| Confeiteiras Travadas | Já faz doces mas não sabe precificar nem vender |

**Stack técnica:** React 19 + Vite + Tailwind CSS 4 + Framer Motion + Express + SQLite

---

## 2. Estrutura do Produto

O produto entrega **3 módulos** dentro de uma área de membros própria:

### Módulo 1 — 15 Receitas com Apelo Comercial 🍫
Guia completo com receitas lucrativas para a Páscoa, incluindo clássicos de alta saída e 5 extras inspiradas em tendências de conteúdo.

| # | Receita | Preço Venda | Custo | Lucro | Margem | Status |
|---|---------|-------------|-------|-------|--------|--------|
| 1 | Ovo de Colher Ninho c/ Nutella | R$ 85-95 | R$ 28-35 | ~R$ 55 | 160% | ✅ |
| 2 | Ovo de Colher Pistache | R$ 95-120 | R$ 40-50 | ~R$ 60 | 140% | ✅ |
| 3 | Ovo de Colher Brigadeiro Gourmet | R$ 75-89 | R$ 22-28 | ~R$ 55 | 200% | ✅ |
| 4 | Ovo de Colher Biscoff | R$ 89-110 | R$ 35-42 | ~R$ 58 | 155% | ✅ |
| 5 | Ovo em Fatias 🚀 (TENDÊNCIA 2026) | R$ 20-35/fatia | R$ 5-8/fatia | ~R$ 20/fatia | 300% | ✅ |
| 6 | Barras Recheadas Gourmet | R$ 25-40 | R$ 8-12 | ~R$ 22 | 200% | ✅ |
| 7 | Cones Trufados Decorados | R$ 35-50/kit 5 | R$ 8-12/kit | ~R$ 32/kit | 300% | ✅ |
| 8 | Trio Mini Ovos Degustação | R$ 45-65 | R$ 15-20 | ~R$ 38 | 200% | ✅ |
| 9 | Kit Confeiteiro Infantil | R$ 40-55 | R$ 12-18 | ~R$ 30 | 175% | ✅ |
| 10 | Trufas Gourmet (caixa 12) | R$ 40-60 | R$ 10-15 | ~R$ 38 | 280% | ✅ |

Cada receita inclui: card expandível, dashboard de precificação, ingredientes, passo a passo, dica de embalagem e links para referência em YouTube/TikTok.

### Módulo 2 — Planilha de Precificação Automática 🧮
Calculadora interativa: ingredientes → custos → embalagem → mão de obra → margens → preço de venda + lucro.
**Status:** ✅ Implementado

### Módulo 3 — Manual de Vendas: 20 Estratégias 📈
10 estratégias de Páscoa + 10 gerais. Cada uma expandível com passo a passo de execução + download PDF via `window.print()`.
**Status:** ✅ Implementado

---

## 3. Infraestrutura

| Sistema | Modelo | Status |
|---------|--------|--------|
| Pagamento | Kiwify (link direto + webhook) | 🟨 Checkout configurado no frontend; falta validar webhook em produção |
| Autenticação | Email + senha + token + SQLite | ✅ Backend criado (`server.ts`) com validação real via API + banco |
| Área de membros | Layout responsivo próprio | ✅ Implementado |
| Email pós-compra | Resend via API HTTP | 🟨 Estrutura pronta em `src/services/email.ts`; falta validar integração final na VPS |
| Deploy | VPS + Nginx + PM2 + SSL | 🟨 Base online em `oatelier21.com.br`; falta homologação comercial completa |

---

## 4. Progresso

### ✅ Concluído
- Sales page completa (`SalesPage.tsx`)
- Rota real de login em `/login`
- Login page (`LoginPage.tsx`)
- Área de membros com sidebar + nav mobile (`MemberArea.tsx`)
- **15 receitas** com vídeos, precificação e dicas (`EasterGuide.tsx`, `RecipeCard.tsx`)
  - 10 clássicas com filtros por dificuldade (Fácil / Médio / Avançado)
  - 5 novas **Queridinhos do TikTok** (Cenoura, Bark, Hot Choc Bomb, Geode, Churros)
- Vídeos corrigidos: iframe quebrado substituído por links YouTube + TikTok que abrem em nova aba
- Calculadora de precificação interativa (`PricingCalculator.tsx`)
- 20 estratégias com passo a passo + PDF download (`SalesStrategies.tsx`, `StrategyCard.tsx`)
- AuthContext com autenticação real via API (`AuthContext.tsx`)
- **Backend Express + SQLite + JWT** (`server.ts`)
  - `POST /api/auth/login` — autenticação
  - `POST /api/auth/verify` — validação de token + validação de acesso ativo no banco
  - `POST /api/webhook/kiwify` — cria ou reativa usuário após compra aprovada
  - `POST /api/admin/create-user` — criação manual de usuário
  - `GET /api/admin/users` — listagem de usuários
  - `GET /api/health` — health check
- Serviço de email automático via Resend (`src/services/email.ts`)
- `build` técnico validando TypeScript antes do bundle Vite
- Proxy Vite `/api → localhost:3001` configurado (`vite.config.ts`)
- `.env.example` com todas as variáveis documentadas
- SEO básico (meta description + Open Graph no `index.html`)
- `@types/react` e `@types/react-dom` instalados
- Documento de estratégia salvo em `ESTRATEGIA_MARKETING_VENDAS.md`
- Checklist operacional da VPS salvo em `CHECKLIST_IMPLANTACAO_VPS.md`
- Domínio `oatelier21.com.br` apontado para a VPS com HTTPS ativo
- Frontend publicado na VPS via Nginx
- Backend publicado na VPS via PM2 na porta `3010`
- Banco SQLite criado em `/var/www/atelier21/shared/atelier21.db`

### 🔄 Em Andamento
- _(nenhuma tarefa em andamento agora)_

### ⬜ Pendente
- Configurar variáveis reais em `.env` da VPS (`VITE_KIWIFY_CHECKOUT_URL`, `KIWIFY_WEBHOOK_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_LOGIN_URL`)
- Configurar webhook no painel Kiwify apontando para `POST /api/webhook/kiwify`
- Testar fluxo completo: compra → webhook → email → login
- Validar remetente próprio `acesso@oatelier21.com.br` no Resend
- Inserir prova social e FAQ na sales page

---

## 5. Como Rodar Localmente

```bash
# Terminal 1 — Frontend
npm run dev          # http://localhost:3000

# Terminal 2 — Backend
npx tsx src/server.ts   # http://localhost:3001

# Rotas principais
# LP:      http://localhost:3000/
# Login:   http://localhost:3000/login
# Membros: http://localhost:3000/member

# O login depende do backend + banco ativos
```

---

## 6. Configuração para Produção na VPS

1. Copiar `.env.example` → `.env` e preencher os valores reais
2. Confirmar `VITE_KIWIFY_CHECKOUT_URL` com o checkout oficial do produto
3. No painel Kiwify: Produto → Webhooks → Adicionar `https://seu-dominio/api/webhook/kiwify`
4. Configurar `KIWIFY_WEBHOOK_TOKEN` igual no `.env` e no painel Kiwify
5. Configurar `APP_LOGIN_URL` com a URL pública do `/login`
6. Configurar `RESEND_API_KEY` e `RESEND_FROM_EMAIL` para liberar o email automático
7. Configurar o servidor web da VPS para servir a SPA e reescrever `/login` e `/member` para `index.html`
8. Configurar o backend Node para rodar em processo persistente

---

## 7. Fluxo de Acesso, Validação e Email

### Onde o webhook cria o usuário

O webhook está em `POST /api/webhook/kiwify`, no arquivo `src/server.ts`.

Quando recebe um evento com `order_status = "paid"`:

- lê nome, email e `order_id`
- cria ou reativa a usuária
- define `access_status = active`
- tenta enviar o email automático de boas-vindas

### Onde o usuário é armazenado

Os dados ficam no arquivo SQLite `atelier21.db`, na raiz do projeto.

Tabela principal: `users`

Campos relevantes:

- `email`
- `password_hash`
- `name`
- `kiwify_order_id`
- `access_status`
- `created_at`

### Como a validação de acesso funciona

O projeto não trabalha com "assinatura recorrente". O produto é de acesso vitalício.

Então a regra atual é:

- compra aprovada cria ou reativa a usuária
- login só funciona se a usuária existir e estiver com `access_status = active`
- a verificação do token também consulta o banco para confirmar que o acesso continua ativo

### Onde criar os emails automáticos

O envio automático está centralizado em `src/services/email.ts`.

Hoje o projeto usa a API HTTP do Resend sem SDK extra. Para ativar de verdade, basta configurar:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `APP_LOGIN_URL`

---

## 8. Decisões Tomadas

| Decisão | Motivo | Data |
|---------|--------|------|
| Kiwify para pagamento | Checkout simples, decisão anterior | 09/03 |
| Área de membros própria | Controle total da experiência | 09/03 |
| JWT próprio (sem lib) | Zero dependências extras | 09/03 |
| SQLite (better-sqlite3) | Self-hosted, sem dep. externa | 09/03 |
| YouTube search embed | Vídeos de terceiros por enquanto | 09/03 |
| PDF via browser print | Sem biblioteca extra | 09/03 |
| Preço R$ 49,90 | Faixa de impulso | Original |

---

## 9. Ideias Futuras

- [ ] Vídeos próprios do Atelier 21
- [ ] Depoimentos/prova social na sales page
- [ ] FAQ na sales page
- [ ] Programa de afiliados Kiwify
- [ ] Expandir para Dia das Mães, Natal, etc.
- [ ] Receitas sazonais ao longo do ano
- [ ] Comunidade WhatsApp/Telegram
- [ ] Email marketing (welcome sequence)
- [ ] Calculadora "quanto posso faturar"
- [ ] PWA mobile

---

## 10. Arquitetura de Arquivos

```
site/
├── index.html              # SEO (meta + OG tags)
├── package.json
├── vite.config.ts          # Proxy /api → :3001
├── .env.example            # Variáveis de ambiente documentadas
├── PROJETO.md              # ← Este documento
├── atelier21.db            # Banco SQLite (gerado automaticamente)
└── src/
    ├── main.tsx
    ├── App.tsx              # Roteamento: sales / login / member
    ├── index.css
    ├── server.ts            # ✅ Backend Express + SQLite + controle de acesso
    ├── vite-env.d.ts        # Tipagem das variáveis Vite
    ├── contexts/
    │   └── AuthContext.tsx  # Auth com API real
    ├── services/
    │   └── email.ts         # Envio automático de email via Resend
    └── components/
        ├── SalesPage.tsx    # Página de vendas
        ├── LoginPage.tsx    # Login da área de membros
        ├── MemberArea.tsx   # Área de membros (sidebar + mobile nav)
        ├── EasterGuide.tsx  # Módulo 1: 15 Receitas
        ├── RecipeCard.tsx   # Card expandível de receita
        ├── PricingCalculator.tsx  # Módulo 2: Calculadora
        ├── SalesStrategies.tsx    # Módulo 3: 20 Estratégias
        └── StrategyCard.tsx       # Card expandível de estratégia
```
