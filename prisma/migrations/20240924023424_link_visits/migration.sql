-- CreateTable
CREATE TABLE `visits` (
    `id` VARCHAR(191) NOT NULL,
    `link_id` INTEGER NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `browser` VARCHAR(191) NOT NULL,
    `deviceType` VARCHAR(191) NULL,
    `deviceBrand` VARCHAR(191) NULL,
    `deviceVersion` VARCHAR(191) NULL,
    `browserName` VARCHAR(191) NULL,
    `browserVersion` VARCHAR(191) NULL,
    `bot` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `visits` ADD CONSTRAINT `visits_link_id_fkey` FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
