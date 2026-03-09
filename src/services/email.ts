interface WelcomeEmailInput {
  name: string;
  password: string;
  to: string;
}

interface EmailResult {
  error?: string;
  sent: boolean;
}

function getEmailProvider(): string {
  return (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
}

function getLoginUrl(): string {
  if (process.env.APP_LOGIN_URL) return process.env.APP_LOGIN_URL;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${frontendUrl.replace(/\/+$/, '')}/login`;
}

export async function sendWelcomeEmail({ to, name, password }: WelcomeEmailInput): Promise<EmailResult> {
  const emailProvider = getEmailProvider();
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
  const loginUrl = getLoginUrl();

  if (emailProvider !== 'resend') {
    return {
      sent: false,
      error: `EMAIL_PROVIDER '${emailProvider}' não é suportado neste projeto.`,
    };
  }

  if (!resendApiKey || !resendFromEmail) {
    return {
      sent: false,
      error: 'RESEND_API_KEY e RESEND_FROM_EMAIL/EMAIL_FROM precisam estar configurados.',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [to],
      subject: 'Seu acesso à Operação Páscoa Lucrativa chegou!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #4A3338; line-height: 1.6;">
          <h1 style="margin-bottom: 8px;">Seu acesso chegou</h1>
          <p>Oi, ${name}!</p>
          <p>Sua compra foi aprovada e seu acesso à <strong>Operação Páscoa Lucrativa</strong> já está liberado.</p>
          <p><strong>Email:</strong> ${to}<br /><strong>Senha:</strong> ${password}</p>
          <p>
            <a href="${loginUrl}" style="display: inline-block; padding: 12px 18px; background: #D16075; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Entrar na Área de Membros
            </a>
          </p>
          <p>Se preferir, copie este link: ${loginUrl}</p>
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
