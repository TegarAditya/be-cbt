import { db, dbSd, dbSma, dbSmp } from "@/libs/database"
import { MapelType } from "@/types/mapel"
import { PrismaClient, soal } from "@prisma/client"

/** UTILITY FUNCTIONS */

/**
 * Transforms an array of `soal` objects by mapping each item to a new structure.
 *
 * @param soal - An array of `soal` objects to be transformed.
 * @returns An array of transformed `soal` objects with specific properties.
 */
const transformSoalData = (soal: soal[]) => {
    return soal.map((item) => ({
        nomor: item.nomor,
        soal: item.soal,
        jawaban: `pil${item.jawaban}`,
        pembahasan: item.pembahasan,
        pilA: item.pilA,
        pilB: item.pilB,
        pilC: item.pilC,
        pilD: item.pilD,
        pilE: item.pilE,
        file: item.file,
        file1: item.file1,
        fileA: item.fileA,
        fileB: item.fileB,
        fileC: item.fileC,
        fileD: item.fileD,
        fileE: item.fileE,
    }))
}

/**
 * Retrieves a mapel (subject) based on the provided criteria.
 *
 * @param id - The ID of the mapel to retrieve.
 * @param dbClient - The PrismaClient instance for the database.
 * @returns A promise that resolves to an object containing the success status, message, and optionally the mapel data.
 *
 * @throws Will throw an error if the database query fails.
 */
const getMapelByCriteria = async (id: number, dbClient: PrismaClient) => {
    try {
        const mapel = await dbClient.mapel.findFirst({
            where: {
                OR: [{ id_ujian: id }, { id_referrer: id }],
            },
            select: {
                id_mapel: true,
                id_ujian: true,
                id_referrer: true,
                nama: true,
                soal: {
                    orderBy: { nomor: "asc" },
                    select: {
                        nomor: true,
                        soal: true,
                        jawaban: true,
                        pembahasan: true,
                        pilA: true,
                        pilB: true,
                        pilC: true,
                        pilD: true,
                        pilE: true,
                        file: true,
                        file1: true,
                        fileA: true,
                        fileB: true,
                        fileC: true,
                        fileD: true,
                        fileE: true,
                    },
                },
            },
        })

        if (!mapel) {
            return {
                success: false,
                message: "Data not found",
            }
        }

        const data = {
            id_mapel: mapel.id_mapel,
            nama: mapel.nama,
            soal: transformSoalData(mapel.soal as soal[]),
        }

        return {
            success: true,
            message: "Success",
            data,
        }
    } catch (error) {
        console.error(`Error getting mapel: ${error}`)
        return {
            success: false,
            message: "An error occurred",
        }
    }
}

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
                return getMapelByCriteria(id, dbSd)
            case "smp":
                return getMapelByCriteria(id, dbSmp)
            case "sma":
                return getMapelByCriteria(id, dbSma)
            default:
                return getMapelByCriteria(id, db)
        }
    } catch (error) {
        console.error(`Error getting mapel by id: ${error}`)
    }
}
