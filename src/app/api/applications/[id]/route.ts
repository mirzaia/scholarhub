import { NextRequest, NextResponse } from "next/server";
import {
    updateApplication,
    deleteApplication,
} from "@/services/applications";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        let checklistStr: string | undefined = undefined;
        if (body.checklist !== undefined) {
            checklistStr = typeof body.checklist === "string" ? body.checklist : JSON.stringify(body.checklist);
        }

        let documentLinksStr: string | undefined = undefined;
        if (body.documentLinks !== undefined) {
            documentLinksStr = typeof body.documentLinks === "string" ? body.documentLinks : JSON.stringify(body.documentLinks);
        }

        const app = await updateApplication(id, {
            status: body.status,
            currentStage: body.currentStage,
            notes: body.notes,
            checklist: checklistStr,
            documentLinks: documentLinksStr,
        });

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
