"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APPLICATION_STATUSES } from "@/lib/utils";
import { Bookmark, ChevronDown } from "lucide-react";

interface TrackButtonProps {
    scholarshipId: string;
    existingStatus: string | null;
    existingId: string | null;
}

export default function TrackButton({
    scholarshipId,
    existingStatus,
    existingId,
}: TrackButtonProps) {
    const [status, setStatus] = useState(existingStatus || "");
    const [saving, setSaving] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleTrack = async (newStatus: string) => {
        setSaving(true);
        setShowDropdown(false);

        try {
            if (existingId) {
                await fetch(`/api/applications/${existingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });
            } else {
                await fetch("/api/applications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scholarshipId, status: newStatus }),
                });
            }
            setStatus(newStatus);
            router.refresh();
        } catch (err) {
            console.error("Failed to track:", err);
        }
        setSaving(false);
    };

    if (saving) {
        return (
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed" disabled>
                Saving...
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                    status
                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Bookmark className="w-4 h-4" />
                {status ? (
                    <>{status.replace("_", " ")} <ChevronDown className="w-3.5 h-3.5" /></>
                ) : (
                    <>Track This Scholarship</>
                )}
            </button>
            {showDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg py-1 z-50 min-w-[180px] shadow-lg">
                    {APPLICATION_STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleTrack(s)}
                            className={`block w-full px-4 py-2 text-left text-sm capitalize transition-colors ${
                                s === status
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {s.replace("_", " ")}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
