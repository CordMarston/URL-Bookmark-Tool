/*
  Warnings:

  - You are about to drop the column `browser` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `deviceBrand` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `deviceType` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the column `deviceVersion` on the `visits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `visits` DROP COLUMN `browser`,
    DROP COLUMN `deviceBrand`,
    DROP COLUMN `deviceType`,
    DROP COLUMN `deviceVersion`,
    ADD COLUMN `osName` VARCHAR(191) NULL,
    ADD COLUMN `osVersion` VARCHAR(191) NULL;
