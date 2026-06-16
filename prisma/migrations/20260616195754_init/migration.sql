-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('CREATOR', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FLCPosition" AS ENUM ('FACULTY_COORDINATOR', 'PRESIDENT', 'VICE_PRESIDENT', 'OPERATIONS_MANAGER', 'TECH_TEAM', 'EVENT_TEAM', 'DSA_TEAM', 'MEDIA_TEAM', 'SOCIAL_MEDIA_TEAM', 'GRAPHICS_TEAM', 'ADVISOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "flcPosition" "FLCPosition" NOT NULL,
    "systemRole" "SystemRole" NOT NULL,
    "isAuthorized" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "alternateUrl" TEXT,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "maxClicks" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "linkId" TEXT NOT NULL,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isAuthorized_idx" ON "User"("isAuthorized");

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_slug_idx" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_creatorId_idx" ON "Link"("creatorId");

-- CreateIndex
CREATE INDEX "ClickEvent_linkId_idx" ON "ClickEvent"("linkId");

-- CreateIndex
CREATE INDEX "ClickEvent_clickedAt_idx" ON "ClickEvent"("clickedAt");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
