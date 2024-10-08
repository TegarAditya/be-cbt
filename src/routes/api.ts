import { Elysia } from "elysia"
import { getMapel, getMapelById } from "@/handlers/mapel"
import {
    getMapelByIdParamsValidation,
    getMapelByIdQueryValidation,
    listAllMapelQueryValidation,
} from "@/validations/mapel"
import { detailMapelResponse, listMapelResponse } from "@/docs/mapel"
import { MapelLevelType, MapelType } from "@/types/mapel"
import { SubjectType } from "@/enums/subject"

const ApiRoutes = new Elysia({ prefix: "/mapel" })
    .get(
        "/",
        ({ query }) => {
            const { type, limit, page, search, mapel, kelas, level } = query
            return getMapel(
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
        "/:id",
        async ({ params, set, query }) => {
            const { id } = params
            const { level } = query
            const data = await getMapelById(id, level as MapelLevelType)
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
