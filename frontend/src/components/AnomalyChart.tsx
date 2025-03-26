
import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';

// Sample data for the chart
const generateData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseline = 500;
  const anomalyAt = Math.floor(Math.random() * 12);
  
  for (let i = 0; i < 12; i++) {
    let value = baseline + Math.random() * 200 - 100;
    
    // Create an anomaly spike
    if (i === anomalyAt) {
      value = baseline + 400 + Math.random() * 200;
    }
    
    data.push({
      name: months[i],
      value: Math.round(value),
      anomaly: i === anomalyAt ? Math.round(value) : 0,
      isAnomaly: i === anomalyAt
    });
  }
  
  return data;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const isAnomaly = payload[0].payload.isAnomaly;
    
    return (
      <div className="glass-card p-3 shadow-lg border border-gray-200 rounded-lg">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-blue-accent font-semibold">
          {payload[0].value.toLocaleString()} transactions
        </p>
        {isAnomaly && (
          <p className="text-alert-red font-medium text-xs mt-1">
            Anomaly detected!
          </p>
        )}
      </div>
    );
  }

  return null;
};

const AnomalyChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [threshold, setThreshold] = useState(700);
  
  useEffect(() => {
    setIsLoading(true);
    // Simulate fetch delay
    const timeout = setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (isLoading) {
    return (
      <div className="glass-card h-72 rounded-xl p-6 flex items-center justify-center">
        <div className="shimmer w-full h-48 rounded-lg bg-gray-100"></div>
      </div>
    );
  }
  
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Transaction Analysis</h2>
          <p className="text-gray-medium">Monthly transaction volume with anomaly detection</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-medium">Anomaly Threshold:</span>
          <input 
            type="range" 
            min="600" 
            max="1000" 
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="accent-blue-accent"
          />
          <span className="text-sm font-medium">{threshold}</span>
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={threshold} stroke="#F59E0B" strokeDasharray="3 3" label="Threshold" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0EA5E9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="anomaly"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAnomaly)"
              activeDot={{ r: 8, strokeWidth: 2, stroke: "#FFFFFF" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnomalyChart;
