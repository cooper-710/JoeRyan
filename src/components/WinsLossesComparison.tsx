import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatedCounter } from './AnimatedCounter';

export function WinsLossesComparison() {
  const ref = useRef(null);

  const [winLossData, setWinLossData] = useState<Array<{
    year: string;
    wins: number;
    losses: number;
    winPct: number;
  }>>([]);
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      const sorted = [...seasons].sort((a, b) => a.season - b.season);
      
      let wins = 0;
      let losses = 0;
      
      const wlData = sorted.map(s => {
        wins += s.wins;
        losses += s.losses;
        return {
          year: s.season.toString(),
          wins: s.wins,
          losses: s.losses,
          winPct: s.wins / (s.wins + s.losses) * 100
        };
      });

      setWinLossData(wlData);
      setTotalWins(wins);
      setTotalLosses(losses);
    });
  }, []);

  const winPct = totalWins + totalLosses > 0 ? (totalWins / (totalWins + totalLosses) * 100) : 0;

  return (
    <div ref={ref} className="relative z-10 py-6 md:py-16 lg:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-12 lg:mb-24"
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
            Win-Loss Record
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              value: totalWins,
              label: 'Total Wins',
              sublabel: 'Career victories',
              color: '#D31145'
            },
            {
              value: totalLosses,
              label: 'Total Losses',
              sublabel: 'Career defeats',
              color: '#666'
            },
            {
              value: winPct,
              label: 'Win %',
              sublabel: 'Career winning percentage',
              color: '#CFAB7A',
              isPercentage: true
            }
          ].map((stat, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group hover-target cursor-pointer relative"
              >
                <motion.div 
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, ${stat.color}, transparent)`,
                  }}
                />
                
                <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl group-hover:border-white/30 transition-all duration-500 group-hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
                    <motion.div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${stat.color}40, transparent)`,
                      }}
                      initial={{ x: '100%', y: '-100%' }}
                      whileInView={{ x: 0, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  <div className="mb-4">
                    <div 
                      className="text-6xl lg:text-7xl tracking-tight leading-none text-white"
                      style={{
                        fontWeight: 800,
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      {stat.isPercentage ? (
                        <>
                          {winPct.toFixed(1)}%
                        </>
                      ) : (
                        <AnimatedCounter value={stat.value} duration={2.5} />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xl text-white/90 font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
                    <div className="text-sm text-white/40 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.sublabel}</div>
                  </div>

                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                    style={{ background: stat.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Win-Loss Chart */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">Wins vs Losses by Season</h3>
              <p className="text-white/40 mb-8 tracking-wide">Year-over-year performance</p>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={winLossData}>
                  <defs>
                    <linearGradient id="winsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D31145" stopOpacity={1} />
                      <stop offset="100%" stopColor="#D31145" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="lossesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#666" stopOpacity={1} />
                      <stop offset="100%" stopColor="#666" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#666"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ffffff10' }}
                  />
                  <YAxis 
                    stroke="#666"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ffffff10' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      border: '1px solid rgba(211, 17, 69, 0.3)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      padding: '12px 16px'
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    formatter={(value: number, name: string) => {
                      // Show abbreviated labels: W for Wins, L for Losses
                      const label = name === 'Wins' ? 'W' : name === 'Losses' ? 'L' : name;
                      return [value, label];
                    }}
                  />
                  <Bar 
                    dataKey="wins" 
                    fill="url(#winsGradient)"
                    name="Wins"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  />
                  <Bar 
                    dataKey="losses" 
                    fill="url(#lossesGradient)"
                    name="Losses"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

