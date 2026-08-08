import { NextRequest, NextResponse } from "next/server";
import {
    updateApplicationStatus,
    updateApplicationChecklist,
    deleteApplication,
} from "@/services/applications";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (body.checklist !== undefined) {
            const app = await updateApplicationChecklist(id, JSON.stringify(body.checklist));
            return NextResponse.json(app);
        }

        const app = await updateApplicationStatus(id, body.status, body.notes);
        return NextResponse.json(app);
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
        await deleteApplication(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
