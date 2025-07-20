import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const messagesRouter = createTRPCRouter({
    getAnalytics: baseProcedure.input(z.object({
        query: z.string()
    })).query(async ({input}) => {


        try {
            
            const data = await db.execute(
                sql.raw(input.query)
            )
            
            return data.rows
        } catch (error) {
         console.log(error)   
        }
    })
})