import { db } from "@/libs/database"
import { MapelIdType, MapelType } from "@/types/mapel"
import { soal } from "@prisma/client"

export async function getMapel(type: MapelType, limit = 25, page = 1, search = "") {
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
    }));
};

const getMapelByCriteria = async (criteria: object) => {
    try {
        const mapel = await db.mapel.findFirst({
            where: criteria,
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
        });

        if (!mapel) {
            return {
                success: false,
                message: "Data not found",
            };
        }

        const data = {
            id_mapel: mapel.id_mapel,
            nama: mapel.nama,
            soal: transformSoalData(mapel.soal as soal[]),
        };

        return {
            success: true,
            message: "Success",
            data,
        };
    } catch (e: unknown) {
        console.error(`Error getting mapel: ${e}`);
        return {
            success: false,
            message: "An error occurred",
        };
    }
};

export const getMapelById = (id: number, type: MapelIdType = "id") => {
    switch (type) {
        case "id":
            return getMapelByCriteria({ id_mapel: id });
        case "id_ujian":
            return getMapelByCriteria({ id_ujian: id });
        case "id_referrer":
            return getMapelByCriteria({ id_referrer: id });
        default:
            break;
    }
};
