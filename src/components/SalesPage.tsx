import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  Gift,
  LogIn,
  MessageCircle,
  Rabbit,
  ShieldCheck,
  Star,
  TrendingUp,
} from 'lucide-react';

interface SalesPageProps {
  onBuy: () => void;
  onAccessMember?: () => void;
  onPreloadLogin?: () => void;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1587241321921-91a834d6d191?q=70&w=1200&auto=format&fit=crop';
const OFFER_IMAGE =
  'https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?q=70&w=1280&auto=format&fit=crop';

const METHOD_PILLARS = [
  {
    description:
      'Em vez de sair testando qualquer receita e comprando insumo no escuro, você passa a olhar para um cardápio com clássicos de alta saída e produtos visuais que já chamam atenção.',
    icon: BookOpen,
    points: ['10 receitas clássicas testadas', '5 queridinhos do TikTok com apelo visual forte', 'Menos achismo e mais clareza no que colocar para vender'],
    step: 'Passo 1',
    title: 'Escolha um cardápio sem se sentir perdida',
  },
  {
    description:
      'O produto não para na receita. Ele entra exatamente na parte que mais dá frio na barriga: passar preço sem medo de pagar para trabalhar.',
    icon: Calculator,
    points: ['Calculadora interativa de custos', 'Preço, margem e lucro em um só lugar', 'Menos medo de cobrar errado'],
    step: 'Passo 2',
    title: 'Precifique sem sair no prejuízo',
  },
  {
    description:
      'Depois do produto e do preço, você entra na execução comercial para abrir as encomendas com mais direção e menos improviso nesta Páscoa.',
    icon: TrendingUp,
    points: ['Estratégias para abrir a campanha', 'Uso mais prático de WhatsApp e Instagram', 'Bônus de continuidade para depois da data sazonal'],
    step: 'Passo 3',
    title: 'Abra as vendas sem travar na hora H',
  },
] satisfies Array<{
  description: string;
  icon: typeof BookOpen;
  points: string[];
  step: string;
  title: string;
}>;

const MODULES = [
  {
    accent: 'Para parar de adivinhar',
    description:
      'Receitas pensadas para te tirar da confusão de “o que eu faço?” e te ajudar a montar uma oferta de Páscoa com mais confiança e mais desejo do público.',
    highlights: ['10 receitas clássicas testadas de alta saída', '5 queridinhos do TikTok com apelo visual forte', 'Preço, custo, lucro, margem e dica de apresentação'],
    icon: BookOpen,
    title: 'Módulo 1 • O que vender',
  },
  {
    accent: 'Para parar de cobrar no chute',
    description:
      'Uma etapa prática para tirar da frente o medo de cobrar errado, perder dinheiro ou trabalhar muito e quase não ver retorno.',
    highlights: ['Calculadora interativa de precificação', 'Custos, embalagem, mão de obra e margem', 'Mais segurança para falar preço'],
    icon: Calculator,
    title: 'Módulo 2 • Como precificar',
  },
  {
    accent: 'Para parar de postar sem direção',
    description:
      'O bloco comercial entra para transformar a Páscoa no seu primeiro ciclo de campanha com mais clareza, sem depender só de coragem e inspiração.',
    highlights: ['Foco principal em estratégias de Páscoa', 'WhatsApp, abertura de agenda e escassez', 'Bônus de continuidade para depois da sazonalidade'],
    icon: TrendingUp,
    title: 'Módulo 3 • Como vender',
  },
] satisfies Array<{
  accent: string;
  description: string;
  highlights: string[];
  icon: typeof BookOpen;
  title: string;
}>;

const STARTER_REASONS = [
  {
    icon: Star,
    title: 'Você não quer só aprender. Você quer fazer dinheiro nesta data.',
    text: 'A força dessa oferta está em conversar com uma urgência real: usar a Páscoa para entrar dinheiro e sentir que a cozinha pode virar renda.',
  },
  {
    icon: Clock,
    title: 'O medo não é só vender pouco. É trabalhar e quase não sobrar nada.',
    text: 'A parte de precificação fala diretamente com uma dor muito prática: cobrar no chute, se desgastar e descobrir tarde demais que o lucro era pequeno.',
  },
  {
    icon: MessageCircle,
    title: 'Você quer abrir encomendas sem se sentir perdida.',
    text: 'A oferta conversa com quem sente vontade de vender, mas ainda não consegue enxergar com clareza o que vender, quanto cobrar e como abrir a campanha.',
  },
] satisfies Array<{
  icon: typeof Star;
  text: string;
  title: string;
}>;

const FAQ_ITEMS = [
  {
    answer:
      'Sim. A proposta foi organizada exatamente para quem está começando do zero e sente medo de errar no cardápio, no preço ou na hora de vender.',
    question: 'E se eu estiver começando do zero e morrendo de medo de errar?',
  },
  {
    answer:
      'Por isso existe a calculadora de precificação. O produto não entrega só receita bonita: ele entra no ponto mais sensível para quem quer vender e não quer pagar para trabalhar.',
    question: 'E se o meu maior medo for cobrar barato e sair no prejuízo?',
  },
  {
    answer:
      'Sim. O produto também conversa com quem já faz doces, mas continua travando na parte comercial: preço, abertura de agenda, WhatsApp e campanha de Páscoa.',
    question: 'Eu já faço doces, mas travo na venda. Isso ainda faz sentido para mim?',
  },
  {
    answer:
      'Você recebe as três frentes principais do produto: um cardápio com 10 receitas clássicas testadas e 5 queridinhos do TikTok, uma calculadora de precificação e um bloco de execução de vendas. A ideia é te tirar da sensação de estar sozinha tentando montar tudo no improviso.',
    question: 'Vou receber só receitas ou algo que me ajude a vender também?',
  },
  {
    answer:
      'O foco principal é a campanha de Páscoa. O módulo de vendas ainda traz bônus de continuidade, mas a promessa central continua sendo te ajudar nesta sazonalidade com mais clareza.',
    question: 'O produto é focado só na Páscoa?',
  },
  {
    answer: 'Sim. A oferta comunica 7 dias de garantia, compra segura e acesso vitalício e imediato.',
    question: 'Se eu entrar agora, tenho garantia e acesso imediato?',
  },
] satisfies Array<{
  answer: string;
  question: string;
}>;

export default function SalesPage({ onBuy, onAccessMember, onPreloadLogin }: SalesPageProps) {
  return (
    <div className="w-full">
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left reveal-up">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-sm mb-6 uppercase tracking-wider">
              <Rabbit size={16} className="text-[#D16075]" /> Atelier 21 • Operação Páscoa Lucrativa
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4A3338] tracking-tight mb-4 leading-tight">
              Se nesta Páscoa você quer <span className="text-[#D16075]">fazer dinheiro com doces</span>, mas trava no cardápio, no preço e na venda, essa operação foi feita para você
            </h1>
            <h2 className="text-lg sm:text-xl font-semibold text-[#70545A] mb-6 leading-relaxed">
              Para quem olha para a Páscoa como chance real de entrar dinheiro, mas sente medo de comprar ingredientes no escuro, cobrar no chute e postar sem transformar isso em encomenda.
              Aqui você entra com um mapa mais claro:
              <strong className="text-[#D16075]"> 10 receitas clássicas testadas + 5 queridinhos do TikTok</strong>, uma
              <strong className="text-[#D16075]"> calculadora de precificação</strong> e um
              <strong className="text-[#D16075]"> plano de execução para abrir encomendas</strong>.
            </h2>

            <div className="inline-block bg-[#FFF5F7] border-2 border-[#D16075]/30 rounded-2xl px-6 py-3 mb-6 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-[#D16075] flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                Apenas R$ 49,90
                <span className="text-sm sm:text-base font-bold text-[#A8576A] bg-[#E295A3]/20 px-3 py-1 rounded-full">
                  Acesso Vitalício
                </span>
              </p>
            </div>

            <ul className="space-y-3 mb-8 text-left max-w-xl mx-auto lg:mx-0">
              <li className="flex items-start gap-3 text-[#70545A]">
                <CheckCircle2 size={20} className="text-[#D16075] shrink-0 mt-0.5" />
                <span>Para não gastar com ingrediente em receita aleatória e continuar sem saber se aposta no clássico ou no que está chamando atenção agora.</span>
              </li>
              <li className="flex items-start gap-3 text-[#70545A]">
                <CheckCircle2 size={20} className="text-[#D16075] shrink-0 mt-0.5" />
                <span>Para não cobrar no chute e descobrir depois que trabalhou muito para quase não ver dinheiro.</span>
              </li>
              <li className="flex items-start gap-3 text-[#70545A]">
                <CheckCircle2 size={20} className="text-[#D16075] shrink-0 mt-0.5" />
                <span>Para não ver a data chegando sem se sentir pronta para abrir as encomendas com confiança.</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button
                onClick={onBuy}
                className="w-full sm:w-auto px-8 py-4 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#D16075]/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Quero montar minha Páscoa com clareza <ArrowRight size={20} />
              </button>

              {onAccessMember && (
                <button
                  onClick={onAccessMember}
                  onMouseEnter={onPreloadLogin}
                  onFocus={onPreloadLogin}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-[#D16075]/25 bg-white/80 hover:bg-white text-[#A8576A] rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Entrar <LogIn size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="relative hidden sm:block reveal-up" style={{ animationDelay: '120ms' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E295A3]/40 to-transparent rounded-full blur-3xl -z-10 transform scale-110" />
            <img
              src={HERO_IMAGE}
              alt="Ovos de Páscoa Artesanais"
              className="rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
              width="1200"
              height="1500"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              sizes="(min-width: 1024px) 42rem, 100vw"
              referrerPolicy="no-referrer"
            />
            <div
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#FFF5F7] flex items-center gap-3 animate-bounce"
              style={{ animationDuration: '3s' }}
            >
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Janela natural de venda</p>
                <p className="text-sm font-bold text-[#4A3338]">Use a Páscoa para validar com mais contexto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E295A3]/20 deferred-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-12">Se você se reconhece em um desses cenários, essa página foi escrita para falar com você</h2>

          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F7] rounded-full flex items-center justify-center mb-4 text-[#D16075]">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#4A3338] mb-2">Iniciantes do Zero</h3>
              <p className="text-sm text-[#70545A]">Você quer aproveitar a data para fazer renda, mas ainda sente que qualquer erro no cardápio ou no preço pode te travar antes mesmo da primeira venda.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F7] rounded-full flex items-center justify-center mb-4 text-[#D16075]">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#4A3338] mb-2">Mães e Donas de Casa</h3>
              <p className="text-sm text-[#70545A]">Você quer usar a cozinha de casa para fazer dinheiro sem sair de perto da família, mas precisa de algo mais direto do que continuar tentando sozinha.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F7] rounded-full flex items-center justify-center mb-4 text-[#D16075]">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#4A3338] mb-2">Confeiteiras Travadas</h3>
              <p className="text-sm text-[#70545A]">Você já faz doces, mas ainda sente que trabalha muito, cobra com insegurança e não transforma sua produção em uma campanha mais organizada.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8 deferred-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-4">Você não precisa passar mais uma Páscoa tentando descobrir tudo sozinha</h2>
            <p className="text-lg text-[#70545A] max-w-3xl mx-auto">
              A lógica do produto é simples: primeiro você para a confusão sobre o que vender, depois ganha segurança para passar o preço e só então entra na parte de execução comercial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {METHOD_PILLARS.map(({ description, icon: Icon, points, step, title }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-8 border border-[#E295A3]/30 shadow-xl shadow-[#4A3338]/5"
              >
                <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-xs uppercase tracking-wider mb-5">
                  {step}
                </span>
                <div className="w-14 h-14 bg-[#FFF5F7] rounded-2xl flex items-center justify-center mb-6 text-[#D16075]">
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#4A3338] mb-4">{title}</h3>
                <p className="text-[#70545A] mb-6">{description}</p>
                <ul className="space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-[#4A3338]">
                      <CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#4A3338] text-[#FFF5F7] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden deferred-section">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D16075] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E295A3] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">Talvez a sua maior trava não seja fazer doce. Seja transformar isso em dinheiro.</h2>
          <p className="text-lg text-[#E295A3] mb-12 max-w-2xl mx-auto">
            Muita gente tem vontade, mas a data chega junto com medo, correria e sensação de não saber por onde começar.
          </p>

          <div className="bg-[#5E4249] p-8 rounded-3xl text-left border border-[#D16075]/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">Se isso passa pela sua cabeça, o produto foi montado para falar com essa dor:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#D16075] font-bold text-xl">1.</span>
                <p className="text-gray-300"><strong>"Eu pesquiso, pesquiso e continuo sem decidir."</strong> Você se perde em tanta receita e não sabe o que realmente vale entrar no seu cardápio.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D16075] font-bold text-xl">2.</span>
                <p className="text-gray-300"><strong>"Tenho medo de vender e ainda assim sair no prejuízo."</strong> Sem clareza de custo, você cobra barato demais ou trava na hora de dizer o preço.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D16075] font-bold text-xl">3.</span>
                <p className="text-gray-300"><strong>"Eu posto, mas não sinto que sei vender de verdade."</strong> Você até tenta divulgar, mas não sente que está abrindo uma campanha com começo, meio e fechamento.</p>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-[#D16075]/20 rounded-xl border border-[#D16075]/30">
              <p className="text-white font-medium text-center">
                A Operação Páscoa Lucrativa foi organizada para te tirar justamente dessa sequência de travas: produto, preço e venda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto deferred-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-4">Veja o que existe dentro da área de membros</h2>
          <p className="text-lg text-[#70545A] max-w-3xl mx-auto">
            Em vez de uma promessa vaga, aqui você consegue enxergar o que recebe, como cada bloco se conecta e onde está o valor da oferta.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#FFF5F7] border border-[#E295A3]/25 rounded-3xl p-8 shadow-sm">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 text-[#D16075] border border-[#E295A3]/25">
              <Star size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#4A3338] mb-3">10 receitas clássicas testadas</h3>
            <p className="text-[#70545A] mb-5">
              Aqui entram os produtos de saída mais segura para quem quer vender com mais confiança: sabores conhecidos, alta aceitação e mais previsibilidade comercial.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#4A3338]">
                <CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" />
                <span>Receitas que ajudam a montar a base do cardápio</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]">
                <CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" />
                <span>Mais segurança para quem não quer depender só de tendência</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]">
                <CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" />
                <span>Base mais estável para começar a campanha</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#4A3338] border border-[#D16075]/20 rounded-3xl p-8 shadow-sm text-white">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-5 text-[#E295A3] border border-white/10">
              <Gift size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">5 queridinhos do TikTok</h3>
            <p className="text-gray-300 mb-5">
              Além dos clássicos, você também vê receitas com apelo visual forte e cara de novidade, para usar o que já chama atenção nas redes a seu favor.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#E295A3] shrink-0 mt-0.5" />
                <span>Produtos mais fotogênicos e compartilháveis</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#E295A3] shrink-0 mt-0.5" />
                <span>Reforço de desejo para quem compra pelo visual</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-[#E295A3] shrink-0 mt-0.5" />
                <span>Mais munição para Stories, Reels e catálogo</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MODULES.map(({ accent, description, highlights, icon: Icon, title }) => (
            <div
              key={title}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-[#4A3338]/5 border border-[#E295A3]/30 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="inline-flex px-3 py-1 rounded-full bg-[#FFF5F7] text-[#A8576A] text-xs font-bold uppercase tracking-wider mb-5">
                {accent}
              </div>
              <div className="w-14 h-14 bg-[#FFF5F7] rounded-2xl flex items-center justify-center mb-6 text-[#D16075]">
                <Icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#4A3338] mb-4">{title}</h3>
              <p className="text-[#70545A] mb-6">{description}</p>
              <ul className="space-y-3">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-[#4A3338]">
                    <CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#FFF5F7] border border-[#E295A3]/25 rounded-3xl p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-bold text-[#4A3338] mb-3">Você não precisa aplicar tudo de uma vez</h3>
          <p className="text-[#70545A] mb-6 max-w-3xl mx-auto">
            Primeiro você usa a Páscoa como validação com mais foco. Depois, se fizer sentido, entra nos bônus de continuidade.
          </p>
          <button
            onClick={onBuy}
            className="w-full sm:w-auto px-8 py-4 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#D16075]/30 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            Quero entrar com esse plano <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E295A3]/20 deferred-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-4">Talvez o que você queira não seja só aprender a fazer doce</h2>
            <p className="text-lg text-[#70545A] max-w-3xl mx-auto">
              O público deste produto normalmente não busca só receita. Busca clareza, segurança para cobrar e uma chance real de ver dinheiro entrar nesta data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STARTER_REASONS.map(({ icon: Icon, text, title }) => (
              <div
                key={title}
                className="rounded-3xl border border-[#E295A3]/25 bg-[#FFF5F7] p-8 shadow-sm"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 text-[#D16075] border border-[#E295A3]/25">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#4A3338] mb-3">{title}</h3>
                <p className="text-[#70545A]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF5F7] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E295A3]/30 deferred-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-4">Perguntas frequentes antes de entrar</h2>
            <p className="text-lg text-[#70545A]">
              Esta é a parte da página que ajuda a destravar as dúvidas e medos mais comuns antes da compra.
            </p>
          </div>

          <div className="grid gap-4">
            {FAQ_ITEMS.map(({ answer, question }) => (
              <div
                key={question}
                className="bg-white rounded-3xl border border-[#E295A3]/25 p-6 sm:p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[#4A3338] mb-3">{question}</h3>
                <p className="text-[#70545A] leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF5F7] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E295A3]/30 deferred-section">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#D16075]/20 relative">
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src={OFFER_IMAGE}
              alt="Coelhinhos e Doces de Páscoa"
              className="w-full h-full object-cover"
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 48rem, 100vw"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="p-8 sm:p-12 text-center -mt-12 relative z-10">
            <h2 className="text-3xl font-bold text-[#4A3338] mb-2">Entre agora para parar de vender no improviso nesta Páscoa</h2>
            <p className="text-[#70545A] mb-8">
              Você entra com um caminho mais claro para decidir o cardápio, passar o preço com mais segurança e abrir as encomendas com mais confiança.
            </p>

            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-2xl text-gray-400 line-through font-medium">R$ 197,00</span>
              <span className="text-5xl font-extrabold text-[#D16075]">R$ 49,90</span>
            </div>

            <button
              onClick={onBuy}
              className="w-full sm:w-auto px-12 py-5 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-xl shadow-xl shadow-[#D16075]/30 transition-all transform hover:scale-105 mb-6"
            >
              Quero acessar a Operação agora
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-[#A8576A]">
              <ShieldCheck size={18} />
              <span>Compra 100% Segura • Acesso Vitalício e Imediato • 7 Dias de Garantia</span>
            </div>
          </div>
        </div>
      </section>

      {onAccessMember && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#4A3338]">
          <div className="max-w-3xl mx-auto text-center">
            <button
              onClick={onAccessMember}
              onMouseEnter={onPreloadLogin}
              onFocus={onPreloadLogin}
              className="inline-flex items-center gap-2 text-[#E295A3] hover:text-white font-semibold transition-colors text-sm"
            >
              <LogIn size={18} /> Já é aluno(a)? Acesse a Área de Membros
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
