-- AlterTable
ALTER TABLE `NavbarItem` ADD COLUMN `parentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `NavbarItem` ADD CONSTRAINT `NavbarItem_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `NavbarItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
