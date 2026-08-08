import { NextRequest, NextResponse } from "next/server";
import {
    getUniversityById,
    updateUniversity,
    deleteUniversity,
} from "@/services/universities";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const university = await getUniversityById(id);
    if (!university) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(university);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const university = await updateUniversity(id, body);
        return NextResponse.json(university);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteUniversity(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
