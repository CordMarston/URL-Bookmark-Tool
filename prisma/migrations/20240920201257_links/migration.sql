/*
  Warnings:

  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Link` DROP FOREIGN KEY `Link_user_id_fkey`;

-- DropTable
DROP TABLE `Link`;

-- CreateTable
CREATE TABLE `links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `link` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,

    UNIQUE INDEX `links_alias_key`(`alias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `links` ADD CONSTRAINT `links_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
