import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function RateStatsChart() {
  const ref = useRef(null);

  const [rateData, setRateData] = useState<Array<{
    year: string;
    kPer9: number;
    bbPer9: number;
    hrPer9: number;
    kbbRatio: number;
  }>>([]);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      const sorted = [...seasons].sort((a, b) => a.season - b.season);
      
      const rates = sorted.map(s => ({
        year: s.season.toString(),
        kPer9: s.kPer9,
        bbPer9: s.bbPer9,
        hrPer9: s.hrPer9,
        kbbRatio: s.kPer9 / (s.bbPer9 || 1) // Strikeout to walk ratio
      }));

      setRateData(rates);
    });
  }, []);

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
            Rate Statistics
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">Per-9 Rates</h3>
              <p className="text-white/40 mb-8 tracking-wide">Strikeouts, walks, and home runs per nine innings</p>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={rateData}>
                  <defs>
                    <linearGradient id="kPer9Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D31145" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#D31145" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="bbPer9Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CFAB7A" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#CFAB7A" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="hrPer9Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#F97316" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="kbbRatioGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#002B5C" stopOpacity={1} />
                      <stop offset="100%" stopColor="#002B5C" stopOpacity={1} />
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
                    yAxisId="left"
                    stroke="#666"
                    domain={[0, 12]}
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ffffff10' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#666"
                    domain={[0, 6]}
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ffffff10' }}
                    tickFormatter={(value) => value.toFixed(2)}
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
                      if (name === 'K/BB Ratio') {
                        return [value.toFixed(2), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="kPer9" 
                    fill="url(#kPer9Gradient)"
                    name="K/9"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="bbPer9" 
                    fill="url(#bbPer9Gradient)"
                    name="BB/9"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="hrPer9" 
                    fill="url(#hrPer9Gradient)"
                    name="HR/9"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="kbbRatio"
                    stroke="#002B5C"
                    strokeWidth={3}
                    dot={{ fill: '#002B5C', r: 5 }}
                    name="K/BB Ratio"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

