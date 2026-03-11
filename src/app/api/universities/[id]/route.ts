import { NextRequest, NextResponse } from "next/server";
import {
    getUniversityById,
    updateUniversity,
    deleteUniversity,
} from "@/services/universities";

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    const university = await getUniversityById(params.id);
    if (!university) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(university);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const university = await updateUniversity(params.id, body);
        return NextResponse.json(university);
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
        await deleteUniversity(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
