import { NextRequest, NextResponse } from "next/server";
import {
    getScholarshipById,
    updateScholarship,
    deleteScholarship,
} from "@/services/scholarships";

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    const scholarship = await getScholarshipById(params.id);
    if (!scholarship) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(scholarship);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const scholarship = await updateScholarship(params.id, body);
        return NextResponse.json(scholarship);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await deleteScholarship(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
