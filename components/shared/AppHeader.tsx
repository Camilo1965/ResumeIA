import Link from 'next/link';
import { FileText, Users, History as HistoryIcon } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <FileText size={28} />
            <span className="text-xl font-bold">Resume AI</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/profiles" 
              className="flex items-center space-x-2 hover:text-accent-gold transition-colors"
            >
              <Users size={20} />
              <span>Profiles</span>
            </Link>
            <Link 
              href="/history" 
              className="flex items-center space-x-2 hover:text-accent-gold transition-colors"
            >
              <HistoryIcon size={20} />
              <span>History</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center font-semibold">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
