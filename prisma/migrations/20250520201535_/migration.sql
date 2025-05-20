/*
  Warnings:

  - A unique constraint covering the columns `[user_id,user_agent]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_user_id_user_agent_key" ON "refresh_tokens"("user_id", "user_agent");
