"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { APPLICATION_STATUSES, daysUntil } from "@/lib/utils";

interface ChecklistItem {
    task: string;
    done: boolean;
}

interface Application {
    id: string;
    status: string;
    notes: string | null;
    checklist: string | null;
    scholarship: {
        id: string;
        name: string;
        slug: string;
        country: string;
        closeDate: string | null;
        status: string;
    };
}

export default function TrackerPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    // Track which card has the "add item" input open
    const [addingTo, setAddingTo] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [newTask, setNewTask] = useState("");
    const newTaskInputRef = useRef<HTMLInputElement>(null);

    const fetchApplications = useCallback(async () => {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setApplications(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    useEffect(() => {
        if (addingTo && newTaskInputRef.current) {
            newTaskInputRef.current.focus();
        }
    }, [addingTo]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchApplications();
    };

    const toggleChecklistItem = async (appId: string, checklist: ChecklistItem[], index: number) => {
        const updated = [...checklist];
        updated[index] = { ...updated[index], done: !updated[index].done };
        await fetch(`/api/applications/${appId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checklist: updated }),
        });
        fetchApplications();
    };

    const addChecklistItem = async (appId: string, checklist: ChecklistItem[]) => {
        if (!newTask.trim()) return;
        const updated = [...checklist, { task: newTask.trim(), done: false }];
        await fetch(`/api/applications/${appId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checklist: updated }),
        });
        setNewTask("");
        setAddingTo(null);
        fetchApplications();
    };

    const removeChecklistItem = async (appId: string, checklist: ChecklistItem[], index: number) => {
        const updated = checklist.filter((_, i) => i !== index);
        await fetch(`/api/applications/${appId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checklist: updated }),
        });
        fetchApplications();
    };

    const removeApplication = async (id: string) => {
        await fetch(`/api/applications/${id}`, { method: "DELETE" });
        setConfirmDeleteId(null);
        fetchApplications();
    };

    if (loading) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">⏳</div>
                <h3>Loading your applications...</h3>
            </div>
        );
    }

    const grouped = APPLICATION_STATUSES.reduce((acc, status) => {
        acc[status] = applications.filter((a) => a.status === status);
        return acc;
    }, {} as Record<string, Application[]>);

    const statusEmojis: Record<string, string> = {
        interested: "💜",
        preparing: "🔶",
        applied: "🔵",
        accepted: "✅",
        rejected: "❌",
        not_eligible: "⬜",
    };

    return (
        <>
            <div className="page-header">
                <h1>📋 Application Tracker</h1>
                <p>Track your scholarship application progress</p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No applications tracked yet</h3>
                    <p>
                        Start by browsing{" "}
                        <Link href="/scholarships?status=open" style={{ color: "var(--accent-primary)" }}>
                            open scholarships
                        </Link>{" "}
                        and clicking "Track This Scholarship"
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    {APPLICATION_STATUSES.filter((s) => grouped[s].length > 0).map((status) => (
                        <div key={status} className="section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    {statusEmojis[status]}{" "}
                                    {status.replace("_", " ").toUpperCase()}{" "}
                                    <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400 }}>
                                        ({grouped[status].length})
                                    </span>
                                </h2>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {grouped[status].map((app) => {
                                    const checklist: ChecklistItem[] = app.checklist
                                        ? JSON.parse(app.checklist)
                                        : [];
                                    const done = checklist.filter((c) => c.done).length;
                                    const total = checklist.length;
                                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                    const days = app.scholarship.closeDate
                                        ? daysUntil(app.scholarship.closeDate)
                                        : null;
                                    const isAddingHere = addingTo === app.id;

                                    return (
                                        <div key={app.id} className="tracker-card">
                                            <div className="tracker-card-header">
                                                <Link
                                                    href={`/scholarships/${app.scholarship.slug}`}
                                                    style={{ textDecoration: "none", color: "inherit" }}
                                                >
                                                    <h3 className="tracker-card-name">{app.scholarship.name}</h3>
                                                </Link>
                                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    {days !== null && app.scholarship.status === "open" && (
                                                        <span
                                                            className={`badge ${days <= 7 ? "badge-closed" : days <= 30 ? "badge-preparing" : "badge-open"
                                                                }`}
                                                        >
                                                            {days > 0 ? `${days}d left` : "Expired"}
                                                        </span>
                                                    )}
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                                        className="filter-select"
                                                        style={{ padding: "4px 28px 4px 8px", fontSize: 12 }}
                                                    >
                                                        {APPLICATION_STATUSES.map((s) => (
                                                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 16 }}>
                                                <span>📍 {app.scholarship.country}</span>
                                            </div>

                                            {app.notes && (
                                                <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", marginTop: 4 }}>
                                                    📝 {app.notes}
                                                </div>
                                            )}

                                            {/* Checklist section */}
                                            <div style={{ marginTop: 16 }}>
                                                {total > 0 && (
                                                    <>
                                                        <div className="tracker-progress">
                                                            <div className="progress-label">
                                                                <span>Checklist ({done}/{total})</span>
                                                                <span style={{ fontWeight: 700, color: pct === 100 ? "var(--accent-emerald)" : undefined }}>
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                            <div className="progress-bar-bg">
                                                                <div
                                                                    className="progress-bar-fill"
                                                                    style={{
                                                                        width: `${pct}%`,
                                                                        background: pct === 100
                                                                            ? "linear-gradient(90deg, #10b981, #34d399)"
                                                                            : undefined
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="checklist">
                                                            {checklist.map((item, i) => (
                                                                <div key={i} className="checklist-row">
                                                                    <label
                                                                        className={`checklist-item ${item.done ? "done" : ""}`}
                                                                        style={{ cursor: "pointer", flex: 1 }}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item.done}
                                                                            onChange={() => toggleChecklistItem(app.id, checklist, i)}
                                                                        />
                                                                        {item.task}
                                                                    </label>
                                                                    <button
                                                                        onClick={() => removeChecklistItem(app.id, checklist, i)}
                                                                        className="checklist-remove-btn"
                                                                        title="Remove item"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Add custom item */}
                                                {isAddingHere ? (
                                                    <div className="checklist-add-row">
                                                        <input
                                                            ref={newTaskInputRef}
                                                            type="text"
                                                            className="search-input checklist-add-input"
                                                            placeholder="e.g. Get recommendation letter..."
                                                            value={newTask}
                                                            onChange={(e) => setNewTask(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") addChecklistItem(app.id, checklist);
                                                                if (e.key === "Escape") { setAddingTo(null); setNewTask(""); }
                                                            }}
                                                        />
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => addChecklistItem(app.id, checklist)}
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => { setAddingTo(null); setNewTask(""); }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="checklist-add-btn"
                                                        onClick={() => setAddingTo(app.id)}
                                                    >
                                                        + Add checklist item
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
                                                {confirmDeleteId === app.id ? (
                                                    <>
                                                        <span style={{ fontSize: 13, color: "var(--accent-red)", fontWeight: 500 }}>Are you sure?</span>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => removeApplication(app.id)}
                                                            style={{ color: "var(--accent-red)", borderColor: "var(--accent-red)" }}
                                                        >
                                                            Yes, Remove
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setConfirmDeleteId(app.id)}
                                                        style={{ color: "var(--accent-red)" }}
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
