-- DropForeignKey
ALTER TABLE `Link` DROP FOREIGN KEY `Link_user_id_fkey`;

-- AlterTable
ALTER TABLE `Link` MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
