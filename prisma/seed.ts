import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Default checklist templates by providerType
const CHECKLISTS = {
    indonesian_gov: JSON.stringify([
        { task: "Academic Transcript (legalized)", done: false },
        { task: "GPA Certificate / Diploma", done: false },
        { task: "National ID Card (KTP)", done: false },
        { task: "Motivation Letter / Essay", done: false },
        { task: "Recommendation Letter #1", done: false },
        { task: "Recommendation Letter #2", done: false },
        { task: "Language Certificate (TOEFL ≥550 / IELTS ≥6.0)", done: false },
        { task: "Health Certificate", done: false },
        { task: "Letter of Acceptance (LoA) — if required", done: false },
    ]),
    foreign_gov: JSON.stringify([
        { task: "Passport (valid ≥2 years)", done: false },
        { task: "Academic Transcript", done: false },
        { task: "Motivation Letter / Personal Statement", done: false },
        { task: "Recommendation Letter #1", done: false },
        { task: "Recommendation Letter #2", done: false },
        { task: "Recommendation Letter #3", done: false },
        { task: "CV / Resume", done: false },
        { task: "Language Test (IELTS ≥6.5 / TOEFL iBT ≥90)", done: false },
        { task: "Letter of Acceptance (LoA) — if applicable", done: false },
    ]),
    international_org: JSON.stringify([
        { task: "Passport (valid ≥2 years)", done: false },
        { task: "Academic Transcript", done: false },
        { task: "CV / Resume", done: false },
        { task: "Motivation Letter", done: false },
        { task: "Recommendation Letter #1", done: false },
        { task: "Recommendation Letter #2", done: false },
        { task: "Language Certificate", done: false },
        { task: "Research Proposal (PhD applicants)", done: false },
    ]),
    local_org: JSON.stringify([
        { task: "National ID Card (KTP)", done: false },
        { task: "Academic Transcript", done: false },
        { task: "GPA Certificate", done: false },
        { task: "Financial Statement / Parent Income", done: false },
        { task: "Motivation Letter", done: false },
        { task: "Recommendation Letter from Supervisor/Dean", done: false },
        { task: "Student Registration Certificate (KTM)", done: false },
    ]),
    university: JSON.stringify([
        { task: "Passport (valid ≥2 years)", done: false },
        { task: "Academic Transcript", done: false },
        { task: "CV / Resume", done: false },
        { task: "Research Proposal / Statement of Purpose", done: false },
        { task: "Language Test (IELTS / TOEFL)", done: false },
        { task: "Recommendation Letter #1", done: false },
        { task: "Recommendation Letter #2", done: false },
        { task: "University Online Application Form", done: false },
    ]),
    private: JSON.stringify([
        { task: "Academic Transcript", done: false },
        { task: "Motivation Letter", done: false },
        { task: "CV / Resume", done: false },
        { task: "Recommendation Letter", done: false },
        { task: "Language Certificate", done: false },
    ]),
};

async function main() {
    // Clean existing data
    await prisma.userApplication.deleteMany();
    await prisma.scholarshipUniversity.deleteMany();
    await prisma.scholarshipDate.deleteMany();
    await prisma.scholarshipLink.deleteMany();
    await prisma.universityLink.deleteMany();
    await prisma.scholarship.deleteMany();
    await prisma.university.deleteMany();
    await prisma.userProfile.deleteMany();

    // ─── Create default user ────────────────────────────────────────────────
    const user = await prisma.userProfile.create({
        data: {
            id: "default-user",
            name: "Student",
            email: "student@example.com",
            nationality: "Indonesian",
            degreeCurrent: "bachelor",
            degreeTarget: "master",
            gpa: 3.5,
            age: 22,
        },
    });

    // ─── Universities ───────────────────────────────────────────────────────
    const [
        uOxford, uMelbourne, uTokyo, uSeoul, uHarvard,
        uUI, uLeiden, uTUM, uNUS, uMonash, uTUDelft,
        uUGM, uITB, uAirlangga, uKULeuven
    ] = await Promise.all([
        prisma.university.create({ data: { name: "University of Oxford", country: "United Kingdom", website: "https://www.ox.ac.uk", description: "One of the world's leading universities, located in Oxford, England.", links: { create: [{ label: "Admissions", url: "https://www.ox.ac.uk/admissions", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "University of Melbourne", country: "Australia", website: "https://www.unimelb.edu.au", description: "Australia's leading university, consistently ranked among the world's best.", links: { create: [{ label: "International", url: "https://www.unimelb.edu.au/international", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "University of Tokyo", country: "Japan", website: "https://www.u-tokyo.ac.jp/en", description: "Japan's most prestigious university, known for research excellence.", links: { create: [{ label: "Official Site", url: "https://www.u-tokyo.ac.jp/en", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Seoul National University", country: "South Korea", website: "https://www.snu.ac.kr", description: "South Korea's top national research university.", links: { create: [{ label: "International", url: "https://en.snu.ac.kr", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Harvard University", country: "United States", website: "https://www.harvard.edu", description: "Ivy League research university in Cambridge, Massachusetts.", links: { create: [{ label: "Admissions", url: "https://www.harvard.edu/admissions", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Universitas Indonesia", country: "Indonesia", website: "https://www.ui.ac.id", description: "Indonesia's most prestigious public university, located in Depok, West Java.", links: { create: [{ label: "Official Site", url: "https://www.ui.ac.id", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Leiden University", country: "Netherlands", website: "https://www.universiteitleiden.nl/en", description: "The oldest university in the Netherlands, known for international studies.", links: { create: [{ label: "Scholarships", url: "https://www.universiteitleiden.nl/en/scholarships", linkType: "guide" }] } } }),
        prisma.university.create({ data: { name: "Technical University of Munich", country: "Germany", website: "https://www.tum.de/en", description: "One of Europe's top technical universities, based in Munich, Germany.", links: { create: [{ label: "International", url: "https://www.tum.de/en/studies/international-students", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "National University of Singapore", country: "Singapore", website: "https://www.nus.edu.sg", description: "Asia's leading university, ranked consistently in global top 15.", links: { create: [{ label: "Research Scholarships", url: "https://www.nus.edu.sg/registrar/academic-information-policies/graduate/scholarships", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Monash University", country: "Australia", website: "https://www.monash.edu", description: "A leading Australian university with campuses across the globe.", links: { create: [{ label: "Graduate Research", url: "https://www.monash.edu/graduate-research/mgs", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "TU Delft", country: "Netherlands", website: "https://www.tudelft.nl", description: "Top European technical university known for engineering and design.", links: { create: [{ label: "Excellence Scholarship", url: "https://www.tudelft.nl/studeer-werk-bij-tu-delft/beursopties/tu-delft-excellence-scholarships", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Universitas Gadjah Mada", country: "Indonesia", website: "https://www.ugm.ac.id", description: "One of Indonesia's oldest and most prestigious public universities, located in Yogyakarta.", links: { create: [{ label: "Scholarships", url: "https://ugm.ac.id/en/scholarship", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Institut Teknologi Bandung", country: "Indonesia", website: "https://www.itb.ac.id", description: "Indonesia's top engineering and technology university.", links: { create: [{ label: "Official Site", url: "https://www.itb.ac.id", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "Universitas Airlangga", country: "Indonesia", website: "https://www.unair.ac.id", description: "Prestigious public university in Surabaya, ranked top in Indonesia for health sciences.", links: { create: [{ label: "Official Site", url: "https://www.unair.ac.id", linkType: "official" }] } } }),
        prisma.university.create({ data: { name: "KU Leuven", country: "Belgium", website: "https://www.kuleuven.be/english", description: "Belgium's top research university and one of Europe's oldest, founded in 1425.", links: { create: [{ label: "PhD Scholarships", url: "https://www.kuleuven.be/english/research/phd", linkType: "official" }] } } }),
    ]);

    // ─── Scholarships ───────────────────────────────────────────────────────
    const scholarships = await Promise.all([

        // ── INDONESIAN GOVERNMENT ──────────────────────────────────────────
        prisma.scholarship.create({
            data: {
                name: "LPDP Scholarship",
                slug: "lpdp-scholarship",
                description: "Indonesia's most prestigious government scholarship (Lembaga Pengelola Dana Pendidikan). Covers full tuition, living allowance, research, and travel for master's and doctoral degrees at top universities worldwide.",
                officialUrl: "https://lpdp.kemenkeu.go.id",
                country: "Indonesia", providerType: "indonesian_gov", degreeLevel: "master", fundingType: "full", status: "open",
                openDate: "2026-01-15", closeDate: "2026-04-30",
                defaultChecklist: CHECKLISTS.indonesian_gov,
                links: { create: [{ label: "Official Portal", url: "https://lpdp.kemenkeu.go.id", linkType: "official" }, { label: "Application Guide", url: "https://lpdp.kemenkeu.go.id/panduan", linkType: "guide" }] },
                dates: { create: [{ label: "Registration Opens", dateValue: "2026-01-15" }, { label: "Registration Closes", dateValue: "2026-04-30" }, { label: "Interview", dateValue: "2026-06-15" }, { label: "Announcement", dateValue: "2026-07-01" }] },
                universities: { create: [{ universityId: uOxford.id }, { universityId: uMelbourne.id }, { universityId: uHarvard.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Beasiswa Unggulan Kemendikbud",
                slug: "beasiswa-unggulan-kemendikbud",
                description: "Scholarship from Indonesia's Ministry of Education and Culture for outstanding students pursuing bachelor's, master's, or doctoral degrees at Indonesian universities.",
                officialUrl: "https://beasiswaunggulan.kemdikbud.go.id",
                country: "Indonesia", providerType: "indonesian_gov", degreeLevel: "any", fundingType: "full", status: "upcoming",
                openDate: "2026-05-01", closeDate: "2026-06-30",
                defaultChecklist: CHECKLISTS.indonesian_gov,
                links: { create: [{ label: "Official Portal", url: "https://beasiswaunggulan.kemdikbud.go.id", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-05-01" }, { label: "Application Closes", dateValue: "2026-06-30" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uUGM.id }, { universityId: uITB.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Beasiswa Indonesia Maju (BIM)",
                slug: "beasiswa-indonesia-maju-bim",
                description: "Beasiswa Indonesia Maju is awarded by the Center for Student Achievement (Puspresnas) for high-achieving students who have won national or international competitions.",
                officialUrl: "https://pusatprestasinasional.kemdikbud.go.id",
                country: "Indonesia", providerType: "indonesian_gov", degreeLevel: "bachelor", fundingType: "full", status: "upcoming",
                openDate: "2026-03-01", closeDate: "2026-04-30",
                defaultChecklist: CHECKLISTS.indonesian_gov,
                links: { create: [{ label: "Puspresnas Portal", url: "https://pusatprestasinasional.kemdikbud.go.id", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-03-01" }, { label: "Application Closes", dateValue: "2026-04-30" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uUGM.id }] },
            }
        }),

        // ── FOREIGN GOVERNMENT ─────────────────────────────────────────────
        prisma.scholarship.create({
            data: {
                name: "Chevening Scholarship",
                slug: "chevening-scholarship",
                description: "The UK Government's global scholarship programme. Offers fully funded one-year master's degrees at any UK university. Targets future leaders and influencers.",
                officialUrl: "https://www.chevening.org",
                country: "United Kingdom", providerType: "foreign_gov", degreeLevel: "master", fundingType: "full", status: "open",
                openDate: "2025-09-03", closeDate: "2026-03-15",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "Apply Now", url: "https://www.chevening.org/apply", linkType: "official" }, { label: "Eligibility", url: "https://www.chevening.org/scholarships/who-can-apply", linkType: "guide" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2025-09-03" }, { label: "Application Deadline", dateValue: "2026-03-15" }, { label: "Interview Period", dateValue: "2026-04-01", note: "April–May 2026" }, { label: "Results", dateValue: "2026-06-15" }] },
                universities: { create: [{ universityId: uOxford.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "DAAD Scholarship (Germany)",
                slug: "daad-scholarship-germany",
                description: "The German Academic Exchange Service provides scholarships for international students and researchers to study and conduct research at German universities.",
                officialUrl: "https://www.daad.de/en",
                country: "Germany", providerType: "foreign_gov", degreeLevel: "master", fundingType: "full", status: "open",
                openDate: "2025-10-01", closeDate: "2026-04-15",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "DAAD Portal", url: "https://www.daad.de/en/study-and-research-in-germany/scholarships", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2025-10-01" }, { label: "Application Deadline", dateValue: "2026-04-15" }, { label: "Results", dateValue: "2026-06-30" }] },
                universities: { create: [{ universityId: uTUM.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Fulbright Scholarship (USA)",
                slug: "fulbright-scholarship-usa",
                description: "The Fulbright Program provides opportunities for Indonesian students to pursue master's degrees in the United States. Administered by AMINEF in Indonesia.",
                officialUrl: "https://www.aminef.or.id",
                country: "United States", providerType: "foreign_gov", degreeLevel: "master", fundingType: "full", status: "upcoming",
                openDate: "2026-02-01", closeDate: "2026-04-15",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "AMINEF Portal", url: "https://www.aminef.or.id", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-02-01" }, { label: "Application Deadline", dateValue: "2026-04-15" }, { label: "Interview", dateValue: "2026-06-01" }] },
                universities: { create: [{ universityId: uHarvard.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Australia Awards Scholarship",
                slug: "australia-awards-scholarship",
                description: "Funded by the Australian Government to support long-term development in partner countries. Provides full scholarships for master's degrees at Australian universities.",
                officialUrl: "https://www.australiaawardsindonesia.org",
                country: "Australia", providerType: "foreign_gov", degreeLevel: "master", fundingType: "full", status: "closed",
                openDate: "2025-02-01", closeDate: "2025-04-30",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "Official Site", url: "https://www.australiaawardsindonesia.org", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2025-02-01" }, { label: "Application Closes", dateValue: "2025-04-30" }] },
                universities: { create: [{ universityId: uMelbourne.id }, { universityId: uMonash.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "KGSP (Korean Government Scholarship)",
                slug: "kgsp-korean-government-scholarship",
                description: "The Korean Government Scholarship Program provides international students with opportunities to conduct advanced studies at Korean universities. Includes Korean language training.",
                officialUrl: "https://www.studyinkorea.go.kr",
                country: "South Korea", providerType: "foreign_gov", degreeLevel: "master", fundingType: "full", status: "open",
                openDate: "2026-02-01", closeDate: "2026-03-31",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "Study in Korea", url: "https://www.studyinkorea.go.kr", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-02-01" }, { label: "Application Closes", dateValue: "2026-03-31" }, { label: "Results", dateValue: "2026-07-01" }] },
                universities: { create: [{ universityId: uSeoul.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "MEXT Scholarship (Japan)",
                slug: "mext-scholarship-japan",
                description: "The Japanese Government (MEXT) scholarship for international students. Covers tuition, travel, and monthly living allowance for study at Japanese universities.",
                officialUrl: "https://www.studyinjapan.go.jp/en",
                country: "Japan", providerType: "foreign_gov", degreeLevel: "any", fundingType: "full", status: "upcoming",
                openDate: "2026-04-01", closeDate: "2026-06-30",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "Study in Japan", url: "https://www.studyinjapan.go.jp", linkType: "official" }, { label: "Embassy Guide", url: "https://www.id.emb-japan.go.jp/sch_en.html", linkType: "guide" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-04-01" }, { label: "Application Closes", dateValue: "2026-06-30" }, { label: "Final Results", dateValue: "2026-12-01" }] },
                universities: { create: [{ universityId: uTokyo.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "StuNed Scholarship (Netherlands)",
                slug: "stuned-scholarship-netherlands",
                description: "StuNed supports Indonesian professionals in pursuing short courses and master's programs in the Netherlands. Initiated by the Dutch government.",
                officialUrl: "https://www.nesoindonesia.or.id/beasiswa/stuned",
                country: "Netherlands", providerType: "foreign_gov", degreeLevel: "master", fundingType: "partial", status: "upcoming",
                openDate: "2026-06-01", closeDate: "2026-08-15",
                defaultChecklist: CHECKLISTS.foreign_gov,
                links: { create: [{ label: "Neso Indonesia", url: "https://www.nesoindonesia.or.id/beasiswa/stuned", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-06-01" }, { label: "Application Closes", dateValue: "2026-08-15" }] },
                universities: { create: [{ universityId: uLeiden.id }, { universityId: uTUDelft.id }] },
            }
        }),

        // ── INTERNATIONAL ORGANIZATIONS ────────────────────────────────────
        prisma.scholarship.create({
            data: {
                name: "Erasmus Mundus Joint Masters",
                slug: "erasmus-mundus-joint-masters",
                description: "Prestigious EU-funded joint master's degrees delivered by multiple European universities. Students receive a full scholarship and study in 2–3 different countries.",
                officialUrl: "https://erasmus-plus.ec.europa.eu",
                country: "European Union", providerType: "international_org", degreeLevel: "master", fundingType: "full", status: "open",
                openDate: "2025-10-15", closeDate: "2026-03-20",
                defaultChecklist: CHECKLISTS.international_org,
                links: { create: [{ label: "EMJMD Catalogue", url: "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters-scholarships", linkType: "official" }] },
                dates: { create: [{ label: "Applications Open", dateValue: "2025-10-15" }, { label: "Applications Close", dateValue: "2026-03-20" }, { label: "Results", dateValue: "2026-05-15" }] },
                universities: { create: [{ universityId: uLeiden.id }, { universityId: uOxford.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "ADB-JSP Scholarship",
                slug: "adb-jsp-scholarship",
                description: "The Asian Development Bank – Japan Scholarship Program provides opportunities for qualified citizens of ADB developing member countries to pursue postgraduate studies at designated universities.",
                officialUrl: "https://www.adb.org/what-we-do/japan-scholarship-program",
                country: "Various", providerType: "international_org", degreeLevel: "master", fundingType: "full", status: "upcoming",
                openDate: "2026-05-01", closeDate: "2026-07-31",
                defaultChecklist: CHECKLISTS.international_org,
                links: { create: [{ label: "ADB-JSP Portal", url: "https://www.adb.org/what-we-do/japan-scholarship-program", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-05-01" }, { label: "Application Closes", dateValue: "2026-07-31" }] },
                universities: { create: [{ universityId: uTokyo.id }, { universityId: uNUS.id }] },
            }
        }),

        // ── LOCAL SCHOLARSHIPS (NEW) ───────────────────────────────────────
        prisma.scholarship.create({
            data: {
                name: "Beasiswa Bank Indonesia (BI)",
                slug: "beasiswa-bank-indonesia",
                description: "Bank Indonesia's full scholarship for S1 students at Indonesian state universities. Covers tuition, monthly living allowance, and includes a mentoring and leadership development program.",
                officialUrl: "https://www.bi.go.id/id/tentang-bi/karir/beasiswa",
                country: "Indonesia", providerType: "local_org", degreeLevel: "bachelor", fundingType: "full", status: "open",
                openDate: "2026-01-15", closeDate: "2026-03-31",
                defaultChecklist: CHECKLISTS.local_org,
                links: { create: [{ label: "Bank Indonesia Scholarship", url: "https://www.bi.go.id/id/tentang-bi/karir/beasiswa", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-01-15" }, { label: "Application Closes", dateValue: "2026-03-31" }, { label: "Announcement", dateValue: "2026-05-01" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uUGM.id }, { universityId: uITB.id }, { universityId: uAirlangga.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Beasiswa Djarum Plus",
                slug: "beasiswa-djarum-plus",
                description: "Merit-based scholarship by Djarum Foundation for outstanding S1 students in their 4th semester or later. Includes leadership training, character building, and networking events.",
                officialUrl: "https://www.djarumbeasiswa.com",
                country: "Indonesia", providerType: "local_org", degreeLevel: "bachelor", fundingType: "partial", status: "upcoming",
                openDate: "2026-05-01", closeDate: "2026-06-30",
                defaultChecklist: CHECKLISTS.local_org,
                links: { create: [{ label: "Djarum Beasiswa Plus", url: "https://www.djarumbeasiswa.com", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-05-01" }, { label: "Application Closes", dateValue: "2026-06-30" }, { label: "Test & Interview", dateValue: "2026-08-01" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uUGM.id }, { universityId: uITB.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Beasiswa Tanoto Foundation",
                slug: "beasiswa-tanoto-foundation",
                description: "Tanoto Foundation offers scholarships to high-achieving students at partner Indonesian universities (UI, ITB, IPB, UGM, USU, UNRI, UNSRI). Includes mentoring and academic support.",
                officialUrl: "https://www.tanotofoundation.org/id/pendidikan/beasiswa",
                country: "Indonesia", providerType: "local_org", degreeLevel: "bachelor", fundingType: "partial", status: "open",
                openDate: "2026-01-01", closeDate: "2026-03-31",
                defaultChecklist: CHECKLISTS.local_org,
                links: { create: [{ label: "Tanoto Foundation", url: "https://www.tanotofoundation.org/id/pendidikan/beasiswa", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-01-01" }, { label: "Application Closes", dateValue: "2026-03-31" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uITB.id }, { universityId: uUGM.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Beasiswa Karya Salemba Empat",
                slug: "beasiswa-karya-salemba-empat",
                description: "Monthly stipend and coaching scholarship for S1 students at top Indonesian universities. Emphasizes leadership development and professional networking.",
                officialUrl: "https://www.karya-salemba-empat.com",
                country: "Indonesia", providerType: "local_org", degreeLevel: "bachelor", fundingType: "partial", status: "upcoming",
                openDate: "2026-04-01", closeDate: "2026-05-31",
                defaultChecklist: CHECKLISTS.local_org,
                links: { create: [{ label: "KSE Official", url: "https://www.karya-salemba-empat.com", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-04-01" }, { label: "Application Closes", dateValue: "2026-05-31" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uUGM.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Beasiswa Pertamina Foundation",
                slug: "beasiswa-pertamina-foundation",
                description: "Full scholarship by Pertamina Foundation for underprivileged high-achieving students at Indonesian state universities. Covers tuition, living allowance, and books.",
                officialUrl: "https://www.pertaminafoundation.org",
                country: "Indonesia", providerType: "local_org", degreeLevel: "bachelor", fundingType: "full", status: "upcoming",
                openDate: "2026-06-01", closeDate: "2026-07-31",
                defaultChecklist: CHECKLISTS.local_org,
                links: { create: [{ label: "Pertamina Foundation", url: "https://www.pertaminafoundation.org", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-06-01" }, { label: "Application Closes", dateValue: "2026-07-31" }] },
                universities: { create: [{ universityId: uUI.id }, { universityId: uITB.id }] },
            }
        }),

        // ── UNIVERSITY SCHOLARSHIPS (NEW) ──────────────────────────────────
        prisma.scholarship.create({
            data: {
                name: "UGM Achievement Scholarship",
                slug: "ugm-achievement-scholarship",
                description: "Full tuition waiver awarded by Universitas Gadjah Mada to highest-scoring new entrants via SNBP/SNBT. Renewable based on academic performance.",
                officialUrl: "https://ugm.ac.id/en/scholarship",
                country: "Indonesia", providerType: "university", degreeLevel: "bachelor", fundingType: "tuition_only", status: "upcoming",
                openDate: "2026-05-01", closeDate: "2026-06-15",
                defaultChecklist: CHECKLISTS.university,
                links: { create: [{ label: "UGM Scholarships", url: "https://ugm.ac.id/en/scholarship", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-05-01" }, { label: "Application Closes", dateValue: "2026-06-15" }] },
                universities: { create: [{ universityId: uUGM.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "NUS Research Scholarship",
                slug: "nus-research-scholarship",
                description: "Full scholarship for PhD candidates at the National University of Singapore. Covers tuition fees plus a monthly stipend. Open to Indonesian nationals.",
                officialUrl: "https://nusgs.nus.edu.sg/scholarships",
                country: "Singapore", providerType: "university", degreeLevel: "phd", fundingType: "full", status: "open",
                openDate: "2025-08-01", closeDate: "2026-04-30",
                defaultChecklist: CHECKLISTS.university,
                links: { create: [{ label: "NUS Graduate School", url: "https://nusgs.nus.edu.sg/scholarships", linkType: "official" }] },
                dates: { create: [{ label: "Applications Open", dateValue: "2025-08-01" }, { label: "Applications Close", dateValue: "2026-04-30" }] },
                universities: { create: [{ universityId: uNUS.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "Monash Graduate Scholarship",
                slug: "monash-graduate-scholarship",
                description: "Full tuition fee offset plus living allowance for PhD candidates at Monash University. One of Australia's most competitive research scholarships.",
                officialUrl: "https://www.monash.edu/graduate-research/funding-and-scholarships",
                country: "Australia", providerType: "university", degreeLevel: "phd", fundingType: "full", status: "open",
                openDate: "2025-10-01", closeDate: "2026-05-31",
                defaultChecklist: CHECKLISTS.university,
                links: { create: [{ label: "Monash Funding", url: "https://www.monash.edu/graduate-research/funding-and-scholarships", linkType: "official" }] },
                dates: { create: [{ label: "Round 1 Opens", dateValue: "2025-10-01" }, { label: "Round 1 Closes", dateValue: "2025-12-31" }, { label: "Round 2 Closes", dateValue: "2026-05-31" }] },
                universities: { create: [{ universityId: uMonash.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "TU Delft Excellence Scholarship",
                slug: "tu-delft-excellence-scholarship",
                description: "A €25,000 scholarship for the best non-EEA students joining TU Delft's master's programs. Highly competitive; targeted at top 5% of applicants.",
                officialUrl: "https://www.tudelft.nl/studeer-werk-bij-tu-delft/beursopties/tu-delft-excellence-scholarships",
                country: "Netherlands", providerType: "university", degreeLevel: "master", fundingType: "partial", status: "upcoming",
                openDate: "2026-10-01", closeDate: "2027-01-31",
                defaultChecklist: CHECKLISTS.university,
                links: { create: [{ label: "TU Delft Scholarship Info", url: "https://www.tudelft.nl/studeer-werk-bij-tu-delft/beursopties/tu-delft-excellence-scholarships", linkType: "official" }] },
                dates: { create: [{ label: "Application Opens", dateValue: "2026-10-01" }, { label: "Application Closes", dateValue: "2027-01-31" }] },
                universities: { create: [{ universityId: uTUDelft.id }] },
            }
        }),

        prisma.scholarship.create({
            data: {
                name: "KU Leuven Doctoral Scholarship",
                slug: "ku-leuven-doctoral-scholarship",
                description: "Full doctoral scholarships funded by KU Leuven's Research Council for excellent candidates from non-EEA countries. Covers tuition, living costs, insurance and travel.",
                officialUrl: "https://www.kuleuven.be/english/research/phd/funding",
                country: "Belgium", providerType: "university", degreeLevel: "phd", fundingType: "full", status: "open",
                openDate: "2025-09-01", closeDate: "2026-12-31",
                defaultChecklist: CHECKLISTS.university,
                links: { create: [{ label: "KU Leuven PhD Funding", url: "https://www.kuleuven.be/english/research/phd/funding", linkType: "official" }] },
                dates: { create: [{ label: "Applications Open", dateValue: "2025-09-01" }, { label: "Applications Close", dateValue: "2026-12-31" }] },
                universities: { create: [{ universityId: uKULeuven.id }] },
            }
        }),
    ]);

    // ─── User applications (demo) ───────────────────────────────────────────
    // Use LPDP (idx 0), Chevening (idx 3), DAAD (idx 4)
    await Promise.all([
        prisma.userApplication.create({
            data: {
                userId: user.id,
                scholarshipId: scholarships[0].id, // LPDP
                status: "preparing",
                notes: "Need to prepare motivation letter and research proposal",
                checklist: JSON.stringify([
                    { task: "Academic Transcript (legalized)", done: true },
                    { task: "GPA Certificate / Diploma", done: true },
                    { task: "National ID Card (KTP)", done: true },
                    { task: "Motivation Letter / Essay", done: false },
                    { task: "Recommendation Letter #1", done: false },
                    { task: "Recommendation Letter #2", done: false },
                    { task: "Language Certificate (TOEFL ≥550 / IELTS ≥6.0)", done: true },
                    { task: "Health Certificate", done: false },
                    { task: "Letter of Acceptance (LoA)", done: false },
                ]),
            },
        }),
        prisma.userApplication.create({
            data: {
                userId: user.id,
                scholarshipId: scholarships[3].id, // Chevening
                status: "interested",
                notes: "Check eligibility requirements — need 2 years work experience",
            },
        }),
        prisma.userApplication.create({
            data: {
                userId: user.id,
                scholarshipId: scholarships[4].id, // DAAD
                status: "applied",
                notes: "Submitted on March 1st. Waiting for results.",
                appliedAt: new Date("2026-03-01"),
                checklist: JSON.stringify([
                    { task: "Passport (valid ≥2 years)", done: true },
                    { task: "Academic Transcript", done: true },
                    { task: "Motivation Letter / Personal Statement", done: true },
                    { task: "Recommendation Letter #1", done: true },
                    { task: "Recommendation Letter #2", done: true },
                    { task: "CV / Resume", done: true },
                    { task: "Language Test (IELTS ≥6.5 / TOEFL iBT ≥90)", done: true },
                    { task: "Letter of Acceptance (LoA)", done: false },
                ]),
            },
        }),
    ]);

    console.log("✅ Seed data created successfully!");
    console.log(`   - 15 universities`);
    console.log(`   - ${scholarships.length} scholarships (3 Indonesian Gov, 7 Foreign Gov, 2 International, 5 Local, 5 University)`);
    console.log(`   - 3 user applications with checklists`);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
