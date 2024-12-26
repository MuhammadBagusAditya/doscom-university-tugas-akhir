/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_avatar_id_fkey`;

-- DropIndex
DROP INDEX `User_avatar_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    MODIFY `avatar_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_avatar_id_fkey` FOREIGN KEY (`avatar_id`) REFERENCES `Attachment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
