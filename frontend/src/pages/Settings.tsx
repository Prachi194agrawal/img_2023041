
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Lock,
  Save,
  Check,
  AlertOctagon,
  Settings2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('detection');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    app: true
  });
  const [thresholdSettings, setThresholdSettings] = useState({
    transactionAmount: 25000,
    transactionFrequency: 15,
    accountAge: 90
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholdSettings({
      ...thresholdSettings,
      [name]: parseInt(value)
    });
  };
  
  const tabOptions = [
    { id: 'detection', label: 'Detection Settings', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Bank Integrations', icon: Database },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'advanced', label: 'Advanced', icon: Settings2 }
  ];
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center mb-8 animate-slide-up opacity-0 [animation-delay:0.1s]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-gray-medium mt-1">Configure your anomaly detection system</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-xl p-4 lg:p-6 animate-slide-up opacity-0 [animation-delay:0.2s]">
            <div className="space-y-1 mb-6">
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                      activeTab === tab.id
                        ? "bg-blue-accent/10 text-blue-accent font-medium"
                        : "hover:bg-gray-100 text-gray-dark"
                    )}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">System Status</h3>
                  <p className="text-xs text-gray-medium">All systems operational</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 animate-slide-up opacity-0 [animation-delay:0.3s]">
            {activeTab === 'detection' && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Detection Settings</h2>
                  <Button
                    onClick={handleSave}
                    className="flex items-center space-x-2"
                    disabled={saveSuccess}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Anomaly Thresholds</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Transaction Amount (₹)</span>
                          <span className="text-sm text-gray-medium">₹{thresholdSettings.transactionAmount.toLocaleString()}</span>
                        </label>
                        <input
                          type="range"
                          min="5000"
                          max="50000"
                          step="1000"
                          name="transactionAmount"
                          value={thresholdSettings.transactionAmount}
                          onChange={handleThresholdChange}
                          className="w-full accent-blue-accent"
                        />
                        <div className="flex justify-between text-xs text-gray-medium mt-1">
                          <span>₹5,000</span>
                          <span>₹50,000</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Transaction Frequency (per hour)</span>
                          <span className="text-sm text-gray-medium">{thresholdSettings.transactionFrequency}</span>
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          name="transactionFrequency"
                          value={thresholdSettings.transactionFrequency}
                          onChange={handleThresholdChange}
                          className="w-full accent-blue-accent"
                        />
                        <div className="flex justify-between text-xs text-gray-medium mt-1">
                          <span>5</span>
                          <span>30</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Account Age Threshold (days)</span>
                          <span className="text-sm text-gray-medium">{thresholdSettings.accountAge}</span>
                        </label>
                        <input
                          type="range"
                          min="30"
                          max="180"
                          step="5"
                          name="accountAge"
                          value={thresholdSettings.accountAge}
                          onChange={handleThresholdChange}
                          className="w-full accent-blue-accent"
                        />
                        <div className="flex justify-between text-xs text-gray-medium mt-1">
                          <span>30</span>
                          <span>180</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Detection Rules</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertOctagon className="h-5 w-5 text-blue-accent" />
                          <span className="font-medium">Multiple small transactions</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertOctagon className="h-5 w-5 text-blue-accent" />
                          <span className="font-medium">Cross-bank pattern detection</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertOctagon className="h-5 w-5 text-blue-accent" />
                          <span className="font-medium">Unusual timing detection</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertOctagon className="h-5 w-5 text-blue-accent" />
                          <span className="font-medium">ML-based anomaly detection</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Analysis Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Real-Time Analysis</h4>
                        <RefreshCw className="h-4 w-4 text-blue-accent" />
                      </div>
                      <p className="text-sm text-gray-medium">Continuous monitoring of all incoming transactions.</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Daily Batch Analysis</h4>
                        <span className="text-xs text-gray-medium">01:00 AM</span>
                      </div>
                      <p className="text-sm text-gray-medium">Deep analysis of transaction patterns daily.</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Weekly Report</h4>
                        <span className="text-xs text-gray-medium">Sunday</span>
                      </div>
                      <p className="text-sm text-gray-medium">Comprehensive weekly analysis report generation.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                  <p className="text-gray-medium mt-1">Configure how you receive alerts and notifications</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Notification Channels</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-medium">Receive alerts via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.email}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              email: !notificationSettings.email
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-gray-medium">Receive alerts via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.sms}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              sms: !notificationSettings.sms
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">In-App Notifications</h4>
                          <p className="text-sm text-gray-medium">Receive alerts within the app</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationSettings.app}
                            onChange={() => setNotificationSettings({
                              ...notificationSettings,
                              app: !notificationSettings.app
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-accent"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Alert Types</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 rounded text-blue-accent focus:ring-blue-accent" defaultChecked />
                        <div>
                          <h4 className="font-medium">High Risk Alerts</h4>
                          <p className="text-sm text-gray-medium">Critical security alerts requiring immediate attention</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 rounded text-blue-accent focus:ring-blue-accent" defaultChecked />
                        <div>
                          <h4 className="font-medium">Medium Risk Alerts</h4>
                          <p className="text-sm text-gray-medium">Potential issues that should be reviewed</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 rounded text-blue-accent focus:ring-blue-accent" />
                        <div>
                          <h4 className="font-medium">Low Risk Alerts</h4>
                          <p className="text-sm text-gray-medium">Informational alerts for minor deviations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 rounded text-blue-accent focus:ring-blue-accent" defaultChecked />
                        <div>
                          <h4 className="font-medium">System Notifications</h4>
                          <p className="text-sm text-gray-medium">Updates about system maintenance and changes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-right">
                  <Button 
                    onClick={handleSave}
                    className="flex items-center space-x-2"
                    disabled={saveSuccess}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {(activeTab === 'integrations' || activeTab === 'security' || activeTab === 'advanced') && (
              <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center py-12">
                <SettingsIcon className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {activeTab === 'integrations' ? 'Bank Integrations' : 
                   activeTab === 'security' ? 'Security Settings' : 
                   'Advanced Settings'}
                </h3>
                <p className="text-gray-medium max-w-md">
                  This section is under development. Additional configurations will be available in a future update.
                </p>
                <Button variant="outline" className="mt-6">
                  Explore Documentation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
