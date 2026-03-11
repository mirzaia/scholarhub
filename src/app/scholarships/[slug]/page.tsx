import Link from "next/link";
import { getScholarshipBySlug } from "@/services/scholarships";
import { getApplicationByUserAndScholarship } from "@/services/applications";
import { formatDate, daysUntil, PROVIDER_LABELS, DEGREE_LABELS, FUNDING_LABELS } from "@/lib/utils";
import { notFound } from "next/navigation";
import TrackButton from "./TrackButton";

export const dynamic = "force-dynamic";

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

    return (
        <>
            <Link href="/scholarships" className="back-link">
                ← Back to Scholarships
            </Link>

            {/* Hero */}
            <div className="detail-hero">
                <h1>{scholarship.name}</h1>
                <div className="detail-hero-meta">
                    <span className={`badge badge-${scholarship.status}`}>
                        {scholarship.status}
                    </span>
                    <span className={`badge badge-${scholarship.fundingType}`}>
                        {FUNDING_LABELS[scholarship.fundingType] || scholarship.fundingType}
                    </span>
                    <span
                        className="badge"
                        style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
                    >
                        {DEGREE_LABELS[scholarship.degreeLevel] || scholarship.degreeLevel}
                    </span>
                    <span
                        className="badge"
                        style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}
                    >
                        {PROVIDER_LABELS[scholarship.providerType] || scholarship.providerType}
                    </span>
                </div>
                <p className="detail-hero-desc">{scholarship.description}</p>
                <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                        📍 {scholarship.country}
                    </span>
                    {scholarship.closeDate && scholarship.status === "open" && (
                        <span
                            style={{ fontSize: 14, fontWeight: 600 }}
                            className={
                                daysUntil(scholarship.closeDate) <= 7
                                    ? "deadline-urgent"
                                    : daysUntil(scholarship.closeDate) <= 30
                                        ? "deadline-soon"
                                        : ""
                            }
                        >
                            ⏰ {daysUntil(scholarship.closeDate)} days until deadline
                        </span>
                    )}
                </div>
                <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a
                        href={scholarship.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        🌐 Visit Official Website
                    </a>
                    <TrackButton
                        scholarshipId={scholarship.id}
                        existingStatus={existingApp?.status || null}
                        existingId={existingApp?.id || null}
                    />
                </div>
            </div>

            {/* Detail Grid */}
            <div className="detail-grid">
                <div>
                    {/* Timeline */}
                    {scholarship.dates.length > 0 && (
                        <div className="detail-section" style={{ marginBottom: 24 }}>
                            <h2>📅 Timeline</h2>
                            <div className="timeline">
                                {scholarship.dates.map((date) => {
                                    const isPast = date.dateValue < today;
                                    const isCurrent = !isPast && scholarship.dates.findIndex(d => d.dateValue >= today) === scholarship.dates.indexOf(date);

                                    return (
                                        <div
                                            key={date.id}
                                            className={`timeline-item ${isPast ? "past" : isCurrent ? "current" : ""}`}
                                        >
                                            <div className="timeline-item-date">
                                                {formatDate(date.dateValue)}
                                            </div>
                                            <div className="timeline-item-label">{date.label}</div>
                                            {date.note && (
                                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                                                    {date.note}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Related Universities */}
                    {scholarship.universities.length > 0 && (
                        <div className="detail-section">
                            <h2>🏛️ Related Universities</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {scholarship.universities.map((su) => (
                                    <Link
                                        href={`/universities/${su.university.id}`}
                                        key={su.university.id}
                                        className="link-item"
                                    >
                                        <span>🏛️</span>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{su.university.name}</div>
                                            <div className="link-item-type">{su.university.country}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right sidebar */}
                <div>
                    {/* Resource Links */}
                    {scholarship.links.length > 0 && (
                        <div className="detail-section" style={{ marginBottom: 24 }}>
                            <h2>🔗 Resources</h2>
                            <div className="links-list">
                                {scholarship.links.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-item"
                                    >
                                        <span>
                                            {link.linkType === "official" && "🌐"}
                                            {link.linkType === "guide" && "📖"}
                                            {link.linkType === "video" && "🎬"}
                                            {link.linkType === "forum" && "💬"}
                                            {link.linkType === "document" && "📄"}
                                            {link.linkType === "social_media" && "📱"}
                                        </span>
                                        <div>
                                            <div>{link.label}</div>
                                            <div className="link-item-type">{link.linkType}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Info */}
                    <div className="detail-section">
                        <h2>📋 Key Information</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                    Country
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>{scholarship.country}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                    Provider Type
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>
                                    {PROVIDER_LABELS[scholarship.providerType] || scholarship.providerType}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                    Degree Level
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>
                                    {DEGREE_LABELS[scholarship.degreeLevel] || scholarship.degreeLevel}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                    Funding
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>
                                    {FUNDING_LABELS[scholarship.fundingType] || scholarship.fundingType}
                                </div>
                            </div>
                            {scholarship.openDate && (
                                <div>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                        Opens
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                                        {formatDate(scholarship.openDate)}
                                    </div>
                                </div>
                            )}
                            {scholarship.closeDate && (
                                <div>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                        Deadline
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                                        {formatDate(scholarship.closeDate)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
