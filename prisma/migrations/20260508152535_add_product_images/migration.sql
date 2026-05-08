-- AlterTable
ALTER TABLE `product` MODIFY `image` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `productImage` (
    `id` VARCHAR(191) NOT NULL,
    `url` LONGTEXT NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    INDEX `productImage_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `productImage` ADD CONSTRAINT `productImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
