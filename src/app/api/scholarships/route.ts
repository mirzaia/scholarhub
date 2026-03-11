import { NextRequest, NextResponse } from "next/server";
import {
    getScholarships,
    createScholarship,
    getScholarshipStats,
    getUpcomingDeadlines,
} from "@/services/scholarships";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Special endpoints via query param
    const action = searchParams.get("action");
    if (action === "stats") {
        const stats = await getScholarshipStats();
        return NextResponse.json(stats);
    }
    if (action === "deadlines") {
        const limit = parseInt(searchParams.get("limit") || "5");
        const deadlines = await getUpcomingDeadlines(limit);
        return NextResponse.json(deadlines);
    }

    const filters = {
        status: searchParams.get("status") || undefined,
        providerType: searchParams.get("providerType") || undefined,
        degreeLevel: searchParams.get("degreeLevel") || undefined,
        fundingType: searchParams.get("fundingType") || undefined,
        country: searchParams.get("country") || undefined,
        search: searchParams.get("search") || undefined,
        sortBy: (searchParams.get("sortBy") as "deadline" | "newest" | "name") || undefined,
    };

    const scholarships = await getScholarships(filters);
    return NextResponse.json(scholarships);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const scholarship = await createScholarship(body);
        return NextResponse.json(scholarship, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create scholarship";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
