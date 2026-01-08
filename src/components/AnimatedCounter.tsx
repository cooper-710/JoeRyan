interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({ value, className = '', decimals = 0 }: AnimatedCounterProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  return (
    <span className={className}>
      {displayValue}
    </span>
  );
}
