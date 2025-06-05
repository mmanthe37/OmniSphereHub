import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { LogOut, User } from "lucide-react";

export default function PublicHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            OmniSphere
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#markets" className="text-slate-300 hover:text-white transition-colors">
              Markets
            </a>
            <a href="#trading" className="text-slate-300 hover:text-white transition-colors">
              Trading
            </a>
            <a href="#defi" className="text-slate-300 hover:text-white transition-colors">
              DeFi
            </a>
            <a href="#ai-bot" className="text-slate-300 hover:text-white transition-colors">
              AI Trading
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-white">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-slate-400">
                Test Account: testuser@omnisphere.com / password123
              </div>
              <AuthModal>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </AuthModal>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}