import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function VideoHero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <motion.div 
      style={{ opacity, scale }}
      className="fixed inset-0 z-0 flex items-center justify-center"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />
      </div>

      {/* Animated mesh gradient overlay with Twins colors */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D31145] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CFAB7A] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#CFAB7A] rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </motion.div>
  );
}