import { SubjectEnum } from "@/enums/subject"
import { db, dbSd, dbSma, dbSmp } from "@/libs/database"
import { MapelLevelType, MapelType } from "@/types/mapel"
import { PrismaClient, soal } from "@prisma/client"

/** UTILITY FUNCTIONS */

/**
 * Decodes a given string by converting Unicode sequences and common HTML entities
 * to their respective characters.
 *
 * @param str - The string to decode.
 * @returns The decoded string.
 *
 * @example
 * ```typescript
 * const encodedStr = "Hello &amp; welcome to the world of \\u003CTypeScript\\u003E!";
 * const decodedStr = decodeString(encodedStr);
 * console.log(decodedStr); // "Hello & welcome to the world of <TypeScript>!"
 * ```
 */
async function decodeString(str: string): Promise<string> {
    if (!str) return ""

    const decodedStr = str.replace(/\\u([0-9A-Fa-f]{4})/g, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16))
    })

    return decodedStr
}

async function replaceImageWithBase64(htmlString: string): Promise<string> {
    const urlRegex = /<img.*?src="(.*?)"/
    const match = htmlString.match(urlRegex)
    if (!match || !match[1]) {
        return htmlString
    }

    const imageUrl = match[1] // The URL of the image

    const base64Image = await convertImageToBase64(imageUrl)

    const updatedHtmlString = htmlString.replace(imageUrl, base64Image)

    return updatedHtmlString
}

async function convertImageToBase64(url: string): Promise<string> {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString("base64")
    const mimeType = response.headers.get("Content-Type") || "image/png"
    return `data:${mimeType};base64,${base64Image}`
}

/**
 * Transforms an array of `soal` objects by mapping each item to a new structure.
 *
 * @param soal - An array of `soal` objects to be transformed.
 * @returns A Promise that resolves to an array of transformed `soal` objects.
 */
export const transformSoalData = async (soal: soal[]): Promise<any[]> => {
    const transformedSoal = []

    // Use for...of loop to handle async/await properly
    for (const item of soal) {
        transformedSoal.push({
            nomor: item.nomor,
            soal: await decodeString(item.soal as string),
            jawaban: `pil${await decodeString(item.jawaban as string)}`,
            pembahasan: await decodeString(item.pembahasan as string),
            pilA: await decodeString(item.pilA as string),
            pilB: await decodeString(item.pilB as string),
            pilC: await decodeString(item.pilC as string),
            pilD: await decodeString(item.pilD as string),
            pilE: await decodeString(item.pilE as string),
            file: await decodeString(item.file as string),
            file1: await decodeString(item.file1 as string),
            fileA: await decodeString(item.fileA as string),
            fileB: await decodeString(item.fileB as string),
            fileC: await decodeString(item.fileC as string),
            fileD: await decodeString(item.fileD as string),
            fileE: await decodeString(item.fileE as string),
        })
    }

    return transformedSoal
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
