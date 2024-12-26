-- CreateTable
CREATE TABLE `UserAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToUserAssignment` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserToUserAssignment_AB_unique`(`A`, `B`),
    INDEX `_UserToUserAssignment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToUserAssignment` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AttachmentToUserAssignment_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToUserAssignment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserToUserAssignment` ADD CONSTRAINT `_UserToUserAssignment_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToUserAssignment` ADD CONSTRAINT `_UserToUserAssignment_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserAssignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToUserAssignment` ADD CONSTRAINT `_AttachmentToUserAssignment_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToUserAssignment` ADD CONSTRAINT `_AttachmentToUserAssignment_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserAssignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
