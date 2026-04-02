import Link from "next/link";
import { getScholarships, getScholarshipStats, getUpcomingDeadlines } from "@/services/scholarships";
import { getUserApplications } from "@/services/applications";
import { daysUntil, formatDate } from "@/lib/utils";
import { CopyCheck, CalendarClock, Lock, ClipboardList, Clock, ArrowRight, Building2, GraduationCap, MapPin, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, deadlines, applications, recentScholarships] = await Promise.all([
    getScholarshipStats(),
    getUpcomingDeadlines(5),
    getUserApplications("default-user"),
    getScholarships({ sortBy: "newest" }),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Track your scholarship applications and upcoming deadlines
          </p>
        </div>
      </div>

      {/* Clickable Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/scholarships?status=open" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CopyCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-1">{stats.open}</p>
          <p className="text-sm font-medium text-slate-500">Open Scholarships</p>
        </Link>
        <Link href="/scholarships?status=upcoming" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <CalendarClock className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-1">{stats.upcoming}</p>
          <p className="text-sm font-medium text-slate-500">Upcoming</p>
        </Link>
        <Link href="/scholarships?status=closed" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-red-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-1">{stats.closed}</p>
          <p className="text-sm font-medium text-slate-500">Closed</p>
        </Link>
        <Link href="/tracker" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-1">{applications.length}</p>
          <p className="text-sm font-medium text-slate-500">My Applications</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Upcoming Deadlines */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Upcoming Deadlines
            </h2>
            <Link href="/scholarships?status=open" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {deadlines.map((s: { id: string; name: string; slug: string; country: string; closeDate: string | null }) => {
              const days = s.closeDate ? daysUntil(s.closeDate) : null;
              const isUrgent = days !== null && days <= 7;
              const isWarning = days !== null && days <= 30 && days > 7;

              return (
                <Link
                  href={`/scholarships/${s.slug}`}
                  key={s.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {s.country}
                    </p>
                  </div>
                  {days !== null && (
                    <div className="flex-shrink-0 ml-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isUrgent ? 'bg-red-100 text-red-700' : 
                        isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {days > 0 ? `${days} days left` : "Expired"}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
            {deadlines.length === 0 && (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500 text-sm">No upcoming deadlines</p>
              </div>
            )}
          </div>
        </section>

        {/* My Applications Quick View */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-500" />
              My Applications
            </h2>
            <Link href="/tracker" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View tracker &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app: { id: string; status: string; checklist: string | null; scholarship: { name: string } }) => {
              const checklist = app.checklist ? JSON.parse(app.checklist as string) : [];
              const done = checklist.filter((c: { done: boolean }) => c.done).length;
              const total = checklist.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-800 truncate pr-4">{app.scholarship.name}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  {total > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span>Progress</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {applications.length === 0 && (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg flex flex-col items-center">
                <Search className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm">No applications tracked yet</p>
                <Link href="/scholarships?status=open" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2">
                  Browse open scholarships
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recently Added Scholarships */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            Recently Added Scholarships
          </h2>
          <Link href="/scholarships" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Browse all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentScholarships.slice(0, 6).map((s: { id: string; name: string; slug: string; description: string | null; country: string; status: string; fundingType: string; degreeLevel: string; closeDate: string | null; openDate: string | null }) => {
            const days = s.closeDate ? daysUntil(s.closeDate) : null;
            const isUrgent = days !== null && days <= 7;
            const isWarning = days !== null && days <= 30 && days > 7;

            return (
              <Link
                href={`/scholarships/${s.slug}`}
                key={s.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-bold text-slate-800 leading-tight line-clamp-2">{s.name}</h3>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    s.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 
                    s.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                    {s.fundingType === "full" ? "Fully Funded" : s.fundingType}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium">
                    {s.degreeLevel}
                  </span>
                </div>

                {s.description && (
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow tracking-wide leading-relaxed">
                    {s.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {s.country}
                  </span>
                  
                  {days !== null && s.status === "open" && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isUrgent ? 'text-red-600 animate-pulse' : isWarning ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {days > 0 ? `${days}d left` : "Expired"}
                    </span>
                  )}
                  {s.status === "upcoming" && s.openDate && (
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <CalendarClock className="w-3.5 h-3.5" />
                      Opens {formatDate(s.openDate)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
