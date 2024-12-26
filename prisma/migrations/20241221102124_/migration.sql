/*
  Warnings:

  - Added the required column `classroom_id` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroom_id` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignment` ADD COLUMN `classroom_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `material` ADD COLUMN `classroom_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
