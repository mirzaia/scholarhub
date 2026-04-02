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
} from "@/lib/utils";
import { Settings, Plus, X, Trash2, Save, Loader2, MapPin } from "lucide-react";

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
}

export default function AdminScholarshipsPage() {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

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
    const [description, setDescription] = useState("");

    const fetchScholarships = useCallback(async () => {
        const res = await fetch("/api/scholarships");
        const data = await res.json();
        setScholarships(data);
        setLoading(false);
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

    const selectClasses = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer";
    const inputClasses = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";
    const labelClasses = "block text-xs font-medium text-slate-500 mb-1.5";

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="w-7 h-7 text-indigo-500" />
                    Manage Scholarships
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Add, edit, and remove scholarships from the database</p>
            </div>

            <div className="mb-6">
                <button
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                        showForm
                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Scholarship</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-5">New Scholarship</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Name *</label>
                                <input className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Chevening Scholarship" />
                            </div>
                            <div>
                                <label className={labelClasses}>Official URL *</label>
                                <input className={inputClasses} value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} required placeholder="https://..." />
                            </div>
                            <div>
                                <label className={labelClasses}>Country *</label>
                                <input className={inputClasses} value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="e.g. United Kingdom" />
                            </div>
                            <div>
                                <label className={labelClasses}>Status</label>
                                <select className={selectClasses} value={status} onChange={(e) => setStatus(e.target.value)}>
                                    {SCHOLARSHIP_STATUSES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Provider Type</label>
                                <select className={selectClasses} value={providerType} onChange={(e) => setProviderType(e.target.value)}>
                                    {PROVIDER_TYPES.map((p) => (
                                        <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Degree Level</label>
                                <select className={selectClasses} value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)}>
                                    {DEGREE_LEVELS.map((d) => (
                                        <option key={d} value={d}>{DEGREE_LABELS[d]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Funding Type</label>
                                <select className={selectClasses} value={fundingType} onChange={(e) => setFundingType(e.target.value)}>
                                    {FUNDING_TYPES.map((f) => (
                                        <option key={f} value={f}>{FUNDING_LABELS[f]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Open Date</label>
                                <input type="date" className={inputClasses} value={openDate} onChange={(e) => setOpenDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClasses}>Close Date</label>
                                <input type="date" className={inputClasses} value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className={labelClasses}>Description</label>
                            <textarea
                                className={`${inputClasses} resize-y`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Brief description of the scholarship..."
                            />
                        </div>
                        <div className="mt-5">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={saving}
                            >
                                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Scholarship</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Scholarship List */}
            {loading ? (
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
                    <h3 className="text-base font-semibold text-slate-600">Loading...</h3>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        All Scholarships ({scholarships.length})
                    </h2>
                    <div className="space-y-2">
                        {scholarships.map((s) => (
                            <div
                                key={s.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Link
                                        href={`/scholarships/${s.slug}`}
                                        className="text-sm font-medium text-slate-800 hover:text-indigo-600 transition-colors truncate"
                                    >
                                        {s.name}
                                    </Link>
                                    <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                                        s.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                                        s.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {s.status}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                                        <MapPin className="w-3 h-3" /> {s.country}
                                    </span>
                                </div>
                                <button
                                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                                    onClick={() => handleDelete(s.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}
