import { useTaxLossHarvesting } from '../hooks/useTaxLossHarvesting';
import { cn } from '../lib/utils';
import { useState } from 'react';

const formatCompact = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(value);
};

const formatExact = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const Tooltip = ({ content, children }: { content: string, children: React.ReactNode }) => {
  return (
    <div className="relative group inline-flex justify-end">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-white text-black text-[10px] font-medium rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-white"></div>
      </div>
    </div>
  );
};

const GainValue = ({ value }: { value: number }) => {
  const isNegative = value < 0;
  const colorClass = isNegative ? 'text-red-500' : 'text-green-500';
  let formatted = formatCompact(value);
  if (!isNegative && value > 0) {
    formatted = '+' + formatted;
  }
  
  const exactFormatted = formatExact(value);
  const exactWithSign = (!isNegative && value > 0) ? '+' + exactFormatted : exactFormatted;

  return (
    <Tooltip content={exactWithSign}>
      <span className={colorClass + " cursor-default"}>
        {formatted}
      </span>
    </Tooltip>
  );
};

const PriceValue = ({ value }: { value: number }) => {
  return (
    <Tooltip content={formatExact(value)}>
      <span className="cursor-default">{formatCompact(value)}</span>
    </Tooltip>
  );
};

const CustomCheckbox = ({ state, onChange }: { state: 'unchecked' | 'checked' | 'partial', onChange: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={cn(
      "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors flex-shrink-0",
      state !== 'unchecked' ? "bg-blue-600 border-blue-600" : "bg-transparent border-gray-500 hover:border-gray-400"
    )}
  >
    {state === 'checked' && (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    )}
    {state === 'partial' && (
      <div className="w-2 h-[2px] bg-white rounded-full"></div>
    )}
  </div>
);

type SortField = 'coinName' | 'totalHolding' | 'currentValue' | 'stcg' | 'ltcg';
type SortDirection = 'asc' | 'desc';

export function HoldingsTable({
  holdings,
  selectedCoins,
  toggleCoinSelection,
  toggleAll
}: {
  holdings: ReturnType<typeof useTaxLossHarvesting>['holdings'];
  selectedCoins: ReturnType<typeof useTaxLossHarvesting>['selectedCoins'];
  toggleCoinSelection: ReturnType<typeof useTaxLossHarvesting>['toggleCoinSelection'];
  toggleAll: ReturnType<typeof useTaxLossHarvesting>['toggleAll'];
}) {
  const [viewAll, setViewAll] = useState(false);
  const [sortField, setSortField] = useState<SortField>('stcg');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // default to descending when changing sort field
    }
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    let aValue: number | string = 0;
    let bValue: number | string = 0;

    if (sortField === 'coinName') {
      aValue = a.coinName;
      bValue = b.coinName;
    } else if (sortField === 'totalHolding') {
      aValue = a.totalHolding * a.currentPrice; // Sorting by fiat value for 'Holdings'
      bValue = b.totalHolding * b.currentPrice;
    } else if (sortField === 'currentValue') {
      aValue = a.totalHolding * a.currentPrice;
      bValue = b.totalHolding * b.currentPrice;
    } else if (sortField === 'stcg') {
      aValue = a.stcg.gain;
      bValue = b.stcg.gain;
    } else if (sortField === 'ltcg') {
      aValue = a.ltcg.gain;
      bValue = b.ltcg.gain;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const displayHoldings = viewAll ? sortedHoldings : sortedHoldings.slice(0, 5);
  const allSelected = holdings.length > 0 && selectedCoins.size === holdings.length;
  const isPartial = selectedCoins.size > 0 && selectedCoins.size < holdings.length;
  const headerCheckboxState = allSelected ? 'checked' : isPartial ? 'partial' : 'unchecked';

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="inline-block ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="bg-[#1a1a24] rounded-xl border border-gray-700/50 overflow-hidden shadow-xl flex flex-col">
      <div className="p-4 font-semibold text-lg border-b border-gray-700/50 flex-shrink-0 relative z-20 bg-[#1a1a24]">Holdings</div>
      <div className="overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-hide">
        <table className="w-full text-sm text-left relative">
          <thead className="text-xs text-gray-400 uppercase bg-[#1e1e2d] sticky top-0 z-10 shadow-[0_1px_0_rgba(55,65,81,0.5)]">
            <tr>
              <th scope="col" className="p-4">
                <CustomCheckbox state={headerCheckboxState} onChange={toggleAll} />
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer select-none" onClick={() => handleSort('coinName')}>
                Asset <SortIcon field="coinName" />
              </th>
              <th scope="col" className="px-6 py-4 text-right cursor-pointer select-none" onClick={() => handleSort('totalHolding')}>
                Holdings<br/><span className="text-[10px] text-gray-500 font-normal normal-case">Avg Buy Price</span> <SortIcon field="totalHolding" />
              </th>
              <th scope="col" className="px-6 py-4 text-right cursor-pointer select-none" onClick={() => handleSort('currentValue')}>
                Current Price <SortIcon field="currentValue" />
              </th>
              <th scope="col" className="px-6 py-4 text-right cursor-pointer select-none hover:text-gray-300" onClick={() => handleSort('stcg')}>
                Short-Term <SortIcon field="stcg" />
              </th>
              <th scope="col" className="px-6 py-4 text-right cursor-pointer select-none hover:text-gray-300" onClick={() => handleSort('ltcg')}>
                Long-Term <SortIcon field="ltcg" />
              </th>
              <th scope="col" className="px-6 py-4 text-right">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayHoldings.map((holding) => {
              const isSelected = selectedCoins.has(holding.coinName);
              
              return (
                <tr 
                  key={holding.coinName} 
                  className={cn(
                    "border-b border-gray-700/50 hover:bg-[#252533] transition-colors cursor-pointer",
                    isSelected && "bg-[#252533]"
                  )}
                  onClick={() => toggleCoinSelection(holding.coinName)}
                >
                  <td className="p-4">
                    <CustomCheckbox state={isSelected ? 'checked' : 'unchecked'} onChange={() => toggleCoinSelection(holding.coinName)} />
                  </td>
                  <td className="px-6 py-4 font-medium flex items-center gap-3 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs text-gray-400 font-bold border border-gray-600">
                      <img 
                        src={holding.logo} 
                        alt={holding.coin}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="absolute">{holding.coin.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white truncate max-w-[150px]">{holding.coinName}</span>
                      <span className="text-gray-400 text-xs">{holding.coin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="text-white font-medium">{holding.totalHolding.toLocaleString('en-US', { maximumFractionDigits: 5 })} {holding.coin}</div>
                    <div className="text-gray-500 text-xs">${holding.averageBuyPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}/{holding.coin}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium whitespace-nowrap relative">
                    <PriceValue value={holding.currentPrice} />
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div><GainValue value={holding.stcg.gain} /></div>
                    <div className="text-gray-500 text-xs mt-1">{holding.stcg.balance.toLocaleString('en-US', { maximumFractionDigits: 5 })} {holding.coin}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div><GainValue value={holding.ltcg.gain} /></div>
                    <div className="text-gray-500 text-xs mt-1">{holding.ltcg.balance.toLocaleString('en-US', { maximumFractionDigits: 5 })} {holding.coin}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-gray-300">
                    {isSelected ? (
                      `${holding.totalHolding.toLocaleString('en-US', { maximumFractionDigits: 5 })} ${holding.coin}`
                    ) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {holdings.length > 5 && (
        <div className="p-4 border-t border-gray-700/50">
          <button 
            onClick={() => setViewAll(!viewAll)}
            className="text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors"
          >
            {viewAll ? 'View less' : 'View all'}
          </button>
        </div>
      )}
    </div>
  );
}
