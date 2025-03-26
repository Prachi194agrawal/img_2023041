
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

interface StatusCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: {
    value: number;
    isPositive: boolean;
  };
  trend?: number[];
  formatter?: (value: number) => string;
  className?: string;
}

const StatusCard = ({
  title,
  value,
  icon: Icon,
  change,
  trend = [],
  formatter = (val) => val.toLocaleString(),
  className
}: StatusCardProps) => {
  const trendPoints = trend.length > 0 
    ? trend.map((point, i) => {
        const max = Math.max(...trend);
        const min = Math.min(...trend);
        const range = max - min || 1;
        const normalized = ((point - min) / range) * 40; // 40px max height
        return `${(i / (trend.length - 1)) * 100}% ${100 - normalized}%`;
      }).join(', ')
    : '';

  return (
    <div className={cn(
      "glass-card p-6 rounded-xl overflow-hidden transition-all hover:shadow-card-hover",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-medium">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold">
              <AnimatedNumber value={value} formatter={formatter} />
            </span>
            {change && (
              <span className={cn(
                "text-xs font-medium",
                change.isPositive ? "text-alert-green" : "text-alert-red"
              )}>
                {change.isPositive ? '↑' : '↓'} {change.value}%
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-full",
          "bg-blue-accent/10 text-blue-accent"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {trend.length > 0 && (
        <div className="h-10 mt-2 relative">
          <svg width="100%" height="100%" className="overflow-visible">
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(14, 165, 233, 0.5)" />
                <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
              </linearGradient>
            </defs>
            <path
              d={`M0,100% ${trendPoints} 100%,100%`}
              fill="url(#trendGradient)"
              className="opacity-50"
            />
            <polyline
              points={trendPoints}
              fill="none"
              stroke="rgba(14, 165, 233, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
