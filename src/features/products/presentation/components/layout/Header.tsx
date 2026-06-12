import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface HeaderProps {
  title?: string;
  userName?: string;
  role?: 'customer' | 'staff' | 'admin';
}

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-1">
          <LogOut className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Sign Out?</h2>
        <p className="text-sm text-gray-500 text-center">Are you sure you want to log out of AutoWash Pro?</p>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export function Header({ title = 'Dashboard', userName = 'John Doe', role = 'customer' }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const initials = userName.split(' ').map(n => n[0]).join('');

  const settingsPath =
    role === 'admin' ? '/settings' :
    role === 'staff' ? '/settings' :
    '/settings';

  const profilePath = '/profile';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'staff' ? 'Staff' : 'Customer';

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
        <div className="h-full px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-3 focus:outline-none group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white select-none">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{roleLabel}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50
                  transition-all duration-200 origin-top
                  ${open ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
                style={{ transformOrigin: 'top right' }}
              >
                <button
                  onClick={() => { setOpen(false); navigate(profilePath); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => { setOpen(false); navigate(settingsPath); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={() => { setOpen(false); setShowLogout(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showLogout && (
        <LogoutModal
          onConfirm={() => { setShowLogout(false); navigate('/login'); }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
}
