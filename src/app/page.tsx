import Link from "next/link";
import { getScholarships, getScholarshipStats, getUpcomingDeadlines } from "@/services/scholarships";
import { getUserApplications } from "@/services/applications";
import { daysUntil, formatDate, STATUS_COLORS, FUNDING_LABELS, DEGREE_LABELS, LOA_LABELS } from "@/lib/utils";
import {
  CalendarClock,
  ClipboardList,
  Clock,
  ArrowRight,
  MapPin,
  Search,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, deadlines, applications, recentScholarships] = await Promise.all([
    getScholarshipStats(),
    getUpcomingDeadlines(6),
    getUserApplications("default-user"),
    getScholarships({ sortBy: "newest" }),
  ]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[rgba(204,204,220,0.07)]">
        <div>
          <h1 className="text-xl font-semibold text-[#e6e6f0] tracking-tight">
            Scholarship Monitoring Dashboard
          </h1>
          <p className="text-[13px] text-[rgba(204,204,220,0.62)] mt-0.5">
            Real-time deadline tracking, application progress, and Indonesian Master&apos;s degree opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/scholarships?degreeLevel=master"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3d71d9] hover:bg-[#4a7ee6] text-white text-[13px] font-medium transition shadow-sm"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Browse Master&apos;s Programs</span>
          </Link>
        </div>
      </div>

      {/* Grafana Stat Panels Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Open Scholarships */}
        <Link
          href="/scholarships?status=open"
          className="group relative flex flex-col justify-between p-4 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] hover:border-[rgba(204,204,220,0.25)] rounded-[4px] transition overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[rgba(204,204,220,0.78)] uppercase tracking-wider">
              Open Now
            </span>
            <span className="w-2 h-2 rounded-full bg-[#0ca30c]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-medium text-[#e6e6f0] tracking-tight tabular-nums">
              {stats.open}
            </span>
            <span className="text-[12px] text-[rgba(204,204,220,0.62)] ml-2">cycles</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#73bf69]">
            <span>Accepting applications</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0ca30c]" />
        </Link>

        {/* Upcoming */}
        <Link
          href="/scholarships?status=upcoming"
          className="group relative flex flex-col justify-between p-4 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] hover:border-[rgba(204,204,220,0.25)] rounded-[4px] transition overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[rgba(204,204,220,0.78)] uppercase tracking-wider">
              Upcoming
            </span>
            <span className="w-2 h-2 rounded-full bg-[#3d71d9]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-medium text-[#e6e6f0] tracking-tight tabular-nums">
              {stats.upcoming}
            </span>
            <span className="text-[12px] text-[rgba(204,204,220,0.62)] ml-2">scheduled</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#6e9fff]">
            <span>Opening in 2026</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3d71d9]" />
        </Link>

        {/* Closed */}
        <Link
          href="/scholarships?status=closed"
          className="group relative flex flex-col justify-between p-4 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] hover:border-[rgba(204,204,220,0.25)] rounded-[4px] transition overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[rgba(204,204,220,0.78)] uppercase tracking-wider">
              Past / Closed
            </span>
            <span className="w-2 h-2 rounded-full bg-[#d03b3b]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-medium text-[#e6e6f0] tracking-tight tabular-nums">
              {stats.closed}
            </span>
            <span className="text-[12px] text-[rgba(204,204,220,0.62)] ml-2">archived</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#ff7383]">
            <span>Awaiting next batch</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d03b3b]" />
        </Link>

        {/* Tracked Applications */}
        <Link
          href="/tracker"
          className="group relative flex flex-col justify-between p-4 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] hover:border-[rgba(204,204,220,0.25)] rounded-[4px] transition overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[rgba(204,204,220,0.78)] uppercase tracking-wider">
              My Applications
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ff8833]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-medium text-[#e6e6f0] tracking-tight tabular-nums">
              {applications.length}
            </span>
            <span className="text-[12px] text-[rgba(204,204,220,0.62)] ml-2">tracked</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#ff8833]">
            <span>Active monitoring</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff8833] to-[#f55f3e]" />
        </Link>
      </div>

      {/* Row 1: Upcoming Deadlines Table + My Applications Quickview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Upcoming Deadlines (Grafana Table style) */}
        <section className="lg:col-span-7 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] rounded-[4px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(204,204,220,0.07)]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff8833]" />
              <h2 className="text-[14px] font-semibold text-[#e6e6f0]">
                Upcoming Registration Deadlines
              </h2>
            </div>
            <Link
              href="/scholarships?status=open&sortBy=deadline"
              className="text-[12px] text-[#6e9fff] hover:underline flex items-center gap-1"
            >
              <span>View all</span> &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(204,204,220,0.1)] text-[#6e9fff] text-[12px] font-medium bg-[#111217]/50">
                  <th className="py-2.5 px-4">Scholarship</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">Deadline</th>
                  <th className="py-2.5 px-4 text-right">Time Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(204,204,220,0.05)]">
                {deadlines.map((s) => {
                  const days = s.closeDate ? daysUntil(s.closeDate) : null;
                  const isUrgent = days !== null && days <= 7;
                  const isWarning = days !== null && days <= 30 && days > 7;

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-[rgba(204,204,220,0.04)] transition-colors group"
                    >
                      <td className="py-2.5 px-4 font-medium text-[#e6e6f0]">
                        <Link
                          href={`/scholarships/${s.slug}`}
                          className="hover:text-[#6e9fff] transition-colors truncate block max-w-[240px]"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 text-[rgba(204,204,220,0.62)]">
                        {s.country}
                      </td>
                      <td className="py-2.5 px-3 text-[rgba(204,204,220,0.78)] font-mono text-[12px]">
                        {s.closeDate ? formatDate(s.closeDate) : "—"}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {days !== null && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              isUrgent
                                ? "bg-[#d03b3b]/15 text-[#ff7383] border-[#d03b3b]/30 animate-pulse"
                                : isWarning
                                ? "bg-[#fab219]/15 text-[#fcd34d] border-[#fab219]/30"
                                : "bg-[#0ca30c]/15 text-[#73bf69] border-[#0ca30c]/30"
                            }`}
                          >
                            {days > 0 ? `${days}d left` : "Expired"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {deadlines.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-[rgba(204,204,220,0.4)]">
                      No upcoming deadlines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* My Applications Quickview */}
        <section className="lg:col-span-5 bg-[#181b1f] border border-[rgba(204,204,220,0.07)] rounded-[4px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(204,204,220,0.07)]">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#6e9fff]" />
              <h2 className="text-[14px] font-semibold text-[#e6e6f0]">
                Application Progress
              </h2>
            </div>
            <Link
              href="/tracker"
              className="text-[12px] text-[#6e9fff] hover:underline flex items-center gap-1"
            >
              <span>Open tracker</span> &rarr;
            </Link>
          </div>

          <div className="p-4 space-y-3.5 flex-1">
            {applications.slice(0, 4).map((app) => {
              let checklist: { task: string; done: boolean }[] = [];
              try {
                if (app.checklist) checklist = JSON.parse(app.checklist);
              } catch {
                checklist = [];
              }

              const done = checklist.filter((c) => c.done).length;
              const total = checklist.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const colorInfo = STATUS_COLORS[app.status] || STATUS_COLORS.interested;

              return (
                <div
                  key={app.id}
                  className="p-3 bg-[#111217] border border-[rgba(204,204,220,0.07)] rounded-[4px] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/scholarships/${app.scholarship.slug}`}
                      className="text-[13px] font-semibold text-[#e6e6f0] hover:text-[#6e9fff] transition-colors truncate"
                    >
                      {app.scholarship.name}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${colorInfo.bg} ${colorInfo.text} ${colorInfo.border} whitespace-nowrap`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colorInfo.dot}`} />
                      {app.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  {total > 0 && (
                    <div>
                      <div className="flex justify-between text-[11px] text-[rgba(204,204,220,0.62)] mb-1">
                        <span>Checklist: {done}/{total} completed</span>
                        <span className="font-mono text-[#e6e6f0]">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[rgba(204,204,220,0.1)] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pct === 100 ? "bg-[#0ca30c]" : "bg-[#3d71d9]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {applications.length === 0 && (
              <div className="text-center py-10 border border-dashed border-[rgba(204,204,220,0.1)] rounded-[4px]">
                <Search className="w-6 h-6 text-[rgba(204,204,220,0.3)] mx-auto mb-2" />
                <p className="text-[13px] text-[rgba(204,204,220,0.62)]">
                  No scholarships tracked yet.
                </p>
                <Link
                  href="/scholarships?status=open"
                  className="inline-block mt-2 text-[12px] text-[#6e9fff] hover:underline font-medium"
                >
                  Browse open scholarships &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Row 2: Curated Master's & Top Scholarships */}
      <section className="bg-[#181b1f] border border-[rgba(204,204,220,0.07)] rounded-[4px] p-4">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(204,204,220,0.07)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fab219]" />
            <h2 className="text-[14px] font-semibold text-[#e6e6f0]">
              Curated Master&apos;s & High-Impact Scholarships
            </h2>
          </div>
          <Link
            href="/scholarships"
            className="text-[12px] text-[#6e9fff] hover:underline flex items-center gap-1"
          >
            <span>Full Catalog</span> &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentScholarships.slice(0, 6).map((s) => {
            const days = s.closeDate ? daysUntil(s.closeDate) : null;
            const isUrgent = days !== null && days <= 7;
            const isWarning = days !== null && days <= 30 && days > 7;
            const statusStyle = STATUS_COLORS[s.status] || STATUS_COLORS.upcoming;

            return (
              <Link
                href={`/scholarships/${s.slug}`}
                key={s.id}
                className="group flex flex-col justify-between p-4 bg-[#111217] border border-[rgba(204,204,220,0.07)] hover:border-[rgba(204,204,220,0.25)] rounded-[4px] transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-[14px] font-semibold text-[#e6e6f0] group-hover:text-[#6e9fff] transition-colors leading-tight line-clamp-2">
                      {s.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} uppercase flex-shrink-0`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {s.status}
                    </span>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#181b1f] border border-[rgba(204,204,220,0.12)] text-[11px] text-[rgba(204,204,220,0.78)]">
                      {FUNDING_LABELS[s.fundingType] || s.fundingType}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#3d71d9]/10 border border-[#3d71d9]/30 text-[11px] text-[#6e9fff]">
                      {DEGREE_LABELS[s.degreeLevel] || s.degreeLevel}
                    </span>
                    {s.requiresLoa && (
                      <span className="px-1.5 py-0.5 rounded bg-[#181b1f] border border-[rgba(204,204,220,0.12)] text-[11px] text-[rgba(204,204,220,0.62)]">
                        {LOA_LABELS[s.requiresLoa] || s.requiresLoa}
                      </span>
                    )}
                    {s.gpaMin && (
                      <span className="px-1.5 py-0.5 rounded bg-[#fab219]/10 border border-[#fab219]/25 text-[11px] text-[#fcd34d]">
                        GPA ≥ {s.gpaMin.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {s.description && (
                    <p className="text-[12px] text-[rgba(204,204,220,0.62)] line-clamp-2 mb-3 leading-relaxed">
                      {s.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(204,204,220,0.07)] text-[11px]">
                  <span className="flex items-center gap-1 text-[rgba(204,204,220,0.62)]">
                    <MapPin className="w-3 h-3" />
                    <span>{s.country}</span>
                  </span>

                  {days !== null && s.status === "open" && (
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isUrgent
                          ? "text-[#ff7383]"
                          : isWarning
                          ? "text-[#fcd34d]"
                          : "text-[#73bf69]"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {days > 0 ? `${days}d left` : "Expired"}
                    </span>
                  )}

                  {s.status === "upcoming" && s.openDate && (
                    <span className="text-[#6e9fff] flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" />
                      Opens {formatDate(s.openDate)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
