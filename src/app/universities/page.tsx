import Link from "next/link";
import { getUniversities } from "@/services/universities";

export const dynamic = "force-dynamic";

export default async function UniversitiesPage() {
    const universities = await getUniversities();

    return (
        <>
            <div className="page-header">
                <h1>🏛️ University Browser</h1>
                <p>Explore universities associated with available scholarships</p>
            </div>

            <div className="card-grid">
                {universities.map((u) => (
                    <Link
                        href={`/universities/${u.id}`}
                        key={u.id}
                        className="university-card"
                    >
                        <h3>{u.name}</h3>
                        <div className="university-card-meta">📍 {u.country}</div>
                        {u.description && (
                            <p className="scholarship-card-desc">{u.description}</p>
                        )}
                        <div className="university-card-count">
                            {u._count.scholarships} scholarship{u._count.scholarships !== 1 ? "s" : ""} linked
                        </div>
                    </Link>
                ))}
            </div>

            {universities.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">🏛️</div>
                    <h3>No universities yet</h3>
                    <p>Universities will appear here when linked to scholarships</p>
                </div>
            )}
        </>
    );
}
