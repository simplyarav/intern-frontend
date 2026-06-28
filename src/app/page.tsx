'use client';

import { useTaxLossHarvesting } from '../hooks/useTaxLossHarvesting';
import { InfoBanner } from '../components/InfoBanner';
import { GainsCards } from '../components/GainsCards';
import { HoldingsTable } from '../components/HoldingsTable';

export default function Home() {
  const {
    holdings,
    loading,
    error,
    selectedCoins,
    toggleCoinSelection,
    toggleAll,
    preHarvestingGains,
    afterHarvestingGains
  } = useTaxLossHarvesting();

  return (
    <main className="min-h-screen bg-[#0d0d12] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-2 mb-8">
          <div className="text-blue-500 font-bold text-3xl">Koin<span className="text-orange-500">X</span></div>
          <div className="text-orange-500 text-sm align-top font-bold">®</div>
        </header>

        <div className="flex items-center gap-4 mb-6 relative group">
          <h1 className="text-2xl font-bold">Tax Harvesting</h1>
          <button className="text-sm text-blue-500 hover:underline font-medium cursor-help">How it works?</button>
          
          <div className="absolute left-[180px] top-full mt-2 w-[350px] bg-white text-black text-sm p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <ul className="list-disc pl-4 space-y-2">
              <li>See your capital gains for FY 2024-25 in the left card</li>
              <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
              <li>Instantly see your updated tax liability in the right card</li>
            </ul>
            <div className="mt-3 text-gray-600 font-medium text-xs">
              Pro tip: Experiment with different combinations of your holdings to optimize your tax liability
            </div>
            {/* Tooltip triangle */}
            <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45"></div>
          </div>
        </div>

        <InfoBanner />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Loading your crypto portfolio...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-center">
            {error}. Please ensure the Express backend is running on port 5000.
          </div>
        ) : (
          <>
            <GainsCards 
              preHarvesting={preHarvestingGains} 
              afterHarvesting={afterHarvestingGains} 
            />
            
            <HoldingsTable 
              holdings={holdings}
              selectedCoins={selectedCoins}
              toggleCoinSelection={toggleCoinSelection}
              toggleAll={toggleAll}
            />
          </>
        )}
      </div>
    </main>
  );
}
