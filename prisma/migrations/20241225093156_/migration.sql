/*
  Warnings:

  - You are about to drop the `_usertouserassignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `UserAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_usertouserassignment` DROP FOREIGN KEY `_UserToUserAssignment_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usertouserassignment` DROP FOREIGN KEY `_UserToUserAssignment_B_fkey`;

-- AlterTable
ALTER TABLE `userassignment` ADD COLUMN `user_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_usertouserassignment`;

-- AddForeignKey
ALTER TABLE `UserAssignment` ADD CONSTRAINT `UserAssignment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
