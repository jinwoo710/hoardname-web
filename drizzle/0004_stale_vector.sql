CREATE TABLE `shop` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`originalName` text NOT NULL,
	`ownerId` text,
	`bggId` text,
	`thumbnailUrl` text,
	`createdAt` integer,
	`price` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_boardgames` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`originalName` text NOT NULL,
	`ownerId` text,
	`imported` integer DEFAULT false NOT NULL,
	`bggId` text,
	`weight` real,
	`bestWith` text,
	`recommendedWith` text,
	`minPlayers` integer,
	`maxPlayers` integer,
	`thumbnailUrl` text,
	`imageUrl` text,
	`createdAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_boardgames`("id", "name", "originalName", "ownerId", "imported", "bggId", "weight", "bestWith", "recommendedWith", "minPlayers", "maxPlayers", "thumbnailUrl", "imageUrl", "createdAt") SELECT "id", "name", "originalName", "ownerId", "imported", "bggId", "weight", "bestWith", "recommendedWith", "minPlayers", "maxPlayers", "thumbnailUrl", "imageUrl", "createdAt" FROM `boardgames`;--> statement-breakpoint
DROP TABLE `boardgames`;--> statement-breakpoint
ALTER TABLE `__new_boardgames` RENAME TO `boardgames`;--> statement-breakpoint
PRAGMA foreign_keys=ON;