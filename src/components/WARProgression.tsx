import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { AnimatedCounter } from './AnimatedCounter';

export function WARProgression() {
  const ref = useRef(null);

  const [warData, setWarData] = useState<Array<{year: string, war: number, cumulative: number}>>([]);
  const [totalWar, setTotalWar] = useState(0);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      const sorted = [...seasons].sort((a, b) => a.season - b.season);
      
      let cumulative = 0;
      const war = sorted.map(s => {
        cumulative += s.war;
        return {
          year: s.season.toString(),
          war: s.war,
          cumulative: cumulative
        };
      });

      setWarData(war);
      setTotalWar(cumulative);
    });
  }, []);

  return (
    <div ref={ref} className="relative z-10 py-40 px-6">
      <div className="max-w-7xl mx-auto">
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
            WAR Progression
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Total WAR Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group hover-target cursor-pointer relative lg:col-span-1"
          >
            <motion.div 
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, #CFAB7A, transparent)`,
              }}
            />
            
            <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/10 rounded-3xl p-10 backdrop-blur-xl group-hover:border-white/30 transition-all duration-500 group-hover:scale-105 h-full">
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, #CFAB7A40, transparent)`,
                  }}
                  initial={{ x: '100%', y: '-100%' }}
                  whileInView={{ x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </div>

              <div className="mb-4">
                <div 
                  className="text-7xl lg:text-8xl tracking-tight leading-none text-white"
                  style={{
                    fontWeight: 800,
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  <AnimatedCounter value={Math.round(totalWar * 10) / 10} duration={3} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl text-white/90 font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Total WAR</div>
                <div className="text-sm text-white/40 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Career Wins Above Replacement</div>
              </div>

              <motion.div 
                className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                style={{ background: '#CFAB7A' }}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>

          {/* Average WAR Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="group hover-target cursor-pointer relative lg:col-span-1"
          >
            <motion.div 
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, #D31145, transparent)`,
              }}
            />
            
            <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/10 rounded-3xl p-10 backdrop-blur-xl group-hover:border-white/30 transition-all duration-500 group-hover:scale-105 h-full">
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, #D3114540, transparent)`,
                  }}
                  initial={{ x: '100%', y: '-100%' }}
                  whileInView={{ x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </div>

              <div className="mb-4">
                <div 
                  className="text-7xl lg:text-8xl tracking-tight leading-none text-white"
                  style={{
                    fontWeight: 800,
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {warData.length > 0 ? (totalWar / warData.length).toFixed(1) : '0.0'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl text-white/90 font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Avg WAR/Season</div>
                <div className="text-sm text-white/40 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Consistent Production</div>
              </div>

              <motion.div 
                className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                style={{ background: '#D31145' }}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.6 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>

          {/* Latest Season WAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="group hover-target cursor-pointer relative lg:col-span-1"
          >
            <motion.div 
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, #CFAB7A, transparent)`,
              }}
            />
            
            <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/10 rounded-3xl p-10 backdrop-blur-xl group-hover:border-white/30 transition-all duration-500 group-hover:scale-105 h-full">
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, #CFAB7A40, transparent)`,
                  }}
                  initial={{ x: '100%', y: '-100%' }}
                  whileInView={{ x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </div>

              <div className="mb-4">
                <div 
                  className="text-7xl lg:text-8xl tracking-tight leading-none text-white"
                  style={{
                    fontWeight: 800,
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {warData.length > 0 ? warData[warData.length - 1].war.toFixed(1) : '0.0'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl text-white/90 font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>2025 WAR</div>
                <div className="text-sm text-white/40 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Current Season</div>
              </div>

              <motion.div 
                className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                style={{ background: '#CFAB7A' }}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.7 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        </div>

        {/* WAR Chart */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">WAR by Season</h3>
              <p className="text-white/40 mb-8 tracking-wide">Year-over-year value contribution</p>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={warData}>
                  <defs>
                    <linearGradient id="warGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CFAB7A" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#CFAB7A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D31145" stopOpacity={0.2} />
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
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ffffff10' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      border: '1px solid rgba(207, 171, 122, 0.3)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      padding: '12px 16px'
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="war"
                    stroke="#CFAB7A"
                    strokeWidth={3}
                    fill="url(#warGradient)"
                    name="Season WAR"
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#D31145"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#D31145', r: 4 }}
                    name="Cumulative WAR"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

