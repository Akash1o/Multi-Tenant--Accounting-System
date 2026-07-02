/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Otp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNumber" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Otp" ("code", "createdAt", "id") SELECT "code", "createdAt", "id" FROM "Otp";
DROP TABLE "Otp";
ALTER TABLE "new_Otp" RENAME TO "Otp";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
