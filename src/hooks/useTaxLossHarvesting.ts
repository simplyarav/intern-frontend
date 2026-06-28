import { useState, useEffect, useMemo, useCallback } from 'react';
import { Holding, CapitalGains } from '../types';

export function useTaxLossHarvesting() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [initialCapitalGains, setInitialCapitalGains] = useState<CapitalGains | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set of selected coin names/symbols
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [holdingsRes, gainsRes] = await Promise.all([
          fetch('/api/holdings'),
          fetch('/api/capital-gains')
        ]);
        
        if (!holdingsRes.ok || !gainsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const holdingsData = await holdingsRes.json();
        const gainsData = await gainsRes.json();

        setHoldings(holdingsData);
        setInitialCapitalGains(gainsData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCoinSelection = useCallback((coin: string) => {
    setSelectedCoins(prev => {
      const next = new Set(prev);
      if (next.has(coin)) {
        next.delete(coin);
      } else {
        next.add(coin);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedCoins(prev => {
      if (prev.size === holdings.length) {
        return new Set();
      }
      return new Set(holdings.map(h => h.coinName));
    });
  }, [holdings]);

  const afterHarvestingGains = useMemo(() => {
    if (!initialCapitalGains) return null;

    // Deep copy initial state
    const current = {
      stcg: { ...initialCapitalGains.capitalGains.stcg },
      ltcg: { ...initialCapitalGains.capitalGains.ltcg }
    };

    // Calculate changes based on selected holdings
    holdings.forEach(holding => {
      if (selectedCoins.has(holding.coinName)) {
        // Apply short term gain
        if (holding.stcg.gain > 0) {
          current.stcg.profits += holding.stcg.gain;
        } else {
          current.stcg.losses += Math.abs(holding.stcg.gain);
        }

        // Apply long term gain
        if (holding.ltcg.gain > 0) {
          current.ltcg.profits += holding.ltcg.gain;
        } else {
          current.ltcg.losses += Math.abs(holding.ltcg.gain);
        }
      }
    });

    const netStcg = current.stcg.profits - current.stcg.losses;
    const netLtcg = current.ltcg.profits - current.ltcg.losses;
    const realisedCapitalGains = netStcg + netLtcg;

    return {
      ...current,
      netStcg,
      netLtcg,
      realisedCapitalGains
    };
  }, [holdings, initialCapitalGains, selectedCoins]);

  const preHarvestingGains = useMemo(() => {
    if (!initialCapitalGains) return null;
    const { stcg, ltcg } = initialCapitalGains.capitalGains;
    
    const netStcg = stcg.profits - stcg.losses;
    const netLtcg = ltcg.profits - ltcg.losses;
    const realisedCapitalGains = netStcg + netLtcg;

    return {
      stcg,
      ltcg,
      netStcg,
      netLtcg,
      realisedCapitalGains
    };
  }, [initialCapitalGains]);

  return {
    holdings,
    loading,
    error,
    selectedCoins,
    toggleCoinSelection,
    toggleAll,
    preHarvestingGains,
    afterHarvestingGains
  };
}
