import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import joeRyanPitching from 'figma:asset/d7cfd5130cb5c782229ccb19168ce8ff44798b37.png';
import { useIsMobile } from './ui/use-mobile';

export function ArbitrationHero() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const y = isMobile ? "0%" : yTransform;
  const opacity = isMobile ? 1 : opacityTransform;

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Joe Ryan pitching background with blue overlay */}
      <div className="absolute inset-0">
        <img
          src={joeRyanPitching}
          alt="Joe Ryan pitching"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#002B5C]/80" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 w-full h-full flex flex-col items-center justify-center"
      >
        <div className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto pb-32 sm:pb-40">
          {/* Main title with Twins colors */}
          <motion.div
            initial={isMobile ? false : { opacity: 0, y: 40 }}
            animate={isMobile ? false : { opacity: 1, y: 0 }}
            transition={isMobile ? {} : { duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            <h1 
              className="text-[clamp(3rem,12vw,14rem)] leading-[0.85] tracking-[-0.02em] mb-4"
              style={{
                fontWeight: 800,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <span className="block text-white">
                JOE
              </span>
              <span className="block text-[#D31145]">
                RYAN
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with Twins branding */}
          <motion.div
            initial={isMobile ? false : { opacity: 0 }}
            animate={isMobile ? false : { opacity: 1 }}
            transition={isMobile ? {} : { duration: 1, delay: 1.4 }}
            className="space-y-2"
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#CFAB7A] tracking-[0.1em] sm:tracking-[0.15em] uppercase" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Minnesota Twins
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base md:text-xl text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span>Starting Pitcher</span>
              <span className="hidden sm:block w-1 h-1 bg-[#D31145] rounded-full" />
              <span>2nd Year Arbitration</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - Fixed at bottom */}
        <motion.div
          initial={isMobile ? false : { opacity: 0 }}
          animate={isMobile ? false : { opacity: 1 }}
          transition={isMobile ? {} : { duration: 1, delay: 2 }}
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={isMobile ? false : { y: [0, 12, 0] }}
            transition={isMobile ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 sm:gap-3"
          >
            <span className="text-white/60 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Scroll</span>
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#D31145]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}