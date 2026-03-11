# Rotacao De Segredos

Este documento existe para voce repetir a rotacao dos segredos do Atelier 21 sem improviso.

## Quando rotacionar

Rotacione imediatamente quando:

- algum segredo foi colado em chat, ticket, print ou email
- alguem saiu da operacao e tinha acesso ao `.env`
- houve suspeita de invasao
- voce trocou dominio, provedor ou integracao

Rotacione preventivamente a cada 60 a 90 dias para:

- `ADMIN_SECRET`
- `KIWIFY_WEBHOOK_TOKEN`
- `RESEND_API_KEY`

Rotacione `JWT_SECRET` com mais cuidado, porque ele afeta sessoes ativas.

## O que existe hoje

Segredos usados em producao:

- `JWT_SECRET`: assina a sessao
- `LEGACY_PASSWORD_SECRET`: mantem compatibilidade com senhas antigas
- `ADMIN_SECRET`: protege rotas tecnicas internas de admin
- `KIWIFY_WEBHOOK_TOKEN`: protege o webhook
- `RESEND_API_KEY`: autoriza envio de email

Observacao:

- o acesso normal ao painel `/admin` nao usa mais `ADMIN_SECRET`
- o painel agora envia um codigo temporario para `ADMIN_EMAIL`
- `ADMIN_SECRET` continua relevante para rotas internas e operacao tecnica

## Nao Reutilizar Os Valores Atuais

Nao grave segredos reais dentro do repositorio.

Para evitar repetir exatamente os mesmos valores, use estes fingerprints como referencia:

- `JWT_SECRET` atual: comeca com `25f7628d` e termina com `196213`
- `LEGACY_PASSWORD_SECRET` atual: igual ao `JWT_SECRET` antigo, comeca com `25f7628d` e termina com `196213`
- `ADMIN_SECRET` atual: comeca com `848295fc` e termina com `523758`
- `KIWIFY_WEBHOOK_TOKEN` atual: comeca com `paqra` e termina com `uuamp`
- `RESEND_API_KEY` atual: comeca com `re_YCAp` e termina com `fWMbT`

Se o novo segredo comecar e terminar igual a algum item acima, descarte e gere outro.

Os valores exatos devem ficar apenas em um gerenciador de senhas ou no `.env` da VPS.

## Regra mais importante

Quando trocar `JWT_SECRET`, nao apague o valor antigo sem antes copia-lo para `LEGACY_PASSWORD_SECRET`.

Isso permite que usuarias antigas continuem entrando e tenham o hash da senha atualizado automaticamente no proximo login.

## Passo A Passo Rapido

1. Entrar na VPS.
2. Fazer backup do banco e do `.env`.
3. Gerar os novos segredos.
4. Atualizar o `.env`.
5. Atualizar a Kiwify e a Resend, se necessario.
6. Reiniciar a API.
7. Validar `health`, login, webhook e criacao manual de usuario.
8. Se algo falhar, restaurar o `.env` anterior e reiniciar o PM2.

## Passo A Passo Completo

### 1. Entrar na VPS

```bash
ssh root@167.88.32.1
cd /var/www/atelier21/current
```

### 2. Fazer backup antes de qualquer mudanca

```bash
TS=$(date +%Y%m%d-%H%M%S)
cp .env /var/www/atelier21/shared/.env.backup-$TS
node --input-type=module -e "import Database from 'better-sqlite3'; const db = new Database('/var/www/atelier21/shared/atelier21.db', { fileMustExist: true, timeout: 5000 }); await db.backup('/var/www/atelier21/shared/backups/atelier21-pre-rotation-' + process.argv[1] + '.db'); db.close();" "$TS"
```

### 3. Gerar novos segredos

Use estes comandos:

```bash
NEW_JWT_SECRET=$(openssl rand -hex 32)
NEW_ADMIN_SECRET=$(openssl rand -hex 32)
NEW_KIWIFY_WEBHOOK_TOKEN=$(openssl rand -hex 24)
```

Para `RESEND_API_KEY`, o valor novo deve ser gerado no painel da Resend.

### 4. Guardar o JWT antigo antes da troca

```bash
OLD_JWT_SECRET=$(grep '^JWT_SECRET=' .env | cut -d= -f2-)
echo "$OLD_JWT_SECRET"
```

### 5. Atualizar o `.env`

Troque os valores sem editar na mao:

```bash
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$NEW_JWT_SECRET|" .env
grep -q '^LEGACY_PASSWORD_SECRET=' .env && sed -i "s|^LEGACY_PASSWORD_SECRET=.*|LEGACY_PASSWORD_SECRET=$OLD_JWT_SECRET|" .env || echo "LEGACY_PASSWORD_SECRET=$OLD_JWT_SECRET" >> .env
sed -i "s|^ADMIN_SECRET=.*|ADMIN_SECRET=$NEW_ADMIN_SECRET|" .env
sed -i "s|^KIWIFY_WEBHOOK_TOKEN=.*|KIWIFY_WEBHOOK_TOKEN=$NEW_KIWIFY_WEBHOOK_TOKEN|" .env
```

Quando voce tiver a nova chave da Resend:

```bash
sed -i "s|^RESEND_API_KEY=.*|RESEND_API_KEY=COLE_A_NOVA_CHAVE_AQUI|" .env
```

### 6. Atualizar servicos externos

#### Kiwify

1. Entrar no painel da Kiwify.
2. Abrir o produto.
3. Abrir a configuracao do webhook.
4. Trocar o token do webhook para o novo valor.
5. Salvar.

#### Resend

1. Entrar no painel da Resend.
2. Revogar a chave antiga.
3. Criar uma nova chave.
4. Garantir que a chave tenha acesso ao dominio correto.
5. Atualizar `RESEND_API_KEY` no `.env`.

### 7. Reiniciar a API

```bash
pm2 restart atelier21-api --update-env
```

### 8. Validar a aplicacao

```bash
curl -fsS http://127.0.0.1:3010/api/health
pm2 status atelier21-api
```

Validar o cron de backup:

```bash
crontab -l | grep atelier21-db-backup
```

Forcar um backup:

```bash
DB_PATH=/var/www/atelier21/shared/atelier21.db BACKUP_DIR=/var/www/atelier21/shared/backups node scripts/backup-db.mjs
```

### 9. Validar acesso admin

```bash
ADMIN_SECRET=$(grep '^ADMIN_SECRET=' .env | cut -d= -f2-)
curl -sS -X POST http://127.0.0.1:3010/api/admin/create-user \
  -H 'Content-Type: application/json' \
  -H "X-Admin-Secret: $ADMIN_SECRET" \
  --data '{"email":"qa-rotacao@example.com","name":"QA Rotacao"}'
```

Esperado:

- resposta com `"ok": true`
- `email_sent: true` ou `setup_url` de fallback

### 10. Validar webhook

```bash
WEBHOOK_TOKEN=$(grep '^KIWIFY_WEBHOOK_TOKEN=' .env | cut -d= -f2-)
curl -sS -X POST "http://127.0.0.1:3010/api/webhook/kiwify" \
  -H 'Content-Type: application/json' \
  -H "X-Kiwify-Token: $WEBHOOK_TOKEN" \
  --data '{"order_status":"paid","order_id":"qa-rotation-order","Customer":{"email":"qa-webhook-rotation@example.com","full_name":"QA Webhook Rotation"}}'
```

### 11. Validar login

1. Abrir `https://oatelier21.com.br/login`
2. Usar um usuario legado conhecido
3. Confirmar que entra normalmente
4. Criar um usuario novo e confirmar que recebe email com link de ativacao

## Como fazer rollback

Se a API nao subir depois da rotacao:

```bash
cp /var/www/atelier21/shared/.env.backup-TS_AQUI .env
pm2 restart atelier21-api --update-env
```

Se voce trocou o token da Kiwify e esqueceu de atualizar o `.env`, restaure os dois lados para o mesmo valor.

## Checklist Final

- backup do banco criado
- backup do `.env` criado
- `JWT_SECRET` novo aplicado
- `LEGACY_PASSWORD_SECRET` apontando para o JWT antigo
- `ADMIN_SECRET` novo aplicado
- `KIWIFY_WEBHOOK_TOKEN` novo aplicado no `.env` e na Kiwify
- `RESEND_API_KEY` nova aplicada
- PM2 reiniciado
- `health` ok
- backup forcado com sucesso
- login testado
- webhook testado

## Regra Operacional

Nunca cole segredos reais em chat, screenshot, documento publico ou issue.

Se colou, considere o segredo comprometido e rotacione.
