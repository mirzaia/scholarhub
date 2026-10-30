"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    PROVIDER_TYPES,
    DEGREE_LEVELS,
    FUNDING_TYPES,
    PROVIDER_LABELS,
    DEGREE_LABELS,
    FUNDING_LABELS,
    SCHOLARSHIP_STATUSES,
    STATUS_COLORS,
    ScholarshipStatus,
} from "@/lib/utils";
import {
    Settings,
    Plus,
    X,
    Trash2,
    Save,
    Loader2,
    MapPin,
    ExternalLink,
    Search,
    GraduationCap,
} from "lucide-react";

interface Scholarship {
    id: string;
    name: string;
    slug: string;
    country: string;
    providerType: string;
    degreeLevel: string;
    fundingType: string;
    status: string;
    openDate: string | null;
    closeDate: string | null;
    gpaMin: number | null;
    englishRequirement: string | null;
}

export default function AdminScholarshipsPage() {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [name, setName] = useState("");
    const [officialUrl, setOfficialUrl] = useState("");
    const [country, setCountry] = useState("");
    const [providerType, setProviderType] = useState("foreign_gov");
    const [degreeLevel, setDegreeLevel] = useState("master");
    const [fundingType, setFundingType] = useState("full");
    const [status, setStatus] = useState("upcoming");
    const [openDate, setOpenDate] = useState("");
    const [closeDate, setCloseDate] = useState("");
    const [gpaMin, setGpaMin] = useState<string>("3.00");
    const [englishRequirement, setEnglishRequirement] = useState("IELTS 6.5 / TOEFL iBT 80");
    const [ageMax, setAgeMax] = useState<string>("35");
    const [workExpYears, setWorkExpYears] = useState<string>("0");
    const [requiresLoa, setRequiresLoa] = useState("optional");
    const [fieldOfStudy, setFieldOfStudy] = useState("Any");
    const [coverageSummary, setCoverageSummary] = useState("Full tuition fee, monthly living allowance, visa & airfare, health insurance");
    const [description, setDescription] = useState("");

    const fetchScholarships = useCallback(async () => {
        try {
            const res = await fetch("/api/scholarships");
            if (res.ok) {
                const data = await res.json();
                setScholarships(data);
            }
        } catch (err) {
            console.error("Failed to fetch scholarships:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchScholarships();
    }, [fetchScholarships]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch("/api/scholarships", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    officialUrl,
                    country,
                    providerType,
                    degreeLevel,
                    fundingType,
                    status,
                    openDate: openDate || undefined,
                    closeDate: closeDate || undefined,
                    gpaMin: gpaMin ? parseFloat(gpaMin) : undefined,
                    englishRequirement: englishRequirement || undefined,
                    ageMax: ageMax ? parseInt(ageMax) : undefined,
                    workExpYears: workExpYears ? parseInt(workExpYears) : 0,
                    requiresLoa,
                    fieldOfStudy,
                    coverageSummary: coverageSummary || undefined,
                    description: description || undefined,
                }),
            });
            setName("");
            setOfficialUrl("");
            setCountry("");
            setDescription("");
            setOpenDate("");
            setCloseDate("");
            setShowForm(false);
            fetchScholarships();
        } catch (err) {
            console.error("Failed to create:", err);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this scholarship?")) return;
        await fetch(`/api/scholarships/${id}`, { method: "DELETE" });
        fetchScholarships();
    };

    const selectClasses =
        "w-full px-3 py-2 bg-[#111217] border border-[rgba(204,204,220,0.18)] rounded text-xs text-[#e6e6f0] focus:outline-none focus:border-[#ff8833] cursor-pointer";
    const inputClasses =
        "w-full px-3 py-2 bg-[#111217] border border-[rgba(204,204,220,0.18)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.35)] focus:outline-none focus:border-[#ff8833]";
    const labelClasses =
        "block text-[11px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.55)] mb-1";

    const filteredScholarships = scholarships.filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            s.name.toLowerCase().includes(q) ||
            s.country.toLowerCase().includes(q) ||
            s.providerType.toLowerCase().includes(q)
        );
    });

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-[#e6e6f0] flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#ff8833]" />
                            Scholarship Administration
                        </h1>
                        <p className="text-xs text-[rgba(204,204,220,0.6)] mt-0.5">
                            Manage Master&apos;s scholarship records, criteria parameters, and intake deadlines
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold transition-colors shadow ${
                                showForm
                                    ? "bg-[#22252b] hover:bg-[#2c3235] text-[#ccccdc] border border-[rgba(204,204,220,0.18)]"
                                    : "bg-[#ff8833] hover:bg-[#e07728] text-white"
                            }`}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? (
                                <>
                                    <X className="w-3.5 h-3.5" /> Close Form
                                </>
                            ) : (
                                <>
                                    <Plus className="w-3.5 h-3.5" /> New Scholarship
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Creation Form Panel */}
            {showForm && (
                <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.18)] rounded-lg p-6 shadow-xl relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8833] to-[#f55f3e]" />
                    <h2 className="text-sm font-semibold text-[#e6e6f0] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#ff8833]" />
                        Create New Scholarship Scheme
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Scholarship Name *</label>
                                <input
                                    className={inputClasses}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="e.g. LPDP Beasiswa Reguler Magister 2026"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Official URL *</label>
                                <input
                                    className={inputClasses}
                                    value={officialUrl}
                                    onChange={(e) => setOfficialUrl(e.target.value)}
                                    required
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Destination Country *</label>
                                <input
                                    className={inputClasses}
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    placeholder="e.g. United Kingdom / Global"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Status</label>
                                <select
                                    className={selectClasses}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {SCHOLARSHIP_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Provider Type</label>
                                <select
                                    className={selectClasses}
                                    value={providerType}
                                    onChange={(e) => setProviderType(e.target.value)}
                                >
                                    {PROVIDER_TYPES.map((p) => (
                                        <option key={p} value={p}>
                                            {PROVIDER_LABELS[p]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Degree Level</label>
                                <select
                                    className={selectClasses}
                                    value={degreeLevel}
                                    onChange={(e) => setDegreeLevel(e.target.value)}
                                >
                                    {DEGREE_LEVELS.map((d) => (
                                        <option key={d} value={d}>
                                            {DEGREE_LABELS[d]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Funding Type</label>
                                <select
                                    className={selectClasses}
                                    value={fundingType}
                                    onChange={(e) => setFundingType(e.target.value)}
                                >
                                    {FUNDING_TYPES.map((f) => (
                                        <option key={f} value={f}>
                                            {FUNDING_LABELS[f]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Letter of Acceptance (LoA)</label>
                                <select
                                    className={selectClasses}
                                    value={requiresLoa}
                                    onChange={(e) => setRequiresLoa(e.target.value)}
                                >
                                    <option value="optional">LoA Optional</option>
                                    <option value="mandatory">LoA Mandatory (Unconditional)</option>
                                    <option value="not_allowed">LoA Not Allowed</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Minimum GPA (IPK S1)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4.00"
                                    className={inputClasses}
                                    value={gpaMin}
                                    onChange={(e) => setGpaMin(e.target.value)}
                                    placeholder="3.00"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>English Requirement</label>
                                <input
                                    className={inputClasses}
                                    value={englishRequirement}
                                    onChange={(e) => setEnglishRequirement(e.target.value)}
                                    placeholder="IELTS 6.5 / TOEFL iBT 80"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Max Age (Years)</label>
                                <input
                                    type="number"
                                    className={inputClasses}
                                    value={ageMax}
                                    onChange={(e) => setAgeMax(e.target.value)}
                                    placeholder="35"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Min Work Experience (Years)</label>
                                <input
                                    type="number"
                                    className={inputClasses}
                                    value={workExpYears}
                                    onChange={(e) => setWorkExpYears(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Open Date (YYYY-MM-DD)</label>
                                <input
                                    type="date"
                                    className={inputClasses}
                                    value={openDate}
                                    onChange={(e) => setOpenDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Close Date (YYYY-MM-DD)</label>
                                <input
                                    type="date"
                                    className={inputClasses}
                                    value={closeDate}
                                    onChange={(e) => setCloseDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Field of Study</label>
                                <input
                                    className={inputClasses}
                                    value={fieldOfStudy}
                                    onChange={(e) => setFieldOfStudy(e.target.value)}
                                    placeholder="Any / STEM / Humanities"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Coverage Summary</label>
                            <input
                                className={inputClasses}
                                value={coverageSummary}
                                onChange={(e) => setCoverageSummary(e.target.value)}
                                placeholder="Full tuition fee, living stipend, flight tickets, health insurance..."
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea
                                className={`${inputClasses} resize-y`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Comprehensive guidelines and eligibility information..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-[#22252b] hover:bg-[#2c3235] text-[rgba(204,204,220,0.7)] text-xs rounded border border-[rgba(204,204,220,0.12)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff8833] hover:bg-[#e07728] text-white text-xs font-semibold rounded shadow disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" /> Save Scholarship
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Scholarship List Panel */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[rgba(204,204,220,0.08)]">
                    <h2 className="text-sm font-semibold text-[#e6e6f0] uppercase tracking-wide">
                        All Scholarships ({filteredScholarships.length})
                    </h2>
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(204,204,220,0.4)]" />
                        <input
                            type="text"
                            placeholder="Filter records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-3 py-1 bg-[#111217] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.35)] focus:border-[#ff8833] focus:outline-none w-56"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <Loader2 className="w-6 h-6 text-[#ff8833] animate-spin mx-auto mb-2" />
                        <p className="text-xs text-[rgba(204,204,220,0.5)] font-mono">
                            Loading catalog records...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredScholarships.map((s) => {
                            const statusStyle =
                                STATUS_COLORS[s.status as ScholarshipStatus] ||
                                STATUS_COLORS.upcoming;

                            return (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between p-3 rounded bg-[#22252b] hover:bg-[#282c33] border border-[rgba(204,204,220,0.06)] transition-colors group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                                        <Link
                                            href={`/scholarships/${s.slug}`}
                                            className="text-xs font-semibold text-[#e6e6f0] hover:text-[#ff8833] transition-colors truncate"
                                        >
                                            {s.name}
                                        </Link>
                                        <span
                                            className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                                        >
                                            <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
                                            {s.status}
                                        </span>
                                        <span className="text-[11px] text-[rgba(204,204,220,0.5)] flex items-center gap-1 flex-shrink-0 font-mono">
                                            <MapPin className="w-3 h-3 text-[#ff8833]" /> {s.country}
                                        </span>
                                        {s.gpaMin && (
                                            <span className="text-[10px] font-mono text-[rgba(204,204,220,0.5)] hidden md:inline">
                                                GPA ≥ {s.gpaMin}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link
                                            href={`/scholarships/${s.slug}`}
                                            className="text-xs text-[rgba(204,204,220,0.5)] hover:text-[#e6e6f0] p-1"
                                            title="View page"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(s.id)}
                                            className="p-1 text-[rgba(204,204,220,0.4)] hover:text-[#ff7383] transition-colors"
                                            title="Delete scholarship"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
