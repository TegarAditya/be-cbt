import { Elysia } from "elysia"
import { getMapel, getMapelById } from "@/controllers/mapel"
import { getMapelByIdParamsValidation, listAllMapelQueryValidation } from "@/validations/mapel"
import { detailMapelResponse, listMapelQuery, listMapelResponse } from "@/docs/mapel"

const ApiRoutes = new Elysia({ prefix: "/mapel" })
    .get(
        "/",
        (req) => {
            const { type } = req.query
            return getMapel(type as "cbt" | "pts" | "pas" | "all")
        },
        {
            query: listAllMapelQueryValidation,
            detail: {
                summary: "List Mapel",
                tags: ["Mapel"],
                parameters: listMapelQuery,
                responses: listMapelResponse,
            },
        }
    )
    .get(
        "/:id",
        (req) => {
            const { id } = req.params
            return getMapelById(id)
        },
        {
            params: getMapelByIdParamsValidation,
            detail: {
                summary: "Detail Mapel",
                tags: ["Mapel"],
                responses: detailMapelResponse,
            },
        }
    )

export default ApiRoutes
