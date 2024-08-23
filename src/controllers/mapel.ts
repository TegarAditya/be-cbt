import { db } from "@/libs/database"

export async function getMapel(type: "cbt" | "pts" | "pas" | "all" = "all") {
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
                },
            },
            select: {
                id_mapel: true,
                nama: true,
            },
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

export async function getMapelById(id: number) {
    try {
        const mapel = await db.mapel.findUnique({
            where: {
                id_mapel: id,
            },
            select: {
                id_mapel: true,
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

        return {
            success: true,
            message: "Success",
            data: mapel,
        }
    } catch (e: unknown) {
        console.error(`Error getting mapel: ${e}`)
    }
}
