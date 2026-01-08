import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function AdvancedStatsVisual() {
  const ref = useRef(null);

  const [latestStats, setLatestStats] = useState<JoeRyanStats | null>(null);
  const [whipData, setWhipData] = useState<Array<{year: string, whip: number, league: number}>>([]);
  const [fipData, setFipData] = useState<Array<{year: string, fip: number, era: number}>>([]);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      if (seasons.length > 0) {
        const latest = seasons[0];
        setLatestStats(latest);

        // League average WHIP by year (approximate)
        const leagueWHIP: Record<number, number> = {
          2021: 1.30,
          2022: 1.28,
          2023: 1.32,
          2024: 1.30,
          2025: 1.30
        };

        const sorted = [...seasons].sort((a, b) => a.season - b.season);
        
        const whip = sorted.map(s => ({
          year: s.season.toString(),
          whip: s.whip,
          league: leagueWHIP[s.season] || 1.30
        }));

        const fip = sorted.map(s => ({
          year: s.season.toString(),
          fip: s.fip,
          era: s.era
        }));

        setWhipData(whip);
        setFipData(fip);
      }
    });
  }, []);

  return (
    <div ref={ref} className="relative z-10 py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
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
            Advanced Metrics
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
        </motion.div>

        {/* Key Stats Grid */}
        {latestStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { 
                value: latestStats.whip, 
                label: 'WHIP', 
                sublabel: '2025 Season',
                suffix: '',
                color: '#D31145',
                isLowerBetter: true
              },
              { 
                value: latestStats.fip, 
                label: 'FIP', 
                sublabel: '2025 Season',
                suffix: '',
                color: '#CFAB7A',
                isLowerBetter: true
              },
              { 
                value: latestStats.war, 
                label: 'WAR', 
                sublabel: '2025 Season',
                suffix: '',
                color: '#CFAB7A',
                isLowerBetter: false,
                decimals: 2
              },
              { 
                value: latestStats.kPer9, 
                label: 'K/9', 
                sublabel: '2025 Season',
                suffix: '',
                color: '#D31145',
                isLowerBetter: false,
                decimals: 1
              }
            ].map((stat, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
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
                        className="text-5xl lg:text-7xl tracking-tight leading-none text-white"
                        style={{
                          fontWeight: 800,
                          fontFamily: 'Georgia, serif'
                        }}
                      >
                        {stat.isLowerBetter 
                          ? stat.value.toFixed(2) 
                          : <AnimatedCounter 
                              value={stat.value} 
                              duration={2} 
                              decimals={stat.decimals || 0}
                            />}
                        {stat.suffix}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xl text-white/90 font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
                      {stat.sublabel && (
                        <div className="text-sm text-white/40 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.sublabel}</div>
                      )}
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
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* WHIP Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">WHIP Trend</h3>
                <p className="text-white/40 mb-8 tracking-wide">Control and command over time</p>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={whipData}>
                    <defs>
                      <linearGradient id="whipGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D31145" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#D31145" stopOpacity={0} />
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
                      domain={[0.9, 1.4]}
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
                    />
                    <Line
                      type="monotone"
                      dataKey="whip"
                      stroke="#D31145"
                      strokeWidth={3}
                      dot={{ fill: '#D31145', r: 6 }}
                      name="Joe Ryan WHIP"
                    />
                    <Line
                      type="monotone"
                      dataKey="league"
                      stroke="#666"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="League Avg"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* FIP vs ERA Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">FIP vs ERA</h3>
                <p className="text-white/40 mb-8 tracking-wide">Pitcher-controlled metrics</p>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fipData}>
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
                      domain={[2.5, 5.0]}
                      style={{ fontSize: '13px', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff10' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgba(0, 43, 92, 0.3)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        padding: '12px 16px'
                      }}
                      labelStyle={{ color: '#fff', fontWeight: 600 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fip"
                      stroke="#CFAB7A"
                      strokeWidth={3}
                      dot={{ fill: '#CFAB7A', r: 6 }}
                      name="FIP"
                    />
                    <Line
                      type="monotone"
                      dataKey="era"
                      stroke="#D31145"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: '#D31145', r: 6 }}
                      name="ERA"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

