/*
  Warnings:

  - You are about to drop the column `user` on the `Link` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Link` DROP COLUMN `user`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
