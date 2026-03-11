import { NextRequest, NextResponse } from "next/server";
import {
    getUserApplications,
    trackScholarship,
    getApplicationStats,
} from "@/services/applications";

// Default user ID for MVP (single user mode)
const DEFAULT_USER_ID = "default-user";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
        const stats = await getApplicationStats(DEFAULT_USER_ID);
        return NextResponse.json(stats);
    }

    const applications = await getUserApplications(DEFAULT_USER_ID);
    return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const application = await trackScholarship(
            DEFAULT_USER_ID,
            body.scholarshipId,
            body.status || "interested"
        );
        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to track scholarship";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
