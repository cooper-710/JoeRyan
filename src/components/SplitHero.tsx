import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';

export function SplitHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 100]);
  const rightX = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const [strikeouts, setStrikeouts] = useState(0);
  const [season, setSeason] = useState(2024);
  const [growth, setGrowth] = useState(0);
  const [prevSeason, setPrevSeason] = useState(2023);
  const [era, setEra] = useState(0);
  const [wins, setWins] = useState(0);
  const [innings, setInnings] = useState(0);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      if (seasons.length > 0) {
        const latest = seasons[0];
        // Use latest season (2025) strikeouts
        setStrikeouts(Math.round(latest.strikeouts));
        setSeason(latest.season);
        setEra(latest.era);
        setWins(Math.round(latest.wins));
        setInnings(latest.innings);
        
        // Find previous season for growth calculation
        if (seasons.length > 1) {
          const prev = seasons.find(s => s.season === latest.season - 1);
          if (prev) {
            setPrevSeason(prev.season);
            const growthValue = Math.round(latest.strikeouts - prev.strikeouts);
            setGrowth(growthValue);
          }
        }
      }
    });
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left side - Dramatic stat */}
          <motion.div
            style={{ x: leftX }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Twins color glow */}
              <div className="absolute -inset-20 bg-gradient-to-br from-[#D31145]/40 via-[#CFAB7A]/40 to-[#CFAB7A]/40 blur-[120px] opacity-60" />
              
              <div className="relative">
                <div className="text-[clamp(4rem,15vw,18rem)] leading-none tracking-tighter font-black">
                  <span 
                    className="block text-white"
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {strikeouts}
                  </span>
                </div>
                <div className="mt-6 sm:mt-8">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Strikeouts</div>
                  <div className="text-xl sm:text-2xl text-white/50" style={{ fontFamily: 'Inter, sans-serif' }}>{season} Season Performance</div>
                  <div className="mt-6 h-2 w-32 sm:w-48 bg-gradient-to-r from-[#D31145] via-[#CFAB7A] to-[#CFAB7A] rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Context */}
          <motion.div
            style={{ x: rightX }}
            className="space-y-8 sm:space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group hover-target cursor-pointer"
            >
              <div className="relative p-10 bg-gradient-to-br from-white/10 to-white/5 border border-[#D31145]/30 rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-[#D31145]/60 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D31145]/0 to-[#D31145]/0 group-hover:from-[#D31145]/20 group-hover:to-[#D31145]/10 transition-all duration-500" />
                <div className="relative">
                  <div className="text-7xl mb-4 font-black text-[#CFAB7A]" style={{ fontFamily: 'Georgia, serif' }}>
                    {era.toFixed(2)}
                  </div>
                  <div className="text-2xl text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>ERA</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="group hover-target cursor-pointer"
            >
              <div className="relative p-10 bg-gradient-to-br from-white/10 to-white/5 border border-[#CFAB7A]/30 rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-[#CFAB7A]/60 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#CFAB7A]/0 to-[#CFAB7A]/0 group-hover:from-[#CFAB7A]/20 group-hover:to-[#CFAB7A]/10 transition-all duration-500" />
                <div className="relative">
                  <div className="text-7xl mb-4 font-black text-[#D31145]" style={{ fontFamily: 'Georgia, serif' }}>
                    {Math.floor(innings)}
                    <span className="text-5xl">.{Math.round((innings % 1) * 10)}</span>
                  </div>
                  <div className="text-2xl text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>Innings</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}