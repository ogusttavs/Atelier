import {useState} from 'react';
import {ChevronDown, Clock, DollarSign, ExternalLink, Flame, Package, Rocket, Star, TrendingUp} from 'lucide-react';

export interface Recipe {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  prepTime: string;
  trend?: '🔥' | '🚀' | '⭐';
  trendLabel?: string;
  avgPrice: string;
  estimatedCost: string;
  profit: string;
  margin: string;
  packagingTip: string;
  youtubeQuery: string;
  tiktokQuery: string;
  youtubeVideoId?: string;
  image?: string;
  ingredients: string[];
  steps: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  variant?: 'classic' | 'tiktok';
}

function YouTubeIcon({size = 18}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function TikTokIcon({size = 18}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.84 4.84 0 01-1-.07z" />
    </svg>
  );
}

export default function RecipeCard({recipe, index, variant = 'classic'}: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=70&w=640&auto=format&fit=crop';
  const recipeImage = recipe.image || fallbackImage;

  const isTikTok = variant === 'tiktok';

  const trendIcon =
    recipe.trend === '🚀' ? <Rocket size={14} className="text-blue-500" /> :
    recipe.trend === '🔥' ? <Flame size={14} className="text-orange-500" /> :
    <Star size={14} className="text-yellow-500" />;

  const difficultyColor =
    recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
    recipe.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
    'bg-red-100 text-red-700';

  const numberBg = isTikTok
    ? 'bg-gradient-to-br from-[#010101] to-[#EE1D52]'
    : 'bg-[#D16075]';
  const borderColor = isTikTok ? 'border-[#EE1D52]/25' : 'border-[#E295A3]/20';
  const hoverBg = isTikTok ? 'hover:bg-[#EE1D52]/5' : 'hover:bg-[#FFF5F7]/50';

  return (
    <div
      className={`bg-white rounded-2xl border ${borderColor} overflow-hidden shadow-sm hover:shadow-lg transition-shadow reveal-up`}
      style={{animationDelay: `${index * 50}ms`}}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left p-4 sm:p-5 flex items-start gap-3 sm:gap-4 ${hoverBg} transition-colors`}
      >
        <img
          src={recipeImage}
          alt={recipe.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-gray-100"
          width="160"
          height="160"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        <div className={`w-8 h-8 ${numberBg} text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 mt-0.5`}>
          {recipe.id}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm sm:text-base font-bold text-[#4A3338] leading-snug">{recipe.name}</h3>
            {recipe.trend && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#FFF5F7] px-2 py-0.5 rounded-full border border-[#E295A3]/30">
                {trendIcon} {recipe.trendLabel}
              </span>
            )}
          </div>

          <p className="text-xs text-[#70545A] mb-2 leading-snug">{recipe.subtitle}</p>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
              {recipe.difficulty}
            </span>
            <span className="text-[10px] text-[#70545A] flex items-center gap-1">
              <Clock size={11} /> {recipe.prepTime}
            </span>
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              <DollarSign size={12} /> {recipe.profit}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            <span className="font-bold text-[#D16075] bg-[#FFF5F7] px-2 py-0.5 rounded-full">
              Venda: {recipe.avgPrice}
            </span>
            <span className="text-[#A8576A] bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              Custo: {recipe.estimatedCost}
            </span>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`text-[#A8576A] shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="overflow-hidden fade-in">
          <div className="px-4 sm:px-6 pb-6 space-y-5 border-t border-[#E295A3]/10">
            <div className="pt-4">
              <p className="text-sm text-[#70545A] leading-relaxed">{recipe.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FFF5F7] p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#A8576A] font-medium uppercase tracking-wider mb-1">Custo Médio</p>
                <p className="text-base font-bold text-[#4A3338]">{recipe.estimatedCost}</p>
              </div>
              <div className="bg-[#FFF5F7] p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#A8576A] font-medium uppercase tracking-wider mb-1">Preço de Venda</p>
                <p className="text-base font-bold text-[#D16075]">{recipe.avgPrice}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-center">
                <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider mb-1">Lucro Médio</p>
                <p className="text-base font-bold text-green-600">{recipe.profit}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-center">
                <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider mb-1">Margem</p>
                <p className="text-base font-bold text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp size={14} /> {recipe.margin}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#4A3338] mb-3 flex items-center gap-2">
                🎬 Tutorial em Vídeo
              </h4>

              {recipe.youtubeVideoId && (
                <div className="relative w-full rounded-xl overflow-hidden bg-black mb-3" style={{paddingBottom: '56.25%'}}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${recipe.youtubeVideoId}?rel=0&modestbranding=1`}
                    title={`Tutorial: ${recipe.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors group"
                >
                  <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                    <YouTubeIcon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-red-700 leading-tight">
                      {recipe.youtubeVideoId ? 'Mais vídeos' : 'Ver no YouTube'}
                    </p>
                    <p className="text-[10px] text-red-400">Pesquisar no YouTube</p>
                  </div>
                  <ExternalLink size={12} className="text-red-300 shrink-0 ml-auto group-hover:text-red-500" />
                </a>

                <a
                  href={`https://www.tiktok.com/search?q=${encodeURIComponent(recipe.tiktokQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shrink-0">
                    <TikTokIcon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 leading-tight">Ver no TikTok</p>
                    <p className="text-[10px] text-gray-400">Pesquisar no TikTok</p>
                  </div>
                  <ExternalLink size={12} className="text-gray-300 shrink-0 ml-auto group-hover:text-gray-500" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#4A3338] mb-3">📋 Ingredientes Principais</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#70545A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D16075] shrink-0" />
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#4A3338] mb-3">👩‍🍳 Passo a Passo</h4>
              <div className="space-y-2">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#70545A]">
                    <span className="w-6 h-6 bg-[#D16075]/10 text-[#D16075] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#4A3338] text-white p-4 rounded-xl">
              <p className="text-xs font-semibold text-[#E295A3] mb-1 flex items-center gap-1">
                <Package size={13} /> Dica de Embalagem
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{recipe.packagingTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
