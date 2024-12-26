-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_avatar_id_fkey`;

-- DropIndex
DROP INDEX `User_avatar_id_fkey` ON `user`;

-- CreateTable
CREATE TABLE `Avatar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attachment_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_avatar_id_fkey` FOREIGN KEY (`avatar_id`) REFERENCES `Avatar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avatar` ADD CONSTRAINT `Avatar_attachment_id_fkey` FOREIGN KEY (`attachment_id`) REFERENCES `Attachment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
