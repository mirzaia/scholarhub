import Link from "next/link";
import { getUniversityById } from "@/services/universities";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UniversityDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const university = await getUniversityById(params.id);

    if (!university) return notFound();

    return (
        <>
            <Link href="/universities" className="back-link">
                ← Back to Universities
            </Link>

            {/* Hero */}
            <div className="detail-hero">
                <h1>{university.name}</h1>
                <div className="detail-hero-meta">
                    <span
                        className="badge"
                        style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
                    >
                        📍 {university.country}
                    </span>
                </div>
                {university.description && (
                    <p className="detail-hero-desc">{university.description}</p>
                )}
                {university.website && (
                    <div style={{ marginTop: 20 }}>
                        <a
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            🌐 Visit Website
                        </a>
                    </div>
                )}
            </div>

            <div className="detail-grid">
                {/* Associated Scholarships */}
                <div className="detail-section">
                    <h2>🎓 Associated Scholarships</h2>
                    {university.scholarships.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {university.scholarships.map((su) => (
                                <Link
                                    href={`/scholarships/${su.scholarship.slug}`}
                                    key={su.scholarship.id}
                                    className="link-item"
                                >
                                    <span>🎓</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{su.scholarship.name}</div>
                                        <div className="link-item-type">
                                            {su.scholarship.country} · {su.scholarship.status}
                                        </div>
                                    </div>
                                    <span className={`badge badge-${su.scholarship.status}`}>
                                        {su.scholarship.status}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                            No scholarships linked to this university yet.
                        </p>
                    )}
                </div>

                {/* Resource Links */}
                <div className="detail-section">
                    <h2>🔗 Resources</h2>
                    {university.links.length > 0 ? (
                        <div className="links-list">
                            {university.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-item"
                                >
                                    <span>🌐</span>
                                    <div>
                                        <div>{link.label}</div>
                                        <div className="link-item-type">{link.linkType}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                            No resource links available.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
