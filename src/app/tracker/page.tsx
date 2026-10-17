"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
    APPLICATION_STATUSES,
    APPLICATION_STATUS_COLORS,
    daysUntil,
    formatDate,
} from "@/lib/utils";
import {
    ClipboardList,
    MapPin,
    Plus,
    X,
    Trash2,
    Search,
    Loader2,
    Clock,
    LayoutGrid,
    List,
    FileText,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Save,
} from "lucide-react";

interface ChecklistItem {
    task: string;
    done: boolean;
}

interface DocumentLinks {
    sopUrl?: string;
    cvUrl?: string;
    loaUrl?: string;
    recommendationNote?: string;
    customNote?: string;
}

interface Application {
    id: string;
    status: string;
    currentStage: string | null;
    notes: string | null;
    checklist: string | null;
    documentLinks: string | null;
    appliedAt: string | null;
    updatedAt: string;
    scholarship: {
        id: string;
        name: string;
        slug: string;
        country: string;
        providerType: string;
        degreeLevel: string;
        fundingType: string;
        closeDate: string | null;
        status: string;
    };
}

const STAGES = [
    "Preparing Documents",
    "Administration Review",
    "Essay / Motivation Assessment",
    "Substantive Test / TPA",
    "Interview Stage",
    "Final Announcement",
];

function safeParseChecklist(raw: string | null): ChecklistItem[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.map((item) => ({
                task: typeof item === "string" ? item : item.task || "",
                done: Boolean(item.done),
            }));
        }
    } catch {
        // Fallback if not valid JSON
    }
    return [];
}

function safeParseDocuments(raw: string | null): DocumentLinks {
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
            return parsed;
        }
    } catch {
        // Fallback
    }
    return {};
}

export default function TrackerPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
    const [searchQuery, setSearchQuery] = useState("");
    const [addingTo, setAddingTo] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [newTask, setNewTask] = useState("");
    const [expandedDocAppId, setExpandedDocAppId] = useState<string | null>(null);
    const [docForms, setDocForms] = useState<Record<string, DocumentLinks>>({});
    const [savingDocId, setSavingDocId] = useState<string | null>(null);
    const newTaskInputRef = useRef<HTMLInputElement>(null);

    const fetchApplications = useCallback(async () => {
        try {
            const res = await fetch("/api/applications");
            if (res.ok) {
                const data: Application[] = await res.json();
                setApplications(data);
                // Prepopulate doc forms
                const initialForms: Record<string, DocumentLinks> = {};
                data.forEach((app) => {
                    initialForms[app.id] = safeParseDocuments(app.documentLinks);
                });
                setDocForms(initialForms);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setLoading(false);
        }
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

    const updateStage = async (id: string, currentStage: string) => {
        await fetch(`/api/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentStage }),
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

    const saveDocumentLinks = async (appId: string) => {
        setSavingDocId(appId);
        const docs = docForms[appId] || {};
        try {
            await fetch(`/api/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    documentLinks: docs,
                    notes: docs.customNote,
                }),
            });
            await fetchApplications();
        } finally {
            setSavingDocId(null);
        }
    };

    const removeApplication = async (id: string) => {
        await fetch(`/api/applications/${id}`, { method: "DELETE" });
        setConfirmDeleteId(null);
        fetchApplications();
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Loader2 className="w-8 h-8 text-[#ff8833] animate-spin mb-3" />
                    <p className="text-sm text-[rgba(204,204,220,0.65)] font-mono">
                        Loading tracker metrics &amp; applications...
                    </p>
                </div>
            </main>
        );
    }

    const filtered = applications.filter((app) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            app.scholarship.name.toLowerCase().includes(q) ||
            app.scholarship.country.toLowerCase().includes(q)
        );
    });

    const statusCounts = APPLICATION_STATUSES.reduce((acc, s) => {
        acc[s] = applications.filter((a) => a.status === s).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header & Controls Panel */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(204,204,220,0.08)]">
                    <div>
                        <h1 className="text-xl font-bold text-[#e6e6f0] flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-[#ff8833]" />
                            Application Tracker
                        </h1>
                        <p className="text-xs text-[rgba(204,204,220,0.6)] mt-0.5">
                            Kanban board &amp; submission progress monitor for Indonesian scholarships
                        </p>
                    </div>

                    {/* View mode toggle & search */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(204,204,220,0.4)]" />
                            <input
                                type="text"
                                placeholder="Filter tracked..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 bg-[#111217] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.35)] focus:border-[#ff8833] focus:outline-none w-44 sm:w-56"
                            />
                        </div>

                        <div className="flex items-center bg-[#111217] border border-[rgba(204,204,220,0.15)] rounded p-0.5">
                            <button
                                type="button"
                                onClick={() => setViewMode("kanban")}
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                                    viewMode === "kanban"
                                        ? "bg-[#22252b] text-[#ff8833] shadow-sm font-semibold"
                                        : "text-[rgba(204,204,220,0.6)] hover:text-[#e6e6f0]"
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                Kanban
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                                    viewMode === "list"
                                        ? "bg-[#22252b] text-[#ff8833] shadow-sm font-semibold"
                                        : "text-[rgba(204,204,220,0.6)] hover:text-[#e6e6f0]"
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Count Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-4">
                    {APPLICATION_STATUSES.map((status) => {
                        const style = APPLICATION_STATUS_COLORS[status];
                        const count = statusCounts[status] || 0;
                        return (
                            <div
                                key={status}
                                className={`px-3 py-2 rounded bg-[#22252b] border ${style.border} flex items-center justify-between`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                    <span className="text-xs text-[rgba(204,204,220,0.7)] capitalize">
                                        {status.replace("_", " ")}
                                    </span>
                                </div>
                                <span className="font-mono text-xs font-bold text-[#e6e6f0]">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-[#181b1f] border border-dashed border-[rgba(204,204,220,0.18)] rounded-lg p-12 text-center">
                    <ClipboardList className="w-10 h-10 text-[rgba(204,204,220,0.3)] mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-[#e6e6f0] mb-1">
                        No applications tracked yet
                    </h3>
                    <p className="text-xs text-[rgba(204,204,220,0.6)] max-w-md mx-auto mb-5">
                        Track upcoming Master&apos;s degree scholarships like LPDP, Chevening, AAS, or DAAD to monitor requirements, essays, and deadlines.
                    </p>
                    <Link
                        href="/scholarships"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff8833] hover:bg-[#e07728] text-white text-xs font-semibold rounded shadow transition-colors"
                    >
                        Explore Scholarships Catalog →
                    </Link>
                </div>
            ) : viewMode === "kanban" ? (
                /* =================== KANBAN BOARD VIEW =================== */
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
                    {APPLICATION_STATUSES.filter((s) => s !== "not_eligible").map((statusKey) => {
                        const style = APPLICATION_STATUS_COLORS[statusKey];
                        const items = filtered.filter((a) => a.status === statusKey);

                        return (
                            <div
                                key={statusKey}
                                className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg flex flex-col min-h-[500px]"
                            >
                                {/* Column Header */}
                                <div className="p-3 border-b border-[rgba(204,204,220,0.08)] flex items-center justify-between bg-[#14161a] rounded-t-lg">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                        <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#e6e6f0]">
                                            {statusKey.replace("_", " ")}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#22252b] text-[rgba(204,204,220,0.7)] border border-[rgba(204,204,220,0.08)]">
                                        {items.length}
                                    </span>
                                </div>

                                {/* Column Cards Container */}
                                <div className="p-2 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                                    {items.length === 0 ? (
                                        <div className="py-8 text-center text-[11px] text-[rgba(204,204,220,0.35)] font-mono border border-dashed border-[rgba(204,204,220,0.08)] rounded m-1">
                                            No items
                                        </div>
                                    ) : (
                                        items.map((app) => {
                                            const checklist = safeParseChecklist(app.checklist);
                                            const doneCount = checklist.filter((c) => c.done).length;
                                            const totalCount = checklist.length;
                                            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
                                            const days = app.scholarship.closeDate ? daysUntil(app.scholarship.closeDate) : null;
                                            const isUrgent = days !== null && days <= 7;
                                            const isWarning = days !== null && days <= 30 && days > 7;

                                            return (
                                                <div
                                                    key={app.id}
                                                    className="bg-[#22252b] hover:bg-[#282c33] border border-[rgba(204,204,220,0.08)] hover:border-[rgba(204,204,220,0.2)] rounded-md p-3 transition-all shadow-sm space-y-2"
                                                >
                                                    <div className="flex items-start justify-between gap-1">
                                                        <Link
                                                            href={`/scholarships/${app.scholarship.slug}`}
                                                            className="text-xs font-semibold text-[#e6e6f0] hover:text-[#ff8833] transition-colors leading-snug"
                                                        >
                                                            {app.scholarship.name}
                                                        </Link>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-[11px] text-[rgba(204,204,220,0.55)]">
                                                        <MapPin className="w-3 h-3 text-[#ff8833]" />
                                                        <span>{app.scholarship.country}</span>
                                                    </div>

                                                    {/* Deadline countdown */}
                                                    {days !== null && (
                                                        <div className="flex items-center justify-between text-[11px] font-mono">
                                                            <span className="text-[rgba(204,204,220,0.5)]">
                                                                Deadline:
                                                            </span>
                                                            <span
                                                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                                    isUrgent
                                                                        ? "bg-[#d03b3b]/20 text-[#ff7383]"
                                                                        : isWarning
                                                                        ? "bg-[#fab219]/20 text-[#fab219]"
                                                                        : "text-[rgba(204,204,220,0.7)]"
                                                                }`}
                                                            >
                                                                {days === 0 ? "TODAY" : days > 0 ? `${days}d left` : "Expired"}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Checklist progress */}
                                                    {totalCount > 0 && (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between text-[10px] font-mono text-[rgba(204,204,220,0.6)]">
                                                                <span>Tasks ({doneCount}/{totalCount})</span>
                                                                <span className={pct === 100 ? "text-[#0ca30c] font-bold" : ""}>
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-[#111217] rounded-full h-1 overflow-hidden">
                                                                <div
                                                                    className={`h-1 transition-all duration-300 ${
                                                                        pct === 100 ? "bg-[#0ca30c]" : "bg-[#ff8833]"
                                                                    }`}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Stage pill */}
                                                    {app.currentStage && (
                                                        <div className="text-[10px] font-mono text-[rgba(204,204,220,0.6)] bg-[#181b1f] px-2 py-0.5 rounded border border-[rgba(204,204,220,0.06)] truncate">
                                                            Stage: {app.currentStage}
                                                        </div>
                                                    )}

                                                    {/* Quick advance status dropdown */}
                                                    <div className="pt-2 border-t border-[rgba(204,204,220,0.08)] flex items-center justify-between gap-1">
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => updateStatus(app.id, e.target.value)}
                                                            className="w-full px-2 py-1 bg-[#181b1f] border border-[rgba(204,204,220,0.15)] rounded text-[11px] text-[#ccccdc] focus:outline-none focus:border-[#ff8833] cursor-pointer"
                                                        >
                                                            {APPLICATION_STATUSES.map((s) => (
                                                                <option key={s} value={s}>
                                                                    Move: {s.replace("_", " ")}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* =================== DETAILED LIST VIEW =================== */
                <div className="space-y-6">
                    {APPLICATION_STATUSES.filter((s) => applications.some((a) => a.status === s)).map((statusKey) => {
                        const style = APPLICATION_STATUS_COLORS[statusKey];
                        const items = filtered.filter((a) => a.status === statusKey);
                        if (items.length === 0) return null;

                        return (
                            <section key={statusKey} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                        {statusKey.replace("_", " ")}
                                    </span>
                                    <span className="text-xs font-mono text-[rgba(204,204,220,0.5)]">
                                        ({items.length} application{items.length !== 1 ? "s" : ""})
                                    </span>
                                    <div className="flex-1 border-t border-[rgba(204,204,220,0.08)]" />
                                </div>

                                <div className="space-y-3">
                                    {items.map((app) => {
                                        const checklist = safeParseChecklist(app.checklist);
                                        const done = checklist.filter((c) => c.done).length;
                                        const total = checklist.length;
                                        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                        const days = app.scholarship.closeDate ? daysUntil(app.scholarship.closeDate) : null;
                                        const isAddingHere = addingTo === app.id;
                                        const isDocsExpanded = expandedDocAppId === app.id;
                                        const isUrgent = days !== null && days <= 7;
                                        const isWarning = days !== null && days <= 30 && days > 7;

                                        return (
                                            <div
                                                key={app.id}
                                                className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5 transition-all shadow-sm space-y-4"
                                            >
                                                {/* Header row */}
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <Link
                                                                href={`/scholarships/${app.scholarship.slug}`}
                                                                className="text-base font-semibold text-[#e6e6f0] hover:text-[#ff8833] transition-colors"
                                                            >
                                                                {app.scholarship.name}
                                                            </Link>
                                                            <span className="text-xs text-[rgba(204,204,220,0.5)]">
                                                                • {app.scholarship.country}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-[rgba(204,204,220,0.6)]">
                                                            {days !== null && app.scholarship.closeDate && (
                                                                <span
                                                                    className={`inline-flex items-center gap-1 font-mono ${
                                                                        isUrgent
                                                                            ? "text-[#ff7383]"
                                                                            : isWarning
                                                                            ? "text-[#fab219]"
                                                                            : "text-[rgba(204,204,220,0.7)]"
                                                                    }`}
                                                                >
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    Deadline: {formatDate(app.scholarship.closeDate)} (
                                                                    {days === 0 ? "Today" : `${days}d left`})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status & Stage selectors */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <select
                                                            value={app.currentStage || "Preparing Documents"}
                                                            onChange={(e) => updateStage(app.id, e.target.value)}
                                                            className="px-2.5 py-1.5 bg-[#22252b] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#ccccdc] focus:outline-none focus:border-[#ff8833] cursor-pointer"
                                                        >
                                                            {STAGES.map((stg) => (
                                                                <option key={stg} value={stg}>
                                                                    {stg}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => updateStatus(app.id, e.target.value)}
                                                            className="px-2.5 py-1.5 bg-[#22252b] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#ccccdc] focus:outline-none focus:border-[#ff8833] cursor-pointer font-medium"
                                                        >
                                                            {APPLICATION_STATUSES.map((s) => (
                                                                <option key={s} value={s}>
                                                                    {s.replace("_", " ").toUpperCase()}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Checklist Section */}
                                                <div className="bg-[#22252b]/50 border border-[rgba(204,204,220,0.06)] rounded p-3.5 space-y-3">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-semibold text-[#e6e6f0]">
                                                            Requirements &amp; Document Checklist ({done}/{total})
                                                        </span>
                                                        <span className="font-mono text-[11px] text-[rgba(204,204,220,0.7)]">
                                                            {pct}% Completed
                                                        </span>
                                                    </div>

                                                    <div className="w-full bg-[#111217] rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                                pct === 100 ? "bg-[#0ca30c]" : "bg-[#ff8833]"
                                                            }`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                                                        {checklist.map((item, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center justify-between p-2 rounded bg-[#181b1f] border border-[rgba(204,204,220,0.06)] group"
                                                            >
                                                                <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0 pr-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.done}
                                                                        onChange={() => toggleChecklistItem(app.id, checklist, i)}
                                                                        className="w-4 h-4 rounded border-[rgba(204,204,220,0.2)] text-[#ff8833] focus:ring-0 focus:ring-offset-0 bg-[#22252b] cursor-pointer"
                                                                    />
                                                                    <span
                                                                        className={`text-xs truncate ${
                                                                            item.done
                                                                                ? "text-[rgba(204,204,220,0.4)] line-through"
                                                                                : "text-[#ccccdc]"
                                                                        }`}
                                                                    >
                                                                        {item.task}
                                                                    </span>
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeChecklistItem(app.id, checklist, i)}
                                                                    className="opacity-0 group-hover:opacity-100 text-[rgba(204,204,220,0.4)] hover:text-[#d03b3b] p-1 transition-all"
                                                                    title="Remove task"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Add item row */}
                                                    {isAddingHere ? (
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <input
                                                                ref={newTaskInputRef}
                                                                type="text"
                                                                className="flex-1 px-3 py-1.5 bg-[#111217] border border-[rgba(204,204,220,0.18)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.4)] focus:border-[#ff8833] focus:outline-none"
                                                                placeholder="e.g., Get recommendation letter from Dean..."
                                                                value={newTask}
                                                                onChange={(e) => setNewTask(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") addChecklistItem(app.id, checklist);
                                                                    if (e.key === "Escape") {
                                                                        setAddingTo(null);
                                                                        setNewTask("");
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => addChecklistItem(app.id, checklist)}
                                                                className="px-3 py-1.5 bg-[#ff8833] hover:bg-[#e07728] text-white text-xs font-semibold rounded"
                                                            >
                                                                Add
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setAddingTo(null);
                                                                    setNewTask("");
                                                                }}
                                                                className="px-3 py-1.5 bg-[#22252b] hover:bg-[#2c3235] text-[rgba(204,204,220,0.7)] text-xs rounded border border-[rgba(204,204,220,0.1)]"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setAddingTo(app.id)}
                                                            className="inline-flex items-center gap-1.5 text-xs text-[#ff8833] hover:underline pt-1 font-medium"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" /> Add custom requirement
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Document Links & Essay Drafts Accordion */}
                                                <div className="border border-[rgba(204,204,220,0.08)] rounded bg-[#14161a]">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedDocAppId(
                                                                isDocsExpanded ? null : app.id
                                                            )
                                                        }
                                                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#ccccdc] hover:text-[#e6e6f0] transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2 font-medium">
                                                            <FileText className="w-3.5 h-3.5 text-[#ff8833]" />
                                                            Document &amp; Essay Links (Google Docs / LoA / Notes)
                                                        </span>
                                                        {isDocsExpanded ? (
                                                            <ChevronUp className="w-4 h-4 text-[rgba(204,204,220,0.5)]" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-[rgba(204,204,220,0.5)]" />
                                                        )}
                                                    </button>

                                                    {isDocsExpanded && (
                                                        <div className="p-4 border-t border-[rgba(204,204,220,0.08)] space-y-3">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-[11px] font-mono text-[rgba(204,204,220,0.6)] block mb-1">
                                                                        Statement of Purpose / Essay URL (Google Docs)
                                                                    </label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type="url"
                                                                            placeholder="https://docs.google.com/document/d/..."
                                                                            value={docForms[app.id]?.sopUrl || ""}
                                                                            onChange={(e) =>
                                                                                setDocForms({
                                                                                    ...docForms,
                                                                                    [app.id]: {
                                                                                        ...docForms[app.id],
                                                                                        sopUrl: e.target.value,
                                                                                    },
                                                                                })
                                                                            }
                                                                            className="w-full px-3 py-1.5 bg-[#181b1f] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.3)] focus:border-[#ff8833] focus:outline-none"
                                                                        />
                                                                        {docForms[app.id]?.sopUrl && (
                                                                            <a
                                                                                href={docForms[app.id]?.sopUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff8833] hover:text-white"
                                                                            >
                                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="text-[11px] font-mono text-[rgba(204,204,220,0.6)] block mb-1">
                                                                        Curriculum Vitae / Resume Link
                                                                    </label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type="url"
                                                                            placeholder="https://drive.google.com/file/..."
                                                                            value={docForms[app.id]?.cvUrl || ""}
                                                                            onChange={(e) =>
                                                                                setDocForms({
                                                                                    ...docForms,
                                                                                    [app.id]: {
                                                                                        ...docForms[app.id],
                                                                                        cvUrl: e.target.value,
                                                                                    },
                                                                                })
                                                                            }
                                                                            className="w-full px-3 py-1.5 bg-[#181b1f] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.3)] focus:border-[#ff8833] focus:outline-none"
                                                                        />
                                                                        {docForms[app.id]?.cvUrl && (
                                                                            <a
                                                                                href={docForms[app.id]?.cvUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff8833] hover:text-white"
                                                                            >
                                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="text-[11px] font-mono text-[rgba(204,204,220,0.6)] block mb-1">
                                                                    Application &amp; Interview Notes / Follow-ups
                                                                </label>
                                                                <textarea
                                                                    rows={2}
                                                                    placeholder="e.g. Recommendation from Prof. Smith confirmed. Waiting for IELTS test score on May 15..."
                                                                    value={docForms[app.id]?.customNote ?? (app.notes || "")}
                                                                    onChange={(e) =>
                                                                        setDocForms({
                                                                            ...docForms,
                                                                            [app.id]: {
                                                                                ...docForms[app.id],
                                                                                customNote: e.target.value,
                                                                            },
                                                                        })
                                                                    }
                                                                    className="w-full px-3 py-1.5 bg-[#181b1f] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.3)] focus:border-[#ff8833] focus:outline-none resize-none"
                                                                />
                                                            </div>

                                                            <div className="flex justify-end pt-1">
                                                                <button
                                                                    type="button"
                                                                    disabled={savingDocId === app.id}
                                                                    onClick={() => saveDocumentLinks(app.id)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#22252b] hover:bg-[#2c3235] text-[#ccccdc] hover:text-[#e6e6f0] border border-[rgba(204,204,220,0.18)] rounded text-xs font-semibold transition-colors"
                                                                >
                                                                    {savingDocId === app.id ? (
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff8833]" />
                                                                    ) : (
                                                                        <Save className="w-3.5 h-3.5 text-[#ff8833]" />
                                                                    )}
                                                                    Save Document Info
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Footer Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-[rgba(204,204,220,0.06)] text-xs">
                                                    <span className="text-[11px] font-mono text-[rgba(204,204,220,0.4)]">
                                                        Updated {formatDate(app.updatedAt)}
                                                    </span>

                                                    {confirmDeleteId === app.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-[#ff7383]">
                                                                Confirm removal?
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeApplication(app.id)}
                                                                className="px-2.5 py-1 bg-[#d03b3b]/20 hover:bg-[#d03b3b]/30 text-[#ff7383] border border-[#d03b3b]/40 rounded text-xs font-medium"
                                                            >
                                                                Yes, Remove
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="px-2.5 py-1 bg-[#22252b] text-[rgba(204,204,220,0.7)] rounded border border-[rgba(204,204,220,0.1)] text-xs"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmDeleteId(app.id)}
                                                            className="inline-flex items-center gap-1 text-[rgba(204,204,220,0.5)] hover:text-[#ff7383] text-xs transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Remove from tracker
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
