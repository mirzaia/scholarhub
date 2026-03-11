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

export function daysUntil(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export const SCHOLARSHIP_STATUSES = ["upcoming", "open", "closed", "archived"] as const;
export const PROVIDER_TYPES = ["indonesian_gov", "foreign_gov", "international_org", "local_org", "university", "private"] as const;
export const DEGREE_LEVELS = ["bachelor", "master", "phd", "postdoc", "short_course", "any"] as const;
export const FUNDING_TYPES = ["full", "partial", "tuition_only", "living_cost_only"] as const;
export const APPLICATION_STATUSES = ["interested", "preparing", "applied", "accepted", "rejected", "not_eligible"] as const;
export const LINK_TYPES = ["official", "guide", "forum", "video", "document", "social_media"] as const;

export type ScholarshipStatus = typeof SCHOLARSHIP_STATUSES[number];
export type ProviderType = typeof PROVIDER_TYPES[number];
export type DegreeLevel = typeof DEGREE_LEVELS[number];
export type FundingType = typeof FUNDING_TYPES[number];
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
export type LinkType = typeof LINK_TYPES[number];

export const STATUS_COLORS: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    open: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    closed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    interested: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    preparing: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    not_eligible: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export const PROVIDER_LABELS: Record<string, string> = {
    indonesian_gov: "Indonesian Government",
    foreign_gov: "Foreign Government",
    international_org: "International Organization",
    local_org: "Local Scholarship",
    university: "University Scholarship",
    private: "Private",
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
    bachelor: "Bachelor",
    master: "Master",
    phd: "PhD",
    postdoc: "Postdoc",
    short_course: "Short Course",
    any: "Any Level",
};

export const FUNDING_LABELS: Record<string, string> = {
    full: "Fully Funded",
    partial: "Partial",
    tuition_only: "Tuition Only",
    living_cost_only: "Living Cost Only",
};
