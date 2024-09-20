/*
  Warnings:

  - You are about to drop the column `user_id` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Link` DROP FOREIGN KEY `Link_user_id_fkey`;

-- AlterTable
ALTER TABLE `Link` DROP COLUMN `user_id`,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
