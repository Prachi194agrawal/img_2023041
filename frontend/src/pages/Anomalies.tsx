
import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  User, 
  Shield,
  Building, 
  RefreshCcw,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AnomalyChart from '@/components/AnomalyChart';

// Mock data for anomalies
const generateAnomalies = () => {
  const anomalies = [];
  const banks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'];
  const patterns = [
    'Multiple small transactions from different accounts',
    'Unusual transaction volume from dormant account',
    'Similar transactions across multiple banks',
    'Transaction splitting pattern detected',
    'Unusual location for transaction origin'
  ];
  
  for (let i = 0; i < 8; i++) {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));
    
    anomalies.push({
      id: `ANM${String(i).padStart(6, '0')}`,
      timestamp: date,
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      bank: banks[Math.floor(Math.random() * banks.length)],
      risk: Math.random() < 0.3 ? 'high' : (Math.random() < 0.7 ? 'medium' : 'low'),
      accounts: Math.floor(Math.random() * 5) + 2,
      totalAmount: Math.floor(Math.random() * 490000) + 10000
    });
  }
  
  return anomalies;
};

const RiskBadge = ({ risk }: { risk: string }) => {
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-xs font-semibold w-fit",
      risk === 'high' ? 'bg-red-100 text-red-800' :
      risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'
    )}>
      {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
    </div>
  );
};

const Anomalies = () => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const data = generateAnomalies();
      setAnomalies(data);
      setSelectedAnomaly(data[0]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAnomalies(generateAnomalies());
      setIsRefreshing(false);
    }, 1000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass-card h-96 rounded-xl flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-md">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-24 bg-gray-200 rounded w-full mx-auto mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-slide-up opacity-0 [animation-delay:0.1s]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Anomaly Detection</h1>
            <p className="text-gray-medium mt-1">Review and investigate detected transaction anomalies</p>
          </div>
          
          <Button 
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl overflow-hidden animate-slide-up opacity-0 [animation-delay:0.2s]">
            <div className="p-4 bg-blue-accent/10 border-b border-blue-accent/20">
              <h2 className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-accent" />
                Detected Anomalies
              </h2>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {anomalies.map((anomaly) => (
                <div 
                  key={anomaly.id}
                  className={cn(
                    "p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50",
                    selectedAnomaly?.id === anomaly.id ? "bg-blue-50 border-l-4 border-l-blue-accent" : ""
                  )}
                  onClick={() => setSelectedAnomaly(anomaly)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{anomaly.id}</div>
                    <RiskBadge risk={anomaly.risk} />
                  </div>
                  
                  <p className="text-sm text-gray-medium line-clamp-2 mb-2">
                    {anomaly.pattern}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-medium">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(anomaly.timestamp)}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      <span>{anomaly.bank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 animate-slide-up opacity-0 [animation-delay:0.3s]">
            {selectedAnomaly ? (
              <div className="glass-card rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold">{selectedAnomaly.id}</h2>
                      <ChevronRight className="h-5 w-5 mx-2 text-gray-medium" />
                      <RiskBadge risk={selectedAnomaly.risk} />
                    </div>
                    <p className="text-gray-medium">
                      Detected on {formatDate(selectedAnomaly.timestamp)} at {formatTime(selectedAnomaly.timestamp)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Mark as False Positive</span>
                    </Button>
                    <Button className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Escalate</span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-medium mb-1">Pattern</h3>
                    <p className="font-medium">{selectedAnomaly.pattern}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-medium mb-1">Related Accounts</h3>
                    <p className="font-medium">{selectedAnomaly.accounts} accounts involved</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-medium mb-1">Total Amount</h3>
                    <p className="font-medium">₹{selectedAnomaly.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Transaction Flow</h3>
                  <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-blue-accent" />
                      </div>
                      <span className="text-sm font-medium">Source Account</span>
                    </div>
                    
                    <div className="flex-1 px-4">
                      <div className="relative h-0.5 bg-gray-200 w-full">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-medium text-sm">
                          Multiple Transfers
                        </div>
                        <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <Building className="h-6 w-6 text-red-500" />
                      </div>
                      <span className="text-sm font-medium">Multiple Banks</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Transaction Pattern Analysis</h3>
                  <div className="h-64">
                    <AnomalyChart />
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center h-full text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Anomaly Selected</h3>
                <p className="text-gray-medium max-w-md">
                  Select an anomaly from the list to view detailed information and analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anomalies;
