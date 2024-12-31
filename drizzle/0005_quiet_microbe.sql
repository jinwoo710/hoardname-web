PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_shop` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`originalName` text NOT NULL,
	`ownerId` text,
	`bggId` text,
	`thumbnailUrl` text,
	`createdAt` integer,
	`price` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_shop`("id", "name", "originalName", "ownerId", "bggId", "thumbnailUrl", "createdAt", "price") SELECT "id", "name", "originalName", "ownerId", "bggId", "thumbnailUrl", "createdAt", "price" FROM `shop`;--> statement-breakpoint
DROP TABLE `shop`;--> statement-breakpoint
ALTER TABLE `__new_shop` RENAME TO `shop`;--> statement-breakpoint
PRAGMA foreign_keys=ON;