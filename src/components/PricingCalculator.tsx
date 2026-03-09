import { useState } from 'react';
import { Calculator, Plus, Trash2, DollarSign, Percent, Package } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  cost: number;
  quantityBought: number;
  quantityUsed: number;
}

export default function PricingCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Leite Condensado', cost: 6.50, quantityBought: 395, quantityUsed: 395 },
    { id: '2', name: 'Chocolate Nobre', cost: 45.00, quantityBought: 1000, quantityUsed: 250 },
  ]);
  const [packagingCost, setPackagingCost] = useState(5.00);
  const [laborHours, setLaborHours] = useState(1);
  const [hourlyRate, setHourlyRate] = useState(15.00);
  const [fixedCostsPercent, setFixedCostsPercent] = useState(10);
  const [profitMargin, setProfitMargin] = useState(30);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', cost: 0, quantityBought: 1, quantityUsed: 1 }
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(i => {
      if (i.id === id) {
        return { ...i, [field]: typeof value === 'string' ? value : Number(value) };
      }
      return i;
    }));
  };

  // Calculations
  const totalIngredientsCost = ingredients.reduce((total, ing) => {
    const costPerUnit = ing.cost / (ing.quantityBought || 1);
    return total + (costPerUnit * ing.quantityUsed);
  }, 0);

  const laborCost = laborHours * hourlyRate;
  const directCost = totalIngredientsCost + packagingCost + laborCost;
  
  const percentageToSubtract = (fixedCostsPercent + profitMargin) / 100;
  const safePercentage = percentageToSubtract >= 1 ? 0.99 : percentageToSubtract;
  const suggestedPrice = directCost / (1 - safePercentage);
  
  const profitValue = suggestedPrice * (profitMargin / 100);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-12 border border-[#E295A3]/20">
      <div className="mb-8 sm:mb-10 border-b border-[#E295A3]/20 pb-6 sm:pb-8">
        <span className="inline-block py-1 px-3 rounded-full bg-[#E295A3]/20 text-[#A8576A] font-semibold text-xs mb-4 uppercase tracking-wider">
          Módulo 2
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4A3338] mb-4 flex items-center gap-3">
          <Calculator className="text-[#D16075]" size={32} /> Planilha de Precificação
        </h1>
        <p className="text-base sm:text-lg text-[#70545A]">Calcule exatamente quanto cobrar para nunca mais ter prejuízo.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Ingredients */}
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h2 className="text-xl font-bold text-[#4A3338]">1. Ingredientes</h2>
              <button 
                onClick={addIngredient}
                className="flex items-center justify-center gap-1 text-sm bg-[#FFF5F7] text-[#A8576A] px-4 py-2 rounded-lg hover:bg-[#E295A3]/20 transition-colors font-medium border border-[#E295A3]/30"
              >
                <Plus size={16} /> Adicionar Ingrediente
              </button>
            </div>
            
            <div className="space-y-4">
              {ingredients.map((ing) => (
                <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                  <div className="sm:col-span-4">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">Nome do Ingrediente</label>
                    <input 
                      type="text" 
                      value={ing.name}
                      onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none"
                      placeholder="Ex: Chocolate"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:col-span-7 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Preço (R$)</label>
                      <input 
                        type="number" 
                        value={ing.cost || ''}
                        onChange={(e) => updateIngredient(ing.id, 'cost', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Qtd. Comprada</label>
                      <input 
                        type="number" 
                        value={ing.quantityBought || ''}
                        onChange={(e) => updateIngredient(ing.id, 'quantityBought', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Qtd. Usada</label>
                      <input 
                        type="number" 
                        value={ing.quantityUsed || ''}
                        onChange={(e) => updateIngredient(ing.id, 'quantityUsed', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 sm:static sm:col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeIngredient(ing.id)}
                      className="text-red-400 hover:text-red-600 p-2 bg-white sm:bg-transparent rounded-full shadow-sm sm:shadow-none border sm:border-none border-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Packaging & Labor */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#4A3338]">2. Embalagem & Mão de Obra</h2>
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4A3338] mb-2">
                    <Package size={16} className="text-[#D16075]" /> Custo da Embalagem (R$)
                  </label>
                  <input 
                    type="number" 
                    value={packagingCost || ''}
                    onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#D16075] outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Horas gastas</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={laborHours || ''}
                      onChange={(e) => setLaborHours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D16075] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Sua Hora (R$)</label>
                    <input 
                      type="number" 
                      value={hourlyRate || ''}
                      onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D16075] outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Margins */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#4A3338]">3. Margens</h2>
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4A3338] mb-2">
                    <Percent size={16} className="text-[#D16075]" /> Custos Fixos (%)
                  </label>
                  <p className="text-[10px] text-gray-500 mb-2">Água, luz, gás, internet (Geralmente 10% a 15%)</p>
                  <input 
                    type="number" 
                    value={fixedCostsPercent || ''}
                    onChange={(e) => setFixedCostsPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#D16075] outline-none"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4A3338] mb-2">
                    <DollarSign size={16} className="text-[#D16075]" /> Margem de Lucro (%)
                  </label>
                  <p className="text-[10px] text-gray-500 mb-2">O que sobra limpo para você (Geralmente 20% a 40%)</p>
                  <input 
                    type="number" 
                    value={profitMargin || ''}
                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#D16075] outline-none"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#4A3338] text-white p-6 sm:p-8 rounded-3xl sticky top-8 shadow-2xl border border-[#D16075]/20">
            <h2 className="text-xl font-bold mb-6 border-b border-[#5E4249] pb-4 text-[#E295A3]">Resumo do Produto</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Ingredientes:</span>
                <span className="font-medium">R$ {totalIngredientsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Embalagem:</span>
                <span className="font-medium">R$ {packagingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Mão de Obra:</span>
                <span className="font-medium">R$ {laborCost.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-[#5E4249] flex justify-between font-bold text-[#E295A3]">
                <span>Custo Direto Total:</span>
                <span>R$ {directCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#5E4249] p-6 rounded-2xl mb-6 shadow-inner">
              <p className="text-xs text-gray-300 mb-2 font-medium uppercase tracking-wider text-center">Preço de Venda Sugerido</p>
              <p className="text-4xl font-extrabold text-center text-[#D16075]">
                R$ {suggestedPrice.toFixed(2)}
              </p>
            </div>

            <div className="bg-green-900/40 border border-green-500/30 p-4 rounded-xl text-center">
              <p className="text-xs text-green-200 mb-1">Seu Lucro Líquido por unidade:</p>
              <p className="text-2xl font-bold text-green-400">R$ {profitValue.toFixed(2)}</p>
            </div>
            
            <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
              *O preço sugerido já cobre todos os seus custos, paga sua hora de trabalho e garante a margem de lucro escolhida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
