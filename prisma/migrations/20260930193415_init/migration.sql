-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AlertPriority" AS ENUM ('NORMAL', 'IMPORTANT', 'URGENT');

-- CreateEnum
CREATE TYPE "AlertKind" AS ENUM ('GENERAL', 'CORTE', 'OBRA', 'MOVILIDAD', 'BANDO', 'PLAZO', 'CIERRE', 'SERVICIO');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'AWARDED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('UPCOMING', 'OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('ORDINARIA', 'EXTRAORDINARIA', 'URGENTE', 'JUNTA_GOBIERNO', 'COMISION', 'OTRA');

-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "CategoryScope" AS ENUM ('NEWS', 'EVENT', 'PROCEDURE', 'DOCUMENT', 'PAGE');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('PDF', 'DOC', 'SPREADSHEET', 'IMAGE', 'LINK', 'OTHER');

-- CreateEnum
CREATE TYPE "FeaturedKind" AS ENUM ('BANNER', 'HIGHLIGHT');

-- CreateEnum
CREATE TYPE "WeeklyUpdateStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'PUBLISH', 'SCHEDULE', 'ARCHIVE', 'RESTORE', 'DELETE', 'LOGIN', 'LOGIN_FAILED', 'WEEKLY_SAVE', 'WEEKLY_PUBLISH', 'UPLOAD', 'VERIFY', 'SETTINGS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityTitle" TEXT,
    "details" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "schedule" TEXT,
    "mapUrl" TEXT,
    "webUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "pendingFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" "CategoryScope" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT NOT NULL DEFAULT '',
    "credit" TEXT,
    "license" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedById" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "kind" "DocumentKind" NOT NULL DEFAULT 'PDF',
    "url" TEXT NOT NULL,
    "isExternal" BOOLEAN NOT NULL DEFAULT true,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "documentDate" TIMESTAMP(3),
    "categoryId" TEXT,
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL DEFAULT '',
    "imageId" TEXT,
    "areaId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "categoryId" TEXT,
    "imageId" TEXT,
    "imageAlt" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT,
    "links" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "weeklyUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "timeText" TEXT,
    "location" TEXT,
    "address" TEXT,
    "categoryId" TEXT,
    "organizer" TEXT,
    "price" TEXT,
    "bookingUrl" TEXT,
    "url" TEXT,
    "imageId" TEXT,
    "imageAlt" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" "Recurrence" NOT NULL DEFAULT 'NONE',
    "recurrenceEnd" TIMESTAMP(3),
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "weeklyUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT,
    "priority" "AlertPriority" NOT NULL DEFAULT 'NORMAL',
    "kind" "AlertKind" NOT NULL DEFAULT 'GENERAL',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "url" TEXT,
    "areaId" TEXT,
    "showOnHome" BOOLEAN NOT NULL DEFAULT true,
    "zone" TEXT,
    "affectation" TEXT,
    "alternative" TEXT,
    "mapUrl" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "weeklyUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "grantStatus" "GrantStatus" NOT NULL DEFAULT 'OPEN',
    "openingDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "deadlineText" TEXT,
    "beneficiaries" TEXT,
    "summary" TEXT NOT NULL,
    "body" TEXT,
    "officialUrl" TEXT,
    "sedeUrl" TEXT,
    "areaId" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "weeklyUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicJob" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jobStatus" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "staffType" TEXT,
    "positions" INTEGER,
    "openingDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "summary" TEXT NOT NULL,
    "body" TEXT,
    "officialUrl" TEXT,
    "areaId" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "weeklyUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MunicipalSession" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sessionType" "SessionType" NOT NULL DEFAULT 'ORDINARIA',
    "date" TIMESTAMP(3) NOT NULL,
    "timeText" TEXT,
    "location" TEXT,
    "streamingUrl" TEXT,
    "agenda" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "weeklyUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MunicipalSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedure" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "whoCanApply" TEXT,
    "requirements" TEXT,
    "documentation" TEXT,
    "deadline" TEXT,
    "cost" TEXT,
    "howToApply" TEXT,
    "inPerson" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "requiresCertificate" BOOLEAN NOT NULL DEFAULT false,
    "sedeUrl" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" TEXT,
    "areaId" TEXT,
    "contact" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "searchText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "kind" "FeaturedKind" NOT NULL DEFAULT 'HIGHLIGHT',
    "imageId" TEXT,
    "imageAlt" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyUpdate" (
    "id" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekLabel" TEXT NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "checklist" JSONB,
    "payload" JSONB,
    "status" "WeeklyUpdateStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentToNews" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToNews_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToProcedure" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToProcedure_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToMunicipalSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToMunicipalSession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToGrant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToGrant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToPublicJob" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToPublicJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToPage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToPage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AlertToDocument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlertToDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_slug_key" ON "Area"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_scope_slug_key" ON "Category"("scope", "slug");

-- CreateIndex
CREATE INDEX "Document_categoryId_idx" ON "Document"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_path_key" ON "Page"("path");

-- CreateIndex
CREATE INDEX "Page_section_status_idx" ON "Page"("section", "status");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_status_date_idx" ON "News"("status", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_startDate_idx" ON "Event"("status", "startDate");

-- CreateIndex
CREATE INDEX "Alert_status_startsAt_idx" ON "Alert"("status", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_slug_key" ON "Grant"("slug");

-- CreateIndex
CREATE INDEX "Grant_status_grantStatus_idx" ON "Grant"("status", "grantStatus");

-- CreateIndex
CREATE UNIQUE INDEX "PublicJob_slug_key" ON "PublicJob"("slug");

-- CreateIndex
CREATE INDEX "PublicJob_status_jobStatus_idx" ON "PublicJob"("status", "jobStatus");

-- CreateIndex
CREATE UNIQUE INDEX "MunicipalSession_slug_key" ON "MunicipalSession"("slug");

-- CreateIndex
CREATE INDEX "MunicipalSession_status_date_idx" ON "MunicipalSession"("status", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_slug_key" ON "Procedure"("slug");

-- CreateIndex
CREATE INDEX "Procedure_status_featured_idx" ON "Procedure"("status", "featured");

-- CreateIndex
CREATE INDEX "_DocumentToNews_B_index" ON "_DocumentToNews"("B");

-- CreateIndex
CREATE INDEX "_DocumentToProcedure_B_index" ON "_DocumentToProcedure"("B");

-- CreateIndex
CREATE INDEX "_DocumentToMunicipalSession_B_index" ON "_DocumentToMunicipalSession"("B");

-- CreateIndex
CREATE INDEX "_DocumentToGrant_B_index" ON "_DocumentToGrant"("B");

-- CreateIndex
CREATE INDEX "_DocumentToPublicJob_B_index" ON "_DocumentToPublicJob"("B");

-- CreateIndex
CREATE INDEX "_DocumentToPage_B_index" ON "_DocumentToPage"("B");

-- CreateIndex
CREATE INDEX "_AlertToDocument_B_index" ON "_AlertToDocument"("B");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_weeklyUpdateId_fkey" FOREIGN KEY ("weeklyUpdateId") REFERENCES "WeeklyUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_weeklyUpdateId_fkey" FOREIGN KEY ("weeklyUpdateId") REFERENCES "WeeklyUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_weeklyUpdateId_fkey" FOREIGN KEY ("weeklyUpdateId") REFERENCES "WeeklyUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_weeklyUpdateId_fkey" FOREIGN KEY ("weeklyUpdateId") REFERENCES "WeeklyUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicJob" ADD CONSTRAINT "PublicJob_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicJob" ADD CONSTRAINT "PublicJob_weeklyUpdateId_fkey" FOREIGN KEY ("weeklyUpdateId") REFERENCES "WeeklyUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MunicipalSession" ADD CONSTRAINT "MunicipalSession_weeklyUpdateId_fkey" FOREIGN KEY ("weeklyUpdateId") REFERENCES "WeeklyUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedContent" ADD CONSTRAINT "FeaturedContent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyUpdate" ADD CONSTRAINT "WeeklyUpdate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToNews" ADD CONSTRAINT "_DocumentToNews_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToNews" ADD CONSTRAINT "_DocumentToNews_B_fkey" FOREIGN KEY ("B") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToProcedure" ADD CONSTRAINT "_DocumentToProcedure_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToProcedure" ADD CONSTRAINT "_DocumentToProcedure_B_fkey" FOREIGN KEY ("B") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToMunicipalSession" ADD CONSTRAINT "_DocumentToMunicipalSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToMunicipalSession" ADD CONSTRAINT "_DocumentToMunicipalSession_B_fkey" FOREIGN KEY ("B") REFERENCES "MunicipalSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToGrant" ADD CONSTRAINT "_DocumentToGrant_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToGrant" ADD CONSTRAINT "_DocumentToGrant_B_fkey" FOREIGN KEY ("B") REFERENCES "Grant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToPublicJob" ADD CONSTRAINT "_DocumentToPublicJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToPublicJob" ADD CONSTRAINT "_DocumentToPublicJob_B_fkey" FOREIGN KEY ("B") REFERENCES "PublicJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToPage" ADD CONSTRAINT "_DocumentToPage_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToPage" ADD CONSTRAINT "_DocumentToPage_B_fkey" FOREIGN KEY ("B") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToDocument" ADD CONSTRAINT "_AlertToDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToDocument" ADD CONSTRAINT "_AlertToDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
