import {
    getSubjectEnumKeys,
    getSubjectEnumValues,
    SubjectType,
} from "@/enums/subject"
import { MapelLevelType, MapelType } from "@/types/mapel"
import { getDbClient, getMapelPrefix, transformSoalData } from "@/utils"
import { Prisma, soal } from "@prisma/client"

/** HANDLER FUNCTIONS */

/**
 * Retrieves a list of subjects (mapel) for a given class (kelas) and level.
 *
 * @param type - The type of mapel to fetch.
 * @param level - The level of the mapel.
 * @param kelas - The class number.
 * @returns A promise that resolves to an array of subjects.
 *
 * @throws Will log an error message if there is an issue retrieving the subjects.
 */
export async function getMapelSubjectByKelas(
    type: MapelType,
    kelas: number,
    level: MapelLevelType
): Promise<SubjectType[] | undefined> {
    try {
        let listMapel: SubjectType[] = []

        const isSubjectHasMapel = async (subject: SubjectType) => {
            const res = await getMapelCombined(
                type,
                1000,
                1,
                "",
                subject,
                kelas,
                level
            )
            return res.data.length > 0
        }

        const promises = getSubjectEnumKeys().map(async (subject) => {
            const isMapelExist = await isSubjectHasMapel(subject)
            if (isMapelExist) listMapel.push(subject)
        })

        await Promise.all(promises)

        return listMapel.sort()
    } catch (error) {
        console.error(`Error getting mapel by kelas: ${error}`)
    }
}

/**
 * Fetches a list of mapel (subjects) from the database based on the specified type, limit, page, and search criteria.
 *
 * @param type - The type of mapel to fetch. Can be "cbt", "pts", "pas", or "all".
 * @param limit - The maximum number of records to fetch. Defaults to 25.
 * @param page - The page number for pagination. Defaults to 1.
 * @param search - The search string to filter mapel names. Defaults to an empty string.
 * @param mapel - The name of the mapel to filter. Defaults to an empty string.
 * @param kelas - The class of the mapel to filter. Defaults to null.
 * @returns A promise that resolves to an object containing the success status, message, and fetched data.
 *
 * @throws Will log an error message if the retrieval process fails.
 */
export async function getMapel(
    type: MapelType,
    limit: number = 25,
    page: number = 1,
    search: string = "",
    mapel: SubjectType | "" = "",
    kelas: number | null = null,
    level: MapelLevelType = "fallback"
) {
    try {
        const dbClient = getDbClient(level)

        const whereClause: Prisma.mapelWhereInput = {
            nama: {
                startsWith: getMapelPrefix(type),
                contains: search,
            },
        }

        if (mapel) {
            const mapelValues = getSubjectEnumValues(mapel)

            if (!mapelValues) {
                return {
                    success: false,
                    message: `Invalid mapel: ${mapel} does not exist in SubjectEnum.`,
                    data: [],
                }
            }

            whereClause.OR = mapelValues.map((alias) => ({
                nama: {
                    contains: alias,
                },
            }))
        }

        if (kelas && kelas < 10) {
            whereClause.AND = {
                nama: {
                    contains: `${kelas}-`,
                },
                NOT: [
                    { nama: { contains: "10" } },
                    { nama: { contains: "11" } },
                    { nama: { contains: "12" } },
                ],
            }
        } else if (kelas && kelas >= 10) {
            whereClause.AND = {
                nama: {
                    contains: `${kelas}-`,
                },
            }
        }

        const mapelRecords = await dbClient.mapel.findMany({
            relationLoadStrategy: "query",
            orderBy: { id_mapel: "desc" },
            where: whereClause,
            select: {
                id_mapel: true,
                id_ujian: true,
                nama: true,
            },
            take: limit,
            skip: (page - 1) * limit,
        })

        if (!mapelRecords.length) {
            return {
                success: false,
                message: "Data not found",
            }
        }

        return {
            success: true,
            message: "Records fetched",
            data: mapelRecords,
        }
    } catch (error) {
        console.error(`Error getting mapel: ${error}`)
        return {
            success: false,
            message: "Failed to fetch records",
            data: [],
        }
    }
}

/**
 * Fetches and combines mapel (subject) data from different levels.
 *
 * @param {MapelType} type - The type of mapel to fetch.
 * @param {number} [limit=25] - The maximum number of items to fetch.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} [search=""] - The search query to filter mapel.
 * @param {SubjectType | ""} [mapel=""] - The specific mapel to fetch.
 * @param {number | null} [kelas=null] - The class level to filter mapel.
 * @param {MapelLevelType} [level="fallback"] - The level of mapel to fetch.
 * @returns The combined mapel data with origin information.
 *
 * @throws Will log an error message if the retrieval process fails.
 */
export const getMapelCombined = async (
    type: MapelType,
    limit: number = 25,
    page: number = 1,
    search: string = "",
    mapel: SubjectType | "" = "",
    kelas: number | null = null,
    level: MapelLevelType = "fallback"
) => {
    const fetchMapel = async (levelToFetch: MapelLevelType) => {
        return await getMapel(
            type,
            limit,
            page,
            search,
            mapel,
            kelas,
            levelToFetch
        )
    }

    const mainMapel = await fetchMapel(level)

    let fallbackMapel
    if (level !== "fallback") {
        fallbackMapel = await fetchMapel("fallback")
    } else {
        fallbackMapel = {
            success: true,
            message: "Data fetched before",
            data: [],
        }
    }

    const addOriginToData = (data: any[], origin: MapelLevelType) => {
        return data.map((item) => ({ ...item, origin }))
    }

    return {
        success: true,
        message: "Success",
        data: [
            ...addOriginToData(mainMapel.data || [], level),
            ...addOriginToData(fallbackMapel.data || [], "fallback"),
        ],
    }
}

/**
 * Retrieves a mapel (subject) by its ID.
 *
 * @param id - The ID of the mapel to retrieve.
 * @param level - The database level to use for the query. Defaults to "fallback".
 * @param noscan - If true, only searches by `id_mapel`. If false, searches by `id_ujian` or `id_referrer`.
 * @returns An object containing the success status, a message, and the mapel data if found.
 *
 * @throws Will log an error message if the retrieval process fails.
 */
export async function getMapelById(
    id: number,
    level: MapelLevelType = "fallback",
    noscan: boolean = false
) {
    try {
        let dbClient = getDbClient(level)

        const whereClause: Prisma.mapelWhereInput = noscan
            ? { id_mapel: id }
            : { OR: [{ id_ujian: id }, { id_referrer: id }] }

        // Check if the mapel exists in the current database client (level)
        const isExist = await dbClient.mapel.findFirst({
            where: whereClause,
        })

        // If the mapel does not exist in the current level, use the fallback database client
        if (!isExist) {
            dbClient = getDbClient("fallback")
        }

        const mapel = await dbClient.mapel.findFirst({
            where: whereClause,
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
            soal: await transformSoalData(mapel.soal as soal[]),
        }

        return {
            success: true,
            message: "Success",
            data: data,
        }
    } catch (error) {
        console.error(`Error getting mapel by id: ${error}`)
    }
}
