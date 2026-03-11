import Link from "next/link";
import { getScholarships, getScholarshipStats, getUpcomingDeadlines } from "@/services/scholarships";
import { getUserApplications } from "@/services/applications";
import { daysUntil, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, deadlines, applications, recentScholarships] = await Promise.all([
    getScholarshipStats(),
    getUpcomingDeadlines(5),
    getUserApplications("default-user"),
    getScholarships({ sortBy: "newest" }),
  ]);

  return (
    <>
      <div className="page-header">
        <h1>📊 Dashboard Overview</h1>
        <p>Track your scholarship applications and upcoming deadlines</p>
      </div>

      {/* Clickable Stats Row */}
      <div className="stats-row">
        <Link href="/scholarships?status=open" className="stat-card green clickable">
          <div className="stat-card-icon">🟢</div>
          <p className="stat-card-value">{stats.open}</p>
          <p className="stat-card-label">Open Scholarships</p>
          <div className="stat-card-hint">Click to browse →</div>
        </Link>
        <Link href="/scholarships?status=upcoming" className="stat-card blue clickable">
          <div className="stat-card-icon">🔜</div>
          <p className="stat-card-value">{stats.upcoming}</p>
          <p className="stat-card-label">Upcoming</p>
          <div className="stat-card-hint">Click to browse →</div>
        </Link>
        <Link href="/scholarships?status=closed" className="stat-card red clickable">
          <div className="stat-card-icon">🔴</div>
          <p className="stat-card-value">{stats.closed}</p>
          <p className="stat-card-label">Closed</p>
          <div className="stat-card-hint">Click to browse →</div>
        </Link>
        <Link href="/tracker" className="stat-card purple clickable">
          <div className="stat-card-icon">📝</div>
          <p className="stat-card-value">{applications.length}</p>
          <p className="stat-card-label">My Applications</p>
          <div className="stat-card-hint">View tracker →</div>
        </Link>
      </div>

      <div className="two-col">
        {/* Upcoming Deadlines */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">⏰ Upcoming Deadlines</h2>
            <Link href="/scholarships?status=open" className="section-link">
              View all →
            </Link>
          </div>
          <div className="deadline-list">
            {deadlines.map((s: { id: string; name: string; slug: string; country: string; closeDate: string | null }) => {
              const days = s.closeDate ? daysUntil(s.closeDate) : null;
              const daysClass =
                days !== null && days <= 7
                  ? "days-urgent"
                  : days !== null && days <= 30
                    ? "days-warning"
                    : "days-safe";

              return (
                <Link
                  href={`/scholarships/${s.slug}`}
                  key={s.id}
                  className="deadline-item"
                >
                  <div className="deadline-item-info">
                    <span className="deadline-item-name">{s.name}</span>
                    <span className="deadline-item-country">{s.country}</span>
                  </div>
                  {days !== null && (
                    <span className={`deadline-item-days ${daysClass}`}>
                      {days > 0 ? `${days} days left` : "Expired"}
                    </span>
                  )}
                </Link>
              );
            })}
            {deadlines.length === 0 && (
              <div className="empty-state">
                <p>No upcoming deadlines</p>
              </div>
            )}
          </div>
        </div>

        {/* My Applications Quick View */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">📋 My Applications</h2>
            <Link href="/tracker" className="section-link">
              View tracker →
            </Link>
          </div>
          <div className="deadline-list">
            {applications.slice(0, 5).map((app: { id: string; status: string; checklist: string | null; scholarship: { name: string } }) => {
              const checklist = app.checklist ? JSON.parse(app.checklist as string) : [];
              const done = checklist.filter((c: { done: boolean }) => c.done).length;
              const total = checklist.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <div key={app.id} className="tracker-card">
                  <div className="tracker-card-header">
                    <h3 className="tracker-card-name">{app.scholarship.name}</h3>
                    <span className={`badge badge-${app.status}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  {total > 0 && (
                    <div className="tracker-progress">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {applications.length === 0 && (
              <div className="empty-state">
                <p>No applications tracked yet</p>
                <Link href="/scholarships?status=open" className="section-link" style={{ marginTop: 8, display: "inline-block" }}>
                  Browse open scholarships →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recently Added Scholarships */}
      <div className="section" style={{ marginTop: 16 }}>
        <div className="section-header">
          <h2 className="section-title">🆕 Recently Added Scholarships</h2>
          <Link href="/scholarships" className="section-link">
            Browse all →
          </Link>
        </div>
        <div className="card-grid">
          {recentScholarships.slice(0, 6).map((s: { id: string; name: string; slug: string; description: string | null; country: string; status: string; fundingType: string; degreeLevel: string; closeDate: string | null; openDate: string | null }) => {
            const days = s.closeDate ? daysUntil(s.closeDate) : null;

            return (
              <Link
                href={`/scholarships/${s.slug}`}
                key={s.id}
                className="scholarship-card"
              >
                <div className="scholarship-card-header">
                  <h3 className="scholarship-card-title">{s.name}</h3>
                  <span className={`badge badge-${s.status}`}>{s.status}</span>
                </div>
                <div className="scholarship-card-meta">
                  <span className={`badge badge-${s.fundingType}`}>
                    {s.fundingType === "full" ? "Fully Funded" : s.fundingType}
                  </span>
                  <span className="badge" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                    {s.degreeLevel}
                  </span>
                </div>
                {s.description && (
                  <p className="scholarship-card-desc">{s.description}</p>
                )}
                <div className="scholarship-card-footer">
                  <span className="scholarship-card-country">📍 {s.country}</span>
                  {days !== null && s.status === "open" && (
                    <span
                      className={`scholarship-card-deadline ${days <= 7 ? "deadline-urgent" : days <= 30 ? "deadline-soon" : ""
                        }`}
                    >
                      ⏰ {days > 0 ? `${days}d left` : "Expired"}
                    </span>
                  )}
                  {s.status === "upcoming" && s.openDate && (
                    <span className="scholarship-card-deadline">
                      🔜 Opens {formatDate(s.openDate)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
