import Link from "next/link";
import { getScholarshipBySlug } from "@/services/scholarships";
import { getApplicationByUserAndScholarship } from "@/services/applications";
import { formatDate, daysUntil, PROVIDER_LABELS, DEGREE_LABELS, FUNDING_LABELS } from "@/lib/utils";
import { notFound } from "next/navigation";
import TrackButton from "./TrackButton";
import { ArrowLeft, Globe, MapPin, Clock, Calendar, Building2, GraduationCap, ExternalLink, BookOpen, Video, MessageCircle, FileText, Smartphone, Link as LinkIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const LINK_ICONS: Record<string, React.ReactNode> = {
    official: <Globe className="w-4 h-4 text-blue-500" />,
    guide: <BookOpen className="w-4 h-4 text-emerald-500" />,
    video: <Video className="w-4 h-4 text-red-500" />,
    forum: <MessageCircle className="w-4 h-4 text-amber-500" />,
    document: <FileText className="w-4 h-4 text-slate-500" />,
    social_media: <Smartphone className="w-4 h-4 text-indigo-500" />,
};

export default async function ScholarshipDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const scholarship = await getScholarshipBySlug(params.slug);

    if (!scholarship) return notFound();

    const existingApp = await getApplicationByUserAndScholarship(
        "default-user",
        scholarship.id
    );

    const today = new Date().toISOString().split("T")[0];
    const daysLeft = scholarship.closeDate ? daysUntil(scholarship.closeDate) : null;
    const isUrgent = daysLeft !== null && daysLeft <= 7;
    const isWarning = daysLeft !== null && daysLeft <= 30 && daysLeft > 7;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/scholarships" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Scholarships
            </Link>

            {/* Hero */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm relative overflow-hidden mb-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{scholarship.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        scholarship.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                        scholarship.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {FUNDING_LABELS[scholarship.fundingType] || scholarship.fundingType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                        {DEGREE_LABELS[scholarship.degreeLevel] || scholarship.degreeLevel}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                        {PROVIDER_LABELS[scholarship.providerType] || scholarship.providerType}
                    </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{scholarship.description}</p>
                <div className="flex items-center gap-4 flex-wrap mb-5">
                    <span className="text-sm text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {scholarship.country}
                    </span>
                    {daysLeft !== null && scholarship.status === "open" && (
                        <span className={`text-sm font-semibold flex items-center gap-1.5 ${
                            isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                            <Clock className="w-4 h-4" /> {daysLeft} days until deadline
                        </span>
                    )}
                </div>
                <div className="flex gap-3 flex-wrap">
                    <a
                        href={scholarship.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Globe className="w-4 h-4" /> Visit Official Website
                    </a>
                    <TrackButton
                        scholarshipId={scholarship.id}
                        existingStatus={existingApp?.status || null}
                        existingId={existingApp?.id || null}
                    />
                </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline */}
                    {scholarship.dates.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-5">
                                <Calendar className="w-5 h-5 text-indigo-500" /> Timeline
                            </h2>
                            <div className="relative pl-7">
                                <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-slate-200" />
                                {scholarship.dates.map((date) => {
                                    const isPast = date.dateValue < today;
                                    const isCurrent = !isPast && scholarship.dates.findIndex(d => d.dateValue >= today) === scholarship.dates.indexOf(date);

                                    return (
                                        <div key={date.id} className="relative pb-5 last:pb-0">
                                            <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${
                                                isPast ? 'bg-emerald-500 border-emerald-500' :
                                                isCurrent ? 'bg-indigo-500 border-indigo-500 ring-4 ring-indigo-100' :
                                                'bg-white border-slate-300'
                                            }`} />
                                            <p className="text-xs text-slate-400 mb-0.5">{formatDate(date.dateValue)}</p>
                                            <p className="text-sm font-medium text-slate-700">{date.label}</p>
                                            {date.note && (
                                                <p className="text-xs text-slate-400 mt-0.5">{date.note}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Related Universities */}
                    {scholarship.universities.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-indigo-500" /> Related Universities
                            </h2>
                            <div className="space-y-2">
                                {scholarship.universities.map((su) => (
                                    <Link
                                        href={`/universities/${su.university.id}`}
                                        key={su.university.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <Building2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{su.university.name}</p>
                                            <p className="text-xs text-slate-400">{su.university.country}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Resource Links */}
                    {scholarship.links.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                                <LinkIcon className="w-5 h-5 text-indigo-500" /> Resources
                            </h2>
                            <div className="space-y-1">
                                {scholarship.links.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                                    >
                                        {LINK_ICONS[link.linkType] || <ExternalLink className="w-4 h-4 text-slate-400" />}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{link.label}</p>
                                            <p className="text-xs text-slate-400">{link.linkType}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-indigo-500" /> Key Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Country</p>
                                <p className="text-sm font-medium text-slate-700">{scholarship.country}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Provider Type</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {PROVIDER_LABELS[scholarship.providerType] || scholarship.providerType}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Degree Level</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {DEGREE_LABELS[scholarship.degreeLevel] || scholarship.degreeLevel}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Funding</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {FUNDING_LABELS[scholarship.fundingType] || scholarship.fundingType}
                                </p>
                            </div>
                            {scholarship.openDate && (
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Opens</p>
                                    <p className="text-sm font-medium text-slate-700">{formatDate(scholarship.openDate)}</p>
                                </div>
                            )}
                            {scholarship.closeDate && (
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Deadline</p>
                                    <p className="text-sm font-medium text-slate-700">{formatDate(scholarship.closeDate)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
