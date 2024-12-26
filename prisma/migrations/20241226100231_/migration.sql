-- DropForeignKey
ALTER TABLE `classroom` DROP FOREIGN KEY `Classroom_creator_id_fkey`;

-- DropIndex
DROP INDEX `Classroom_creator_id_fkey` ON `classroom`;

-- AddForeignKey
ALTER TABLE `Classroom` ADD CONSTRAINT `Classroom_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
