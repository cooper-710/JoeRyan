import { DollarSign, Zap, Shield, TrendingDown, TrendingUp, Trophy, BarChart3 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { getJoeRyanPrediction, getLatestJoeRyanStats, type JoeRyanStats } from '../utils/dataLoader';

export function ValuationSummary() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  const [predictedSalary, setPredictedSalary] = useState('$6.3M');
  const [playerAsk, setPlayerAsk] = useState('$4.8M');
  const [teamOffer, setTeamOffer] = useState('$3.5M');
  const [factors, setFactors] = useState([
    { icon: Zap, text: 'Elite strikeout rate - Loading...', highlight: true },
    { icon: Shield, text: 'Proven durability - Loading...', highlight: true },
    { icon: TrendingDown, text: 'Consistent ERA below league average', highlight: false },
    { icon: TrendingUp, text: 'Year-over-year performance improvement trajectory', highlight: false },
    { icon: Trophy, text: 'Strong win total demonstrates team impact', highlight: false },
    { icon: BarChart3, text: 'Superior metrics vs comparable arbitration class', highlight: false }
  ]);

  useEffect(() => {
    Promise.all([
      getJoeRyanPrediction(),
      getLatestJoeRyanStats()
    ]).then(([prediction, stats]) => {
      if (prediction) {
        const salary = parseFloat(prediction.predictedSalary.replace(/[^0-9.]/g, ''));
        setPredictedSalary(prediction.predictedSalary);
        // Calculate player ask and team offer based on prediction
        setPlayerAsk(`$${(salary * 1.1 / 1000000).toFixed(1)}M`);
        setTeamOffer(`$${(salary * 0.9 / 1000000).toFixed(1)}M`);
      }
      
      if (stats) {
        setFactors([
          { 
            icon: Zap, 
            text: `Elite strikeout rate - ${Math.round(stats.strikeouts)} K's ranks Top 25 in AL`, 
            highlight: true 
          },
          { 
            icon: Shield, 
            text: `Proven durability with ${stats.innings.toFixed(1)} innings pitched`, 
            highlight: true 
          },
          { 
            icon: TrendingDown, 
            text: `Consistent ERA below league average (${stats.era.toFixed(2)} vs 4.15)`, 
            highlight: false 
          },
          { 
            icon: TrendingUp, 
            text: 'Year-over-year performance improvement trajectory', 
            highlight: false 
          },
          { 
            icon: Trophy, 
            text: `Strong win total (${Math.round(stats.wins)}) demonstrates team impact`, 
            highlight: false 
          },
          { 
            icon: BarChart3, 
            text: 'Superior metrics vs comparable arbitration class', 
            highlight: false 
          }
        ]);
      }
    });
  }, []);

  return (
    <div ref={ref} className="relative z-10 py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 
            className="text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight mb-6 text-white"
            style={{
              fontWeight: 800,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Valuation
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#D31145] via-[#D31145] to-[#CFAB7A]" />
        </motion.div>

        {/* Main valuation card */}
        <motion.div 
          style={{ scale }}
          className="flex justify-center mb-32"
        >
          {/* Fair Value - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-br from-[#D31145] via-[#CFAB7A] to-[#CFAB7A] rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-all duration-700 animate-pulse" />
            <div className="relative h-full bg-black border-2 border-[#D31145]/50 rounded-3xl p-10 backdrop-blur-xl overflow-hidden">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              
              <div className="relative z-10 flex items-center justify-center h-full">
                <div 
                  className="text-8xl tracking-tight text-[#CFAB7A]"
                  style={{
                    fontWeight: 900,
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {predictedSalary}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Factors */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative mb-32"
        >
          <div className="absolute -inset-8 bg-gradient-to-br from-[#D31145]/5 via-[#CFAB7A]/5 to-[#CFAB7A]/5 rounded-3xl blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-12 backdrop-blur-2xl">
            <h3 className="text-5xl text-white mb-16 tracking-tight font-bold">
              Key Valuation Factors
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {factors.map((factor, index) => {
                const Icon = factor.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex items-start gap-5"
                  >
                    <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                      factor.highlight 
                        ? 'bg-gradient-to-br from-[#D31145] via-[#CFAB7A] to-[#CFAB7A] shadow-xl shadow-[#D31145]/40' 
                        : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm'
                    } group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-[#D31145]/30 transition-all duration-300`}>
                      {/* Glow effect on hover */}
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        factor.highlight 
                          ? 'bg-gradient-to-br from-[#D31145]/50 to-[#CFAB7A]/50 blur-md' 
                          : 'bg-gradient-to-br from-[#D31145]/20 to-[#CFAB7A]/20 blur-sm'
                      }`} />
                      <Icon className={`relative z-10 w-7 h-7 ${factor.highlight ? 'text-white' : 'text-white/80 group-hover:text-white'} transition-colors duration-300`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className={`text-xl leading-relaxed ${
                        factor.highlight ? 'text-white font-medium' : 'text-white/70'
                      } group-hover:text-white transition-colors`}>
                        {factor.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="prose prose-invert max-w-none">
                <p className="text-2xl text-white/80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Based on an ML model trained on market analysis, performance metrics, and comparable arbitration cases, Joe Ryan's arbitration value is projected at{' '}
                  <span className="text-[#D31145] font-bold text-3xl" style={{ fontFamily: 'Georgia, serif' }}>
                    {predictedSalary}
                  </span>
                  . His exceptional strikeout capability and proven durability establish him among the top performers in the second-year arbitration class.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="text-center py-32"
        >
          <div className="mb-8 text-sm text-white/30 uppercase tracking-[0.4em]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Prepared For
          </div>
          <div 
            className="text-[clamp(4rem,15vw,10rem)] leading-none tracking-tight text-white"
            style={{
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            JOE RYAN
          </div>
          <div className="mt-8 text-xl text-white/40 tracking-[0.2em]" style={{ fontFamily: 'Inter, sans-serif' }}>
            MINNESOTA TWINS • 2026
          </div>
        </motion.div>
      </div>
    </div>
  );
}