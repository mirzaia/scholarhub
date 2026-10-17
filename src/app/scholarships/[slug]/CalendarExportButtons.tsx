"use client";

import { Calendar, Download, ExternalLink } from "lucide-react";
import { generateIcsContent, getGoogleCalendarUrl } from "@/lib/utils";

interface CalendarExportButtonsProps {
    title: string;
    description: string;
    date: string;
    url?: string;
    slug: string;
}

export default function CalendarExportButtons({
    title,
    description,
    date,
    url,
    slug,
}: CalendarExportButtonsProps) {
    const googleCalUrl = getGoogleCalendarUrl({
        title,
        description,
        date,
        url,
    });

    const handleDownloadIcs = () => {
        const icsContent = generateIcsContent({
            title,
            description,
            date,
            url,
        });
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${slug}-deadline.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#22252b] hover:bg-[#2c3235] text-[#ccccdc] hover:text-[#e6e6f0] border border-[rgba(204,204,220,0.15)] rounded text-xs font-medium transition-colors"
                title="Add deadline to Google Calendar"
            >
                <Calendar className="w-3.5 h-3.5 text-[#3d71d9]" />
                Google Calendar
                <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#22252b] hover:bg-[#2c3235] text-[#ccccdc] hover:text-[#e6e6f0] border border-[rgba(204,204,220,0.15)] rounded text-xs font-medium transition-colors"
                title="Download iCal (.ics) file for Apple Calendar, Outlook, etc."
            >
                <Download className="w-3.5 h-3.5 text-[#ff8833]" />
                Download .ics
            </button>
        </div>
    );
}
