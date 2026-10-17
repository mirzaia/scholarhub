"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    GraduationCap,
    ClipboardList,
    Building2,
    Settings,
    Menu,
    ChevronRight,
    Search,
    Bookmark,
} from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { href: "/tracker", label: "Tracker", icon: ClipboardList },
    { href: "/universities", label: "Universities", icon: Building2 },
    { href: "/admin/scholarships", label: "Admin", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Compute breadcrumbs from current pathname
    const getBreadcrumbs = () => {
        if (pathname === "/") return ["Home", "Dashboards", "Overview"];
        if (pathname.startsWith("/scholarships/")) return ["Home", "Scholarships", "Detail"];
        if (pathname === "/scholarships") return ["Home", "Scholarships", "Catalog"];
        if (pathname === "/tracker") return ["Home", "Dashboards", "Application Tracker"];
        if (pathname.startsWith("/universities/")) return ["Home", "Universities", "Detail"];
        if (pathname === "/universities") return ["Home", "Universities", "Directory"];
        if (pathname.startsWith("/admin")) return ["Home", "System", "Admin"];
        return ["Home", "Dashboard"];
    };

    const crumbs = getBreadcrumbs();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#111217] text-[#ccccdc]">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar (Grafana style) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#181b1f] border-r border-[rgba(204,204,220,0.07)] transition-all duration-200 md:static ${
                    collapsed ? "w-14" : "w-60"
                } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-2.5 h-12 px-4 border-b border-[rgba(204,204,220,0.07)] overflow-hidden">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-[#3d71d9]/20 text-[#6e9fff] flex-shrink-0">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                    {!collapsed && (
                        <span className="font-semibold text-[15px] tracking-tight text-[#e6e6f0] whitespace-nowrap">
                            Scholar<span className="text-[#6e9fff]">Hub</span>
                        </span>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? item.label : undefined}
                                className={`relative flex items-center gap-3 h-9 px-2.5 rounded text-[13px] font-medium transition-colors ${
                                    isActive
                                        ? "bg-[rgba(204,204,220,0.1)] text-[#e6e6f0]"
                                        : "text-[rgba(204,204,220,0.78)] hover:bg-[rgba(204,204,220,0.06)] hover:text-[#e6e6f0]"
                                }`}
                            >
                                {/* Grafana orange-red active bar */}
                                {isActive && (
                                    <span className="absolute -left-2 top-1 bottom-1 w-[3px] rounded-r bg-gradient-to-b from-[#ff8833] to-[#f55f3e]" />
                                )}
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-[rgba(204,204,220,0.07)] text-[11px] text-[rgba(204,204,220,0.62)] overflow-hidden">
                    {!collapsed ? (
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-medium text-[rgba(204,204,220,0.78)] truncate">
                                <span className="w-2 h-2 rounded-full bg-[#0ca30c]" />
                                <span>Neon DB • Connected</span>
                            </div>
                            <p className="truncate">Default User (Indonesian)</p>
                            <p className="text-[10px] text-[rgba(204,204,220,0.4)]">v0.2.0-grafana</p>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <span className="w-2 h-2 rounded-full bg-[#0ca30c]" title="DB Connected" />
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
                {/* Topbar (Grafana style) */}
                <header className="flex items-center justify-between h-12 px-4 bg-[#181b1f] border-b border-[rgba(204,204,220,0.07)] flex-shrink-0 z-30">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Hamburger button (desktop collapse & mobile drawer) */}
                        <button
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setMobileOpen(!mobileOpen);
                                } else {
                                    setCollapsed(!collapsed);
                                }
                            }}
                            className="p-1.5 rounded text-[rgba(204,204,220,0.78)] hover:bg-[rgba(204,204,220,0.06)] hover:text-[#e6e6f0] transition-colors"
                            title="Toggle Sidebar"
                            aria-label="Toggle Navigation"
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-1.5 text-[13px] text-[rgba(204,204,220,0.62)] overflow-hidden whitespace-nowrap">
                            {crumbs.map((crumb, idx) => {
                                const isLast = idx === crumbs.length - 1;
                                return (
                                    <React.Fragment key={idx}>
                                        {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[rgba(204,204,220,0.3)] flex-shrink-0" />}
                                        <span className={isLast ? "font-semibold text-[#e6e6f0]" : "hover:text-[#ccccdc]"}>
                                            {crumb}
                                        </span>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Topbar Right Controls */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/scholarships?status=open"
                            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3d71d9]/15 border border-[#3d71d9]/30 text-[12px] font-medium text-[#6e9fff] hover:bg-[#3d71d9]/25 transition"
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span>Find Scholarships</span>
                        </Link>
                        <Link
                            href="/tracker"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[rgba(204,204,220,0.06)] border border-[rgba(204,204,220,0.15)] text-[12px] font-medium text-[rgba(204,204,220,0.78)] hover:bg-[rgba(204,204,220,0.12)] hover:text-[#e6e6f0] transition"
                        >
                            <Bookmark className="w-3.5 h-3.5 text-[#ff8833]" />
                            <span>Tracker</span>
                        </Link>
                    </div>
                </header>

                {/* Content Canvas */}
                <main className="flex-1 overflow-y-auto bg-[#111217] p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
