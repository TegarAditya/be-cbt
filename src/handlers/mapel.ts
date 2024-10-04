import { db } from "@/libs/database"
import { MapelIdType, MapelType } from "@/types/mapel"
import { soal } from "@prisma/client"

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
 * @returns A promise that resolves to an object containing the success status, message, and optionally the mapel data.
 *
 * @throws Will throw an error if the database query fails.
 */
const getMapelByCriteria = async (id: number) => {
    try {
        const mapel = await db.mapel.findFirst({
            where: {
                OR: [
                    {
                        id_ujian: id,
                    },
                    {
                        id_referrer: id,
                    },
                ],
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
    } catch (e: unknown) {
        console.error(`Error getting mapel: ${e}`)
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
 * @param {MapelType} type - The type of mapel to fetch. Can be "cbt", "pts", "pas", or "all".
 * @param {number} [limit=25] - The maximum number of records to fetch. Defaults to 25.
 * @param {number} [page=1] - The page number for pagination. Defaults to 1.
 * @param {string} [search=""] - The search string to filter mapel names. Defaults to an empty string.
 * @returns A promise that resolves to an object containing the success status, message, and fetched data.
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
            message: "record fetched",
            data: mapel,
        }
    } catch (e: unknown) {
        console.error(`Error getting mapel: ${e}`)
    }
}

/**
 * Retrieves a mapel (subject) based on the provided ID and type.
 *
 * @param id - The ID of the mapel to retrieve.
 * @returns The mapel that matches the provided criteria.
 * @throws Will log an error message if there is an issue retrieving the mapel.
 */
export const getMapelById = (id: number) => {
    try {
        return getMapelByCriteria(id)
    } catch (error) {
        console.error(`Error getting mapel by id: ${error}`)
    }
}
