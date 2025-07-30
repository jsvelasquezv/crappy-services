CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`file_name` text NOT NULL,
	`original_name` text NOT NULL,
	`title` text,
	`tags` text,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`created_at` integer NOT NULL
);
