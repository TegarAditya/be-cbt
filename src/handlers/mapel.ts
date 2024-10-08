import { getEnumValues, SubjectType } from "@/enums/subject"
import { db } from "@/libs/database"
import { MapelLevelType, MapelType } from "@/types/mapel"
import { getDbClient, getMapelPrefix, transformSoalData } from "@/utils"
import { Prisma, soal } from "@prisma/client"

/** HANDLER FUNCTIONS */

export async function getMapelSubjectByKelas(kelas: number) {
    try {
        const isSD = kelas <= 6
        const isSMP = kelas > 6 && kelas <= 9
        const isSMA = kelas > 9

        const subjectList = () => {
            if (isSD) {
                //
            } else if (isSMP) {
                //
            } else if (isSMA) {
                //
            }
        }
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
 */
export async function getMapel(
    type: MapelType,
    limit: number = 25,
    page: number = 1,
    search: string = "",
    mapel: SubjectType | "" = "",
    kelas: number | null = null
) {
    try {
        const whereClause: Prisma.mapelWhereInput = {
            nama: {
                startsWith: getMapelPrefix(type),
                contains: search,
            },
        }

        if (mapel) {
            const mapelValues = getEnumValues(mapel)

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

        if (kelas) {
            whereClause.AND = {
                nama: {
                    contains: `${kelas}-`,
                },
            }
        }

        const mapelRecords = await db.mapel.findMany({
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
 * Retrieves a mapel (subject) based on the provided ID and type.
 *
 * @param id - The ID of the mapel to retrieve.
 * @param level - The education level for which to fetch the mapel. Defaults to "fallback".
 * @returns The mapel that matches the provided criteria.
 */
export async function getMapelById(
    id: number,
    level: MapelLevelType = "fallback"
) {
    try {
        const dbClient = getDbClient(level)

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
            data: data,
        }
    } catch (error) {
        console.error(`Error getting mapel by id: ${error}`)
    }
}
