
import { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

const AnimatedNumber = ({
  value,
  duration = 1000,
  formatter = (val) => val.toLocaleString(),
  className = ''
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    
    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(startValue + progress * (value - startValue)));
      
      if (progress < 1) {
        window.requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(animateValue);
    
    return () => {
      startTime = null;
    };
  }, [value, duration]);
  
  return (
    <span className={`relative overflow-hidden inline-block ${className}`}>
      <span className="animate-number-change">{formatter(displayValue)}</span>
    </span>
  );
};

export default AnimatedNumber;
