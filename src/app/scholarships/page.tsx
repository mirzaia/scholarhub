"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { daysUntil, PROVIDER_LABELS, PROVIDER_CATEGORY_ICONS, DEGREE_LABELS, FUNDING_LABELS, formatDate } from "@/lib/utils";
import { GraduationCap, Search, X, Clock, MapPin, CalendarClock, Loader2 } from "lucide-react";

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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-7 h-7 text-indigo-500" />
                    Scholarship Catalog
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Browse and filter scholarships available for Indonesian students</p>
            </div>

            {/* Active filter banner */}
            {status && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                    <span className="text-sm text-indigo-700">
                        Showing <strong>{status}</strong> scholarships
                    </span>
                    <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Clear filter
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap items-center">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                        placeholder="Search scholarships..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                </select>
                <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer" value={providerType} onChange={(e) => handleProviderChange(e.target.value)}>
                    <option value="">All Categories</option>
                    {Object.entries(PROVIDER_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{PROVIDER_CATEGORY_ICONS[k]} {v}</option>
                    ))}
                </select>
                <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer" value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)}>
                    <option value="">All Degrees</option>
                    {Object.entries(DEGREE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer" value={fundingType} onChange={(e) => setFundingType(e.target.value)}>
                    <option value="">All Funding</option>
                    {Object.entries(FUNDING_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="deadline">Deadline (soonest)</option>
                    <option value="name">Name (A→Z)</option>
                </select>
                {hasFilters && (
                    <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                        <X className="w-3.5 h-3.5" /> Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-xs text-slate-400 mb-4">
                    {scholarships.length} scholarship{scholarships.length !== 1 ? "s" : ""} found
                </p>
            )}

            {/* Results */}
            {loading ? (
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
                    <h3 className="text-base font-semibold text-slate-600">Loading scholarships...</h3>
                </div>
            ) : scholarships.length === 0 ? (
                <div className="text-center py-20">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-600 mb-1">No scholarships found</h3>
                    <p className="text-sm text-slate-400 mb-4">Try adjusting your filters</p>
                    <button onClick={clearFilters} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {scholarships.map((s) => {
                        const days = s.closeDate ? daysUntil(s.closeDate) : null;
                        const icon = PROVIDER_CATEGORY_ICONS[s.providerType] || "🎓";
                        const isUrgent = days !== null && days <= 7;
                        const isWarning = days !== null && days <= 30 && days > 7;

                        return (
                            <Link
                                href={`/scholarships/${s.slug}`}
                                key={s.id}
                                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <h3 className="text-base font-bold text-slate-800 leading-tight line-clamp-2">{s.name}</h3>
                                    <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                        s.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                                        s.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                        {FUNDING_LABELS[s.fundingType] || s.fundingType}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium">
                                        {DEGREE_LABELS[s.degreeLevel] || s.degreeLevel}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-xs font-medium">
                                        {icon} {PROVIDER_LABELS[s.providerType] || s.providerType}
                                    </span>
                                </div>
                                {s.description && (
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
                                        {s.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" /> {s.country}
                                    </span>
                                    {days !== null && s.status === "open" && (
                                        <span className={`text-xs font-bold flex items-center gap-1 ${
                                            isUrgent ? 'text-red-600 animate-pulse' : isWarning ? 'text-amber-600' : 'text-slate-500'
                                        }`}>
                                            <Clock className="w-3.5 h-3.5" />
                                            {days > 0 ? `${days}d left` : "Expired"}
                                        </span>
                                    )}
                                    {s.status === "upcoming" && s.openDate && (
                                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                            <CalendarClock className="w-3.5 h-3.5" />
                                            Opens {formatDate(s.openDate)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

export default function ScholarshipsPage() {
    return (
        <Suspense fallback={
            <div className="text-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
                <h3 className="text-base font-semibold text-slate-600">Loading...</h3>
            </div>
        }>
            <ScholarshipCatalogInner />
        </Suspense>
    );
}
