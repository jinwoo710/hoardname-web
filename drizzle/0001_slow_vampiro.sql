CREATE TABLE `boardgames` (
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
