import Link from "next/link";
import { getUniversityById } from "@/services/universities";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Globe, MapPin, GraduationCap, ExternalLink, Link as LinkIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UniversityDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const university = await getUniversityById(params.id);

    if (!university) return notFound();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/universities" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Universities
            </Link>

            {/* Hero */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm relative overflow-hidden mb-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{university.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5" /> {university.country}
                    </span>
                </div>
                {university.description && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">{university.description}</p>
                )}
                {university.website && (
                    <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Globe className="w-4 h-4" /> Visit Website
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Associated Scholarships */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-indigo-500" /> Associated Scholarships
                    </h2>
                    {university.scholarships.length > 0 ? (
                        <div className="space-y-2">
                            {university.scholarships.map((su) => (
                                <Link
                                    href={`/scholarships/${su.scholarship.slug}`}
                                    key={su.scholarship.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                                >
                                    <GraduationCap className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{su.scholarship.name}</p>
                                        <p className="text-xs text-slate-400">{su.scholarship.country} · {su.scholarship.status}</p>
                                    </div>
                                    <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                        su.scholarship.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                                        su.scholarship.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {su.scholarship.status}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            No scholarships linked to this university yet.
                        </p>
                    )}
                </div>

                {/* Resource Links */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <LinkIcon className="w-5 h-5 text-indigo-500" /> Resources
                    </h2>
                    {university.links.length > 0 ? (
                        <div className="space-y-1">
                            {university.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                                >
                                    <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{link.label}</p>
                                        <p className="text-xs text-slate-400">{link.linkType}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            No resource links available.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
