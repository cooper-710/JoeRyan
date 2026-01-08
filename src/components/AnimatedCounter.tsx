import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({ value, duration = 2, className = '', decimals = 0 }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, count, value, duration]);

  return (
    <motion.span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
    </motion.span>
  );
}
