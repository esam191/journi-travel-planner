/*
  Warnings:

  - A unique constraint covering the columns `[tripId,order]` on the table `ItineraryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ItineraryItem_tripId_order_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryItem_tripId_order_key" ON "ItineraryItem"("tripId", "order");
