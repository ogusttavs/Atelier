# Checklist de Implantação na VPS — Atelier 21

> Documento operacional para marcar com check durante a implantação.
> Atualizado em 11/03/2026 após homologação, painel admin por email, suporte oficial e otimizações de performance.

---

## 0. Achados da VPS

- [x] VPS identificada: `167.88.32.1`
- [x] `nginx` já está ativo nas portas `80` e `443`
- [x] Existe outro projeto rodando no domínio `getorbita.com.br`
- [x] A porta `3000` já está em uso por outro processo Node
- [x] O banco `atelier21.db` não foi encontrado no scan inicial da VPS

Conclusão operacional:

- não usar `3000` para o Atelier 21 em produção
- preferir frontend estático no `nginx`
- preferir backend do Atelier 21 em porta interna dedicada, por exemplo `3010`

---

## 1. Preparação local

- [x] LP funcionando com botão `Entrar`
- [x] Rota `/login` funcionando no frontend
- [x] Área de membros funcionando
- [x] Backend com login, verify e webhook prontos
- [x] Fallback demo mantido para desenvolvimento
- [x] `npm run lint` passando
- [x] `npm run build` passando
- [x] Definir domínio final do frontend
- [x] Definir domínio ou subdomínio do backend, se separado

---

## 2. Variáveis de ambiente da produção

- [x] Configurar `VITE_KIWIFY_CHECKOUT_URL`
- [x] Configurar `VITE_SUPPORT_EMAIL`
- [x] Configurar `VITE_ADMIN_EMAIL`
- [x] Configurar `VITE_META_PIXEL_ID`
- [x] Configurar `JWT_SECRET`
- [x] Configurar `LEGACY_PASSWORD_SECRET`
- [x] Configurar `KIWIFY_WEBHOOK_TOKEN`
- [x] Configurar `FRONTEND_URL`
- [x] Configurar `APP_LOGIN_URL`
- [x] Configurar `RESEND_API_KEY`
- [x] Configurar `RESEND_FROM_EMAIL`
- [x] Configurar `SUPPORT_EMAIL`
- [x] Configurar `ADMIN_SECRET`
- [x] Configurar `ADMIN_EMAIL`
- [x] Configurar `BACKUP_DIR`
- [x] Configurar `BACKUP_RETENTION_DAYS`

Observação:

`APP_LOGIN_URL` deve apontar para a URL pública do login, por exemplo:

```env
APP_LOGIN_URL=https://oatelier21.com.br/login
```

---

## 2.1. Domínio e DNS

### Arquitetura recomendada

Usar **um único domínio** para o frontend e deixar o backend atrás de `/api`.

Exemplo:

- site: `https://atelier21.com.br`
- login: `https://atelier21.com.br/login`
- membros: `https://atelier21.com.br/member`
- api: `https://atelier21.com.br/api/*`

### O que fazer no domínio

- [x] Escolher o domínio principal do Atelier 21
- [x] Criar registro `A` do domínio principal apontando para `167.88.32.1`
- [x] Criar registro `www` como `CNAME` para o domínio principal, se quiser usar `www`
- [x] Aguardar propagação do DNS
- [x] Confirmar que o domínio responde na VPS antes de emitir SSL

### Exemplo de DNS

```text
Tipo: A
Host: @
Valor: 167.88.32.1

Tipo: CNAME
Host: www
Valor: oatelier21.com.br
```

### Passo a passo recomendado do domínio

1. Comprar ou acessar o domínio no registrador.
2. Entrar no painel DNS.
3. Criar o `A record` apontando para `167.88.32.1`.
4. Opcionalmente criar `www`.
5. Esperar a propagação.
6. Criar o bloco `server_name` no `nginx`.
7. Testar `http`.
8. Emitir SSL com Certbot.
9. Testar `https`.

---

## 3. Banco de dados na VPS

Status atual:

- já existe um banco na VPS
- antes de criar outro, precisamos verificar se ele já é o `atelier21.db` deste projeto ou se é um banco antigo/temporário
- no scan inicial, o `atelier21.db` não apareceu nos caminhos mais prováveis, então ele pode:
  - ainda não existir
  - estar em outro diretório
  - pertencer a outro deploy não identificado ainda

### Decisão a tomar

- [x] Verificar caminho do banco atual na VPS
- [x] Verificar se a tabela `users` já existe
- [x] Verificar schema atual da tabela `users`
- [x] Verificar se já existem compradoras cadastradas
- [x] Decidir se vamos:
  - [x] reutilizar o banco existente
  - [ ] migrar o banco existente
  - [ ] criar um novo banco limpo

### Critério recomendado

Reutilizar o banco existente só faz sentido se:

- o arquivo estiver no caminho correto do projeto
- a tabela `users` tiver os campos esperados
- os dados existentes forem válidos para produção

Criar banco novo faz mais sentido se:

- o banco atual for de teste
- a estrutura estiver inconsistente
- houver risco de mistura com dados antigos

### Estrutura mínima esperada

Tabela `users` com estes campos:

- `id`
- `email`
- `password_hash`
- `name`
- `kiwify_order_id`
- `access_status`
- `created_at`

### Comandos úteis para inspeção na VPS

```bash
sqlite3 /caminho/para/atelier21.db ".tables"
sqlite3 /caminho/para/atelier21.db "PRAGMA table_info(users);"
sqlite3 /caminho/para/atelier21.db "SELECT id, email, name, access_status, created_at FROM users ORDER BY created_at DESC LIMIT 20;"
```

### Se for necessário criar banco novo

- [x] Definir caminho final do banco
- [x] Configurar `DB_PATH` no `.env`
- [x] Subir o backend e deixar o `server.ts` criar a estrutura inicial
- [x] Confirmar criação da tabela `users`

---

## 4. Backend na VPS

- [x] Subir o código atualizado na VPS
- [x] Instalar dependências com `npm install`
- [x] Criar `.env` de produção
- [x] Confirmar `DB_PATH` correto
- [x] Definir porta interna do backend do Atelier 21
- [x] Rodar backend manualmente para teste inicial
- [x] Validar `GET /api/health`
- [x] Configurar backend para rodar com PM2 ou systemd
- [x] Salvar PM2 e habilitar serviço no boot

Porta recomendada:

- `3010` para o backend do Atelier 21

Motivo:

- a porta `3000` já está ocupada por outro projeto nessa VPS

### Testes mínimos do backend

- [x] `POST /api/auth/login`
- [x] `POST /api/auth/verify`
- [x] `POST /api/admin/create-user`
- [x] `GET /api/admin/users`
- [x] `POST /api/webhook/kiwify`

---

## 5. Frontend na VPS

- [x] Rodar `npm run build`
- [x] Publicar a pasta `dist`
- [x] Configurar Nginx para servir o frontend
- [x] Configurar proxy `/api` para `127.0.0.1:3010`
- [x] Configurar rewrite de SPA para `/login`
- [x] Configurar rewrite de SPA para `/member`
- [x] Garantir `robots.txt` e `sitemap.xml` reais em produção
- [x] Aplicar cache longo para assets estáticos no Nginx
- [x] Garantir que assets estáticos carregam corretamente

### Regra importante

Como o app usa `history.pushState`, o servidor precisa reescrever rotas como `/login` e `/member` para `index.html`.

Exemplo conceitual no Nginx:

```nginx
server {
  server_name oatelier21.com.br www.oatelier21.com.br;
  root /var/www/atelier21/current/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:3010;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 6. Integração com Kiwify

- [x] Confirmar URL final do checkout
- [x] Confirmar que a LP está usando `VITE_KIWIFY_CHECKOUT_URL`
- [x] Configurar webhook no painel da Kiwify
- [x] Validar token do webhook aceito pelo endpoint em produção
- [x] Testar recebimento de evento `paid`
- [x] Confirmar criação ou reativação da usuária no banco

Webhook esperado:

```text
POST https://oatelier21.com.br/api/webhook/kiwify
```

---

## 7. Email automático

Status:

- o código já está pronto em `src/services/email.ts`
- na VPS os emails já foram configurados
- a VPS já tem outro projeto usando Resend com `EMAIL_PROVIDER=resend`, `EMAIL_FROM` e `RESEND_API_KEY`
- o Atelier 21 agora aceita tanto `RESEND_FROM_EMAIL` quanto `EMAIL_FROM`
- o domínio `oatelier21.com.br` já foi verificado na Resend
- a `RESEND_API_KEY` da VPS já foi trocada para uma chave válida do Atelier 21
- teste em produção confirmou envio aceito pela Resend com `email_sent: true`
- o webhook segue criando usuária normalmente no banco com `access_status = active`
- a rota pública `https://oatelier21.com.br/login` responde `200 OK`
- as credenciais geradas no webhook já foram testadas com sucesso no login e no `verify`
- o contato oficial de suporte agora é `suporte@oatelier21.com.br`
- os emails automáticos usam `reply_to` para `SUPPORT_EMAIL`

- [x] Confirmar `RESEND_API_KEY`
- [x] Confirmar `RESEND_FROM_EMAIL` ou `EMAIL_FROM`
- [x] Confirmar `SUPPORT_EMAIL`
- [x] Confirmar `APP_LOGIN_URL`
- [x] Verificar domínio `oatelier21.com.br` na Resend
- [x] Testar criação de usuária com envio de email
- [x] Atualizar a `RESEND_API_KEY` da VPS
- [x] Reiniciar `atelier21-api`
- [x] Confirmar envio aceito pela Resend
- [ ] Confirmar recebimento do email na caixa de entrada
- [x] Confirmar que o link do email abre `/login`
- [x] Confirmar que email e senha enviados funcionam no login

Resultado atual da integração:

```text
Webhook em produção retornou: {"ok":true,"email_sent":true,"message":"Usuário criado com sucesso."}
```

Próximos passos externos:

- conferir o email real na caixa de entrada
- confirmar se o email foi para inbox principal, promoções ou spam
- confirmar no painel da Kiwify que o token configurado lá é o mesmo já aceito pelo endpoint

---

## 8. Teste ponta a ponta

- [ ] Comprar pelo checkout real
- [x] Confirmar disparo do webhook
- [x] Confirmar criação da usuária no banco
- [x] Confirmar envio do email automático
- [x] Confirmar login com credenciais recebidas
- [ ] Confirmar acesso à área de membros
- [ ] Confirmar logout
- [ ] Confirmar novo login após logout
- [x] Confirmar acesso ao painel `/admin`
- [x] Confirmar envio do código de admin por email
- [x] Confirmar atualização em tempo real do painel admin

---

## 9. Pós-go-live

- [ ] Inserir prova social na LP
- [ ] Inserir FAQ na LP
- [x] Instalar `PageView` do Meta Pixel
- [ ] Validar `ViewContent`, `AddToCart`, `InitiateCheckout` e `Purchase`
- [x] Fazer inspeção inicial dos logs do backend
- [x] Fazer backup inicial do banco em produção
- [x] Melhorar PageSpeed com cache estático, imagens otimizadas e `robots.txt`

---

## 10. Decisão final sobre o banco da VPS

Estado atual: **banco criado no caminho final, com registros QA e pronto para uso**

Decisão final:

- [x] manter banco existente
- [ ] substituir por banco novo
- [ ] migrar banco existente

Observação final:

Backup inicial criado em:

```text
/var/www/atelier21/shared/atelier21.db.backup-20260310-181050
```
