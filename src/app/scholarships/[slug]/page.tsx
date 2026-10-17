import Link from "next/link";
import { getScholarshipBySlug } from "@/services/scholarships";
import { getApplicationByUserAndScholarship } from "@/services/applications";
import {
    formatDate,
    daysUntil,
    PROVIDER_LABELS,
    DEGREE_LABELS,
    FUNDING_LABELS,
    LOA_LABELS,
    STATUS_COLORS,
    ScholarshipStatus,
} from "@/lib/utils";
import { notFound } from "next/navigation";
import TrackButton from "./TrackButton";
import CalendarExportButtons from "./CalendarExportButtons";
import {
    ArrowLeft,
    Globe,
    MapPin,
    Clock,
    Building2,
    GraduationCap,
    ExternalLink,
    BookOpen,
    Video,
    MessageCircle,
    FileText,
    Smartphone,
    Link as LinkIcon,
    Award,
    ShieldCheck,
    CalendarDays,
} from "lucide-react";

export const dynamic = "force-dynamic";

const LINK_ICONS: Record<string, React.ReactNode> = {
    official: <Globe className="w-4 h-4 text-[#3d71d9]" />,
    guide: <BookOpen className="w-4 h-4 text-[#0ca30c]" />,
    video: <Video className="w-4 h-4 text-[#d03b3b]" />,
    forum: <MessageCircle className="w-4 h-4 text-[#fab219]" />,
    document: <FileText className="w-4 h-4 text-[rgba(204,204,220,0.65)]" />,
    social_media: <Smartphone className="w-4 h-4 text-[#a371f7]" />,
};

export default async function ScholarshipDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const scholarship = await getScholarshipBySlug(slug);

    if (!scholarship) return notFound();

    const existingApp = await getApplicationByUserAndScholarship(
        "default-user",
        scholarship.id
    );

    const today = new Date().toISOString().split("T")[0];
    const daysLeft = scholarship.closeDate ? daysUntil(scholarship.closeDate) : null;
    const isUrgent = daysLeft !== null && daysLeft <= 7;
    const isWarning = daysLeft !== null && daysLeft <= 30 && daysLeft > 7;

    const statusStyle =
        STATUS_COLORS[scholarship.status as ScholarshipStatus] ||
        STATUS_COLORS.upcoming;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Breadcrumb / Back button */}
            <div>
                <Link
                    href="/scholarships"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[rgba(204,204,220,0.65)] hover:text-[#ff8833] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
                </Link>
            </div>

            {/* Hero Panel */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8833] via-[#f55f3e] to-[#fab219]" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                {scholarship.status.toUpperCase()}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#22252b] text-[#ccccdc] border border-[rgba(204,204,220,0.1)]">
                                {PROVIDER_LABELS[scholarship.providerType] || scholarship.providerType}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#22252b] text-[#ccccdc] border border-[rgba(204,204,220,0.1)]">
                                {DEGREE_LABELS[scholarship.degreeLevel] || scholarship.degreeLevel}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#22252b] text-[#0ca30c] border border-[#0ca30c]/25">
                                {FUNDING_LABELS[scholarship.fundingType] || scholarship.fundingType}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#22252b] text-[rgba(204,204,220,0.7)] border border-[rgba(204,204,220,0.1)]">
                                <MapPin className="w-3 h-3 mr-1 text-[#ff8833]" />
                                {scholarship.country}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#e6e6f0] tracking-tight">
                            {scholarship.name}
                        </h1>
                    </div>

                    {/* Quick tracker status */}
                    <div className="flex-shrink-0">
                        <TrackButton
                            scholarshipId={scholarship.id}
                            existingStatus={existingApp?.status || null}
                            existingId={existingApp?.id || null}
                        />
                    </div>
                </div>

                <p className="text-sm text-[rgba(204,204,220,0.85)] leading-relaxed mb-6 max-w-4xl">
                    {scholarship.description}
                </p>

                {/* Deadline & Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[rgba(204,204,220,0.08)]">
                    <div className="flex flex-wrap items-center gap-4">
                        {scholarship.closeDate && (
                            <div className="flex items-center gap-2">
                                <Clock
                                    className={`w-4 h-4 ${
                                        isUrgent
                                            ? "text-[#d03b3b]"
                                            : isWarning
                                            ? "text-[#fab219]"
                                            : "text-[rgba(204,204,220,0.5)]"
                                    }`}
                                />
                                <span className="text-xs text-[rgba(204,204,220,0.65)]">
                                    Deadline:{" "}
                                    <strong className="text-[#e6e6f0]">
                                        {formatDate(scholarship.closeDate)}
                                    </strong>
                                </span>
                                {daysLeft !== null && scholarship.status === "open" && (
                                    <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                            isUrgent
                                                ? "bg-[#d03b3b]/20 text-[#ff7383] border border-[#d03b3b]/40"
                                                : isWarning
                                                ? "bg-[#fab219]/20 text-[#fab219] border border-[#fab219]/40"
                                                : "bg-[#22252b] text-[rgba(204,204,220,0.7)]"
                                        }`}
                                    >
                                        {daysLeft === 0 ? "CLOSES TODAY" : `${daysLeft}d left`}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {scholarship.closeDate && (
                            <CalendarExportButtons
                                title={scholarship.name}
                                description={`Scholarship application deadline for ${scholarship.name}. Link: ${scholarship.officialUrl}`}
                                date={scholarship.closeDate}
                                url={scholarship.officialUrl}
                                slug={scholarship.slug}
                            />
                        )}
                        <a
                            href={scholarship.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ff8833] hover:bg-[#e07728] text-white text-xs font-semibold rounded transition-colors shadow"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Official Portal
                            <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Master's Degree Eligibility Criteria Panel (Key Requirement Matrix) */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(204,204,220,0.08)]">
                    <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center gap-2 uppercase tracking-wide">
                        <GraduationCap className="w-4 h-4 text-[#ff8833]" />
                        Master&apos;s Degree Eligibility & Requirements Matrix
                    </h2>
                    <span className="text-[11px] font-mono text-[rgba(204,204,220,0.5)]">
                        Target Intake: 2026/2027
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Minimum GPA */}
                    <div className="bg-[#22252b] border border-[rgba(204,204,220,0.08)] rounded p-3.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.5)] block mb-1">
                            Minimum GPA (IPK S1)
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold font-mono text-[#e6e6f0]">
                                {scholarship.gpaMin ? scholarship.gpaMin.toFixed(2) : "No Min"}
                            </span>
                            <span className="text-xs text-[rgba(204,204,220,0.5)] font-mono">
                                / 4.00 scale
                            </span>
                        </div>
                        <p className="text-[11px] text-[rgba(204,204,220,0.65)] mt-1">
                            {scholarship.gpaMin ? `Undergraduate GPA ≥ ${scholarship.gpaMin}` : "Cumulative GPA not strictly restricted"}
                        </p>
                    </div>

                    {/* English Requirement */}
                    <div className="bg-[#22252b] border border-[rgba(204,204,220,0.08)] rounded p-3.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.5)] block mb-1">
                            English Language Test
                        </span>
                        <div className="text-sm font-bold text-[#e6e6f0] truncate" title={scholarship.englishRequirement || "Check official booklet"}>
                            {scholarship.englishRequirement || "Not specified / Exempted"}
                        </div>
                        <p className="text-[11px] text-[rgba(204,204,220,0.65)] mt-1">
                            Valid within 2 years of deadline
                        </p>
                    </div>

                    {/* Letter of Acceptance (LoA) */}
                    <div className="bg-[#22252b] border border-[rgba(204,204,220,0.08)] rounded p-3.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.5)] block mb-1">
                            LoA Requirement
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                    scholarship.requiresLoa === "mandatory"
                                        ? "bg-[#d03b3b]/15 text-[#ff7383] border border-[#d03b3b]/30"
                                        : scholarship.requiresLoa === "not_allowed"
                                        ? "bg-[#fab219]/15 text-[#fab219] border border-[#fab219]/30"
                                        : "bg-[#0ca30c]/15 text-[#73bf69] border border-[#0ca30c]/30"
                                }`}
                            >
                                <ShieldCheck className="w-3 h-3" />
                                {(scholarship.requiresLoa && LOA_LABELS[scholarship.requiresLoa]) || "LoA Optional"}
                            </span>
                        </div>
                        <p className="text-[11px] text-[rgba(204,204,220,0.65)] mt-1">
                            {scholarship.requiresLoa === "mandatory"
                                ? "Must have Unconditional LoA"
                                : "Can apply before receiving university offer"}
                        </p>
                    </div>

                    {/* Age & Work Experience */}
                    <div className="bg-[#22252b] border border-[rgba(204,204,220,0.08)] rounded p-3.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.5)] block mb-1">
                            Age & Work Experience
                        </span>
                        <div className="text-sm font-bold text-[#e6e6f0]">
                            {scholarship.ageMax ? `Max ${scholarship.ageMax} yrs` : "No age cap"}
                            <span className="text-xs text-[rgba(204,204,220,0.5)] font-normal ml-2">
                                • {scholarship.workExpYears ? `${scholarship.workExpYears}+ yrs exp` : "Fresh grads eligible"}
                            </span>
                        </div>
                        <p className="text-[11px] text-[rgba(204,204,220,0.65)] mt-1">
                            {scholarship.fieldOfStudy ? `Target: ${scholarship.fieldOfStudy}` : "Open to all disciplines"}
                        </p>
                    </div>
                </div>

                {/* Coverage Summary Banner */}
                {scholarship.coverageSummary && (
                    <div className="mt-4 p-3.5 bg-[#22252b]/60 border border-[rgba(204,204,220,0.08)] rounded flex items-start gap-3">
                        <Award className="w-4 h-4 text-[#fab219] flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="text-xs font-semibold text-[#e6e6f0] block mb-0.5">
                                Coverage & Benefits Included
                            </span>
                            <p className="text-xs text-[rgba(204,204,220,0.78)] leading-relaxed">
                                {scholarship.coverageSummary}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Grid: Timeline & Universities + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline */}
                    {scholarship.dates.length > 0 && (
                        <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                            <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center gap-2 mb-5 uppercase tracking-wide">
                                <CalendarDays className="w-4 h-4 text-[#ff8833]" />
                                Key Milestones & Selection Timeline
                            </h2>
                            <div className="relative pl-6 space-y-4">
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[rgba(204,204,220,0.12)]" />
                                {scholarship.dates.map((date) => {
                                    const isPast = date.dateValue < today;
                                    const isCurrent =
                                        !isPast &&
                                        scholarship.dates.findIndex((d) => d.dateValue >= today) ===
                                            scholarship.dates.indexOf(date);

                                    return (
                                        <div key={date.id} className="relative pl-4 group">
                                            <div
                                                className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 transition-all ${
                                                    isPast
                                                        ? "bg-[#0ca30c] border-[#0ca30c]"
                                                        : isCurrent
                                                        ? "bg-[#ff8833] border-[#ff8833] ring-4 ring-[#ff8833]/25"
                                                        : "bg-[#181b1f] border-[rgba(204,204,220,0.3)]"
                                                }`}
                                            />
                                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                                <p className="text-sm font-medium text-[#e6e6f0] group-hover:text-[#ff8833] transition-colors">
                                                    {date.label}
                                                </p>
                                                <span className="text-xs font-mono text-[rgba(204,204,220,0.55)]">
                                                    {formatDate(date.dateValue)}
                                                </span>
                                            </div>
                                            {date.note && (
                                                <p className="text-xs text-[rgba(204,204,220,0.65)] mt-0.5">
                                                    {date.note}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Related Universities */}
                    {scholarship.universities.length > 0 && (
                        <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                            <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center justify-between mb-4 uppercase tracking-wide">
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#ff8833]" />
                                    Eligible Destination Universities ({scholarship.universities.length})
                                </span>
                                <Link
                                    href="/universities"
                                    className="text-xs text-[#ff8833] hover:underline font-mono"
                                >
                                    Browse All →
                                </Link>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {scholarship.universities.map((su) => (
                                    <Link
                                        href={`/universities/${su.university.id}`}
                                        key={su.university.id}
                                        className="flex items-center justify-between p-3 rounded bg-[#22252b] hover:bg-[#2c3235] border border-[rgba(204,204,220,0.08)] transition-colors group"
                                    >
                                        <div className="min-w-0 pr-2">
                                            <p className="text-xs font-medium text-[#e6e6f0] group-hover:text-[#ff8833] transition-colors truncate">
                                                {su.university.name}
                                            </p>
                                            <p className="text-[11px] text-[rgba(204,204,220,0.55)]">
                                                {su.university.country}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-[rgba(204,204,220,0.4)] group-hover:text-[#ff8833] flex-shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Official Resources & Guides */}
                    {scholarship.links.length > 0 && (
                        <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                            <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center gap-2 mb-3 uppercase tracking-wide">
                                <LinkIcon className="w-4 h-4 text-[#ff8833]" />
                                Booklets & Official Links
                            </h2>
                            <div className="space-y-1.5">
                                {scholarship.links.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2.5 rounded bg-[#22252b] hover:bg-[#2c3235] border border-[rgba(204,204,220,0.06)] transition-colors group"
                                    >
                                        {LINK_ICONS[link.linkType] || (
                                            <ExternalLink className="w-4 h-4 text-[rgba(204,204,220,0.5)]" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-[#ccccdc] group-hover:text-[#e6e6f0] transition-colors truncate">
                                                {link.label}
                                            </p>
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(204,204,220,0.45)]">
                                                {link.linkType}
                                            </span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-[rgba(204,204,220,0.4)] group-hover:text-[#e6e6f0]" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata Overview Panel */}
                    <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                        <h2 className="text-sm font-semibold text-[#e6e6f0] flex items-center gap-2 mb-4 uppercase tracking-wide">
                            <FileText className="w-4 h-4 text-[#ff8833]" />
                            Scheme Specifications
                        </h2>
                        <dl className="space-y-3 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-[rgba(204,204,220,0.06)]">
                                <dt className="text-[rgba(204,204,220,0.55)]">Destination</dt>
                                <dd className="font-medium text-[#e6e6f0] text-right">{scholarship.country}</dd>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-[rgba(204,204,220,0.06)]">
                                <dt className="text-[rgba(204,204,220,0.55)]">Provider</dt>
                                <dd className="font-medium text-[#e6e6f0] text-right">
                                    {PROVIDER_LABELS[scholarship.providerType] || scholarship.providerType}
                                </dd>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-[rgba(204,204,220,0.06)]">
                                <dt className="text-[rgba(204,204,220,0.55)]">Degree Level</dt>
                                <dd className="font-medium text-[#e6e6f0] text-right">
                                    {DEGREE_LABELS[scholarship.degreeLevel] || scholarship.degreeLevel}
                                </dd>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-[rgba(204,204,220,0.06)]">
                                <dt className="text-[rgba(204,204,220,0.55)]">Funding Model</dt>
                                <dd className="font-medium text-[#0ca30c] text-right">
                                    {FUNDING_LABELS[scholarship.fundingType] || scholarship.fundingType}
                                </dd>
                            </div>
                            {scholarship.openDate && (
                                <div className="flex justify-between py-1.5 border-b border-[rgba(204,204,220,0.06)]">
                                    <dt className="text-[rgba(204,204,220,0.55)]">Opening Date</dt>
                                    <dd className="font-mono text-[#e6e6f0] text-right">
                                        {formatDate(scholarship.openDate)}
                                    </dd>
                                </div>
                            )}
                            {scholarship.closeDate && (
                                <div className="flex justify-between py-1.5">
                                    <dt className="text-[rgba(204,204,220,0.55)]">Closing Deadline</dt>
                                    <dd className="font-mono font-bold text-[#ff8833] text-right">
                                        {formatDate(scholarship.closeDate)}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </main>
    );
}
