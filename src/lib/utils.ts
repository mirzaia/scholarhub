import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Calculates days remaining until target date (YYYY-MM-DD)
 * Normalized to midnight without UTC/local timezone drift.
 */
export function daysUntil(dateStr: string): number {
    const parts = dateStr.split("-").map(Number);
    if (parts.length < 3) return 0;
    const target = new Date(parts[0], parts[1] - 1, parts[2]);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
    const parts = dateStr.split("-").map(Number);
    if (parts.length < 3) return dateStr;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export const SCHOLARSHIP_STATUSES = ["upcoming", "open", "closed", "archived"] as const;
export const PROVIDER_TYPES = ["indonesian_gov", "foreign_gov", "international_org", "local_org", "university", "private"] as const;
export const DEGREE_LEVELS = ["bachelor", "master", "phd", "postdoc", "short_course", "any"] as const;
export const FUNDING_TYPES = ["full", "partial", "tuition_only", "living_cost_only"] as const;
export const APPLICATION_STATUSES = ["interested", "preparing", "applied", "accepted", "rejected", "not_eligible"] as const;
export const LINK_TYPES = ["official", "guide", "forum", "video", "document", "social_media"] as const;
export const LOA_REQUIREMENTS = ["optional", "mandatory", "not_allowed"] as const;

export const FIELD_OF_STUDY_OPTIONS = [
    "Any",
    "STEM",
    "Social Sciences",
    "Business & Economics",
    "Health & Medicine",
    "Education & Arts",
    "Green Energy & Climate",
] as const;

export type ScholarshipStatus = typeof SCHOLARSHIP_STATUSES[number];
export type ProviderType = typeof PROVIDER_TYPES[number];
export type DegreeLevel = typeof DEGREE_LEVELS[number];
export type FundingType = typeof FUNDING_TYPES[number];
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
export type LinkType = typeof LINK_TYPES[number];
export type LoaRequirement = typeof LOA_REQUIREMENTS[number];

/**
 * Grafana-style status pill colors:
 * Subtle translucent background, 1px semi-transparent border, vivid status text
 */
export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    open: {
        bg: "bg-[#0ca30c]/10",
        text: "text-[#73bf69]",
        border: "border-[#0ca30c]/30",
        dot: "bg-[#0ca30c]",
    },
    upcoming: {
        bg: "bg-[#3d71d9]/15",
        text: "text-[#6e9fff]",
        border: "border-[#3d71d9]/40",
        dot: "bg-[#3d71d9]",
    },
    closed: {
        bg: "bg-[#d03b3b]/15",
        text: "text-[#ff7383]",
        border: "border-[#d03b3b]/30",
        dot: "bg-[#d03b3b]",
    },
    archived: {
        bg: "bg-[#22252b]",
        text: "text-[rgba(204,204,220,0.62)]",
        border: "border-[rgba(204,204,220,0.15)]",
        dot: "bg-[rgba(204,204,220,0.62)]",
    },
    interested: {
        bg: "bg-[#9085e9]/15",
        text: "text-[#b4a9f8]",
        border: "border-[#9085e9]/40",
        dot: "bg-[#9085e9]",
    },
    preparing: {
        bg: "bg-[#fab219]/15",
        text: "text-[#fcd34d]",
        border: "border-[#fab219]/35",
        dot: "bg-[#fab219]",
    },
    applied: {
        bg: "bg-[#3d71d9]/15",
        text: "text-[#6e9fff]",
        border: "border-[#3d71d9]/40",
        dot: "bg-[#3d71d9]",
    },
    accepted: {
        bg: "bg-[#0ca30c]/15",
        text: "text-[#73bf69]",
        border: "border-[#0ca30c]/40",
        dot: "bg-[#0ca30c]",
    },
    rejected: {
        bg: "bg-[#d03b3b]/15",
        text: "text-[#ff7383]",
        border: "border-[#d03b3b]/35",
        dot: "bg-[#d03b3b]",
    },
    not_eligible: {
        bg: "bg-[#22252b]",
        text: "text-[rgba(204,204,220,0.62)]",
        border: "border-[rgba(204,204,220,0.15)]",
        dot: "bg-[rgba(204,204,220,0.62)]",
    },
};

export const APPLICATION_STATUS_COLORS = STATUS_COLORS;

export const PROVIDER_LABELS: Record<string, string> = {
    indonesian_gov: "Indonesian Government",
    foreign_gov: "Foreign Government",
    international_org: "International Organization",
    local_org: "Local Scholarship",
    university: "University Scholarship",
    private: "Private / Corporate",
};

export const PROVIDER_CATEGORY_ICONS: Record<string, string> = {
    indonesian_gov: "🇮🇩",
    foreign_gov: "🌏",
    international_org: "🌐",
    local_org: "🏠",
    university: "🏛️",
    private: "🏢",
};

export const DEGREE_LABELS: Record<string, string> = {
    bachelor: "Bachelor (S1)",
    master: "Master (S2)",
    phd: "PhD (S3)",
    postdoc: "Postdoc",
    short_course: "Short Course",
    any: "Any Level",
};

export const FUNDING_LABELS: Record<string, string> = {
    full: "Fully Funded",
    partial: "Partial Funding",
    tuition_only: "Tuition Waiver",
    living_cost_only: "Living Allowance Only",
};

export const LOA_LABELS: Record<string, string> = {
    optional: "LoA Optional",
    mandatory: "LoA Mandatory",
    not_allowed: "LoA Not Allowed",
};

/**
 * Generates an iCalendar (.ics) string for application deadlines.
 */
export function generateIcsContent(event: {
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    url?: string;
}): string {
    const cleanDate = event.date.replace(/-/g, "");
    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//ScholarHub//Scholarship Monitoring//EN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@scholarhub.id`,
        `DTSTAMP:${cleanDate}T000000Z`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `DTEND;VALUE=DATE:${cleanDate}`,
        `SUMMARY:Deadline: ${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
        event.url ? `URL:${event.url}` : "",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ]
        .filter(Boolean)
        .join("\r\n");
}

/**
 * Generates a direct Google Calendar URL to create an event with one click.
 */
export function getGoogleCalendarUrl(event: {
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    url?: string;
}): string {
    const cleanDate = event.date.replace(/-/g, "");
    const text = encodeURIComponent(`Deadline: ${event.title}`);
    const details = encodeURIComponent(
        `${event.description}\n\nOfficial Link: ${event.url || "https://scholarhub.id"}`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${cleanDate}/${cleanDate}&details=${details}`;
}
