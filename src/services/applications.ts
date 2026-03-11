import { prisma } from "@/lib/db";

export async function getUserApplications(userId: string) {
    return prisma.userApplication.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: {
            scholarship: {
                include: { links: true },
            },
        },
    });
}

export async function getApplicationByUserAndScholarship(
    userId: string,
    scholarshipId: string
) {
    return prisma.userApplication.findUnique({
        where: {
            userId_scholarshipId: { userId, scholarshipId },
        },
        include: { scholarship: true },
    });
}

export async function trackScholarship(
    userId: string,
    scholarshipId: string,
    status: string = "interested"
) {
    // On create, seed the user's checklist with the scholarship's default template
    const scholarship = await prisma.scholarship.findUnique({
        where: { id: scholarshipId },
        select: { defaultChecklist: true },
    });
    const defaultChecklist = scholarship?.defaultChecklist ?? "[]";

    return prisma.userApplication.upsert({
        where: {
            userId_scholarshipId: { userId, scholarshipId },
        },
        create: {
            userId,
            scholarshipId,
            status,
            checklist: defaultChecklist,
        },
        update: {
            status,
        },
        include: { scholarship: true },
    });
}

export async function updateApplicationStatus(
    id: string,
    status: string,
    notes?: string
) {
    const data: Record<string, unknown> = { status };
    if (notes !== undefined) data.notes = notes;
    if (status === "applied") data.appliedAt = new Date();

    return prisma.userApplication.update({
        where: { id },
        data,
        include: { scholarship: true },
    });
}

export async function updateApplicationChecklist(
    id: string,
    checklist: string
) {
    return prisma.userApplication.update({
        where: { id },
        data: { checklist },
        include: { scholarship: true },
    });
}

export async function deleteApplication(id: string) {
    return prisma.userApplication.delete({ where: { id } });
}

export async function getApplicationStats(userId: string) {
    const [total, interested, preparing, applied, accepted, rejected] =
        await Promise.all([
            prisma.userApplication.count({ where: { userId } }),
            prisma.userApplication.count({ where: { userId, status: "interested" } }),
            prisma.userApplication.count({ where: { userId, status: "preparing" } }),
            prisma.userApplication.count({ where: { userId, status: "applied" } }),
            prisma.userApplication.count({ where: { userId, status: "accepted" } }),
            prisma.userApplication.count({ where: { userId, status: "rejected" } }),
        ]);
    return { total, interested, preparing, applied, accepted, rejected };
}
