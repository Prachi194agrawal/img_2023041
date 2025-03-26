
import { useState, useEffect } from 'react';
import { 
  BarChart2, 
  AlertCircle, 
  Database, 
  Activity,
  ShieldAlert,
  AlertOctagon,
  Eye
} from 'lucide-react';
import StatusCard from '@/components/StatusCard';
import AnomalyChart from '@/components/AnomalyChart';
import TransactionTable from '@/components/TransactionTable';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    suspiciousTransactions: 0,
    alertsTriggered: 0,
    banksMonitored: 0
  });
  
  useEffect(() => {
    // Simulate data loading
    const loadData = setTimeout(() => {
      setStats({
        totalTransactions: 156432,
        suspiciousTransactions: 328,
        alertsTriggered: 42,
        banksMonitored: 7
      });
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(loadData);
  }, []);
  
  const trendData = {
    transactions: [245, 258, 273, 240, 261, 280, 274, 268, 290, 297, 310, 326],
    suspicious: [12, 14, 11, 15, 18, 16, 13, 19, 22, 26, 28, 34],
    alerts: [4, 3, 5, 3, 4, 6, 2, 5, 4, 7, 9, 11]
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 animate-slide-up opacity-0 [animation-delay:0.1s]">
          <h1 className="text-3xl font-semibold tracking-tight">Anomaly Detection Dashboard</h1>
          <p className="text-gray-medium mt-1">Monitor and analyze transaction patterns for suspicious activities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={BarChart2}
            change={{ value: 12, isPositive: true }}
            trend={trendData.transactions}
            className="animate-slide-up opacity-0 [animation-delay:0.2s]"
          />
          <StatusCard
            title="Suspicious Transactions"
            value={stats.suspiciousTransactions}
            icon={AlertCircle}
            change={{ value: 8, isPositive: false }}
            trend={trendData.suspicious}
            className="animate-slide-up opacity-0 [animation-delay:0.3s]"
          />
          <StatusCard
            title="Alerts Triggered"
            value={stats.alertsTriggered}
            icon={Activity}
            change={{ value: 15, isPositive: false }}
            trend={trendData.alerts}
            className="animate-slide-up opacity-0 [animation-delay:0.4s]"
          />
          <StatusCard
            title="Banks Monitored"
            value={stats.banksMonitored}
            icon={Database}
            className="animate-slide-up opacity-0 [animation-delay:0.5s]"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 animate-slide-up opacity-0 [animation-delay:0.6s]">
            <AnomalyChart />
          </div>
          
          <div className="glass-card rounded-xl p-6 animate-slide-up opacity-0 [animation-delay:0.7s]">
            <h2 className="text-xl font-semibold mb-4">Security Overview</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full text-blue-accent">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Detection Status</h3>
                  <p className="text-sm text-gray-medium mt-1">System is actively monitoring transactions for anomalies.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Recent Alerts</h3>
                  <p className="text-sm text-gray-medium mt-1">3 new suspicious patterns detected in the last 24 hours.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">System Health</h3>
                  <p className="text-sm text-gray-medium mt-1">All systems operational. Last update: 15 minutes ago.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="animate-slide-up opacity-0 [animation-delay:0.8s]">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
