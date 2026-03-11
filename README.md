# Atelier 21 — Operação Páscoa Lucrativa

Aplicação de vendas e área de membros para o infoproduto do Atelier 21.

## Stack atual

- React 19 + Vite
- Tailwind CSS 4
- Express + SQLite
- autenticação própria com token assinado
- checkout Kiwify + webhook
- email pós-compra via Resend
- painel admin com login por código enviado por email
- Meta Pixel no frontend de produção
- frontend estático servido por Nginx com cache longo para assets

## Rotas

- `/` — landing page
- `/login` — login da área de membros
- `/member` — área de membros
- `/obrigado` — página de obrigado e reenvio de acesso
- `/admin` — painel administrativo em tempo real

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
- `VITE_SUPPORT_EMAIL`
- `VITE_ADMIN_EMAIL`
- `VITE_META_PIXEL_ID`
- `PORT`
- `JWT_SECRET`
- `LEGACY_PASSWORD_SECRET`
- `DB_PATH`
- `BACKUP_DIR`
- `BACKUP_RETENTION_DAYS`
- `FRONTEND_URL`
- `APP_LOGIN_URL`
- `KIWIFY_WEBHOOK_TOKEN`
- `EMAIL_PROVIDER`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `EMAIL_FROM`
- `SUPPORT_EMAIL`
- `ADMIN_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_ALLOWED_IPS`

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

## Fluxos auxiliares em produção

- suporte oficial: `suporte@oatelier21.com.br`
- painel admin: acesso por código enviado para `ADMIN_EMAIL`
- reenvio de acesso: disponível em `/obrigado` e `/login`
- painel admin atualiza clientes e métricas em tempo real via SSE
- `robots.txt` e `sitemap.xml` publicados para indexação correta

## Performance atual

Em 11/03/2026, após otimizações de imagem, cache estático e ajuste de renderização inicial, uma auditoria Lighthouse local apontou:

- Performance: `87`
- Accessibility: `100`
- Best Practices: `81`
- SEO: `100`
- LCP: `3.1s`
- TBT: `220ms`

## Comandos de validação

```bash
npm run lint
npm run build
```

Em 11/03/2026, `npm run build` passou com sucesso.

## Documentação do projeto

- `PROJETO.md` — status real, diagnóstico e próxima etapa
- `ESTRATEGIA_MARKETING_VENDAS.md` — direção comercial do ciclo atual
- `CHECKLIST_IMPLANTACAO_VPS.md` — implantação e homologação da VPS
- `docs/ROTACAO_DE_SEGREDOS.md` — rotação operacional dos segredos
- `docs/SEGURANCA_EXPLICADA_COMO_PARA_UMA_CRIANCA.md` — visão simples da segurança atual

## Hospedagem

Estratégia atual de produção:

- frontend buildado e servido por Nginx
- backend Node/Express gerenciado por PM2
- proxy de `/api/*` para o backend
- reescrita de SPA para `/login` e `/member`
- cache longo para `css`, `js`, imagens e fontes
- cache curto para `robots.txt` e `sitemap.xml`

## Observação importante

A produção já foi homologada no servidor para `login`, `verify`, painel admin, `webhook`, `robots.txt`, cache estático e envio aceito pela Resend. O próximo foco do projeto continua sendo validar eventos do funil, marketing, prova social e conversão.
