interface AccessEmailInput {
  mode: 'recovery' | 'welcome';
  name: string;
  setupUrl: string;
  to: string;
}

interface EmailResult {
  error?: string;
  sent: boolean;
}

interface AdminLoginEmailInput {
  code: string;
  to: string;
}

function getEmailProvider(): string {
  return (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function extractSupportEmailAddress(): string {
  const raw = process.env.SUPPORT_EMAIL || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'acesso@oatelier21.com.br';
  const match = raw.match(/<([^>]+)>/);
  return match?.[1] || raw;
}

function buildEmailCopy(mode: AccessEmailInput['mode']) {
  const supportEmail = extractSupportEmailAddress();

  if (mode === 'recovery') {
    return {
      intro: 'Recebemos um pedido para reenviar o seu acesso ao Atelier 21.',
      ctaLabel: 'Criar minha nova senha',
      outro:
        'Use esse mesmo link para criar uma nova senha e entrar na sua area de membros.',
      steps: [
        'Clique no botao abaixo.',
        'Crie sua nova senha.',
        'Entre na area de membros com o mesmo email da compra.',
      ],
      subject: 'Seu novo link de acesso ao Atelier 21',
      supportEmail,
      thanks:
        'Se voce nao pediu esse reenvio, pode ignorar este email com seguranca.',
      title: 'Seu acesso foi reenviado',
    };
  }

  return {
    intro: 'Sua compra foi aprovada e seu acesso a Operacao Pascoa Lucrativa ja esta sendo preparado.',
    ctaLabel: 'Definir minha senha',
    outro:
      'Assim que criar sua senha, voce ja pode entrar na area de membros e comecar.',
    steps: [
      'Clique no botao abaixo para definir sua senha.',
      'Use o mesmo email da compra para entrar.',
      'Acesse a area de membros e comece pelo primeiro modulo.',
    ],
    subject: 'Compra aprovada! Seu acesso ao Atelier 21 chegou',
    supportEmail,
    thanks:
      'Obrigada pela confianca. Estou feliz em te acompanhar nessa Pascoa.',
    title: 'Seu acesso chegou',
  };
}

async function sendAccessEmail({ mode, to, name, setupUrl }: AccessEmailInput): Promise<EmailResult> {
  const emailProvider = getEmailProvider();
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;

  if (emailProvider !== 'resend') {
    return {
      sent: false,
      error: `EMAIL_PROVIDER '${emailProvider}' nao e suportado neste projeto.`,
    };
  }

  if (!resendApiKey || !resendFromEmail) {
    return {
      sent: false,
      error: 'RESEND_API_KEY e RESEND_FROM_EMAIL/EMAIL_FROM precisam estar configurados.',
    };
  }

  const safeName = escapeHtml(name);
  const safeSetupUrl = escapeHtml(setupUrl);
  const safeEmail = escapeHtml(to);
  const copy = buildEmailCopy(mode);
  const stepsHtml = copy.steps
    .map((step) => `<li style="margin: 0 0 8px;">${escapeHtml(step)}</li>`)
    .join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [to],
      subject: copy.subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #4A3338; line-height: 1.6; max-width: 640px; margin: 0 auto;">
          <h1 style="margin-bottom: 8px;">${copy.title}</h1>
          <p>Oi, ${safeName}!</p>
          <p>${copy.intro}</p>
          <p><strong>Email da compra:</strong> ${safeEmail}</p>

          <div style="background: #FFF5F7; border: 1px solid #E9C5CD; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <p style="margin-top: 0; font-weight: bold;">Passo a passo:</p>
            <ol style="padding-left: 18px; margin-bottom: 0;">
              ${stepsHtml}
            </ol>
          </div>

          <p>
            <a href="${safeSetupUrl}" style="display: inline-block; padding: 12px 18px; background: #D16075; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ${copy.ctaLabel}
            </a>
          </p>

          <p>${copy.outro}</p>
          <p>Esse link expira em 24 horas e pode ser usado apenas para voce.</p>
          <p>Se preferir, copie este link: ${safeSetupUrl}</p>
          <p>${copy.thanks}</p>
          <p style="margin-bottom: 0;">Se precisar de ajuda, responda este email ou fale com a gente em <strong>${escapeHtml(copy.supportEmail)}</strong>.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    return {
      sent: false,
      error: await response.text(),
    };
  }

  return { sent: true };
}

export function sendWelcomeEmail(input: Omit<AccessEmailInput, 'mode'>): Promise<EmailResult> {
  return sendAccessEmail({ ...input, mode: 'welcome' });
}

export function sendRecoveryEmail(input: Omit<AccessEmailInput, 'mode'>): Promise<EmailResult> {
  return sendAccessEmail({ ...input, mode: 'recovery' });
}

export async function sendAdminLoginCodeEmail({ code, to }: AdminLoginEmailInput): Promise<EmailResult> {
  const emailProvider = getEmailProvider();
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;

  if (emailProvider !== 'resend') {
    return {
      sent: false,
      error: `EMAIL_PROVIDER '${emailProvider}' nao e suportado neste projeto.`,
    };
  }

  if (!resendApiKey || !resendFromEmail) {
    return {
      sent: false,
      error: 'RESEND_API_KEY e RESEND_FROM_EMAIL/EMAIL_FROM precisam estar configurados.',
    };
  }

  const safeCode = escapeHtml(code);
  const safeEmail = escapeHtml(to);
  const supportEmail = escapeHtml(extractSupportEmailAddress());

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [to],
      subject: 'Seu codigo de acesso ao painel Atelier 21',
      html: `
        <div style="font-family: Arial, sans-serif; color: #4A3338; line-height: 1.6; max-width: 640px; margin: 0 auto;">
          <h1 style="margin-bottom: 8px;">Codigo de acesso ao painel</h1>
          <p>Recebemos um pedido para entrar no painel administrativo do Atelier 21.</p>
          <p><strong>Email autorizado:</strong> ${safeEmail}</p>
          <div style="background: #FFF5F7; border: 1px solid #E9C5CD; border-radius: 14px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 8px; font-size: 13px;">Use este codigo nos proximos 10 minutos:</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 6px;">${safeCode}</p>
          </div>
          <p>Se voce nao pediu esse codigo, pode ignorar este email.</p>
          <p style="margin-bottom: 0;">Se precisar de ajuda, fale com a gente em <strong>${supportEmail}</strong>.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    return {
      sent: false,
      error: await response.text(),
    };
  }

  return { sent: true };
}
