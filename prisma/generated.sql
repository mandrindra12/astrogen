-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('verified', 'standard');

-- CreateEnum
CREATE TYPE "conversation_type_enum" AS ENUM ('group', 'one_to_one', 'broadcast');

-- CreateEnum
CREATE TYPE "file_type_enum" AS ENUM ('image', 'video', 'audio');

-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "message_status_enum" AS ENUM ('sent', 'delivered', 'read', 'failed');

-- CreateEnum
CREATE TYPE "user_action_enum" AS ENUM ('log_in', 'log_out');

-- CreateEnum
CREATE TYPE "user_state_enum" AS ENUM ('online', 'offline');

-- CreateTable
CREATE TABLE "_conversationsTousers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_messagesTousers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_user_follows" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "attachments" (
    "attachment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "file_url" VARCHAR(255) NOT NULL,
    "file_type" "file_type_enum",
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "comments" (
    "comment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "body" TEXT NOT NULL,
    "comment_likers" TEXT[],
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "commentator_id" UUID,
    "commented_post_id" UUID,
    "parent_comment_id" UUID,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "conversation_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_type" "conversation_type_enum" DEFAULT 'one_to_one',
    "conversation_name" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("conversation_id")
);

-- CreateTable
CREATE TABLE "flashcards" (
    "flashcard_id" UUID NOT NULL,
    "flashcard_front" TEXT NOT NULL,
    "flascard_back" TEXT NOT NULL,
    "author_id" UUID NOT NULL,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("flashcard_id")
);

-- CreateTable
CREATE TABLE "medias" (
    "media_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fileType" "file_type_enum" NOT NULL,
    "encoding" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "media_post_id" UUID,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "response_id" UUID,
    "sender_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "message_status" "message_status_enum" DEFAULT 'sent',
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "nofitications" (
    "notification_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sender_name" TEXT NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "nofitications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "post_categories" (
    "category_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_value" TEXT NOT NULL,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "post_category_id" UUID,
    "post_likers" TEXT[],
    "author_id" UUID NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "quiz_id" UUID NOT NULL,
    "quiz_level" INTEGER NOT NULL,
    "quiz_question" TEXT NOT NULL,
    "quiz_response" TEXT NOT NULL,
    "author_id" UUID NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_token" TEXT NOT NULL,
    "ip_addr" TEXT,
    "user_agent" TEXT,
    "session_user_id" UUID,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bio" TEXT,
    "email" TEXT,
    "name" TEXT,
    "password" VARCHAR(255) NOT NULL,
    "gender" "gender_enum" DEFAULT 'male',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "profile_photo_url" TEXT,
    "cover_photo_url" TEXT,
    "user_account_type" "account_type" NOT NULL DEFAULT 'standard',

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users_saved_posts" (
    "post_saving_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "saved_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_saving_id" UUID,
    "saved_post_id" UUID,

    CONSTRAINT "users_saved_posts_pkey" PRIMARY KEY ("post_saving_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_conversationsTousers_AB_unique" ON "_conversationsTousers"("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_conversationsTousers_B_index" ON "_conversationsTousers"("B" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "_messagesTousers_AB_unique" ON "_messagesTousers"("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_messagesTousers_B_index" ON "_messagesTousers"("B" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "_user_follows_AB_unique" ON "_user_follows"("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_user_follows_B_index" ON "_user_follows"("B" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email" ASC);

-- AddForeignKey
ALTER TABLE "_conversationsTousers" ADD CONSTRAINT "_conversationsTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("conversation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversationsTousers" ADD CONSTRAINT "_conversationsTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_messagesTousers" ADD CONSTRAINT "_messagesTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_messagesTousers" ADD CONSTRAINT "_messagesTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_follows" ADD CONSTRAINT "_user_follows_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_follows" ADD CONSTRAINT "_user_follows_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "fk_message_id" FOREIGN KEY ("message_id") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_commentator_id_fkey" FOREIGN KEY ("commentator_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_commented_post_id_fkey" FOREIGN KEY ("commented_post_id") REFERENCES "posts"("post_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_media_post_id_fkey" FOREIGN KEY ("media_post_id") REFERENCES "posts"("post_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "fk_conversation_id" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("conversation_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nofitications" ADD CONSTRAINT "nofitications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_category_id_fkey" FOREIGN KEY ("post_category_id") REFERENCES "post_categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_session_user_id_fkey" FOREIGN KEY ("session_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_saved_posts" ADD CONSTRAINT "users_saved_posts_saved_post_id_fkey" FOREIGN KEY ("saved_post_id") REFERENCES "posts"("post_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_saved_posts" ADD CONSTRAINT "users_saved_posts_user_saving_id_fkey" FOREIGN KEY ("user_saving_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

