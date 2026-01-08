import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { getLatestJoeRyanStats, type JoeRyanStats } from '../utils/dataLoader';
import { useIsMobile } from './ui/use-mobile';

export function StatsShowcase() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const [stats, setStats] = useState([
    { value: 0, label: 'Strikeouts', sublabel: 'Loading...', suffix: '', color: '#D31145' },
    { value: 0, label: 'ERA', sublabel: 'Loading...', suffix: '', color: '#CFAB7A' },
    { value: 0, label: 'Wins', sublabel: 'Loading...', suffix: '', color: '#CFAB7A' },
    { value: 0, label: 'Innings', sublabel: 'Loading...', suffix: '', color: '#D31145' }
  ]);

  useEffect(() => {
    getLatestJoeRyanStats().then((data: JoeRyanStats | null) => {
      if (data) {
        setStats([
          { 
            value: Math.round(data.strikeouts), 
            label: 'Strikeouts', 
            sublabel: 'Top 25 in AL', 
            suffix: '', 
            color: '#D31145' 
          },
          { 
            value: data.era, 
            label: 'ERA', 
            sublabel: 'Below League Avg', 
            suffix: '', 
            color: '#CFAB7A' 
          },
          { 
            value: Math.round(data.wins), 
            label: 'Wins', 
            sublabel: `${data.season} Season`, 
            suffix: '', 
            color: '#CFAB7A' 
          },
          { 
            value: Math.floor(data.innings), 
            label: 'Innings', 
            sublabel: 'Durability', 
            suffix: `.${Math.round((data.innings % 1) * 10)}`, 
            color: '#D31145' 
          }
        ]);
      }
    });
  }, []);

  const yOffsetTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [100, 0, -100]
  );

  return (
    <div ref={ref} className="relative z-10 py-6 md:py-16 lg:py-40 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            return (
              <motion.div
                key={index}
                style={{ y: isMobile ? 0 : yOffsetTransform }}
                initial={isMobile ? false : { opacity: 0 }}
                whileInView={isMobile ? false : { opacity: 1 }}
                transition={isMobile ? {} : { duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group hover-target cursor-pointer relative"
              >
                {/* Twins color glow on hover */}
                <motion.div 
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, ${stat.color}, transparent)`,
                  }}
                />
                
                <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10 backdrop-blur-xl group-hover:border-white/30 transition-all duration-500 group-hover:scale-105">
                  {/* Twins accent corner */}
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

                  {/* Stat value */}
                  <div className="mb-4">
                    <div 
                      className="text-6xl lg:text-8xl tracking-tight leading-none text-white"
                      style={{
                        fontWeight: 800,
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      <AnimatedCounter value={stat.value} duration={2.5} />
                      {stat.suffix}
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="space-y-2">
                    <div className="text-xl lg:text-2xl text-white/90 font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
                    <div className="text-sm text-white/40 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.sublabel}</div>
                  </div>

                  {/* Twins color progress bar */}
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
      </div>
    </div>
  );
}