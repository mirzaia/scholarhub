"use client";

import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    daysUntil,
    PROVIDER_LABELS,
    PROVIDER_CATEGORY_ICONS,
    DEGREE_LABELS,
    FUNDING_LABELS,
    LOA_LABELS,
    formatDate,
    STATUS_COLORS,
} from "@/lib/utils";
import {
    GraduationCap,
    Search,
    X,
    Clock,
    MapPin,
    CalendarClock,
    Loader2,
    SlidersHorizontal,
    BookOpen,
} from "lucide-react";

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
    gpaMin: number | null;
    englishRequirement: string | null;
    ageMax: number | null;
    workExpYears: number | null;
    requiresLoa: string | null;
    fieldOfStudy: string | null;
    coverageSummary: string | null;
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
    const [minGpa, setMinGpa] = useState(searchParams.get("minGpa") || "");
    const [requiresLoa, setRequiresLoa] = useState(searchParams.get("requiresLoa") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

    const abortControllerRef = useRef<AbortController | null>(null);

    const updateURL = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([k, v]) => {
                if (v) params.set(k, v);
                else params.delete(k);
            });
            router.replace(`/scholarships?${params.toString()}`, { scroll: false });
        },
        [searchParams, router]
    );

    const fetchScholarships = useCallback(async () => {
        setLoading(true);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (providerType) params.set("providerType", providerType);
        if (degreeLevel) params.set("degreeLevel", degreeLevel);
        if (fundingType) params.set("fundingType", fundingType);
        if (minGpa) params.set("minGpa", minGpa);
        if (requiresLoa) params.set("requiresLoa", requiresLoa);
        if (sortBy) params.set("sortBy", sortBy);

        try {
            const res = await fetch(`/api/scholarships?${params.toString()}`, {
                signal: controller.signal,
            });
            if (res.ok) {
                const data = await res.json();
                setScholarships(data);
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== "AbortError") {
                console.error("Failed to load scholarships:", err);
            }
        } finally {
            setLoading(false);
        }
    }, [search, status, providerType, degreeLevel, fundingType, minGpa, requiresLoa, sortBy]);

    useEffect(() => {
        const timer = setTimeout(fetchScholarships, 250);
        return () => clearTimeout(timer);
    }, [fetchScholarships]);

    const handleFilterChange = (key: string, val: string, setter: (v: string) => void) => {
        setter(val);
        updateURL({ [key]: val });
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setProviderType("");
        setDegreeLevel("");
        setFundingType("");
        setMinGpa("");
        setRequiresLoa("");
        setSortBy("newest");
        router.replace("/scholarships");
    };

    const hasFilters =
        Boolean(search || status || providerType || degreeLevel || fundingType || minGpa || requiresLoa);

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[rgba(204,204,220,0.07)]">
                <div>
                    <h1 className="text-xl font-semibold text-[#e6e6f0] tracking-tight flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#6e9fff]" />
                        <span>Scholarship Catalog</span>
                    </h1>
                    <p className="text-[13px] text-[rgba(204,204,220,0.62)] mt-0.5">
                        Filter scholarships by Master&apos;s degree eligibility, minimum GPA, LoA criteria, and deadlines.
                    </p>
                </div>

                {!loading && (
                    <div className="text-[12px] text-[rgba(204,204,220,0.78)] bg-[#181b1f] border border-[rgba(204,204,220,0.12)] px-2.5 py-1 rounded-[4px] self-start sm:self-auto">
                        <span className="font-semibold text-[#6e9fff] tabular-nums">{scholarships.length}</span>{" "}
                        scholarship{scholarships.length !== 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Grafana-style Variable Bar (.g-var) */}
            <div className="p-3 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] rounded-[4px] space-y-3">
                <div className="flex items-center justify-between text-[12px] text-[rgba(204,204,220,0.62)] font-medium">
                    <span className="flex items-center gap-1.5 text-[rgba(204,204,220,0.78)]">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff8833]" />
                        Filter Variables
                    </span>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-[11px] text-[#ff7383] hover:underline"
                        >
                            <X className="w-3 h-3" /> Clear all filters
                        </button>
                    )}
                </div>

                {/* Variable elements row */}
                <div className="flex flex-wrap gap-2.5 items-center">
                    {/* Search box */}
                    <div className="g-var flex-1 min-w-[220px]">
                        <span className="g-var-label">
                            <Search className="w-3.5 h-3.5 text-[rgba(204,204,220,0.62)] mr-1" />
                            Search
                        </span>
                        <input
                            type="text"
                            placeholder="Name, country, provider..."
                            value={search}
                            onChange={(e) => handleFilterChange("search", e.target.value, setSearch)}
                            className="w-full"
                        />
                    </div>

                    {/* Status */}
                    <div className="g-var">
                        <span className="g-var-label">Status</span>
                        <select
                            value={status}
                            onChange={(e) => handleFilterChange("status", e.target.value, setStatus)}
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Degree */}
                    <div className="g-var">
                        <span className="g-var-label">Degree</span>
                        <select
                            value={degreeLevel}
                            onChange={(e) => handleFilterChange("degreeLevel", e.target.value, setDegreeLevel)}
                        >
                            <option value="">All Degrees</option>
                            {Object.entries(DEGREE_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Min GPA */}
                    <div className="g-var">
                        <span className="g-var-label">My GPA</span>
                        <select
                            value={minGpa}
                            onChange={(e) => handleFilterChange("minGpa", e.target.value, setMinGpa)}
                        >
                            <option value="">Any GPA</option>
                            <option value="2.75">GPA ≥ 2.75</option>
                            <option value="3.00">GPA ≥ 3.00 (Most Common)</option>
                            <option value="3.25">GPA ≥ 3.25</option>
                            <option value="3.50">GPA ≥ 3.50 (High Honors)</option>
                        </select>
                    </div>

                    {/* LoA Requirement */}
                    <div className="g-var">
                        <span className="g-var-label">LoA Rule</span>
                        <select
                            value={requiresLoa}
                            onChange={(e) => handleFilterChange("requiresLoa", e.target.value, setRequiresLoa)}
                        >
                            <option value="">Any LoA Status</option>
                            <option value="optional">LoA Optional (Apply First)</option>
                            <option value="mandatory">LoA Mandatory (Requires Offer)</option>
                        </select>
                    </div>

                    {/* Provider */}
                    <div className="g-var">
                        <span className="g-var-label">Category</span>
                        <select
                            value={providerType}
                            onChange={(e) => handleFilterChange("providerType", e.target.value, setProviderType)}
                        >
                            <option value="">All Categories</option>
                            {Object.entries(PROVIDER_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {PROVIDER_CATEGORY_ICONS[k]} {v}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Funding */}
                    <div className="g-var">
                        <span className="g-var-label">Funding</span>
                        <select
                            value={fundingType}
                            onChange={(e) => handleFilterChange("fundingType", e.target.value, setFundingType)}
                        >
                            <option value="">All Types</option>
                            {Object.entries(FUNDING_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="g-var">
                        <span className="g-var-label">Sort</span>
                        <select
                            value={sortBy}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value, setSortBy)}
                        >
                            <option value="newest">Newest Added</option>
                            <option value="deadline">Soonest Deadline</option>
                            <option value="name">Name (A → Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] rounded-[4px]">
                    <Loader2 className="w-7 h-7 text-[#6e9fff] animate-spin mb-3" />
                    <p className="text-[13px] text-[rgba(204,204,220,0.78)] font-medium">
                        Loading scholarships...
                    </p>
                </div>
            ) : scholarships.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#181b1f] border border-dashed border-[rgba(204,204,220,0.12)] rounded-[4px] text-center p-6">
                    <Search className="w-8 h-8 text-[rgba(204,204,220,0.3)] mb-3" />
                    <h3 className="text-[15px] font-semibold text-[#e6e6f0] mb-1">
                        No scholarships match your filters
                    </h3>
                    <p className="text-[13px] text-[rgba(204,204,220,0.62)] mb-4 max-w-sm">
                        Try loosening your filters, adjusting minimum GPA, or clearing keyword search.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-3.5 py-1.5 rounded bg-[#22252b] border border-[rgba(204,204,220,0.15)] text-[13px] text-[#e6e6f0] hover:bg-[#2c3036] transition"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {scholarships.map((s) => {
                        const days = s.closeDate ? daysUntil(s.closeDate) : null;
                        const isUrgent = days !== null && days <= 7;
                        const isWarning = days !== null && days <= 30 && days > 7;
                        const statusStyle = STATUS_COLORS[s.status] || STATUS_COLORS.upcoming;

                        return (
                            <Link
                                href={`/scholarships/${s.slug}`}
                                key={s.id}
                                className="group flex flex-col justify-between p-4 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] hover:border-[rgba(204,204,220,0.25)] rounded-[4px] transition"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-[14px] font-semibold text-[#e6e6f0] group-hover:text-[#6e9fff] transition-colors leading-tight line-clamp-2">
                                            {s.name}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} uppercase flex-shrink-0`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                            {s.status}
                                        </span>
                                    </div>

                                    {/* Primary Metadata Badges */}
                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                        <span className="px-1.5 py-0.5 rounded bg-[#111217] border border-[rgba(204,204,220,0.12)] text-[11px] text-[rgba(204,204,220,0.78)]">
                                            {FUNDING_LABELS[s.fundingType] || s.fundingType}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-[#3d71d9]/10 border border-[#3d71d9]/30 text-[11px] text-[#6e9fff]">
                                            {DEGREE_LABELS[s.degreeLevel] || s.degreeLevel}
                                        </span>
                                        {s.requiresLoa && (
                                          <span className="px-1.5 py-0.5 rounded bg-[#111217] border border-[rgba(204,204,220,0.12)] text-[11px] text-[rgba(204,204,220,0.62)]">
                                            {LOA_LABELS[s.requiresLoa] || s.requiresLoa}
                                          </span>
                                        )}
                                        {s.gpaMin && (
                                            <span className="px-1.5 py-0.5 rounded bg-[#fab219]/10 border border-[#fab219]/25 text-[11px] text-[#fcd34d]">
                                                GPA ≥ {s.gpaMin.toFixed(1)}
                                            </span>
                                        )}
                                    </div>

                                    {/* English Requirement Highlight */}
                                    {s.englishRequirement && (
                                        <div className="text-[11px] text-[#6e9fff] font-mono bg-[#111217] px-2 py-1 rounded border border-[rgba(204,204,220,0.07)] mb-2.5 flex items-center gap-1.5">
                                            <BookOpen className="w-3 h-3 text-[rgba(204,204,220,0.62)] flex-shrink-0" />
                                            <span className="truncate">{s.englishRequirement}</span>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {s.description && (
                                        <p className="text-[12px] text-[rgba(204,204,220,0.62)] line-clamp-2 mb-3 leading-relaxed">
                                            {s.description}
                                        </p>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(204,204,220,0.07)] text-[11px]">
                                    <span className="flex items-center gap-1 text-[rgba(204,204,220,0.62)]">
                                        <MapPin className="w-3 h-3" />
                                        <span>{s.country}</span>
                                    </span>

                                    {days !== null && s.status === "open" && (
                                        <span
                                            className={`font-semibold flex items-center gap-1 ${
                                                isUrgent
                                                    ? "text-[#ff7383]"
                                                    : isWarning
                                                    ? "text-[#fcd34d]"
                                                    : "text-[#73bf69]"
                                            }`}
                                        >
                                            <Clock className="w-3 h-3" />
                                            {days > 0 ? `${days}d left` : "Expired"}
                                        </span>
                                    )}

                                    {s.status === "upcoming" && s.openDate && (
                                        <span className="text-[#6e9fff] flex items-center gap-1">
                                            <CalendarClock className="w-3 h-3" />
                                            Opens {formatDate(s.openDate)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function ScholarshipsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-20 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] rounded-[4px]">
                    <Loader2 className="w-7 h-7 text-[#6e9fff] animate-spin mb-3" />
                    <p className="text-[13px] text-[rgba(204,204,220,0.62)]">Loading catalog...</p>
                </div>
            }
        >
            <ScholarshipCatalogInner />
        </Suspense>
    );
}
