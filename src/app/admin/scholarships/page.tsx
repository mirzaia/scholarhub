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
            // Reset form
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

    return (
        <>
            <div className="page-header">
                <h1>⚙️ Manage Scholarships</h1>
                <p>Add, edit, and remove scholarships from the database</p>
            </div>

            <div style={{ marginBottom: 24 }}>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "✕ Cancel" : "➕ Add Scholarship"}
                </button>
            </div>

            {showForm && (
                <div className="detail-section" style={{ marginBottom: 24 }}>
                    <h2>New Scholarship</h2>
                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 16,
                            }}
                        >
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Name *
                                </label>
                                <input
                                    className="search-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{ width: "100%" }}
                                    placeholder="e.g. Chevening Scholarship"
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Official URL *
                                </label>
                                <input
                                    className="search-input"
                                    value={officialUrl}
                                    onChange={(e) => setOfficialUrl(e.target.value)}
                                    required
                                    style={{ width: "100%" }}
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Country *
                                </label>
                                <input
                                    className="search-input"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    style={{ width: "100%" }}
                                    placeholder="e.g. United Kingdom"
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Status
                                </label>
                                <select
                                    className="filter-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ width: "100%" }}
                                >
                                    {SCHOLARSHIP_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Provider Type
                                </label>
                                <select
                                    className="filter-select"
                                    value={providerType}
                                    onChange={(e) => setProviderType(e.target.value)}
                                    style={{ width: "100%" }}
                                >
                                    {PROVIDER_TYPES.map((p) => (
                                        <option key={p} value={p}>
                                            {PROVIDER_LABELS[p]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Degree Level
                                </label>
                                <select
                                    className="filter-select"
                                    value={degreeLevel}
                                    onChange={(e) => setDegreeLevel(e.target.value)}
                                    style={{ width: "100%" }}
                                >
                                    {DEGREE_LEVELS.map((d) => (
                                        <option key={d} value={d}>
                                            {DEGREE_LABELS[d]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Funding Type
                                </label>
                                <select
                                    className="filter-select"
                                    value={fundingType}
                                    onChange={(e) => setFundingType(e.target.value)}
                                    style={{ width: "100%" }}
                                >
                                    {FUNDING_TYPES.map((f) => (
                                        <option key={f} value={f}>
                                            {FUNDING_LABELS[f]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Open Date
                                </label>
                                <input
                                    type="date"
                                    className="search-input"
                                    value={openDate}
                                    onChange={(e) => setOpenDate(e.target.value)}
                                    style={{ width: "100%", colorScheme: "dark" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                    Close Date
                                </label>
                                <input
                                    type="date"
                                    className="search-input"
                                    value={closeDate}
                                    onChange={(e) => setCloseDate(e.target.value)}
                                    style={{ width: "100%", colorScheme: "dark" }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                                Description
                            </label>
                            <textarea
                                className="search-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                style={{ width: "100%", resize: "vertical" }}
                                placeholder="Brief description of the scholarship..."
                            />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? "⏳ Saving..." : "💾 Save Scholarship"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Scholarship List */}
            {loading ? (
                <div className="empty-state">
                    <div className="empty-state-icon">⏳</div>
                    <h3>Loading...</h3>
                </div>
            ) : (
                <div className="detail-section">
                    <h2>
                        All Scholarships ({scholarships.length})
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {scholarships.map((s) => (
                            <div
                                key={s.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "12px 16px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1px solid var(--border-color)",
                                    transition: "border-color 0.2s ease",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                                    <Link
                                        href={`/scholarships/${s.slug}`}
                                        style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 500, fontSize: 14 }}
                                    >
                                        {s.name}
                                    </Link>
                                    <span className={`badge badge-${s.status}`} style={{ fontSize: 10 }}>
                                        {s.status}
                                    </span>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                        📍 {s.country}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleDelete(s.id)}
                                    style={{ color: "var(--accent-red)", fontSize: 11 }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
