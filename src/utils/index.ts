import { PrismaClient, soal } from "@prisma/client";

/** UTILITY FUNCTIONS */

/**
 * Decodes a string containing Unicode escape sequences (e.g., \uXXXX) into their corresponding characters.
 *
 * @param str - The string containing Unicode escape sequences to decode.
 * @returns The decoded string with Unicode escape sequences replaced by their corresponding characters.
 */
export const decodeUnicode = (str: string): string => {
    return str.replace(/\\u([0-9A-Fa-f]{4})/g, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
    });
};

/**
 * Transforms an array of `soal` objects by mapping each item to a new structure.
 *
 * @param soal - An array of `soal` objects to be transformed.
 * @returns An array of transformed `soal` objects with specific properties.
 */
export const transformSoalData = (soal: soal[]) => {
    return soal.map((item) => ({
        nomor: item.nomor,
        soal: decodeUnicode(item.soal as string),
        jawaban: `pil${decodeUnicode(item.jawaban as string)}`,
        pembahasan: decodeUnicode(item.pembahasan as string),
        pilA: decodeUnicode(item.pilA as string),
        pilB: decodeUnicode(item.pilB as string),
        pilC: decodeUnicode(item.pilC as string),
        pilD: decodeUnicode(item.pilD as string),
        pilE: decodeUnicode(item.pilE as string),
        file: decodeUnicode(item.file as string),
        file1: decodeUnicode(item.file1 as string),
        fileA: decodeUnicode(item.fileA as string),
        fileB: decodeUnicode(item.fileB as string),
        fileC: decodeUnicode(item.fileC as string),
        fileD: decodeUnicode(item.fileD as string),
        fileE: decodeUnicode(item.fileE as string),
    }));
};

/**
 * Retrieves a mapel (subject) based on the provided criteria.
 *
 * @param id - The ID of the mapel to retrieve.
 * @param dbClient - The PrismaClient instance for the database.
 * @returns A promise that resolves to an object containing the success status, message, and optionally the mapel data.
 *
 * @throws Will throw an error if the database query fails.
 */
export const fetchMapelByCriteria = async (id: number, dbClient: PrismaClient) => {
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
            data: data,
        }
    } catch (error) {
        console.error(`Error getting mapel: ${error}`)
        return {
            success: false,
            message: "An error occurred",
        }
    }
}