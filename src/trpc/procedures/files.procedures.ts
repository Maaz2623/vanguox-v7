import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { messagesFilesTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export const filesRouter = createTRPCRouter({
    getFilesByMessageId: baseProcedure.input(z.object({
        messageId: z.string()
    })).query(async ({input}) => {

        try {
            
            const files = await db.select().from(messagesFilesTable).where(eq(messagesFilesTable.messageId,input.messageId))
            return files
        } catch (error) {
            console.log(error)   
        }

    })
})