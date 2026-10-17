import Link from "next/link";
import { getUniversities } from "@/services/universities";
import { Building2, MapPin, GraduationCap, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UniversitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;
    const universities = await getUniversities(search);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header & Search */}
            <div className="bg-[#181b1f] border border-[rgba(204,204,220,0.12)] rounded-lg p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-[#e6e6f0] flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#ff8833]" />
                            University Directory
                        </h1>
                        <p className="text-xs text-[rgba(204,204,220,0.6)] mt-0.5">
                            Target destination universities recognized by LPDP PTUD, Chevening, DAAD &amp; AAS
                        </p>
                    </div>

                    <form method="GET" className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(204,204,220,0.4)]" />
                        <input
                            type="text"
                            name="search"
                            defaultValue={search || ""}
                            placeholder="Search universities or countries..."
                            className="pl-8 pr-3 py-1.5 bg-[#111217] border border-[rgba(204,204,220,0.15)] rounded text-xs text-[#e6e6f0] placeholder:text-[rgba(204,204,220,0.35)] focus:border-[#ff8833] focus:outline-none w-64"
                        />
                    </form>
                </div>
            </div>

            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {universities.map((u) => (
                    <Link
                        href={`/universities/${u.id}`}
                        key={u.id}
                        className="bg-[#181b1f] hover:bg-[#202329] border border-[rgba(204,204,220,0.12)] hover:border-[#ff8833]/40 rounded-lg p-5 transition-all flex flex-col group shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-bold text-[#e6e6f0] group-hover:text-[#ff8833] transition-colors leading-snug">
                                {u.name}
                            </h3>
                        </div>

                        <p className="text-xs text-[rgba(204,204,220,0.55)] flex items-center gap-1.5 mb-3 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-[#ff8833]" /> {u.country}
                        </p>

                        {u.description && (
                            <p className="text-xs text-[rgba(204,204,220,0.7)] line-clamp-3 mb-4 flex-grow leading-relaxed">
                                {u.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(204,204,220,0.08)] mt-auto text-xs">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[rgba(204,204,220,0.65)]">
                                <GraduationCap className="w-3.5 h-3.5 text-[#ff8833]" />
                                {u._count.scholarships} scholarship{u._count.scholarships !== 1 ? "s" : ""}
                            </span>
                            <span className="text-[11px] text-[#ff8833] group-hover:translate-x-0.5 transition-transform font-semibold">
                                Details →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {universities.length === 0 && (
                <div className="bg-[#181b1f] border border-dashed border-[rgba(204,204,220,0.15)] rounded-lg py-16 text-center">
                    <Building2 className="w-10 h-10 text-[rgba(204,204,220,0.3)] mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-[#e6e6f0] mb-1">
                        No universities found
                    </h3>
                    <p className="text-xs text-[rgba(204,204,220,0.55)]">
                        Try modifying your search criteria or clearing filters.
                    </p>
                </div>
            )}
        </main>
    );
}
