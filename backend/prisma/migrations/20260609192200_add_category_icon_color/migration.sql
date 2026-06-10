-- Rename tables to match @@map directives
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Category" RENAME TO "categories";
ALTER TABLE "Transaction" RENAME TO "transactions";

-- Rename primary keys
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";
ALTER TABLE "categories" RENAME CONSTRAINT "Category_pkey" TO "categories_pkey";
ALTER TABLE "transactions" RENAME CONSTRAINT "Transaction_pkey" TO "transactions_pkey";

-- Rename indexes
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
ALTER INDEX "Category_userId_name_key" RENAME TO "categories_userId_name_key";

-- Rename foreign keys
ALTER TABLE "categories" RENAME CONSTRAINT "Category_userId_fkey" TO "categories_userId_fkey";
ALTER TABLE "transactions" RENAME CONSTRAINT "Transaction_categoryId_fkey" TO "transactions_categoryId_fkey";
ALTER TABLE "transactions" RENAME CONSTRAINT "Transaction_userId_fkey" TO "transactions_userId_fkey";

-- CreateEnum
CREATE TYPE "CategoryIcon" AS ENUM ('BUSINESS', 'CAR', 'HEALTH', 'FINANCY', 'CART', 'TICKET', 'TOOL_CASE', 'UTENSILS', 'PET', 'HOUSE', 'GIFT', 'GYM', 'BOOK', 'BAGGAGE', 'MAILBOX', 'RECEIPT');

-- CreateEnum
CREATE TYPE "CategoryColor" AS ENUM ('GREEN', 'BLUE', 'PURPLE', 'PINK', 'RED', 'ORANGE', 'YELLOW');

-- Add category appearance fields
ALTER TABLE "categories" ADD COLUMN "icon" "CategoryIcon" NOT NULL DEFAULT 'FINANCY';
ALTER TABLE "categories" ADD COLUMN "color" "CategoryColor" NOT NULL DEFAULT 'GREEN';
