"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APPLICATION_STATUSES } from "@/lib/utils";

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
            <button className="btn btn-secondary" disabled>
                ⏳ Saving...
            </button>
        );
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                className={`btn ${status ? "btn-secondary" : "btn-primary"}`}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {status ? (
                    <>📋 {status.replace("_", " ")} ▾</>
                ) : (
                    <>📌 Track This Scholarship</>
                )}
            </button>
            {showDropdown && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        marginTop: 8,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        padding: 4,
                        zIndex: 100,
                        minWidth: 180,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                    }}
                >
                    {APPLICATION_STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleTrack(s)}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px 12px",
                                background: s === status ? "rgba(99,102,241,0.12)" : "transparent",
                                border: "none",
                                borderRadius: 6,
                                color: "var(--text-primary)",
                                fontSize: 13,
                                textAlign: "left",
                                cursor: "pointer",
                                textTransform: "capitalize",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "rgba(99,102,241,0.12)")
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                s === status ? "rgba(99,102,241,0.12)" : "transparent")
                            }
                        >
                            {s.replace("_", " ")}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
