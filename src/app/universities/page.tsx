import Link from "next/link";
import { getUniversities } from "@/services/universities";
import { Building2, MapPin, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UniversitiesPage() {
    const universities = await getUniversities();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-indigo-500" />
                    University Browser
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Explore universities associated with available scholarships</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {universities.map((u) => (
                    <Link
                        href={`/universities/${u.id}`}
                        key={u.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col"
                    >
                        <h3 className="text-base font-bold text-slate-800 mb-2">{u.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                            <MapPin className="w-3.5 h-3.5" /> {u.country}
                        </p>
                        {u.description && (
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
                                {u.description}
                            </p>
                        )}
                        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-auto">
                            <GraduationCap className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-medium text-slate-500">
                                {u._count.scholarships} scholarship{u._count.scholarships !== 1 ? "s" : ""} linked
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {universities.length === 0 && (
                <div className="text-center py-20">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-600 mb-1">No universities yet</h3>
                    <p className="text-sm text-slate-400">Universities will appear here when linked to scholarships</p>
                </div>
            )}
        </main>
    );
}
