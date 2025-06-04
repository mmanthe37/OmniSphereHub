import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Zap,
  Moon,
  Sun,
  Monitor,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [darkMode, setDarkMode] = useState('system');
  const [notifications, setNotifications] = useState({
    trades: true,
    social: true,
    portfolio: false,
    system: true
  });

  if (!isOpen) return null;

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'advanced', label: 'Advanced', icon: Zap },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-rajdhani font-bold text-white">{user?.name || "Alex Chen"}</h3>
                <p className="text-gray-400 font-inter">{user?.username || "@alex_chen"}</p>
                <Badge className="mt-2 bg-purple-600/20 text-purple-300 border-purple-500/30">
                  {user?.tier || "Pro Trader"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm font-inter">Total Portfolio</p>
                <p className="text-2xl font-orbitron font-bold text-cyan-400">$127,582</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm font-inter">Member Since</p>
                <p className="text-lg font-inter font-medium text-white">March 2024</p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-rajdhani font-bold text-white mb-4">Notification Preferences</h3>
            
            {Object.entries({
              trades: 'Trade Executions',
              social: 'Social Activity',
              portfolio: 'Portfolio Updates',
              system: 'System Alerts'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-inter font-medium text-white">{label}</p>
                  <p className="text-sm text-gray-400">Receive notifications for {label.toLowerCase()}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications] 
                      ? 'bg-purple-600' 
                      : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[key as keyof typeof notifications] 
                      ? 'translate-x-6' 
                      : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-rajdhani font-bold text-white mb-4">Security Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-inter font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-400">Enabled via authenticator app</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-green-500/30 text-green-400">
                  Configured
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-inter font-medium text-white">Hardware Wallet</p>
                    <p className="text-sm text-gray-400">Connect hardware wallet for enhanced security</p>
                  </div>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-inter font-medium text-white">Session Management</p>
                    <p className="text-sm text-gray-400">Auto-logout after 24 hours</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-rajdhani font-bold text-white mb-4">Theme Preferences</h3>
            
            <div className="space-y-3">
              {[
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'light', label: 'Light Mode', icon: Sun },
                { id: 'system', label: 'System Default', icon: Monitor }
              ].map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setDarkMode(theme.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                      darkMode === theme.id 
                        ? 'bg-purple-600/20 border border-purple-500/50' 
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-purple-400" />
                    <span className="font-inter font-medium text-white">{theme.label}</span>
                    {darkMode === theme.id && (
                      <CheckCircle className="w-5 h-5 text-purple-400 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400 font-inter">Settings panel for {activeSection}</p>
            <p className="text-sm text-gray-500 mt-2">Feature coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 md:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] bg-gray-900 border-purple-500/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-purple-900 border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl font-rajdhani text-white">Settings</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex flex-col md:flex-row h-[calc(95vh-80px)] md:h-[600px]">
          {/* Mobile Tabs */}
          <div className="md:hidden border-b border-gray-700/50 p-2">
            <div className="flex overflow-x-auto space-x-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeSection === section.id
                        ? 'bg-purple-600/20 text-white border border-purple-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-inter text-sm">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 bg-gray-800/50 border-r border-gray-700/50 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-600/20 text-white border border-purple-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-inter">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}