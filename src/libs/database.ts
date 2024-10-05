import { PrismaClient } from "@prisma/client"

export const db = new PrismaClient()

export const dbSd = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_SD,
})

export const dbSmp = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_SMP,
})

export const dbSma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_SMA,
})
