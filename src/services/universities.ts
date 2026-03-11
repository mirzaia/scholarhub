import { prisma } from "@/lib/db";

export async function getUniversities(search?: string) {
    const where: Record<string, unknown> = {};
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { country: { contains: search } },
        ];
    }

    return prisma.university.findMany({
        where,
        orderBy: { name: "asc" },
        include: {
            links: true,
            _count: { select: { scholarships: true } },
        },
    });
}

export async function getUniversityById(id: string) {
    return prisma.university.findUnique({
        where: { id },
        include: {
            links: true,
            scholarships: {
                include: {
                    scholarship: {
                        include: { links: true },
                    },
                },
            },
        },
    });
}

export async function createUniversity(data: {
    name: string;
    country: string;
    website?: string;
    description?: string;
    links?: { label: string; url: string; linkType: string }[];
}) {
    return prisma.university.create({
        data: {
            name: data.name,
            country: data.country,
            website: data.website,
            description: data.description,
            links: data.links ? { create: data.links } : undefined,
        },
        include: { links: true },
    });
}

export async function updateUniversity(
    id: string,
    data: { name?: string; country?: string; website?: string; description?: string }
) {
    return prisma.university.update({
        where: { id },
        data,
        include: { links: true },
    });
}

export async function deleteUniversity(id: string) {
    return prisma.university.delete({ where: { id } });
}
