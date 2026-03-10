# Atelier 21 — Operação Páscoa Lucrativa

Aplicação de vendas + área de membros para o infoproduto do Atelier 21.

## Stack

- React 19 + Vite + Tailwind CSS 4 + Motion
- Express + SQLite
- Autenticação própria com token assinado
- Checkout Kiwify + webhook

## Rotas da aplicação

- `/` — landing page
- `/login` — login da área de membros
- `/member` — área de membros

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

- `VITE_KIWIFY_CHECKOUT_URL` — link do checkout mostrado na LP
- `JWT_SECRET` — segredo do token
- `KIWIFY_WEBHOOK_TOKEN` — token de segurança do webhook
- `FRONTEND_URL` — URL do frontend
- `APP_LOGIN_URL` — URL pública do `/login`
- `RESEND_API_KEY` — chave da API do Resend
- `RESEND_FROM_EMAIL` — remetente validado no Resend
- `EMAIL_PROVIDER` — compatibilidade com a estrutura já usada na VPS (`resend`)
- `EMAIL_FROM` — compatibilidade com a estrutura já usada na VPS
- `ADMIN_SECRET` — segredo das rotas admin

## Hospedagem na VPS

O projeto não será publicado na Vercel.

Estratégia recomendada na VPS:

- frontend buildado com `npm run build`
- arquivos estáticos servidos por Nginx
- backend Node/Express rodando como processo gerenciado por PM2 ou systemd
- Nginx fazendo proxy de `/api/*` para o backend
- Nginx reescrevendo `/login` e `/member` para `index.html`

## Fluxo de acesso

1. A compra aprovada chama `POST /api/webhook/kiwify`.
2. O backend cria ou reativa a usuária na tabela `users` do banco `atelier21.db`.
3. O acesso fica marcado com `access_status = active`.
4. O login valida email, senha e status ativo.
5. A verificação do token também consulta o banco para confirmar que o acesso continua ativo.

Arquivos principais desse fluxo:

- `src/server.ts`
- `src/services/email.ts`
- `src/contexts/AuthContext.tsx`

## Onde os dados ficam salvos

Os usuários são armazenados em `atelier21.db`, na raiz do projeto.

Campos principais da tabela `users`:

- `email`
- `password_hash`
- `name`
- `kiwify_order_id`
- `access_status`
- `created_at`

## Email automático

O envio automático de boas-vindas está centralizado em `src/services/email.ts`.

Hoje ele usa a API HTTP do Resend sem SDK extra. O webhook chama esse serviço logo após criar a usuária.

O projeto aceita tanto `RESEND_FROM_EMAIL` quanto `EMAIL_FROM`, para reaproveitar a mesma estrutura já usada em outros projetos da VPS.

Se `RESEND_API_KEY` ou `RESEND_FROM_EMAIL`/`EMAIL_FROM` não estiverem configurados, o acesso é criado mesmo assim e o backend registra um aviso no log.

## Autenticação

O login depende da API real em `src/server.ts` e da tabela `users` no SQLite.

Sem backend ativo, o acesso não é liberado.

## Comandos de validação

```bash
npm run lint
npm run build
```

O `build` agora roda `tsc --noEmit` antes do bundle do Vite.

## Checklist operacional

O passo a passo detalhado para a VPS está em [CHECKLIST_IMPLANTACAO_VPS.md](./CHECKLIST_IMPLANTACAO_VPS.md).
