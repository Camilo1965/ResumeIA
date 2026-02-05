'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Mail, FileText, Clock, LogOut } from 'lucide-react';
import Link from 'next/link';

export function AuthenticatedUserMenu() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownVisible]);

  if (sessionStatus === 'loading') {
    return (
      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
    );
  }

  if (!sessionData?.user) {
    return null;
  }

  const userInitial = sessionData.user.name?.charAt(0).toUpperCase() || 
                      sessionData.user.email?.charAt(0).toUpperCase() || '?';

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSignOutClick = async () => {
    setDropdownVisible(false);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div ref={menuContainerRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        {sessionData.user.image ? (
          <img 
            src={sessionData.user.image} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-accent-gold"
          />
        ) : (
          <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center font-semibold text-white">
            {userInitial}
          </div>
        )}
        <ChevronDown size={16} className={`transition-transform ${dropdownVisible ? 'rotate-180' : ''}`} />
      </button>

      {dropdownVisible && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User size={14} />
              <span className="font-medium text-gray-900">{sessionData.user.name || 'User'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail size={12} />
              <span>{sessionData.user.email}</span>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/profiles"
              onClick={() => setDropdownVisible(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <FileText size={18} className="text-accent-teal" />
              <span className="text-sm font-medium">My Profiles</span>
            </Link>

            <Link
              href="/history"
              onClick={() => setDropdownVisible(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <Clock size={18} className="text-accent-cyan" />
              <span className="text-sm font-medium">CV History</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={handleSignOutClick}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors w-full"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
