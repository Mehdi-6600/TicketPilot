-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('TOMAN', 'OMR', 'USD');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'TOMAN';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'TOMAN';
