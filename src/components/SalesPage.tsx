import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, TrendingUp, Calculator, BookOpen, Clock, ShieldCheck, Heart, Star, Gift, Rabbit, LogIn } from 'lucide-react';

interface SalesPageProps {
  onBuy: () => void;
  onAccessMember?: () => void;
}

export default function SalesPage({ onBuy, onAccessMember }: SalesPageProps) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-sm mb-6 uppercase tracking-wider">
              <Rabbit size={16} className="text-[#D16075]" /> Atelier 21 • Operação Páscoa Lucrativa
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4A3338] tracking-tight mb-4 leading-tight">
              Domine o <span className="text-[#D16075]">Cardápio, a Precificação e as Vendas</span> nesta Páscoa!
            </h1>
            <h2 className="text-lg sm:text-xl font-semibold text-[#70545A] mb-6 leading-relaxed">
              O passo a passo definitivo para quem <strong className="text-[#D16075]">já vende doces</strong> e para quem <strong className="text-[#D16075]">vai começar do zero</strong>.
            </h2>

            <div className="inline-block bg-[#FFF5F7] border-2 border-[#D16075]/30 rounded-2xl px-6 py-3 mb-8 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-[#D16075] flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                Apenas R$ 49,90
                <span className="text-sm sm:text-base font-bold text-[#A8576A] bg-[#E295A3]/20 px-3 py-1 rounded-full">
                  Acesso Vitalício
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button
                onClick={onBuy}
                className="w-full sm:w-auto px-8 py-4 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#D16075]/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Garantir Meu Acesso Vitalício <ArrowRight size={20} />
              </button>

              {onAccessMember && (
                <button
                  onClick={onAccessMember}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-[#D16075]/25 bg-white/80 hover:bg-white text-[#A8576A] rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Entrar <LogIn size={20} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden sm:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E295A3]/40 to-transparent rounded-full blur-3xl -z-10 transform scale-110"></div>
            <img
              src="https://images.unsplash.com/photo-1587241321921-91a834d6d191?q=80&w=2070&auto=format&fit=crop"
              alt="Ovos de Páscoa Artesanais"
              className="rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#FFF5F7] flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Oportunidade</p>
                <p className="text-sm font-bold text-[#4A3338]">A época mais lucrativa do ano</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E295A3]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-12">Para quem é a Operação Páscoa Lucrativa?</h2>

          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F7] rounded-full flex items-center justify-center mb-4 text-[#D16075]">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#4A3338] mb-2">Iniciantes do Zero</h3>
              <p className="text-sm text-[#70545A]">Para quem precisa de dinheiro rápido, nunca fez um ovo de Páscoa, mas tem força de vontade para aprender e aplicar na cozinha de casa.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F7] rounded-full flex items-center justify-center mb-4 text-[#D16075]">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#4A3338] mb-2">Mães e Donas de Casa</h3>
              <p className="text-sm text-[#70545A]">Para quem quer fazer uma renda extra sem precisar sair de perto dos filhos, aproveitando o tempo livre de forma inteligente.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F7] rounded-full flex items-center justify-center mb-4 text-[#D16075]">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#4A3338] mb-2">Confeiteiras Travadas</h3>
              <p className="text-sm text-[#70545A]">Para quem já faz doces, mas tem dificuldade em precificar, não sabe vender e acaba trabalhando muito para não ver a cor do dinheiro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Atelier 21 */}
      <section className="bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-[#FFF5F7] rounded-3xl p-8 sm:p-12 border border-[#E295A3]/30 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D16075] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E295A3] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

          <div className="w-20 h-20 bg-[#FFF5F7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#E295A3]/20 relative z-10">
            <Rabbit size={40} className="text-[#D16075]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-6 relative z-10">Por que "Atelier 21"? 🐰</h2>
          <p className="text-lg text-[#70545A] leading-relaxed mb-4 relative z-10">
            O mercado mudou. Vender doces hoje não é mais como antigamente. O <strong>Atelier 21</strong> nasceu com um único propósito: te ensinar a fazer e vender doces no <strong>século 21</strong>.
          </p>
          <p className="text-lg text-[#70545A] leading-relaxed relative z-10">
            Chega de depender apenas do boca a boca ou de postar fotos que ninguém interage. Nós unimos a confeitaria artesanal com as estratégias de vendas mais modernas da atualidade. E para inaugurar nossa metodologia, preparamos este material 100% focado na época mais lucrativa do ano: a <strong>Páscoa</strong>! 🍫✨
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-[#4A3338] text-[#FFF5F7] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D16075] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E295A3] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">A Páscoa está chegando. Você vai apenas gastar ou vai lucrar?</h2>
          <p className="text-lg text-[#E295A3] mb-12 max-w-2xl mx-auto">
            Enquanto a maioria das pessoas se endivida comprando ovos caríssimos no supermercado, mulheres espertas estão usando a cozinha de casa para faturar alto.
          </p>

          <div className="bg-[#5E4249] p-8 rounded-3xl text-left border border-[#D16075]/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">O que te impede de começar hoje?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#D16075] font-bold text-xl">1.</span>
                <p className="text-gray-300"><strong>"Não sei o que fazer:"</strong> Você fica perdida com tantas receitas e não sabe o que realmente vende e dá lucro.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D16075] font-bold text-xl">2.</span>
                <p className="text-gray-300"><strong>"Tenho medo de ter prejuízo:"</strong> Sem saber calcular os custos, você cobra barato demais e acaba pagando para trabalhar.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D16075] font-bold text-xl">3.</span>
                <p className="text-gray-300"><strong>"Não sei vender:"</strong> Você tem vergonha de oferecer ou não sabe como atrair clientes nas redes sociais e no seu bairro.</p>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-[#D16075]/20 rounded-xl border border-[#D16075]/30">
              <p className="text-white font-medium text-center">
                A Operação Páscoa Lucrativa resolve exatamente esses 3 problemas. Eu te dou o mapa completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution / Deliverables */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3338] mb-4">O que você vai receber na Operação Páscoa Lucrativa</h2>
          <p className="text-lg text-[#70545A]">Tudo mastigado e pronto para aplicar. Sem enrolação.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Deliverable 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-[#4A3338]/5 border border-[#E295A3]/30"
          >
            <div className="w-14 h-14 bg-[#FFF5F7] rounded-2xl flex items-center justify-center mb-6 text-[#D16075]">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#4A3338] mb-4">Guia: O que vender na Páscoa?</h3>
            <p className="text-[#70545A] mb-6">Pare de adivinhar. Descubra os produtos mais fáceis de fazer, que têm a maior margem de lucro e vendem muito rápido.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Ovos de colher lucrativos</li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Lembrancinhas baratas que vendem em volume</li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Como montar um cardápio irresistível</li>
            </ul>
          </motion.div>

          {/* Deliverable 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-[#4A3338]/5 border border-[#D16075] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#D16075] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">O SEGREDO DO LUCRO</div>
            <div className="w-14 h-14 bg-[#FFF5F7] rounded-2xl flex items-center justify-center mb-6 text-[#D16075]">
              <Calculator size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#4A3338] mb-4">Planilha de Precificação Automática</h3>
            <p className="text-[#70545A] mb-6">Uma ferramenta simples onde você coloca o preço dos ingredientes e ela te dá o preço de venda exato. Nunca mais tenha prejuízo.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Serve para qualquer doce o ano todo</li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Calcula custo de embalagem e sua hora</li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Mostra o lucro líquido real no seu bolso</li>
            </ul>
          </motion.div>

          {/* Deliverable 3 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-[#4A3338]/5 border border-[#E295A3]/30"
          >
            <div className="w-14 h-14 bg-[#FFF5F7] rounded-2xl flex items-center justify-center mb-6 text-[#D16075]">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#4A3338] mb-4">Manual de Vendas: 20 Estratégias</h3>
            <p className="text-[#70545A] mb-6">O passo a passo de como atrair clientes, perder a vergonha e fechar vendas todos os dias pelo WhatsApp e Instagram.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> 10 Estratégias Focadas na Páscoa</li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> 10 Estratégias Gerais (Para o ano todo)</li>
              <li className="flex items-start gap-2 text-sm text-[#4A3338]"><CheckCircle2 size={18} className="text-[#D16075] shrink-0 mt-0.5" /> Táticas para vender no seu bairro</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Offer / Pricing */}
      <section className="bg-[#FFF5F7] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E295A3]/30">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#D16075]/20 relative">

          {/* Decorative Image inside Offer */}
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?q=80&w=2012&auto=format&fit=crop"
              alt="Coelhinhos e Doces de Páscoa"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          <div className="p-8 sm:p-12 text-center -mt-12 relative z-10">
            <h2 className="text-3xl font-bold text-[#4A3338] mb-2">Comece a Lucrar Hoje</h2>
            <p className="text-[#70545A] mb-8">O investimento que se paga com a venda do seu primeiro ovo de Páscoa.</p>

            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-2xl text-gray-400 line-through font-medium">R$ 197,00</span>
              <span className="text-5xl font-extrabold text-[#D16075]">R$ 49,90</span>
            </div>

            <button
              onClick={onBuy}
              className="w-full sm:w-auto px-12 py-5 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-xl shadow-xl shadow-[#D16075]/30 transition-all transform hover:scale-105 mb-6"
            >
              Comprar Agora e Acessar a Operação
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-[#A8576A]">
              <ShieldCheck size={18} />
              <span>Compra 100% Segura • Acesso Vitalício e Imediato • 7 Dias de Garantia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Already a member? */}
      {onAccessMember && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#4A3338]">
          <div className="max-w-3xl mx-auto text-center">
            <button
              onClick={onAccessMember}
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
