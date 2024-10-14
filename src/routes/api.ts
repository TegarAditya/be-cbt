import { Elysia } from "elysia"
import {
    getMapelById,
    getMapelCombined,
    getMapelSubjectByKelas,
} from "@/handlers/mapel"
import {
    getMapelByIdParamsValidation,
    getMapelByIdQueryValidation,
    listAllMapelQueryValidation,
    listMapelSubjectByKelasQueryValidation,
} from "@/validations/mapel"
import { detailMapelResponse, listMapelResponse } from "@/docs/mapel"
import { MapelLevelType, MapelType } from "@/types/mapel"
import { SubjectType } from "@/enums/subject"

const ApiRoutes = new Elysia({ prefix: "/mapel" })
    .get(
        "/",
        ({ query }) => {
            const { type, limit, page, search, mapel, kelas, level } = query
            return getMapelCombined(
                type as MapelType,
                limit as number,
                page as number,
                search as string,
                mapel as SubjectType,
                kelas as number,
                level as MapelLevelType
            )
        },
        {
            query: listAllMapelQueryValidation,
            detail: {
                summary: "List Mapel",
                description: "List of mapel",
                tags: ["Mapel"],
                responses: listMapelResponse,
            },
        }
    )
    .get(
        "/lists",
        async ({ query }) => {
            const { type, kelas, level } = query
            return await getMapelSubjectByKelas(
                type as MapelType,
                kelas as number,
                level as MapelLevelType
            )
        },
        {
            query: listMapelSubjectByKelasQueryValidation,
            tags: ["Mapel"],
            detail: {
                summary: "List Mapel by Kelas",
                description: "List of mapel by kelas",
            },
        }
    )
    .get(
        "/:id",
        async ({ params, set, query }) => {
            const { id } = params
            const { level, noscan } = query
            const data = await getMapelById(id, level as MapelLevelType, noscan)
            set.status = data?.success ? 200 : 404
            return data
        },
        {
            params: getMapelByIdParamsValidation,
            query: getMapelByIdQueryValidation,
            detail: {
                summary: "Detail Mapel",
                description: "Detail of mapel by ID and level",
                tags: ["Mapel"],
                responses: detailMapelResponse,
            },
        }
    )

export default ApiRoutes
