import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export interface ScholarshipFilters {
    status?: string;
    providerType?: string;
    degreeLevel?: string;
    fundingType?: string;
    country?: string;
    search?: string;
    sortBy?: "deadline" | "newest" | "name";
}

export async function getScholarships(filters: ScholarshipFilters = {}) {
    const where: Record<string, unknown> = {};

    if (filters.status) where.status = filters.status;
    if (filters.providerType) where.providerType = filters.providerType;
    if (filters.degreeLevel) where.degreeLevel = filters.degreeLevel;
    if (filters.fundingType) where.fundingType = filters.fundingType;
    if (filters.country) where.country = filters.country;
    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } },
            { country: { contains: filters.search } },
        ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (filters.sortBy === "deadline") orderBy = { closeDate: "asc" };
    if (filters.sortBy === "name") orderBy = { name: "asc" };

    return prisma.scholarship.findMany({
        where,
        orderBy,
        include: {
            links: true,
            dates: true,
            universities: { include: { university: true } },
            _count: { select: { applications: true } },
        },
    });
}

export async function getScholarshipBySlug(slug: string) {
    return prisma.scholarship.findUnique({
        where: { slug },
        include: {
            links: true,
            dates: { orderBy: { dateValue: "asc" } },
            universities: { include: { university: { include: { links: true } } } },
            applications: true,
        },
    });
}

export async function getScholarshipById(id: string) {
    return prisma.scholarship.findUnique({
        where: { id },
        include: {
            links: true,
            dates: true,
            universities: { include: { university: true } },
        },
    });
}

export interface CreateScholarshipInput {
    name: string;
    officialUrl: string;
    country: string;
    providerType: string;
    degreeLevel: string;
    fundingType: string;
    description?: string;
    status?: string;
    openDate?: string;
    closeDate?: string;
    links?: { label: string; url: string; linkType: string }[];
    dates?: { label: string; dateValue: string; note?: string }[];
    universityIds?: string[];
}

export async function createScholarship(input: CreateScholarshipInput) {
    const slug = slugify(input.name);

    return prisma.scholarship.create({
        data: {
            name: input.name,
            slug,
            officialUrl: input.officialUrl,
            country: input.country,
            providerType: input.providerType,
            degreeLevel: input.degreeLevel,
            fundingType: input.fundingType,
            description: input.description,
            status: input.status || "upcoming",
            openDate: input.openDate,
            closeDate: input.closeDate,
            links: input.links
                ? { create: input.links }
                : undefined,
            dates: input.dates
                ? { create: input.dates }
                : undefined,
            universities: input.universityIds
                ? {
                    create: input.universityIds.map((uid) => ({
                        universityId: uid,
                    })),
                }
                : undefined,
        },
        include: {
            links: true,
            dates: true,
            universities: { include: { university: true } },
        },
    });
}

export async function updateScholarship(
    id: string,
    data: Partial<CreateScholarshipInput>
) {
    const updateData: Record<string, unknown> = {};
    if (data.name) {
        updateData.name = data.name;
        updateData.slug = slugify(data.name);
    }
    if (data.officialUrl) updateData.officialUrl = data.officialUrl;
    if (data.country) updateData.country = data.country;
    if (data.providerType) updateData.providerType = data.providerType;
    if (data.degreeLevel) updateData.degreeLevel = data.degreeLevel;
    if (data.fundingType) updateData.fundingType = data.fundingType;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.openDate !== undefined) updateData.openDate = data.openDate;
    if (data.closeDate !== undefined) updateData.closeDate = data.closeDate;

    return prisma.scholarship.update({
        where: { id },
        data: updateData,
        include: {
            links: true,
            dates: true,
            universities: { include: { university: true } },
        },
    });
}

export async function deleteScholarship(id: string) {
    return prisma.scholarship.delete({ where: { id } });
}

export async function getScholarshipStats() {
    const [total, open, closed, upcoming] = await Promise.all([
        prisma.scholarship.count(),
        prisma.scholarship.count({ where: { status: "open" } }),
        prisma.scholarship.count({ where: { status: "closed" } }),
        prisma.scholarship.count({ where: { status: "upcoming" } }),
    ]);
    return { total, open, closed, upcoming };
}

export async function getUpcomingDeadlines(limit = 5) {
    const today = new Date().toISOString().split("T")[0];
    return prisma.scholarship.findMany({
        where: {
            status: "open",
            closeDate: { gte: today },
        },
        orderBy: { closeDate: "asc" },
        take: limit,
        include: { links: true },
    });
}
