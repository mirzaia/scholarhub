"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APPLICATION_STATUSES, APPLICATION_STATUS_COLORS, ApplicationStatus } from "@/lib/utils";
import { Bookmark, ChevronDown, Check, Loader2 } from "lucide-react";

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
    const [status, setStatus] = useState<string>(existingStatus || "");
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

    const currentStyle = status && APPLICATION_STATUS_COLORS[status as ApplicationStatus]
        ? APPLICATION_STATUS_COLORS[status as ApplicationStatus]
        : null;

    return (
        <div className="relative inline-block">
            <button
                type="button"
                disabled={saving}
                onClick={() => setShowDropdown(!showDropdown)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold transition-all border ${
                    status
                        ? `${currentStyle?.bg} ${currentStyle?.text} ${currentStyle?.border} hover:brightness-110 shadow-sm`
                        : "bg-[#22252b] hover:bg-[#2c3235] text-[#ccccdc] hover:text-[#e6e6f0] border-[rgba(204,204,220,0.18)]"
                }`}
            >
                {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff8833]" />
                ) : (
                    <Bookmark className={`w-3.5 h-3.5 ${status ? "fill-current" : ""}`} />
                )}
                <span>
                    {status ? status.replace("_", " ").toUpperCase() : "Track in Tracker"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute top-full right-0 mt-1.5 bg-[#181b1f] border border-[rgba(204,204,220,0.18)] rounded-md py-1.5 z-50 min-w-[200px] shadow-2xl backdrop-blur-md">
                        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.5)] border-b border-[rgba(204,204,220,0.08)] mb-1">
                            Select Status
                        </div>
                        {APPLICATION_STATUSES.map((s) => {
                            const isSelected = s === status;
                            const style = APPLICATION_STATUS_COLORS[s];
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleTrack(s)}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                                        isSelected
                                            ? "bg-[#22252b] text-[#e6e6f0] font-medium"
                                            : "text-[rgba(204,204,220,0.78)] hover:bg-[#22252b] hover:text-[#e6e6f0]"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                        <span className="capitalize">{s.replace("_", " ")}</span>
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#ff8833]" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
