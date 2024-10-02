import { Elysia } from "elysia"
import { getMapel, getMapelById } from "@/handlers/mapel"
import {
    getMapelByIdParamsValidation,
    getMapelByIdQueryValidation,
    listAllMapelQueryValidation,
} from "@/validations/mapel"
import { detailMapelResponse, listMapelResponse } from "@/docs/mapel"
import { MapelIdType, MapelType } from "@/types/mapel"

const ApiRoutes = new Elysia({ prefix: "/mapel" })
    .get(
        "/",
        (req) => {
            const { type, limit, page, search } = req.query
            return getMapel(
                type as MapelType,
                limit as number,
                page as number,
                search as string
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
            const { type } = query
            const data = await getMapelById(id, type as MapelIdType)
            set.status = data?.success ? 200 : 404
            return data
        },
        {
            query: getMapelByIdQueryValidation,
            params: getMapelByIdParamsValidation,
            detail: {
                summary: "Detail Mapel",
                description: "Detail of mapel by id, id_ujian, or id_referrer",
                tags: ["Mapel"],
                responses: detailMapelResponse,
            },
        }
    )

export default ApiRoutes
