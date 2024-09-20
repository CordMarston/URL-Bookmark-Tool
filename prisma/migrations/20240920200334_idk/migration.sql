/*
  Warnings:

  - You are about to drop the column `userId` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Link` DROP FOREIGN KEY `Link_userId_fkey`;

-- AlterTable
ALTER TABLE `Link` DROP COLUMN `userId`,
    ADD COLUMN `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
