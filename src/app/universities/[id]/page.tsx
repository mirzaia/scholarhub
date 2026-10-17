import Link from "next/link";
import { getUniversityById } from "@/services/universities";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    Globe,
    MapPin,
    GraduationCap,
    ExternalLink,
    Link as LinkIcon,
} from "lucide-react";
import { STATUS_COLORS, ScholarshipStatus } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UniversityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const university = await getUniversityById(id);

    if (!university) return notFound();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Back to list */}
            <div>
                <Link
                    href="/universities"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[rgba(204,204,220,0.6)] hover:text-[#ff8833] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Universities
                </Link>
            </div>

            {/* Hero Panel */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8833] via-[#f55f3e] to-[#fab219]" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#22252b] text-[#ff8833] border border-[#ff8833]/30">
                                <MapPin className="w-3 h-3" /> {university.country}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#e6e6f0]">
                            {university.name}
                        </h1>
                    </div>

                    {university.website && (
                        <a
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff8833] hover:bg-[#e07728] text-white text-xs font-semibold rounded transition-colors shadow flex-shrink-0"
                        >
                            <Globe className="w-3.5 h-3.5" /> Visit University Website
                            <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                    )}
                </div>

                {university.description && (
                    <p className="text-xs text-[rgba(204,204,220,0.8)] leading-relaxed max-w-4xl">
                        {university.description}
                    </p>
                )}
            </div>

            {/* Grid: Associated Scholarships & Resource Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Associated Scholarships */}
                <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                    <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center gap-2 mb-4 uppercase tracking-wide">
                        <GraduationCap className="w-4 h-4 text-[#ff8833]" />
                        Eligible Scholarships ({university.scholarships.length})
                    </h2>

                    {university.scholarships.length > 0 ? (
                        <div className="space-y-2">
                            {university.scholarships.map((su) => {
                                const statusStyle =
                                    STATUS_COLORS[su.scholarship.status as ScholarshipStatus] ||
                                    STATUS_COLORS.upcoming;

                                return (
                                    <Link
                                        href={`/scholarships/${su.scholarship.slug}`}
                                        key={su.scholarship.id}
                                        className="flex items-center justify-between p-3 rounded bg-[#22252b] hover:bg-[#2c3235] border border-[rgba(204,204,220,0.06)] transition-colors group"
                                    >
                                        <div className="min-w-0 pr-3">
                                            <p className="text-xs font-medium text-[#e6e6f0] group-hover:text-[#ff8833] transition-colors truncate">
                                                {su.scholarship.name}
                                            </p>
                                            <p className="text-[11px] text-[rgba(204,204,220,0.5)] mt-0.5">
                                                {su.scholarship.country} • {su.scholarship.degreeLevel.toUpperCase()}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border flex-shrink-0 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                            {su.scholarship.status}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-[rgba(204,204,220,0.5)]">
                            No scholarships currently linked directly to this university record.
                        </p>
                    )}
                </div>

                {/* Resource Links */}
                <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                    <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center gap-2 mb-4 uppercase tracking-wide">
                        <LinkIcon className="w-4 h-4 text-[#ff8833]" />
                        Official Portals &amp; Guides ({university.links.length})
                    </h2>

                    {university.links.length > 0 ? (
                        <div className="space-y-2">
                            {university.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded bg-[#22252b] hover:bg-[#2c3235] border border-[rgba(204,204,220,0.06)] transition-colors group"
                                >
                                    <div className="min-w-0 pr-2">
                                        <p className="text-xs font-medium text-[#e6e6f0] group-hover:text-[#ff8833] transition-colors truncate">
                                            {link.label}
                                        </p>
                                        <span className="text-[10px] font-mono uppercase text-[rgba(204,204,220,0.45)]">
                                            {link.linkType}
                                        </span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-[rgba(204,204,220,0.4)] group-hover:text-[#e6e6f0]" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-[rgba(204,204,220,0.5)]">
                            No specific resource links recorded for this university.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
