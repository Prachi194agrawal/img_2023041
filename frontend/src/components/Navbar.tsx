
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart2, 
  Search, 
  Bell, 
  Settings, 
  AlertCircle,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: BarChart2 },
    { path: '/transactions', label: 'Transactions', icon: Search },
    { path: '/anomalies', label: 'Anomalies', icon: AlertCircle },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "py-2 bg-white/80 backdrop-blur-md shadow-sm" : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-accent" />
          <span className="text-xl font-semibold tracking-tight">AnomalyDetector</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "px-4 py-2 rounded-full flex items-center space-x-2 transition-all",
                location.pathname === path 
                  ? "bg-blue-accent/10 text-blue-accent font-medium" 
                  : "text-gray-dark hover:bg-gray-100 font-normal"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <div 
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              searchFocused ? "w-64" : "w-48"
            )}
          >
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 focus:border-blue-accent focus:ring-1 focus:ring-blue-accent outline-none transition-all duration-300"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-dark" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-alert-red rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
