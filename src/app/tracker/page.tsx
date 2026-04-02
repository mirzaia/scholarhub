"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { APPLICATION_STATUSES, daysUntil } from "@/lib/utils";
import { ClipboardList, MapPin, StickyNote, Plus, X, Trash2, Search, Loader2, Clock } from "lucide-react";

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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
                    <h3 className="text-base font-semibold text-slate-600">Loading your applications...</h3>
                </div>
            </main>
        );
    }

    const grouped = APPLICATION_STATUSES.reduce((acc, status) => {
        acc[status] = applications.filter((a) => a.status === status);
        return acc;
    }, {} as Record<string, Application[]>);

    const STATUS_COLORS: Record<string, string> = {
        interested: "bg-violet-100 text-violet-700",
        preparing: "bg-amber-100 text-amber-700",
        applied: "bg-blue-100 text-blue-700",
        accepted: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
        not_eligible: "bg-slate-100 text-slate-600",
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="w-7 h-7 text-indigo-500" />
                    Application Tracker
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Track your scholarship application progress</p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl">
                    <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-600 mb-1">No applications tracked yet</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Start by browsing{" "}
                        <Link href="/scholarships?status=open" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            open scholarships
                        </Link>{" "}
                        and clicking &quot;Track This Scholarship&quot;
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {APPLICATION_STATUSES.filter((s) => grouped[s].length > 0).map((statusKey) => (
                        <section key={statusKey}>
                            {/* Section header */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[statusKey] || 'bg-slate-100 text-slate-600'}`}>
                                    {statusKey.replace("_", " ")}
                                </span>
                                <span className="text-sm text-slate-400">
                                    {grouped[statusKey].length} application{grouped[statusKey].length !== 1 ? "s" : ""}
                                </span>
                                <div className="flex-1 border-t border-slate-200" />
                            </div>

                            <div className="space-y-3">
                                {grouped[statusKey].map((app) => {
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
                                        <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                            {/* Card header */}
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <Link
                                                    href={`/scholarships/${app.scholarship.slug}`}
                                                    className="text-base font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
                                                >
                                                    {app.scholarship.name}
                                                </Link>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {days !== null && app.scholarship.status === "open" && (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                            days <= 7 ? 'bg-red-100 text-red-700' :
                                                            days <= 30 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            <Clock className="w-3 h-3" />
                                                            {days > 0 ? `${days}d left` : "Expired"}
                                                        </span>
                                                    )}
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                                        className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 focus:outline-none focus:border-indigo-400 cursor-pointer"
                                                    >
                                                        {APPLICATION_STATUSES.map((s) => (
                                                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                <MapPin className="w-3.5 h-3.5" /> {app.scholarship.country}
                                            </p>

                                            {app.notes && (
                                                <p className="text-xs text-slate-400 italic flex items-center gap-1 mt-1">
                                                    <StickyNote className="w-3 h-3" /> {app.notes}
                                                </p>
                                            )}

                                            {/* Checklist section */}
                                            <div className="mt-4">
                                                {total > 0 && (
                                                    <>
                                                        <div className="mb-3">
                                                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                                                                <span>Checklist ({done}/{total})</span>
                                                                <span className={`font-semibold ${pct === 100 ? 'text-emerald-600' : ''}`}>{pct}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            {checklist.map((item, i) => (
                                                                <div key={i} className="flex items-center gap-2 group">
                                                                    <label className={`flex items-center gap-2 flex-1 text-sm cursor-pointer ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item.done}
                                                                            onChange={() => toggleChecklistItem(app.id, checklist, i)}
                                                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                                        />
                                                                        {item.task}
                                                                    </label>
                                                                    <button
                                                                        onClick={() => removeChecklistItem(app.id, checklist, i)}
                                                                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                                                                        title="Remove item"
                                                                    >
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Add custom item */}
                                                {isAddingHere ? (
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <input
                                                            ref={newTaskInputRef}
                                                            type="text"
                                                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                                            placeholder="e.g. Get recommendation letter..."
                                                            value={newTask}
                                                            onChange={(e) => setNewTask(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") addChecklistItem(app.id, checklist);
                                                                if (e.key === "Escape") { setAddingTo(null); setNewTask(""); }
                                                            }}
                                                        />
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                                                            onClick={() => addChecklistItem(app.id, checklist)}
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                                            onClick={() => { setAddingTo(null); setNewTask(""); }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                                        onClick={() => setAddingTo(app.id)}
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Add checklist item
                                                    </button>
                                                )}
                                            </div>

                                            {/* Actions footer */}
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                                {confirmDeleteId === app.id ? (
                                                    <>
                                                        <span className="text-xs text-red-600 font-medium">Are you sure?</span>
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
                                                            onClick={() => removeApplication(app.id)}
                                                        >
                                                            Yes, Remove
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                                                        onClick={() => setConfirmDeleteId(app.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}
