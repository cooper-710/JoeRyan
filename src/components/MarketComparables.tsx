import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getComparablePlayersWithStats, getJoeRyanPrediction, getLatestJoeRyanStats, type ComparablePlayer, type JoeRyanStats } from '../utils/dataLoader';

interface Comparable {
  player: string;
  team: string;
  year: string;
  era: number;
  wins: number;
  strikeouts: number;
  innings: number;
  salary: string;
  highlight: boolean;
}

export function MarketComparables() {
  const [comparables, setComparables] = useState<Comparable[]>([]);
  const [joeStats, setJoeStats] = useState<JoeRyanStats | null>(null);

  useEffect(() => {
    Promise.all([
      getJoeRyanPrediction(),
      getLatestJoeRyanStats(),
      getComparablePlayersWithStats(4)
    ]).then(([joePrediction, joeStats, comps]) => {
      const compList: Comparable[] = [];
      
      // Add Joe Ryan first
      if (joeStats && joePrediction) {
        setJoeStats(joeStats);
        
        // Determine Joe Ryan's arbitration status based on MLS
        // Players become eligible at 3.0 years (1st Arb)
        // Based on user guidance: Hunter Brown (3.035) = 1st Arb, George Kirby (3.151, Super 2) = 2nd Arb, 4.1 = 3rd Arb, 5.1 = 4th Arb
        // So: 3.0-3.15: 1st Arb, 3.15-4.1: 2nd Arb (Super 2), 4.1-5.1: 3rd Arb, 5.1-6.0: 4th Arb
        let joeArbStatus = '1st Arb';
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
          team: 'MIN',
          year: joeArbStatus,
          era: joeStats.era,
          wins: Math.round(joeStats.wins),
          strikeouts: Math.round(joeStats.strikeouts),
          innings: joeStats.innings,
          salary: joePrediction.predictedSalary || 'TBD',
          highlight: true
        });
      }
      
      // Add comparison players
      comps.forEach(comp => {
        if (comp.stats) {
          // Extract team from stats if available, or use abbreviation
          const team = comp.stats['fg_Team'] || 'N/A';
          
          // Determine arbitration status based on MLS (Major League Service time)
          // Players become eligible at 3.0 years (1st Arb)
          // Based on user guidance: Hunter Brown (3.035) = 1st Arb, George Kirby (3.151, Super 2) = 2nd Arb, 4.1 = 3rd Arb, 5.1 = 4th Arb
          // So: 3.0-3.15: 1st Arb, 3.15-4.1: 2nd Arb (Super 2), 4.1-5.1: 3rd Arb, 5.1-6.0: 4th Arb
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
          
          // Format player name (handle "Last, First" format)
          let playerName = comp.player;
          if (comp.player.includes(',')) {
            const parts = comp.player.split(',');
            playerName = (parts[1]?.trim() || '') + ' ' + (parts[0]?.trim() || '');
          }
          
          compList.push({
            player: playerName.trim() || comp.player,
            team: team,
            year: arbStatus,
            era: comp.stats.era,
            wins: Math.round(comp.stats.wins),
            strikeouts: Math.round(comp.stats.strikeouts),
            innings: comp.stats.innings,
            salary: comp.predictedSalary,
            highlight: false
          });
        }
      });
      
      setComparables(compList);
    });
  }, []);

  return (
    <div className="relative z-10 py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 
            className="text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight mb-6"
            style={{
              fontWeight: 800,
              background: 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Comparables
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
          <p className="text-xl text-white/40 mt-6 tracking-wide">2025 Season Stats</p>
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
          <div className="absolute -inset-8 bg-gradient-to-br from-[#D31145]/10 via-[#CFAB7A]/10 to-[#CFAB7A]/10 rounded-3xl blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-8 py-6 text-left">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Player</div>
                    </th>
                    <th className="px-6 py-6 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Status</div>
                    </th>
                    <th className="px-6 py-6 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">ERA</div>
                    </th>
                    <th className="px-6 py-6 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">W</div>
                    </th>
                    <th className="px-6 py-6 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">K's</div>
                    </th>
                    <th className="px-6 py-6 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">IP</div>
                    </th>
                    <th className="px-8 py-6 text-right">
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Projected Salary</div>
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
                      <td className="px-8 py-8">
                        <div className={`text-xl tracking-tight ${comp.highlight ? 'text-white font-semibold' : 'text-white/80'}`}>
                          {comp.player}
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center text-white/50 text-sm">{comp.year}</td>
                      <td className="px-6 py-8 text-center">
                        <span className="text-xl text-blue-400 font-semibold">{comp.era}</span>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span className="text-xl text-green-400 font-semibold">{comp.wins}</span>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span className={`text-2xl font-bold ${comp.highlight ? 'text-white' : 'text-orange-400'}`}>
                          {comp.strikeouts}
                        </span>
                      </td>
                      <td className="px-6 py-8 text-center text-white/60 text-lg">{comp.innings}</td>
                      <td className="px-8 py-8 text-right">
                        <span className={`text-2xl tracking-tight ${comp.highlight ? 'text-white font-bold' : 'text-white/70'}`}>
                          {comp.salary}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}