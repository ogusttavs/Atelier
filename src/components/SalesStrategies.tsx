import {useState} from 'react';
import {
  Calendar,
  Camera,
  Clock,
  Download,
  Gift,
  Megaphone,
  MessageCircle,
  Package,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Zap,
} from 'lucide-react';
import StrategyCard, {Strategy} from './StrategyCard';

const easterStrategies: Strategy[] = [
  {
    icon: <TrendingUp />,
    title: '1. Fluxo de Conversão Direta',
    desc: 'Uma oferta simples, uma pagina clara e um CTA principal para levar a decisao sem labirinto.',
    steps: [
      'Use a oferta principal da Pascoa como centro da campanha: cardapio validado, precificacao e execucao comercial em um unico produto.',
      'Concentre o trafego do conteudo e das conversas na pagina de vendas ou no checkout, sem criar muitos caminhos paralelos.',
      'Repita a mesma promessa central em pagina, stories e WhatsApp: escolher o que vender, quanto cobrar e como abrir as encomendas.',
      'Deixe a decisao simples: mostre o que a pessoa recebe, para quem serve e por que isso ajuda nesta Pascoa.',
      'Acompanhe as duvidas que mais se repetem e transforme essas duvidas em novos blocos de pagina, FAQ e mensagens de reforco.',
    ],
  },
  {
    icon: <MessageCircle />,
    title: '2. Apoio de Fechamento no WhatsApp',
    desc: 'Leve para o WhatsApp quem demonstrou interesse, pediu informacao ou travou antes de comprar.',
    steps: [
      'Use o WhatsApp como canal de apoio para quem clicou, respondeu story ou pediu detalhes da oferta.',
      'Comece a conversa retomando a dor principal da pessoa, em vez de despejar informacao demais logo no inicio.',
      'Envie uma mensagem curta explicando a estrutura da oferta e o proximo passo para entrar.',
      'Responda objecoes recorrentes com clareza: comecar do zero, medo de cobrar errado e trava para vender.',
      'Faca follow-up com quem demonstrou interesse e sumiu, sempre puxando para a decisao dentro da janela sazonal.',
    ],
  },
  {
    icon: <Smartphone />,
    title: '3. Stories de Conversão e Engajamento',
    desc: 'Use stories para bastidor, interacao, demonstracao e chamada direta para a agenda de Pascoa.',
    steps: [
      'Mostre bastidores do cardapio, testes, embalagens e calculos para aumentar percepcao de realidade e movimento.',
      'Use enquete, caixa de pergunta e reacao para puxar a audiencia para perto da oferta.',
      'Alterne stories de atencao com stories de demonstracao: produto, lucro, embalagem e organizacao da campanha.',
      'Inclua chamadas diretas para o link ou para o WhatsApp ao longo da sequencia, sem esperar so o ultimo story.',
      'Salve nos destaques as sequencias que explicam o cardapio, a precificacao e a abertura das encomendas.',
    ],
  },
  {
    icon: <Camera />,
    title: '4. Reels Problema x Solução',
    desc: 'Crie conteudo curto que mostre a dor do publico e conecte o produto como saida pratica.',
    steps: [
      'Escolha um problema real por video: nao saber o que vender, cobrar no chute ou postar sem vender.',
      'Abra o Reel mostrando o problema de forma visual ou verbal logo nos primeiros segundos.',
      'Apresente uma solucao simples conectada ao produto: classico de saida, calculo de preco ou execucao da campanha.',
      'Feche com uma chamada clara para a pagina, para o WhatsApp ou para acompanhar a abertura das encomendas.',
      'Repita esse formato com variacoes durante toda a campanha para acumular reconhecimento da oferta.',
    ],
  },
  {
    icon: <Zap />,
    title: '5. Trends com Função Comercial',
    desc: 'Use trends para chamar atencao, mas sempre puxando o publico de volta para a oferta principal.',
    steps: [
      'Escolha trends que combinem com produtos visuais e com a identidade do publico que voce quer atrair.',
      'Use o trend como gancho, nao como promessa principal do negocio.',
      'Conecte o conteudo ao mix do cardapio: classicos para seguranca comercial e produtos visuais para gerar desejo.',
      'Finalize o Reel ou a legenda apontando o proximo passo: reservar, entrar na lista ou acessar a oferta.',
      'Evite produzir trend solta sem ponte comercial; toda atencao precisa voltar para a campanha de Pascoa.',
    ],
  },
  {
    icon: <Calendar />,
    title: '6. Linha Editorial da Campanha',
    desc: 'Repita poucos pilares com consistencia ate a abertura e o fechamento das encomendas.',
    steps: [
      'Organize a comunicacao em tres pilares: o que vender, quanto cobrar e como abrir encomendas.',
      'Crie variacoes de conteudo dentro desses pilares em vez de falar de muitos temas desconectados.',
      'Use os classicos para falar de seguranca comercial e os queridinhos do TikTok para falar de desejo visual.',
      'Distribua os temas entre feed, Reels, stories e mensagens, mantendo a promessa central sempre igual.',
      'Na reta final, concentre a maior parte das pecas na abertura, no fechamento e na urgencia natural da data.',
    ],
  },
  {
    icon: <Megaphone />,
    title: '7. Quebra de Objeções na Comunicação',
    desc: 'Antecipe os medos que travam a compra e responda isso na pagina, nos stories e nas mensagens.',
    steps: [
      'Mapeie as objecoes principais do publico: comecar do zero, medo de prejuizo, inseguranca comercial e falta de organizacao.',
      'Transforme cada objecao em um bloco da pagina de vendas, um story e uma resposta curta de WhatsApp.',
      'Mostre que a oferta nao entrega so receita: entrega cardapio, calculo de preco e execucao.',
      'Use linguagem direta e humana, falando da situacao real da pessoa em vez de um discurso generico.',
      'Revise a FAQ e as mensagens sempre que uma nova objecao comecar a se repetir.',
    ],
  },
  {
    icon: <Gift />,
    title: '8. Pico de Vendas na Reta Final',
    desc: 'Conforme a data se aproxima, aumente a frequencia e a urgencia natural sem inventar escassez falsa.',
    steps: [
      'Avise com clareza quando a agenda abriu, quando os primeiros pedidos entram e quando a capacidade comeca a apertar.',
      'Publique lembretes mais frequentes em stories, WhatsApp e pagina conforme a janela de compra encurta.',
      'Use urgencia natural da sazonalidade: data limite, producao limitada e encerramento das encomendas.',
      'Retome os produtos mais fortes do cardapio e as objecoes que ainda seguram a decisao.',
      'Feche a campanha com CTA claro e acompanhamento curto com quem demonstrou interesse perto do prazo.',
    ],
  },
];

const bonusStrategies: Strategy[] = [
  {
    icon: <ShoppingBag />,
    title: '1. Order Bump Sazonal',
    desc: 'Depois que a oferta principal estiver validada, adicione um complemento simples e coerente no checkout.',
    steps: [
      'Pense primeiro na oferta principal; o order bump so entra depois que a conversao principal estiver clara.',
      'Escolha um complemento pequeno e logico para a compra, sem roubar a atencao do produto principal.',
      'Mantenha o bump simples, barato e facil de entender no momento da decisao.',
      'Teste o bump como aumento de ticket, nao como nova promessa central do negocio.',
      'Se ainda nao existir um ativo complementar forte, nao force essa etapa agora.',
    ],
  },
  {
    icon: <Package />,
    title: '2. Upsell Pos-Compra',
    desc: 'O proximo passo da cliente precisa parecer continuacao natural da compra principal.',
    steps: [
      'Ofereca o upsell somente depois que a compra principal estiver concluida.',
      'O produto seguinte deve aprofundar ou expandir o resultado prometido, nao mudar completamente o assunto.',
      'Mantenha a oferta do upsell conectada ao momento da cliente depois da Pascoa.',
      'Teste mensagens curtas e diretas para apresentar esse proximo passo.',
      'Se a cliente ainda estiver validando a primeira campanha, preserve a simplicidade antes de empilhar ofertas.',
    ],
  },
  {
    icon: <Clock />,
    title: '3. Continuidade Pos-Pascoa',
    desc: 'Use compradoras e interessadas da Pascoa como base para novas ofertas depois da sazonalidade.',
    steps: [
      'Registre quem comprou, quem pediu informacao e quem interagiu durante a campanha.',
      'Depois da Pascoa, retome essa base com uma oferta coerente de continuidade, nao com um salto aleatorio.',
      'Aproveite o aprendizado do cardapio, do preco e da comunicacao para decidir o que permanece o ano todo.',
      'Use mensagens, stories e conteudo para transicionar da sazonalidade para um produto mais continuo.',
      'Trate a Pascoa como primeira validacao comercial, nao como ponto final do relacionamento.',
    ],
  },
  {
    icon: <TrendingUp />,
    title: '4. Modelo Perpetuo com Pico Sazonal',
    desc: 'Para comecar, o mais seguro e manter a oferta simples e usar datas fortes como aceleradores naturais.',
    steps: [
      'Nao complique o negocio logo no inicio com muitos formatos e promessas paralelas.',
      'Use a estrutura perpetua simples como base e a sazonalidade como pico natural de demanda.',
      'Revise a oferta depois da Pascoa com base no que vendeu, no que travou e nas objecoes mais frequentes.',
      'So depois dessa validacao faz sentido decidir se vale expandir com novos produtos ou novas datas.',
      'Mantenha a promessa central coerente: clareza para vender, precificar e executar.',
    ],
  },
];

export default function SalesStrategies() {
  const [activeTab, setActiveTab] = useState<'easter' | 'bonus'>('easter');

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="strategies-content">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-[#E295A3]/20">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-[#E295A3]/20 pb-6 mb-6">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-xs mb-4 uppercase tracking-wider">
              Módulo 3
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4A3338] mb-3 flex items-center gap-3">
              <TrendingUp className="text-[#D16075]" size={32} /> Execução comercial VTSD
            </h1>
            <p className="text-base sm:text-lg text-[#70545A]">
              Frentes VTSD organizadas para esta Pascoa e proximos passos opcionais. Primeiro valide a campanha sazonal; depois pense em bump, upsell e continuidade.
            </p>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-3 bg-[#4A3338] text-white rounded-xl font-semibold text-sm hover:bg-[#5E4249] transition-colors shrink-0 shadow-md print:hidden"
          >
            <Download size={18} /> Baixar em PDF
          </button>
        </div>

        <div className="bg-[#FFF5F7] p-4 rounded-xl border border-[#E295A3]/20 print:hidden">
          <p className="text-sm text-[#70545A]">
            💡 <strong>Clique em cada frente</strong> para ver como aplicar no produto.
            Comece pela aba <strong>"Foco nesta Pascoa"</strong> e deixe os proximos passos para depois da primeira validacao.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E295A3]/20 p-2 flex gap-2 print:hidden">
        <button
          onClick={() => setActiveTab('easter')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all text-center ${
            activeTab === 'easter' ? 'bg-[#D16075] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          🐰 Foco nesta Páscoa
        </button>
        <button
          onClick={() => setActiveTab('bonus')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all text-center ${
            activeTab === 'bonus' ? 'bg-[#A8576A] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          📈 Próximos passos
        </button>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        {(activeTab === 'easter' ? easterStrategies : bonusStrategies).map((strategy, index) => (
          <StrategyCard key={index} strategy={strategy} index={index} variant={activeTab} />
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#4A3338] to-[#5E4249] text-white p-6 sm:p-8 rounded-2xl shadow-lg print:hidden">
        <h3 className="text-xl font-bold mb-3 text-[#E295A3]">🎯 Ordem recomendada para validar esta primeira campanha</h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          Nao tente aplicar tudo de uma vez. Primeiro valide a campanha de Pascoa com <strong className="text-white">3 frentes</strong> e deixe bump, upsell e continuidade para depois.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold mb-1">1ª frente</p>
            <p className="text-gray-300">Pagina mais clara + fluxo de conversao direta para facilitar a decisao.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold mb-1">2ª frente</p>
            <p className="text-gray-300">Stories, Reels e WhatsApp trabalhando juntos para aquecer e fechar.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold mb-1">3ª frente</p>
            <p className="text-gray-300">Quebra de objecoes e pico de vendas conforme a data se aproxima.</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          #strategies-content {
            padding: 0 !important;
            gap: 8px !important;
          }
          #strategies-content > div {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  );
}
