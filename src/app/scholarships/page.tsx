"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { daysUntil, PROVIDER_LABELS, PROVIDER_CATEGORY_ICONS, DEGREE_LABELS, FUNDING_LABELS, formatDate } from "@/lib/utils";

interface Scholarship {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    officialUrl: string;
    country: string;
    providerType: string;
    degreeLevel: string;
    fundingType: string;
    status: string;
    openDate: string | null;
    closeDate: string | null;
    links: { id: string; label: string; url: string; linkType: string }[];
    universities: { university: { id: string; name: string; country: string } }[];
}

function ScholarshipCatalogInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [providerType, setProviderType] = useState(searchParams.get("providerType") || "");
    const [degreeLevel, setDegreeLevel] = useState(searchParams.get("degreeLevel") || "");
    const [fundingType, setFundingType] = useState(searchParams.get("fundingType") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

    // Sync filter changes back to URL for shareable links
    const updateURL = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v) params.set(k, v);
            else params.delete(k);
        });
        router.replace(`/scholarships?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const fetchScholarships = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (providerType) params.set("providerType", providerType);
        if (degreeLevel) params.set("degreeLevel", degreeLevel);
        if (fundingType) params.set("fundingType", fundingType);
        if (sortBy) params.set("sortBy", sortBy);

        const res = await fetch(`/api/scholarships?${params.toString()}`);
        const data = await res.json();
        setScholarships(data);
        setLoading(false);
    }, [search, status, providerType, degreeLevel, fundingType, sortBy]);

    useEffect(() => {
        const timer = setTimeout(fetchScholarships, 300);
        return () => clearTimeout(timer);
    }, [fetchScholarships]);

    const handleStatusChange = (val: string) => {
        setStatus(val);
        updateURL({ status: val });
    };

    const handleProviderChange = (val: string) => {
        setProviderType(val);
        updateURL({ providerType: val });
    };

    const clearFilters = () => {
        setSearch(""); setStatus(""); setProviderType("");
        setDegreeLevel(""); setFundingType(""); setSortBy("newest");
        router.replace("/scholarships");
    };

    const hasFilters = search || status || providerType || degreeLevel || fundingType;

    return (
        <>
            <div className="page-header">
                <h1>🎓 Scholarship Catalog</h1>
                <p>Browse and filter scholarships available for Indonesian students</p>
            </div>

            {/* Active filter banner */}
            {status && (
                <div className="filter-banner">
                    <span>
                        Showing <strong>{status}</strong> scholarships
                    </span>
                    <button onClick={clearFilters} className="filter-banner-clear">
                        ✕ Clear filter
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Search scholarships..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="filter-select" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="open">🟢 Open</option>
                    <option value="upcoming">🔜 Upcoming</option>
                    <option value="closed">🔴 Closed</option>
                </select>
                <select className="filter-select" value={providerType} onChange={(e) => handleProviderChange(e.target.value)}>
                    <option value="">All Categories</option>
                    {Object.entries(PROVIDER_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{PROVIDER_CATEGORY_ICONS[k]} {v}</option>
                    ))}
                </select>
                <select className="filter-select" value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)}>
                    <option value="">All Degrees</option>
                    {Object.entries(DEGREE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <select className="filter-select" value={fundingType} onChange={(e) => setFundingType(e.target.value)}>
                    <option value="">All Funding</option>
                    {Object.entries(FUNDING_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="deadline">Deadline (soonest)</option>
                    <option value="name">Name (A→Z)</option>
                </select>
                {hasFilters && (
                    <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            {!loading && (
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                    {scholarships.length} scholarship{scholarships.length !== 1 ? "s" : ""} found
                </div>
            )}

            {/* Results */}
            {loading ? (
                <div className="empty-state">
                    <div className="empty-state-icon">⏳</div>
                    <h3>Loading scholarships...</h3>
                </div>
            ) : scholarships.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3>No scholarships found</h3>
                    <p>Try adjusting your filters</p>
                    <button onClick={clearFilters} className="btn btn-secondary" style={{ marginTop: 16 }}>
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="card-grid">
                    {scholarships.map((s) => {
                        const days = s.closeDate ? daysUntil(s.closeDate) : null;
                        const icon = PROVIDER_CATEGORY_ICONS[s.providerType] || "🎓";

                        return (
                            <Link
                                href={`/scholarships/${s.slug}`}
                                key={s.id}
                                className="scholarship-card"
                            >
                                <div className="scholarship-card-header">
                                    <h3 className="scholarship-card-title">{s.name}</h3>
                                    <span className={`badge badge-${s.status}`}>{s.status}</span>
                                </div>
                                <div className="scholarship-card-meta">
                                    <span className={`badge badge-${s.fundingType}`}>
                                        {FUNDING_LABELS[s.fundingType] || s.fundingType}
                                    </span>
                                    <span
                                        className="badge"
                                        style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
                                    >
                                        {DEGREE_LABELS[s.degreeLevel] || s.degreeLevel}
                                    </span>
                                    <span
                                        className="badge"
                                        style={{ background: "rgba(15,23,42,0.6)", color: "var(--text-muted)", fontSize: 11 }}
                                    >
                                        {icon} {PROVIDER_LABELS[s.providerType] || s.providerType}
                                    </span>
                                </div>
                                {s.description && (
                                    <p className="scholarship-card-desc">{s.description}</p>
                                )}
                                <div className="scholarship-card-footer">
                                    <span className="scholarship-card-country">📍 {s.country}</span>
                                    {days !== null && s.status === "open" && (
                                        <span
                                            className={`scholarship-card-deadline ${days <= 7 ? "deadline-urgent" : days <= 30 ? "deadline-soon" : ""
                                                }`}
                                        >
                                            ⏰ {days > 0 ? `${days}d left` : "Expired"}
                                        </span>
                                    )}
                                    {s.status === "upcoming" && s.openDate && (
                                        <span className="scholarship-card-deadline">
                                            🔜 Opens {formatDate(s.openDate)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default function ScholarshipsPage() {
    return (
        <Suspense fallback={
            <div className="empty-state">
                <div className="empty-state-icon">⏳</div>
                <h3>Loading...</h3>
            </div>
        }>
            <ScholarshipCatalogInner />
        </Suspense>
    );
}
