# Checklist de Implantação na VPS — Atelier 21

> Documento operacional para marcar com check durante a implantação.
> Atualizado em 09/03/2026.

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
- [ ] Definir domínio final do frontend
- [ ] Definir domínio ou subdomínio do backend, se separado

---

## 2. Variáveis de ambiente da produção

- [ ] Configurar `VITE_KIWIFY_CHECKOUT_URL`
- [ ] Configurar `JWT_SECRET`
- [ ] Configurar `KIWIFY_WEBHOOK_TOKEN`
- [ ] Configurar `FRONTEND_URL`
- [ ] Configurar `APP_LOGIN_URL`
- [ ] Configurar `RESEND_API_KEY`
- [ ] Configurar `RESEND_FROM_EMAIL`
- [ ] Configurar `ADMIN_SECRET`

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

- [ ] Escolher o domínio principal do Atelier 21
- [ ] Criar registro `A` do domínio principal apontando para `167.88.32.1`
- [ ] Criar registro `www` como `CNAME` para o domínio principal, se quiser usar `www`
- [ ] Aguardar propagação do DNS
- [ ] Confirmar que o domínio responde na VPS antes de emitir SSL

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

- [ ] Verificar caminho do banco atual na VPS
- [ ] Verificar se a tabela `users` já existe
- [ ] Verificar schema atual da tabela `users`
- [ ] Verificar se já existem compradoras cadastradas
- [ ] Decidir se vamos:
  - [ ] reutilizar o banco existente
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

- [ ] Definir caminho final do banco
- [ ] Configurar `DB_PATH` no `.env`
- [ ] Subir o backend e deixar o `server.ts` criar a estrutura inicial
- [ ] Confirmar criação da tabela `users`

---

## 4. Backend na VPS

- [ ] Subir o código atualizado na VPS
- [ ] Instalar dependências com `npm install`
- [ ] Criar `.env` de produção
- [ ] Confirmar `DB_PATH` correto
- [ ] Definir porta interna do backend do Atelier 21
- [ ] Rodar backend manualmente para teste inicial
- [ ] Validar `GET /api/health`
- [ ] Configurar backend para rodar com PM2 ou systemd
- [ ] Confirmar reinício automático após reboot

Porta recomendada:

- `3010` para o backend do Atelier 21

Motivo:

- a porta `3000` já está ocupada por outro projeto nessa VPS

### Testes mínimos do backend

- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/verify`
- [ ] `POST /api/admin/create-user`
- [ ] `GET /api/admin/users`
- [ ] `POST /api/webhook/kiwify`

---

## 5. Frontend na VPS

- [ ] Rodar `npm run build`
- [ ] Publicar a pasta `dist`
- [ ] Configurar Nginx para servir o frontend
- [ ] Configurar proxy `/api` para `127.0.0.1:3010`
- [ ] Configurar rewrite de SPA para `/login`
- [ ] Configurar rewrite de SPA para `/member`
- [ ] Garantir que assets estáticos carregam corretamente

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

- [ ] Confirmar URL final do checkout
- [ ] Confirmar que a LP está usando `VITE_KIWIFY_CHECKOUT_URL`
- [ ] Configurar webhook no painel da Kiwify
- [ ] Confirmar token do webhook igual ao `.env`
- [ ] Testar recebimento de evento `paid`
- [ ] Confirmar criação ou reativação da usuária no banco

Webhook esperado:

```text
POST https://oatelier21.com.br/api/webhook/kiwify
```

---

## 7. Email automático

Status:

- o código já está pronto em `src/services/email.ts`
- na VPS os emails já foram configurados, então agora falta validar integração final
- a VPS já tem outro projeto usando Resend com `EMAIL_PROVIDER=resend`, `EMAIL_FROM` e `RESEND_API_KEY`
- o Atelier 21 agora aceita tanto `RESEND_FROM_EMAIL` quanto `EMAIL_FROM`

- [ ] Confirmar `RESEND_API_KEY`
- [ ] Confirmar `RESEND_FROM_EMAIL` ou `EMAIL_FROM`
- [ ] Confirmar `APP_LOGIN_URL`
- [ ] Testar criação de usuária com envio de email
- [ ] Confirmar recebimento do email na caixa de entrada
- [ ] Confirmar que o link do email abre `/login`
- [ ] Confirmar que email e senha enviados funcionam no login

---

## 8. Teste ponta a ponta

- [ ] Comprar pelo checkout real
- [ ] Confirmar disparo do webhook
- [ ] Confirmar criação da usuária no banco
- [ ] Confirmar envio do email automático
- [ ] Confirmar login com credenciais recebidas
- [ ] Confirmar acesso à área de membros
- [ ] Confirmar logout
- [ ] Confirmar novo login após logout

---

## 9. Pós-go-live

- [ ] Inserir prova social na LP
- [ ] Inserir FAQ na LP
- [ ] Instalar rastreamento de eventos
- [ ] Monitorar logs do backend nos primeiros acessos
- [ ] Fazer backup inicial do banco em produção

---

## 10. Decisão final sobre o banco da VPS

Estado atual: **pendente de inspeção**

Decisão final:

- [ ] manter banco existente
- [ ] substituir por banco novo
- [ ] migrar banco existente

Observação final:

Não vou assumir criação de banco novo na VPS antes de inspecionar o arquivo atual. Esse é o ponto com maior risco de erro operacional agora.
