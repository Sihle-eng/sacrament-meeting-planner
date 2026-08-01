-- CreateTable
CREATE TABLE "Meeting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "meeting_type" TEXT NOT NULL,
    "presiding" TEXT,
    "conducting" TEXT,
    "opening_hymn" TEXT,
    "sacrament_hymn" TEXT,
    "closing_hymn" TEXT,
    "opening_prayer" TEXT,
    "closing_prayer" TEXT,
    "speakers" TEXT NOT NULL DEFAULT '[]',
    "announcements" TEXT NOT NULL DEFAULT '[]',
    "ward_business" TEXT NOT NULL DEFAULT '[]',
    "stake_business" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
