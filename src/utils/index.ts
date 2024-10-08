import { SubjectEnum } from "@/enums/subject"
import { db, dbSd, dbSma, dbSmp } from "@/libs/database"
import { MapelLevelType, MapelType } from "@/types/mapel"
import { PrismaClient, soal } from "@prisma/client"

/** UTILITY FUNCTIONS */

/**
 * Decodes a string containing Unicode escape sequences (e.g., \uXXXX) into their corresponding characters.
 *
 * @param str - The string containing Unicode escape sequences to decode.
 * @returns The decoded string with Unicode escape sequences replaced by their corresponding characters.
 */
export const decodeUnicode = (str: string): string => {
    return str.replace(/\\u([0-9A-Fa-f]{4})/g, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16))
    })
}

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
    }))
}

/**
 * Returns the appropriate prefix for mapel based on the type.
 * @param type - The type of mapel ("cbt", "pts", "pas", "all").
 * @returns A string representing the prefix.
 */
export const getMapelPrefix = (type: MapelType): string => {
    const options = {
        cbt: "CBT",
        pts: "PTS",
        pas: "PAS",
        all: "",
    }
    return options[type] || ""
}

/**
 * Returns the appropriate Prisma database client based on the education level.
 * @param level - The level of education ("sd", "smp", "sma", "fallback").
 * @returns The corresponding PrismaClient instance.
 */
export const getDbClient = (level: MapelLevelType): PrismaClient => {
    const dbClients = {
        sd: dbSd,
        smp: dbSmp,
        sma: dbSma,
        fallback: db,
    }
    return dbClients[level] || db
}

/**
 * Retrieves an array of string keys from the `SubjectEnum` object.
 * Filters out any keys that are numeric.
 *
 * @returns {string[]} An array of string keys from the `SubjectEnum`.
 */
export const getSubjectEnumArray = (): string[] => {
    return Object.keys(SubjectEnum).filter((key) => isNaN(Number(key)))
}
