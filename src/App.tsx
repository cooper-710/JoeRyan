import { ArbitrationHero } from './components/ArbitrationHero';
import { MarketComparables } from './components/MarketComparables';
import { PerformanceCharts } from './components/PerformanceCharts';
import { ValuationSummary } from './components/ValuationSummary';
import { VideoHero } from './components/VideoHero';
import { CustomCursor } from './components/CustomCursor';
import { CareerTimeline } from './components/CareerTimeline';
import { SplitHero } from './components/SplitHero';
import { AdvancedStatsVisual } from './components/AdvancedStatsVisual';
import { RateStatsChart } from './components/RateStatsChart';
import { WinsLossesComparison } from './components/WinsLossesComparison';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.cursor = 'none';
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Base gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black to-black -z-10" />
      
      {/* Subtle animated mesh overlay */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#D31145] rounded-full mix-blend-multiply filter blur-[200px] opacity-10 animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#CFAB7A] rounded-full mix-blend-multiply filter blur-[200px] opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#CFAB7A] rounded-full mix-blend-multiply filter blur-[200px] opacity-15 animate-blob animation-delay-4000" />
      </div>
      
      {/* Very subtle grain texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      
      <CustomCursor />
      <VideoHero />
      <ArbitrationHero />
      <SplitHero />
      <CareerTimeline />
      <PerformanceCharts />
      <AdvancedStatsVisual />
      <RateStatsChart />
      <WinsLossesComparison />
      <MarketComparables />
      <ValuationSummary />
    </div>
  );
}