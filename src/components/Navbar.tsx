"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, Building2, ClipboardList, Settings } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
    { href: '/universities', label: 'Universities', icon: Building2 },
    { href: '/tracker', label: 'Tracker', icon: ClipboardList },
    { href: '/admin/scholarships', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-lg tracking-tight">
              Scholar<span className="text-indigo-400">Hub</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
