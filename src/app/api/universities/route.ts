import { NextRequest, NextResponse } from "next/server";
import { getUniversities, createUniversity } from "@/services/universities";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const universities = await getUniversities(search);
    return NextResponse.json(universities);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const university = await createUniversity(body);
        return NextResponse.json(university, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create university";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
