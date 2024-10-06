import { db, dbSd, dbSma, dbSmp } from "@/libs/database"
import { MapelType } from "@/types/mapel"
import { decodeUnicode, fetchMapelByCriteria } from "@/utils";
import { PrismaClient, soal } from "@prisma/client"

/** HANDLER FUNCTIONS */

/**
 * Fetches a list of mapel (subjects) from the database based on the specified type, limit, page, and search criteria.
 *
 * @param type - The type of mapel to fetch. Can be "cbt", "pts", "pas", or "all".
 * @param limit - The maximum number of records to fetch. Defaults to 25.
 * @param page - The page number for pagination. Defaults to 1.
 * @param search - The search string to filter mapel names. Defaults to an empty string.
 * @returns A promise that resolves to an object containing the success status, message, and fetched data.
 *
 * @throws Will log an error message if there is an issue fetching the mapel.
 */
export async function getMapel(
    type: MapelType,
    limit: number = 25,
    page: number = 1,
    search: string = ""
) {
    try {
        const getOption = (): string => {
            switch (type) {
                case "cbt":
                    return "CBT"
                case "pts":
                    return "PTS"
                case "pas":
                    return "PAS"
                case "all":
                    return ""
            }
        }

        const mapel = await db.mapel.findMany({
            relationLoadStrategy: "query",
            orderBy: { id_mapel: "desc" },
            where: {
                nama: {
                    startsWith: getOption(),
                    contains: search,
                },
            },
            select: {
                id_mapel: true,
                id_ujian: true,
                nama: true,
            },
            take: limit,
            skip: (page - 1) * limit,
        })

        return {
            success: true,
            message: "Records fetched",
            data: mapel,
        }
    } catch (error) {
        console.error(`Error getting mapel: ${error}`)
    }
}

/**
 * Retrieves a mapel (subject) based on the provided ID and type.
 *
 * @param id - The ID of the mapel to retrieve.
 * @param level - The education level for which to fetch the mapel. Defaults to "fallback".
 * @returns The mapel that matches the provided criteria.
 *
 * @throws Will log an error message if there is an issue retrieving the mapel.
 */
export const getMapelById = (id: number, level: string = "fallback") => {
    try {
        switch (level) {
            case "sd":
                return fetchMapelByCriteria(id, dbSd)
            case "smp":
                return fetchMapelByCriteria(id, dbSmp)
            case "sma":
                return fetchMapelByCriteria(id, dbSma)
            default:
                return fetchMapelByCriteria(id, db)
        }
    } catch (error) {
        console.error(`Error getting mapel by id: ${error}`)
    }
}
