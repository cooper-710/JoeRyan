import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { useIsMobile } from './ui/use-mobile';

export function PerformanceCharts() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y = isMobile ? 0 : yTransform;

  const [eraData, setEraData] = useState<Array<{year: string, era: number, league: number}>>([]);
  const [strikeoutData, setStrikeoutData] = useState<Array<{year: string, k: number, ip: number}>>([]);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      // Sort by season ascending for charts
      const sorted = [...seasons].sort((a, b) => a.season - b.season);
      
      // League average ERA by year (approximate)
      const leagueERA: Record<number, number> = {
        2021: 4.26,
        2022: 4.10,
        2023: 4.33,
        2024: 4.15,
        2025: 4.15
      };

      const era = sorted.map(s => ({
        year: s.season.toString(),
        era: s.era,
        league: leagueERA[s.season] || 4.20
      }));

      const strikeouts = sorted.map(s => ({
        year: s.season.toString(),
        k: Math.round(s.strikeouts),
        ip: s.innings
      }));

      setEraData(era);
      setStrikeoutData(strikeouts);
    });
  }, []);

  return (
    <div ref={ref} className="relative z-10 py-6 md:py-16 lg:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={isMobile ? false : { opacity: 0, y: 50 }}
          whileInView={isMobile ? false : { opacity: 1, y: 0 }}
          transition={isMobile ? {} : { duration: 1 }}
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
            Performance
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#002B5C] via-[#D31145] to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ERA Chart */}
          <motion.div
            initial={isMobile ? false : { opacity: 0, x: -50 }}
            whileInView={isMobile ? false : { opacity: 1, x: 0 }}
            transition={isMobile ? {} : { duration: 1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D31145]/20 to-[#D31145]/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">ERA Trajectory</h3>
                <p className="text-white/40 mb-8 tracking-wide">Consistently below league average</p>
                
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={eraData}>
                    <defs>
                      <linearGradient id="eraGradient" x1="0" y1="0" x2="0" y2="1">
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
                      domain={[3, 4.5]}
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
                    <Area
                      type="monotone"
                      dataKey="era"
                      stroke="#D31145"
                      strokeWidth={3}
                      fill="url(#eraGradient)"
                      name="Joe Ryan ERA"
                    />
                    <Line
                      type="monotone"
                      dataKey="league"
                      stroke="#666"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="League Avg"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Strikeout Chart */}
          <motion.div
            initial={isMobile ? false : { opacity: 0, x: 50 }}
            whileInView={isMobile ? false : { opacity: 1, x: 0 }}
            transition={isMobile ? {} : { duration: 1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D31145]/20 to-[#D31145]/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-2xl overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl text-white mb-2 tracking-tight font-semibold">Strikeout Evolution</h3>
                <p className="text-white/40 mb-8 tracking-wide">Year-over-year growth</p>
                
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={strikeoutData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D31145" stopOpacity={1} />
                        <stop offset="100%" stopColor="#CFAB7A" stopOpacity={1} />
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
                    <Bar 
                      dataKey="k"
                      fill="#D31145"
                      name="Strikeouts"
                      radius={[12, 12, 0, 0]}
                      maxBarSize={80}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}