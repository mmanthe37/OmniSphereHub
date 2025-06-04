import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-dark-secondary border-b border-dark-border p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-text-secondary">Welcome back, manage your Web3 portfolio</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="bg-dark-card hover:bg-dark-border">
            <Bell className="h-5 w-5 text-neon-cyan" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-dark-card hover:bg-dark-border">
            <Settings className="h-5 w-5 text-text-secondary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
