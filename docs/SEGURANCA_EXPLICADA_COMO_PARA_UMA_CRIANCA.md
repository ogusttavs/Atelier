# Seguranca Explicada Como Para Uma Crianca

Imagina que o Atelier 21 e uma casinha.

Dentro dessa casinha tem uma caixa muito importante: o banco de dados.

Nessa caixa ficam os nomes das pessoas, os emails e quem pode entrar na area de membros.

Nosso trabalho e fazer tres coisas:

1. impedir que pessoas erradas entrem
2. impedir que a caixa suma
3. conseguir recuperar a caixa se der problema

## Como a casinha esta protegida hoje

### 1. A porta da frente usa HTTPS

Isso e como mandar cartas dentro de um envelope fechado.

Quando alguem entra em `https://oatelier21.com.br`, a conversa vai protegida no caminho.

### 2. A chave do usuario nao fica jogada na mesa

Antes, era mais facil deixar a sessao em um lugar que o navegador conseguia ler.

Agora a sessao fica em um cookie `HttpOnly`.

Traduzindo:

- o navegador carrega a chave
- mas o JavaScript da pagina nao consegue pegar essa chave facilmente

Isso ajuda a proteger a conta se algum script malicioso tentar roubar a sessao.

### 3. Senha nova nao vai mais por email

Antes, a pessoa podia receber a senha pronta por email.

Agora ela recebe um link especial para criar a propria senha.

Esse link:

- vale por pouco tempo
- e de uso unico

Isso e melhor do que mandar a senha pronta por mensagem.

### 4. As senhas ficam embaralhadas

O sistema nao guarda a senha pura.

Ele guarda uma versao embaralhada usando `scrypt`.

E como guardar a sombra da chave em vez da chave real.

Se alguem abrir o banco, nao deveria enxergar a senha verdadeira.

### 5. O banco mora fora da pasta do site

O banco principal fica em:

`/var/www/atelier21/shared/atelier21.db`

Isso ajuda porque o banco nao fica misturado com os arquivos do deploy.

Assim, atualizar o site nao deveria apagar a base.

### 6. O banco faz copias de seguranca

Existe backup manual e backup automatico.

Hoje o projeto tem:

- backup manual quando voce quiser
- backup automatico por `cron`
- verificacao de integridade do backup

Ou seja:

- a copia e criada
- depois o sistema confere se a copia nao quebrou

### 7. O admin fica mais escondido

Hoje o painel administrativo nao depende mais de uma senha fixa visivel.

Quando alguem autorizado quer entrar:

- pede um codigo
- esse codigo vai para o email administrativo
- o codigo dura pouco tempo

Isso e como uma chave que aparece so por alguns minutos e depois some.

As rotas tecnicas de admin ainda usam um segredo proprio e aceitam IPs permitidos.

Na pratica, e como ter uma porta separada com senha extra.

### 8. O webhook tambem tem senha

Quando a Kiwify fala com o sistema, ela manda um token secreto.

Se o token estiver errado, o sistema rejeita.

Isso evita que qualquer pessoa finja que fez uma compra.

### 9. A API tem limite de tentativas

Se alguem tentar forcar login ou bater demais em certas rotas, o sistema comeca a bloquear.

Isso e como um porteiro falando:

"Voce ja tentou demais por agora. Volte depois."

### 10. O servidor tambem usa regras de seguranca

Hoje a aplicacao esta atras do Nginx e roda no PM2.

O servidor responde por HTTPS e a API interna fica na porta local.

Isso e melhor do que deixar tudo aberto para a internet sem filtro.

### 11. O suporte oficial agora tem caixa de email propria

O suporte humano oficial ficou em:

`suporte@oatelier21.com.br`

Isso ajuda porque:

- a cliente sabe exatamente para onde pedir ajuda
- os emails automáticos podem responder para esse endereco
- o atendimento humano fica separado do envio tecnico do sistema

## O que esta mais importante hoje

As duas coisas mais importantes agora sao:

- nao perder o banco
- nao vazar segredos

Por isso, a regra pratica e:

- sempre fazer backup antes de mexer
- nunca colar segredo real em chat, print ou documento publico
- sempre rotacionar um segredo se ele vazou

## O que ainda nao significa

Seguranca boa nao significa "impossivel de invadir".

Significa:

- reduzir muito o risco
- diminuir o estrago se algo der errado
- recuperar rapido

## Resumo em uma frase

Hoje o Atelier 21 esta mais parecido com uma casa com:

- porta trancada
- chave escondida
- copia da chave guardada
- campainha com senha
- e uma caixa importante guardada em lugar separado

Isso ja e muito melhor do que deixar tudo aberto.
