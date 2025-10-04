-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "streaming_content" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "cast" TEXT[],
    "watch_progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streaming_content_pkey" PRIMARY KEY ("id")
);
