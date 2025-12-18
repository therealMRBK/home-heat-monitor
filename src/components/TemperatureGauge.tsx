import { useMemo } from 'react';

interface TemperatureGaugeProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TemperatureGauge({ 
  value, 
  min = 0, 
  max = 100, 
  unit = '°C',
  size = 'md' 
}: TemperatureGaugeProps) {
  const percentage = useMemo(() => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }, [value, min, max]);

  const getColor = (percent: number) => {
    if (percent < 25) return 'hsl(210, 90%, 60%)'; // Cold blue
    if (percent < 50) return 'hsl(200, 80%, 50%)'; // Cool blue
    if (percent < 75) return 'hsl(25, 95%, 53%)';  // Warm orange
    return 'hsl(0, 85%, 55%)'; // Hot red
  };

  const sizeClasses = {
    sm: { container: 'w-20 h-20', text: 'text-lg', unit: 'text-xs' },
    md: { container: 'w-28 h-28', text: 'text-2xl', unit: 'text-sm' },
    lg: { container: 'w-36 h-36', text: 'text-3xl', unit: 'text-base' },
  };

  const radius = size === 'sm' ? 32 : size === 'md' ? 46 : 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  return (
    <div className={`relative ${sizeClasses[size].container} flex items-center justify-center`}>
      <svg className="absolute transform -rotate-135" viewBox="0 0 140 140">
        {/* Background arc */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        />
        {/* Value arc */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="text-center z-10">
        <span className={`${sizeClasses[size].text} font-bold text-foreground`}>
          {value.toFixed(1)}
        </span>
        <span className={`${sizeClasses[size].unit} text-muted-foreground ml-1`}>
          {unit}
        </span>
      </div>
    </div>
  );
}
