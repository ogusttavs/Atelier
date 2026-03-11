# Atelier 21 — Operação Páscoa Lucrativa

Aplicação de vendas e área de membros para o infoproduto do Atelier 21.

## Stack atual

- React 19 + Vite
- Tailwind CSS 4
- Express + SQLite
- autenticação própria com token assinado
- checkout Kiwify + webhook
- email pós-compra via Resend

## Rotas

- `/` — landing page
- `/login` — login da área de membros
- `/member` — área de membros
- `/obrigado` — página de obrigado e reenvio de acesso

## Rodar localmente

Pré-requisito: Node.js 20+

```bash
npm install
npm run dev
```

Em outro terminal:

```bash
npx tsx src/server.ts
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:3001`

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `VITE_KIWIFY_CHECKOUT_URL`
- `PORT`
- `JWT_SECRET`
- `DB_PATH`
- `FRONTEND_URL`
- `APP_LOGIN_URL`
- `KIWIFY_WEBHOOK_TOKEN`
- `EMAIL_PROVIDER`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `EMAIL_FROM`
- `ADMIN_SECRET`

## Fluxo principal

1. A LP leva para o checkout da Kiwify.
2. A compra aprovada chama `POST /api/webhook/kiwify`.
3. O backend cria ou reativa a usuária na tabela `users`.
4. O acesso fica com `access_status = active`.
5. O email de boas-vindas envia um link para definir a senha.
6. A página `/obrigado` orienta a compradora e permite reenviar o acesso.
7. A usuária acessa `/login` e entra na área de membros.

Arquivos centrais desse fluxo:

- `src/server.ts`
- `src/services/email.ts`
- `src/contexts/AuthContext.tsx`

## Comandos de validação

```bash
npm run lint
npm run build
```

Em 10/03/2026, `npm run build` passou com sucesso.

## Documentação do projeto

- `PROJETO.md` — status real, diagnóstico e próxima etapa
- `ESTRATEGIA_MARKETING_VENDAS.md` — direção comercial do ciclo atual
- `CHECKLIST_IMPLANTACAO_VPS.md` — implantação e homologação da VPS

## Hospedagem

Estratégia atual de produção:

- frontend buildado e servido por Nginx
- backend Node/Express gerenciado por PM2
- proxy de `/api/*` para o backend
- reescrita de SPA para `/login` e `/member`

## Observação importante

A produção já foi homologada no servidor para `login`, `verify`, rotas admin, `webhook` e envio aceito pela Resend. O próximo foco do projeto é marketing, prova social e conversão.
