import { useTaxLossHarvesting } from '../hooks/useTaxLossHarvesting';

const formatSmartCurrency = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 100_000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  }
  
  const isNegative = value < 0;
  return `${isNegative ? '-' : ''}$${absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function GainsCards({ 
  preHarvesting, 
  afterHarvesting 
}: { 
  preHarvesting: ReturnType<typeof useTaxLossHarvesting>['preHarvestingGains'];
  afterHarvesting: ReturnType<typeof useTaxLossHarvesting>['afterHarvestingGains'];
}) {
  if (!preHarvesting || !afterHarvesting) return null;

  const preRealised = preHarvesting.realisedCapitalGains;
  const postRealised = afterHarvesting.realisedCapitalGains;
  
  // Calculate savings only if taxes are reduced
  const savings = preRealised > postRealised ? preRealised - postRealised : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-6">
      {/* Pre Harvesting Card */}
      <div className="flex-1 bg-[#1a1a24] text-white p-6 rounded-xl border border-gray-700/50 shadow-xl">
        <h3 className="font-semibold text-lg mb-4">Pre Harvesting</h3>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 text-sm mb-4">
          <div className="text-gray-400"></div>
          <div className="text-right text-gray-400 font-medium">Short-term</div>
          <div className="text-right text-gray-400 font-medium">Long-term</div>
          
          <div className="text-gray-400">Profits</div>
          <div className="text-right">{formatSmartCurrency(preHarvesting.stcg.profits)}</div>
          <div className="text-right">{formatSmartCurrency(preHarvesting.ltcg.profits)}</div>
          
          <div className="text-gray-400">Losses</div>
          <div className="text-right">{formatSmartCurrency(-preHarvesting.stcg.losses)}</div>
          <div className="text-right">{formatSmartCurrency(-preHarvesting.ltcg.losses)}</div>
          
          <div className="text-gray-400 pt-2 border-t border-gray-700/50">Net Capital Gains</div>
          <div className="text-right pt-2 border-t border-gray-700/50">{formatSmartCurrency(preHarvesting.netStcg)}</div>
          <div className="text-right pt-2 border-t border-gray-700/50">{formatSmartCurrency(preHarvesting.netLtcg)}</div>
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
          <div className="font-semibold">Realised Capital Gains:</div>
          <div className="text-xl font-bold">{formatSmartCurrency(preRealised)}</div>
        </div>
      </div>

      {/* After Harvesting Card */}
      <div className="flex-1 bg-[#1877F2] text-white p-6 rounded-xl shadow-[0_0_40px_rgba(24,119,242,0.3)] relative overflow-hidden">
        <h3 className="font-semibold text-lg mb-4 relative z-10">After Harvesting</h3>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 text-sm mb-4 relative z-10">
          <div className="text-blue-200"></div>
          <div className="text-right text-blue-200 font-medium">Short-term</div>
          <div className="text-right text-blue-200 font-medium">Long-term</div>
          
          <div className="text-blue-100">Profits</div>
          <div className="text-right font-medium">{formatSmartCurrency(afterHarvesting.stcg.profits)}</div>
          <div className="text-right font-medium">{formatSmartCurrency(afterHarvesting.ltcg.profits)}</div>
          
          <div className="text-blue-100">Losses</div>
          <div className="text-right font-medium">{formatSmartCurrency(-afterHarvesting.stcg.losses)}</div>
          <div className="text-right font-medium">{formatSmartCurrency(-afterHarvesting.ltcg.losses)}</div>
          
          <div className="text-blue-100 pt-2 border-t border-blue-400/30">Net Capital Gains</div>
          <div className="text-right pt-2 border-t border-blue-400/30 font-medium">{formatSmartCurrency(afterHarvesting.netStcg)}</div>
          <div className="text-right pt-2 border-t border-blue-400/30 font-medium">{formatSmartCurrency(afterHarvesting.netLtcg)}</div>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-400/30 relative z-10">
          <div className="font-semibold text-lg">Effective Capital Gains:</div>
          <div className="text-2xl font-bold">{formatSmartCurrency(postRealised)}</div>
        </div>

        {savings > 0 && (
          <div className="mt-4 bg-[#FF9F1C] text-black font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 z-10 relative">
            <span>🎉</span>
            Your taxable capital gains are reduced by: {formatSmartCurrency(savings)}
          </div>
        )}
        
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>
      </div>
    </div>
  );
}
