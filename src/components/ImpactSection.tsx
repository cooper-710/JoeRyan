import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import joeRyanPitching from 'figma:asset/d7cfd5130cb5c782229ccb19168ce8ff44798b37.png';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { useIsMobile } from './ui/use-mobile';

export function ImpactSection() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scaleTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotateTransform = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = isMobile ? 1 : scaleTransform;
  const rotate = isMobile ? 0 : rotateTransform;

  const [strikeouts, setStrikeouts] = useState(0);
  const [kPer9, setKPer9] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [prevSeason, setPrevSeason] = useState(2023);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      if (seasons.length > 0) {
        const latest = seasons[0];
        // Use latest season (2025) strikeouts
        setStrikeouts(Math.round(latest.strikeouts));
        setKPer9(latest.kPer9);
        
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
    <div ref={ref} className="relative py-6 md:py-24 lg:py-60 px-6 overflow-hidden">
      {/* Joe Ryan pitching image in background */}
      <div className="absolute inset-0">
        <img
          src={joeRyanPitching}
          alt="Joe Ryan pitching"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      {/* Rotating Twins gradient orb */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ rotate }}
      >
        <div className="w-[800px] h-[800px] rounded-full" style={{
          background: 'conic-gradient(from 0deg, #CFAB7A 0%, #D31145 33%, #CFAB7A 66%, #CFAB7A 100%)',
          filter: 'blur(120px)',
          opacity: 0.2
        }} />
      </motion.div>

      <motion.div
        style={{ scale }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Main feature number with 3D effect */}
        <motion.div
          initial={isMobile ? false : { opacity: 0, y: 80 }}
          whileInView={isMobile ? false : { opacity: 1, y: 0 }}
          transition={isMobile ? {} : { duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-32 text-center relative"
        >
          {/* Shadow layer for 3D effect with Twins colors */}
          <div 
            className="absolute inset-0 text-[clamp(10rem,30vw,24rem)] leading-none tracking-tighter flex items-center justify-center text-[#D31145]/40"
            style={{
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              transform: 'translateY(20px)',
              filter: 'blur(20px)',
            }}
          >
            <AnimatedCounter value={strikeouts} duration={3} />
          </div>

          {/* Main number with Twins gradient */}
          <div 
            className="relative text-[clamp(10rem,30vw,24rem)] leading-none tracking-tighter text-white"
            style={{
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <AnimatedCounter value={strikeouts} duration={3} />
          </div>
          
          <motion.div
            initial={isMobile ? false : { opacity: 0, y: 20 }}
            whileInView={isMobile ? false : { opacity: 1, y: 0 }}
            transition={isMobile ? {} : { duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div className="text-5xl md:text-7xl text-white/70 tracking-[0.2em] uppercase font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
              Strikeouts
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div className="h-1 w-64 bg-gradient-to-r from-[#D31145] via-[#D31145] to-[#CFAB7A] rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Feature grid with Twins colors */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Top 25', 
              subtitle: 'AL Ranking', 
              description: 'Elite strikeout capability among American League pitchers',
              gradient: 'from-[#D31145] to-[#D31145]'
            },
            { 
              title: `${growth > 0 ? '+' : ''}${growth}`, 
              subtitle: 'Growth', 
              description: `Strikeout increase from ${prevSeason} season`,
              gradient: 'from-[#D31145] to-[#CFAB7A]'
            },
            { 
              title: kPer9.toFixed(1), 
              subtitle: 'K/9 Rate', 
              description: 'Strikeouts per nine innings pitched',
              gradient: 'from-[#CFAB7A] to-[#CFAB7A]'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={isMobile ? false : { opacity: 0, y: 50, rotateX: -20 }}
              whileInView={isMobile ? false : { opacity: 1, y: 0, rotateX: 0 }}
              transition={isMobile ? {} : { duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group hover-target cursor-pointer relative"
              style={{ perspective: '1000px' }}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${item.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700`} />
              
              <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl overflow-hidden group-hover:border-[#D31145]/50 transition-all duration-500 group-hover:scale-105">
                {/* Animated gradient overlay */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}
                />
                
                <div className="relative space-y-6">
                  <div 
                    className="text-8xl tracking-tight text-[#D31145]"
                    style={{
                      fontWeight: 800,
                      fontFamily: 'Georgia, serif'
                    }}
                  >
                    {item.title}
                  </div>
                  <div className="text-3xl text-white font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>{item.subtitle}</div>
                  <div className="text-lg text-white/50 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{item.description}</div>
                  
                  {/* Animated underline */}
                  <motion.div 
                    className={`h-1 bg-gradient-to-r ${item.gradient} rounded-full`}
                    initial={isMobile ? false : { width: 0 }}
                    whileInView={isMobile ? false : { width: '60%' }}
                    transition={isMobile ? {} : { duration: 1, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}