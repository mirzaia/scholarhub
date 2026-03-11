-- CreateTable
CREATE TABLE "scholarships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "official_url" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "degree_level" TEXT NOT NULL,
    "funding_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "open_date" TEXT,
    "close_date" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "scholarship_dates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scholarship_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "date_value" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "scholarship_dates_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarships" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scholarship_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scholarship_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "link_type" TEXT NOT NULL DEFAULT 'official',
    CONSTRAINT "scholarship_links_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarships" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "university_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "university_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "link_type" TEXT NOT NULL DEFAULT 'official',
    CONSTRAINT "university_links_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scholarship_universities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scholarship_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "scholarship_universities_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarships" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scholarship_universities_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationality" TEXT NOT NULL DEFAULT 'Indonesian',
    "degree_current" TEXT,
    "degree_target" TEXT,
    "gpa" REAL,
    "age" INTEGER,
    "preferences" TEXT DEFAULT '{}',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "scholarship_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'interested',
    "notes" TEXT,
    "checklist" TEXT DEFAULT '[]',
    "applied_at" DATETIME,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_applications_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarships" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "scholarships_slug_key" ON "scholarships"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "scholarship_universities_scholarship_id_university_id_key" ON "scholarship_universities"("scholarship_id", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_applications_user_id_scholarship_id_key" ON "user_applications"("user_id", "scholarship_id");
