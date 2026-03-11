"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        section: "Dashboard",
        links: [
            { href: "/", label: "Overview", icon: "📊" },
        ],
    },
    {
        section: "Explore",
        links: [
            { href: "/scholarships", label: "Scholarships", icon: "🎓" },
            { href: "/universities", label: "Universities", icon: "🏛️" },
        ],
    },
    {
        section: "My Progress",
        links: [
            { href: "/tracker", label: "Application Tracker", icon: "📋" },
        ],
    },
    {
        section: "Admin",
        links: [
            { href: "/admin/scholarships", label: "Manage Scholarships", icon: "⚙️" },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">🎓</div>
                <div>
                    <h1>ScholarHub</h1>
                    <p>Scholarship Dashboard</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((section) => (
                    <div key={section.section}>
                        <p className="sidebar-section-title">{section.section}</p>
                        {section.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
