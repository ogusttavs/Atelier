import {useDeferredValue, useEffect, useState, type FormEvent} from 'react';
import {
  Activity,
  ArrowLeft,
  Clock3,
  Copy,
  Edit3,
  KeyRound,
  Link2,
  LogOut,
  MailCheck,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onGoToSales: () => void;
}

interface DashboardMetrics {
  activeClients: number;
  activeNowEstimate: number;
  newClients24h: number;
  pendingSetup: number;
  recentLogins24h: number;
  totalClients: number;
}

interface DashboardUser {
  access_status: 'active' | 'inactive';
  created_at: string;
  email: string;
  has_pending_setup: number;
  id: number;
  kiwify_order_id: string | null;
  last_login_at: string | null;
  name: string;
}

interface DashboardResponse {
  generatedAt: string;
  metrics: DashboardMetrics;
  users: DashboardUser[];
}

interface EditableUserForm {
  access_status: 'active' | 'inactive';
  email: string;
  kiwify_order_id: string;
  name: string;
}

interface UserActionResponse {
  email_sent?: boolean;
  error?: string;
  ok?: boolean;
  setup_url?: string;
  user?: DashboardUser;
}

const API_TIMEOUT_MS = 8000;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'gustavosilva585@gmail.com';

const EMPTY_USER_FORM: EditableUserForm = {
  access_status: 'active' as const,
  email: '',
  kiwify_order_id: '',
  name: '',
};

function formatDate(date: string | null): string {
  if (!date) return 'Nunca';

  const parsed = new Date(date.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed);
}

function MetricCard({
  icon: Icon,
  label,
  note,
  value,
}: {
  icon: typeof Users;
  label: string;
  note: string;
  value: number;
}) {
  return (
    <article className="rounded-[28px] border border-[#F0D2D9] bg-white p-5 shadow-[0_24px_60px_-40px_rgba(122,66,77,0.45)]">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2F5] text-[#C85E73]">
          <Icon size={22} />
        </div>
        <span className="text-3xl font-black text-[#4A3338]">{value}</span>
      </div>
      <p className="mt-4 text-sm font-bold text-[#4A3338]">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#70545A]">{note}</p>
    </article>
  );
}

function statusPill(status: DashboardUser['access_status']) {
  return status === 'active'
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-amber-50 text-amber-700';
}

export default function AdminDashboardPage({ onGoToSales }: AdminDashboardPageProps) {
  const [loginCode, setLoginCode] = useState('');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [setupLink, setSetupLink] = useState('');
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [userForm, setUserForm] = useState(EMPTY_USER_FORM);
  const [createForm, setCreateForm] = useState({
    email: '',
    name: '',
    sendInvite: true,
  });
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredUsers = dashboard?.users.filter((user) => {
    if (!deferredSearch) return true;
    return [user.email, user.name, user.kiwify_order_id || '', user.access_status].some((value) =>
      value.toLowerCase().includes(deferredSearch),
    );
  }) || [];

  async function loadDashboard(showSpinner = false) {
    if (showSpinner) setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      if (res.status === 401) {
        setDashboard(null);
        setIsLoading(false);
        return;
      }

      const data = (await res.json()) as DashboardResponse & { error?: string };
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel carregar o painel.');
        setIsLoading(false);
        return;
      }

      setDashboard(data);
    } catch {
      setError('Nao foi possivel carregar o painel agora.');
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadDashboard(true);
  }, []);

  useEffect(() => {
    if (!selectedUser || !dashboard) return;

    const refreshedUser = dashboard.users.find((user) => user.id === selectedUser.id) || null;
    setSelectedUser(refreshedUser);

    if (!refreshedUser) {
      setIsEditorOpen(false);
      return;
    }

    setUserForm({
      access_status: refreshedUser.access_status,
      email: refreshedUser.email,
      kiwify_order_id: refreshedUser.kiwify_order_id || '',
      name: refreshedUser.name,
    });
  }, [dashboard, selectedUser?.id]);

  useEffect(() => {
    if (!dashboard) {
      setIsLiveConnected(false);
      return;
    }

    const stream = new EventSource('/api/admin/dashboard/stream');
    let reconnectTimer: number | null = null;

    stream.addEventListener('dashboard', (event) => {
      const nextDashboard = JSON.parse((event as MessageEvent<string>).data) as DashboardResponse;
      setDashboard(nextDashboard);
      setIsLiveConnected(true);
    });

    stream.addEventListener('ping', () => {
      setIsLiveConnected(true);
    });

    stream.onerror = () => {
      setIsLiveConnected(false);
      stream.close();
      reconnectTimer = window.setTimeout(() => {
        void loadDashboard();
      }, 3000);
    };

    return () => {
      setIsLiveConnected(false);
      stream.close();
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
    };
  }, [Boolean(dashboard)]);

  function openEditor(user: DashboardUser) {
    setSelectedUser(user);
    setUserForm({
      access_status: user.access_status,
      email: user.email,
      kiwify_order_id: user.kiwify_order_id || '',
      name: user.name,
    });
    setSetupLink('');
    setNotice('');
    setError('');
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setSelectedUser(null);
    setIsEditorOpen(false);
    setSetupLink('');
    setUserForm(EMPTY_USER_FORM);
  }

  async function requestLoginCode() {
    setError('');
    setNotice('');

    setIsRequestingCode(true);

    try {
      const res = await fetch('/api/admin/request-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      const data = (await res.json()) as { error?: string; message?: string; ok?: boolean };
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel entrar no painel.');
        setIsRequestingCode(false);
        return;
      }

      setHasSentCode(true);
      setNotice(data.message || `Codigo enviado para ${ADMIN_EMAIL}.`);
    } catch {
      setError('Nao foi possivel enviar o codigo agora.');
    }

    setIsRequestingCode(false);
  }

  async function handleRequestCode(event: FormEvent) {
    event.preventDefault();
    await requestLoginCode();
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!loginCode) {
      setError('Digite o codigo recebido por email.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/verify-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: ADMIN_EMAIL, code: loginCode }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel entrar no painel.');
        setIsSubmitting(false);
        return;
      }

      setLoginCode('');
      await loadDashboard(true);
    } catch {
      setError('Nao foi possivel entrar no painel agora.');
    }

    setIsSubmitting(false);
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/session/logout', {
        method: 'POST',
        credentials: 'include',
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });
    } catch {
      // O estado local e limpo mesmo se a requisicao falhar.
    }

    setDashboard(null);
    setHasSentCode(false);
    setSelectedUser(null);
    setIsEditorOpen(false);
    setLoginCode('');
    setNotice('');
    setError('');
    setSetupLink('');
  }

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSetupLink('');

    if (!createForm.email || !createForm.name) {
      setError('Preencha nome e email para cadastrar manualmente.');
      return;
    }

    setIsCreatingUser(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createForm),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      const data = (await res.json()) as UserActionResponse;
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel cadastrar o cliente.');
        setIsCreatingUser(false);
        return;
      }

      setCreateForm({ email: '', name: '', sendInvite: true });
      setNotice(data.email_sent ? 'Cliente cadastrado e email enviado.' : 'Cliente cadastrado com sucesso.');
      setSetupLink(data.setup_url || '');
      await loadDashboard();
    } catch {
      setError('Nao foi possivel cadastrar o cliente agora.');
    }

    setIsCreatingUser(false);
  }

  async function handleSaveUser(event: FormEvent) {
    event.preventDefault();
    if (!selectedUser) return;

    setError('');
    setNotice('');
    setSetupLink('');
    setIsSavingUser(true);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...userForm,
          kiwify_order_id: userForm.kiwify_order_id || null,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      const data = (await res.json()) as UserActionResponse;
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel salvar as alteracoes.');
        setIsSavingUser(false);
        return;
      }

      setNotice('Cliente atualizado com sucesso.');
      await loadDashboard();
    } catch {
      setError('Nao foi possivel salvar as alteracoes agora.');
    }

    setIsSavingUser(false);
  }

  async function handleResendAccess(user: DashboardUser) {
    setError('');
    setNotice('');
    setSetupLink('');

    try {
      const res = await fetch(`/api/admin/users/${user.id}/resend-access`, {
        method: 'POST',
        credentials: 'include',
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      const data = (await res.json()) as UserActionResponse;
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel reenviar o acesso.');
        return;
      }

      setNotice(data.email_sent ? `Email reenviado para ${user.email}.` : `Link de acesso gerado para ${user.email}.`);
      setSetupLink(data.setup_url || '');
      await loadDashboard();
    } catch {
      setError('Nao foi possivel reenviar o acesso agora.');
    }
  }

  async function handleDeleteUser(user: DashboardUser) {
    const confirmed = window.confirm(`Excluir ${user.email} da base de dados? Essa acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setError('');
    setNotice('');
    setSetupLink('');

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(data.error || 'Nao foi possivel excluir o cliente.');
        return;
      }

      setNotice(`Cliente ${user.email} excluido da base.`);
      if (selectedUser?.id === user.id) {
        closeEditor();
      }
      await loadDashboard();
    } catch {
      setError('Nao foi possivel excluir o cliente agora.');
    }
  }

  async function copySetupLink() {
    if (!setupLink) return;

    try {
      await navigator.clipboard.writeText(setupLink);
      setNotice('Link copiado para a area de transferencia.');
    } catch {
      setError('Nao foi possivel copiar o link agora.');
    }
  }

  if (isLoading && !dashboard) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#FFF0F3_0%,#FFF7F8_40%,#F8ECEF_100%)] px-4 py-12">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center rounded-[32px] border border-white/70 bg-white/85 shadow-[0_30px_90px_-40px_rgba(122,66,77,0.45)]">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#D16075]/25 border-t-[#D16075]" />
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#FFF0F3_0%,#FFF7F8_40%,#F8ECEF_100%)] px-4 py-12 text-[#4A3338]">
        <div className="mx-auto max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_30px_90px_-40px_rgba(122,66,77,0.45)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EBC8D0] bg-[#FFF6F8] px-4 py-2 text-sm font-semibold text-[#A8576A]">
            <ShieldCheck size={16} />
            Painel administrativo
          </div>

          <h1 className="mt-5 text-3xl font-black text-[#4A3338]">Gerencie clientes e acessos</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#70545A]">
            Toda vez que voce quiser entrar, enviamos um codigo temporario para <strong>{ADMIN_EMAIL}</strong>.
          </p>

          <form onSubmit={handleRequestCode} className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-[#F0D2D9] bg-[#FFF8F9] p-4">
              <p className="text-sm font-bold text-[#4A3338]">Email autorizado</p>
              <p className="mt-1 text-sm text-[#70545A]">{ADMIN_EMAIL}</p>
            </div>

            {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            {notice && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

            <button
              type="submit"
              disabled={isRequestingCode}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D16075] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#D16075]/25 transition hover:bg-[#B84D61] disabled:opacity-60"
            >
              <MailCheck size={18} />
              {isRequestingCode ? 'Enviando codigo...' : 'Enviar codigo para meu email'}
            </button>
          </form>

          {hasSentCode && (
            <form onSubmit={handleLogin} className="mt-5 space-y-4 rounded-[28px] border border-[#F0D2D9] bg-white p-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Codigo recebido</label>
                <div className="relative">
                  <KeyRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                  <input
                    type="text"
                    value={loginCode}
                    onChange={(event) => setLoginCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Digite os 6 numeros"
                    className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#4A3338] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3D2A2F] disabled:opacity-60"
                >
                  {isSubmitting ? 'Validando...' : 'Entrar com codigo'}
                </button>
                <button
                  type="button"
                  onClick={() => void requestLoginCode()}
                  className="rounded-2xl border border-[#E5D0D5] bg-white px-5 py-3 text-sm font-semibold text-[#70545A]"
                >
                  Reenviar codigo
                </button>
              </div>
            </form>
          )}

          <button
            type="button"
            onClick={onGoToSales}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#70545A] transition hover:text-[#D16075]"
          >
            <ArrowLeft size={16} />
            Voltar para a pagina principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#FFF0F3_0%,#FFF7F8_40%,#F8ECEF_100%)] px-4 py-6 text-[#4A3338] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_90px_-40px_rgba(122,66,77,0.45)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EBC8D0] bg-[#FFF6F8] px-4 py-2 text-sm font-semibold text-[#A8576A]">
                <ShieldCheck size={16} />
                Painel Atelier 21
              </div>
              <h1 className="mt-4 text-3xl font-black text-[#4A3338] md:text-4xl">Operacao e base de clientes</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#70545A]">
                Ultima atualizacao: {formatDate(dashboard.generatedAt)}. "Ativas agora" considera atividade nos ultimos 15 minutos.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#E9D8DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#70545A]">
                <span className={`h-2.5 w-2.5 rounded-full ${isLiveConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                {isLiveConnected ? 'Visualizacao em tempo real ativa' : 'Reconectando atualizacao em tempo real'}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void loadDashboard(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D4D8] bg-white px-4 py-3 text-sm font-semibold text-[#70545A] transition hover:border-[#D16075]/35 hover:text-[#D16075]"
              >
                <RefreshCcw size={16} />
                Atualizar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A3338] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3D2A2F]"
              >
                <LogOut size={16} />
                Sair do painel
              </button>
            </div>
          </div>

          {(error || notice || setupLink) && (
            <div className="mt-6 space-y-3">
              {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
              {notice && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}
              {setupLink && (
                <div className="rounded-2xl border border-[#EFD5DB] bg-[#FFF8F9] p-4">
                  <p className="text-sm font-bold text-[#4A3338]">Link manual de criacao de senha</p>
                  <p className="mt-1 break-all text-xs leading-relaxed text-[#70545A]">{setupLink}</p>
                  <button
                    type="button"
                    onClick={() => void copySetupLink()}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#E5D0D5] bg-white px-3 py-2 text-xs font-semibold text-[#70545A] transition hover:border-[#D16075]/30 hover:text-[#D16075]"
                  >
                    <Copy size={14} />
                    Copiar link
                  </button>
                </div>
              )}
            </div>
          )}

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard icon={Users} label="Total de clientes" note="Base completa cadastrada na plataforma." value={dashboard.metrics.totalClients} />
            <MetricCard icon={ShieldCheck} label="Acessos ativos" note="Clientes com acesso liberado no momento." value={dashboard.metrics.activeClients} />
            <MetricCard icon={Clock3} label="Ativas agora" note="Estimativa por atividade nos ultimos 15 minutos." value={dashboard.metrics.activeNowEstimate} />
            <MetricCard icon={Activity} label="Novas em 24h" note="Compras e criacoes recentes nas ultimas 24 horas." value={dashboard.metrics.newClients24h} />
            <MetricCard icon={MailCheck} label="Logins em 24h" note="Clientes que entraram na plataforma nas ultimas 24 horas." value={dashboard.metrics.recentLogins24h} />
            <MetricCard icon={KeyRound} label="Pendentes de senha" note="Clientes que ainda nao concluiram a criacao da primeira senha." value={dashboard.metrics.pendingSetup} />
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-[#F0D2D9] bg-white p-5 shadow-[0_24px_60px_-40px_rgba(122,66,77,0.45)] md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#4A3338]">Clientes recentes</h2>
                  <p className="mt-1 text-sm text-[#70545A]">Busque, edite, reenvi e exclua sem sair do celular.</p>
                </div>

                <div className="relative w-full md:max-w-sm">
                  <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por nome, email, pedido ou status"
                    className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:hidden">
                {filteredUsers.map((user) => (
                  <article key={user.id} className="rounded-[24px] border border-[#F3D9DE] bg-[#FFF9FA] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#4A3338]">{user.name}</p>
                        <p className="mt-1 text-xs text-[#70545A]">{user.email}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusPill(user.access_status)}`}>
                        {user.access_status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs text-[#70545A]">
                      <p>Criada em: {formatDate(user.created_at)}</p>
                      <p>Ultimo login: {formatDate(user.last_login_at)}</p>
                      <p>Pedido: {user.kiwify_order_id || 'Nao informado'}</p>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#F0CCD4] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#A8576A]">
                      {user.has_pending_setup ? 'Aguardando criacao de senha' : 'Onboarding concluido'}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor(user)}
                        className="rounded-xl border border-[#E5D0D5] bg-white px-3 py-2 text-xs font-semibold text-[#70545A]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleResendAccess(user)}
                        className="rounded-xl border border-[#E5D0D5] bg-white px-3 py-2 text-xs font-semibold text-[#70545A]"
                      >
                        Reenviar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteUser(user)}
                        className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5 hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#FFF7F8] text-[#70545A]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Cliente</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Criada em</th>
                      <th className="px-4 py-3 font-semibold">Ultimo login</th>
                      <th className="px-4 py-3 font-semibold">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t border-[#F7E8EC] align-top">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-[#4A3338]">{user.name}</div>
                          <div className="mt-1 text-xs text-[#70545A]">{user.email}</div>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#F0CCD4] bg-[#FFF8F9] px-2.5 py-1 text-[11px] font-semibold text-[#A8576A]">
                            {user.has_pending_setup ? 'Aguardando criacao de senha' : 'Onboarding concluido'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusPill(user.access_status)}`}>
                            {user.access_status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#70545A]">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-4 text-[#70545A]">{formatDate(user.last_login_at)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditor(user)}
                              className="inline-flex items-center gap-2 rounded-xl border border-[#E5D0D5] bg-white px-3 py-2 text-xs font-semibold text-[#70545A]"
                            >
                              <Edit3 size={14} />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleResendAccess(user)}
                              className="inline-flex items-center gap-2 rounded-xl border border-[#E5D0D5] bg-white px-3 py-2 text-xs font-semibold text-[#70545A]"
                            >
                              <MailCheck size={14} />
                              Reenviar
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteUser(user)}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                            >
                              <Trash2 size={14} />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <section className="rounded-[28px] border border-[#F0D2D9] bg-white p-5 shadow-[0_24px_60px_-40px_rgba(122,66,77,0.45)] md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EBC8D0] bg-[#FFF6F8] px-3 py-1.5 text-xs font-semibold text-[#A8576A]">
                <UserPlus size={14} />
                Cadastro manual
              </div>
              <h2 className="mt-4 text-xl font-black text-[#4A3338]">Criar cliente direto pelo painel</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#70545A]">
                Use para amigas, parcerias, vendas diretas ou clientes que nao vieram pela Kiwify.
              </p>

              <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Nome</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Nome da cliente"
                    className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Email</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="cliente@email.com"
                    className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                  />
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-[#F0D2D9] bg-[#FFF8F9] px-4 py-3 text-sm text-[#70545A]">
                  <input
                    type="checkbox"
                    checked={createForm.sendInvite}
                    onChange={(event) => setCreateForm((current) => ({ ...current, sendInvite: event.target.checked }))}
                    className="mt-0.5 h-4 w-4 rounded border-[#D7B9C1] text-[#D16075] focus:ring-[#D16075]"
                  />
                  <span>Enviar o email de acesso automaticamente assim que eu cadastrar.</span>
                </label>

                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D16075] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#D16075]/25 transition hover:bg-[#B84D61] disabled:opacity-60"
                >
                  <UserPlus size={18} />
                  {isCreatingUser ? 'Cadastrando...' : 'Cadastrar cliente'}
                </button>
              </form>
            </section>
          </section>
        </div>
      </div>

      {isEditorOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#2E1C21]/50 backdrop-blur-sm">
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[32px] border border-white/60 bg-white p-5 shadow-[0_-24px_80px_-30px_rgba(74,51,56,0.65)] md:inset-auto md:right-6 md:top-6 md:w-[32rem] md:rounded-[32px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#EBC8D0] bg-[#FFF6F8] px-3 py-1.5 text-xs font-semibold text-[#A8576A]">
                  <Edit3 size={14} />
                  Editar cliente
                </div>
                <h2 className="mt-4 text-2xl font-black text-[#4A3338]">{selectedUser.name}</h2>
                <p className="mt-1 text-sm text-[#70545A]">{selectedUser.email}</p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5D0D5] bg-white text-[#70545A]"
                aria-label="Fechar editor"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Nome</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Pedido Kiwify</label>
                <input
                  type="text"
                  value={userForm.kiwify_order_id}
                  onChange={(event) => setUserForm((current) => ({ ...current, kiwify_order_id: event.target.value }))}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Status</label>
                <select
                  value={userForm.access_status}
                  onChange={(event) =>
                    setUserForm((current) => ({
                      ...current,
                      access_status: event.target.value as 'active' | 'inactive',
                    }))
                  }
                  className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#D16075] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#D16075]/20 transition hover:bg-[#B84D61] disabled:opacity-60"
                >
                  <ShieldCheck size={16} />
                  {isSavingUser ? 'Salvando...' : 'Salvar alteracoes'}
                </button>
                <button
                  type="button"
                  onClick={() => void handleResendAccess(selectedUser)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#E5D0D5] bg-white px-4 py-3 text-sm font-semibold text-[#70545A]"
                >
                  <MailCheck size={16} />
                  Reenviar acesso
                </button>
              </div>
            </form>

            <div className="mt-6 rounded-[24px] border border-[#F0D2D9] bg-[#FFF8F9] p-4">
              <p className="text-sm font-bold text-[#4A3338]">Informacoes rapidas</p>
              <div className="mt-3 grid gap-2 text-sm text-[#70545A]">
                <p>Ultimo login: {formatDate(selectedUser.last_login_at)}</p>
                <p>Cadastro: {formatDate(selectedUser.created_at)}</p>
                <p>Pedido: {selectedUser.kiwify_order_id || 'Nao informado'}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleDeleteUser(selectedUser)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                >
                  <Trash2 size={16} />
                  Excluir da base
                </button>
                {setupLink && (
                  <button
                    type="button"
                    onClick={() => void copySetupLink()}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#E5D0D5] bg-white px-4 py-2.5 text-sm font-semibold text-[#70545A]"
                  >
                    <Link2 size={16} />
                    Copiar ultimo link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
