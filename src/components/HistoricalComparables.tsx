import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { 
  getJoeRyanPrediction, 
  getLatestJoeRyanStats, 
  findHistoricalComparables,
  type HistoricalArbitrationData,
  type JoeRyanStats 
} from '../utils/dataLoader';

interface Comparable {
  player: string;
  club: string;
  season: number;
  status: string;
  era: number;
  wins: number;
  strikeouts: number;
  innings: number;
  whip: number;
  fip: number;
  war: number;
  allStarAppearances: number;
  salary: string;
  highlight: boolean;
}

interface SummaryRow {
  label: string;
  joeEra: number;
  joeWins: number;
  joeStrikeouts: number;
  joeInnings: number;
  joeWhip: number;
  joeFip: number;
  joeWar: number;
  joeAllStarAppearances: number;
  joeSalary: number;
  avgEra: number;
  avgWins: number;
  avgStrikeouts: number;
  avgInnings: number;
  avgWhip: number;
  avgFip: number;
  avgWar: number;
  avgAllStarAppearances: number;
  avgSalary: number;
}

export function HistoricalComparables() {
  const [comparables, setComparables] = useState<Comparable[]>([]);
  const [joeStats, setJoeStats] = useState<JoeRyanStats | null>(null);
  const [summary, setSummary] = useState<SummaryRow | null>(null);

  useEffect(() => {
    Promise.all([
      getJoeRyanPrediction(),
      getLatestJoeRyanStats()
    ]).then(async ([joePrediction, joeStats]) => {
      if (!joeStats) return;
      
      setJoeStats(joeStats);
      
      // Find historical comparables
      const historicalComps = await findHistoricalComparables(joeStats, 6);
      
      const compList: Comparable[] = [];
      
      // Add Joe Ryan first
      if (joePrediction) {
        // Determine Joe Ryan's arbitration status based on MLS
        let joeArbStatus = '2nd Arb';
        if (joePrediction.mls >= 3.0 && joePrediction.mls < 3.15) {
          joeArbStatus = '1st Arb';
        } else if (joePrediction.mls >= 3.15 && joePrediction.mls < 4.1) {
          joeArbStatus = '2nd Arb';
        } else if (joePrediction.mls >= 4.1 && joePrediction.mls < 5.1) {
          joeArbStatus = '3rd Arb';
        } else if (joePrediction.mls >= 5.1 && joePrediction.mls < 6.0) {
          joeArbStatus = '4th Arb';
        } else if (joePrediction.mls >= 6.0) {
          joeArbStatus = 'FA Eligible';
        }
        
        compList.push({
          player: 'Joe Ryan',
          club: 'MIN',
          season: 2025,
          status: joeArbStatus,
          era: joeStats.era,
          wins: Math.round(joeStats.wins),
          strikeouts: Math.round(joeStats.strikeouts),
          innings: joeStats.innings,
          whip: joeStats.whip || 0,
          fip: joeStats.fip || 0,
          war: joeStats.war || 0,
          allStarAppearances: 1,
          salary: joePrediction.predictedSalary || 'TBD',
          highlight: true
        });
      }
      
      // All-Star appearances mapping
      const allStarMap: Record<string, number> = {
        'frankie montas': 0,
        'montas': 0,
        'lucas giolito': 1,
        'giolito': 1,
        'tyler mahle': 0,
        'mahle': 0,
        'jesus lúzardo': 0,
        'luzardo': 0,
        'kyle hendricks': 1,
        'hendricks': 1,
        'mike foltynewicz': 1,
        'foltynewicz': 1,
        'shane bieber': 1,
        'bieber': 1,
      };
      
      // Add historical comparison players
      historicalComps.forEach(comp => {
        // Determine arbitration status based on MLS
        // Players become eligible at 3.0 years (1st Arb)
        // 3.0-3.15: 1st Arb, 3.15-4.1: 2nd Arb (Super 2), 4.1-5.1: 3rd Arb, 5.1-6.0: 4th Arb
        let arbStatus = '1st Arb';
        if (comp.mls >= 3.0 && comp.mls < 3.15) {
          arbStatus = '1st Arb';
        } else if (comp.mls >= 3.15 && comp.mls < 4.1) {
          arbStatus = '2nd Arb';
        } else if (comp.mls >= 4.1 && comp.mls < 5.1) {
          arbStatus = '3rd Arb';
        } else if (comp.mls >= 5.1 && comp.mls < 6.0) {
          arbStatus = '4th Arb';
        } else if (comp.mls >= 6.0) {
          arbStatus = 'FA Eligible';
        }
        
        // Get All-Star appearances
        const playerNameLower = comp.player.toLowerCase();
        let allStarAppearances = 0;
        for (const [key, value] of Object.entries(allStarMap)) {
          if (playerNameLower.includes(key)) {
            allStarAppearances = value;
            break;
          }
        }
        
        compList.push({
          player: comp.player,
          club: comp.club,
          season: comp.season,
          status: arbStatus,
          era: comp.era,
          wins: Math.round(comp.wins),
          strikeouts: Math.round(comp.strikeouts),
          innings: comp.innings,
          whip: comp.whip,
          fip: comp.fip,
          war: comp.war,
          allStarAppearances: allStarAppearances,
          salary: comp.salary,
          highlight: false
        });
      });
      
      setComparables(compList);
      
      // Calculate summary averages (excluding Joe Ryan)
      const historicalOnly = compList.filter(c => !c.highlight);
      if (historicalOnly.length > 0 && joeStats && joePrediction) {
        // Calculate averages
        const avgEra = historicalOnly.reduce((sum, c) => sum + c.era, 0) / historicalOnly.length;
        const avgWins = historicalOnly.reduce((sum, c) => sum + c.wins, 0) / historicalOnly.length;
        const avgStrikeouts = historicalOnly.reduce((sum, c) => sum + c.strikeouts, 0) / historicalOnly.length;
        const avgInnings = historicalOnly.reduce((sum, c) => sum + c.innings, 0) / historicalOnly.length;
        const avgWhip = historicalOnly.reduce((sum, c) => sum + c.whip, 0) / historicalOnly.length;
        const avgFip = historicalOnly.reduce((sum, c) => sum + c.fip, 0) / historicalOnly.length;
        const avgWar = historicalOnly.reduce((sum, c) => sum + c.war, 0) / historicalOnly.length;
        const avgAllStarAppearances = historicalOnly.reduce((sum, c) => sum + c.allStarAppearances, 0) / historicalOnly.length;
        
        // Parse and average salaries (remove $ and commas, then convert to number)
        const salaryNumbers = historicalOnly.map(c => {
          const salaryStr = c.salary.replace(/[$,]/g, '');
          return parseFloat(salaryStr) || 0;
        }).filter(s => s > 0);
        const avgSalary = salaryNumbers.length > 0 
          ? salaryNumbers.reduce((sum, s) => sum + s, 0) / salaryNumbers.length 
          : 0;
        
        // Parse Joe Ryan's salary
        const joeSalaryStr = joePrediction.predictedSalary.replace(/[$,]/g, '');
        const joeSalary = parseFloat(joeSalaryStr) || 0;
        
        setSummary({
          label: 'Average (Historical Comparables)',
          joeEra: joeStats.era,
          joeWins: Math.round(joeStats.wins),
          joeStrikeouts: Math.round(joeStats.strikeouts),
          joeInnings: joeStats.innings,
          joeWhip: joeStats.whip || 0,
          joeFip: joeStats.fip || 0,
          joeWar: joeStats.war || 0,
          joeAllStarAppearances: 1,
          joeSalary: joeSalary,
          avgEra: avgEra,
          avgWins: avgWins,
          avgStrikeouts: avgStrikeouts,
          avgInnings: avgInnings,
          avgWhip: avgWhip,
          avgFip: avgFip,
          avgWar: avgWar,
          avgAllStarAppearances: avgAllStarAppearances,
          avgSalary: avgSalary,
        });
      }
    });
  }, []);

  return (
    <div className="relative z-10 py-8 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 
            className="text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-tight mb-3"
            style={{
              fontWeight: 800,
              background: 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Historical Comparables
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
          <p className="text-base text-white/40 mt-3 tracking-wide">
            Joe Ryan 2025 Projected vs Historical Similar Performances
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          {/* Ambient glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-[#D31145]/10 via-[#CFAB7A]/10 to-[#CFAB7A]/10 rounded-2xl blur-2xl" />
          
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-5 text-left">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Player</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Status</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Season</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">ERA</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">W</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">K's</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">IP</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">WHIP</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">FIP</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">WAR</div>
                    </th>
                    <th className="px-4 py-5 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">All-Star</div>
                    </th>
                    <th className="px-6 py-5 text-right">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Actual Salary</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparables.map((comp, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`border-b border-white/5 transition-all duration-500 ${
                        comp.highlight 
                          ? 'bg-gradient-to-r from-[#D31145]/15 via-[#CFAB7A]/10 to-[#CFAB7A]/15 border-l-4 border-l-[#D31145]' 
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="px-6 py-6">
                        <div className={`text-base tracking-tight ${comp.highlight ? 'text-white font-semibold' : 'text-white/80'}`}>
                          {comp.player}
                        </div>
                        {!comp.highlight && (
                          <div className="text-xs text-white/30 mt-0.5">{comp.club}</div>
                        )}
                      </td>
                      <td className="px-4 py-6 text-center text-white/50 text-xs">{comp.status}</td>
                      <td className="px-4 py-6 text-center text-white/50 text-xs">
                        {comp.season}
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-base text-blue-400 font-semibold">{comp.era.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-base text-green-400 font-semibold">{comp.wins}</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className={`text-lg font-bold ${comp.highlight ? 'text-white' : 'text-orange-400'}`}>
                          {comp.strikeouts}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-center text-white/60 text-sm">{comp.innings.toFixed(1)}</td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-base text-purple-400 font-semibold">{comp.whip.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-base text-cyan-400 font-semibold">{comp.fip.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-base text-yellow-400 font-semibold">{comp.war.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-base text-pink-400 font-semibold">{comp.allStarAppearances}</span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className={`text-base tracking-tight ${comp.highlight ? 'text-white font-bold' : 'text-white/70'}`}>
                          {comp.salary}
                        </span>
                        {comp.highlight && (
                          <div className="text-xs text-white/40 mt-0.5">(Projected)</div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {/* Summary Row */}
                  {summary && (
                    <>
                      <tr className="border-t-2 border-white/20">
                        <td colSpan={12} className="px-6 py-2 bg-white/[0.03]">
                          <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">
                            Summary Comparison
                          </div>
                        </td>
                      </tr>
                      {/* Average Row */}
                      <motion.tr
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="border-b border-white/10 bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div className="text-sm tracking-tight text-white/70 font-medium">
                            {summary.label}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center text-white/50 text-xs">2nd Arb</td>
                        <td className="px-4 py-5 text-center text-white/50 text-xs">—</td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-blue-400 font-semibold">{summary.avgEra.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-green-400 font-semibold">{summary.avgWins.toFixed(0)}</span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-lg font-bold text-orange-400">{summary.avgStrikeouts.toFixed(0)}</span>
                        </td>
                        <td className="px-4 py-5 text-center text-white/60 text-sm">{summary.avgInnings.toFixed(1)}</td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-purple-400 font-semibold">{summary.avgWhip.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-cyan-400 font-semibold">{summary.avgFip.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-yellow-400 font-semibold">{summary.avgWar.toFixed(1)}</span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-pink-400 font-semibold">{summary.avgAllStarAppearances.toFixed(1)}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-base tracking-tight text-white/70">
                            ${summary.avgSalary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </td>
                      </motion.tr>
                      {/* Joe Ryan Row */}
                      <motion.tr
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="border-b border-white/10 bg-gradient-to-r from-[#D31145]/10 via-[#CFAB7A]/08 to-transparent"
                      >
                        <td className="px-6 py-5">
                          <div className="text-sm tracking-tight text-white font-semibold">
                            Joe Ryan (2025)
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center text-white/70 text-xs">2nd Arb</td>
                        <td className="px-4 py-5 text-center text-white/70 text-xs">2025</td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-blue-400 font-semibold">{summary.joeEra.toFixed(2)}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeEra < summary.avgEra ? '↓ Better' : summary.joeEra > summary.avgEra ? '↑ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-green-400 font-semibold">{summary.joeWins}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeWins > summary.avgWins ? '↑ Better' : summary.joeWins < summary.avgWins ? '↓ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-lg font-bold text-white">{summary.joeStrikeouts}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeStrikeouts > summary.avgStrikeouts ? '↑ Better' : summary.joeStrikeouts < summary.avgStrikeouts ? '↓ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center text-white/60 text-sm">
                          {summary.joeInnings.toFixed(1)}
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeInnings > summary.avgInnings ? '↑ Better' : summary.joeInnings < summary.avgInnings ? '↓ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-purple-400 font-semibold">{summary.joeWhip.toFixed(2)}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeWhip < summary.avgWhip ? '↓ Better' : summary.joeWhip > summary.avgWhip ? '↑ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-cyan-400 font-semibold">{summary.joeFip.toFixed(2)}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeFip < summary.avgFip ? '↓ Better' : summary.joeFip > summary.avgFip ? '↑ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-yellow-400 font-semibold">{summary.joeWar.toFixed(1)}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeWar > summary.avgWar ? '↑ Better' : summary.joeWar < summary.avgWar ? '↓ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="text-base text-pink-400 font-semibold">{summary.joeAllStarAppearances}</span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeAllStarAppearances > summary.avgAllStarAppearances ? '↑ Better' : summary.joeAllStarAppearances < summary.avgAllStarAppearances ? '↓ Worse' : '='}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-base tracking-tight text-white font-bold">
                            ${summary.joeSalary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                          <div className="text-xs text-white/40 mt-0.5">
                            {summary.joeSalary > summary.avgSalary ? `+${((summary.joeSalary / summary.avgSalary - 1) * 100).toFixed(1)}%` : summary.joeSalary < summary.avgSalary ? `${((summary.joeSalary / summary.avgSalary - 1) * 100).toFixed(1)}%` : '='}
                          </div>
                        </td>
                      </motion.tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
