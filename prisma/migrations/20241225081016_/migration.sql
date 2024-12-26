/*
  Warnings:

  - Added the required column `assignment_id` to the `UserAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userassignment` ADD COLUMN `assignment_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserAssignment` ADD CONSTRAINT `UserAssignment_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
