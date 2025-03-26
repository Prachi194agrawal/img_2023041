
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Download, Search, RefreshCcw } from 'lucide-react';
import TransactionTable from '@/components/TransactionTable';

const Transactions = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-slide-up opacity-0 [animation-delay:0.1s]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
            <p className="text-gray-medium mt-1">View, search and filter all transactions in the system</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleRefresh}
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            
            <Button className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 mb-8 animate-slide-up opacity-0 [animation-delay:0.2s]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ID..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank</label>
              <select className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none appearance-none">
                <option value="">All Banks</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="relative">
                <select 
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none appearance-none"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="relative">
                <select className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none appearance-none">
                  <option value="">All Status</option>
                  <option value="normal">Normal</option>
                  <option value="suspicious">Suspicious</option>
                  <option value="flagged">Flagged</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline">Reset Filters</Button>
            <Button>Apply Filters</Button>
          </div>
        </div>
        
        <div className="animate-slide-up opacity-0 [animation-delay:0.3s]">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
