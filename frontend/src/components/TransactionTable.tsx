
import { useState, useEffect } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  bank: string;
  status: 'normal' | 'suspicious' | 'flagged';
}

// Generate mock data for transactions
const generateTransactions = (count: number): Transaction[] => {
  const banks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'];
  const names = ['Raj Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Singh', 'Vikram Mehta', 'Sonia Gupta'];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Generate random amount between 1,000 and 50,000
    const amount = Math.floor(Math.random() * 49000) + 1000;
    
    // Determine status - make some transactions suspicious
    let status: 'normal' | 'suspicious' | 'flagged' = 'normal';
    if (amount > 40000) {
      status = 'flagged';
    } else if (amount > 30000) {
      status = 'suspicious';
    }
    
    return {
      id: `TXN${String(i).padStart(6, '0')}`,
      date: date.toLocaleDateString('en-GB'),
      name: names[Math.floor(Math.random() * names.length)],
      amount,
      bank: banks[Math.floor(Math.random() * banks.length)],
      status
    };
  });
};

const TransactionTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setTransactions(generateTransactions(20));
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    }
    
    const valueA = String(a[sortField]).toUpperCase();
    const valueB = String(b[sortField]).toUpperCase();
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const filteredTransactions = sortedTransactions.filter(transaction => {
    // Apply status filter
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.name.toLowerCase().includes(searchLower) ||
        transaction.bank.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const SortIcon = ({ field }: { field: keyof Transaction }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };
  
  // Render loading skeleton if data is loading
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="w-48 h-8 bg-gray-100 rounded shimmer"></div>
          <div className="w-64 h-10 bg-gray-100 rounded shimmer"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex py-4 border-b border-gray-100 animate-pulse">
            <div className="w-full grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-6 bg-gray-100 rounded shimmer"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="glass-card rounded-xl p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none h-10 pl-4 pr-10 bg-white rounded-full border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="suspicious">Suspicious</option>
              <option value="flagged">Flagged</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Transaction ID</span>
                  <SortIcon field="id" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('bank')}
              >
                <div className="flex items-center space-x-1">
                  <span>Bank</span>
                  <SortIcon field="bank" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <SortIcon field="amount" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-medium">
                  No transactions found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    transaction.status === 'flagged' ? 'bg-red-50' : 
                    transaction.status === 'suspicious' ? 'bg-yellow-50' : ''
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-dark">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-dark">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-dark">
                    {transaction.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-dark">
                    {transaction.bank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-dark">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn(
                      "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium w-fit",
                      transaction.status === 'normal' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'suspicious' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    )}>
                      {transaction.status === 'normal' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
